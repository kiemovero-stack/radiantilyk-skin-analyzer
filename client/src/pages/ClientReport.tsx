/**
 * Client-Facing Report Page.
 * 
 * Public (no login required). Fetches report from /api/client/report/:id.
 * Uses warm, encouraging language and a client-friendly design.
 * Includes booking CTA linking to rkaemr.click/portal.
 */
import { Button } from "@/components/ui/button";
import { ReportWatermark } from "@/components/CopyProtection";
import { cn } from "@/lib/utils";
import type { SkinAnalysisReport, Severity, ScarTreatment } from "@shared/types";
import { PRODUCT_CATALOG, BUNDLE_DEALS, findMatchingBundlesByName } from "@shared/productCatalog";
import type { BundleDeal } from "@shared/productCatalog";
import { ShoppingBag, Gift, Tag, Info } from "lucide-react";
import {
  Sparkles,
  Activity,
  AlertTriangle,
  Stethoscope,
  Syringe,
  FlaskConical,
  Telescope,
  Map,
  Shield,
  ChevronRight,
  Star,
  Loader2,
  CheckCircle2,
  Heart,
  ExternalLink,
  CalendarCheck,
  Eye,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  Share2,
  Copy,
  Mail,
  MessageSquare,
  Check,
  User,
  Calendar,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { paths, clientPath } from "@/lib/clientPaths";

const CHECKIN_URL = "https://rkaemr.click/portal";
const SHOP_URL = "https://rkaskin.co";

/** Add UTM tracking parameters to any URL */
function withUtm(baseUrl: string, content?: string): string {
  const sep = baseUrl.includes("?") ? "&" : "?";
  let utm = `${sep}utm_source=skinai&utm_medium=report&utm_campaign=product_recommendation`;
  if (content) utm += `&utm_content=${encodeURIComponent(content)}`;
  return `${baseUrl}${utm}`;
}

/** 48-hour countdown timer from analysis creation */
function CountdownBanner({ createdAt }: { createdAt: string }) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; expired: boolean }>({ hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const deadline = new Date(createdAt).getTime() + 48 * 60 * 60 * 1000;

    function update() {
      const now = Date.now();
      const diff = deadline - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds, expired: false });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const isUrgent = !timeLeft.expired && timeLeft.hours < 6;

  if (timeLeft.expired) {
    return (
      <div className="mb-6 p-4 rounded-2xl border border-gray-200 bg-gray-50 text-center">
        <p className="text-sm text-gray-500 font-medium">This special offer has expired</p>
        <p className="text-xs text-gray-400 mt-1">Contact us for current promotions</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "mb-6 p-4 md:p-5 rounded-2xl border text-center relative overflow-hidden",
      isUrgent
        ? "border-red-200 bg-gradient-to-r from-red-50 to-pink-50"
        : "border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50"
    )}>
      {isUrgent && (
        <div className="absolute inset-0 animate-pulse bg-red-100/30 pointer-events-none" />
      )}
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Tag className={cn("w-4 h-4", isUrgent ? "text-red-500" : "text-purple-500")} />
          <span className={cn("text-sm font-bold", isUrgent ? "text-red-700" : "text-purple-700")}>
            {isUrgent ? "HURRY — Offer Expiring Soon!" : "Exclusive 25% Off Your First Treatment"}
          </span>
        </div>
        <div className="flex items-center justify-center gap-3 my-3">
          <div className={cn("flex flex-col items-center px-3 py-2 rounded-xl min-w-[60px]", isUrgent ? "bg-red-100" : "bg-purple-100")}>
            <span className={cn("text-2xl font-bold tabular-nums", isUrgent ? "text-red-700" : "text-purple-700")}>
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Hours</span>
          </div>
          <span className={cn("text-xl font-bold", isUrgent ? "text-red-400" : "text-purple-400")}>:</span>
          <div className={cn("flex flex-col items-center px-3 py-2 rounded-xl min-w-[60px]", isUrgent ? "bg-red-100" : "bg-purple-100")}>
            <span className={cn("text-2xl font-bold tabular-nums", isUrgent ? "text-red-700" : "text-purple-700")}>
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Min</span>
          </div>
          <span className={cn("text-xl font-bold", isUrgent ? "text-red-400" : "text-purple-400")}>:</span>
          <div className={cn("flex flex-col items-center px-3 py-2 rounded-xl min-w-[60px]", isUrgent ? "bg-red-100" : "bg-purple-100")}>
            <span className={cn("text-2xl font-bold tabular-nums", isUrgent ? "text-red-700" : "text-purple-700")}>
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Sec</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-3">Book within 48 hours of your analysis to claim your discount</p>
        <a
          href={withUtm(CHECKIN_URL, "countdown_banner")}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-all",
            isUrgent
              ? "bg-gradient-to-r from-red-500 to-pink-500 animate-bounce"
              : "bg-gradient-to-r from-pink-400 to-purple-500"
          )}
        >
          <CalendarCheck className="w-4 h-4" />
          Book Now — Save 25%
        </a>
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const severityColor: Record<Severity, string> = {
  mild: "text-emerald-600",
  moderate: "text-amber-600",
  severe: "text-rose-600",
};

