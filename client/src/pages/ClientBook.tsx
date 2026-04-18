/**
 * ClientBook — Standalone booking page.
 * Multi-step flow: Select Staff → Select Date/Time → Create Account/Login → Add Card → Confirm
 * No EMR integration. Simple, clean, mobile-first.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Clock, MapPin, Phone, User, Mail,
  CreditCard, ChevronLeft, ChevronRight, Check,
  Loader2, Eye, EyeOff, Lock, AlertCircle, Calendar,
  ArrowRight, Shield, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/IMG_2517_3c23507d.PNG";

const stripePromise = loadStripe(
  (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

const C = {
  gold: "#B8964A",
  goldLight: "#C4A882",
  ivory: "#FAF7F2",
  charcoal: "#2C2C2C",
  charcoalLight: "#4A4A4A",
};

const API_BASE = "";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Step = "provider" | "datetime" | "account" | "card" | "confirm" | "success";

interface StaffMember {
  id: number;
  name: string;
  title: string | null;
}

interface BookingClient {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  hasCardOnFile: number;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(dateStr: string): string {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const date = new Date(y, mo - 1, d);
  return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${d}, ${y}`;
}

/* ── Card Form Component ── */
function CardForm({
  onSuccess,
  onBack,
  token,
}: {
  onSuccess: () => void;
  onBack: () => void;
  token: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    try {
      // Get SetupIntent client secret from server
      const res = await fetch(`${API_BASE}/api/booking/setup-card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set up card");

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError } = await stripe.confirmCardSetup(data.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (stripeError) throw new Error(stripeError.message);

      // Confirm card on file in our system
      await fetch(`${API_BASE}/api/booking/confirm-card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to save card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 rounded-xl border bg-white" style={{ borderColor: C.gold + "20" }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4" style={{ color: C.gold }} />
          <span className="text-xs font-medium" style={{ color: C.charcoal }}>
            Secure Card Storage
          </span>
        </div>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: C.charcoal,
                fontFamily: "'Inter', sans-serif",
                "::placeholder": { color: C.charcoalLight + "60" },
              },
            },
          }}
        />
      </div>

      <div
        className="p-4 rounded-xl text-xs leading-relaxed"
        style={{ background: C.gold + "08", color: C.charcoalLight }}
      >
        <p className="font-medium mb-1" style={{ color: C.charcoal }}>
          Cancellation & No-Show Policy
        </p>
        <p>
          A valid card is required to reserve your appointment. <strong>Your card will not be
          charged at the time of booking.</strong> It will only be charged in the event of a
          no-call/no-show or violation of the cancellation policy (less than 24 hours notice).
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-lg text-sm border bg-white"
          style={{ borderColor: C.gold + "30", color: C.charcoal }}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={loading || !stripe}
          className="flex-1 py-3 rounded-lg text-sm font-medium text-white"
          style={{ background: C.gold }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>
              <CreditCard className="w-4 h-4 mr-1" />
              Save Card
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function ClientBook() {
  const [step, setStep] = useState<Step>("provider");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [service, setService] = useState("");

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // Auth state
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [token, setToken] = useState(() => localStorage.getItem("booking_token") || "");
  const [client, setClient] = useState<BookingClient | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Registration fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Booking state
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Load staff on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/booking/staff`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setStaff(data);
      })
      .catch(console.error);
  }, []);

  // Check existing token
  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/api/booking/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => {
          if (!r.ok) throw new Error("Invalid token");
          return r.json();
        })
        .then((data) => setClient(data))
        .catch(() => {
          setToken("");
          localStorage.removeItem("booking_token");
        });
    }
  }, [token]);

  // Load slots when date or staff changes
  useEffect(() => {
    if (!selectedDate || !selectedStaff) return;
    setLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedTime("");

    fetch(`${API_BASE}/api/booking/slots?date=${selectedDate}&staffId=${selectedStaff.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAvailableSlots(data);
      })
      .catch(console.error)
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, selectedStaff]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const endpoint = authMode === "register" ? "/api/booking/register" : "/api/booking/login";
      const body =
        authMode === "register"
          ? { fullName, email, phone, dateOfBirth: dob, password }
          : { email, password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      setToken(data.token);
      localStorage.setItem("booking_token", data.token);
      setClient(data.client);

      // Skip card step if already has card on file
      if (data.client.hasCardOnFile) {
        setStep("confirm");
      } else {
        setStep("card");
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedStaff || !selectedDate || !selectedTime) return;
    setBookingLoading(true);
    setBookingError("");

    try {
      const res = await fetch(`${API_BASE}/api/booking/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          staffId: selectedStaff.id,
          date: selectedDate,
          startTime: selectedTime,
          service: service || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      setStep("success");
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCardSuccess = () => {
    setClient((prev) => (prev ? { ...prev, hasCardOnFile: 1 } : prev));
    setStep("confirm");
  };

  // Calendar helpers
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarDays = [];
  const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
  const firstDay = getFirstDayOfMonth(calendarMonth, calendarYear);

  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const isDatePast = (day: number) => {
    const date = new Date(calendarYear, calendarMonth, day);
    return date < today;
  };

  const formatDateStr = (day: number) => {
    const m = (calendarMonth + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    return `${calendarYear}-${m}-${d}`;
  };

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const isPrevDisabled =
    calendarYear === today.getFullYear() && calendarMonth <= today.getMonth();

  /* ── Step indicator ── */
  const steps: { key: Step; label: string }[] = [
    { key: "provider", label: "Provider" },
    { key: "datetime", label: "Date & Time" },
    { key: "account", label: "Account" },
    { key: "card", label: "Card" },
    { key: "confirm", label: "Confirm" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen pb-24" style={{ background: C.ivory }}>
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.charcoalLight} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, ${C.gold}30 0%, transparent 50%)`,
            }}
          />
        </div>
        <div className="relative px-5 pt-10 pb-6 text-center">
          <img src={LOGO_URL} alt="RadiantilyK" className="w-10 h-10 rounded-full mx-auto mb-3" />
          <h1
            className="text-xl tracking-wider mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "white", fontWeight: 400 }}
          >
            Book Your Appointment
          </h1>
          <p className="text-white/50 text-xs">
            RadiantilyK Aesthetic
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      {step !== "success" && (
        <div className="px-5 py-4">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors"
                    style={{
                      background: i <= currentStepIndex ? C.gold : C.gold + "15",
                      color: i <= currentStepIndex ? "white" : C.gold,
                    }}
                  >
                    {i < currentStepIndex ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className="text-[10px] mt-1 hidden sm:block"
                    style={{ color: i <= currentStepIndex ? C.charcoal : C.charcoalLight + "60" }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="w-6 sm:w-10 h-0.5 mx-1"
                    style={{ background: i < currentStepIndex ? C.gold : C.gold + "20" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 py-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* ═══ STEP 1: Select Provider ═══ */}
          {step === "provider" && (
            <motion.div
              key="provider"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2
                className="text-lg"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
              >
                Select Your Provider
              </h2>

              {staff.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: C.gold }} />
                  <p className="text-sm" style={{ color: C.charcoalLight + "80" }}>
                    No providers available at this time.
                  </p>
                  <p className="text-xs mt-1" style={{ color: C.charcoalLight + "60" }}>
                    Please call us at (510) 990-1444 to schedule.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {staff.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStaff(s);
                        setStep("datetime");
                      }}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border transition-all hover:shadow-sm"
                      style={{
                        borderColor: selectedStaff?.id === s.id ? C.gold : C.gold + "15",
                        boxShadow: selectedStaff?.id === s.id ? `0 0 0 2px ${C.gold}30` : undefined,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: C.gold + "15" }}
                      >
                        <User className="w-6 h-6" style={{ color: C.gold }} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                          {s.name}
                        </p>
                        {s.title && (
                          <p className="text-xs mt-0.5" style={{ color: C.charcoalLight + "70" }}>
                            {s.title}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4" style={{ color: C.gold }} />
                    </button>
                  ))}

                  {/* Any Provider option */}
                  {staff.length > 1 && (
                    <button
                      onClick={() => {
                        setSelectedStaff(staff[0]); // default to first
                        setStep("datetime");
                      }}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-sm"
                      style={{ background: C.gold + "05", borderColor: C.gold + "20" }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: C.gold + "10" }}
                      >
                        <CalendarDays className="w-6 h-6" style={{ color: C.gold }} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                          First Available
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: C.charcoalLight + "70" }}>
                          See the earliest open time
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4" style={{ color: C.gold }} />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ STEP 2: Date & Time ═══ */}
          {step === "datetime" && (
            <motion.div
              key="datetime"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => setStep("provider")}>
                  <ChevronLeft className="w-5 h-5" style={{ color: C.charcoal }} />
                </button>
                <h2
                  className="text-lg"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
                >
                  Select Date & Time
                </h2>
              </div>

              {selectedStaff && (
                <div className="flex items-center gap-2 text-xs" style={{ color: C.charcoalLight + "80" }}>
                  <User className="w-3.5 h-3.5" style={{ color: C.gold }} />
                  <span>with {selectedStaff.name}</span>
                </div>
              )}

              {/* Service (optional) */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: C.charcoal }}>
                  Service (optional)
                </label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="e.g., Botox, Consultation, Facial..."
                  className="w-full px-4 py-3 rounded-lg border text-sm bg-white outline-none focus:ring-2"
                  style={{
                    borderColor: C.gold + "20",
                    color: C.charcoal,
                    // @ts-ignore
                    "--tw-ring-color": C.gold + "40",
                  }}
                />
              </div>

              {/* Calendar */}
              <div className="bg-white rounded-xl border p-4" style={{ borderColor: C.gold + "15" }}>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevMonth}
                    disabled={isPrevDisabled}
                    className="p-1 rounded-full disabled:opacity-30"
                  >
                    <ChevronLeft className="w-5 h-5" style={{ color: C.charcoal }} />
                  </button>
                  <span className="text-sm font-medium" style={{ color: C.charcoal }}>
                    {MONTHS[calendarMonth]} {calendarYear}
                  </span>
                  <button onClick={nextMonth} className="p-1 rounded-full">
                    <ChevronRight className="w-5 h-5" style={{ color: C.charcoal }} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-[10px] font-medium py-1"
                      style={{ color: C.charcoalLight + "60" }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} />;
                    const dateStr = formatDateStr(day);
                    const past = isDatePast(day);
                    const selected = selectedDate === dateStr;

                    return (
                      <button
                        key={day}
                        disabled={past}
                        onClick={() => setSelectedDate(dateStr)}
                        className="aspect-square rounded-full flex items-center justify-center text-xs transition-all disabled:opacity-30"
                        style={{
                          background: selected ? C.gold : "transparent",
                          color: selected ? "white" : past ? C.charcoalLight + "40" : C.charcoal,
                          fontWeight: selected ? 600 : 400,
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <p className="text-xs font-medium mb-3" style={{ color: C.charcoal }}>
                    Available Times — {formatDate(selectedDate)}
                  </p>

                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: C.gold }} />
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-6 rounded-xl bg-white border" style={{ borderColor: C.gold + "10" }}>
                      <Clock className="w-6 h-6 mx-auto mb-2 opacity-30" style={{ color: C.gold }} />
                      <p className="text-xs" style={{ color: C.charcoalLight + "70" }}>
                        No available times for this date.
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: C.charcoalLight + "50" }}>
                        Try another date or provider.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className="py-2.5 rounded-lg border text-xs font-medium transition-all"
                          style={{
                            background: selectedTime === slot ? C.gold : "white",
                            borderColor: selectedTime === slot ? C.gold : C.gold + "20",
                            color: selectedTime === slot ? "white" : C.charcoal,
                          }}
                        >
                          {formatTime(slot)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedTime && (
                <Button
                  onClick={() => {
                    if (client && client.hasCardOnFile) {
                      setStep("confirm");
                    } else if (client) {
                      setStep("card");
                    } else {
                      setStep("account");
                    }
                  }}
                  className="w-full py-3 rounded-lg text-sm font-medium text-white"
                  style={{ background: C.gold }}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </motion.div>
          )}

          {/* ═══ STEP 3: Account ═══ */}
          {step === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => setStep("datetime")}>
                  <ChevronLeft className="w-5 h-5" style={{ color: C.charcoal }} />
                </button>
                <h2
                  className="text-lg"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
                >
                  {authMode === "register" ? "Create Account" : "Log In"}
                </h2>
              </div>

              <p className="text-xs" style={{ color: C.charcoalLight + "80" }}>
                {authMode === "register"
                  ? "Create a quick account to book your appointment."
                  : "Welcome back! Log in to continue booking."}
              </p>

              <form onSubmit={handleAuth} className="space-y-3">
                {authMode === "register" && (
                  <>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: C.charcoal }}>
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.charcoalLight + "50" }} />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          placeholder="Jane Doe"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm bg-white outline-none focus:ring-2"
                          style={{ borderColor: C.gold + "20" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: C.charcoal }}>
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.charcoalLight + "50" }} />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          placeholder="(555) 123-4567"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm bg-white outline-none focus:ring-2"
                          style={{ borderColor: C.gold + "20" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: C.charcoal }}>
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.charcoalLight + "50" }} />
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm bg-white outline-none focus:ring-2"
                          style={{ borderColor: C.gold + "20", color: C.charcoal }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: C.charcoal }}>
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.charcoalLight + "50" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="jane@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm bg-white outline-none focus:ring-2"
                      style={{ borderColor: C.gold + "20" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: C.charcoal }}>
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.charcoalLight + "50" }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-10 py-3 rounded-lg border text-sm bg-white outline-none focus:ring-2"
                      style={{ borderColor: C.gold + "20" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" style={{ color: C.charcoalLight + "50" }} />
                      ) : (
                        <Eye className="w-4 h-4" style={{ color: C.charcoalLight + "50" }} />
                      )}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {authError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-lg text-sm font-medium text-white"
                  style={{ background: C.gold }}
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : authMode === "register" ? (
                    "Create Account & Continue"
                  ) : (
                    "Log In & Continue"
                  )}
                </Button>

                <p className="text-center text-xs" style={{ color: C.charcoalLight + "70" }}>
                  {authMode === "register" ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("login");
                          setAuthError("");
                        }}
                        className="font-medium underline"
                        style={{ color: C.gold }}
                      >
                        Log in
                      </button>
                    </>
                  ) : (
                    <>
                      New here?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("register");
                          setAuthError("");
                        }}
                        className="font-medium underline"
                        style={{ color: C.gold }}
                      >
                        Create account
                      </button>
                    </>
                  )}
                </p>
              </form>
            </motion.div>
          )}

          {/* ═══ STEP 4: Card on File ═══ */}
          {step === "card" && (
            <motion.div
              key="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => setStep("account")}>
                  <ChevronLeft className="w-5 h-5" style={{ color: C.charcoal }} />
                </button>
                <h2
                  className="text-lg"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
                >
                  Card on File
                </h2>
              </div>

              <p className="text-xs" style={{ color: C.charcoalLight + "80" }}>
                A credit card is required to hold your appointment. You will <strong>not</strong> be charged.
              </p>

              <Elements stripe={stripePromise}>
                <CardForm
                  token={token}
                  onSuccess={handleCardSuccess}
                  onBack={() => setStep("account")}
                />
              </Elements>
            </motion.div>
          )}

          {/* ═══ STEP 5: Confirm ═══ */}
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => setStep("datetime")}>
                  <ChevronLeft className="w-5 h-5" style={{ color: C.charcoal }} />
                </button>
                <h2
                  className="text-lg"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
                >
                  Confirm Appointment
                </h2>
              </div>

              <div className="bg-white rounded-xl border p-5 space-y-4" style={{ borderColor: C.gold + "15" }}>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" style={{ color: C.gold }} />
                  <div>
                    <p className="text-xs" style={{ color: C.charcoalLight + "60" }}>Provider</p>
                    <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                      {selectedStaff?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4" style={{ color: C.gold }} />
                  <div>
                    <p className="text-xs" style={{ color: C.charcoalLight + "60" }}>Date</p>
                    <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                      {selectedDate && formatDate(selectedDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" style={{ color: C.gold }} />
                  <div>
                    <p className="text-xs" style={{ color: C.charcoalLight + "60" }}>Time</p>
                    <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                      {selectedTime && formatTime(selectedTime)}
                    </p>
                  </div>
                </div>

                {service && (
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-4 h-4" style={{ color: C.gold }} />
                    <div>
                      <p className="text-xs" style={{ color: C.charcoalLight + "60" }}>Service</p>
                      <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                        {service}
                      </p>
                    </div>
                  </div>
                )}

                {client && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4" style={{ color: C.gold }} />
                    <div>
                      <p className="text-xs" style={{ color: C.charcoalLight + "60" }}>Booked by</p>
                      <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                        {client.fullName} ({client.email})
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4" style={{ color: C.gold }} />
                  <div>
                    <p className="text-xs" style={{ color: C.charcoalLight + "60" }}>Card on file</p>
                    <p className="text-sm font-medium" style={{ color: "#16a34a" }}>
                      <Check className="w-3.5 h-3.5 inline mr-1" />
                      Saved (not charged)
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-4 rounded-xl text-xs leading-relaxed"
                style={{ background: C.gold + "08", color: C.charcoalLight }}
              >
                <p>
                  By confirming, you agree that your appointment is a request subject to provider
                  confirmation. Your card will <strong>not</strong> be charged. It is held only for
                  no-call/no-show or late cancellation (less than 24 hours notice).
                </p>
              </div>

              {bookingError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {bookingError}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep("datetime")}
                  className="flex-1 py-3 rounded-lg text-sm border bg-white"
                  style={{ borderColor: C.gold + "30", color: C.charcoal }}
                >
                  Edit
                </Button>
                <Button
                  onClick={handleBook}
                  disabled={bookingLoading}
                  className="flex-1 py-3 rounded-lg text-sm font-medium text-white"
                  style={{ background: C.gold }}
                >
                  {bookingLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ═══ SUCCESS ═══ */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-5"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "#16a34a20" }}
              >
                <Check className="w-8 h-8" style={{ color: "#16a34a" }} />
              </div>

              <div>
                <h2
                  className="text-xl mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
                >
                  Appointment Requested!
                </h2>
                <p className="text-xs" style={{ color: C.charcoalLight + "80" }}>
                  Your appointment request has been submitted. You'll receive a confirmation
                  once your provider approves it.
                </p>
              </div>

              <div className="bg-white rounded-xl border p-5 text-left space-y-3" style={{ borderColor: C.gold + "15" }}>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" style={{ color: C.gold }} />
                  <span className="text-sm" style={{ color: C.charcoal }}>
                    {selectedStaff?.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-4 h-4" style={{ color: C.gold }} />
                  <span className="text-sm" style={{ color: C.charcoal }}>
                    {selectedDate && formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" style={{ color: C.gold }} />
                  <span className="text-sm" style={{ color: C.charcoal }}>
                    {selectedTime && formatTime(selectedTime)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSelectedDate("");
                    setSelectedTime("");
                    setService("");
                    setBookingError("");
                    setStep("provider");
                  }}
                  className="w-full py-3 rounded-lg text-sm font-medium text-white"
                  style={{ background: C.gold }}
                >
                  Book Another Appointment
                </Button>

                <div className="space-y-2 text-xs" style={{ color: C.charcoalLight + "70" }}>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-3.5 h-3.5" style={{ color: C.gold }} />
                    <a href="tel:+15109901444" className="underline">(510) 990-1444</a>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-3.5 h-3.5" style={{ color: C.gold }} />
                    <span>39180 Farwell Dr, Ste 110, Fremont, CA</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
