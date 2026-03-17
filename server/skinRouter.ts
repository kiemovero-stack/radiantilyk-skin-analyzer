import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import { getDb } from "./db";
import { skinAnalyses } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { buildSystemPrompt, SKIN_ANALYSIS_OUTPUT_SCHEMA } from "./skinPrompt";
import type { SkinAnalysisReport } from "../shared/types";
import { generateReportPdf } from "./pdfReport";
import { sendReportEmail } from "./emailService";

export const skinRouter = router({
  /**
   * Analyze skin photos using AI vision.
   * Accepts 1-3 images (front required, left/right optional).
   * Uploads all to S3, sends to AI together, saves report.
   */
  analyze: protectedProcedure
    .input(
      z.object({
        patientFirstName: z.string().min(1, "First name is required"),
        patientLastName: z.string().min(1, "Last name is required"),
        patientEmail: z.string().email("Valid email is required"),
        patientDob: z.string().min(1, "Date of birth is required"),
        images: z.array(
          z.object({
            base64: z.string().min(1),
            mimeType: z.string().default("image/jpeg"),
            angle: z.enum(["front", "left", "right"]),
          })
        ).min(1).max(3),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { images, patientFirstName, patientLastName, patientEmail, patientDob } = input;

      // 1. Upload all images to S3 and build image content for AI
      const imageUrls: string[] = [];
      const imageContents: Array<{
        type: "image_url";
        image_url: { url: string; detail: "high" | "low" | "auto" };
      }> = [];

      for (const img of images) {
        const buffer = Buffer.from(img.base64, "base64");
        const ext = img.mimeType.includes("png") ? "png" : "jpg";
        const key = `skin-photos/${Date.now()}-${img.angle}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { url } = await storagePut(key, buffer, img.mimeType);
        imageUrls.push(url);

        // Use S3 URL instead of base64 data URI to reduce payload size and latency
        // Front view gets "high" detail, side views get "low" to speed up analysis
        imageContents.push({
          type: "image_url",
          image_url: {
            url,
            detail: img.angle === "front" ? "high" : "low",
          },
        });
      }

      // 2. Build the user message with angle labels and all images
      const angleLabels = images.map((img) => img.angle).join(", ");
      const userContent: Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string; detail: "high" | "low" | "auto" } }
      > = [
        {
          type: "text",
          text: `Analyze these ${images.length} skin photo(s) (angles: ${angleLabels}) comprehensively. Provide a complete skin analysis report following the exact output structure. Be thorough, specific, and avoid generic language. Every treatment recommendation must come from the clinic's service catalog with exact pricing. Remember: exactly 2 facials, exactly 4 procedures, and 3-5 skincare products.`,
        },
      ];

      // Add each image with an angle label
      for (let i = 0; i < images.length; i++) {
        userContent.push({
          type: "text",
          text: `[${images[i].angle.toUpperCase()} VIEW]`,
        });
        userContent.push(imageContents[i]);
      }

      // 3. Call AI with all images for analysis
      console.log(`[SkinAnalysis] Starting AI analysis with ${images.length} image(s) for patient ${patientFirstName} ${patientLastName}`);
      const startTime = Date.now();

      let result;
      try {
        result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: buildSystemPrompt(),
            },
            {
              role: "user",
              content: userContent,
            },
          ],
          maxTokens: 8192,
          responseFormat: {
            type: "json_schema",
            json_schema: SKIN_ANALYSIS_OUTPUT_SCHEMA,
          },
        });
      } catch (llmError: any) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.error(`[SkinAnalysis] LLM call failed after ${elapsed}s:`, llmError?.message || llmError);
        throw new Error(`AI analysis failed after ${elapsed}s. Please try again.`);
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[SkinAnalysis] AI analysis completed in ${elapsed}s`);

      // 4. Parse the AI response
      const content = result.choices[0]?.message?.content;
      if (!content) {
        console.error("[SkinAnalysis] Empty response from AI. Full result:", JSON.stringify(result).slice(0, 500));
        throw new Error("AI analysis returned empty response. Please try again.");
      }

      let report: SkinAnalysisReport;
      try {
        const text = typeof content === "string"
          ? content
          : (content[0] as { type: "text"; text: string }).text;
        report = JSON.parse(text) as SkinAnalysisReport;
      } catch (e) {
        console.error("[SkinAnalysis] Failed to parse AI response:", typeof content === "string" ? content.slice(0, 500) : JSON.stringify(content).slice(0, 500));
        throw new Error("Failed to parse AI analysis response. Please try again.");
      }

      // 5. Save to database (store the front image URL as primary)
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const userId = ctx.user.id;
      const primaryImageUrl = imageUrls[0];

      const insertResult = await db.insert(skinAnalyses).values({
        userId,
        patientFirstName,
        patientLastName,
        patientEmail,
        patientDob,
        imageUrl: primaryImageUrl,
        report: report,
        skinHealthScore: report.skinHealthScore,
        skinType: report.skinType,
      });

      const insertId = insertResult[0].insertId;

      return {
        id: insertId,
        report,
      };
    }),

  /**
   * Get a single report by ID.
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

    const results = await db
      .select()
      .from(skinAnalyses)
      .where(eq(skinAnalyses.userId, ctx.user.id))
      .orderBy(desc(skinAnalyses.createdAt))
      .limit(50);

    return results;
  }),
});
