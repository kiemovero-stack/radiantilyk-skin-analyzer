/**
 * Lead Scoring Dashboard
 *
 * Staff-facing page that displays all client analyses ranked by lead score.
 * Helps staff prioritize outreach by showing hot/warm/cool leads with
 * engagement signals and contact information.
 */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Star,
  Flame,
  ThermometerSun,
  Snowflake,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Users,
  BarChart3,
  Filter,
  Search,
  Loader2,
  AlertTriangle,
  Eye,
  RefreshCw,
  Sparkles,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

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
}

interface Lead {
  id: number;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
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
}

interface LeadStats {
  total: number;
  hot: number;
  warm: number;
  cool: number;
  avgScore: number;
  avgStars: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function StarRating({ stars, size = "sm" }: { stars: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i <= stars ? "text-amber-400 fill-amber-400" : "text-gray-200"
          )}
        />
      ))}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: "hot" | "warm" | "cool" }) {
  const config = {
    hot: {
      icon: Flame,
      label: "Hot Lead",
      className: "bg-red-100 text-red-700 border-red-200",
    },
    warm: {
      icon: ThermometerSun,
      label: "Warm Lead",
      className: "bg-amber-100 text-amber-700 border-amber-200",
    },
    cool: {
      icon: Snowflake,
      label: "Cool Lead",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
  };
  const { icon: Icon, label, className } = config[priority];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border", className)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
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
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
    >
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

function LeadCard({ lead, onViewReport }: { lead: Lead; onViewReport: (id: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const score = lead.leadScore;
  const createdDate = new Date(lead.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const createdTime = new Date(lead.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "bg-white rounded-xl border shadow-sm overflow-hidden transition-all",
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
            "w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-lg",
            score.priority === "hot" ? "bg-red-100 text-red-700" :
            score.priority === "warm" ? "bg-amber-100 text-amber-700" :
            "bg-blue-100 text-blue-700"
          )}>
            {score.totalPoints}
          </div>

          {/* Client Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm truncate">
                {lead.patientFirstName} {lead.patientLastName}
              </h3>
              <PriorityBadge priority={score.priority} />
              <StarRating stars={score.stars} />
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {lead.patientEmail}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {createdDate} {createdTime}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 font-medium">
                Score: {lead.skinHealthScore}/100
              </span>
              {lead.reportSummary.scarTreatmentCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-medium">
                  Scar Client
                </span>
              )}
              {lead.reportSummary.topConcerns.slice(0, 2).map((c, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8"
              onClick={(e) => {
                e.stopPropagation();
                onViewReport(lead.id);
              }}
            >
              <Eye className="w-3 h-3 mr-1" />
              Report
            </Button>
            <ChevronRight className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              expanded && "rotate-90"
            )} />
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-gray-700 mb-2">Lead Score Breakdown</p>
          <div className="space-y-2">
            {score.signals.map((signal, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-gray-700">{signal.name}</span>
                    <span className="text-xs text-gray-500">{signal.points}/{signal.maxPoints}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all",
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
  );
}

export default function LeadDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "hot" | "warm" | "cool">("all");
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

  const filteredLeads = searchTerm
    ? leads.filter(
        (l) =>
          `${l.patientFirstName} ${l.patientLastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.patientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : leads;

  const handleViewReport = (id: number) => {
    window.open(`/client/report/${id}`, "_blank");
  };

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
              <p className="text-xs text-gray-500 mt-0.5">Prioritize outreach by engagement level</p>
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
        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6"
          >
            <StatCard
              label="Total Leads"
              value={stats.total}
              icon={Users}
              color="bg-purple-500"
            />
            <StatCard
              label="Hot Leads"
              value={stats.hot}
              icon={Flame}
              color="bg-red-500"
              subtext="Contact within 24h"
            />
            <StatCard
              label="Warm Leads"
              value={stats.warm}
              icon={ThermometerSun}
              color="bg-amber-500"
              subtext="Follow up in 48h"
            />
            <StatCard
              label="Cool Leads"
              value={stats.cool}
              icon={Snowflake}
              color="bg-blue-500"
              subtext="Nurture with emails"
            />
            <StatCard
              label="Avg Rating"
              value={`${stats.avgStars} / 5`}
              icon={Star}
              color="bg-gradient-to-br from-amber-400 to-amber-600"
              subtext={`${stats.avgScore} avg points`}
            />
          </motion.div>
        )}

        {/* Filters & Search */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-0.5">
            {(["all", "hot", "warm", "cool"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  filter === f
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
