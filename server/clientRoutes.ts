/**
 * Public client-facing Express routes.
 * 
 * These endpoints do NOT require authentication — they are for the
 * public client portal where patients can self-serve their skin analysis.
 * 
 * Routes:
 *   POST /api/client/upload-images  — Multipart image upload (no auth)
 *   POST /api/client/analyze        — Start analysis (no auth)
 *   GET  /api/client/status/:id     — Poll analysis status
 *   GET  /api/client/report/:id     — Get completed report
 *   GET  /api/client/simulations/:id — Poll simulation images
 */
import type { Express, Request, Response } from "express";
import multer from "multer";
import { getDb } from "./db";
import { skinAnalyses } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { buildClientSystemPrompt, CLIENT_ANALYSIS_OUTPUT_SCHEMA } from "./clientPrompt";
import type { SkinAnalysisReport } from "../shared/types";
import { generateReportPdf } from "./pdfReport";
import { sendClientReportEmail } from "./clientEmailService";
import { scheduleFollowUpEmails } from "./followUpService";
import { generateTreatmentSimulations } from "./simulationService";
import { sendStaffNotificationEmail } from "./staffNotificationService";

// Multer for public uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 3,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * Generate ONE combined simulation image in the background AFTER the analysis is completed.
 * This is non-blocking — the client sees their report immediately.
 * The single image shows the combined results of ALL recommended procedures.
 */
async function generateSimulationsInBackground(
  analysisId: number,
  frontImageUrl: string,
  fitzpatrickType: number,
  procedures: Array<{ name: string; reason: string; targetConditions: string[] }>
) {
  try {
    const procedureNames = procedures.map((p) => p.name).join(", ");
    console.log(`[Simulation] Starting combined simulation for record ${analysisId} (${procedures.length} procedures: ${procedureNames})`);
    
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

        console.log(`[Simulation] Combined image saved for record ${analysisId}`);
      }
    } else {
      console.log(`[Simulation] No simulation image generated for record ${analysisId}`);
    }
  } catch (err: any) {
    console.error(`[Simulation] Background generation failed for record ${analysisId}:`, err?.message);
    // Non-fatal — report is still available without simulation
  }
}

/**
 * Run the client AI analysis in the background.
 * Uses the client-specific prompt with layman-friendly language.
 * 
 * FLOW:
 * 1. Run AI analysis → save report → mark "completed" immediately
 * 2. Client sees report right away
 * 3. Simulation images generate in background (non-blocking)
 * 4. Report page polls for simulation images and shows them when ready
 */
