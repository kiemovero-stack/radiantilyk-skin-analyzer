/**
 * Referral Program & Seasonal Promotion API Routes.
 *
 * Public (no auth required) endpoints:
 *   POST /api/referral/create          — Generate a referral code after analysis
 *   GET  /api/referral/lookup/:code    — Look up a referral code (for landing page)
 *   POST /api/referral/redeem          — Record a referral redemption
 *   GET  /api/referral/stats/:code     — Get referral stats for the referrer
 *   GET  /api/promotions/active        — Get the currently active seasonal promotion
 *
 * Admin (auth required) endpoints via tRPC are in skinRouter.
 */
import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { referralCodes, referralRedemptions } from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import crypto from "crypto";

/**
 * Generate a short, memorable referral code like "RK-ABC123".
 */
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1 to avoid confusion
  let code = "RK-";
  for (let i = 0; i < 6; i++) {
    code += chars[crypto.randomInt(chars.length)];
  }
  return code;
}

/**
 * In-memory seasonal promotions.
 * The admin can swap these out easily — in a future version this could be DB-driven.
 */
export interface SeasonalPromotion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  badgeText?: string;
  /** Gradient CSS for the banner background */
  gradient: string;
  /** Accent color for CTA button */
  accentColor: string;
  /** Optional icon emoji or image URL */
  icon?: string;
  /** ISO date strings for when the promo is active */
  startDate: string;
  endDate: string;
  active: boolean;
}

/**
 * Default seasonal promotions — easily swappable.
 * To change the promotion, just edit this array.
 */
export const SEASONAL_PROMOTIONS: SeasonalPromotion[] = [
  {
    id: "spring-2026",
    title: "Spring Skin Renewal",
    subtitle: "CO2 Laser + Free Post-Procedure Kit",
    description:
      "Refresh your skin this spring with our most powerful resurfacing treatment. Book a CO2 Laser session and receive a complimentary MOV Cellular Repair Kit ($89 value) to accelerate your recovery.",
    ctaText: "Book Your Spring Renewal",
    ctaUrl: "https://rkaemr.click/portal",
    badgeText: "Limited Time",
    gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    accentColor: "emerald",
    icon: "🌸",
    startDate: "2026-03-01",
    endDate: "2026-05-31",
    active: true,
  },
  {
    id: "summer-2026",
    title: "Summer Glow Package",
    subtitle: "IPL + HydraFacial Series — Save $200",
    description:
      "Get photo-ready skin for summer. Our IPL + HydraFacial combo package targets sun damage, uneven tone, and dehydration in one powerful series.",
    ctaText: "Claim Your Summer Glow",
    ctaUrl: "https://rkaemr.click/portal",
    badgeText: "Save $200",
    gradient: "from-amber-500/20 via-orange-500/10 to-yellow-500/20",
    accentColor: "amber",
    icon: "☀️",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    active: false,
  },
  {
    id: "fall-2026",
    title: "Fall Rejuvenation Special",
    subtitle: "RF Microneedling Series — 4 for the Price of 3",
    description:
      "Fall is the perfect time for skin renewal. Start your RF Microneedling series now and get your 4th session free. Rebuild collagen and smooth texture before the holidays.",
    ctaText: "Start Your Series",
    ctaUrl: "https://rkaemr.click/portal",
    badgeText: "Buy 3 Get 1 Free",
    gradient: "from-orange-500/20 via-red-500/10 to-amber-500/20",
    accentColor: "orange",
    icon: "🍂",
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    active: false,
  },
];

