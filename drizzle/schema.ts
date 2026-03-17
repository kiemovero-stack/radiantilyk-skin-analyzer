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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SkinAnalysis = typeof skinAnalyses.$inferSelect;
export type InsertSkinAnalysis = typeof skinAnalyses.$inferInsert;
