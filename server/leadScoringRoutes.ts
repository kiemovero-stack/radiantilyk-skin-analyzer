/**
 * Lead Scoring Dashboard API Routes
 *
 * Staff-facing endpoints (require authentication) for viewing and managing
 * lead scores across all client analyses.
 */
import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { skinAnalyses } from "../drizzle/schema";
import { desc, eq, sql } from "drizzle-orm";
import { calculateLeadScore, buildScoringInput } from "./leadScoringService";
import type { LeadScoreDetails } from "./leadScoringService";

export function registerLeadScoringRoutes(app: Express) {
  /**
   * GET /api/leads
   * Returns all completed analyses with lead scores, sorted by score descending.
   * Query params:
   *   - priority: "hot" | "warm" | "cool" (filter by priority)
   *   - limit: number (default 50)
   *   - offset: number (default 0)
   */
  app.get("/api/leads", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const offset = parseInt(req.query.offset as string) || 0;
      const priorityFilter = req.query.priority as string | undefined;

      // Fetch all completed analyses
      const analyses = await db
        .select()
        .from(skinAnalyses)
        .where(eq(skinAnalyses.status, "completed"))
        .orderBy(desc(skinAnalyses.createdAt))
        .limit(limit + 50) // Fetch extra for filtering
        .offset(offset);

      // Calculate lead scores for each
      const leads = analyses.map((record) => {
        const scoringInput = buildScoringInput({
          skinHealthScore: record.skinHealthScore,
          report: record.report,
          patientEmail: record.patientEmail,
          patientPhone: record.patientPhone,
          patientDob: record.patientDob,
          imageUrl: record.imageUrl,
          intakeData: record.intakeData,
        });

        // Enrich with referral code presence
        // We check the leadScore field if it was pre-calculated
        const existingScore = record.leadScore as LeadScoreDetails | null;

        const score = calculateLeadScore(scoringInput);

        return {
          id: record.id,
          patientFirstName: record.patientFirstName,
          patientLastName: record.patientLastName,
          patientEmail: record.patientEmail,
          patientPhone: record.patientPhone,
          patientDob: record.patientDob,
          skinHealthScore: record.skinHealthScore,
          skinType: record.skinType,
          createdAt: record.createdAt,
          leadScore: score,
          reportSummary: {
            conditionCount: ((record.report as any)?.conditions || []).length,
            procedureCount: ((record.report as any)?.skinProcedures || []).length,
            scarTreatmentCount: ((record.report as any)?.scarTreatments || []).length,
            topConcerns: ((record.report as any)?.conditions || []).slice(0, 3).map((c: any) => c.name),
            topTreatments: ((record.report as any)?.skinProcedures || []).slice(0, 3).map((p: any) => p.name),
          },
          hasSimulation: !!(record.simulationImages && Object.keys(record.simulationImages as object).length > 0),
          hasAgingImages: !!(record.agingImages && Object.keys(record.agingImages as object).length > 0),
          contactedAt: record.contactedAt ? record.contactedAt.toISOString() : null,
          contactNotes: record.contactNotes,
          contactMethod: record.contactMethod,
          intakeData: record.intakeData,
          concerns: ((record.report as any)?.conditions || []).map((c: any) => c.name),
        };
      });

      // Filter by priority if requested
      const filtered = priorityFilter
        ? leads.filter((l) => l.leadScore.priority === priorityFilter)
        : leads;

      // Sort by score descending
      filtered.sort((a, b) => b.leadScore.totalPoints - a.leadScore.totalPoints);

      // Apply limit
      const paginated = filtered.slice(0, limit);

      // Summary stats
      const allScored = leads;
      const contacted = allScored.filter((l) => l.contactedAt).length;
      const totalEstRevLow = allScored.reduce((sum, l) => sum + l.leadScore.estimatedRevenue.low, 0);
      const totalEstRevHigh = allScored.reduce((sum, l) => sum + l.leadScore.estimatedRevenue.high, 0);
      const avgBookingProb = allScored.length > 0
        ? Math.round(allScored.reduce((sum, l) => sum + l.leadScore.bookingProbability, 0) / allScored.length)
        : 0;
      const stats = {
        total: allScored.length,
        hot: allScored.filter((l) => l.leadScore.priority === "hot").length,
        warm: allScored.filter((l) => l.leadScore.priority === "warm").length,
        cool: allScored.filter((l) => l.leadScore.priority === "cool").length,
        contacted,
        avgScore: allScored.length > 0
          ? Math.round(allScored.reduce((sum, l) => sum + l.leadScore.totalPoints, 0) / allScored.length)
          : 0,
        avgStars: allScored.length > 0
          ? (allScored.reduce((sum, l) => sum + l.leadScore.stars, 0) / allScored.length).toFixed(1)
          : "0",
        avgBookingProbability: avgBookingProb,
        estimatedPipelineRevenue: { low: totalEstRevLow, high: totalEstRevHigh },
        platinum: allScored.filter((l) => l.leadScore.clientTier === "platinum").length,
        gold: allScored.filter((l) => l.leadScore.clientTier === "gold").length,
        silver: allScored.filter((l) => l.leadScore.clientTier === "silver").length,
        bronze: allScored.filter((l) => l.leadScore.clientTier === "bronze").length,
      };

      res.json({
        leads: paginated,
        stats,
        pagination: {
          limit,
          offset,
          hasMore: filtered.length > limit,
        },
      });
    } catch (error: any) {
      console.error("[LeadScoring] Error fetching leads:", error?.message);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  /**
   * GET /api/leads/:id
   * Returns detailed lead score for a specific analysis.
   */
  app.get("/api/leads/:id", async (req: Request, res: Response) => {
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
        res.status(404).json({ error: "Analysis not found" });
        return;
      }

      const record = results[0];
      const scoringInput = buildScoringInput({
        skinHealthScore: record.skinHealthScore,
        report: record.report,
        patientEmail: record.patientEmail,
        patientPhone: record.patientPhone,
        patientDob: record.patientDob,
        imageUrl: record.imageUrl,
        intakeData: record.intakeData,
      });

      const score = calculateLeadScore(scoringInput);

      res.json({
        id: record.id,
        patientFirstName: record.patientFirstName,
        patientLastName: record.patientLastName,
        patientEmail: record.patientEmail,
        patientPhone: record.patientPhone,
        skinHealthScore: record.skinHealthScore,
        createdAt: record.createdAt,
        leadScore: score,
      });
    } catch (error: any) {
      console.error("[LeadScoring] Error fetching lead detail:", error?.message);
      res.status(500).json({ error: "Failed to fetch lead details" });
    }
  });

  /**
   * PATCH /api/leads/:id/contact
   * Mark a lead as contacted with optional notes and method.
   */
  app.patch("/api/leads/:id/contact", async (req: Request, res: Response) => {
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

      const { notes, method } = req.body || {};

      await db
        .update(skinAnalyses)
        .set({
          contactedAt: new Date(),
          contactNotes: notes || null,
          contactMethod: method || null,
        })
        .where(eq(skinAnalyses.id, id));

      console.log(`[LeadScoring] Marked lead ${id} as contacted (method: ${method || "none"})`);

      res.json({ success: true, contactedAt: new Date().toISOString() });
    } catch (error: any) {
      console.error("[LeadScoring] Error marking contact:", error?.message);
      res.status(500).json({ error: "Failed to mark as contacted" });
    }
  });

  /**
   * PATCH /api/leads/:id/contact/undo
   * Undo the contacted status for a lead.
   */
  app.patch("/api/leads/:id/contact/undo", async (req: Request, res: Response) => {
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

      await db
        .update(skinAnalyses)
        .set({
          contactedAt: null,
          contactNotes: null,
          contactMethod: null,
        })
        .where(eq(skinAnalyses.id, id));

      console.log(`[LeadScoring] Undid contact status for lead ${id}`);

      res.json({ success: true });
    } catch (error: any) {
      console.error("[LeadScoring] Error undoing contact:", error?.message);
      res.status(500).json({ error: "Failed to undo contact status" });
    }
  });

  /**
   * GET /api/leads/stats/summary
   * Returns aggregate lead scoring statistics for the dashboard header.
   */
  app.get("/api/leads/stats/summary", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      // Count total completed analyses
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(skinAnalyses)
        .where(eq(skinAnalyses.status, "completed"));

      const totalCount = countResult[0]?.count || 0;

      // Get recent analyses for scoring
      const recent = await db
        .select()
        .from(skinAnalyses)
        .where(eq(skinAnalyses.status, "completed"))
        .orderBy(desc(skinAnalyses.createdAt))
        .limit(100);

      const scores = recent.map((r) => {
        const input = buildScoringInput({
          skinHealthScore: r.skinHealthScore,
          report: r.report,
          patientEmail: r.patientEmail,
          patientPhone: r.patientPhone,
          patientDob: r.patientDob,
          imageUrl: r.imageUrl,
          intakeData: r.intakeData,
        });
        return calculateLeadScore(input);
      });

      res.json({
        totalLeads: totalCount,
        hot: scores.filter((s) => s.priority === "hot").length,
        warm: scores.filter((s) => s.priority === "warm").length,
        cool: scores.filter((s) => s.priority === "cool").length,
        avgStars: scores.length > 0
          ? (scores.reduce((sum, s) => sum + s.stars, 0) / scores.length).toFixed(1)
          : "0",
        avgPoints: scores.length > 0
          ? Math.round(scores.reduce((sum, s) => sum + s.totalPoints, 0) / scores.length)
          : 0,
      });
    } catch (error: any) {
      console.error("[LeadScoring] Stats error:", error?.message);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });
}
