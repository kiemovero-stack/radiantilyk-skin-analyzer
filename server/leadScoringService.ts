/**
 * Lead Scoring Service
 *
 * Calculates a 1-5 star lead score for each client analysis based on
 * engagement signals. Higher scores indicate clients who are more likely
 * to convert into booked appointments.
 *
 * Enhanced with:
 * - Booking probability percentage
 * - Estimated revenue potential
 * - High-value client indicators
 * - Budget-based scoring
 * - Treatment experience weighting
 *
 * Scoring Signals:
 * - Skin health score severity (lower score = more motivated to act)
 * - Number of conditions detected (more concerns = higher urgency)
 * - Scar detected (scar clients have high treatment intent)
 * - Contact info provided (email, phone, DOB)
 * - Engagement depth (photos, procedures recommended)
 * - Consultation form submitted (strongest intent signal)
 * - Referral code shared (engaged enough to share)
 * - Budget level (higher budget = higher value)
 * - Treatment experience (returning clients convert better)
 * - Treatment goals (urgency-driven goals score higher)
 */

export interface LeadScoreDetails {
  /** Total points earned */
  totalPoints: number;
  /** Maximum possible points */
  maxPoints: number;
  /** Star rating 1-5 */
  stars: number;
  /** Individual signal scores */
  signals: {
    name: string;
    points: number;
    maxPoints: number;
    description: string;
  }[];
  /** Priority level: hot, warm, cool */
  priority: "hot" | "warm" | "cool";
  /** Human-readable summary */
  summary: string;
  /** Calculated at timestamp */
  calculatedAt: string;
  /** Booking probability percentage (0-100) */
  bookingProbability: number;
  /** Estimated revenue potential */
  estimatedRevenue: { low: number; high: number };
  /** High-value client indicators */
  highValueIndicators: string[];
  /** Client tier: platinum, gold, silver, bronze */
  clientTier: "platinum" | "gold" | "silver" | "bronze";
}

interface ScoringInput {
  /** Skin health score (0-100) */
  skinHealthScore: number;
  /** Number of conditions detected */
  conditionCount: number;
  /** Whether scars were detected */
  hasScarDetection: boolean;
  /** Number of scar treatments recommended */
  scarTreatmentCount: number;
  /** Whether a valid email was provided */
  hasEmail: boolean;
  /** Whether a phone number was provided */
  hasPhone: boolean;
  /** Whether DOB was provided */
  hasDob: boolean;
  /** Number of images uploaded */
  imageCount: number;
  /** Whether the client has a referral code generated */
  hasReferralCode: boolean;
  /** Whether a scar consultation form was submitted */
  hasConsultationSubmission: boolean;
  /** Number of procedures recommended */
  procedureCount: number;
  /** Monthly skincare budget (from intake form) */
  budget?: string;
  /** Treatment experience level */
  treatmentExperience?: string;
  /** Treatment goal */
  treatmentGoal?: string;
  /** Selected concerns from intake */
  concerns?: string[];
}

/**
 * Calculate the lead score for a client analysis.
 */
