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

/**
 * Rewards program members.
 * Tracks loyalty points, tier, and lifetime earnings.
 */
export const rewardsMembers = mysqlTable("rewardsMembers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 256 }),
  points: int("points").notNull().default(0),
  lifetimePoints: int("lifetimePoints").notNull().default(0),
  tier: mysqlEnum("tier", ["Glow", "Radiant", "Luminous", "Icon"]).default("Glow").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RewardsMember = typeof rewardsMembers.$inferSelect;
export type InsertRewardsMember = typeof rewardsMembers.$inferInsert;

/**
 * Rewards transaction history — every earn and redeem event.
 */
export const rewardsTransactions = mysqlTable("rewardsTransactions", {
  id: int("id").autoincrement().primaryKey(),
  memberId: int("memberId").notNull(),
  type: mysqlEnum("type", ["earn", "redeem"]).notNull(),
  points: int("points").notNull(),
  action: varchar("action", { length: 128 }).notNull(),
  description: text("description"),
  /** Reference ID (e.g., analysis ID, referral code ID) */
  referenceId: varchar("referenceId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RewardsTransaction = typeof rewardsTransactions.$inferSelect;
export type InsertRewardsTransaction = typeof rewardsTransactions.$inferInsert;

/**
 * Booking system — staff providers who can receive appointments.
 */
export const bookingStaff = mysqlTable("bookingStaff", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  title: varchar("title", { length: 128 }),
  googleCalendarId: varchar("googleCalendarId", { length: 320 }),
  isActive: int("isActive").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookingStaff = typeof bookingStaff.$inferSelect;
export type InsertBookingStaff = typeof bookingStaff.$inferInsert;

/**
 * Booking system — recurring weekly availability per staff member.
 * Each row = one time block on a given day of the week.
 */
export const bookingAvailability = mysqlTable("bookingAvailability", {
  id: int("id").autoincrement().primaryKey(),
  staffId: int("staffId").notNull(),
  /** 0 = Sunday, 1 = Monday, ... 6 = Saturday */
  dayOfWeek: int("dayOfWeek").notNull(),
  /** HH:MM format, e.g. "09:00" */
  startTime: varchar("startTime", { length: 5 }).notNull(),
  /** HH:MM format, e.g. "17:00" */
  endTime: varchar("endTime", { length: 5 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookingAvailability = typeof bookingAvailability.$inferSelect;
export type InsertBookingAvailability = typeof bookingAvailability.$inferInsert;

/**
 * Booking system — client profiles for booking (separate from OAuth users).
 * Simple account: name, email, phone, DOB, Stripe customer ID.
 */
export const bookingClients = mysqlTable("bookingClients", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 32 }).notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 16 }).notNull(),
  passwordHash: varchar("passwordHash", { length: 256 }).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  hasCardOnFile: int("hasCardOnFile").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BookingClient = typeof bookingClients.$inferSelect;
export type InsertBookingClient = typeof bookingClients.$inferInsert;

/**
 * Booking system — appointments.
 */
export const bookingAppointments = mysqlTable("bookingAppointments", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  staffId: int("staffId").notNull(),
  /** Appointment date in YYYY-MM-DD format */
  appointmentDate: varchar("appointmentDate", { length: 10 }).notNull(),
  /** Start time in HH:MM format */
  startTime: varchar("startTime", { length: 5 }).notNull(),
  /** End time in HH:MM format (startTime + 30 min) */
  endTime: varchar("endTime", { length: 5 }).notNull(),
  /** Service/reason for visit */
  service: varchar("service", { length: 256 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["confirmed", "cancelled", "completed", "no_show"]).default("confirmed").notNull(),
  /** Stripe PaymentMethod ID for card on file */
  stripePaymentMethodId: varchar("stripePaymentMethodId", { length: 128 }),
  /** Amount charged for no-show (null = not charged) */
  noShowChargeAmount: int("noShowChargeAmount"),
  /** Google Calendar event ID for sync */
  googleCalendarEventId: varchar("googleCalendarEventId", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BookingAppointment = typeof bookingAppointments.$inferSelect;
export type InsertBookingAppointment = typeof bookingAppointments.$inferInsert;
