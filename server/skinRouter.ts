import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";
import { skinAnalyses } from "../drizzle/schema";
import { eq, desc, and, inArray, or } from "drizzle-orm";
import { buildSystemPrompt, SKIN_ANALYSIS_OUTPUT_SCHEMA } from "./skinPrompt";
import type { SkinAnalysisReport } from "../shared/types";
import { generateReportPdf } from "./pdfReport";
import { sendReportEmail } from "./emailService";
import { generateTreatmentSimulations } from "./simulationService";
import { recoverTruncatedJson } from "./jsonRecovery";

/**
 * Generate ONE combined simulation image in the background AFTER the analysis is completed.
 * This is non-blocking — the staff sees their report immediately.
 */
async function generateSimulationsInBackground(
  analysisId: number,
  frontImageUrl: string,
  fitzpatrickType: number,
  procedures: Array<{ name: string; reason: string; targetConditions: string[] }>
) {
  try {
    const procedureNames = procedures.map((p) => p.name).join(", ");
    console.log(`[SkinAnalysis] Starting combined simulation for record ${analysisId} (${procedures.length} procedures: ${procedureNames})`);

    const simulations = await generateTreatmentSimulations(
      analysisId,
      frontImageUrl,
      fitzpatrickType,
      procedures
    );

    if (simulations.size > 0) {
      const simMap: Record<string, string> = {};
      simulations.forEach((url, name) => { simMap[name] = url; });

      const db = await getDb();
      if (db) {
        await db
          .update(skinAnalyses)
          .set({ simulationImages: simMap })
          .where(eq(skinAnalyses.id, analysisId));

        console.log(`[SkinAnalysis] Combined simulation image saved for record ${analysisId}`);
      }
    } else {
      console.log(`[SkinAnalysis] No simulation image generated for record ${analysisId}`);
    }
  } catch (err: any) {
    console.error(`[SkinAnalysis] Simulation generation failed for record ${analysisId}:`, err?.message);
    // Non-fatal — report is still available without simulation
  }
}

/**
 * Run the AI analysis in the background.
 * Updates the database row when complete or on error.
 */
