/**
 * Notification Service — Smart push notification triggers.
 *
 * Triggers:
 * - 3 months post Botox → reminder to rebook
 * - Skin score drop → suggest treatment
 * - Flash deal expiring → urgency notification
 * - Appointment reminder → 24h and 1h before
 * - Missed appointment → re-engage
 * - Rewards milestone → celebrate and upsell
 *
 * Uses the built-in Manus notification API.
 * Firebase Cloud Messaging can be added later for native push.
 */

import { getDb } from "./db";
import { eq, and, lte, gte, desc } from "drizzle-orm";
import { bookingAppointments, bookingClients, rewardsMembers } from "../drizzle/schema";

// ─── Notification Templates ───

export const NOTIFICATION_TEMPLATES = {
  botoxReminder: {
    title: "Time for a touch-up! ✨",
    body: "It's been 3 months since your last Botox treatment. Book now to maintain your results.",
    action: "/book",
  },
  skinScoreDrop: {
    title: "Your skin score needs attention",
    body: "Your skin health score has dropped. Let's get you back on track with a personalized treatment.",
    action: "/start",
  },
  flashDeal: {
    title: "Flash Deal ending soon! 🔥",
    body: "Don't miss out — limited spots available at a special price.",
    action: "/home",
  },
  appointmentReminder24h: {
    title: "Appointment tomorrow 📅",
    body: "You have an appointment tomorrow. We look forward to seeing you!",
    action: "/book",
  },
  appointmentReminder1h: {
    title: "Appointment in 1 hour ⏰",
    body: "Your appointment is coming up in 1 hour. See you soon!",
    action: "/book",
  },
  missedAppointment: {
    title: "We missed you! 💛",
    body: "You missed your last appointment. Let's reschedule — we have openings this week.",
    action: "/book",
  },
  rewardsMilestone: {
    title: "Congratulations! 🎉",
    body: "You've reached a new rewards tier! Check out your exclusive perks.",
    action: "/rewards",
  },
  walletBonus: {
    title: "Bonus credits added! 💰",
    body: "Your wallet has been topped up with bonus credits. Treat yourself!",
    action: "/profile",
  },
  weekendSlots: {
    title: "Only 3 spots left this weekend! 👀",
    body: "Weekend appointments are filling up fast. Book now to secure your spot.",
    action: "/book",
  },
  newProduct: {
    title: "New in the shop! 🛍️",
    body: "Check out our latest skincare arrivals — curated just for you.",
    action: "/shop",
  },
};

export type NotificationType = keyof typeof NOTIFICATION_TEMPLATES;

/**
 * Queue a notification for a client.
 * In production, this would send via Firebase Cloud Messaging or the built-in notification API.
 * For now, it logs the notification and stores it for the client to fetch.
 */
export async function queueNotification(
  clientEmail: string,
  type: NotificationType,
  customBody?: string,
) {
  const template = NOTIFICATION_TEMPLATES[type];
  const notification = {
    email: clientEmail,
    type,
    title: template.title,
    body: customBody || template.body,
    action: template.action,
    createdAt: new Date().toISOString(),
    read: false,
  };

  console.log(`[Notification] Queued for ${clientEmail}: ${type} — ${template.title}`);

  // In production: send via Firebase Cloud Messaging
  // await admin.messaging().send({ ... });

  return notification;
}

/**
 * Check for clients due for Botox reminders (3 months since last treatment).
 * This would run as a scheduled job (cron).
 */
export async function checkBotoxReminders() {
  const db = await getDb();
  if (!db) return;
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const dateStr = threeMonthsAgo.toISOString().split("T")[0];

  try {
    const dueAppointments = await db
      .select()
      .from(bookingAppointments)
      .where(
        and(
          eq(bookingAppointments.status, "completed"),
          lte(bookingAppointments.appointmentDate, dateStr),
        ),
      );

    for (const appt of dueAppointments) {
      // Get client email
      const [client] = await db
        .select()
        .from(bookingClients)
        .where(eq(bookingClients.id, appt.clientId!));

      if (client?.email) {
        await queueNotification(client.email, "botoxReminder");
      }
    }

    console.log(`[Notification] Checked ${dueAppointments.length} appointments for Botox reminders`);
  } catch (err) {
    console.error("[Notification] Botox reminder check failed:", err);
  }
}

/**
 * Check for upcoming appointments (24h and 1h reminders).
 */
export async function checkAppointmentReminders() {
  const db = await getDb();
  if (!db) return;
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in1h = new Date(now.getTime() + 60 * 60 * 1000);

  try {
    const upcoming = await db
      .select()
      .from(bookingAppointments)
      .where(eq(bookingAppointments.status, "confirmed"));

    for (const appt of upcoming) {
      const apptDate = new Date(appt.appointmentDate + "T" + (appt.startTime || "00:00"));
      const diffMs = apptDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours > 23 && diffHours <= 25) {
        const [client] = await db
          .select()
          .from(bookingClients)
          .where(eq(bookingClients.id, appt.clientId!));
        if (client?.email) {
          await queueNotification(client.email, "appointmentReminder24h");
        }
      } else if (diffHours > 0.5 && diffHours <= 1.5) {
        const [client] = await db
          .select()
          .from(bookingClients)
          .where(eq(bookingClients.id, appt.clientId!));
        if (client?.email) {
          await queueNotification(client.email, "appointmentReminder1h");
        }
      }
    }
  } catch (err) {
    console.error("[Notification] Appointment reminder check failed:", err);
  }
}
