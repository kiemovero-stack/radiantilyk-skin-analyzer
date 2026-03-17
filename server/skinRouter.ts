import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import { getDb } from "./db";
import { skinAnalyses } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { SKIN_ANALYSIS_SYSTEM_PROMPT, SKIN_ANALYSIS_OUTPUT_SCHEMA } from "./skinPrompt";
import type { SkinAnalysisReport } from "../shared/types";

export const skinRouter = router({
  /**
   * Analyze a skin photo using AI vision.
   * Accepts base64 image, uploads to S3, sends to AI, saves report.
   */
  analyze: publicProcedure
    .input(
      z.object({
        imageBase64: z.string().min(1),
        imageMimeType: z.string().default("image/jpeg"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { imageBase64, imageMimeType } = input;

      // 1. Upload image to S3
      const buffer = Buffer.from(imageBase64, "base64");
      const ext = imageMimeType.includes("png") ? "png" : "jpg";
      const key = `skin-photos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { url: imageUrl } = await storagePut(key, buffer, imageMimeType);

      // 2. Call AI with the image for analysis
      const result = await invokeLLM({
        messages: [
          {
            role: "system",
            content: SKIN_ANALYSIS_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this skin photo comprehensively. Provide a complete skin analysis report following the exact output structure. Be thorough, specific, and avoid generic language. Every recommendation must be tied to a visible condition. Remember: exactly 2 facials, exactly 4 procedures, and 3-5 skincare products.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${imageMimeType};base64,${imageBase64}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
        responseFormat: {
          type: "json_schema",
          json_schema: SKIN_ANALYSIS_OUTPUT_SCHEMA,
        },
      });

      // 3. Parse the AI response
      const content = result.choices[0]?.message?.content;
      if (!content) {
        throw new Error("AI analysis returned empty response");
      }

      let report: SkinAnalysisReport;
      try {
        const text = typeof content === "string" ? content : (content[0] as { type: "text"; text: string }).text;
        report = JSON.parse(text) as SkinAnalysisReport;
      } catch (e) {
        throw new Error("Failed to parse AI analysis response");
      }

      // 4. Save to database
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const userId = ctx.user?.id ?? 0;

      const insertResult = await db.insert(skinAnalyses).values({
        userId,
        imageUrl,
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
  getReport: publicProcedure
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