async function runAnalysisInBackground(
  analysisId: number,
  imageUrls: string[],
  imageAngles: string[],
  concerns?: string[]
) {
  try {
    // Build image content for AI — use S3 URLs directly
    const imageContents: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string; detail: "high" | "low" | "auto" } }
    > = [];

    const angleLabels = imageAngles.join(", ");
    let userText = `Analyze these ${imageUrls.length} skin photo(s) (angles: ${angleLabels}) comprehensively. Provide a complete skin analysis report following the exact output structure. Be thorough, specific, and avoid generic language. Every treatment recommendation must come from the clinic's service catalog with exact pricing. Remember: at least 3 facials, 4-8 procedures (with treatment series stacking when appropriate), and 5-7 skincare products.\n\nSCORING REMINDER: Be STRICT and REALISTIC with the skin health score. Apply age-based baseline deductions. Most adults score 60-70. A score above 80 is uncommon. A score above 90 is extremely rare. Do NOT inflate scores — accuracy and clinical credibility are paramount. Use the TWO-PASS CLINICAL ANALYSIS PROTOCOL. Show your full step-by-step calculation.`;

    if (concerns && concerns.length > 0) {
      userText += `\n\n⚠️ MANDATORY — PATIENT CONCERNS (selected by patient/staff):\n${concerns.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\nYou MUST address EVERY concern listed above. For each concern, either:\n(a) CONFIRM it as a detected condition with severity and location\n(b) ACKNOWLEDGE it as subtle/mild if barely visible\n(c) EXPLICITLY rule it out in your scoreJustification with evidence\n\nFailing to address ANY of these concerns is an ACCURACY FAILURE. These are what the patient is worried about — ignoring them destroys trust and clinical credibility.`;
    }

    imageContents.push({
      type: "text",
      text: userText,
    });

    for (let i = 0; i < imageUrls.length; i++) {
      imageContents.push({
        type: "text",
        text: `[${imageAngles[i].toUpperCase()} VIEW]`,
      });
      imageContents.push({
        type: "image_url",
        image_url: {
          url: imageUrls[i],
          detail: "high",
        },
      });
    }

    console.log(`[SkinAnalysis] Background: Starting AI analysis for record ${analysisId} with ${imageUrls.length} image(s)`);
    const startTime = Date.now();

    const messages = [
      { role: "system" as const, content: buildSystemPrompt() },
      { role: "user" as const, content: imageContents },
    ];

    // Try with 16384 tokens first, retry with 32768 if truncated
    const TOKEN_LIMITS = [16384, 32768];
    let report: SkinAnalysisReport | null = null;

    for (const tokenLimit of TOKEN_LIMITS) {
      const result = await invokeLLM({
        messages,
        maxTokens: tokenLimit,
        responseFormat: {
          type: "json_schema",
          json_schema: SKIN_ANALYSIS_OUTPUT_SCHEMA,
        },
      });

      const finishReason = result.choices[0]?.finish_reason;
      const content = result.choices[0]?.message?.content;

      if (!content) {
        throw new Error("AI analysis returned empty response");
      }

      const text = typeof content === "string"
        ? content
        : (content[0] as { type: "text"; text: string }).text;

      // Check if response was truncated
      if (finishReason === "length") {
        console.warn(`[SkinAnalysis] Response truncated at ${tokenLimit} tokens for record ${analysisId} (finish_reason=length). ${tokenLimit < TOKEN_LIMITS[TOKEN_LIMITS.length - 1] ? "Retrying with higher limit..." : "Attempting JSON recovery..."}`);

        // On last attempt, try to recover truncated JSON
        if (tokenLimit === TOKEN_LIMITS[TOKEN_LIMITS.length - 1]) {
          try {
            report = recoverTruncatedJson(text) as SkinAnalysisReport;
            console.log(`[SkinAnalysis] Successfully recovered truncated JSON for record ${analysisId}`);
            break;
          } catch (recoverErr) {
            throw new Error(`AI response truncated at ${tokenLimit} tokens and JSON recovery failed. The analysis prompt may be generating too much content.`);
          }
        }
        continue; // retry with higher limit
      }

      try {
        report = JSON.parse(text) as SkinAnalysisReport;
        break; // success
      } catch (parseErr: any) {
        // Try recovery even on parse errors (sometimes finish_reason is "stop" but JSON is still malformed)
        console.warn(`[SkinAnalysis] JSON parse failed for record ${analysisId}: ${parseErr.message}. Attempting recovery...`);
        try {
          report = recoverTruncatedJson(text) as SkinAnalysisReport;
          console.log(`[SkinAnalysis] Successfully recovered malformed JSON for record ${analysisId}`);
          break;
        } catch (recoverErr) {
          if (tokenLimit < TOKEN_LIMITS[TOKEN_LIMITS.length - 1]) {
            console.warn(`[SkinAnalysis] Recovery failed, retrying with higher token limit...`);
            continue;
          }
          throw parseErr;
        }
      }
    }

    if (!report) {
      throw new Error("AI analysis failed after all retry attempts");
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[SkinAnalysis] Background: AI analysis completed in ${elapsed}s for record ${analysisId}`);

    // Update the database row with the completed report
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db
      .update(skinAnalyses)
      .set({
        report: report,
        skinHealthScore: report.skinHealthScore,
        skinType: report.skinType,
        status: "completed",
      })
      .where(eq(skinAnalyses.id, analysisId));

    console.log(`[SkinAnalysis] Background: Record ${analysisId} updated to completed`);

    // Fire-and-forget: Generate simulation images in background
    const frontImageUrl = imageUrls[0];
    if (frontImageUrl) {
      generateSimulationsInBackground(
        analysisId,
        frontImageUrl,
        report.fitzpatrickType || 3,
        report.skinProcedures || []
      ).catch((err) => {
        console.error(`[SkinAnalysis] Simulation generation failed for record ${analysisId}:`, err?.message);
      });
    }
  } catch (error: any) {
    console.error(`[SkinAnalysis] Background: Analysis failed for record ${analysisId}:`, error?.message || error);

    // Update the database row with the error
    try {
      const db = await getDb();
      if (db) {
        await db
          .update(skinAnalyses)
          .set({
            status: "failed",
            errorMessage: error?.message || "Unknown error during analysis",
          })
          .where(eq(skinAnalyses.id, analysisId));
      }
    } catch (dbError) {
      console.error(`[SkinAnalysis] Background: Failed to update error status for record ${analysisId}:`, dbError);
    }
  }
}

export const skinRouter = router({
  /**
   * Start the AI analysis.
   * Creates a DB record immediately and kicks off analysis in the background.
   * Returns the record ID for polling.
   */
  analyze: protectedProcedure
    .input(
      z.object({
        patientFirstName: z.string().min(1, "First name is required"),
        patientLastName: z.string().min(1, "Last name is required"),
        patientEmail: z.string().email("Valid email is required"),
        patientDob: z.string().min(1, "Date of birth is required"),
        concerns: z.array(z.string()).optional(),
        imageUrls: z.array(
          z.object({
            url: z.string().url(),
            angle: z.enum(["front", "left", "right"]),
          })
        ).min(1).max(3),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { imageUrls, patientFirstName, patientLastName, patientEmail, patientDob, concerns } = input;

      // STRICT IMAGE VALIDATION: NEVER allow analysis without valid, accessible images
      if (!imageUrls || imageUrls.length === 0) {
        throw new Error("At least one photo is required. Cannot run analysis without images.");
      }

      // Verify each image URL is reachable before proceeding
      for (const img of imageUrls) {
        if (!img.url || img.url.trim() === "") {
          throw new Error(`Empty image URL provided for ${img.angle} angle. All photos must be valid.`);
        }
        try {
          const headResp = await fetch(img.url, { method: "HEAD" });
          if (!headResp.ok) {
            throw new Error(`Image for ${img.angle} angle is not accessible (HTTP ${headResp.status}). Please re-upload the photo.`);
          }
          // Verify it's actually an image
          const contentType = headResp.headers.get("content-type") || "";
          if (!contentType.startsWith("image/")) {
            throw new Error(`File for ${img.angle} angle is not a valid image (type: ${contentType}). Please upload a photo.`);
          }
        } catch (fetchErr: any) {
          if (fetchErr.message.includes("angle")) throw fetchErr; // re-throw our own errors
          throw new Error(`Cannot verify image for ${img.angle} angle: ${fetchErr.message}. Please re-upload.`);
        }
      }

      console.log(`[SkinAnalysis] Image validation passed for ${imageUrls.length} image(s)`);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const userId = ctx.user.id;
      const primaryImageUrl = imageUrls[0].url;

      // Create the DB record with status "processing"
      const insertResult = await db.insert(skinAnalyses).values({
        userId,
        patientFirstName,
        patientLastName,
        patientEmail,
        patientDob,
        imageUrl: primaryImageUrl,
        report: {},
        skinHealthScore: 0,
        skinType: "",
        status: "processing",
      });

      const analysisId = insertResult[0].insertId;

      console.log(`[SkinAnalysis] Created record ${analysisId} with status=processing, starting background analysis`);

      // Store concerns in intakeData if provided
      if (concerns && concerns.length > 0) {
        await db
          .update(skinAnalyses)
          .set({ intakeData: { concerns } })
          .where(eq(skinAnalyses.id, analysisId));
      }

      // Start the analysis in the background — don't await it
      const urls = imageUrls.map((img) => img.url);
      const angles = imageUrls.map((img) => img.angle);
      runAnalysisInBackground(analysisId, urls, angles, concerns).catch((err) => {
        console.error(`[SkinAnalysis] Unhandled background error for record ${analysisId}:`, err);
      });

      // Return immediately with the record ID
      return { id: analysisId };
    }),

  /**
   * Poll for analysis status.
   * Returns the current status and report if completed.
   */
  getStatus: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const results = await db
        .select()
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, input.id))
        .limit(1);

      if (results.length === 0) {
        throw new Error("Report not found");
      }

      const record = results[0];
      return {
        id: record.id,
        status: record.status,
        errorMessage: record.errorMessage,
        report: record.status === "completed" ? record.report : null,
        skinHealthScore: record.skinHealthScore,
        skinType: record.skinType,
        patientFirstName: record.patientFirstName,
        patientLastName: record.patientLastName,
        patientEmail: record.patientEmail,
        patientDob: record.patientDob,
        imageUrl: record.imageUrl,
        createdAt: record.createdAt,
      };
    }),

  /**
   * Get a single report by ID (for the full report page).
   */
  getReport: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const results = await db
        .select()
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, input.id))
        .limit(1);

      if (results.length === 0) {
        throw new Error("Report not found");
      }

      return results[0];
    }),

  /**
   * Get simulation images for a report (poll for readiness).
   */
  getSimulations: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const results = await db
        .select({ simulationImages: skinAnalyses.simulationImages })
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, input.id))
        .limit(1);

      if (results.length === 0) {
        throw new Error("Report not found");
      }

      const simImages = results[0].simulationImages;
      const hasImages = simImages && typeof simImages === "object" && Object.keys(simImages).length > 0;

      return {
        ready: hasImages,
        simulationImages: (simImages || {}) as Record<string, string>,
      };
    }),

  /**
   * Generate PDF report and return as base64.
   */
  downloadPdf: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const results = await db
        .select()
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, input.id))
        .limit(1);

      if (results.length === 0) throw new Error("Report not found");

      const analysis = results[0];
      const report = analysis.report as SkinAnalysisReport;

      const pdfBuffer = await generateReportPdf(report, {
        firstName: analysis.patientFirstName,
        lastName: analysis.patientLastName,
        email: analysis.patientEmail,
        dob: analysis.patientDob,
        analysisDate: new Date(analysis.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });

      return {
        base64: pdfBuffer.toString("base64"),
        filename: `SkinAnalysis_${analysis.patientFirstName}_${analysis.patientLastName}_${new Date(analysis.createdAt).toISOString().slice(0, 10)}.pdf`,
      };
    }),

  /**
   * Email the PDF report to the patient.
   */
  emailReport: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const results = await db
        .select()
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, input.id))
        .limit(1);

      if (results.length === 0) throw new Error("Report not found");

      const analysis = results[0];
      const report = analysis.report as SkinAnalysisReport;

      const analysisDate = new Date(analysis.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const pdfBuffer = await generateReportPdf(report, {
        firstName: analysis.patientFirstName,
        lastName: analysis.patientLastName,
        email: analysis.patientEmail,
        dob: analysis.patientDob,
        analysisDate,
      });

      const result = await sendReportEmail({
        toEmail: analysis.patientEmail,
        patientName: `${analysis.patientFirstName} ${analysis.patientLastName}`,
        skinHealthScore: report.skinHealthScore,
        pdfBuffer,
        analysisDate,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to send email");
      }

      return { success: true, messageId: result.messageId };
    }),

  /**
   * List ALL analyses (staff-initiated + client portal), most recent first.
   * Staff users can see all analyses including client self-service ones (userId=0).
   */
  listAnalyses: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const results = await db
      .select()
      .from(skinAnalyses)
      .orderBy(desc(skinAnalyses.createdAt))
      .limit(100);

    return results;
  }),

  /**
   * Re-analyze an existing report using stored photos and the updated prompt.
   * Resets the report to "processing" and re-runs the AI analysis.
   */
  reanalyze: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const results = await db
        .select()
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, input.id))
        .limit(1);

      if (results.length === 0) throw new Error("Report not found");

      const record = results[0];
      const imageUrl = record.imageUrl as string;
      if (!imageUrl) throw new Error("No source image available for re-analysis");

      // Collect image URLs
      const imageUrls: string[] = [imageUrl];
      const imageAngles: string[] = ["front"];

      // Try to find left/right images with same timestamp prefix
      const urlMatch = imageUrl.match(/(\d+)-front-/);
      if (urlMatch) {
        for (const angle of ["left", "right"]) {
          const candidateUrl = imageUrl.replace(/-front-/, `-${angle}-`);
          try {
            const headResp = await fetch(candidateUrl, { method: "HEAD" });
            if (headResp.ok) {
              imageUrls.push(candidateUrl);
              imageAngles.push(angle);
            }
          } catch {
            // Image doesn't exist for this angle
          }
        }
      }

      // Save current score to history before overwriting
      const previousReport = record.report as any;
      const previousScore = record.skinHealthScore;
      const previousConditions = previousReport?.conditions?.map((c: any) => c.name) || [];
      const existingHistory = (record.scoreHistory as any[]) || [];
      const updatedHistory = [
        ...existingHistory,
        {
          score: previousScore,
          conditionCount: previousConditions.length,
          conditions: previousConditions.slice(0, 6),
          analyzedAt: new Date().toISOString(),
        },
      ];

      // Mark as re-processing and save score history
      await db
        .update(skinAnalyses)
        .set({
          status: "processing",
          scoreHistory: updatedHistory,
          simulationImages: null,
          agingImages: null,
        })
        .where(eq(skinAnalyses.id, input.id));

      console.log(`[ReAnalyze-Staff] Starting re-analysis for record ${input.id} with ${imageUrls.length} image(s)`);

      // Run analysis in background
      runAnalysisInBackground(input.id, imageUrls, imageAngles).catch((err) => {
        console.error(`[ReAnalyze-Staff] Error for record ${input.id}:`, err);
      });

      return { status: "processing" };
    }),

  /**
   * Update staff notes for a report.
   */
  updateStaffNotes: protectedProcedure
    .input(z.object({ id: z.number(), notes: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(skinAnalyses)
        .set({ staffNotes: input.notes })
        .where(eq(skinAnalyses.id, input.id));

      return { success: true };
    }),

  /**
   * Delete an analysis record.
   * Staff can delete any record (failed, completed, or processing).
   */
  deleteAnalysis: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify the record exists
      const results = await db
        .select({ id: skinAnalyses.id })
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, input.id))
        .limit(1);

      if (results.length === 0) throw new Error("Analysis not found");

      await db.delete(skinAnalyses).where(eq(skinAnalyses.id, input.id));

      console.log(`[SkinAnalysis] Record ${input.id} deleted by staff`);
      return { success: true };
    }),

  /**
   * Get multiple analyses by IDs for comparison.
   * Only returns completed analyses belonging to the current user.
   */
  getComparisonData: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.number()).min(2).max(5),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const results = await db
        .select()
        .from(skinAnalyses)
        .where(
          inArray(skinAnalyses.id, input.ids)
        )
        .orderBy(skinAnalyses.createdAt);

      // Only return completed analyses
      return results.filter((r) => r.status === "completed");
    }),
});