async function runClientAnalysisInBackground(
  analysisId: number,
  imageUrls: string[],
  imageAngles: string[],
  concerns: string[]
) {
  try {
    const imageContents: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string; detail: "high" | "low" | "auto" } }
    > = [];

    const concernsText = concerns.length > 0
      ? `\n\nThe client's main concerns are: ${concerns.join(", ")}`
      : "";

    imageContents.push({
      type: "text",
      text: `Analyze these ${imageUrls.length} skin photo(s) (angles: ${imageAngles.join(", ")}) for a client self-assessment.${concernsText}\n\nProvide a complete, easy-to-understand skin analysis. Remember: explain everything in simple language that anyone can understand. Be warm, encouraging, and thorough. Recommend at least 3 facials, 4-8 procedures (with treatment series stacking when appropriate), and 5-7 skincare products from the catalog. Pay special attention to Fitzpatrick skin type when recommending treatments — some treatments are not suitable for all skin types.`,
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

    console.log(`[ClientAnalysis] Starting AI analysis for record ${analysisId} with ${imageUrls.length} image(s)`);
    const startTime = Date.now();

    const result = await invokeLLM({
      messages: [
        { role: "system", content: buildClientSystemPrompt() },
        { role: "user", content: imageContents },
      ],
      maxTokens: 12000,
      responseFormat: {
        type: "json_schema",
        json_schema: CLIENT_ANALYSIS_OUTPUT_SCHEMA,
      },
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[ClientAnalysis] AI analysis completed in ${elapsed}s for record ${analysisId}`);

    const content = result.choices[0]?.message?.content;
    if (!content) throw new Error("AI analysis returned empty response");

    let report: SkinAnalysisReport;
    const text = typeof content === "string"
      ? content
      : (content[0] as { type: "text"; text: string }).text;
    report = JSON.parse(text) as SkinAnalysisReport;

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // ✅ Mark as COMPLETED immediately so the client sees their report right away
    await db
      .update(skinAnalyses)
      .set({
        report: report,
        skinHealthScore: report.skinHealthScore,
        skinType: report.skinType,
        status: "completed",
      })
      .where(eq(skinAnalyses.id, analysisId));

    console.log(`[ClientAnalysis] Record ${analysisId} marked COMPLETED (score: ${report.skinHealthScore})`);

    // 🔥 Fire-and-forget: Generate simulation images in background
    // The client report page will poll for these and show them when ready
    const frontImageUrl = imageUrls[0];
    if (frontImageUrl) {
      generateSimulationsInBackground(
        analysisId,
        frontImageUrl,
        report.fitzpatrickType || 3,
        report.skinProcedures.map((p) => ({
          name: p.name,
          reason: p.reason,
          targetConditions: p.targetConditions,
        }))
      ).catch((err) => {
        console.error(`[Simulation] Unhandled background error:`, err);
      });
    }

    // Send the initial report email to the client (also non-blocking)
    try {
      const records = await db
        .select()
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, analysisId))
        .limit(1);

      if (records.length > 0) {
        const analysis = records[0];
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

        await sendClientReportEmail({
          toEmail: analysis.patientEmail,
          patientName: `${analysis.patientFirstName} ${analysis.patientLastName}`,
          skinHealthScore: report.skinHealthScore,
          pdfBuffer,
          analysisDate,
          reportUrl: `/client/report/${analysisId}`,
        });

        console.log(`[ClientAnalysis] Report email sent to ${analysis.patientEmail}`);

        // Schedule follow-up emails at 24hr and 72hr
        scheduleFollowUpEmails({
          analysisId,
          patientEmail: analysis.patientEmail,
          patientName: `${analysis.patientFirstName} ${analysis.patientLastName}`,
          skinHealthScore: report.skinHealthScore,
          topConcerns: report.conditions.slice(0, 3).map((c) => c.name),
          topTreatment: report.skinProcedures[0]?.name || "a personalized treatment",
        });

        console.log(`[ClientAnalysis] Follow-up emails scheduled for ${analysis.patientEmail}`);

        // 📢 Send staff notification email
        try {
          await sendStaffNotificationEmail({
            patientName: `${analysis.patientFirstName} ${analysis.patientLastName}`,
            patientEmail: analysis.patientEmail,
            skinHealthScore: report.skinHealthScore,
            topConcerns: report.conditions.slice(0, 3).map((c) => c.name),
            topTreatments: report.skinProcedures.slice(0, 3).map((p) => p.name),
            reportUrl: `/client/report/${analysisId}`,
            analysisId,
          });
          console.log(`[ClientAnalysis] Staff notification sent for record ${analysisId}`);
        } catch (staffErr: any) {
          console.error(`[ClientAnalysis] Staff notification error:`, staffErr?.message);
        }

        // 🔔 Send push notification to project owner
        try {
          const score = report.skinHealthScore;
          const concerns = report.conditions.slice(0, 3).map((c: any) => c.name).join(", ");
          const topTx = report.skinProcedures[0]?.name || "a personalized treatment";
          await notifyOwner({
            title: `New Skin Analysis: ${analysis.patientFirstName} ${analysis.patientLastName}`,
            content: `Score: ${score}/100 | Concerns: ${concerns} | Top Recommendation: ${topTx}\n\nView report: /client/report/${analysisId}`,
          });
          console.log(`[ClientAnalysis] Push notification sent for record ${analysisId}`);
        } catch (pushErr: any) {
          console.error(`[ClientAnalysis] Push notification error:`, pushErr?.message);
        }
      }
    } catch (emailErr: any) {
      console.error(`[ClientAnalysis] Email/follow-up error for record ${analysisId}:`, emailErr?.message);
    }
  } catch (error: any) {
    console.error(`[ClientAnalysis] Analysis failed for record ${analysisId}:`, error?.message || error);
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
      console.error(`[ClientAnalysis] Failed to update error status:`, dbError);
    }
  }
}

/**
 * Register all public client routes on the Express app.
 */
export function registerClientRoutes(app: Express) {
  // ── Public Image Upload ────────────────────────────────────────────
  app.post(
    "/api/client/upload-images",
    upload.array("photos", 3),
    async (req: Request, res: Response) => {
      try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
          res.status(400).json({ error: "No files uploaded" });
          return;
        }

        const anglesRaw = req.body.angles;
        let angles: string[];
        if (typeof anglesRaw === "string") {
          angles = anglesRaw.split(",").map((a: string) => a.trim());
        } else if (Array.isArray(anglesRaw)) {
          angles = anglesRaw;
        } else {
          angles = files.map((_, i) => ["front", "left", "right"][i] || "front");
        }

        console.log(`[ClientUpload] Received ${files.length} file(s), sizes: ${files.map((f) => `${(f.size / 1024).toFixed(0)}KB`).join(", ")}`);

        const uploadedImages: { url: string; angle: string }[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const angle = angles[i] || "front";
          const ext = file.mimetype.includes("png") ? "png" : "jpg";
          const key = `client-photos/${Date.now()}-${angle}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

          const { url } = await storagePut(key, file.buffer, file.mimetype);
          uploadedImages.push({ url, angle });
        }

        res.json({ uploadedImages });
      } catch (error: any) {
        console.error("[ClientUpload] Error:", error?.message || error);
        res.status(500).json({ error: error?.message || "Upload failed" });
      }
    }
  );

  // ── Start Analysis ─────────────────────────────────────────────────
  app.post("/api/client/analyze", async (req: Request, res: Response) => {
    try {
      const {
        patientFirstName,
        patientLastName,
        patientEmail,
        patientDob,
        concerns,
        imageUrls,
      } = req.body;

      if (!patientFirstName || !patientEmail || !imageUrls?.length) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      // Use userId = 0 for public client analyses
      const insertResult = await db.insert(skinAnalyses).values({
        userId: 0,
        patientFirstName: patientFirstName || "",
        patientLastName: patientLastName || "",
        patientEmail: patientEmail || "",
        patientDob: patientDob || "",
        imageUrl: imageUrls[0]?.url || "",
        report: {},
        skinHealthScore: 0,
        skinType: "",
        status: "processing",
      });

      const analysisId = insertResult[0].insertId;
      console.log(`[ClientAnalysis] Created record ${analysisId} for ${patientEmail}`);

      const urls = imageUrls.map((img: { url: string }) => img.url);
      const angles = imageUrls.map((img: { angle: string }) => img.angle);

      runClientAnalysisInBackground(analysisId, urls, angles, concerns || []).catch((err) => {
        console.error(`[ClientAnalysis] Unhandled error for record ${analysisId}:`, err);
      });

      res.json({ id: analysisId });
    } catch (error: any) {
      console.error("[ClientAnalysis] Error:", error?.message || error);
      res.status(500).json({ error: error?.message || "Failed to start analysis" });
    }
  });

  // ── Poll Status ────────────────────────────────────────────────────
  app.get("/api/client/status/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const results = await db
        .select()
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, id))
        .limit(1);

      if (results.length === 0) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      const record = results[0];
      res.json({
        id: record.id,
        status: record.status,
        errorMessage: record.errorMessage,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to check status" });
    }
  });

  // ── Get Report ─────────────────────────────────────────────────────
  app.get("/api/client/report/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const results = await db
        .select()
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, id))
        .limit(1);

      if (results.length === 0) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      const record = results[0];
      res.json({
        id: record.id,
        status: record.status,
        report: record.report,
        skinHealthScore: record.skinHealthScore,
        skinType: record.skinType,
        patientFirstName: record.patientFirstName,
        patientLastName: record.patientLastName,
        patientEmail: record.patientEmail,
        imageUrl: record.imageUrl,
        simulationImages: record.simulationImages || {},
        createdAt: record.createdAt,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to get report" });
    }
  });

  // ── Poll Simulation Images ─────────────────────────────────────────
  // The report page polls this endpoint to check if simulation images are ready
  app.get("/api/client/simulations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const results = await db
        .select({ simulationImages: skinAnalyses.simulationImages })
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, id))
        .limit(1);

      if (results.length === 0) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      const simImages = results[0].simulationImages;
      const hasImages = simImages && typeof simImages === "object" && Object.keys(simImages).length > 0;

      res.json({
        ready: hasImages,
        simulationImages: simImages || {},
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to check simulations" });
    }
  });
}
