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
}

export interface FacialTreatment {
  name: string;
  price: string;
  reason: string;
  targetConditions: string[];
  benefits: string[];
  priority: number;
}

export interface SkinProcedure {
  name: string;
  price: string;
  reason: string;
  targetConditions: string[];
  benefits: string[];
  expectedResults: string;
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

  // Section 7: Next-Level Insights
  predictiveInsights: PredictiveInsight[];
  skinTrajectory: string;
  cellularAnalysis: string;

  // Section 8: Optimization Roadmap
  roadmap: RoadmapPhase[];

  // Meta
  summary: string;
  disclaimer: string;
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
