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
import { skinAnalyses, referralCodes } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { buildClientSystemPrompt, CLIENT_ANALYSIS_OUTPUT_SCHEMA } from "./clientPrompt";
import type { SkinAnalysisReport } from "../shared/types";
import { generateReportPdf } from "./pdfReport";
import { sendClientReportEmail } from "./clientEmailService";
import { scheduleFollowUpEmails, send24HourFollowUp, send72HourFollowUp } from "./followUpService";
import { generateTreatmentSimulations } from "./simulationService";
import { generateAgingSimulations } from "./agingSimulationService";
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
 * Generate Future Aging Self images in the background AFTER the analysis is completed.
 * Creates two images: aged WITHOUT treatment and aged WITH treatment.
 * Non-blocking — the client sees their report immediately.
 */
async function generateAgingInBackground(
  analysisId: number,
  frontImageUrl: string,
  fitzpatrickType: number,
  skinHealthScore: number,
  conditions: string[],
  treatments: string[],
  patientDob?: string
) {
  try {
    console.log(`[AgingSim] Starting aging simulation for record ${analysisId}`);

    const result = await generateAgingSimulations(
      analysisId,
      frontImageUrl,
      fitzpatrickType,
      skinHealthScore,
      conditions,
      treatments,
      patientDob
    );

    if (result.success) {
      const agingData: Record<string, string> = {};
      if (result.withoutTreatmentUrl) agingData.withoutTreatment = result.withoutTreatmentUrl;
      if (result.withTreatmentUrl) agingData.withTreatment = result.withTreatmentUrl;

      const db = await getDb();
      if (db && Object.keys(agingData).length > 0) {
        await db
          .update(skinAnalyses)
          .set({ agingImages: agingData })
          .where(eq(skinAnalyses.id, analysisId));

        console.log(`[AgingSim] Aging images saved for record ${analysisId}`);
      }
    } else {
      console.log(`[AgingSim] No aging images generated for record ${analysisId}: ${result.error}`);
    }
  } catch (err: any) {
    console.error(`[AgingSim] Background generation failed for record ${analysisId}:`, err?.message);
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

    const multiAngleInstructions = imageUrls.length > 1
      ? `\n\nIMPORTANT — MULTI-ANGLE ANALYSIS: You have ${imageUrls.length} photos from different angles (${imageAngles.join(", ")}). You MUST:\n1. Examine EACH photo independently first — note what you see in each angle\n2. Cross-reference findings across angles — conditions confirmed from multiple angles get higher severity\n3. Look for side-view-only findings (jawline laxity, temple hollowing, nasolabial depth, neck lines, scar texture) that the front view cannot show\n4. Check for asymmetry between left and right profiles\n5. In your scoreCalculation, note which angle(s) confirmed each finding\n6. In each condition's detectedInAngles field, specify exactly which photo(s) revealed it`
      : `\n\nNote: Only a single front view was provided. Your analysis is based on this angle only. Some conditions (jawline laxity, temple hollowing, profile structure) cannot be fully assessed without side views.`;

    imageContents.push({
      type: "text",
      text: `Analyze these ${imageUrls.length} skin photo(s) (angles: ${imageAngles.join(", ")}) for a client self-assessment.${concernsText}${multiAngleInstructions}\n\nProvide a complete, easy-to-understand skin analysis. Remember: explain everything in simple language that anyone can understand. Be warm, encouraging, and thorough. Recommend at least 3 facials, 4-8 procedures (with treatment series stacking when appropriate), and 5-7 skincare products from the catalog. Pay special attention to Fitzpatrick skin type when recommending treatments — some treatments are not suitable for all skin types.`,
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
          detail: "high",  // ALL angles at high detail for accurate multi-angle cross-referencing
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

      // 🔮 Fire-and-forget: Generate Future Aging Self images in background
      // Fetch patientDob from DB since it's not in scope here
      (async () => {
        try {
          const dbForDob = await getDb();
          let dob: string | undefined;
          if (dbForDob) {
            const rows = await dbForDob.select({ patientDob: skinAnalyses.patientDob }).from(skinAnalyses).where(eq(skinAnalyses.id, analysisId)).limit(1);
            dob = rows[0]?.patientDob || undefined;
          }
          await generateAgingInBackground(
            analysisId,
            frontImageUrl,
            report.fitzpatrickType || 3,
            report.skinHealthScore,
            report.conditions.map((c: any) => c.name),
            report.skinProcedures.map((p: any) => p.name),
            dob
          );
        } catch (err) {
          console.error(`[AgingSim] Unhandled background error:`, err);
        }
      })();
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

        // Auto-generate referral code for this analysis
        let referralCode: string | undefined;
        try {
          const refResp = await fetch(`http://localhost:${process.env.PORT || 3000}/api/referral/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              referrerName: `${analysis.patientFirstName} ${analysis.patientLastName}`,
              referrerEmail: analysis.patientEmail,
              analysisId,
            }),
          });
          if (refResp.ok) {
            const refData = await refResp.json() as { code: string };
            referralCode = refData.code;
            console.log(`[ClientAnalysis] Auto-generated referral code ${referralCode} for analysis ${analysisId}`);
          }
        } catch (refErr: any) {
          console.error(`[ClientAnalysis] Failed to auto-generate referral code:`, refErr?.message);
        }

        // Schedule follow-up emails at 24hr and 72hr
        scheduleFollowUpEmails({
          analysisId,
          patientEmail: analysis.patientEmail,
          patientName: `${analysis.patientFirstName} ${analysis.patientLastName}`,
          skinHealthScore: report.skinHealthScore,
          topConcerns: report.conditions.slice(0, 3).map((c) => c.name),
          topTreatment: report.skinProcedures[0]?.name || "a personalized treatment",
          scarTreatments: report.scarTreatments && report.scarTreatments.length > 0
            ? report.scarTreatments.map((s: any) => ({
                scarType: s.scarType,
                packageName: s.packageName,
                price: s.price,
                sessions: s.sessions,
                includes: s.includes,
              }))
            : undefined,
          referralCode,
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
        patientPhone,
        patientDob,
        concerns,
        treatmentGoal,
        treatmentExperience,
        budget,
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
        patientPhone: patientPhone || "",
        patientDob: patientDob || "",
        imageUrl: imageUrls[0]?.url || "",
        report: {},
        skinHealthScore: 0,
        skinType: "",
        status: "processing",
        intakeData: {
          concerns: concerns || [],
          treatmentGoal: treatmentGoal || "",
          treatmentExperience: treatmentExperience || "",
          budget: budget || "",
        },
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

      // Look up referral code for this analysis
      let referralCode: string | null = null;
      try {
        const refResults = await db
          .select({ code: referralCodes.code })
          .from(referralCodes)
          .where(eq(referralCodes.analysisId, id))
          .limit(1);
        if (refResults.length > 0) {
          referralCode = refResults[0].code;
        }
      } catch {
        // Non-critical — referral code lookup failure shouldn't break report
      }

      res.json({
        id: record.id,
        status: record.status,
        report: record.report,
        skinHealthScore: record.skinHealthScore,
        skinType: record.skinType,
        patientFirstName: record.patientFirstName,
        patientLastName: record.patientLastName,
        patientEmail: record.patientEmail,
        patientDob: record.patientDob,
        imageUrl: record.imageUrl,
        simulationImages: record.simulationImages || {},
        agingImages: record.agingImages || {},
        beautyScore: (record.report as any)?.beautyScore || null,
        createdAt: record.createdAt,
        referralCode,
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

  // ── Poll Aging Images─────────────────────────────────────────────────────────
  // The report page polls this endpoint to check if aging simulation images are ready
  app.get("/api/client/aging/:id", async (req: Request, res: Response) => {
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
        .select({ agingImages: skinAnalyses.agingImages })
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, id))
        .limit(1);

      if (results.length === 0) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      const agingImgs = results[0].agingImages as Record<string, string> | null;
      const hasImages = agingImgs && typeof agingImgs === "object" && Object.keys(agingImgs).length > 0;

      res.json({
        ready: hasImages,
        agingImages: agingImgs || {},
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to check aging images" });
    }
  });

  // ── Trigger/Retry Aging Simulation ─────────────────────────────────────
  // Allows clients to manually trigger aging simulation from their report page
  app.post("/api/client/aging/:id/generate", async (req: Request, res: Response) => {
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

      // Fetch the analysis record
      const results = await db
        .select({
          imageUrl: skinAnalyses.imageUrl,
          report: skinAnalyses.report,
          patientDob: skinAnalyses.patientDob,
          agingImages: skinAnalyses.agingImages,
          status: skinAnalyses.status,
        })
        .from(skinAnalyses)
        .where(eq(skinAnalyses.id, id))
        .limit(1);

      if (results.length === 0) {
        res.status(404).json({ error: "Analysis not found" });
        return;
      }

      const record = results[0];

      // Check if already has aging images
      const existingAging = record.agingImages as Record<string, string> | null;
      if (existingAging && Object.keys(existingAging).length >= 2) {
        res.json({ status: "already_complete", agingImages: existingAging });
        return;
      }

      if (record.status !== "completed") {
        res.status(400).json({ error: "Analysis not yet completed" });
        return;
      }

      const report = record.report as any;
      const imageUrls = (record.imageUrl as string || "").split(",").map((u: string) => u.trim()).filter(Boolean);
      const frontImageUrl = imageUrls[0];

      if (!frontImageUrl) {
        res.status(400).json({ error: "No source image available" });
        return;
      }

      // Return immediately, generate in background
      res.json({ status: "generating" });

      // Fire-and-forget
      generateAgingInBackground(
        id,
        frontImageUrl,
        report?.fitzpatrickType || 3,
        report?.skinHealthScore || 50,
        (report?.conditions || []).map((c: any) => c.name),
        (report?.skinProcedures || []).map((p: any) => p.name),
        record.patientDob || undefined
      ).catch((err) => {
        console.error(`[AgingSim] Manual trigger failed for ${id}:`, err?.message);
      });
    } catch (error: any) {
      console.error("[AgingSim] Generate endpoint error:", error?.message);
      res.status(500).json({ error: "Failed to trigger aging simulation" });
    }
  });

  // ── Test endpoint: Trigger follow-up email immediately ────────────────  // Only available in development mode
  app.post("/api/test-followup-email", async (req: Request, res: Response) => {
    try {
      const { analysisId, patientEmail, patientName, skinHealthScore, topConcerns, topTreatment, scarTreatments, emailType } = req.body;

      if (!patientEmail || !patientName) {
        res.status(400).json({ error: "Missing required fields: patientEmail, patientName" });
        return;
      }

      const config = {
        analysisId: analysisId || 0,
        patientEmail,
        patientName,
        skinHealthScore: skinHealthScore || 50,
        topConcerns: topConcerns || [],
        topTreatment: topTreatment || "a personalized treatment",
        scarTreatments: scarTreatments || undefined,
      };

      if (emailType === "72hr") {
        await send72HourFollowUp(config);
        res.json({ success: true, message: "72hr follow-up email sent", to: patientEmail });
      } else {
        await send24HourFollowUp(config);
        res.json({ success: true, message: "24hr follow-up email sent", to: patientEmail });
      }
    } catch (error: any) {
      console.error("[TestEmail] Error:", error?.message);
      res.status(500).json({ error: "Failed to send test email", details: error?.message });
    }
  });

  // ── Scar Consultation Intake Form ────────────────────────────────
  app.post("/api/client/scar-consultation", async (req: Request, res: Response) => {
    try {
      const {
        firstName, lastName, email, phone, dob,
        scarType, bodyAreas, duration,
        previousTreatments, contactMethod, additionalNotes, skinTone,
      } = req.body;

      if (!firstName || !lastName || !email || !scarType || !bodyAreas?.length || !duration) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      console.log(`[ScarConsultation] New request from ${firstName} ${lastName} (${email})`);
      console.log(`[ScarConsultation] Scar type: ${scarType}, Areas: ${bodyAreas.join(", ")}, Duration: ${duration}`);

      // Send notification email to staff
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.default.createTransport({
          service: "gmail",
          auth: {
            user: "kV@rkaglow.com",
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">New Scar Consultation Request</h1>
            </div>
            <div style="padding: 24px; background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="color: #1f2937; margin-top: 0;">Patient Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6b7280; width: 140px;">Name:</td><td style="padding: 8px 0; font-weight: 600;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding: 8px 0; color: #6b7280;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>` : ""}
                ${dob ? `<tr><td style="padding: 8px 0; color: #6b7280;">DOB:</td><td style="padding: 8px 0;">${dob}</td></tr>` : ""}
                ${skinTone ? `<tr><td style="padding: 8px 0; color: #6b7280;">Skin Tone:</td><td style="padding: 8px 0;">${skinTone}</td></tr>` : ""}
                <tr><td style="padding: 8px 0; color: #6b7280;">Preferred Contact:</td><td style="padding: 8px 0;">${contactMethod}</td></tr>
              </table>

              <h2 style="color: #1f2937; margin-top: 24px;">Scar Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6b7280; width: 140px;">Scar Type:</td><td style="padding: 8px 0; font-weight: 600;">${scarType}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Location(s):</td><td style="padding: 8px 0;">${bodyAreas.join(", ")}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Duration:</td><td style="padding: 8px 0;">${duration}</td></tr>
                ${previousTreatments?.length ? `<tr><td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Previous Treatments:</td><td style="padding: 8px 0;">${previousTreatments.join(", ")}</td></tr>` : ""}
              </table>

              ${additionalNotes ? `
                <h2 style="color: #1f2937; margin-top: 24px;">Additional Notes</h2>
                <p style="color: #374151; background: #f9fafb; padding: 12px; border-radius: 8px;">${additionalNotes}</p>
              ` : ""}

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <a href="https://rkaemr.click/portal" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Open Booking Portal</a>
              </div>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: '"RadiantilyK Skin Analysis" <kV@rkaglow.com>',
          to: "kiemovero@gmail.com",
          subject: `New Scar Consultation: ${firstName} ${lastName} — ${scarType}`,
          html: emailHtml,
        });

        console.log(`[ScarConsultation] Notification email sent to staff`);
      } catch (emailErr: any) {
        console.error("[ScarConsultation] Failed to send notification email:", emailErr?.message);
        // Don't fail the request if email fails
      }

      // Notify owner via built-in notification
      try {
        await notifyOwner({
          title: "New Scar Consultation Request",
          content: `${firstName} ${lastName} (${email}) submitted a scar consultation request.\nScar Type: ${scarType}\nLocation: ${bodyAreas.join(", ")}\nDuration: ${duration}`,
        });
      } catch {
        // Non-critical
      }

      res.json({ success: true, message: "Consultation request submitted" });
    } catch (error: any) {
      console.error("[ScarConsultation] Error:", error?.message);
      res.status(500).json({ error: "Failed to submit consultation request" });
    }
  });
}
