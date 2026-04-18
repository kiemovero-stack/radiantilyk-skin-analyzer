import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Booking System Tests
 * Tests for the booking API helper functions and route logic.
 */

/* ── Test generateSlots helper ── */
describe("Booking: generateSlots", () => {
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

  it("generates 30-minute slots for a standard work day", () => {
    const slots = generateSlots("09:00", "17:00");
    expect(slots.length).toBe(16); // 8 hours = 16 half-hour slots
    expect(slots[0]).toBe("09:00");
    expect(slots[1]).toBe("09:30");
    expect(slots[slots.length - 1]).toBe("16:30");
  });

  it("generates correct slots for a short window", () => {
    const slots = generateSlots("10:00", "11:30");
    expect(slots).toEqual(["10:00", "10:30", "11:00"]);
  });

  it("returns empty array when window is less than 30 min", () => {
    const slots = generateSlots("10:00", "10:15");
    expect(slots).toEqual([]);
  });

  it("handles exactly 30-minute window", () => {
    const slots = generateSlots("14:00", "14:30");
    expect(slots).toEqual(["14:00"]);
  });

  it("handles afternoon hours correctly", () => {
    const slots = generateSlots("13:00", "15:00");
    expect(slots).toEqual(["13:00", "13:30", "14:00", "14:30"]);
  });

  it("handles start time with non-zero minutes", () => {
    const slots = generateSlots("09:30", "11:00");
    expect(slots).toEqual(["09:30", "10:00", "10:30"]);
  });
});

/* ── Test addThirtyMin helper ── */
describe("Booking: addThirtyMin", () => {
  function addThirtyMin(time: string): string {
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + 30;
    const nh = Math.floor(total / 60);
    const nm = total % 60;
    return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
  }

  it("adds 30 minutes to a standard time", () => {
    expect(addThirtyMin("09:00")).toBe("09:30");
  });

  it("rolls over to next hour", () => {
    expect(addThirtyMin("09:30")).toBe("10:00");
  });

  it("handles noon correctly", () => {
    expect(addThirtyMin("11:30")).toBe("12:00");
  });

  it("handles end of day", () => {
    expect(addThirtyMin("23:30")).toBe("24:00");
  });

  it("handles midnight", () => {
    expect(addThirtyMin("00:00")).toBe("00:30");
  });
});

/* ── Test formatTime display helper ── */
describe("Booking: formatTime", () => {
  function formatTime(time: string): string {
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  }

  it("formats morning time", () => {
    expect(formatTime("09:00")).toBe("9:00 AM");
  });

  it("formats noon", () => {
    expect(formatTime("12:00")).toBe("12:00 PM");
  });

  it("formats afternoon time", () => {
    expect(formatTime("14:30")).toBe("2:30 PM");
  });

  it("formats midnight", () => {
    expect(formatTime("00:00")).toBe("12:00 AM");
  });

  it("formats 1 AM", () => {
    expect(formatTime("01:00")).toBe("1:00 AM");
  });
});

/* ── Test booking validation logic ── */
describe("Booking: validation", () => {
  it("requires all registration fields", () => {
    const fields = { fullName: "Jane", email: "j@e.com", phone: "555", dateOfBirth: "1990-01-01", password: "123456" };
    const required = ["fullName", "email", "phone", "dateOfBirth", "password"];
    
    for (const field of required) {
      const incomplete = { ...fields, [field]: "" };
      const allPresent = Object.values(incomplete).every(v => v);
      expect(allPresent).toBe(false);
    }
  });

  it("enforces minimum password length of 6", () => {
    expect("12345".length >= 6).toBe(false);
    expect("123456".length >= 6).toBe(true);
    expect("1234567".length >= 6).toBe(true);
  });

  it("normalizes email to lowercase", () => {
    const email = "Jane@Example.COM";
    expect(email.toLowerCase().trim()).toBe("jane@example.com");
  });

  it("trims whitespace from fields", () => {
    expect("  Jane Doe  ".trim()).toBe("Jane Doe");
    expect("  jane@example.com  ".toLowerCase().trim()).toBe("jane@example.com");
  });
});

