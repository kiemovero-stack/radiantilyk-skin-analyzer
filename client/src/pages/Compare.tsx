import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import type { SkinAnalysisReport, Severity } from "@shared/types";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  BarChart3,
  Activity,
  Stethoscope,
  FlaskConical,
  Calendar,
  User,
  AlertTriangle,
} from "lucide-react";
import { Link, useSearch } from "wouter";
import { motion } from "framer-motion";
import { useMemo } from "react";

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

const severityValue: Record<Severity, number> = {
  mild: 1,
  moderate: 2,
  severe: 3,
};

function ScoreTrendChart({
  analyses,
}: {
  analyses: Array<{ date: string; score: number }>;
}) {
  if (analyses.length < 2) return null;

  const maxScore = 100;
  const minScore = 0;
  const chartHeight = 160;
  const chartWidth = 400;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const points = analyses.map((a, i) => ({
    x: padding.left + (i / (analyses.length - 1)) * innerWidth,
    y:
      padding.top +
      innerHeight -
      ((a.score - minScore) / (maxScore - minScore)) * innerHeight,
    score: a.score,
    date: a.date,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const firstScore = analyses[0].score;
  const lastScore = analyses[analyses.length - 1].score;
  const scoreDiff = lastScore - firstScore;

  return (
    <div className="bg-card rounded-2xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Score Progression</h3>
        </div>
        <div className="flex items-center gap-2">
          {scoreDiff > 0 ? (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              <TrendingUp className="w-3 h-3 mr-1" />+{scoreDiff} pts
            </Badge>
          ) : scoreDiff < 0 ? (
            <Badge
              variant="outline"
              className="border-red-200 bg-red-50 text-red-700"
            >
              <TrendingDown className="w-3 h-3 mr-1" />
              {scoreDiff} pts
            </Badge>
          ) : (
            <Badge variant="outline">
              <Minus className="w-3 h-3 mr-1" />
              No change
            </Badge>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full max-w-[400px]"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y =
              padding.top +
              innerHeight -
              ((val - minScore) / (maxScore - minScore)) * innerHeight;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground"
                  fontSize="10"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                className="fill-foreground font-semibold"
                fontSize="11"
              >
                {p.score}
              </text>
              <text
                x={p.x}
                y={chartHeight - 6}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="9"
              >
                {p.date}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function ConditionTracker({
  analyses,
}: {
  analyses: Array<{
    date: string;
    report: SkinAnalysisReport;
  }>;
}) {
  // Collect all unique conditions across all analyses
  const conditionMap = useMemo(() => {
    const map = new Map<
      string,
      Array<{ date: string; severity: Severity; area: string } | null>
    >();

    for (let i = 0; i < analyses.length; i++) {
      const allConditions = [
        ...(analyses[i].report.conditions || []),
        ...(analyses[i].report.missedConditions || []),
      ];
      for (const c of allConditions) {
        if (!map.has(c.name)) {
          map.set(
            c.name,
            Array(analyses.length).fill(null)
          );
        }
        map.get(c.name)![i] = {
          date: analyses[i].date,
          severity: c.severity,
          area: c.area,
        };
      }
    }

    return map;
  }, [analyses]);

  if (conditionMap.size === 0) return null;

  return (
    <div className="bg-card rounded-2xl border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Condition Tracking</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        See how each condition has changed across analyses. Green means
        improvement, red means worsening.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                Condition
              </th>
              {analyses.map((a, i) => (
                <th
                  key={i}
                  className="text-center py-2 px-3 font-medium text-muted-foreground min-w-[100px]"
                >
                  {a.date}
                </th>
              ))}
              <th className="text-center py-2 px-3 font-medium text-muted-foreground">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from(conditionMap.entries()).map(([name, entries]) => {
              // Determine trend
              const nonNull = entries.filter(Boolean);
              let trend: "improved" | "worsened" | "stable" | "new" | "resolved" =
                "stable";

              if (nonNull.length >= 2) {
                const first = severityValue[nonNull[0]!.severity];
                const last = severityValue[nonNull[nonNull.length - 1]!.severity];
                if (last < first) trend = "improved";
                else if (last > first) trend = "worsened";
              }

              // Check if condition appeared or disappeared
              if (entries[0] === null && entries[entries.length - 1] !== null) {
                trend = "new";
              }
              if (entries[0] !== null && entries[entries.length - 1] === null) {
                trend = "resolved";
              }

              return (
                <tr key={name} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">{name}</td>
                  {entries.map((entry, i) => (
                    <td key={i} className="text-center py-3 px-3">
                      {entry ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            severityBg[entry.severity],
                            severityColor[entry.severity]
                          )}
                        >
                          {entry.severity}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                  ))}
                  <td className="text-center py-3 px-3">
                    {trend === "improved" && (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-700"
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Improved
                      </Badge>
                    )}
                    {trend === "worsened" && (
                      <Badge
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-700"
                      >
                        <TrendingDown className="w-3 h-3 mr-1" />
                        Worsened
                      </Badge>
                    )}
                    {trend === "stable" && (
                      <Badge variant="outline">
                        <Minus className="w-3 h-3 mr-1" />
                        Stable
                      </Badge>
                    )}
                    {trend === "new" && (
                      <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 text-amber-700"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        New
                      </Badge>
                    )}
                    {trend === "resolved" && (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-700"
                      >
                        Resolved
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SideBySideCards({
  analyses,
}: {
  analyses: Array<{
    id: number;
    date: string;
    report: SkinAnalysisReport;
  }>;
}) {
  return (
    <div className="space-y-6">
      {/* Skin Type & Score Summary */}
      <div className="bg-card rounded-2xl border p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary" />
          Analysis Summary Comparison
        </h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${analyses.length}, 1fr)` }}>
          {analyses.map((a) => (
            <div key={a.id} className="rounded-xl border bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground mb-2">{a.date}</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className={cn(
                    "text-3xl font-bold",
                    a.report.skinHealthScore >= 80
                      ? "text-emerald-600"
                      : a.report.skinHealthScore >= 60
                        ? "text-amber-600"
                        : "text-red-600"
                  )}
                >
                  {a.report.skinHealthScore}
                </span>
                <span className="text-muted-foreground text-sm">/ 100</span>
              </div>
              <p className="text-sm font-medium">{a.report.skinType}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {a.report.skinTone} &middot; Fitzpatrick {a.report.fitzpatrickType}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {a.report.conditions?.length || 0} conditions &middot;{" "}
                {a.report.missedConditions?.length || 0} missed
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Recommendations Comparison */}
      <div className="bg-card rounded-2xl border p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          Product Recommendations Over Time
        </h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${analyses.length}, 1fr)` }}>
          {analyses.map((a) => (
            <div key={a.id} className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium border-b pb-1">
                {a.date}
              </p>
              {a.report.skincareProducts?.map((product, pi) => (
                <div
                  key={pi}
                  className="rounded-lg border bg-secondary/20 p-2.5"
                >
                  <p className="text-sm font-medium leading-tight">
                    {product.name}
                  </p>
                  {product.sku && (
                    <p className="text-xs text-primary font-medium mt-0.5">
                      {product.sku} &middot; {product.price}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {product.purpose}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Compare() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const idsParam = params.get("ids") || "";
  const ids = idsParam
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));

  const { data: analyses, isLoading, error } = trpc.skin.getComparisonData.useQuery(
    { ids },
    { enabled: ids.length >= 2 }
  );

  if (ids.length < 2) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Select Analyses to Compare</h2>
            <p className="text-muted-foreground mb-6">
              Go to the History page and select at least 2 analyses for the same
              client to compare their progress.
            </p>
            <Button asChild>
              <Link href="/history">Go to History</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !analyses || analyses.length < 2) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Comparison Unavailable</h2>
            <p className="text-muted-foreground mb-6">
              {error?.message ||
                "Could not load the selected analyses. Make sure at least 2 completed analyses are selected."}
            </p>
            <Button asChild>
              <Link href="/history">Back to History</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (d: Date | string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const analysisData = analyses.map((a) => ({
    id: a.id,
    date: formatDate(a.createdAt),
    score: a.skinHealthScore || 0,
    report: a.report as SkinAnalysisReport,
  }));

  const patientName = `${analyses[0].patientFirstName} ${analyses[0].patientLastName}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/history">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to History
              </Link>
            </Button>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-primary" />
                  Progress Comparison
                </h1>
                <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {patientName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {analysisData.length} analyses compared
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Score Trend Chart */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              ...fadeUp,
              visible: { ...fadeUp.visible, transition: { delay: 0.1 } },
            }}
            className="mb-6"
          >
            <ScoreTrendChart analyses={analysisData} />
          </motion.div>

          {/* Condition Tracker */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              ...fadeUp,
              visible: { ...fadeUp.visible, transition: { delay: 0.2 } },
            }}
            className="mb-6"
          >
            <ConditionTracker
              analyses={analysisData.map((a) => ({
                date: a.date,
                report: a.report,
              }))}
            />
          </motion.div>

          {/* Side by Side Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              ...fadeUp,
              visible: { ...fadeUp.visible, transition: { delay: 0.3 } },
            }}
          >
            <SideBySideCards analyses={analysisData} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
