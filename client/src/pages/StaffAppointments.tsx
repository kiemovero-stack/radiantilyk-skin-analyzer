/**
 * StaffAppointments — Staff-facing appointment & availability management.
 * Tabs: Today's Schedule | All Appointments | Staff & Availability
 * Providers grouped by location (San Jose / San Mateo).
 * Each provider has their own weekly availability section.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Clock, User, Phone, Mail, Plus,
  ArrowLeft, ChevronDown,
  Loader2, Search, X, UserPlus, Calendar,
  Ban, Check, MapPin, Copy, CheckCircle,
} from "lucide-react";
import { useLocation } from "wouter";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface StaffMember {
  id: number;
  name: string;
  email: string;
  title: string | null;
  location: string | null;
  isActive: number;
}

interface Availability {
  id: number;
  staffId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Appointment {
  id: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  service: string | null;
  notes: string | null;
  status: string;
  noShowChargeAmount: number | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  staffName: string;
  staffId: number;
  createdAt: string;
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
  return `${DAY_SHORT[date.getDay()]}, ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: "bg-green-50", text: "text-green-700", label: "Confirmed" },
  completed: { bg: "bg-blue-50", text: "text-blue-700", label: "Completed" },
  cancelled: { bg: "bg-gray-100", text: "text-gray-500", label: "Cancelled" },
  no_show: { bg: "bg-red-50", text: "text-red-700", label: "No Show" },
};

type Tab = "today" | "all" | "manage";

export default function StaffAppointments() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("today");
  const [loading, setLoading] = useState(false);

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dateFilter, setDateFilter] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [staffFilter, setStaffFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Staff & Availability
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [expandedStaffId, setExpandedStaffId] = useState<number | null>(null);
  const [availabilityMap, setAvailabilityMap] = useState<Record<number, Availability[]>>({});
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddAvail, setShowAddAvail] = useState<number | null>(null);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffTitle, setNewStaffTitle] = useState("");
  const [newStaffLocation, setNewStaffLocation] = useState("San Jose");
  const [newAvailDay, setNewAvailDay] = useState(1);
  const [newAvailStart, setNewAvailStart] = useState("09:00");
  const [newAvailEnd, setNewAvailEnd] = useState("17:00");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // No-show modal
  const [noShowAppt, setNoShowAppt] = useState<Appointment | null>(null);
  const [noShowAmount, setNoShowAmount] = useState("50");

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  })();

  const fetchAppointments = useCallback(async (date?: string, status?: string, staffId?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (date) params.set("date", date);
      if (status && status !== "all") params.set("status", status);
      if (staffId && staffId !== "all") params.set("staffId", staffId);

      const res = await fetch(`/api/booking/admin/appointments?${params}`, { credentials: "include" });
      if (res.ok) setAppointments(await res.json());
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStaff = useCallback(async () => {
    try {
      const res = await fetch("/api/booking/admin/staff", { credentials: "include" });
      if (res.ok) setStaff(await res.json());
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  }, []);

  const fetchAvailability = useCallback(async (staffId: number) => {
    try {
      const res = await fetch(`/api/booking/admin/availability/${staffId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAvailabilityMap((prev) => ({ ...prev, [staffId]: data }));
      }
    } catch (err) {
      console.error("Failed to fetch availability:", err);
    }
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  useEffect(() => {
    if (tab === "today") {
      fetchAppointments(todayStr);
    } else if (tab === "all") {
      fetchAppointments(
        dateFilter || undefined,
        statusFilter !== "all" ? statusFilter : undefined,
        staffFilter !== "all" ? staffFilter : undefined
      );
    }
  }, [tab, dateFilter, statusFilter, staffFilter, fetchAppointments, todayStr]);

  // Fetch availability for expanded staff
  useEffect(() => {
    if (expandedStaffId && !availabilityMap[expandedStaffId]) {
      fetchAvailability(expandedStaffId);
    }
  }, [expandedStaffId, availabilityMap, fetchAvailability]);

  // Group staff by location
  const staffByLocation = staff.reduce<Record<string, StaffMember[]>>((acc, s) => {
    const loc = s.location || "Other";
    if (!acc[loc]) acc[loc] = [];
    acc[loc].push(s);
    return acc;
  }, {});

  // Sort locations: San Jose first, then San Mateo, then others
  const locationOrder = ["San Jose", "San Mateo"];
  const sortedLocations = Object.keys(staffByLocation).sort((a, b) => {
    const ai = locationOrder.indexOf(a);
    const bi = locationOrder.indexOf(b);
    if (ai >= 0 && bi >= 0) return ai - bi;
    if (ai >= 0) return -1;
    if (bi >= 0) return 1;
    return a.localeCompare(b);
  });

  // Actions
  const handleComplete = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/booking/admin/complete/${id}`, { method: "POST", credentials: "include" });
      if (res.ok) setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a)));
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  const handleNoShow = async () => {
    if (!noShowAppt) return;
    setActionLoading(noShowAppt.id);
    try {
      const res = await fetch(`/api/booking/admin/no-show/${noShowAppt.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ chargeAmount: noShowAmount ? Math.round(parseFloat(noShowAmount) * 100) : null }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === noShowAppt.id
              ? { ...a, status: "no_show", noShowChargeAmount: noShowAmount ? Math.round(parseFloat(noShowAmount) * 100) : null }
              : a
          )
        );
        setNoShowAppt(null);
      }
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/booking/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newStaffName, email: newStaffEmail, title: newStaffTitle || null, location: newStaffLocation }),
      });
      if (res.ok) {
        setShowAddStaff(false);
        setNewStaffName(""); setNewStaffEmail(""); setNewStaffTitle(""); setNewStaffLocation("San Jose");
        fetchStaff();
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleStaff = async (s: StaffMember) => {
    try {
      await fetch(`/api/booking/admin/staff/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: s.isActive ? 0 : 1 }),
      });
      fetchStaff();
    } catch (err) { console.error(err); }
  };

  const handleAddAvailability = async (e: React.FormEvent, staffId: number) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/booking/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ staffId, dayOfWeek: newAvailDay, startTime: newAvailStart, endTime: newAvailEnd }),
      });
      if (res.ok) {
        setShowAddAvail(null);
        fetchAvailability(staffId);
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteAvailability = async (id: number, staffId: number) => {
    try {
      await fetch(`/api/booking/admin/availability/${id}`, { method: "DELETE", credentials: "include" });
      fetchAvailability(staffId);
    } catch (err) { console.error(err); }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return a.clientName?.toLowerCase().includes(q) || a.clientEmail?.toLowerCase().includes(q) || a.clientPhone?.includes(q) || a.service?.toLowerCase().includes(q);
  });

  const copyBookingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/book`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation("/")} className="p-2 hover:bg-gray-100 rounded-lg hidden md:block">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <CalendarDays className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg font-semibold text-gray-900">Appointments</h1>
          </div>
          <button
            onClick={copyBookingLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
          >
            {copiedLink ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? "Copied!" : "Copy Booking Link"}
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {([
            { key: "today" as Tab, label: "Today" },
            { key: "all" as Tab, label: "All Appointments" },
            { key: "manage" as Tab, label: "Staff & Availability" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5">
        {/* ═══ TODAY TAB ═══ */}
        {tab === "today" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Today — {formatDate(todayStr)}</h2>
              <span className="text-sm text-gray-500">{filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}</span>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 text-sm">No appointments today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAppointments.map((appt) => (
                  <AppointmentCard key={appt.id} appt={appt} actionLoading={actionLoading} onComplete={handleComplete} onNoShow={() => setNoShowAppt(appt)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ ALL APPOINTMENTS TAB ═══ */}
        {tab === "all" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-4 space-y-3">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                  <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200" />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200">
                    <option value="all">All</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Provider</label>
                  <select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200">
                    <option value="all">All Providers</option>
                    {sortedLocations.map((loc) => (
                      <optgroup key={loc} label={loc}>
                        {staffByLocation[loc].map((s) => (
                          <option key={s.id} value={s.id}>{s.name}, {s.title}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by client name, email, phone..." className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200" />
                {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
              </div>
              <button onClick={() => { setDateFilter(""); setStatusFilter("all"); setStaffFilter("all"); setSearchQuery(""); fetchAppointments(); }} className="text-xs text-indigo-600 font-medium hover:underline">
                Clear all filters & show all
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 text-sm">No appointments found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAppointments.map((appt) => (
                  <AppointmentCard key={appt.id} appt={appt} actionLoading={actionLoading} onComplete={handleComplete} onNoShow={() => setNoShowAppt(appt)} showDate />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ STAFF & AVAILABILITY TAB ═══ */}
        {tab === "manage" && (
          <div className="space-y-6">
            {/* Add Provider Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Providers & Weekly Availability</h2>
              <button
                onClick={() => setShowAddStaff(!showAddStaff)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Provider
              </button>
            </div>

            {/* Add Staff Form */}
            <AnimatePresence>
              {showAddStaff && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleAddStaff}
                  className="bg-white rounded-xl border p-4 space-y-3 overflow-hidden"
                >
                  <h3 className="text-sm font-medium text-gray-700">New Provider</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} placeholder="Full Name *" required className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200" />
                    <input type="email" value={newStaffEmail} onChange={(e) => setNewStaffEmail(e.target.value)} placeholder="Email *" required className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200" />
                    <input type="text" value={newStaffTitle} onChange={(e) => setNewStaffTitle(e.target.value)} placeholder="Title (e.g., NP, RN, LE)" className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200" />
                    <select value={newStaffLocation} onChange={(e) => setNewStaffLocation(e.target.value)} className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-200">
                      <option value="San Jose">San Jose</option>
                      <option value="San Mateo">San Mateo</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">Save Provider</button>
                    <button type="button" onClick={() => setShowAddStaff(false)} className="px-4 py-2 border rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Providers grouped by location */}
            {sortedLocations.map((location) => (
              <div key={location} className="space-y-3">
                {/* Location Header */}
                <div className="flex items-center gap-2 pt-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">{location}</h3>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">{staffByLocation[location].length} provider{staffByLocation[location].length !== 1 ? "s" : ""}</span>
                </div>

                {/* Provider Cards */}
                {staffByLocation[location].map((s) => {
                  const isExpanded = expandedStaffId === s.id;
                  const avail = availabilityMap[s.id] || [];

                  return (
                    <div key={s.id} className="bg-white rounded-xl border overflow-hidden">
                      {/* Provider Header */}
                      <button
                        onClick={() => {
                          setExpandedStaffId(isExpanded ? null : s.id);
                          if (!isExpanded && !availabilityMap[s.id]) fetchAvailability(s.id);
                        }}
                        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.isActive ? "bg-indigo-100" : "bg-gray-100"}`}>
                          <User className={`w-5 h-5 ${s.isActive ? "text-indigo-600" : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${s.isActive ? "text-gray-900" : "text-gray-400 line-through"}`}>
                            {s.name}{s.title ? `, ${s.title}` : ""}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{s.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleStaff(s); }}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${s.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            {s.isActive ? "Active" : "Inactive"}
                          </button>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </button>

                      {/* Availability Panel */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t bg-gray-50"
                          >
                            <div className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-700">
                                  {s.name}'s Weekly Schedule
                                </h4>
                                <button
                                  onClick={() => setShowAddAvail(showAddAvail === s.id ? null : s.id)}
                                  className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  Add Hours
                                </button>
                              </div>

                              {/* Add Availability Form */}
                              <AnimatePresence>
                                {showAddAvail === s.id && (
                                  <motion.form
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    onSubmit={(e) => handleAddAvailability(e, s.id)}
                                    className="bg-white rounded-lg border p-3 space-y-3 overflow-hidden"
                                  >
                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <label className="block text-xs text-gray-500 mb-1">Day</label>
                                        <select value={newAvailDay} onChange={(e) => setNewAvailDay(Number(e.target.value))} className="w-full px-2 py-1.5 rounded border text-sm outline-none">
                                          {DAY_NAMES.map((d, i) => (<option key={i} value={i}>{d}</option>))}
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-500 mb-1">Start</label>
                                        <input type="time" value={newAvailStart} onChange={(e) => setNewAvailStart(e.target.value)} className="w-full px-2 py-1.5 rounded border text-sm outline-none" />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-500 mb-1">End</label>
                                        <input type="time" value={newAvailEnd} onChange={(e) => setNewAvailEnd(e.target.value)} className="w-full px-2 py-1.5 rounded border text-sm outline-none" />
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium">Save</button>
                                      <button type="button" onClick={() => setShowAddAvail(null)} className="px-3 py-1.5 border rounded text-xs text-gray-600">Cancel</button>
                                    </div>
                                  </motion.form>
                                )}
                              </AnimatePresence>

                              {/* Weekly Schedule Grid */}
                              {avail.length === 0 ? (
                                <div className="bg-white rounded-lg border p-4 text-center">
                                  <Clock className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                                  <p className="text-xs text-gray-400">No availability set for {s.name}.</p>
                                  <p className="text-xs text-gray-400">Click "Add Hours" to set their weekly schedule.</p>
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  {DAY_NAMES.map((dayName, dayIndex) => {
                                    const dayAvail = avail.filter((a) => a.dayOfWeek === dayIndex);
                                    if (dayAvail.length === 0) return null;
                                    return (
                                      <div key={dayIndex} className="flex items-center gap-3 bg-white rounded-lg border px-3 py-2">
                                        <span className="text-xs font-medium text-gray-700 w-20 flex-shrink-0">{dayName}</span>
                                        <div className="flex-1 flex flex-wrap gap-2">
                                          {dayAvail.map((a) => (
                                            <div key={a.id} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-1 text-xs">
                                              <Clock className="w-3 h-3" />
                                              {formatTime(a.startTime)} – {formatTime(a.endTime)}
                                              <button onClick={() => handleDeleteAvailability(a.id, s.id)} className="ml-1 hover:text-red-600">
                                                <X className="w-3 h-3" />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}

            {staff.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border">
                <UserPlus className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 text-sm">No providers added yet. Click "Add Provider" to get started.</p>
              </div>
            )}

            {/* Booking Link Info */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-indigo-900 text-sm">Shareable Booking Link</h3>
                  <p className="text-sm text-indigo-700 mt-1">Share this link with clients to book appointments:</p>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="bg-white px-3 py-1.5 rounded-lg border border-indigo-200 text-sm text-indigo-800 font-mono">
                      {window.location.origin}/book
                    </code>
                    <button onClick={copyBookingLink} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">
                      {copiedLink ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs text-indigo-600 mt-2">
                    Clients select a location, choose a provider, pick a date/time, create an account, add a card on file, and confirm. Cards are not charged at booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* No-Show Modal */}
      <AnimatePresence>
        {noShowAppt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setNoShowAppt(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4"
            >
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900">Mark as No-Show</h3>
              </div>
              <p className="text-sm text-gray-600">
                Mark <strong>{noShowAppt.clientName}</strong>'s appointment on {formatDate(noShowAppt.appointmentDate)} at {formatTime(noShowAppt.startTime)} as a no-show?
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">No-Show Fee (optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input type="number" value={noShowAmount} onChange={(e) => setNoShowAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" className="w-full pl-7 pr-4 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-red-200" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Leave empty or 0 to mark without charging.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setNoShowAppt(null)} className="flex-1 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleNoShow} disabled={actionLoading === noShowAppt.id} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                  {actionLoading === noShowAppt.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirm No-Show"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Appointment Card Component ── */
function AppointmentCard({ appt, actionLoading, onComplete, onNoShow, showDate }: {
  appt: Appointment; actionLoading: number | null; onComplete: (id: number) => void; onNoShow: () => void; showDate?: boolean;
}) {
  const config = STATUS_CONFIG[appt.status] || STATUS_CONFIG.confirmed;
  return (
    <div className="bg-white rounded-xl border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{appt.clientName}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{appt.clientEmail}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{appt.clientPhone}</span>
            </div>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}>{config.label}</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
        {showDate && <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-gray-400" />{formatDate(appt.appointmentDate)}</span>}
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400" />{formatTime(appt.startTime)} – {formatTime(appt.endTime)}</span>
        {appt.staffName && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-gray-400" />{appt.staffName}</span>}
        {appt.service && <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-gray-400" />{appt.service}</span>}
      </div>
      {appt.noShowChargeAmount ? <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-1.5">No-show fee charged: ${(appt.noShowChargeAmount / 100).toFixed(2)}</div> : null}
      {appt.status === "confirmed" && (
        <div className="flex gap-2 pt-1">
          <button onClick={() => onComplete(appt.id)} disabled={actionLoading === appt.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50">
            {actionLoading === appt.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Complete
          </button>
          <button onClick={onNoShow} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
            <Ban className="w-3.5 h-3.5" />
            No-Show
          </button>
        </div>
      )}
    </div>
  );
}