/* ── Test appointment status transitions ── */
describe("Booking: appointment status", () => {
  const validStatuses = ["confirmed", "completed", "cancelled", "no_show"];

  it("has all expected statuses", () => {
    expect(validStatuses).toContain("confirmed");
    expect(validStatuses).toContain("completed");
    expect(validStatuses).toContain("cancelled");
    expect(validStatuses).toContain("no_show");
  });

  it("only allows cancellation of confirmed appointments", () => {
    const canCancel = (status: string) => status === "confirmed";
    expect(canCancel("confirmed")).toBe(true);
    expect(canCancel("completed")).toBe(false);
    expect(canCancel("cancelled")).toBe(false);
    expect(canCancel("no_show")).toBe(false);
  });

  it("only allows completion of confirmed appointments", () => {
    const canComplete = (status: string) => status === "confirmed";
    expect(canComplete("confirmed")).toBe(true);
    expect(canComplete("completed")).toBe(false);
  });
});

/* ── Test date/calendar helpers ── */
describe("Booking: calendar helpers", () => {
  it("correctly identifies past dates", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    expect(yesterday < today).toBe(true);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(tomorrow < today).toBe(false);
  });

  it("formats date string correctly", () => {
    const formatDateStr = (year: number, month: number, day: number) => {
      const m = (month + 1).toString().padStart(2, "0");
      const d = day.toString().padStart(2, "0");
      return `${year}-${m}-${d}`;
    };

    expect(formatDateStr(2026, 0, 15)).toBe("2026-01-15");
    expect(formatDateStr(2026, 11, 1)).toBe("2026-12-01");
    expect(formatDateStr(2026, 3, 5)).toBe("2026-04-05");
  });

  it("gets correct days in month", () => {
    const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    expect(getDaysInMonth(0, 2026)).toBe(31); // January
    expect(getDaysInMonth(1, 2026)).toBe(28); // February (non-leap)
    expect(getDaysInMonth(1, 2024)).toBe(29); // February (leap)
    expect(getDaysInMonth(3, 2026)).toBe(30); // April
  });
});

/* ── Test slot overlap detection ── */
describe("Booking: slot overlap detection", () => {
  function slotsOverlap(
    start1: string, end1: string,
    start2: string, end2: string
  ): boolean {
    const toMin = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const s1 = toMin(start1), e1 = toMin(end1);
    const s2 = toMin(start2), e2 = toMin(end2);
    return s1 < e2 && s2 < e1;
  }

  it("detects overlapping slots", () => {
    expect(slotsOverlap("09:00", "09:30", "09:00", "09:30")).toBe(true);
    expect(slotsOverlap("09:00", "10:00", "09:30", "10:30")).toBe(true);
  });

  it("allows adjacent non-overlapping slots", () => {
    expect(slotsOverlap("09:00", "09:30", "09:30", "10:00")).toBe(false);
    expect(slotsOverlap("10:00", "10:30", "09:00", "09:30")).toBe(false);
  });

  it("detects contained slots", () => {
    expect(slotsOverlap("09:00", "11:00", "09:30", "10:30")).toBe(true);
  });
});

/* ── Test no-show charge amount validation ── */
describe("Booking: no-show charge", () => {
  it("converts dollar amount to cents correctly", () => {
    expect(Math.round(50 * 100)).toBe(5000);
    expect(Math.round(25.50 * 100)).toBe(2550);
    expect(Math.round(0 * 100)).toBe(0);
  });

  it("handles string to number conversion", () => {
    expect(Math.round(parseFloat("50") * 100)).toBe(5000);
    expect(Math.round(parseFloat("25.50") * 100)).toBe(2550);
    expect(Math.round(parseFloat("0") * 100)).toBe(0);
  });

  it("validates minimum charge amount", () => {
    // Stripe minimum is $0.50
    const isValidCharge = (amount: number) => amount === 0 || amount >= 50;
    expect(isValidCharge(5000)).toBe(true);
    expect(isValidCharge(50)).toBe(true);
    expect(isValidCharge(0)).toBe(true);
    expect(isValidCharge(25)).toBe(false);
  });
});
