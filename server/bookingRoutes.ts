/**
 * Standalone Booking System API Routes
 *
 * Client endpoints:
 *   POST /api/booking/register         — Create booking account (name, email, phone, DOB, password)
 *   POST /api/booking/login            — Login to booking account
 *   GET  /api/booking/me               — Get current booking client profile
 *   GET  /api/booking/staff            — List active staff members
 *   GET  /api/booking/slots?date=&staffId= — Get available 30-min slots for a date
 *   POST /api/booking/setup-card       — Create Stripe SetupIntent for card on file
 *   POST /api/booking/confirm-card     — Confirm card was saved
 *   POST /api/booking/appointments     — Book an appointment
 *   GET  /api/booking/my-appointments  — List client's appointments
 *   POST /api/booking/cancel/:id       — Cancel an appointment
 *
 * Staff endpoints (admin/staff only):
 *   GET    /api/booking/admin/staff              — List all staff
 *   POST   /api/booking/admin/staff              — Add a staff member
 *   PUT    /api/booking/admin/staff/:id          — Update staff member
 *   DELETE /api/booking/admin/staff/:id          — Deactivate staff member
 *   GET    /api/booking/admin/availability/:staffId — Get staff availability
 *   POST   /api/booking/admin/availability       — Add availability block
 *   DELETE /api/booking/admin/availability/:id   — Remove availability block
 *   GET    /api/booking/admin/appointments       — List all appointments (with filters)
 *   POST   /api/booking/admin/no-show/:id        — Mark appointment as no-show & charge card
 *   POST   /api/booking/admin/complete/:id       — Mark appointment as completed
 */
import type { Express, Request, Response, NextFunction } from "express";
import { getDb } from "./db";
import {
  bookingStaff,
  bookingAvailability,
  bookingClients,
  bookingAppointments,
  users,
} from "../drizzle/schema";
import { eq, and, desc, asc, gte, lte, ne } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const JWT_SECRET = process.env.JWT_SECRET || "booking-secret-key";
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || "";

function getStripe() {
  if (!STRIPE_SECRET) return null;
  return new Stripe(STRIPE_SECRET, { apiVersion: "2025-03-31.basil" as any });
}

/* ── Booking Auth Middleware ── */
interface BookingAuthRequest extends Request {
  bookingClient?: {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    stripeCustomerId: string | null;
    hasCardOnFile: number;
  };
}

async function bookingAuth(req: BookingAuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Login required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { clientId: number; type: string };
    if (decoded.type !== "booking") return res.status(401).json({ error: "Invalid token" });

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database unavailable" });

    const [client] = await db
      .select()
      .from(bookingClients)
      .where(eq(bookingClients.id, decoded.clientId))
      .limit(1);

    if (!client) return res.status(401).json({ error: "Account not found" });
    req.bookingClient = client;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/* ── Staff Auth Middleware (reuses main app auth) ── */
import { sdk } from "./_core/sdk";

async function staffAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      return res.status(403).json({ error: "Staff access required" });
    }
    (req as any).staffUser = user;
    next();
  } catch {
    return res.status(401).json({ error: "Authentication required" });
  }
}

/* ── Helper: generate 30-min slots from availability ── */
function generateSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  let current = startH * 60 + startM;
  const end = endH * 60 + endM;

  while (current + 30 <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    current += 30;
  }
  return slots;
}

/* ── Helper: add 30 min to time string ── */
function addThirtyMin(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + 30;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
}

