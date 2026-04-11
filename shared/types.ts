/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

// Shared types for the AI Skin Analyzer

export type Severity = "mild" | "moderate" | "severe";

export interface SkinCondition {
  name: string;
  severity: Severity;
  area: string;
  description: string;
  cellularInsight: string;
  /** Which photo angle(s) this condition was detected in, e.g. 'front view + left side profile' */
  detectedInAngles?: string;
}

export interface FacialTreatment {
  name: string;
  price: string;
  reason: string;
  targetConditions: string[];
  benefits: string[];
  priority: number;
}

export interface TreatmentSimulation {
  beforeDescription: string;       // What the area looks like now
  afterDescription: string;        // What it would look like after treatment
  improvementPercent: number;      // Estimated improvement 0-100
  timelineWeeks: number;           // Weeks to see full results
  sessionsNeeded: string;          // e.g. "3-4 sessions" or "1 session"
  milestones: SimulationMilestone[];
}

export interface SimulationMilestone {
  timepoint: string;               // e.g. "1 week", "1 month", "3 months"
  description: string;             // What to expect at this point
  improvementPercent: number;      // Cumulative improvement at this point
}

export interface SkinProcedure {
  name: string;
  price: string;
  reason: string;
  targetConditions: string[];
  benefits: string[];
  expectedResults: string;
  simulation: TreatmentSimulation;
  priority: number;
}

export interface SkincareProduct {
  name: string;
  sku: string;
  price: string;
  type: string;
  purpose: string;
  keyIngredients: string[];
  targetConditions: string[];
}

export interface ScarTreatment {
  scarType: string;
  packageName: string;
  price: string;
  sessions: number;
  includes: string[];
  reason: string;
  savings: string;
  /** What each included treatment does — explained in layman's terms */
  treatmentExplanations: { name: string; whatItDoes: string }[];
  /** Total timeline from first session to final results, e.g. "4–6 months" */
  totalTimeline: string;
  /** Spacing between sessions, e.g. "4–6 weeks apart" */
  sessionSpacing: string;
  /** When to expect first visible improvement, e.g. "2–4 weeks after first session" */
  firstResultsTimeline: string;
}

export interface PredictiveInsight {
  title: string;
  description: string;
  timeframe: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  goals: string[];
  treatments: string[];
  expectedOutcome: string;
}

export interface ConcernAnalysis {
  concern: string;
  whatWeFound: string;
  howToExplain: string;
  recommendedAction: string;
}

export interface AnticipatedQuestion {
  question: string;
  answer: string;
}

export interface EducationalPoint {
  topic: string;
  explanation: string;
  whyItMatters: string;
}

export interface StaffSummary {
  quickOverview: string;
  topPriorityConcern: string;
  emotionalState: string;
  budgetApproach: string;
  closingStrategy: string;
  concernAnalysis?: ConcernAnalysis[];
  anticipatedQuestions?: AnticipatedQuestion[];
  educationalPoints?: EducationalPoint[];
}

export interface TalkingPoint {
  topic: string;
  whatToSay: string;
  whyItWorks: string;
}

export interface SkinAnalysisReport {
  // Section 1: Score
  skinHealthScore: number;
  scoreJustification: string;
  skinType: string;
  skinTone: string;
  fitzpatrickType: number;

  // Section 2: Advanced Analysis
  conditions: SkinCondition[];
  positiveFindings: string[];

  // Section 3: Missed Conditions
  missedConditions: SkinCondition[];

  // Section 4: Top 2 Facials
  facialTreatments: FacialTreatment[];

  // Section 5: Top 4 Procedures
  skinProcedures: SkinProcedure[];

  // Section 6: Skincare Products
  skincareProducts: SkincareProduct[];

  // Section 6.5: Scar Treatment Packages
  scarTreatments: ScarTreatment[];

  // Section 7: Next-Level Insights
  predictiveInsights: PredictiveInsight[];
  skinTrajectory: string;
  cellularAnalysis: string;

  // Section 8: Optimization Roadmap
  roadmap: RoadmapPhase[];

  // Meta
  summary: string;
  disclaimer: string;

  // Staff-only consultation tools
  staffSummary?: StaffSummary;
  talkingPoints?: TalkingPoint[];

  // Score calculation (internal)
  scoreCalculation?: string;

  // Beauty Score
  beautyScore?: {
    overall: number;
    symmetry: number;
    glow: number;
    texture: number;
    structure: number;
    youthfulness: number;
    percentile: number;
    topStrength: string;
    shareCaption: string;
  };
}

export interface PatientInfo {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string; // YYYY-MM-DD
}

export interface AnalysisRecord {
  id: number;
  userId: number;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  patientDob: string;
  imageUrl: string;
  report: SkinAnalysisReport;
  createdAt: string;
}