export function registerReferralRoutes(app: Express) {
  // ── Create Referral Code ──────────────────────────────────────────
  app.post("/api/referral/create", async (req: Request, res: Response) => {
    try {
      const { referrerName, referrerEmail, analysisId } = req.body;

      if (!referrerName || !referrerEmail || !analysisId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      // Check if a code already exists for this analysis
      const existing = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.analysisId, analysisId))
        .limit(1);

      if (existing.length > 0) {
        res.json({
          code: existing[0].code,
          discountPercent: existing[0].discountPercent,
          timesUsed: existing[0].timesUsed,
          alreadyExists: true,
        });
        return;
      }

      // Generate unique code
      let code = generateReferralCode();
      let attempts = 0;
      while (attempts < 10) {
        const dup = await db
          .select()
          .from(referralCodes)
          .where(eq(referralCodes.code, code))
          .limit(1);
        if (dup.length === 0) break;
        code = generateReferralCode();
        attempts++;
      }

      await db.insert(referralCodes).values({
        code,
        referrerName,
        referrerEmail,
        analysisId,
        discountPercent: 15,
        timesUsed: 0,
      });

      console.log(`[Referral] Created code ${code} for ${referrerEmail}`);

      res.json({
        code,
        discountPercent: 15,
        timesUsed: 0,
        alreadyExists: false,
      });
    } catch (error: any) {
      console.error("[Referral] Create error:", error?.message);
      res.status(500).json({ error: "Failed to create referral code" });
    }
  });

  // ── Lookup Referral Code ──────────────────────────────────────────
  app.get("/api/referral/lookup/:code", async (req: Request, res: Response) => {
    try {
      const code = req.params.code.toUpperCase().trim();

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const results = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.code, code))
        .limit(1);

      if (results.length === 0) {
        res.status(404).json({ error: "Invalid referral code" });
        return;
      }

      const ref = results[0];
      res.json({
        valid: true,
        code: ref.code,
        referrerName: ref.referrerName,
        discountPercent: ref.discountPercent,
      });
    } catch (error: any) {
      console.error("[Referral] Lookup error:", error?.message);
      res.status(500).json({ error: "Failed to look up referral code" });
    }
  });

  // ── Redeem Referral Code ──────────────────────────────────────────
  app.post("/api/referral/redeem", async (req: Request, res: Response) => {
    try {
      const { code, referredName, referredEmail, referredAnalysisId } = req.body;

      if (!code || !referredName || !referredEmail || !referredAnalysisId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const codeResults = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.code, code.toUpperCase().trim()))
        .limit(1);

      if (codeResults.length === 0) {
        res.status(404).json({ error: "Invalid referral code" });
        return;
      }

      const referral = codeResults[0];

      // Record the redemption
      await db.insert(referralRedemptions).values({
        referralCodeId: referral.id,
        referredName,
        referredEmail,
        referredAnalysisId,
      });

      // Increment usage count
      await db
        .update(referralCodes)
        .set({ timesUsed: sql`${referralCodes.timesUsed} + 1` })
        .where(eq(referralCodes.id, referral.id));

      console.log(`[Referral] Code ${code} redeemed by ${referredEmail}`);

      res.json({
        success: true,
        discountPercent: referral.discountPercent,
        referrerName: referral.referrerName,
      });
    } catch (error: any) {
      console.error("[Referral] Redeem error:", error?.message);
      res.status(500).json({ error: "Failed to redeem referral code" });
    }
  });

  // ── Referral Stats ────────────────────────────────────────────────
  app.get("/api/referral/stats/:code", async (req: Request, res: Response) => {
    try {
      const code = req.params.code.toUpperCase().trim();

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const results = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.code, code))
        .limit(1);

      if (results.length === 0) {
        res.status(404).json({ error: "Invalid referral code" });
        return;
      }

      const ref = results[0];

      // Get all redemptions for this code
      const redemptions = await db
        .select({
          referredName: referralRedemptions.referredName,
          createdAt: referralRedemptions.createdAt,
        })
        .from(referralRedemptions)
        .where(eq(referralRedemptions.referralCodeId, ref.id));

      res.json({
        code: ref.code,
        referrerName: ref.referrerName,
        discountPercent: ref.discountPercent,
        timesUsed: ref.timesUsed,
        redemptions: redemptions.map((r) => ({
          name: r.referredName,
          date: r.createdAt,
        })),
      });
    } catch (error: any) {
      console.error("[Referral] Stats error:", error?.message);
      res.status(500).json({ error: "Failed to get referral stats" });
    }
  });

  // ── Active Seasonal Promotion ─────────────────────────────────────
  app.get("/api/promotions/active", (_req: Request, res: Response) => {
    const now = new Date();
    const activePromo = SEASONAL_PROMOTIONS.find((p) => {
      if (!p.active) return false;
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return now >= start && now <= end;
    });

    if (activePromo) {
      res.json({ promotion: activePromo });
    } else {
      // Return the first active promo regardless of date as fallback
      const fallback = SEASONAL_PROMOTIONS.find((p) => p.active);
      res.json({ promotion: fallback || null });
    }
  });

  // ── All Promotions (for admin) ────────────────────────────────────
  app.get("/api/promotions/all", (_req: Request, res: Response) => {
    res.json({ promotions: SEASONAL_PROMOTIONS });
  });
}
