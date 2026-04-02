import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";
import { skinAnalyses } from "../drizzle/schema";
import { eq, desc, and, inArray } from "drizzle-orm";
import { buildSystemPrompt, SKIN_ANALYSIS_OUTPUT_SCHEMA } from "./skinPrompt";
import type { SkinAnalysisReport } from "../shared/types";
import { generateReportPdf } from "./pdfReport";
import { sendReportEmail } from "./emailService";

/**
 * Run the AI analysis in the background.
 * Updates the database row when complete or on error.
 */
async function runAnalysisInBackground(
  analysisId: number,
  imageUrls: string[],
  imageAngles: string[]
) {
  try {
    // Build image content for AI — use S3 URLs directly
    const imageContents: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string; detail: "high" | "low" | "auto" } }
    > = [];

    const angleLabels = imageAngles.join(", ");
    imageContents.push({
      type: "text",
      text: `Analyze these ${imageUrls.length} skin photo(s) (angles: ${angleLabels}) comprehensively. Provide a complete skin analysis report following the exact output structure. Be thorough, specific, and avoid generic language. Every treatment recommendation must come from the clinic's service catalog with exact pricing. Remember: exactly 2 facials, exactly 4 procedures, and 3-5 skincare products.`,
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
          detail: imageAngles[i] === "front" ? "high" : "low",
        },
      });
    }

    console.log(`[SkinAnalysis] Background: Starting AI analysis for record ${analysisId} with ${imageUrls.length} image(s)`);
    const startTime = Date.now();

    const result = await invokeLLM({
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: imageContents },
      ],
      maxTokens: 8192,
      responseFormat: {
        type: "json_schema",
        json_schema: SKIN_ANALYSIS_OUTPUT_SCHEMA,
      },
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[SkinAnalysis] Background: AI analysis completed in ${elapsed}s for record ${analysisId}`);

    // Parse the AI response
    const content = result.choices[0]?.message?.content;
    if (!content) {
      throw new Error("AI analysis returned empty response");
    }

    let report: SkinAnalysisReport;
    const text = typeof content === "string"
      ? content
      : (content[0] as { type: "text"; text: string }).text;
    report = JSON.parse(text) as SkinAnalysisReport;

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
        imageUrls: z.array(
          z.object({
            url: z.string().url(),
            angle: z.enum(["front", "left", "right"]),
          })
        ).min(1).max(3),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { imageUrls, patientFirstName, patientLastName, patientEmail, patientDob } = input;

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

      // Start the analysis in the background — don't await it
      const urls = imageUrls.map((img) => img.url);
      const angles = imageUrls.map((img) => img.angle);
      runAnalysisInBackground(analysisId, urls, angles).catch((err) => {
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
   * List all analyses for the current user, most recent first.
   */
  listAnalyses: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Staff can see their own analyses AND all client portal analyses (userId=0)
    const results = await db
      .select()
      .from(skinAnalyses)
      .orderBy(desc(skinAnalyses.createdAt))
      .limit(100);

    return results;
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
          and(
            inArray(skinAnalyses.id, input.ids)
          )
        )
        .orderBy(skinAnalyses.createdAt);

      // Only return completed analyses
      return results.filter((r) => r.status === "completed");
    }),
});