export function calculateLeadScore(input: ScoringInput): LeadScoreDetails {
  const signals: LeadScoreDetails["signals"] = [];
  const highValueIndicators: string[] = [];

  // 1. Skin Health Score Urgency (0-20 points)
  let skinUrgencyPoints = 0;
  if (input.skinHealthScore <= 30) {
    skinUrgencyPoints = 20;
    highValueIndicators.push("Critical skin concerns — highly motivated");
  } else if (input.skinHealthScore <= 50) {
    skinUrgencyPoints = 15;
    highValueIndicators.push("Significant skin issues — motivated to act");
  } else if (input.skinHealthScore <= 70) {
    skinUrgencyPoints = 10;
  } else if (input.skinHealthScore <= 85) {
    skinUrgencyPoints = 5;
  } else {
    skinUrgencyPoints = 2;
  }
  signals.push({
    name: "Skin Health Urgency",
    points: skinUrgencyPoints,
    maxPoints: 20,
    description: `Score ${input.skinHealthScore}/100 — ${skinUrgencyPoints >= 15 ? "high motivation" : skinUrgencyPoints >= 10 ? "moderate motivation" : "lower urgency"}`,
  });

  // 2. Condition Count (0-15 points)
  const conditionPoints = Math.min(input.conditionCount * 3, 15);
  if (input.conditionCount >= 4) {
    highValueIndicators.push(`${input.conditionCount} conditions — multi-treatment candidate`);
  }
  signals.push({
    name: "Conditions Detected",
    points: conditionPoints,
    maxPoints: 15,
    description: `${input.conditionCount} skin concern${input.conditionCount !== 1 ? "s" : ""} identified`,
  });

  // 3. Scar Detection (0-20 points) — strongest intent signal
  const scarPoints = input.hasScarDetection ? (input.scarTreatmentCount >= 2 ? 20 : 15) : 0;
  if (input.hasScarDetection) {
    highValueIndicators.push(`Scar treatment candidate — ${input.scarTreatmentCount} package${input.scarTreatmentCount !== 1 ? "s" : ""} recommended`);
  }
  signals.push({
    name: "Scar Treatment Intent",
    points: scarPoints,
    maxPoints: 20,
    description: input.hasScarDetection
      ? `${input.scarTreatmentCount} scar treatment${input.scarTreatmentCount !== 1 ? "s" : ""} recommended — high-value lead`
      : "No scars detected",
  });

  // 4. Contact Information (0-15 points)
  const contactPoints = (input.hasEmail ? 5 : 0) + (input.hasPhone ? 5 : 0) + (input.hasDob ? 5 : 0);
  if (input.hasPhone && input.hasEmail) {
    highValueIndicators.push("Full contact info — easy to reach");
  }
  signals.push({
    name: "Contact Info Provided",
    points: contactPoints,
    maxPoints: 15,
    description: `${input.hasEmail ? "Email ✓" : "No email"} ${input.hasPhone ? "Phone ✓" : "No phone"} ${input.hasDob ? "DOB ✓" : ""}`.trim(),
  });

  // 5. Engagement Depth (0-10 points)
  const engagementPoints = Math.min(input.imageCount * 3, 9) + (input.procedureCount >= 4 ? 1 : 0);
  signals.push({
    name: "Engagement Depth",
    points: Math.min(engagementPoints, 10),
    maxPoints: 10,
    description: `${input.imageCount} photo${input.imageCount !== 1 ? "s" : ""} uploaded, ${input.procedureCount} treatments recommended`,
  });

  // 6. Referral Activity (0-10 points)
  const referralPoints = input.hasReferralCode ? 10 : 0;
  if (input.hasReferralCode) {
    highValueIndicators.push("Referral code generated — brand advocate potential");
  }
  signals.push({
    name: "Referral Activity",
    points: referralPoints,
    maxPoints: 10,
    description: input.hasReferralCode ? "Referral code generated — sharing with friends" : "No referral activity yet",
  });

  // 7. Consultation Form (0-15 points) — very strong intent
  const consultPoints = input.hasConsultationSubmission ? 15 : 0;
  if (input.hasConsultationSubmission) {
    highValueIndicators.push("Consultation form submitted — ready to book NOW");
  }
  signals.push({
    name: "Consultation Submitted",
    points: consultPoints,
    maxPoints: 15,
    description: input.hasConsultationSubmission ? "Scar consultation form submitted — ready to book" : "No consultation form submitted",
  });

  // 8. Budget Level (0-15 points) — NEW
  let budgetPoints = 0;
  if (input.budget) {
    if (input.budget.includes("500+") || input.budget.includes("$500")) {
      budgetPoints = 15;
      highValueIndicators.push("High budget ($500+/month) — premium client");
    } else if (input.budget.includes("300") || input.budget.includes("$300")) {
      budgetPoints = 12;
      highValueIndicators.push("Strong budget ($300-500/month) — serious about skincare");
    } else if (input.budget.includes("100") && !input.budget.includes("<")) {
      budgetPoints = 8;
    } else {
      budgetPoints = 3;
    }
  }
  signals.push({
    name: "Budget Level",
    points: budgetPoints,
    maxPoints: 15,
    description: input.budget ? `Monthly budget: ${input.budget}` : "Budget not provided",
  });

  // 9. Treatment Experience (0-10 points) — NEW
  let experiencePoints = 0;
  if (input.treatmentExperience) {
    if (input.treatmentExperience.includes("regular")) {
      experiencePoints = 10;
      highValueIndicators.push("Regular treatment client — high retention probability");
    } else if (input.treatmentExperience.includes("few")) {
      experiencePoints = 7;
    } else if (input.treatmentExperience.includes("first")) {
      experiencePoints = 4; // First-timers still valuable but less certain
    }
  }
  signals.push({
    name: "Treatment Experience",
    points: experiencePoints,
    maxPoints: 10,
    description: input.treatmentExperience ? `Experience: ${input.treatmentExperience}` : "Experience not provided",
  });

  // 10. Treatment Goal Urgency (0-10 points) — NEW
  let goalPoints = 0;
  if (input.treatmentGoal) {
    const goal = input.treatmentGoal.toLowerCase();
    if (goal.includes("special event") || goal.includes("wedding")) {
      goalPoints = 10;
      highValueIndicators.push("Event-driven urgency — time-sensitive booking");
    } else if (goal.includes("restore") || goal.includes("rejuvenate")) {
      goalPoints = 8;
      highValueIndicators.push("Restoration goal — multi-session candidate");
    } else if (goal.includes("refresh")) {
      goalPoints = 6;
    } else if (goal.includes("prevention") || goal.includes("maintenance")) {
      goalPoints = 5;
    } else if (goal.includes("exploring")) {
      goalPoints = 3;
    }
  }
  signals.push({
    name: "Treatment Goal",
    points: goalPoints,
    maxPoints: 10,
    description: input.treatmentGoal ? `Goal: ${input.treatmentGoal}` : "Goal not specified",
  });

  // Calculate totals
  const totalPoints = signals.reduce((sum, s) => sum + s.points, 0);
  const maxPoints = signals.reduce((sum, s) => sum + s.maxPoints, 0);
  const percentage = (totalPoints / maxPoints) * 100;

  // Convert to 1-5 stars
  let stars: number;
  if (percentage >= 75) stars = 5;
  else if (percentage >= 55) stars = 4;
  else if (percentage >= 38) stars = 3;
  else if (percentage >= 20) stars = 2;
  else stars = 1;

  // Priority level
  let priority: "hot" | "warm" | "cool";
  if (stars >= 4) priority = "hot";
  else if (stars >= 3) priority = "warm";
  else priority = "cool";

  // Client tier based on revenue potential signals
  let clientTier: "platinum" | "gold" | "silver" | "bronze";
  const hasHighBudget = budgetPoints >= 12;
  const hasMultiTreatment = input.procedureCount >= 4 || input.hasScarDetection;
  const hasStrongIntent = input.hasConsultationSubmission || (input.hasPhone && input.hasEmail);

  if (hasHighBudget && hasMultiTreatment && hasStrongIntent) {
    clientTier = "platinum";
  } else if ((hasHighBudget && hasMultiTreatment) || (hasMultiTreatment && hasStrongIntent)) {
    clientTier = "gold";
  } else if (hasHighBudget || hasMultiTreatment || hasStrongIntent) {
    clientTier = "silver";
  } else {
    clientTier = "bronze";
  }

  // Booking probability (0-100%)
  let bookingProbability = Math.round(percentage * 0.85); // Base: 85% of score percentage
  if (input.hasConsultationSubmission) bookingProbability = Math.min(bookingProbability + 15, 95);
  if (input.hasPhone) bookingProbability = Math.min(bookingProbability + 5, 95);
  if (experiencePoints >= 7) bookingProbability = Math.min(bookingProbability + 5, 95);
  if (goalPoints >= 8) bookingProbability = Math.min(bookingProbability + 5, 95);
  bookingProbability = Math.max(bookingProbability, 5); // Minimum 5%

  // Estimated revenue potential
  let revenueLow = 150; // Minimum consultation
  let revenueHigh = 300;

  if (input.hasScarDetection) {
    revenueLow += 1500;
    revenueHigh += 6500;
  }
  if (input.procedureCount >= 4) {
    revenueLow += input.procedureCount * 200;
    revenueHigh += input.procedureCount * 600;
  } else if (input.procedureCount >= 2) {
    revenueLow += input.procedureCount * 150;
    revenueHigh += input.procedureCount * 400;
  }
  if (hasHighBudget) {
    revenueLow = Math.round(revenueLow * 1.3);
    revenueHigh = Math.round(revenueHigh * 1.5);
  }
  if (experiencePoints >= 7) {
    // Returning clients have higher lifetime value
    revenueLow = Math.round(revenueLow * 1.2);
    revenueHigh = Math.round(revenueHigh * 1.8);
  }

  // Summary
  let summary: string;
  if (priority === "hot") {
    if (clientTier === "platinum") {
      summary = "🔥 PLATINUM lead — high budget, multiple treatments, strong intent. Contact IMMEDIATELY.";
    } else if (input.hasScarDetection) {
      summary = "High-value scar treatment lead — contact within 24 hours";
    } else {
      summary = "Highly engaged lead with multiple concerns — prioritize outreach";
    }
  } else if (priority === "warm") {
    summary = "Moderately engaged — follow up within 48 hours";
  } else {
    summary = "Early-stage lead — nurture with automated follow-ups";
  }

  return {
    totalPoints,
    maxPoints,
    stars,
    signals,
    priority,
    summary,
    calculatedAt: new Date().toISOString(),
    bookingProbability,
    estimatedRevenue: { low: revenueLow, high: revenueHigh },
    highValueIndicators,
    clientTier,
  };
}