const severityBg: Record<Severity, string> = {
  mild: "bg-emerald-50 border-emerald-200",
  moderate: "bg-amber-50 border-amber-200",
  severe: "bg-rose-50 border-rose-200",
};

const severityBadge: Record<Severity, string> = {
  mild: "bg-emerald-100 text-emerald-700",
  moderate: "bg-amber-100 text-amber-700",
  severe: "bg-rose-100 text-rose-700",
};

const severityLabel: Record<Severity, string> = {
  mild: "Mild",
  moderate: "Moderate",
  severe: "Needs Attention",
};

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "stroke-emerald-500"
      : score >= 60
        ? "stroke-amber-500"
        : "stroke-rose-500";

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          className="text-gray-200"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          className={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-xs text-gray-400">/100</span>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-purple-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Interactive Before/After Image Slider.
 * Allows clients to drag a slider to compare their original photo with the AI-generated simulation.
 */
function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  label,
}: {
  beforeUrl: string;
  afterUrl: string;
  label: string;
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const divRef = { current: null as HTMLDivElement | null };

  const handleMove = (clientX: number) => {
    const el = divRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div className="relative select-none">
      <p className="text-xs font-semibold text-purple-600 mb-2 flex items-center gap-1">
        <Eye className="w-3 h-3" />
        {label}
      </p>
      <div
        ref={(el) => { divRef.current = el; }}
        className="relative w-full aspect-square rounded-xl overflow-hidden cursor-col-resize border border-purple-200 shadow-sm"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={(e) => isDragging && handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      >
        {/* After image (full) */}
        <img
          src={afterUrl}
          alt="After treatment simulation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeUrl}
            alt="Before treatment"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ minWidth: `${100 / (sliderPos / 100)}%`, maxWidth: `${100 / (sliderPos / 100)}%` }}
          />
        </div>
        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
            <div className="flex items-center gap-0.5">
              <ChevronRight className="w-3 h-3 text-purple-500 rotate-180" />
              <ChevronRight className="w-3 h-3 text-purple-500" />
            </div>
          </div>
        </div>
        {/* Labels */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold z-20">
          BEFORE
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold z-20">
          AFTER
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-1 text-center">
        Drag the slider to compare — AI-generated simulation for illustration purposes
      </p>
    </div>
  );
}

