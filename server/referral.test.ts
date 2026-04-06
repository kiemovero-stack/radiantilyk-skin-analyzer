import { describe, expect, it } from "vitest";
import { SEASONAL_PROMOTIONS } from "./referralRoutes";

describe("Referral Routes Module", () => {
  it("registerReferralRoutes is a function that can be imported", async () => {
    const { registerReferralRoutes } = await import("./referralRoutes");
    expect(typeof registerReferralRoutes).toBe("function");
  });
});

describe("Seasonal Promotions", () => {
  it("has at least 3 seasonal promotions defined", () => {
    expect(SEASONAL_PROMOTIONS.length).toBeGreaterThanOrEqual(3);
  });

  it("spring 2026 promotion is active", () => {
    const spring = SEASONAL_PROMOTIONS.find((p) => p.id === "spring-2026");
    expect(spring).toBeDefined();
    expect(spring!.active).toBe(true);
    expect(spring!.title).toContain("Spring");
    expect(spring!.subtitle).toContain("CO2 Laser");
  });

  it("each promotion has required fields", () => {
    for (const promo of SEASONAL_PROMOTIONS) {
      expect(promo.id).toBeTruthy();
      expect(promo.title).toBeTruthy();
      expect(promo.subtitle).toBeTruthy();
      expect(promo.description).toBeTruthy();
      expect(promo.ctaText).toBeTruthy();
      expect(promo.ctaUrl).toBeTruthy();
      expect(promo.gradient).toBeTruthy();
      expect(promo.accentColor).toBeTruthy();
      expect(promo.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(promo.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("only one promotion is active at a time", () => {
    const activeCount = SEASONAL_PROMOTIONS.filter((p) => p.active).length;
    expect(activeCount).toBeLessThanOrEqual(1);
  });

  it("promotions cover different seasons", () => {
    const titles = SEASONAL_PROMOTIONS.map((p) => p.title.toLowerCase());
    expect(titles.some((t) => t.includes("spring"))).toBe(true);
    expect(titles.some((t) => t.includes("summer"))).toBe(true);
    expect(titles.some((t) => t.includes("fall"))).toBe(true);
  });

  it("all CTA URLs point to booking system", () => {
    for (const promo of SEASONAL_PROMOTIONS) {
      expect(promo.ctaUrl).toContain("janeapp.com");
    }
  });
});

describe("Referral Code Generation", () => {
  it("referral codes table exists in schema", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.referralCodes).toBeDefined();
    expect(schema.referralRedemptions).toBeDefined();
  });
});