/**
 * Build scoring input from a skin analysis record.
 */
export function buildScoringInput(record: {
  skinHealthScore: number | null;
  report: any;
  patientEmail: string;
  patientPhone?: string;
  patientDob: string;
  imageUrl: string;
  intakeData?: any;
}): ScoringInput {
  const report = record.report as any;
  const conditions = report?.conditions || [];
  const procedures = report?.skinProcedures || [];
  const scarTreatments = report?.scarTreatments || [];
  const intake = record.intakeData || {};

  return {
    skinHealthScore: record.skinHealthScore || 50,
    conditionCount: conditions.length,
    hasScarDetection: scarTreatments.length > 0,
    scarTreatmentCount: scarTreatments.length,
    hasEmail: !!record.patientEmail && record.patientEmail.includes("@"),
    hasPhone: !!record.patientPhone && record.patientPhone.length >= 7,
    hasDob: !!record.patientDob && record.patientDob.length > 0,
    imageCount: record.imageUrl ? 1 : 0,
    hasReferralCode: false, // Will be enriched by the caller
    hasConsultationSubmission: false, // Will be enriched by the caller
    procedureCount: procedures.length,
    budget: intake.budget || undefined,
    treatmentExperience: intake.treatmentExperience || undefined,
    treatmentGoal: intake.treatmentGoal || undefined,
    concerns: intake.concerns || undefined,
  };
}
