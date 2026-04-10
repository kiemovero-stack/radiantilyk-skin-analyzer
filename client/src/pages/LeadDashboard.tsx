/**
 * Lead Scoring Dashboard
 *
 * Staff-facing page that displays all client analyses ranked by lead score.
 * Includes booking probability, estimated revenue, client tiers (platinum/gold/silver/bronze),
 * high-value indicators, and quick action buttons for outreach.
 */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Star,
  Flame,
  ThermometerSun,
  Snowflake,
  ChevronRight,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  Users,
  BarChart3,
  Search,
  Loader2,
  AlertTriangle,
  Eye,
  RefreshCw,
  CheckCircle2,
  Undo2,
  X,
  MessageSquare,
  UserCheck,
  DollarSign,
  TrendingUp,
  Crown,
  Target,
  Gem,
  Award,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */

interface LeadScoreSignal {
  name: string;
  points: number;
  maxPoints: number;
  description: string;
}

interface LeadScore {
  totalPoints: number;
  maxPoints: number;
  stars: number;
  signals: LeadScoreSignal[];
  priority: "hot" | "warm" | "cool";
  summary: string;
  calculatedAt: string;
  bookingProbability: number;
  estimatedRevenue: { low: number; high: number };
  clientTier: "platinum" | "gold" | "silver" | "bronze";
  highValueIndicators: string[];
}

interface Lead {
  id: number;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  patientPhone: string;
  patientDob: string | null;
  skinHealthScore: number | null;
  skinType: string;
  createdAt: string;
  leadScore: LeadScore;
  reportSummary: {
    conditionCount: number;
    procedureCount: number;
    scarTreatmentCount: number;
    topConcerns: string[];
    topTreatments: string[];
  };
  hasSimulation: boolean;
  hasAgingImages: boolean;
  contactedAt: string | null;
  contactNotes: string | null;
  contactMethod: string | null;
  intakeData: any;
  concerns: string[];
}

interface LeadStats {
  total: number;
  hot: number;
  warm: number;
  cool: number;
  contacted: number;
  avgScore: number;
  avgStars: string;
  avgBookingProbability: number;
  estimatedPipelineRevenue: { low: number; high: number };
  platinum: number;
  gold: number;
  silver: number;
  bronze: number;
}

/* ─── Animation ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ─── Helpers ─── */

