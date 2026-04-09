/**
 * Staff Management API Routes
 *
 * Admin-only endpoints for managing staff members:
 * - List all users with their roles
 * - Invite new staff by email (pre-creates with placeholder openId)
 * - Update user roles
 * - Remove staff members
 */
import type { Express, Request, Response } from "express";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq, ne, desc, sql } from "drizzle-orm";
import { sdk } from "./_core/sdk";
import crypto from "crypto";

/** Middleware: require admin role */
async function requireAdmin(req: Request, res: Response): Promise<ReturnType<typeof sdk.authenticateRequest> | null> {
  try {
    const user = await sdk.authenticateRequest(req);
    if (user.role !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return null;
    }
    return user as any;
  } catch {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
}

export function registerStaffRoutes(app: Express) {
  /**
   * GET /api/staff
   * List all users with roles. Admin only.
   */
  app.get("/api/staff", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const allUsers = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          openId: users.openId,
          loginMethod: users.loginMethod,
          createdAt: users.createdAt,
          lastSignedIn: users.lastSignedIn,
        })
        .from(users)
        .orderBy(desc(users.createdAt));

      // Mark pending invitations (placeholder openId)
      const staffList = allUsers.map((u) => ({
        ...u,
        isPending: u.openId.startsWith("staff_"),
        createdAt: u.createdAt.toISOString(),
        lastSignedIn: u.lastSignedIn.toISOString(),
      }));

      res.json({ staff: staffList });
    } catch (error) {
      console.error("[Staff] Failed to list staff:", error);
      res.status(500).json({ error: "Failed to list staff" });
    }
  });

  /**
   * POST /api/staff/invite
   * Invite a new staff member by email. Creates a placeholder user with staff role.
   * Body: { name: string, email: string, role?: "staff" | "admin" }
   */
  app.post("/api/staff/invite", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const { name, email, role = "staff" } = req.body;

      if (!name || !email) {
        res.status(400).json({ error: "Name and email are required" });
        return;
      }

      if (!["staff", "admin"].includes(role)) {
        res.status(400).json({ error: "Role must be 'staff' or 'admin'" });
        return;
      }

      // Check if email already exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existing.length > 0) {
        res.status(409).json({ error: "A user with this email already exists" });
        return;
      }

      // Create placeholder user with staff_ prefix openId
      const placeholderOpenId = "staff_" + crypto.randomBytes(12).toString("hex");

      await db.insert(users).values({
        openId: placeholderOpenId,
        name,
        email,
        role: role as "staff" | "admin",
        loginMethod: "invited",
      });

      console.log(`[Staff] Invited ${name} (${email}) as ${role}`);

      res.json({
        success: true,
        message: `${name} has been invited as ${role}. They can sign in at rkaaiskin.com.`,
      });
    } catch (error) {
      console.error("[Staff] Failed to invite staff:", error);
      res.status(500).json({ error: "Failed to invite staff member" });
    }
  });

  /**
   * PATCH /api/staff/:id/role
   * Update a user's role. Admin only. Cannot change own role.
   * Body: { role: "user" | "staff" | "admin" }
   */
  app.patch("/api/staff/:id/role", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const staffId = parseInt(req.params.id);
      const { role } = req.body;

      if (!["user", "staff", "admin"].includes(role)) {
        res.status(400).json({ error: "Role must be 'user', 'staff', or 'admin'" });
        return;
      }

      // Prevent changing own role
      if (staffId === (admin as any).id) {
        res.status(400).json({ error: "Cannot change your own role" });
        return;
      }

      // Check user exists
      const target = await db
        .select()
        .from(users)
        .where(eq(users.id, staffId))
        .limit(1);

      if (target.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      await db
        .update(users)
        .set({ role: role as "user" | "staff" | "admin" })
        .where(eq(users.id, staffId));

      console.log(`[Staff] Changed role of user ${staffId} to ${role}`);

      res.json({ success: true, message: `Role updated to ${role}` });
    } catch (error) {
      console.error("[Staff] Failed to update role:", error);
      res.status(500).json({ error: "Failed to update role" });
    }
  });

  /**
   * DELETE /api/staff/:id
   * Remove a staff member. Admin only. Cannot remove self.
   */
  app.delete("/api/staff/:id", async (req: Request, res: Response) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database not available" });
        return;
      }

      const staffId = parseInt(req.params.id);

      // Prevent removing self
      if (staffId === (admin as any).id) {
        res.status(400).json({ error: "Cannot remove yourself" });
        return;
      }

      // Check user exists
      const target = await db
        .select()
        .from(users)
        .where(eq(users.id, staffId))
        .limit(1);

      if (target.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      await db.delete(users).where(eq(users.id, staffId));

      console.log(`[Staff] Removed user ${staffId} (${target[0].email})`);

      res.json({ success: true, message: "Staff member removed" });
    } catch (error) {
      console.error("[Staff] Failed to remove staff:", error);
      res.status(500).json({ error: "Failed to remove staff member" });
    }
  });
}
