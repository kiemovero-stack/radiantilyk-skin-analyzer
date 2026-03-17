import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import type { SkinAnalysisReport, Severity } from "@shared/types";
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
} from "lucide-react";
import { useState } from "react";
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

          {/* Section 1: Score */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-10 p-6 md:p-8 rounded-2xl border border-border/60 bg-card"
          >
            <SectionHeader icon={Activity} number="01" title="Skin Health Score" />
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
              {report.skincareProducts.map((product, i) => (
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
              ))}
            </div>
          </motion.section>

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
            <Button variant="outline" asChild>
              <Link href="/history">View History</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
