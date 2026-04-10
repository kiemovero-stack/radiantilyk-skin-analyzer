import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import type { SkinAnalysisReport, Severity, ScarTreatment } from "@shared/types";
import { PRODUCT_CATALOG } from "@shared/productCatalog";
import {
  Sparkles,
  ArrowLeft,
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
  User,
  Mail,
  Calendar,
  Clock,
  Download,
  Send,
  Check,
  Eye,
  Heart,
  Target,
  DollarSign,
  Phone,
  Briefcase,
  RefreshCw,
  History as HistoryIcon,
  ArrowRight,
  Camera,
  Printer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const severityColor: Record<Severity, string> = {
  mild: "text-emerald-600",
  moderate: "text-amber-600",
  severe: "text-red-600",
};

const severityBg: Record<Severity, string> = {
  mild: "bg-emerald-50 border-emerald-200",
  moderate: "bg-amber-50 border-amber-200",
  severe: "bg-red-50 border-red-200",
};

const severityBadge: Record<Severity, string> = {
  mild: "bg-emerald-100 text-emerald-700",
  moderate: "bg-amber-100 text-amber-700",
  severe: "bg-red-100 text-red-700",
};

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "stroke-emerald-500"
      : score >= 60
        ? "stroke-amber-500"
        : "stroke-red-500";

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="currentColor"
          className="text-border"
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
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

/**
 * Before/After slider for treatment simulation images.
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
      <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
        <Eye className="w-3 h-3" />
        {label}
      </p>
      <div
        ref={(el) => { divRef.current = el; }}
        className="relative w-full aspect-square rounded-xl overflow-hidden cursor-col-resize border border-primary/20 shadow-sm"
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
              <ChevronRight className="w-3 h-3 text-primary rotate-180" />
              <ChevronRight className="w-3 h-3 text-primary" />
            </div>
          </div>
        </div>
        {/* Labels */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold z-20">
          BEFORE
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold z-20">
          AFTER
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1 text-center">
        Drag the slider to compare — AI-generated simulation for illustration purposes
      </p>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  number,
  title,
}: {
  icon: React.ElementType;
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <span className="text-xs font-mono text-primary/60 uppercase tracking-wider">
          Section {number}
        </span>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </div>
    </div>
  );
}

