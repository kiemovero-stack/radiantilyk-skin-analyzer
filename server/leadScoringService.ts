/**
 * Lead Scoring Service
 *
 * Calculates a 1-5 star lead score for each client analysis based on
 * engagement signals. Higher scores indicate clients who are more likely
 * to convert into booked appointments.
 *
 * Scoring Signals:
 * - Report viewed (did they open their report?)
 * - Skin health score severity (lower score = more motivated to act)
 * - Number of conditions detected (more concerns = higher urgency)
 * - Scar detected (scar clients have high treatment intent)
 * - Email provided (valid email = contactable lead)
 * - DOB provided (more info = more engaged)
 * - Consultation form submitted (strongest intent signal)
 * - Referral code shared (engaged enough to share)
 * - Multiple photos uploaded (took time = serious)
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
}

/**
 * Calculate the lead score for a client analysis.
 */
export function calculateLeadScore(input: ScoringInput): LeadScoreDetails {
  const signals: LeadScoreDetails["signals"] = [];

  // 1. Skin Health Score Urgency (0-20 points)
  // Lower skin health = higher urgency = more points
  let skinUrgencyPoints = 0;
  if (input.skinHealthScore <= 30) {
    skinUrgencyPoints = 20; // Very poor skin = very motivated
  } else if (input.skinHealthScore <= 50) {
    skinUrgencyPoints = 15;
  } else if (input.skinHealthScore <= 70) {
    skinUrgencyPoints = 10;
  } else if (input.skinHealthScore <= 85) {
    skinUrgencyPoints = 5;
  } else {
    skinUrgencyPoints = 2; // Great skin = less urgency
  }
  signals.push({
    name: "Skin Health Urgency",
    points: skinUrgencyPoints,
    maxPoints: 20,
    description: `Score ${input.skinHealthScore}/100 — ${skinUrgencyPoints >= 15 ? "high motivation" : skinUrgencyPoints >= 10 ? "moderate motivation" : "lower urgency"}`,
  });

  // 2. Condition Count (0-15 points)
  const conditionPoints = Math.min(input.conditionCount * 3, 15);
  signals.push({
    name: "Conditions Detected",
    points: conditionPoints,
    maxPoints: 15,
    description: `${input.conditionCount} skin concern${input.conditionCount !== 1 ? "s" : ""} identified`,
  });

  // 3. Scar Detection (0-20 points) — strongest intent signal
  const scarPoints = input.hasScarDetection ? (input.scarTreatmentCount >= 2 ? 20 : 15) : 0;
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
  signals.push({
    name: "Referral Activity",
    points: referralPoints,
    maxPoints: 10,
    description: input.hasReferralCode ? "Referral code generated — sharing with friends" : "No referral activity yet",
  });

  // 7. Consultation Form (0-15 points) — very strong intent
  const consultPoints = input.hasConsultationSubmission ? 15 : 0;
  signals.push({
    name: "Consultation Submitted",
    points: consultPoints,
    maxPoints: 15,
    description: input.hasConsultationSubmission ? "Scar consultation form submitted — ready to book" : "No consultation form submitted",
  });

  // Calculate totals
  const totalPoints = signals.reduce((sum, s) => sum + s.points, 0);
  const maxPoints = signals.reduce((sum, s) => sum + s.maxPoints, 0);
  const percentage = (totalPoints / maxPoints) * 100;

  // Convert to 1-5 stars
  let stars: number;
  if (percentage >= 80) stars = 5;
  else if (percentage >= 60) stars = 4;
  else if (percentage >= 40) stars = 3;
  else if (percentage >= 20) stars = 2;
  else stars = 1;

  // Priority level
  let priority: "hot" | "warm" | "cool";
  if (stars >= 4) priority = "hot";
  else if (stars >= 3) priority = "warm";
  else priority = "cool";

  // Summary
  let summary: string;
  if (priority === "hot") {
    summary = input.hasScarDetection
      ? "High-value scar treatment lead — contact within 24 hours"
      : "Highly engaged lead with multiple concerns — prioritize outreach";
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
}): ScoringInput {
  const report = record.report as any;
  const conditions = report?.conditions || [];
  const procedures = report?.skinProcedures || [];
  const scarTreatments = report?.scarTreatments || [];

  return {
    skinHealthScore: record.skinHealthScore || 50,
    conditionCount: conditions.length,
    hasScarDetection: scarTreatments.length > 0,
    scarTreatmentCount: scarTreatments.length,
    hasEmail: !!record.patientEmail && record.patientEmail.includes("@"),
    hasPhone: !!record.patientPhone && record.patientPhone.length >= 7,
    hasDob: !!record.patientDob && record.patientDob.length > 0,
    imageCount: record.imageUrl ? 1 : 0, // We store only the first URL, but could be multiple
    hasReferralCode: false, // Will be enriched by the caller
    hasConsultationSubmission: false, // Will be enriched by the caller
    procedureCount: procedures.length,
  };
}
