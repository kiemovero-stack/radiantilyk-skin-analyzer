/**
 * Rewards API routes — handles member enrollment, points lookup, earning, and redemption.
 *
 * Public endpoints:
 *   GET  /api/rewards/member?email=...  — Look up member points & history
 *   POST /api/rewards/enroll            — Enroll a new member (50pt welcome bonus)
 *   POST /api/rewards/earn              — Award points to a member
 *   POST /api/rewards/redeem            — Redeem points for a reward
 */
import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { rewardsMembers, rewardsTransactions } from "../drizzle/schema";
import { eq, desc, like, sql } from "drizzle-orm";

/* ── Tier thresholds ── */
function computeTier(lifetimePoints: number): "Glow" | "Radiant" | "Luminous" | "Icon" {
  if (lifetimePoints >= 3000) return "Icon";
  if (lifetimePoints >= 1500) return "Luminous";
  if (lifetimePoints >= 500) return "Radiant";
  return "Glow";
}

export function registerRewardsRoutes(app: Express) {

  /* ── GET /api/rewards/member?email=... ── */
  app.get("/api/rewards/member", async (req: Request, res: Response) => {
    const email = (req.query.email as string || "").toLowerCase().trim();
    if (!email) return res.status(400).json({ error: "Email required" });

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const [member] = await db
        .select()
        .from(rewardsMembers)
        .where(eq(rewardsMembers.email, email))
        .limit(1);

      if (!member) return res.status(404).json({ error: "not_found" });

      const history = await db
        .select()
        .from(rewardsTransactions)
        .where(eq(rewardsTransactions.memberId, member.id))
        .orderBy(desc(rewardsTransactions.createdAt))
        .limit(20);

      return res.json({
        points: member.points,
        lifetimePoints: member.lifetimePoints,
        tier: member.tier,
        name: member.name,
        email: member.email,
        createdAt: member.createdAt,
        history: history.map((h: typeof rewardsTransactions.$inferSelect) => ({
          action: h.action,
          points: h.type === "earn" ? h.points : -h.points,
          description: h.description,
          date: h.createdAt,
        })),
      });
    } catch (err) {
      console.error("[Rewards] Error fetching member:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /* ── POST /api/rewards/enroll ── */
  app.post("/api/rewards/enroll", async (req: Request, res: Response) => {
    const email = (req.body.email as string || "").toLowerCase().trim();
    const name = req.body.name as string || undefined;
    if (!email) return res.status(400).json({ error: "Email required" });

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      // Check if already enrolled
      const [existing] = await db
        .select()
        .from(rewardsMembers)
        .where(eq(rewardsMembers.email, email))
        .limit(1);

      if (existing) {
        // Return existing member data
        const history = await db
          .select()
          .from(rewardsTransactions)
          .where(eq(rewardsTransactions.memberId, existing.id))
          .orderBy(desc(rewardsTransactions.createdAt))
          .limit(20);

        return res.json({
          points: existing.points,
          lifetimePoints: existing.lifetimePoints,
          tier: existing.tier,
          name: existing.name,
          email: existing.email,
          createdAt: existing.createdAt,
          history: history.map((h: typeof rewardsTransactions.$inferSelect) => ({
            action: h.action,
            points: h.type === "earn" ? h.points : -h.points,
            description: h.description,
            date: h.createdAt,
          })),
        });
      }

      // Enroll with welcome bonus
      const WELCOME_BONUS = 50;
      const [result] = await db.insert(rewardsMembers).values({
        email,
        name: name || null,
        points: WELCOME_BONUS,
        lifetimePoints: WELCOME_BONUS,
        tier: "Glow",
      });

      const memberId = result.insertId;

      await db.insert(rewardsTransactions).values({
        memberId,
        type: "earn",
        points: WELCOME_BONUS,
        action: "Welcome Bonus",
        description: "Welcome to RadiantilyK Rewards! 🌟",
      });

      return res.status(201).json({
        points: WELCOME_BONUS,
        lifetimePoints: WELCOME_BONUS,
        tier: "Glow",
        name: name || null,
        email,
        createdAt: new Date(),
        history: [
          {
            action: "Welcome Bonus",
            points: WELCOME_BONUS,
            description: "Welcome to RadiantilyK Rewards!",
            date: new Date(),
          },
        ],
      });
    } catch (err) {
      console.error("[Rewards] Error enrolling member:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /* ── POST /api/rewards/earn ── */
  app.post("/api/rewards/earn", async (req: Request, res: Response) => {
    const email = (req.body.email as string || "").toLowerCase().trim();
    const points = parseInt(req.body.points) || 0;
    const action = req.body.action as string || "Manual";
    const description = req.body.description as string || "";
    const referenceId = req.body.referenceId as string || undefined;

    if (!email || points <= 0) {
      return res.status(400).json({ error: "Valid email and positive points required" });
    }

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const [member] = await db
        .select()
        .from(rewardsMembers)
        .where(eq(rewardsMembers.email, email))
        .limit(1);

      if (!member) return res.status(404).json({ error: "Member not found. Enroll first." });

      const newPoints = member.points + points;
      const newLifetime = member.lifetimePoints + points;
      const newTier = computeTier(newLifetime);

      await db
        .update(rewardsMembers)
        .set({ points: newPoints, lifetimePoints: newLifetime, tier: newTier })
        .where(eq(rewardsMembers.id, member.id));

      await db.insert(rewardsTransactions).values({
        memberId: member.id,
        type: "earn",
        points,
        action,
        description,
        referenceId: referenceId || null,
      });

      return res.json({
        points: newPoints,
        lifetimePoints: newLifetime,
        tier: newTier,
        earned: points,
      });
    } catch (err) {
      console.error("[Rewards] Error earning points:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /* ── GET /api/rewards/admin/members — Staff: list all members ── */
  app.get("/api/rewards/admin/members", async (req: Request, res: Response) => {
    const search = (req.query.search as string || "").toLowerCase().trim();
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 25, 100);
    const offset = (page - 1) * limit;

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      let query = db.select().from(rewardsMembers);
      let countQuery = db.select({ count: sql<number>`count(*)` }).from(rewardsMembers);

      if (search) {
        const pattern = `%${search}%`;
        query = query.where(
          sql`LOWER(${rewardsMembers.email}) LIKE ${pattern} OR LOWER(${rewardsMembers.name}) LIKE ${pattern}`
        ) as any;
        countQuery = countQuery.where(
          sql`LOWER(${rewardsMembers.email}) LIKE ${pattern} OR LOWER(${rewardsMembers.name}) LIKE ${pattern}`
        ) as any;
      }

      const members = await (query as any)
        .orderBy(desc(rewardsMembers.lifetimePoints))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await countQuery;

      return res.json({
        members: members.map((m: any) => ({
          id: m.id,
          email: m.email,
          name: m.name,
          points: m.points,
          lifetimePoints: m.lifetimePoints,
          tier: m.tier,
          createdAt: m.createdAt,
        })),
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      });
    } catch (err) {
      console.error("[Rewards Admin] Error listing members:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /* ── POST /api/rewards/admin/award — Staff: award points to a member ── */
  app.post("/api/rewards/admin/award", async (req: Request, res: Response) => {
    const email = (req.body.email as string || "").toLowerCase().trim();
    const points = parseInt(req.body.points) || 0;
    const action = req.body.action as string || "Staff Award";
    const description = req.body.description as string || "Points awarded by staff";

    if (!email || points === 0) {
      return res.status(400).json({ error: "Valid email and non-zero points required" });
    }

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const [member] = await db
        .select()
        .from(rewardsMembers)
        .where(eq(rewardsMembers.email, email))
        .limit(1);

      if (!member) return res.status(404).json({ error: "Member not found" });

      const isDeduction = points < 0;
      const absPoints = Math.abs(points);

      if (isDeduction && member.points < absPoints) {
        return res.status(400).json({ error: "Cannot deduct more points than available", available: member.points });
      }

      const newPoints = member.points + points;
      const newLifetime = isDeduction ? member.lifetimePoints : member.lifetimePoints + points;
      const newTier = computeTier(newLifetime);

      await db
        .update(rewardsMembers)
        .set({ points: newPoints, lifetimePoints: newLifetime, tier: newTier })
        .where(eq(rewardsMembers.id, member.id));

      await db.insert(rewardsTransactions).values({
        memberId: member.id,
        type: isDeduction ? "redeem" : "earn",
        points: absPoints,
        action,
        description,
      });

      return res.json({
        points: newPoints,
        lifetimePoints: newLifetime,
        tier: newTier,
        adjusted: points,
        name: member.name,
        email: member.email,
      });
    } catch (err) {
      console.error("[Rewards Admin] Error awarding points:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /* ── GET /api/rewards/admin/member/:email/history — Staff: view member history ── */
  app.get("/api/rewards/admin/member/:email/history", async (req: Request, res: Response) => {
    const email = (req.params.email || "").toLowerCase().trim();
    if (!email) return res.status(400).json({ error: "Email required" });

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const [member] = await db
        .select()
        .from(rewardsMembers)
        .where(eq(rewardsMembers.email, email))
        .limit(1);

      if (!member) return res.status(404).json({ error: "Member not found" });

      const history = await db
        .select()
        .from(rewardsTransactions)
        .where(eq(rewardsTransactions.memberId, member.id))
        .orderBy(desc(rewardsTransactions.createdAt))
        .limit(50);

      return res.json({
        member: {
          id: member.id,
          email: member.email,
          name: member.name,
          points: member.points,
          lifetimePoints: member.lifetimePoints,
          tier: member.tier,
          createdAt: member.createdAt,
        },
        history: history.map((h: any) => ({
          action: h.action,
          points: h.type === "earn" ? h.points : -h.points,
          type: h.type,
          description: h.description,
          date: h.createdAt,
        })),
      });
    } catch (err) {
      console.error("[Rewards Admin] Error fetching member history:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /* ── POST /api/rewards/redeem ── */
  app.post("/api/rewards/redeem", async (req: Request, res: Response) => {
    const email = (req.body.email as string || "").toLowerCase().trim();
    const points = parseInt(req.body.points) || 0;
    const rewardName = req.body.rewardName as string || "Reward";

    if (!email || points <= 0) {
      return res.status(400).json({ error: "Valid email and positive points required" });
    }

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const [member] = await db
        .select()
        .from(rewardsMembers)
        .where(eq(rewardsMembers.email, email))
        .limit(1);

      if (!member) return res.status(404).json({ error: "Member not found" });
      if (member.points < points) {
        return res.status(400).json({ error: "Insufficient points", available: member.points });
      }

      const newPoints = member.points - points;

      await db
        .update(rewardsMembers)
        .set({ points: newPoints })
        .where(eq(rewardsMembers.id, member.id));

      await db.insert(rewardsTransactions).values({
        memberId: member.id,
        type: "redeem",
        points,
        action: rewardName,
        description: `Redeemed ${points} points for ${rewardName}`,
      });

      return res.json({
        points: newPoints,
        redeemed: points,
        reward: rewardName,
      });
    } catch (err) {
      console.error("[Rewards] Error redeeming points:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}