export default function Report() {
  const params = useParams<{ id: string }>();
  const reportId = parseInt(params.id || "0");

  const { data, isLoading, error } = trpc.skin.getReport.useQuery(
    { id: reportId },
    { enabled: reportId > 0 }
  );

  // All hooks MUST be called before any early returns (React rules of hooks)
  const [downloading, setDownloading] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [simulationImages, setSimulationImages] = useState<Record<string, string>>({});
  const [simulationsLoading, setSimulationsLoading] = useState(false);
  const [agingImages, setAgingImages] = useState<Record<string, string>>({});
  const [agingLoading, setAgingLoading] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);

  // Poll for simulation images
  useEffect(() => {
    if (!data || isLoading) return;
    // Check if simulations already exist in the data
    const existingSims = (data as any).simulationImages;
    if (existingSims && typeof existingSims === "object" && Object.keys(existingSims).length > 0) {
      setSimulationImages(existingSims);
      return;
    }
    // Start polling
    setSimulationsLoading(true);
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/trpc/skin.getSimulations?batch=1&input=${encodeURIComponent(JSON.stringify({ "0": { json: { id: reportId } } }))}`);
        const json = await res.json();
        const result = json?.[0]?.result?.data?.json;
        if (result?.ready && result?.simulationImages) {
          setSimulationImages(result.simulationImages);
          setSimulationsLoading(false);
          clearInterval(interval);
        }
      } catch { /* ignore polling errors */ }
    }, 5000);
    // Stop polling after 3 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setSimulationsLoading(false);
    }, 180000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [data, isLoading, reportId]);

  // Poll for aging images
  useEffect(() => {
    if (!data || isLoading) return;
    const existingAging = (data as any).agingImages;
    if (existingAging && typeof existingAging === "object" && Object.keys(existingAging).length > 0) {
      setAgingImages(existingAging);
      return;
    }
    // Start polling
    setAgingLoading(true);
    let attempts = 0;
    const maxAttempts = 40;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/client/aging/${reportId}`);
        if (!res.ok) return;
        const result = await res.json();
        if (result.ready && result.agingImages) {
          setAgingImages(result.agingImages);
          setAgingLoading(false);
          clearInterval(interval);
        }
      } catch { /* ignore polling errors */ }
      if (attempts >= maxAttempts) {
        setAgingLoading(false);
        clearInterval(interval);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [data, isLoading, reportId]);

  const downloadPdf = trpc.skin.downloadPdf.useMutation({
    onSuccess: (result) => {
      // Convert base64 to blob and trigger download
      const byteChars = atob(result.base64);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully");
      setDownloading(false);
    },
    onError: (err) => {
      toast.error(`Failed to generate PDF: ${err.message}`);
      setDownloading(false);
    },
  });

  const emailReport = trpc.skin.emailReport.useMutation({
    onSuccess: () => {
      toast.success(`Report emailed to ${data?.patientEmail}`);
      setEmailing(false);
      setEmailSent(true);
    },
    onError: (err) => {
      toast.error(`Failed to send email: ${err.message}`);
      setEmailing(false);
    },
  });

  const handleDownload = () => {
    setDownloading(true);
    downloadPdf.mutate({ id: reportId });
  };

  const handleEmail = () => {
    setEmailing(true);
    emailReport.mutate({ id: reportId });
  };

  const reanalyzeMutation = trpc.skin.reanalyze.useMutation({
    onSuccess: () => {
      toast.success("Re-analysis started! The page will refresh when complete.");
      // Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/trpc/skin.getStatus?batch=1&input=${encodeURIComponent(JSON.stringify({ "0": { json: { id: reportId } } }))}`);
          const json = await res.json();
          const result = json?.[0]?.result?.data?.json;
          if (result?.status === "completed") {
            clearInterval(pollInterval);
            window.location.reload();
          } else if (result?.status === "failed") {
            clearInterval(pollInterval);
            setReanalyzing(false);
            toast.error("Re-analysis failed: " + (result?.errorMessage || "Unknown error"));
          }
        } catch { /* ignore */ }
      }, 3000);
      // Timeout after 3 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        setReanalyzing(false);
      }, 180000);
    },
    onError: (err) => {
      toast.error(`Re-analysis failed: ${err.message}`);
      setReanalyzing(false);
    },
  });

  const handleReanalyze = () => {
    if (!confirm("This will re-run the AI analysis with the latest prompt. The current report will be replaced. Continue?")) return;
    setReanalyzing(true);
    reanalyzeMutation.mutate({ id: reportId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading your report...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
            <p className="mt-4 text-muted-foreground">
              Report not found or an error occurred.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/analyze">Try Again</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const report = data.report as SkinAnalysisReport;
  const intakeData = data.intakeData as { concerns?: string[]; treatmentGoal?: string; treatmentExperience?: string; budget?: string } | null;
  const scoreHistory = (data.scoreHistory as Array<{ score: number; conditionCount: number; conditions: string[]; analyzedAt: string }>) || [];

  // Detect if 3-angle analysis was used by checking detectedInAngles on conditions
  const allDetectedAngles = new Set<string>();
  report.conditions?.forEach((c: any) => {
    if (c.detectedInAngles && Array.isArray(c.detectedInAngles)) {
      c.detectedInAngles.forEach((a: string) => allDetectedAngles.add(a.toLowerCase()));
    }
  });
  const anglesArray = Array.from(allDetectedAngles);
  const hasLeftAngle = anglesArray.some(a => a.includes("left"));
  const hasRightAngle = anglesArray.some(a => a.includes("right"));
  const hasFrontAngle = anglesArray.some(a => a.includes("front"));
  const angleCount = (hasFrontAngle ? 1 : 0) + (hasLeftAngle ? 1 : 0) + (hasRightAngle ? 1 : 0);
  const is3AngleAnalysis = angleCount >= 3;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link href="/analyze">
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              New Analysis
            </span>
          </Link>

          {/* Patient Info & Report Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-10"
          >
            {/* Patient card */}
            {data.patientFirstName && (
              <div className="p-5 rounded-2xl border border-border/60 bg-card mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{data.patientFirstName} {data.patientLastName}</h2>
                    <p className="text-xs text-muted-foreground">Patient Report</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{data.patientEmail}</span>
                  </div>
                  {data.patientPhone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" />
                      <a href={`tel:${data.patientPhone}`} className="hover:text-primary transition-colors">{data.patientPhone}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>DOB: {data.patientDob ? new Date(data.patientDob + "T00:00:00").toLocaleDateString() : "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
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

                {/* Client Concerns & Intake Data */}
                {intakeData && (
                  <div className="mt-4 pt-4 border-t border-border/40">
                    {/* Concerns */}
                    {intakeData.concerns && intakeData.concerns.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-3.5 h-3.5 text-pink-500" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client Concerns</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {intakeData.concerns.map((concern: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-medium border border-pink-500/20">
                              {concern}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Treatment Goal, Experience, Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      {intakeData.treatmentGoal && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Target className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-xs"><strong>Goal:</strong> {intakeData.treatmentGoal}</span>
                        </div>
                      )}
                      {intakeData.treatmentExperience && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-xs"><strong>Experience:</strong> {intakeData.treatmentExperience}</span>
                        </div>
                      )}
                      {intakeData.budget && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs"><strong>Budget:</strong> {intakeData.budget}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                AI Skin Analysis Report
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {data.patientFirstName ? `${data.patientFirstName}'s Skin Report` : "Your Skin Report"}
              </h1>
              <p className="mt-2 text-muted-foreground">
                Generated on{" "}
                {new Date(data.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(data.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </motion.div>

          {/* Staff Summary & Talking Points */}
          {report.staffSummary && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-10 p-6 md:p-8 rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-amber-900">Staff Consultation Guide</h2>
                    <p className="text-xs text-amber-600">Review before speaking with client — staff eyes only</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-400 text-amber-700 hover:bg-amber-100 gap-1.5"
                  onClick={() => {
                    const patientName = `${data.patientFirstName || ''} ${data.patientLastName || ''}`.trim() || 'Client';
                    const date = new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    const ss = report.staffSummary!;
                    const tps = report.talkingPoints || [];
                    const printWindow = window.open('', '_blank');
                    if (!printWindow) return;
                    printWindow.document.write(`<!DOCTYPE html><html><head><title>Consultation Guide - ${patientName}</title><style>
                      * { margin: 0; padding: 0; box-sizing: border-box; }
                      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #1a1a1a; font-size: 11px; line-height: 1.4; }
                      h1 { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
                      .subtitle { font-size: 11px; color: #666; margin-bottom: 12px; }
                      .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; padding-bottom: 3px; border-bottom: 2px solid #f59e0b; color: #92400e; }
                      .overview { background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 8px 10px; margin-bottom: 10px; }
                      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
                      .card { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px; padding: 8px 10px; }
                      .card-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 3px; }
                      .card-label.red { color: #b91c1c; }
                      .card-label.purple { color: #7e22ce; }
                      .card-label.green { color: #15803d; }
                      .card-label.blue { color: #1d4ed8; }
                      .tp { display: flex; gap: 8px; margin-bottom: 6px; padding: 6px 8px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px; }
                      .tp-num { width: 20px; height: 20px; border-radius: 50%; background: #f59e0b; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
                      .tp-topic { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; color: #92400e; margin-bottom: 2px; }
                      .tp-say { font-style: italic; color: #374151; }
                      .tp-why { font-size: 9px; color: #d97706; margin-top: 2px; }
                      .footer { margin-top: 10px; padding-top: 6px; border-top: 1px solid #e5e5e5; font-size: 9px; color: #999; text-align: center; }
                      @media print { body { padding: 12px; } @page { margin: 0.4in; size: letter; } }
                    </style></head><body>
                      <h1>Consultation Guide: ${patientName}</h1>
                      <div class="subtitle">Analysis Date: ${date} | Score: ${report.skinHealthScore}/100 | ${report.conditions?.length || 0} conditions detected</div>
                      
                      <div class="section-title">Quick Overview</div>
                      <div class="overview">${ss.quickOverview}</div>
                      
                      <div class="grid">
                        <div class="card"><div class="card-label red">\u25cf Lead With This Concern</div>${ss.topPriorityConcern}</div>
                        <div class="card"><div class="card-label purple">\u25cf Client Emotional State</div>${ss.emotionalState}</div>
                        <div class="card"><div class="card-label green">\u25cf Budget Approach</div>${ss.budgetApproach}</div>
                        <div class="card"><div class="card-label blue">\u25cf Closing Strategy</div>${ss.closingStrategy}</div>
                      </div>
                      
                      <div class="section-title">Conversation Flow</div>
                      ${tps.map((tp: any, i: number) => `<div class="tp"><div class="tp-num">${i+1}</div><div><div class="tp-topic">${tp.topic}</div><div class="tp-say">\u201c${tp.whatToSay}\u201d</div><div class="tp-why">\u2728 ${tp.whyItWorks}</div></div></div>`).join('')}
                      
                      <div class="footer">RADIANTILYK AESTHETIC • Staff Consultation Guide • Confidential</div>
                    </body></html>`);
                    printWindow.document.close();
                    setTimeout(() => printWindow.print(), 300);
                  }}
                >
                  <Printer className="w-4 h-4" />
                  Print Guide
                </Button>
              </div>

              {/* Quick Overview */}
              <div className="mb-5 p-4 rounded-xl bg-white/80 border border-amber-200">
                <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Quick Overview
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{report.staffSummary.quickOverview}</p>
              </div>

              {/* Key Strategy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="p-4 rounded-xl bg-white/80 border border-amber-200">
                  <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Lead With This Concern
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{report.staffSummary.topPriorityConcern}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/80 border border-amber-200">
                  <h3 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Client Emotional State
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{report.staffSummary.emotionalState}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/80 border border-amber-200">
                  <h3 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Budget Approach
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{report.staffSummary.budgetApproach}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/80 border border-amber-200">
                  <h3 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Closing Strategy
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{report.staffSummary.closingStrategy}</p>
                </div>
              </div>

              {/* Talking Points */}
              {report.talkingPoints && report.talkingPoints.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" /> Conversation Flow — Say This
                  </h3>
                  <div className="space-y-3">
                    {report.talkingPoints.map((tp: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-white/80 border border-amber-200">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">{tp.topic}</div>
                            <p className="text-sm text-gray-800 leading-relaxed italic">“{tp.whatToSay}”</p>
                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> {tp.whyItWorks}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {/* Section 1: Score */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-10 p-6 md:p-8 rounded-2xl border border-border/60 bg-card"
          >
            <SectionHeader icon={Activity} number="01" title="Skin Health Score" />
            {scoreHistory.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <HistoryIcon className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-sm text-blue-800">Score History</h3>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {scoreHistory.map((entry, i) => {
                    const isLast = i === scoreHistory.length - 1;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${isLast ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
                            {entry.score ?? '—'}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {new Date(entry.analyzedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    );
                  })}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {report.skinHealthScore}
                    </div>
                    <div className="text-[10px] text-green-600 font-medium">Current</div>
                  </div>
                  {scoreHistory.length > 0 && (() => {
                    const lastPrevious = scoreHistory[scoreHistory.length - 1].score;
                    const diff = report.skinHealthScore - (lastPrevious ?? 0);
                    if (lastPrevious == null || diff === 0) return null;
                    return (
                      <div className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                        diff > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {diff > 0 ? `+${diff}` : diff} points
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ScoreGauge score={report.skinHealthScore} />
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                  <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                    {report.skinType}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                    {report.skinTone}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                    Fitzpatrick Type {report.fitzpatrickType}
                  </span>
                  {is3AngleAnalysis ? (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      3-Angle Enhanced Accuracy
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      {angleCount === 1 ? "Front Only" : `${angleCount}-Angle`} Analysis
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {report.scoreJustification}
                </p>
              </div>
            </div>
            {report.positiveFindings && report.positiveFindings.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h3 className="font-semibold text-sm text-emerald-800 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Positive Findings
                </h3>
                <ul className="text-sm text-emerald-700 space-y-1">
                  {report.positiveFindings.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 mt-1 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>

          {/* Section 2: Advanced Analysis */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 p-6 md:p-8 rounded-2xl border border-border/60 bg-card"
          >
            <SectionHeader
              icon={Stethoscope}
              number="02"
              title="Advanced Skin Analysis"
            />
            <p className="text-sm text-muted-foreground mb-6">{report.summary}</p>
            <div className="space-y-4">
              {report.conditions.map((condition, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-4 rounded-xl border",
                    severityBg[condition.severity]
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">
                          {condition.name}
                        </h3>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase",
                            severityBadge[condition.severity]
                          )}
                        >
                          {condition.severity}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Area: {condition.area}
                      </p>
                      <p className="text-sm leading-relaxed">
                        {condition.description}
                      </p>
                      {condition.cellularInsight && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Cellular insight: {condition.cellularInsight}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Section 3: Missed Conditions */}
          {report.missedConditions && report.missedConditions.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mb-10 p-6 md:p-8 rounded-2xl border border-border/60 bg-card"
            >
              <SectionHeader
                icon={AlertTriangle}
                number="03"
                title="Conditions Often Missed"
              />
              <p className="text-sm text-muted-foreground mb-4">
                These conditions are frequently overlooked by standard skin
                analyzers but were identified in your analysis.
              </p>
              <div className="space-y-3">
                {report.missedConditions.map((condition, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{condition.name}</h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase",
                          severityBadge[condition.severity]
                        )}
                      >
                        {condition.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Area: {condition.area}
                    </p>
                    <p className="text-sm leading-relaxed">
                      {condition.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 4: Top 2 Facials */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 p-6 md:p-8 rounded-2xl border border-border/60 bg-card"
          >
            <SectionHeader
              icon={Sparkles}
              number="04"
              title="Top 2 Facial Treatments"
            />
            <div className="grid gap-4">
              {report.facialTreatments.map((treatment, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-primary/20 bg-primary/[0.03]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold">{treatment.name}</h3>
                        {treatment.price && (
                          <span className="shrink-0 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {treatment.price}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {treatment.reason}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {treatment.targetConditions.map((c, j) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      {treatment.benefits.length > 0 && (
                        <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                          {treatment.benefits.map((b, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3 h-3 mt-1 text-primary shrink-0" />
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

          {/* Section 5: Top 4 Procedures */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 p-6 md:p-8 rounded-2xl border border-border/60 bg-card"
          >
            <SectionHeader
              icon={Syringe}
              number="05"
              title="Top 4 Skin Procedures"
            />
            <div className="space-y-4">
              {report.skinProcedures.map((proc, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-border/60 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">
                        #{i + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold">{proc.name}</h3>
                        {proc.price && (
                          <span className="shrink-0 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {proc.price}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {proc.reason}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {proc.targetConditions.map((c, j) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      {proc.expectedResults && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Expected: {proc.expectedResults}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Treatment Simulation — Before/After Preview */}
          {(() => {
            const combinedUrl = simulationImages?.["__combined__"];
            const hasOldStyle = simulationImages && Object.keys(simulationImages).some(k => k !== "__combined__");
            const simUrl = combinedUrl || (hasOldStyle ? Object.values(simulationImages)[0] : null);
            const procedureNames = report.skinProcedures.map((p: any) => p.name).join(", ");

            return (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="mb-10 p-6 md:p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent"
              >
                <SectionHeader
                  icon={Eye}
                  number=""
                  title="Treatment Preview"
                />
                {simUrl ? (
                  <BeforeAfterSlider
                    beforeUrl={data.imageUrl}
                    afterUrl={simUrl}
                    label={`Combined Results — ${procedureNames}`}
                  />
                ) : simulationsLoading ? (
                  <div className="flex items-center gap-3 p-5 rounded-xl bg-primary/5 border border-primary/20">
                    <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">Generating Treatment Preview</p>
                      <p className="text-xs text-muted-foreground mt-0.5">AI is creating a before/after simulation showing the combined results of all recommended treatments...</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-muted/50 border border-border/60 text-center">
                    <p className="text-sm text-muted-foreground">Treatment simulation will appear here once generated.</p>
                  </div>
                )}
              </motion.section>
            );
          })()}

          {/* Section: Future Aging Self — See Yourself in 20 Years */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 p-6 md:p-8 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-orange-50/30"
          >
            <SectionHeader
              icon={Telescope}
              number=""
              title="Future Aging Simulation"
            />
            {agingImages && Object.keys(agingImages).length > 0 ? (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI-projected appearance in <strong>20 years</strong> — comparing natural aging vs. aging with consistent professional treatment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Without Treatment */}
                  {agingImages.withoutTreatment && (
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                      <div className="bg-muted px-4 py-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Without Treatment</span>
                      </div>
                      <div className="relative aspect-square">
                        <img
                          src={agingImages.withoutTreatment}
                          alt="Projected appearance in 20 years without treatment"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold">
                          +20 YEARS
                        </div>
                      </div>
                      <div className="p-3 bg-muted/50">
                        <p className="text-xs text-muted-foreground">Natural aging without professional treatments or advanced skincare</p>
                      </div>
                    </div>
                  )}
                  {/* With Treatment */}
                  {agingImages.withTreatment && (
                    <div className="rounded-xl overflow-hidden border border-primary/30 shadow-sm ring-2 ring-primary/10">
                      <div className="bg-primary/10 px-4 py-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-primary uppercase tracking-wide">With Treatment</span>
                      </div>
                      <div className="relative aspect-square">
                        <img
                          src={agingImages.withTreatment}
                          alt="Projected appearance in 20 years with consistent treatment"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                          +20 YEARS WITH CARE
                        </div>
                      </div>
                      <div className="p-3 bg-primary/5">
                        <p className="text-xs text-primary/80">Aging gracefully with consistent professional treatments and advanced skincare</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Interactive slider if both images are available */}
                {agingImages.withoutTreatment && agingImages.withTreatment && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Drag to compare — Without vs. With Treatment
                    </p>
                    <BeforeAfterSlider
                      beforeUrl={agingImages.withoutTreatment}
                      afterUrl={agingImages.withTreatment}
                      label="20-Year Aging Comparison: Without Treatment vs. With Treatment"
                    />
                  </div>
                )}
              </div>
            ) : agingLoading ? (
              <div className="flex items-center gap-3 p-5 rounded-xl bg-amber-50 border border-amber-200">
                <Loader2 className="w-5 h-5 animate-spin text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-700">Generating Aging Simulation</p>
                  <p className="text-xs text-amber-500 mt-0.5">AI is creating a personalized aging simulation showing the client in 20 years — with and without treatment. This takes a couple of minutes...</p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-amber-50/50 border border-amber-200 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Telescope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold">Future Aging Simulation</p>
                  <p className="text-sm text-muted-foreground mt-1">Generate a realistic preview of how this client will look in 20 years — with and without professional treatment.</p>
                </div>
                <button
                  onClick={async () => {
                    setAgingLoading(true);
                    try {
                      await fetch(`/api/client/aging/${reportId}/generate`, { method: 'POST' });
                      // Start polling
                      const poll = setInterval(async () => {
                        try {
                          const res = await fetch(`/api/client/aging/${reportId}`);
                          const result = await res.json();
                          if (result.ready && result.agingImages) {
                            setAgingImages(result.agingImages);
                            setAgingLoading(false);
                            clearInterval(poll);
                          }
                        } catch {}
                      }, 8000);
                      setTimeout(() => { clearInterval(poll); setAgingLoading(false); }, 300000);
                    } catch {
                      setAgingLoading(false);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Aging Simulation
                </button>
                <p className="text-[10px] text-muted-foreground">Takes 1-3 minutes. AI-generated simulation for illustration purposes only.</p>
              </div>
            )}
          </motion.section>

          {/* Section 6: Skincare Products */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 p-6 md:p-8 rounded-2xl border border-border/60 bg-card"
          >
            <SectionHeader
              icon={FlaskConical}
              number="06"
              title="Recommended Skincare Products"
            />
            <p className="text-sm text-muted-foreground mb-4">
              Available at{" "}
              <a
                href="https://rkaskin.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                rkaskin.co
              </a>
            </p>
            <div className="space-y-4">
              {report.skincareProducts.map((product, i) => {
                const allCatalogProducts = PRODUCT_CATALOG.flatMap((c) => c.products);
                const catalogMatch = allCatalogProducts.find(
                  (cp) => cp.name.toLowerCase() === product.name.toLowerCase() ||
                    cp.sku === product.sku
                );
                const imageUrl = catalogMatch?.imageUrl;
                return (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border/60 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {imageUrl ? (
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border bg-white">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="text-xs font-bold text-primary">#${i + 1}</span></div>`;
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            #{i + 1}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              {product.sku && (
                                <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                  {product.sku}
                                </span>
                              )}
                              <span className="text-xs text-primary font-medium">
                                {product.type}
                              </span>
                            </div>
                          </div>
                          {product.price && (
                            <span className="shrink-0 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                              {product.price}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {product.purpose}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {product.keyIngredients.map((ing, j) => (
                            <span
                              key={j}
                              className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {product.targetConditions.map((c, j) => (
                            <span
                              key={j}
                              className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-medium"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Section 6.5: Scar Treatment Packages */}
          {report.scarTreatments && report.scarTreatments.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mb-10 p-6 md:p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent"
            >
              <SectionHeader
                icon={Shield}
                number=""
                title="Scar Treatment Packages"
              />
              <p className="text-sm text-muted-foreground mb-4">
                Personalized scar treatment packages based on detected scarring.
                Each package bundles multiple treatments at a discounted rate.
              </p>
              <div className="space-y-4">
                {report.scarTreatments.map((scar: ScarTreatment, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary mb-1">
                          {scar.scarType}
                        </span>
                        <h4 className="font-semibold text-sm">{scar.packageName}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">{scar.price}</span>
                        {scar.savings && (
                          <p className="text-xs text-emerald-600 font-medium">Save {scar.savings}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{scar.reason}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-muted-foreground">{scar.sessions} sessions</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {scar.includes.map((item: string, j: number) => (
                        <span
                          key={j}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                        >
                          <Check className="w-3 h-3 text-emerald-500" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Section 7: Next-Level Insights */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 p-6 md:p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent"
          >
            <SectionHeader
              icon={Telescope}
              number="07"
              title="Next-Level Insights"
            />
            {report.cellularAnalysis && (
              <div className="mb-5 p-4 rounded-xl bg-card border border-border/60">
                <h3 className="font-semibold text-sm mb-1">Cellular Analysis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {report.cellularAnalysis}
                </p>
              </div>
            )}
            {report.skinTrajectory && (
              <div className="mb-5 p-4 rounded-xl bg-card border border-border/60">
                <h3 className="font-semibold text-sm mb-1">Skin Trajectory</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {report.skinTrajectory}
                </p>
              </div>
            )}
            <div className="space-y-3">
              {report.predictiveInsights.map((insight, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-card border border-border/60"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm">{insight.title}</h3>
                      <p className="text-xs text-primary/70 mb-1">
                        {insight.timeframe}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Section 8: Optimization Roadmap */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-10 p-6 md:p-8 rounded-2xl border border-border/60 bg-card"
          >
            <SectionHeader
              icon={Map}
              number="08"
              title="Skin Optimization Roadmap"
            />
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

              <div className="space-y-6">
                {report.roadmap.map((phase, i) => (
                  <div key={i} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className="absolute left-2.5 top-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-[9px] font-bold text-primary-foreground">
                        {phase.phase}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-border/60 bg-accent/20">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">{phase.title}</h3>
                        <span className="text-xs text-primary font-medium px-2 py-0.5 rounded-full bg-primary/10">
                          {phase.duration}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                            Goals
                          </span>
                          <ul className="text-sm text-muted-foreground mt-1 space-y-0.5">
                            {phase.goals.map((g, j) => (
                              <li key={j} className="flex items-start gap-1.5">
                                <ChevronRight className="w-3 h-3 mt-1 shrink-0" />
                                {g}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                            Treatments
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {phase.treatments.map((t, j) => (
                              <span
                                key={j}
                                className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-primary/70 italic">
                          Expected outcome: {phase.expectedOutcome}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Disclaimer */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="p-5 rounded-xl bg-muted/50 border border-border/60"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Medical Disclaimer</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {report.disclaimer}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {downloading ? "Generating PDF..." : "Download PDF"}
            </Button>
            <Button
              onClick={handleEmail}
              disabled={emailing || emailSent}
              variant={emailSent ? "outline" : "default"}
              className={emailSent ? "border-emerald-300 text-emerald-700" : "bg-primary text-primary-foreground hover:bg-primary/90"}
            >
              {emailing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : emailSent ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {emailing
                ? "Sending..."
                : emailSent
                  ? `Sent to ${data.patientEmail}`
                  : `Email to ${data.patientEmail}`}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/analyze">
                <Sparkles className="w-4 h-4 mr-2" />
                New Analysis
              </Link>
            </Button>
            <Button
              onClick={handleReanalyze}
              disabled={reanalyzing}
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              {reanalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {reanalyzing ? "Re-analyzing..." : "Re-analyze"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/history">View History</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