export function registerBookingRoutes(app: Express) {

  /* ═══════════════════════════════════════════
     CLIENT ENDPOINTS
     ═══════════════════════════════════════════ */

  /* ── POST /api/booking/register ── */
  app.post("/api/booking/register", async (req: Request, res: Response) => {
    const { fullName, email, phone, dateOfBirth, password } = req.body;

    if (!fullName || !email || !phone || !dateOfBirth || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      // Check if email already exists
      const [existing] = await db
        .select()
        .from(bookingClients)
        .where(eq(bookingClients.email, email.toLowerCase().trim()))
        .limit(1);

      if (existing) {
        return res.status(409).json({ error: "An account with this email already exists. Please log in." });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await db.insert(bookingClients).values({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        dateOfBirth: dateOfBirth.trim(),
        passwordHash,
      });

      const [newClient] = await db
        .select()
        .from(bookingClients)
        .where(eq(bookingClients.email, email.toLowerCase().trim()))
        .limit(1);

      const token = jwt.sign({ clientId: newClient.id, type: "booking" }, JWT_SECRET, {
        expiresIn: "30d",
      });

      return res.json({
        token,
        client: {
          id: newClient.id,
          fullName: newClient.fullName,
          email: newClient.email,
          phone: newClient.phone,
          hasCardOnFile: newClient.hasCardOnFile,
        },
      });
    } catch (err: any) {
      console.error("[Booking] Register error:", err);
      return res.status(500).json({ error: "Registration failed" });
    }
  });

  /* ── POST /api/booking/login ── */
  app.post("/api/booking/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const [client] = await db
        .select()
        .from(bookingClients)
        .where(eq(bookingClients.email, email.toLowerCase().trim()))
        .limit(1);

      if (!client) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const valid = await bcrypt.compare(password, client.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign({ clientId: client.id, type: "booking" }, JWT_SECRET, {
        expiresIn: "30d",
      });

      return res.json({
        token,
        client: {
          id: client.id,
          fullName: client.fullName,
          email: client.email,
          phone: client.phone,
          hasCardOnFile: client.hasCardOnFile,
        },
      });
    } catch (err: any) {
      console.error("[Booking] Login error:", err);
      return res.status(500).json({ error: "Login failed" });
    }
  });

  /* ── GET /api/booking/me ── */
  app.get("/api/booking/me", bookingAuth, async (req: BookingAuthRequest, res: Response) => {
    const c = req.bookingClient!;
    return res.json({
      id: c.id,
      fullName: c.fullName,
      email: c.email,
      phone: c.phone,
      dateOfBirth: c.dateOfBirth,
      hasCardOnFile: c.hasCardOnFile,
    });
  });

  /* ── GET /api/booking/staff ── */
  app.get("/api/booking/staff", async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const staff = await db
        .select({
          id: bookingStaff.id,
          name: bookingStaff.name,
          title: bookingStaff.title,
        })
        .from(bookingStaff)
        .where(eq(bookingStaff.isActive, 1));

      return res.json(staff);
    } catch (err: any) {
      console.error("[Booking] Staff list error:", err);
      return res.status(500).json({ error: "Failed to load staff" });
    }
  });

  /* ── GET /api/booking/slots?date=YYYY-MM-DD&staffId=N ── */
  app.get("/api/booking/slots", async (req: Request, res: Response) => {
    const { date, staffId } = req.query;
    if (!date || !staffId) {
      return res.status(400).json({ error: "date and staffId are required" });
    }

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      // Get day of week for the requested date (0=Sun, 6=Sat)
      const dateObj = new Date(date as string + "T12:00:00");
      const dayOfWeek = dateObj.getDay();

      // Get staff availability for this day
      const availability = await db
        .select()
        .from(bookingAvailability)
        .where(
          and(
            eq(bookingAvailability.staffId, Number(staffId)),
            eq(bookingAvailability.dayOfWeek, dayOfWeek)
          )
        );

      if (availability.length === 0) {
        return res.json([]);
      }

      // Generate all possible 30-min slots
      let allSlots: string[] = [];
      for (const block of availability) {
        allSlots = allSlots.concat(generateSlots(block.startTime, block.endTime));
      }

      // Get existing appointments for this date & staff (confirmed only)
      const existingAppts = await db
        .select()
        .from(bookingAppointments)
        .where(
          and(
            eq(bookingAppointments.staffId, Number(staffId)),
            eq(bookingAppointments.appointmentDate, date as string),
            ne(bookingAppointments.status, "cancelled")
          )
        );

      const bookedTimes = new Set(existingAppts.map((a) => a.startTime));

      // Filter out booked slots
      const availableSlots = allSlots.filter((slot) => !bookedTimes.has(slot));

      return res.json(availableSlots);
    } catch (err: any) {
      console.error("[Booking] Slots error:", err);
      return res.status(500).json({ error: "Failed to load slots" });
    }
  });

  /* ── POST /api/booking/setup-card ── */
  app.post("/api/booking/setup-card", bookingAuth, async (req: BookingAuthRequest, res: Response) => {
    const client = req.bookingClient!;
    const stripe = getStripe();
    if (!stripe) return res.status(500).json({ error: "Payment system unavailable" });

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      let customerId = client.stripeCustomerId;

      // Create Stripe customer if not exists
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: client.email,
          name: client.fullName,
          phone: client.phone,
          metadata: { bookingClientId: client.id.toString() },
        });
        customerId = customer.id;

        await db
          .update(bookingClients)
          .set({ stripeCustomerId: customerId })
          .where(eq(bookingClients.id, client.id));
      }

      // Create SetupIntent (no charge)
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ["card"],
        metadata: {
          bookingClientId: client.id.toString(),
          purpose: "card_on_file",
        },
      });

      return res.json({
        clientSecret: setupIntent.client_secret,
        customerId,
      });
    } catch (err: any) {
      console.error("[Booking] Setup card error:", err);
      return res.status(500).json({ error: "Failed to set up card" });
    }
  });

  /* ── POST /api/booking/confirm-card ── */
  app.post("/api/booking/confirm-card", bookingAuth, async (req: BookingAuthRequest, res: Response) => {
    const client = req.bookingClient!;

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      await db
        .update(bookingClients)
        .set({ hasCardOnFile: 1 })
        .where(eq(bookingClients.id, client.id));

      return res.json({ success: true });
    } catch (err: any) {
      console.error("[Booking] Confirm card error:", err);
      return res.status(500).json({ error: "Failed to confirm card" });
    }
  });

  /* ── POST /api/booking/appointments ── */
  app.post("/api/booking/appointments", bookingAuth, async (req: BookingAuthRequest, res: Response) => {
    const client = req.bookingClient!;
    const { staffId, date, startTime, service, notes } = req.body;

    if (!staffId || !date || !startTime) {
      return res.status(400).json({ error: "staffId, date, and startTime are required" });
    }

    // Require card on file
    if (!client.hasCardOnFile) {
      return res.status(400).json({ error: "A credit card on file is required to book an appointment" });
    }

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      // Double-booking check
      const [conflict] = await db
        .select()
        .from(bookingAppointments)
        .where(
          and(
            eq(bookingAppointments.staffId, Number(staffId)),
            eq(bookingAppointments.appointmentDate, date),
            eq(bookingAppointments.startTime, startTime),
            ne(bookingAppointments.status, "cancelled")
          )
        )
        .limit(1);

      if (conflict) {
        return res.status(409).json({ error: "This time slot is no longer available" });
      }

      const endTime = addThirtyMin(startTime);

      // Get the default payment method for the customer
      let paymentMethodId: string | null = null;
      const stripe = getStripe();
      if (stripe && client.stripeCustomerId) {
        try {
          const methods = await stripe.paymentMethods.list({
            customer: client.stripeCustomerId,
            type: "card",
            limit: 1,
          });
          if (methods.data.length > 0) {
            paymentMethodId = methods.data[0].id;
          }
        } catch (e) {
          console.warn("[Booking] Could not fetch payment method:", e);
        }
      }

      await db.insert(bookingAppointments).values({
        clientId: client.id,
        staffId: Number(staffId),
        appointmentDate: date,
        startTime,
        endTime,
        service: service || null,
        notes: notes || null,
        stripePaymentMethodId: paymentMethodId,
      });

      return res.json({ success: true, message: "Appointment booked successfully" });
    } catch (err: any) {
      console.error("[Booking] Book appointment error:", err);
      return res.status(500).json({ error: "Failed to book appointment" });
    }
  });

  /* ── GET /api/booking/my-appointments ── */
  app.get("/api/booking/my-appointments", bookingAuth, async (req: BookingAuthRequest, res: Response) => {
    const client = req.bookingClient!;

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const appointments = await db
        .select({
          id: bookingAppointments.id,
          appointmentDate: bookingAppointments.appointmentDate,
          startTime: bookingAppointments.startTime,
          endTime: bookingAppointments.endTime,
          service: bookingAppointments.service,
          status: bookingAppointments.status,
          staffName: bookingStaff.name,
          staffTitle: bookingStaff.title,
          createdAt: bookingAppointments.createdAt,
        })
        .from(bookingAppointments)
        .leftJoin(bookingStaff, eq(bookingAppointments.staffId, bookingStaff.id))
        .where(eq(bookingAppointments.clientId, client.id))
        .orderBy(desc(bookingAppointments.appointmentDate));

      return res.json(appointments);
    } catch (err: any) {
      console.error("[Booking] My appointments error:", err);
      return res.status(500).json({ error: "Failed to load appointments" });
    }
  });

  /* ── POST /api/booking/cancel/:id ── */
  app.post("/api/booking/cancel/:id", bookingAuth, async (req: BookingAuthRequest, res: Response) => {
    const client = req.bookingClient!;
    const apptId = Number(req.params.id);

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const [appt] = await db
        .select()
        .from(bookingAppointments)
        .where(
          and(
            eq(bookingAppointments.id, apptId),
            eq(bookingAppointments.clientId, client.id)
          )
        )
        .limit(1);

      if (!appt) return res.status(404).json({ error: "Appointment not found" });
      if (appt.status !== "confirmed") {
        return res.status(400).json({ error: "Only confirmed appointments can be cancelled" });
      }

      await db
        .update(bookingAppointments)
        .set({ status: "cancelled" })
        .where(eq(bookingAppointments.id, apptId));

      return res.json({ success: true });
    } catch (err: any) {
      console.error("[Booking] Cancel error:", err);
      return res.status(500).json({ error: "Failed to cancel appointment" });
    }
  });

  /* ═══════════════════════════════════════════
     STAFF / ADMIN ENDPOINTS
     ═══════════════════════════════════════════ */

  /* ── GET /api/booking/admin/staff ── */
  app.get("/api/booking/admin/staff", staffAuth, async (_req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const staff = await db.select().from(bookingStaff).orderBy(asc(bookingStaff.name));
      return res.json(staff);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to load staff" });
    }
  });

  /* ── POST /api/booking/admin/staff ── */
  app.post("/api/booking/admin/staff", staffAuth, async (req: Request, res: Response) => {
    const { name, email, title } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email required" });

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      await db.insert(bookingStaff).values({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        title: title?.trim() || null,
      });

      return res.json({ success: true });
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Staff member with this email already exists" });
      }
      return res.status(500).json({ error: "Failed to add staff" });
    }
  });

  /* ── PUT /api/booking/admin/staff/:id ── */
  app.put("/api/booking/admin/staff/:id", staffAuth, async (req: Request, res: Response) => {
    const staffId = Number(req.params.id);
    const { name, email, title, isActive } = req.body;

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (email !== undefined) updateData.email = email.toLowerCase().trim();
      if (title !== undefined) updateData.title = title?.trim() || null;
      if (isActive !== undefined) updateData.isActive = isActive ? 1 : 0;

      await db.update(bookingStaff).set(updateData).where(eq(bookingStaff.id, staffId));
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to update staff" });
    }
  });

  /* ── DELETE /api/booking/admin/staff/:id ── */
  app.delete("/api/booking/admin/staff/:id", staffAuth, async (req: Request, res: Response) => {
    const staffId = Number(req.params.id);

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      await db.update(bookingStaff).set({ isActive: 0 }).where(eq(bookingStaff.id, staffId));
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to deactivate staff" });
    }
  });

  /* ── GET /api/booking/admin/availability/:staffId ── */
  app.get("/api/booking/admin/availability/:staffId", staffAuth, async (req: Request, res: Response) => {
    const staffId = Number(req.params.staffId);

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const avail = await db
        .select()
        .from(bookingAvailability)
        .where(eq(bookingAvailability.staffId, staffId))
        .orderBy(asc(bookingAvailability.dayOfWeek), asc(bookingAvailability.startTime));

      return res.json(avail);
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to load availability" });
    }
  });

  /* ── POST /api/booking/admin/availability ── */
  app.post("/api/booking/admin/availability", staffAuth, async (req: Request, res: Response) => {
    const { staffId, dayOfWeek, startTime, endTime } = req.body;
    if (staffId === undefined || dayOfWeek === undefined || !startTime || !endTime) {
      return res.status(400).json({ error: "staffId, dayOfWeek, startTime, and endTime are required" });
    }

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      await db.insert(bookingAvailability).values({
        staffId: Number(staffId),
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
      });

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to add availability" });
    }
  });

  /* ── DELETE /api/booking/admin/availability/:id ── */
  app.delete("/api/booking/admin/availability/:id", staffAuth, async (req: Request, res: Response) => {
    const availId = Number(req.params.id);

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      await db.delete(bookingAvailability).where(eq(bookingAvailability.id, availId));
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to remove availability" });
    }
  });

  /* ── GET /api/booking/admin/appointments?date=&staffId=&status= ── */
  app.get("/api/booking/admin/appointments", staffAuth, async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const conditions: any[] = [];
      if (req.query.date) {
        conditions.push(eq(bookingAppointments.appointmentDate, req.query.date as string));
      }
      if (req.query.staffId) {
        conditions.push(eq(bookingAppointments.staffId, Number(req.query.staffId)));
      }
      if (req.query.status) {
        conditions.push(eq(bookingAppointments.status, req.query.status as any));
      }

      const query = db
        .select({
          id: bookingAppointments.id,
          appointmentDate: bookingAppointments.appointmentDate,
          startTime: bookingAppointments.startTime,
          endTime: bookingAppointments.endTime,
          service: bookingAppointments.service,
          notes: bookingAppointments.notes,
          status: bookingAppointments.status,
          noShowChargeAmount: bookingAppointments.noShowChargeAmount,
          clientName: bookingClients.fullName,
          clientEmail: bookingClients.email,
          clientPhone: bookingClients.phone,
          staffName: bookingStaff.name,
          staffId: bookingAppointments.staffId,
          createdAt: bookingAppointments.createdAt,
        })
        .from(bookingAppointments)
        .leftJoin(bookingClients, eq(bookingAppointments.clientId, bookingClients.id))
        .leftJoin(bookingStaff, eq(bookingAppointments.staffId, bookingStaff.id))
        .orderBy(desc(bookingAppointments.appointmentDate), asc(bookingAppointments.startTime));

      const appointments = conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

      return res.json(appointments);
    } catch (err: any) {
      console.error("[Booking] Admin appointments error:", err);
      return res.status(500).json({ error: "Failed to load appointments" });
    }
  });

  /* ── POST /api/booking/admin/no-show/:id ── */
  app.post("/api/booking/admin/no-show/:id", staffAuth, async (req: Request, res: Response) => {
    const apptId = Number(req.params.id);
    const { chargeAmount } = req.body; // amount in cents

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      const [appt] = await db
        .select()
        .from(bookingAppointments)
        .where(eq(bookingAppointments.id, apptId))
        .limit(1);

      if (!appt) return res.status(404).json({ error: "Appointment not found" });

      // Mark as no-show
      await db
        .update(bookingAppointments)
        .set({ status: "no_show", noShowChargeAmount: chargeAmount || null })
        .where(eq(bookingAppointments.id, apptId));

      // Charge the card if amount provided and payment method exists
      if (chargeAmount && appt.stripePaymentMethodId) {
        const stripe = getStripe();
        if (stripe) {
          // Get client's Stripe customer ID
          const [client] = await db
            .select()
            .from(bookingClients)
            .where(eq(bookingClients.id, appt.clientId))
            .limit(1);

          if (client?.stripeCustomerId) {
            try {
              await stripe.paymentIntents.create({
                amount: chargeAmount,
                currency: "usd",
                customer: client.stripeCustomerId,
                payment_method: appt.stripePaymentMethodId,
                off_session: true,
                confirm: true,
                description: `No-show fee for appointment on ${appt.appointmentDate}`,
                metadata: {
                  appointmentId: appt.id.toString(),
                  type: "no_show_fee",
                },
              });
            } catch (chargeErr: any) {
              console.error("[Booking] No-show charge failed:", chargeErr);
              return res.json({
                success: true,
                charged: false,
                message: "Marked as no-show but card charge failed",
              });
            }
          }
        }
      }

      return res.json({ success: true, charged: !!chargeAmount });
    } catch (err: any) {
      console.error("[Booking] No-show error:", err);
      return res.status(500).json({ error: "Failed to process no-show" });
    }
  });

  /* ── POST /api/booking/admin/complete/:id ── */
  app.post("/api/booking/admin/complete/:id", staffAuth, async (req: Request, res: Response) => {
    const apptId = Number(req.params.id);

    try {
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "Database unavailable" });

      await db
        .update(bookingAppointments)
        .set({ status: "completed" })
        .where(eq(bookingAppointments.id, apptId));

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to complete appointment" });
    }
  });
}
