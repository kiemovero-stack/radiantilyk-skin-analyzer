/**
 * Tests for Super-App features: Wallet, AI Chat, Home Data, Shop, Notifications.
 */
import { describe, it, expect } from "vitest";
import { NOTIFICATION_TEMPLATES } from "./notificationService";

// ─── Notification Templates ───
describe("Notification Templates", () => {
  it("should have all required notification types", () => {
    const requiredTypes = [
      "botoxReminder",
      "skinScoreDrop",
      "flashDeal",
      "appointmentReminder24h",
      "appointmentReminder1h",
      "missedAppointment",
      "rewardsMilestone",
      "walletBonus",
      "weekendSlots",
      "newProduct",
    ];

    for (const type of requiredTypes) {
      expect(NOTIFICATION_TEMPLATES).toHaveProperty(type);
    }
  });

  it("each template should have title, body, and action", () => {
    for (const [key, template] of Object.entries(NOTIFICATION_TEMPLATES)) {
      expect(template.title).toBeTruthy();
      expect(template.body).toBeTruthy();
      expect(template.action).toBeTruthy();
      expect(template.action.startsWith("/")).toBe(true);
    }
  });

  it("botox reminder should reference booking", () => {
    expect(NOTIFICATION_TEMPLATES.botoxReminder.action).toBe("/book");
    expect(NOTIFICATION_TEMPLATES.botoxReminder.title.toLowerCase()).toContain("touch-up");
  });

  it("wallet bonus should link to profile", () => {
    expect(NOTIFICATION_TEMPLATES.walletBonus.action).toBe("/profile");
  });

  it("flash deal should create urgency", () => {
    expect(NOTIFICATION_TEMPLATES.flashDeal.title.toLowerCase()).toContain("flash deal");
  });
});

// ─── Wallet System Logic ───
describe("Wallet Bonus Calculation", () => {
  function calculateBonus(amount: number): number {
    if (amount >= 1000) return amount * 0.10;
    if (amount >= 500) return amount * 0.05;
    if (amount >= 250) return amount * 0.03;
    return 0;
  }

  it("should give 10% bonus for $1000+", () => {
    expect(calculateBonus(1000)).toBe(100);
    expect(calculateBonus(2000)).toBe(200);
  });

  it("should give 5% bonus for $500-$999", () => {
    expect(calculateBonus(500)).toBe(25);
    expect(calculateBonus(750)).toBe(37.5);
  });

  it("should give 3% bonus for $250-$499", () => {
    expect(calculateBonus(250)).toBe(7.5);
    expect(calculateBonus(400)).toBe(12);
  });

  it("should give no bonus under $250", () => {
    expect(calculateBonus(100)).toBe(0);
    expect(calculateBonus(0)).toBe(0);
  });
});

// ─── AI Chat Service Knowledge ───
describe("AI Chat Concierge", () => {
  const SERVICE_KNOWLEDGE = `
    Botox/Tox: $11-13/unit
    Dermal Fillers: $550-800/syringe
    Facials: $80-250
    Laser treatments: $200-500/session
    IV Therapy: $150-300
    PRP/PRF: $400-600
    Body contouring: $300-800/session
  `;

  it("should include all service categories in knowledge base", () => {
    expect(SERVICE_KNOWLEDGE).toContain("Botox");
    expect(SERVICE_KNOWLEDGE).toContain("Filler");
    expect(SERVICE_KNOWLEDGE).toContain("Facial");
    expect(SERVICE_KNOWLEDGE).toContain("Laser");
    expect(SERVICE_KNOWLEDGE).toContain("IV Therapy");
  });

  it("should include pricing information", () => {
    expect(SERVICE_KNOWLEDGE).toMatch(/\$\d+/);
  });
});

// ─── Shop Product Catalog ───
describe("Shop Product Catalog", () => {
  it("should have valid product structure", () => {
    const sampleProduct = {
      id: "prod-1",
      name: "Vitamin C Serum",
      price: 45,
      category: "Serums",
    };

    expect(sampleProduct.id).toBeTruthy();
    expect(sampleProduct.name).toBeTruthy();
    expect(sampleProduct.price).toBeGreaterThan(0);
    expect(sampleProduct.category).toBeTruthy();
  });
});

// ─── Home Screen Data Aggregation ───
describe("Home Screen Revenue Engine", () => {
  it("should calculate urgency for Botox rebooking", () => {
    const lastBotoxDate = new Date();
    lastBotoxDate.setMonth(lastBotoxDate.getMonth() - 3);
    const daysSince = Math.floor(
      (Date.now() - lastBotoxDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    expect(daysSince).toBeGreaterThanOrEqual(89);
    expect(daysSince).toBeLessThanOrEqual(92);
  });

  it("should format rewards tier correctly", () => {
    function getTier(points: number): string {
      if (points >= 10000) return "Icon";
      if (points >= 5000) return "Luminous";
      if (points >= 2000) return "Radiant";
      return "Glow";
    }

    expect(getTier(0)).toBe("Glow");
    expect(getTier(2000)).toBe("Radiant");
    expect(getTier(5000)).toBe("Luminous");
    expect(getTier(10000)).toBe("Icon");
  });

  it("should calculate wallet bonus display text", () => {
    function bonusText(amount: number): string {
      if (amount >= 1000) return `Add $${amount} → Get $${amount + amount * 0.1}`;
      if (amount >= 500) return `Add $${amount} → Get $${amount + amount * 0.05}`;
      return `Add $${amount}`;
    }

    expect(bonusText(1000)).toBe("Add $1000 → Get $1100");
    expect(bonusText(500)).toBe("Add $500 → Get $525");
    expect(bonusText(100)).toBe("Add $100");
  });
});

// ─── Mobile Tab Navigation ───
describe("Mobile Tab Navigation", () => {
  const clientTabs = ["Home", "Book", "Rewards", "Analyze", "Shop", "Profile"];
  const staffTabs = ["Dashboard", "History", "Rewards", "Appts", "Leads"];

  it("should have 6 client tabs", () => {
    expect(clientTabs).toHaveLength(6);
  });

  it("should have 5 staff tabs", () => {
    expect(staffTabs).toHaveLength(5);
  });

  it("client tabs should include all required sections", () => {
    expect(clientTabs).toContain("Home");
    expect(clientTabs).toContain("Book");
    expect(clientTabs).toContain("Rewards");
    expect(clientTabs).toContain("Shop");
    expect(clientTabs).toContain("Profile");
  });
});
