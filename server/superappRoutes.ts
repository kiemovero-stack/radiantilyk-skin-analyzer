/**
 * Super-App API Routes
 *
 * - AI Chat Concierge (OpenAI-powered)
 * - Wallet System (prepaid credits with bonus)
 * - Flash Deals
 * - Home screen data aggregation
 */
import { Router, Request, Response } from "express";
import { getDb } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import {
  wallets, walletTransactions, flashDeals,
  rewardsMembers, bookingAppointments,
} from "../drizzle/schema";
import Stripe from "stripe";

const router = Router();

// ─── Service & Pricing Knowledge Base ───
const SERVICE_KNOWLEDGE = `
You are the AI Beauty Concierge for RadiantilyK Aesthetic, a premium med spa with locations in San Jose and San Mateo, California.

SERVICES & PRICING:
- Botox/Tox: $11-13/unit. Typical areas: forehead (10-30 units), crow's feet (12-24 units), frown lines (15-30 units), jawline slimming (40-60 units)
- Dermal Fillers: $550-800/syringe. Lips, cheeks, jawline, under-eye, chin
- Facials: $80-250. Hydrafacial, chemical peels, microneedling, LED therapy
- Laser treatments: $200-500/session. IPL, laser hair removal, skin resurfacing
- IV Therapy: $150-300. Glutathione, vitamin C, NAD+, beauty drip
- PRP/PRF: $400-600. Hair restoration, facial rejuvenation, under-eye
- Body contouring: $300-800/session. CoolSculpting, RF skin tightening
- Scar treatment: $200-500/session. Microneedling, laser, PRP

FINANCING: Cherry and Affirm financing available. 0% APR options.
BOOKING: Appointments in 30-minute increments. Available at San Jose and San Mateo locations.
REWARDS: Earn 1 point per $1 spent. Tiers: Glow, Radiant, Luminous, Icon.
SKINCARE PRODUCTS: Full line at rkaskin.co. Korean skincare, medical-grade products.

GUIDELINES:
- Be warm, friendly, and knowledgeable
- Always recommend booking when appropriate
- Suggest specific treatments based on concerns
- Mention financing options for expensive treatments
- Never diagnose medical conditions
- If unsure, recommend an in-person consultation
- Keep responses concise (2-3 sentences max unless detailed info requested)
- Use a conversational, luxury spa tone
`;

// ─── AI Chat Concierge ───
router.post("/api/chat/concierge", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: "I'm being set up right now! In the meantime, feel free to book directly or call us.",
      });
    }

    // Dynamic import to avoid TS issues with openai module
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });

    const msgs: any[] = [
      { role: "system", content: SERVICE_KNOWLEDGE },
      ...(history || []).slice(-8),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: msgs,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "I'd love to help! Could you tell me more about what you're looking for?";
    res.json({ reply });
  } catch (error: any) {
    console.error("[Chat] Error:", error.message);
    res.json({
      reply: "I'm having a moment! Feel free to book directly or call us — we're always happy to help in person.",
    });
  }
});

// ─── Wallet: Get Balance ───
router.get("/api/wallet/balance", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Login required" });

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database unavailable" });

    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.clientId, userId))
      .limit(1);

    if (!wallet) {
      await db.insert(wallets).values({ clientId: userId, balance: 0 });
      return res.json({ balance: 0 });
    }

    res.json({ balance: wallet.balance });
  } catch (error: any) {
    console.error("[Wallet] Error:", error.message);
    res.status(500).json({ error: "Failed to get wallet balance" });
  }
});