function ShareResults({ reportId, patientName, patientEmail }: { reportId: number; patientName: string; patientEmail: string }) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);
  const [referralStats, setReferralStats] = useState<{ timesUsed: number } | null>(null);

  const reportUrl = `${window.location.origin}${clientPath(`/report/${reportId}`)}`;  
  const shareText = `Check out my AI skin analysis results from RadiantilyK!`;

  // Generate or fetch referral code
  const getOrCreateReferralCode = async () => {
    if (referralCode) return referralCode;
    setReferralLoading(true);
    try {
      const res = await fetch("/api/referral/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrerName: patientName,
          referrerEmail: patientEmail,
          analysisId: reportId,
        }),
      });
      if (!res.ok) throw new Error("Failed to create referral code");
      const data = await res.json();
      setReferralCode(data.code);
      setReferralStats({ timesUsed: data.timesUsed || 0 });
      return data.code;
    } catch (err) {
      console.error("Referral error:", err);
      return null;
    } finally {
      setReferralLoading(false);
    }
  };

  // Auto-generate referral code on mount
  useEffect(() => {
    if (patientEmail) {
      getOrCreateReferralCode();
    }
  }, [patientEmail]);

  const referralUrl = referralCode
    ? paths.referral(referralCode)
    : null;

  const handleNativeShare = async () => {
    const code = await getOrCreateReferralCode();
    const shareUrl = code ? paths.referral(code) : reportUrl;
    const text = code
      ? `I just got my AI skin analysis at RadiantilyK! Use my referral code ${code} and we both get 15% off our next treatment.`
      : shareText;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${patientName}'s Skin Analysis`,
          text,
          url: shareUrl,
        });
      } catch { /* user cancelled */ }
    } else {
      setShowOptions(!showOptions);
    }
  };

  const handleCopyLink = async () => {
    const url = referralUrl || reportUrl;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyReferralCode = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setReferralCopied(true);
      setTimeout(() => setReferralCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = referralCode;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setReferralCopied(true);
      setTimeout(() => setReferralCopied(false), 2000);
    }
  };

  const handleEmailShare = async () => {
    const code = await getOrCreateReferralCode();
    const url = code ? paths.referral(code) : reportUrl;
    const subject = encodeURIComponent(`Get 15% off at RadiantilyK Aesthetic!`);
    const body = encodeURIComponent(
      `Hey! I just got my AI skin analysis at RadiantilyK Aesthetic and it was amazing.\n\nUse my referral link and we BOTH get 15% off our next treatment:\n${url}\n\n${code ? `Or use my code: ${code}` : ""}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleTextShare = async () => {
    const code = await getOrCreateReferralCode();
    const url = code ? paths.referral(code) : reportUrl;
    const body = encodeURIComponent(
      `Hey! Get a free AI skin analysis at RadiantilyK. Use my code ${code || ""} and we both get 15% off! ${url}`
    );
    window.open(`sms:?body=${body}`);
  };

  return (
    <div className="space-y-4">
      {/* Referral Program Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border border-purple-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-bl-full" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Refer a Friend, Both Save 15%</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4 ml-10">
            Share your unique referral link with friends. When they get their analysis, you <strong>both</strong> receive 15% off your next treatment!
          </p>

          {referralCode ? (
            <div className="space-y-3">
              {/* Referral Code Display */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-purple-100 shadow-sm">
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Your Referral Code</p>
                  <p className="text-xl font-mono font-bold text-purple-600 tracking-wider">{referralCode}</p>
                </div>
                <button
                  onClick={handleCopyReferralCode}
                  className="px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  {referralCopied ? (
                    <><Check className="w-3.5 h-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy Code</>
                  )}
                </button>
              </div>

              {/* Shareable Link */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-purple-100 shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Your Referral Link</p>
                  <p className="text-xs text-gray-500 truncate">{referralUrl}</p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy Link</>
                  )}
                </button>
              </div>

              {/* Stats */}
              {referralStats && referralStats.timesUsed > 0 && (
                <div className="text-center py-2">
                  <p className="text-xs text-purple-600 font-medium">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    {referralStats.timesUsed} friend{referralStats.timesUsed !== 1 ? "s" : ""} have used your code!
                  </p>
                </div>
              )}

              {/* Share Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleNativeShare}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  Share with Friends
                </button>
                <button
                  onClick={handleEmailShare}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email
                </button>
                <button
                  onClick={handleTextShare}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-green-500" />
                  Text
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4">
              {referralLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating your referral code...
                </div>
              ) : (
                <button
                  onClick={getOrCreateReferralCode}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
                >
                  <Heart className="w-4 h-4" />
                  Get My Referral Code
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingCTA() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 text-center">
      <h3 className="text-lg font-bold mb-2">Ready to Start Your Skin Journey?</h3>
      <p className="text-sm text-gray-600 mb-4">
        Book a free consultation and our expert team will create a personalized plan just for you.
      </p>
      <a
        href={withUtm(CHECKIN_URL, "booking_cta")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <CalendarCheck className="w-4 h-4" />
        Book Your Free Consultation
      </a>
    </div>
  );
}

interface ReportData {
  id: number;
  status: string;
  report: SkinAnalysisReport;
  skinHealthScore: number;
  skinType: string;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  patientDob: string | null;
  imageUrl: string;
  simulationImages: Record<string, string>;
  createdAt: string;
}

export default function ClientReport() {
  const params = useParams<{ id: string }>();
  const reportId = parseInt(params.id || "0");

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulationsLoading, setSimulationsLoading] = useState(false);

  useEffect(() => {
    if (reportId <= 0) {
      setError("Invalid report ID");
      setLoading(false);
      return;
    }

    fetch(`/api/client/report/${reportId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Report not found");
        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [reportId]);

  // Poll for simulation images if they're not ready yet
  useEffect(() => {
    if (!data || data.status !== "completed") return;
    const hasSimulations = data.simulationImages && Object.keys(data.simulationImages).length > 0;
    if (hasSimulations) return; // Already have them

    setSimulationsLoading(true);
    let attempts = 0;
    const maxAttempts = 30; // Poll for up to 5 minutes (30 x 10s)

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/client/simulations/${reportId}`);
        if (!res.ok) return;
        const result = await res.json();
        if (result.ready && result.simulationImages) {
          setData((prev) => prev ? { ...prev, simulationImages: result.simulationImages } : prev);
          setSimulationsLoading(false);
          clearInterval(interval);
        }
      } catch { /* ignore polling errors */ }
      if (attempts >= maxAttempts) {
        setSimulationsLoading(false);
        clearInterval(interval);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [data?.status, reportId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50/50 to-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto" />
          <p className="mt-4 text-gray-500">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !data || data.status !== "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50/50 to-white">
        <div className="text-center max-w-md px-6">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <h2 className="mt-4 text-lg font-bold">
            {data?.status === "processing"
              ? "Your Analysis is Still Processing"
              : "Report Not Found"}
          </h2>
          <p className="mt-2 text-gray-500">
            {data?.status === "processing"
              ? "Please check back in a minute — our AI is still analyzing your photos."
              : "We couldn't find this report. Please check the link and try again."}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  const report = data.report as SkinAnalysisReport;
  const firstName = data.patientFirstName || "there";

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/30 to-white">
      <ReportWatermark />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="font-bold text-sm">RadiantilyK Skin Analysis</span>
          </div>
          <a
            href={withUtm(CHECKIN_URL, "header_book_now")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Book Now
          </a>
        </div>
      </header>

      <main className="container py-8 md:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Welcome */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 text-xs font-medium mb-4">
              <Heart className="w-3 h-3" />
              Your Personalized Results
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Hi {firstName}! Here's Your Skin Report
            </h1>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              We've analyzed your photos and put together a personalized plan to help you achieve your skin goals. Let's dive in!
            </p>
          </motion.div>

          {/* Patient Info Card */}
          {data.patientFirstName && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-8 p-5 rounded-2xl border border-pink-100 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{data.patientFirstName} {data.patientLastName}</h2>
                  <p className="text-xs text-gray-400">Patient Report</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{data.patientEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>DOB: {data.patientDob ? new Date(data.patientDob + "T00:00:00").toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(data.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(data.createdAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 48-Hour Countdown Timer */}
          <CountdownBanner createdAt={data.createdAt} />

          {/* Section 1: Score */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-8 p-6 md:p-8 rounded-2xl border border-pink-100 bg-white shadow-sm"
          >
            <SectionHeader
              icon={Activity}
              title="Your Skin Health Score"
              subtitle="How your skin is doing overall"
            />
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ScoreGauge score={report.skinHealthScore} />
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                  <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-medium border border-pink-200">
                    {report.skinType} Skin
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200">
                    {report.skinTone}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                    Fitzpatrick Type {report.fitzpatrickType}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {report.scoreJustification}
                </p>
              </div>
            </div>
            {report.positiveFindings && report.positiveFindings.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h3 className="font-semibold text-sm text-emerald-800 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  What's Great About Your Skin
                </h3>
                <ul className="text-sm text-emerald-700 space-y-1">
                  {report.positiveFindings.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 mt-1 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>

          {/* Section 2: Conditions */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8 p-6 md:p-8 rounded-2xl border border-pink-100 bg-white shadow-sm"
          >
            <SectionHeader
              icon={Stethoscope}
              title="What We Found"
              subtitle="Here's what's going on with your skin — and what we can do about it"
            />
            <p className="text-sm text-gray-600 mb-6">{report.summary}</p>
            <div className="space-y-4">
              {report.conditions.map((condition: any, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "p-4 rounded-xl border",
                    severityBg[condition.severity as Severity]
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm">{condition.name}</h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        severityBadge[condition.severity as Severity]
                      )}
                    >
                      {severityLabel[condition.severity as Severity]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    Area: {condition.area}
                  </p>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {condition.description}
                  </p>
                  {condition.cellularInsight && (
                    <div className="mt-3 p-3 rounded-lg bg-white/60 border border-gray-100">
                      <p className="text-xs text-gray-500 flex items-start gap-1.5">
                        <Eye className="w-3 h-3 mt-0.5 shrink-0 text-purple-400" />
                        <span className="italic">{condition.cellularInsight}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          {/* Missed Conditions */}
          {report.missedConditions && report.missedConditions.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mb-8 p-6 md:p-8 rounded-2xl border border-pink-100 bg-white shadow-sm"
            >
              <SectionHeader
                icon={AlertTriangle}
                title="Things Most People Miss"
                subtitle="Our AI caught these subtle concerns that are easy to overlook"
              />
              <div className="space-y-3">
                {report.missedConditions.map((condition: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{condition.name}</h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                          severityBadge[condition.severity as Severity]
                        )}
                      >
                        {severityLabel[condition.severity as Severity]}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {condition.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Booking CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8"
          >
            <BookingCTA />
          </motion.div>

          {/* Section: Facial Treatments */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8 p-6 md:p-8 rounded-2xl border border-pink-100 bg-white shadow-sm"
          >
            <SectionHeader
              icon={Sparkles}
              title="Recommended Facials"
              subtitle="These facials are perfect for your skin type and concerns"
            />
            <div className="grid gap-4">
              {report.facialTreatments.map((treatment: any, i: number) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/30 to-pink-50/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Star className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="font-semibold">{treatment.name}</h3>
                        {treatment.price && (
                          <span className="shrink-0 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">
                            {treatment.price}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {treatment.reason}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {treatment.targetConditions.map((c: string, j: number) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      {treatment.benefits && treatment.benefits.length > 0 && (
                        <ul className="mt-3 text-sm text-gray-500 space-y-1">
                          {treatment.benefits.map((b: string, j: number) => (
                            <li key={j} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3 h-3 mt-1 text-purple-500 shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Combined Treatment Simulation — ONE image for all procedures */}
          {(() => {
            const combinedUrl = data.simulationImages?.["__combined__"];
            const hasOldStyle = data.simulationImages && Object.keys(data.simulationImages).some(k => k !== "__combined__");
            const simUrl = combinedUrl || (hasOldStyle ? Object.values(data.simulationImages)[0] : null);
            const procedureNames = report.skinProcedures.map((p: any) => p.name).join(", ");

            return (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="mb-8 p-6 md:p-8 rounded-2xl border border-pink-100 bg-white shadow-sm"
              >
                <SectionHeader
                  icon={Eye}
                  title="Your Treatment Preview"
                  subtitle="AI-generated simulation showing your potential results"
                />
                {simUrl ? (
                  <BeforeAfterSlider
                    beforeUrl={data.imageUrl}
                    afterUrl={simUrl}
                    label={`Combined Results — ${procedureNames}`}
                  />
                ) : simulationsLoading ? (
                  <div className="flex items-center gap-3 p-5 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-200">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-purple-700">Generating Your Treatment Preview</p>
                      <p className="text-xs text-purple-500 mt-0.5">Our AI is creating a personalized before/after simulation showing the combined results of all your recommended treatments...</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Treatment simulation will appear here once generated.</p>
                  </div>
                )}
              </motion.section>
            );
          })()}

          {/* Section: Procedures with Treatment Details */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8 p-6 md:p-8 rounded-2xl border border-pink-100 bg-white shadow-sm"
          >
            <SectionHeader
              icon={Syringe}
              title="Recommended Treatments"
              subtitle="These treatments are safe and effective for your skin type"
            />
            <div className="space-y-6">
              {report.skinProcedures.map((proc: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors overflow-hidden"
                >
                  {/* Treatment Header */}
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-white">
                          #{i + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h3 className="font-bold text-lg">{proc.name}</h3>
                          {proc.price && (
                            <span className="shrink-0 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">
                              {proc.price}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                          {proc.reason}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {proc.targetConditions.map((c: string, j: number) => (
                            <span
                              key={j}
                              className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Simulation Section */}
                  {proc.simulation && (
                    <div className="border-t border-gray-100">
                      {/* Before / After Text Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-4 bg-gray-50">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-[8px] font-bold text-white">NOW</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Before</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {proc.simulation.beforeDescription}
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                              <Sparkles className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">After Treatment</span>
                          </div>
                          <p className="text-sm text-purple-800 leading-relaxed">
                            {proc.simulation.afterDescription}
                          </p>
                        </div>
                      </div>

                      {/* Improvement Gauge */}
                      <div className="px-5 py-4 bg-white border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Expected Improvement
                          </span>
                          <span className="text-sm font-bold text-purple-600">
                            {proc.simulation.improvementPercent}%
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-1000"
                            style={{ width: `${proc.simulation.improvementPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {proc.simulation.sessionsNeeded}
                          </span>
                          <span>Full results in ~{proc.simulation.timelineWeeks} weeks</span>
                        </div>
                      </div>

                      {/* Progress Timeline */}
                      {proc.simulation.milestones && proc.simulation.milestones.length > 0 && (
                        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Your Progress Timeline
                          </p>
                          <div className="relative">
                            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-pink-300 to-purple-400" />
                            <div className="space-y-3">
                              {proc.simulation.milestones.map((m: any, mi: number) => (
                                <div key={mi} className="relative pl-7">
                                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-purple-400 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-purple-600">
                                        {m.timepoint}
                                      </span>
                                      <span className="text-[10px] text-gray-400">
                                        ~{m.improvementPercent}% improvement
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                      {m.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fallback: expectedResults only (for older reports without simulation) */}
                  {!proc.simulation && proc.expectedResults && (
                    <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-pink-50 to-purple-50">
                      <p className="text-xs font-semibold text-purple-700 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        What to Expect
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        {proc.expectedResults}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          {/* Section: Products */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8 p-6 md:p-8 rounded-2xl border border-pink-100 bg-white shadow-sm"
          >
            <SectionHeader
              icon={FlaskConical}
              title="Your Skincare Routine"
              subtitle="Products picked specifically for your skin"
            />
            <p className="text-sm text-gray-500 mb-4">
              Shop these products at{" "}
              <a
                href={withUtm(SHOP_URL, "shop_header")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline font-medium"
              >
                rkaskin.co
              </a>
            </p>
            {/* Bundle Deals */}
            {(() => {
              const recNames = report.skincareProducts.map((p: any) => p.name);
              const matchedBundles = findMatchingBundlesByName(recNames);
              if (matchedBundles.length > 0) {
                return (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-pink-500" />
                      Bundle Deals — Save More!
                    </h3>
                    <div className="space-y-3">
                      {matchedBundles.map((bundle: BundleDeal) => (
                        <a
                          key={bundle.id}
                          href={withUtm(SHOP_URL, `bundle_${bundle.id}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 rounded-xl border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 hover:border-pink-400 transition-all hover:shadow-md"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900">{bundle.name}</span>
                            <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-xs font-bold">
                              {bundle.discount}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{bundle.tagline}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-purple-600">{bundle.bundlePrice}</span>
                            <span className="text-sm text-gray-400 line-through">{bundle.originalPrice}</span>
                            <span className="text-xs text-green-600 font-medium">Save {bundle.savings}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1">
                            Includes: {bundle.productNames.join(" + ")}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="space-y-4">
              {report.skincareProducts.map((product: any, i: number) => {
                // Find matching product image from catalog
                const allCatalogProducts = PRODUCT_CATALOG.flatMap((c) => c.products);
                const catalogMatch = allCatalogProducts.find(
                  (cp) => cp.name.toLowerCase() === product.name.toLowerCase() ||
                    cp.sku === product.sku
                );
                const imageUrl = catalogMatch?.imageUrl;
                const categoryIcon: Record<string, string> = {
                  cleanser: "\ud83e\uddf4",
                  cream: "\ud83e\ude75",
                  serum: "\ud83d\udca7",
                  toner: "\ud83c\udf3f",
                  mask: "\ud83c\udfad",
                  sunscreen: "\u2600\ufe0f",
                  moisturizer: "\ud83d\udca6",
                  exfoliant: "\u2728",
                  eye: "\ud83d\udc41\ufe0f",
                  lip: "\ud83d\udc8b",
                };
                const typeKey = (product.type || "").toLowerCase();
                const icon = Object.entries(categoryIcon).find(([k]) => typeKey.includes(k))?.[1] || "\ud83e\uddea";
                return (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors bg-gradient-to-r from-white to-pink-50/30"
                  >
                    <div className="flex items-start gap-3">
                      {/* Product Image or Icon */}
                      {imageUrl ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-white">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-pink-100 to-purple-100">${icon}</div>`;
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shrink-0 text-2xl">
                          {icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              {product.sku && (
                                <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {product.sku}
                                </span>
                              )}
                              <span className="text-xs text-purple-600 font-medium">
                                {product.type}
                              </span>
                            </div>
                          </div>
                          {product.price && (
                            <span className="shrink-0 px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">
                              {product.price}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">
                          {product.purpose}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {product.keyIngredients.slice(0, 4).map((ing: string, j: number) => (
                            <span
                              key={j}
                              className="px-1.5 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[10px] font-medium border border-pink-200"
                            >
                              {ing}
                            </span>
                          ))}
                          {product.keyIngredients.length > 4 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-500 text-[10px]">
                              +{product.keyIngredients.length - 4} more
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <a
                            href={withUtm(SHOP_URL, product.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs font-medium hover:bg-purple-700 transition-colors shadow-sm"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            Shop Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <a
                href={withUtm(SHOP_URL, "shop_all_products")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium hover:shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop All Products at rkaskin.co
              </a>
            </div>
          </motion.section>

          {/* Section: Scar Treatment Packages */}
          {report.scarTreatments && report.scarTreatments.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mb-8 p-6 md:p-8 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/30 to-pink-50/30 shadow-sm"
            >
              <SectionHeader
                icon={Shield}
                title="Scar Treatment Packages"
                subtitle="Bundled treatments designed for your specific scarring"
              />
              <p className="text-sm text-gray-500 mb-4">
                We've put together personalized treatment packages to address the scarring we detected.
                Each package bundles multiple treatments together so you save money and get the best results.
              </p>
              <div className="space-y-6">
                {report.scarTreatments.map((scar: ScarTreatment, i: number) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    {/* Header: scar type, package name, price */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 mb-1">
                          {scar.scarType}
                        </span>
                        <h4 className="font-semibold text-base text-gray-800">{scar.packageName}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-purple-600">{scar.price}</span>
                        {scar.savings && (
                          <p className="text-xs text-emerald-600 font-medium">Save {scar.savings}</p>
                        )}
                      </div>
                    </div>

                    {/* Why this package */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{scar.reason}</p>

                    {/* Timeline bar */}
                    <div className="mb-4 p-3 rounded-lg bg-purple-50/50 border border-purple-100">
                      <h5 className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Your Treatment Timeline
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-md bg-white">
                          <p className="text-xs text-gray-500">Sessions</p>
                          <p className="text-sm font-semibold text-gray-800">{scar.sessions} sessions</p>
                          {scar.sessionSpacing && (
                            <p className="text-xs text-gray-400">{scar.sessionSpacing}</p>
                          )}
                        </div>
                        <div className="text-center p-2 rounded-md bg-white">
                          <p className="text-xs text-gray-500">First Results</p>
                          <p className="text-sm font-semibold text-gray-800">{scar.firstResultsTimeline || '2-4 weeks'}</p>
                        </div>
                        <div className="text-center p-2 rounded-md bg-white">
                          <p className="text-xs text-gray-500">Full Results</p>
                          <p className="text-sm font-semibold text-gray-800">{scar.totalTimeline || '4-6 months'}</p>
                        </div>
                      </div>
                    </div>

                    {/* What's included — with explanations */}
                    <div className="mb-3">
                      <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-purple-400" />
                        What You'll Get
                      </h5>
                      <div className="space-y-2">
                        {scar.treatmentExplanations && scar.treatmentExplanations.length > 0 ? (
                          scar.treatmentExplanations.map((tx: { name: string; whatItDoes: string }, j: number) => (
                            <div key={j} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-800">{tx.name}</span>
                              </div>
                              <p className="text-xs text-gray-500 ml-5 leading-relaxed">{tx.whatItDoes}</p>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {scar.includes.map((item: string, j: number) => (
                              <span
                                key={j}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-gray-50 text-gray-600 border border-gray-100"
                              >
                                <Check className="w-3 h-3 text-emerald-500" />
                                {item}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-gray-400 italic">
                      Results vary by individual. Treatments can reduce the appearance of scarring but complete removal is not guaranteed.
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a
                  href={CHECKIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Book a Scar Consultation
                </a>
              </div>
            </motion.section>
          )}

          {/* Section: Insights */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8 p-6 md:p-8 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/30 to-pink-50/30 shadow-sm"
          >
            <SectionHeader
              icon={Telescope}
              title="Looking Ahead"
              subtitle="What your skin needs now and in the future"
            />
            {report.cellularAnalysis && (
              <div className="mb-5 p-4 rounded-xl bg-white border border-gray-100">
                <h3 className="font-semibold text-sm mb-1 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-purple-500" />
                  Under the Surface
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {report.cellularAnalysis}
                </p>
              </div>
            )}
            {report.skinTrajectory && (
              <div className="mb-5 p-4 rounded-xl bg-white border border-gray-100">
                <h3 className="font-semibold text-sm mb-1">Where Your Skin is Heading</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {report.skinTrajectory}
                </p>
              </div>
            )}
            <div className="space-y-3">
              {report.predictiveInsights.map((insight: any, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm">{insight.title}</h3>
                      <p className="text-xs text-purple-500 mb-1">
                        {insight.timeframe}
                      </p>
                      <p className="text-sm text-gray-600">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Section: Roadmap */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8 p-6 md:p-8 rounded-2xl border border-pink-100 bg-white shadow-sm"
          >
            <SectionHeader
              icon={Map}
              title="Your Improvement Plan"
              subtitle="A step-by-step roadmap to your best skin"
            />
            <div className="relative">
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-pink-300 to-purple-300" />

              <div className="space-y-6">
                {report.roadmap.map((phase: any, i: number) => (
                  <div key={i} className="relative pl-12">
                    <div className="absolute left-2.5 top-1 w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">
                        {phase.phase}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <h3 className="font-semibold text-sm">{phase.title}</h3>
                        <span className="text-xs text-purple-600 font-medium px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200">
                          {phase.duration}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                            Goals
                          </span>
                          <ul className="text-sm text-gray-600 mt-1 space-y-0.5">
                            {phase.goals.map((g: string, j: number) => (
                              <li key={j} className="flex items-start gap-1.5">
                                <ChevronRight className="w-3 h-3 mt-1 shrink-0 text-purple-400" />
                                {g}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                            Treatments
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {phase.treatments.map((t: string, j: number) => (
                              <span
                                key={j}
                                className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-medium border border-purple-200"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-purple-500 italic">
                          Expected: {phase.expectedOutcome}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Final Booking CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8"
          >
            <BookingCTA />
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="p-5 rounded-xl bg-gray-50 border border-gray-200"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm mb-1">A Quick Note</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {report.disclaimer}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Share Results */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8"
          >
            <ShareResults reportId={reportId} patientName={`${data.patientFirstName} ${data.patientLastName}`} patientEmail={data.patientEmail} />
          </motion.div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Powered by RadiantilyK AI Skin Analysis
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
