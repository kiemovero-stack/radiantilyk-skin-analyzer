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
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
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
  patientDob: varchar("patientDob", { length: 16 }).notNull().default(""),
  imageUrl: text("imageUrl").notNull(),
  report: json("report").notNull(),
  skinHealthScore: int("skinHealthScore"),
  skinType: varchar("skinType", { length: 64 }),
  status: varchar("status", { length: 32 }).notNull().default("completed"),
  errorMessage: text("errorMessage"),
  /** JSON map of treatment name → simulation image URL */
  simulationImages: json("simulationImages"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SkinAnalysis = typeof skinAnalyses.$inferSelect;
export type InsertSkinAnalysis = typeof skinAnalyses.$inferInsert;

/**
 * Persistent scheduled emails table.
 * Replaces in-memory setTimeout with DB-backed scheduler
 * so follow-up emails survive server restarts.
 */
export const scheduledEmails = mysqlTable("scheduledEmails", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId").notNull(),
  emailType: varchar("emailType", { length: 32 }).notNull(), // '24hr' | '48hr'
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  /** Full config needed to render the email, stored as JSON */
  config: json("config").notNull(),
  /** When this email should be sent */
  scheduledAt: timestamp("scheduledAt").notNull(),
  /** When it was actually sent (null = not yet sent) */
  sentAt: timestamp("sentAt"),
  /** 'pending' | 'sent' | 'failed' | 'cancelled' */
  status: varchar("status", { length: 16 }).notNull().default("pending"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ScheduledEmail = typeof scheduledEmails.$inferSelect;
export type InsertScheduledEmail = typeof scheduledEmails.$inferInsert;

/**
 * Client consent records.
 * Stores electronic signatures with timestamps for legal compliance.
 */
export const clientConsents = mysqlTable("clientConsents", {
  id: int("id").autoincrement().primaryKey(),
  /** Links to skinAnalyses.id (set after analysis is created) */
  analysisId: int("analysisId"),
  patientFirstName: varchar("patientFirstName", { length: 128 }).notNull(),
  patientLastName: varchar("patientLastName", { length: 128 }).notNull(),
  patientEmail: varchar("patientEmail", { length: 320 }).notNull(),
  patientDob: varchar("patientDob", { length: 16 }).notNull(),
  /** Base64-encoded signature image data */
  signatureData: text("signatureData").notNull(),
  /** Version identifier of the consent text that was signed */
  consentVersion: varchar("consentVersion", { length: 16 }).notNull().default("1.0"),
  /** IP address of the signer */
  ipAddress: varchar("ipAddress", { length: 64 }),
  /** User agent string */
  userAgent: text("userAgent"),
  signedAt: timestamp("signedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClientConsent = typeof clientConsents.$inferSelect;
export type InsertClientConsent = typeof clientConsents.$inferInsert;