// ─── Wallet: Add Funds (with bonus) ───
router.post("/api/wallet/add-funds", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Login required" });

    const { amount } = req.body;
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount < 50) {
      return res.status(400).json({ error: "Minimum $50 to add funds" });
    }

    // Bonus tiers: $500 → +$50, $1000 → +$100, $2000 → +$250
    let bonus = 0;
    if (numAmount >= 2000) bonus = 250;
    else if (numAmount >= 1000) bonus = 100;
    else if (numAmount >= 500) bonus = 50;

    const totalCredit = numAmount + bonus;

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) return res.status(500).json({ error: "Payment not configured" });

    const stripe = new Stripe(stripeKey);
    const origin = req.headers.origin || "https://rkaskinai.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Wallet Top-Up: $${numAmount}${bonus > 0 ? ` + $${bonus} Bonus` : ""}`,
              description: `Add $${totalCredit.toFixed(2)} to your RadiantilyK wallet`,
            },
            unit_amount: Math.round(numAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "wallet_topup",
        user_id: userId.toString(),
        amount: numAmount.toString(),
        bonus: bonus.toString(),
        total_credit: totalCredit.toString(),
      },
      success_url: `${origin}/profile?wallet=success`,
      cancel_url: `${origin}/profile?wallet=cancelled`,
    });

    res.json({ checkoutUrl: session.url, bonus, totalCredit });
  } catch (error: any) {
    console.error("[Wallet] Add funds error:", error.message);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// ─── Wallet: Transaction History ───
router.get("/api/wallet/transactions", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: "Login required" });

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database unavailable" });

    // First get the wallet to find walletId
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.clientId, userId))
      .limit(1);

    if (!wallet) return res.json({ transactions: [] });

    const txns = await db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.walletId, wallet.id))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(50);

    res.json({ transactions: txns });
  } catch (error: any) {
    console.error("[Wallet] Transactions error:", error.message);
    res.status(500).json({ error: "Failed to get transactions" });
  }
});

// ─── Flash Deals ───
router.get("/api/deals/active", async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) return res.json({ deals: [] });

    const now = new Date();
    const deals = await db
      .select()
      .from(flashDeals)
      .where(
        and(
          eq(flashDeals.isActive, 1),
          lte(flashDeals.startsAt, now),
          gte(flashDeals.endsAt, now)
        )
      )
      .orderBy(flashDeals.endsAt);

    res.json({ deals });
  } catch (error: any) {
    console.error("[Deals] Error:", error.message);
    res.json({ deals: [] });
  }
});

// ─── Home Screen Data Aggregation ───
router.get("/api/home/data", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const db = await getDb();

    let deals: any[] = [];
    let walletBalance = 0;
    let rewardsPoints = 0;
    let rewardsTier = "Glow";
    let nextAppointment = null;

    if (db) {
      // Get active flash deals
      const now = new Date();
      deals = await db
        .select()
        .from(flashDeals)
        .where(
          and(
            eq(flashDeals.isActive, 1),
            lte(flashDeals.startsAt, now),
            gte(flashDeals.endsAt, now)
          )
        )
        .orderBy(flashDeals.endsAt)
        .limit(3);

      if (userId) {
        // Get wallet
        const [wallet] = await db
          .select()
          .from(wallets)
          .where(eq(wallets.clientId, userId))
          .limit(1);
        if (wallet) walletBalance = wallet.balance;

        // Get rewards
        const [member] = await db
          .select()
          .from(rewardsMembers)
          .where(eq(rewardsMembers.email, String(userId)))
          .limit(1);
        if (member) {
          rewardsPoints = member.points;
          rewardsTier = member.tier;
        }

        // Get next appointment
        const todayStr = now.toISOString().split("T")[0];
        const [appt] = await db
          .select()
          .from(bookingAppointments)
          .where(
            and(
              eq(bookingAppointments.clientId, userId),
              eq(bookingAppointments.status, "confirmed"),
              gte(bookingAppointments.appointmentDate, todayStr)
            )
          )
          .orderBy(bookingAppointments.appointmentDate)
          .limit(1);
        if (appt) nextAppointment = appt;
      }
    }

    res.json({ deals, walletBalance, rewardsPoints, rewardsTier, nextAppointment });
  } catch (error: any) {
    console.error("[Home] Data error:", error.message);
    res.json({
      deals: [],
      walletBalance: 0,
      rewardsPoints: 0,
      rewardsTier: "Glow",
      nextAppointment: null,
    });
  }
});

// ─── Products API (from catalog) ───
router.get("/api/products", async (_req: Request, res: Response) => {
  try {
    const { PRODUCT_CATALOG, BUNDLE_DEALS } = await import("../shared/productCatalog");
    res.json({ categories: PRODUCT_CATALOG, bundles: BUNDLE_DEALS });
  } catch (error: any) {
    console.error("[Products] Error:", error.message);
    res.status(500).json({ error: "Failed to load products" });
  }
});

import type { Express } from "express";

export function registerSuperappRoutes(app: Express) {
  app.use(router);
}
