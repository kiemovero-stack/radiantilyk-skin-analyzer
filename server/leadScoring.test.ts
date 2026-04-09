import { describe, it, expect } from "vitest";
import { calculateLeadScore, buildScoringInput } from "./leadScoringService";

describe("Lead Scoring Service", () => {
  describe("calculateLeadScore", () => {
    it("returns a hot lead for high-engagement scar client", () => {
      const score = calculateLeadScore({
        skinHealthScore: 35,
        conditionCount: 5,
        hasScarDetection: true,
        scarTreatmentCount: 3,
        hasEmail: true,
        hasDob: true,
        imageCount: 3,
        hasReferralCode: true,
        hasConsultationSubmission: true,
        procedureCount: 6,
      });

      expect(score.priority).toBe("hot");
      expect(score.stars).toBeGreaterThanOrEqual(4);
      expect(score.totalPoints).toBeGreaterThan(0);
      expect(score.maxPoints).toBe(100);
      expect(score.signals).toHaveLength(7);
      expect(score.summary).toContain("scar");
    });

    it("returns a cool lead for minimal engagement", () => {
      const score = calculateLeadScore({
        skinHealthScore: 90,
        conditionCount: 1,
        hasScarDetection: false,
        scarTreatmentCount: 0,
        hasEmail: true,
        hasDob: false,
        imageCount: 1,
        hasReferralCode: false,
        hasConsultationSubmission: false,
        procedureCount: 2,
      });

      expect(score.priority).toBe("cool");
      expect(score.stars).toBeLessThanOrEqual(2);
    });

    it("returns a warm lead for moderate engagement", () => {
      const score = calculateLeadScore({
        skinHealthScore: 45,
        conditionCount: 4,
        hasScarDetection: false,
        scarTreatmentCount: 0,
        hasEmail: true,
        hasDob: true,
        imageCount: 2,
        hasReferralCode: true,
        hasConsultationSubmission: false,
        procedureCount: 5,
      });

      expect(score.priority).toBe("warm");
      expect(score.stars).toBe(3);
    });

    it("gives maximum skin urgency points for very low skin health score", () => {
      const score = calculateLeadScore({
        skinHealthScore: 20,
        conditionCount: 0,
        hasScarDetection: false,
        scarTreatmentCount: 0,
        hasEmail: false,
        hasDob: false,
        imageCount: 0,
        hasReferralCode: false,
        hasConsultationSubmission: false,
        procedureCount: 0,
      });

      const skinSignal = score.signals.find((s) => s.name === "Skin Health Urgency");
      expect(skinSignal?.points).toBe(20);
    });

    it("gives maximum scar points for multiple scar treatments", () => {
      const score = calculateLeadScore({
        skinHealthScore: 50,
        conditionCount: 2,
        hasScarDetection: true,
        scarTreatmentCount: 3,
        hasEmail: true,
        hasDob: false,
        imageCount: 1,
        hasReferralCode: false,
        hasConsultationSubmission: false,
        procedureCount: 3,
      });

      const scarSignal = score.signals.find((s) => s.name === "Scar Treatment Intent");
      expect(scarSignal?.points).toBe(20);
    });

    it("gives consultation points when form is submitted", () => {
      const score = calculateLeadScore({
        skinHealthScore: 50,
        conditionCount: 2,
        hasScarDetection: false,
        scarTreatmentCount: 0,
        hasEmail: true,
        hasDob: true,
        imageCount: 1,
        hasReferralCode: false,
        hasConsultationSubmission: true,
        procedureCount: 3,
      });

      const consultSignal = score.signals.find((s) => s.name === "Consultation Submitted");
      expect(consultSignal?.points).toBe(15);
    });

    it("includes calculatedAt timestamp", () => {
      const score = calculateLeadScore({
        skinHealthScore: 50,
        conditionCount: 0,
        hasScarDetection: false,
        scarTreatmentCount: 0,
        hasEmail: false,
        hasDob: false,
        imageCount: 0,
        hasReferralCode: false,
        hasConsultationSubmission: false,
        procedureCount: 0,
      });

      expect(score.calculatedAt).toBeTruthy();
      expect(new Date(score.calculatedAt).getTime()).toBeGreaterThan(0);
    });
  });

  describe("buildScoringInput", () => {
    it("extracts scoring input from a skin analysis record", () => {
      const input = buildScoringInput({
        skinHealthScore: 45,
        report: {
          conditions: [{ name: "Acne" }, { name: "Wrinkles" }],
          skinProcedures: [{ name: "Botox" }, { name: "Microneedling" }],
          scarTreatments: [{ scarType: "Atrophic" }],
        },
        patientEmail: "test@example.com",
        patientDob: "1990-01-15",
        imageUrl: "https://example.com/photo.jpg",
      });

      expect(input.skinHealthScore).toBe(45);
      expect(input.conditionCount).toBe(2);
      expect(input.hasScarDetection).toBe(true);
      expect(input.scarTreatmentCount).toBe(1);
      expect(input.hasEmail).toBe(true);
      expect(input.hasDob).toBe(true);
      expect(input.imageCount).toBe(1);
      expect(input.procedureCount).toBe(2);
    });

    it("handles empty report gracefully", () => {
      const input = buildScoringInput({
        skinHealthScore: null,
        report: {},
        patientEmail: "",
        patientDob: "",
        imageUrl: "",
      });

      expect(input.skinHealthScore).toBe(50);
      expect(input.conditionCount).toBe(0);
      expect(input.hasScarDetection).toBe(false);
      expect(input.hasEmail).toBe(false);
      expect(input.hasDob).toBe(false);
      expect(input.imageCount).toBe(0);
    });
  });
});