function formatCurrency(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1)}k`;
  return `$${amount}`;
}

const TIER_CONFIG = {
  platinum: { icon: Crown, label: "Platinum", bg: "bg-gradient-to-r from-purple-100 to-indigo-100", text: "text-purple-700", border: "border-purple-200", badge: "bg-purple-600" },
  gold: { icon: Award, label: "Gold", bg: "bg-gradient-to-r from-amber-50 to-yellow-100", text: "text-amber-700", border: "border-amber-200", badge: "bg-amber-500" },
  silver: { icon: Gem, label: "Silver", bg: "bg-gradient-to-r from-gray-50 to-slate-100", text: "text-gray-600", border: "border-gray-200", badge: "bg-gray-500" },
  bronze: { icon: Target, label: "Bronze", bg: "bg-gradient-to-r from-orange-50 to-amber-50", text: "text-orange-600", border: "border-orange-200", badge: "bg-orange-400" },
};

/* ─── Sub-components ─── */

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i <= stars ? "text-amber-400 fill-amber-400" : "text-gray-200"
          )}
        />
      ))}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: "hot" | "warm" | "cool" }) {
  const config = {
    hot: { icon: Flame, label: "Hot Lead", className: "bg-red-100 text-red-700 border-red-200" },
    warm: { icon: ThermometerSun, label: "Warm Lead", className: "bg-amber-100 text-amber-700 border-amber-200" },
    cool: { icon: Snowflake, label: "Cool Lead", className: "bg-blue-100 text-blue-700 border-blue-200" },
  };
  const { icon: Icon, label, className } = config[priority];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border", className)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function TierBadge({ tier }: { tier: "platinum" | "gold" | "silver" | "bronze" }) {
  const config = TIER_CONFIG[tier];
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white", config.badge)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function BookingProbabilityBar({ probability }: { probability: number }) {
  const color = probability >= 70 ? "bg-green-500" : probability >= 40 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${probability}%` }} />
      </div>
      <span className={cn("text-xs font-bold", probability >= 70 ? "text-green-600" : probability >= 40 ? "text-amber-600" : "text-red-500")}>
        {probability}%
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  subtext,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtext?: string;
}) {
  return (
    <motion.div variants={fadeUp} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
          {subtext && <p className="text-[10px] text-gray-400 mt-0.5">{subtext}</p>}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Contact Notes Modal ─── */

function ContactModal({
  lead,
  method,
  onConfirm,
  onClose,
}: {
  lead: Lead;
  method: string;
  onConfirm: (notes: string) => void;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-green-600" />
            Mark as Contacted
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <p className="text-xs text-gray-500">Client</p>
          <p className="text-sm font-medium">{lead.patientFirstName} {lead.patientLastName}</p>
          <p className="text-xs text-gray-500 mt-1">Method: <span className="font-medium capitalize">{method}</span></p>
        </div>

        <label className="block text-xs font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          ref={inputRef}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Left voicemail, will call back Tuesday..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 resize-none"
          rows={3}
        />

        <div className="flex items-center gap-2 mt-4">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
            onClick={() => onConfirm(notes)}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Confirm Contacted
          </Button>
          <Button variant="outline" className="text-xs" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Lead Card ─── */

function LeadCard({
  lead,
  onViewReport,
  onMarkContacted,
  onUndoContact,
}: {
  lead: Lead;
  onViewReport: (id: number) => void;
  onMarkContacted: (id: number, method: string, notes: string) => Promise<void>;
  onUndoContact: (id: number) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);
  const score = lead.leadScore;
  const isContacted = !!lead.contactedAt;
  const tierConfig = TIER_CONFIG[score.clientTier];

  const createdDate = new Date(lead.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const createdTime = new Date(lead.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const contactedDate = lead.contactedAt
    ? new Date(lead.contactedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lead.patientPhone) {
      window.open(`tel:${lead.patientPhone}`, "_self");
    }
    setShowModal("call");
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lead.patientEmail) return;
    const subject = encodeURIComponent(`Your Skin Analysis Results — ${lead.patientFirstName}`);
    const body = encodeURIComponent(
      `Hi ${lead.patientFirstName},\n\nThank you for completing your skin analysis with us. I wanted to follow up on your results and discuss treatment options that would be a great fit for you.\n\nWould you like to schedule a consultation?\n\nBest regards,\nRKA Skin Team`
    );
    window.open(`mailto:${lead.patientEmail}?subject=${subject}&body=${body}`, "_blank");
    setShowModal("email");
  };

  const handleMarkContacted = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal("other");
  };

  const confirmContact = async (notes: string) => {
    setMarking(true);
    try {
      await onMarkContacted(lead.id, showModal || "other", notes);
    } finally {
      setMarking(false);
      setShowModal(null);
    }
  };

  const handleUndo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMarking(true);
    try {
      await onUndoContact(lead.id);
    } finally {
      setMarking(false);
    }
  };

  return (
    <>
      <motion.div
        variants={fadeUp}
        className={cn(
          "bg-white rounded-xl border shadow-sm overflow-hidden transition-all",
          isContacted ? "border-green-200 bg-green-50/30" :
          score.clientTier === "platinum" ? "border-purple-200 ring-1 ring-purple-100" :
          score.clientTier === "gold" ? "border-amber-200" :
          score.priority === "hot" ? "border-red-200 hover:border-red-300" :
          score.priority === "warm" ? "border-amber-200 hover:border-amber-300" :
          "border-gray-200 hover:border-gray-300"
        )}
      >
        {/* Main Row */}
        <div
          className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-4">
            {/* Score Circle */}
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-lg relative",
              isContacted ? "bg-green-100 text-green-700" :
              score.clientTier === "platinum" ? "bg-purple-100 text-purple-700" :
              score.clientTier === "gold" ? "bg-amber-100 text-amber-700" :
              score.priority === "hot" ? "bg-red-100 text-red-700" :
              score.priority === "warm" ? "bg-amber-100 text-amber-700" :
              "bg-blue-100 text-blue-700"
            )}>
              {isContacted ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                score.totalPoints
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm truncate">
                  {lead.patientFirstName} {lead.patientLastName}
                </h3>
                <PriorityBadge priority={score.priority} />
                <TierBadge tier={score.clientTier} />
                {isContacted && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Contacted {contactedDate}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                <StarRating stars={score.stars} />
                {lead.patientEmail && (
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3" />
                    {lead.patientEmail}
                  </span>
                )}
                {lead.patientPhone && (
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <Phone className="w-3 h-3" />
                    {lead.patientPhone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {createdDate} {createdTime}
                </span>
              </div>
              {/* Booking Probability & Revenue Row */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex-1 max-w-[200px]">
                  <p className="text-[10px] text-gray-400 mb-0.5">Booking Probability</p>
                  <BookingProbabilityBar probability={score.bookingProbability} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Est. Revenue</p>
                  <p className="text-xs font-bold text-green-600">
                    {formatCurrency(score.estimatedRevenue.low)} – {formatCurrency(score.estimatedRevenue.high)}
                  </p>
                </div>
                {score.highValueIndicators.length > 0 && (
                  <div className="hidden md:flex items-center gap-1 flex-wrap">
                    {score.highValueIndicators.slice(0, 3).map((indicator, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 font-medium flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" />
                        {indicator}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Concerns Row */}
              {lead.concerns && lead.concerns.length > 0 && (
                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-400">Concerns:</span>
                  {lead.concerns.slice(0, 4).map((c, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-pink-50 text-pink-600 font-medium">
                      {c}
                    </span>
                  ))}
                  {lead.concerns.length > 4 && (
                    <span className="text-[10px] text-gray-400">+{lead.concerns.length - 4} more</span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {!isContacted ? (
                <>
                  <button
                    onClick={handleCall}
                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                    title="Call client"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleEmail}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Email client"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleMarkContacted}
                    className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                    title="Mark as contacted"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleUndo}
                  disabled={marking}
                  className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  title="Undo contacted"
                >
                  {marking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Undo2 className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onViewReport(lead.id); }}
                className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                title="View report"
              >
                <Eye className="w-4 h-4" />
              </button>
              <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", expanded && "rotate-180")} />
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="px-4 pb-4 border-t border-gray-100 pt-3">
            {/* Contact Notes */}
            {lead.contactNotes && (
              <div className="mb-3 p-2.5 rounded-lg bg-green-50 border border-green-100">
                <p className="text-[10px] text-green-600 font-semibold mb-0.5 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Contact Notes ({lead.contactMethod})
                </p>
                <p className="text-xs text-green-700">{lead.contactNotes}</p>
              </div>
            )}

            {/* Intake Data */}
            {lead.intakeData && (
              <div className="mb-3 p-2.5 rounded-lg bg-indigo-50 border border-indigo-100">
                <p className="text-[10px] text-indigo-600 font-semibold mb-1.5">Client Intake Data</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {lead.intakeData.treatmentGoal && (
                    <div>
                      <p className="text-[10px] text-indigo-400">Treatment Goal</p>
                      <p className="font-medium text-indigo-700 capitalize">{lead.intakeData.treatmentGoal}</p>
                    </div>
                  )}
                  {lead.intakeData.treatmentExperience && (
                    <div>
                      <p className="text-[10px] text-indigo-400">Experience</p>
                      <p className="font-medium text-indigo-700 capitalize">{lead.intakeData.treatmentExperience}</p>
                    </div>
                  )}
                  {lead.intakeData.budget && (
                    <div>
                      <p className="text-[10px] text-indigo-400">Budget</p>
                      <p className="font-medium text-indigo-700">{lead.intakeData.budget}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* High-Value Indicators */}
            {score.highValueIndicators.length > 0 && (
              <div className="mb-3 p-2.5 rounded-lg bg-purple-50 border border-purple-100">
                <p className="text-[10px] text-purple-600 font-semibold mb-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  High-Value Indicators
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {score.highValueIndicators.map((indicator, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                      {indicator}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {score.signals.map((signal, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-gray-700">{signal.name}</span>
                      <span className="text-gray-400">{signal.points}/{signal.maxPoints}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          signal.points >= signal.maxPoints * 0.7 ? "bg-green-500" :
                          signal.points >= signal.maxPoints * 0.4 ? "bg-amber-500" :
                          signal.points > 0 ? "bg-red-400" : "bg-gray-200"
                        )}
                        style={{ width: `${(signal.points / signal.maxPoints) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{signal.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 mb-1">Recommended Action</p>
              <p className="text-xs text-gray-600">{score.summary}</p>
            </div>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-gray-400">Treatments:</span>
              {lead.reportSummary.topTreatments.map((t, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showModal && (
          <ContactModal
            lead={lead}
            method={showModal}
            onConfirm={confirmContact}
            onClose={() => setShowModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Main Dashboard ─── */

export default function LeadDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "hot" | "warm" | "cool">("all");
  const [tierFilter, setTierFilter] = useState<"all" | "platinum" | "gold" | "silver" | "bronze">("all");
  const [contactFilter, setContactFilter] = useState<"all" | "contacted" | "not_contacted">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const priorityParam = filter !== "all" ? `&priority=${filter}` : "";
      const res = await fetch(`/api/leads?limit=100${priorityParam}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data.leads);
      setStats(data.stats);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleMarkContacted = async (id: number, method: string, notes: string) => {
    try {
      const res = await fetch(`/api/leads/${id}/contact`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, notes }),
      });
      if (!res.ok) throw new Error("Failed to mark as contacted");
      const data = await res.json();
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, contactedAt: data.contactedAt, contactNotes: notes || null, contactMethod: method }
            : l
        )
      );
    } catch (err: any) {
      console.error("Failed to mark contacted:", err);
    }
  };

  const handleUndoContact = async (id: number) => {
    try {
      const res = await fetch(`/api/leads/${id}/contact/undo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to undo contact");
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, contactedAt: null, contactNotes: null, contactMethod: null }
            : l
        )
      );
    } catch (err: any) {
      console.error("Failed to undo contact:", err);
    }
  };

  // Apply filters
  let filteredLeads = leads;
  if (tierFilter !== "all") {
    filteredLeads = filteredLeads.filter((l) => l.leadScore.clientTier === tierFilter);
  }
  if (contactFilter === "contacted") {
    filteredLeads = filteredLeads.filter((l) => !!l.contactedAt);
  } else if (contactFilter === "not_contacted") {
    filteredLeads = filteredLeads.filter((l) => !l.contactedAt);
  }
  if (searchTerm) {
    filteredLeads = filteredLeads.filter(
      (l) =>
        `${l.patientFirstName} ${l.patientLastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.patientPhone && l.patientPhone.includes(searchTerm))
    );
  }

  const handleViewReport = (id: number) => {
    window.open(`/client/report/${id}`, "_blank");
  };

  const contactedCount = leads.filter((l) => !!l.contactedAt).length;
  const notContactedCount = leads.filter((l) => !l.contactedAt).length;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">Failed to load leads</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <Button className="mt-4" onClick={fetchLeads}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Lead Scoring Dashboard
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Screen high-value clients and prioritize outreach</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchLeads}
              disabled={loading}
              className="text-xs"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 mr-1", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards - Row 1: Core Metrics */}
        {stats && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3"
            >
              <StatCard label="Total Leads" value={stats.total} icon={Users} color="bg-purple-500" />
              <StatCard
                label="Avg Booking Prob."
                value={`${stats.avgBookingProbability}%`}
                icon={TrendingUp}
                color="bg-green-500"
                subtext={`${stats.avgStars} avg stars`}
              />
              <StatCard
                label="Pipeline Revenue"
                value={`${formatCurrency(stats.estimatedPipelineRevenue.low)} – ${formatCurrency(stats.estimatedPipelineRevenue.high)}`}
                icon={DollarSign}
                color="bg-emerald-600"
                subtext="Estimated total value"
              />
              <StatCard
                label="Contacted"
                value={contactedCount}
                icon={CheckCircle2}
                color="bg-green-500"
                subtext={`${notContactedCount} remaining`}
              />
            </motion.div>

            {/* Stats Cards - Row 2: Priority & Tiers */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6"
            >
              <StatCard label="Hot Leads" value={stats.hot} icon={Flame} color="bg-red-500" subtext="Contact within 24h" />
              <StatCard label="Warm Leads" value={stats.warm} icon={ThermometerSun} color="bg-amber-500" subtext="Follow up in 48h" />
              <StatCard label="Cool Leads" value={stats.cool} icon={Snowflake} color="bg-blue-500" subtext="Nurture with emails" />
              <StatCard label="Platinum" value={stats.platinum} icon={Crown} color="bg-purple-600" subtext="$500+/mo budget" />
              <StatCard label="Gold" value={stats.gold} icon={Award} color="bg-amber-500" subtext="$300-500/mo" />
              <StatCard label="Silver" value={stats.silver} icon={Gem} color="bg-gray-500" subtext="$100-300/mo" />
              <StatCard label="Bronze" value={stats.bronze} icon={Target} color="bg-orange-400" subtext="<$100/mo" />
            </motion.div>
          </>
        )}

        {/* Filters & Search */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-0.5">
            {(["all", "hot", "warm", "cool"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  filter === f ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Tier Filter */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-0.5">
            {(["all", "platinum", "gold", "silver", "bronze"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  tierFilter === t ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {t === "all" ? "All Tiers" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Contact Status Filter */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-0.5">
            {([
              { key: "all" as const, label: "Any Status" },
              { key: "not_contacted" as const, label: "Not Contacted" },
              { key: "contacted" as const, label: "Contacted" },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setContactFilter(key)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  contactFilter === key ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300"
            />
          </div>
          <span className="text-xs text-gray-400">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Lead List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="ml-3 text-sm text-gray-500">Loading leads...</span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No leads found</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchTerm ? "Try a different search term" : "Leads will appear here after client analyses are completed"}
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="space-y-3"
          >
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onViewReport={handleViewReport}
                onMarkContacted={handleMarkContacted}
                onUndoContact={handleUndoContact}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
