import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "staff"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Skin analysis reports table.
 * Stores the uploaded image URL and the full AI-generated report as JSON.
 */
export const skinAnalyses = mysqlTable("skinAnalyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // Patient info collected before analysis
  patientFirstName: varchar("patientFirstName", { length: 128 }).notNull().default(""),
  patientLastName: varchar("patientLastName", { length: 128 }).notNull().default(""),
  patientEmail: varchar("patientEmail", { length: 320 }).notNull().default(""),
  patientPhone: varchar("patientPhone", { length: 32 }).notNull().default(""),
  patientDob: varchar("patientDob", { length: 16 }).notNull().default(""),
  imageUrl: text("imageUrl").notNull(),
  report: json("report").notNull(),
  skinHealthScore: int("skinHealthScore"),
  skinType: varchar("skinType", { length: 64 }),
  status: varchar("status", { length: 32 }).notNull().default("completed"),
  errorMessage: text("errorMessage"),
  /** JSON map of treatment name → simulation image URL */
  simulationImages: json("simulationImages"),
  /** JSON object with aging simulation URLs: { withoutTreatment, withTreatment } */
  agingImages: json("agingImages"),
  /** Lead score 1-5 based on engagement signals */
  leadScore: int("leadScore"),
  /** JSON object with individual scoring signals */
  leadScoreDetails: json("leadScoreDetails"),
  /** Timestamp when staff marked this lead as contacted */
  contactedAt: timestamp("contactedAt"),
  /** Staff notes about the contact attempt */
  contactNotes: text("contactNotes"),
  /** Contact method used: call, email, text */
  contactMethod: varchar("contactMethod", { length: 32 }),
  /** JSON object with intake form data: concerns, treatmentGoal, treatmentExperience, budget */
  intakeData: json("intakeData"),
  /** JSON array of previous analysis scores: [{ score, conditionCount, analyzedAt, conditions }] */
  scoreHistory: json("scoreHistory"),
  /** Staff notes about the consultation or client preferences */
  staffNotes: text("staffNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SkinAnalysis = typeof skinAnalyses.$inferSelect;
export type InsertSkinAnalysis = typeof skinAnalyses.$inferInsert;

/**
 * Referral codes for the client referral program.
 * Each client gets a unique code after analysis; when a friend uses it, both get 15% off.
 */
export const referralCodes = mysqlTable("referralCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  referrerName: varchar("referrerName", { length: 256 }).notNull(),
  referrerEmail: varchar("referrerEmail", { length: 320 }).notNull(),
  analysisId: int("analysisId").notNull(),
  discountPercent: int("discountPercent").notNull().default(15),
  timesUsed: int("timesUsed").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReferralCode = typeof referralCodes.$inferSelect;
export type InsertReferralCode = typeof referralCodes.$inferInsert;

/**
 * Tracks each referral redemption — who used the code and when.
 */
export const referralRedemptions = mysqlTable("referralRedemptions", {
  id: int("id").autoincrement().primaryKey(),
  referralCodeId: int("referralCodeId").notNull(),
  referredName: varchar("referredName", { length: 256 }).notNull(),
  referredEmail: varchar("referredEmail", { length: 320 }).notNull(),
  referredAnalysisId: int("referredAnalysisId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReferralRedemption = typeof referralRedemptions.$inferSelect;
export type InsertReferralRedemption = typeof referralRedemptions.$inferInsert;
