import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import type { SkinAnalysisReport } from "@shared/types";
import {
  Sparkles,
  Clock,
  ChevronRight,
  Loader2,
  FileText,
  LogIn,
  User,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function History() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const { data: analyses, isLoading } = trpc.skin.listAnalyses.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <LogIn className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              This tool is restricted to authorized staff members. Please log in to access analysis history.
            </p>
            <Button asChild>
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Analysis History
              </h1>
              <p className="mt-1 text-muted-foreground">
                Track your skin health journey over time
              </p>
            </div>
            <Button asChild>
              <Link href="/analyze">
                <Sparkles className="w-4 h-4 mr-2" />
                New Analysis
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="mt-4 text-muted-foreground">
                Loading your analyses...
              </p>
            </div>
          ) : !analyses || analyses.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload a photo to get your first AI skin analysis.
              </p>
              <Button asChild>
                <Link href="/analyze">Start Your First Analysis</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis, i) => {
                const report = analysis.report as SkinAnalysisReport;
                const status = (analysis as any).status || "completed";
                const isCompleted = status === "completed";
                const isProcessing = status === "processing";
                const isFailed = status === "failed";

                const cardContent = (
                  <div className={`group p-5 rounded-2xl border bg-card transition-all ${isCompleted ? "border-border/60 hover:border-primary/30 hover:shadow-md cursor-pointer" : isProcessing ? "border-amber-500/30 bg-amber-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                    <div className="flex items-center gap-4">
                      {/* Score circle */}
                      <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center shrink-0 ${isProcessing ? "border-amber-500/20" : isFailed ? "border-red-500/20" : "border-primary/20"}`}>
                        {isProcessing ? (
                          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                        ) : (
                          <span className={`text-lg font-bold ${isFailed ? "text-red-500" : "text-primary"}`}>
                            {isFailed ? "!" : analysis.skinHealthScore || "—"}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm truncate">
                            {analysis.patientFirstName && analysis.patientLastName
                              ? `${analysis.patientFirstName} ${analysis.patientLastName}`
                              : analysis.skinType || "Skin Analysis"}
                          </h3>
                          {isProcessing && (
                            <span className="text-xs text-amber-600 font-medium">Processing...</span>
                          )}
                          {isFailed && (
                            <span className="text-xs text-red-600 font-medium">Failed</span>
                          )}
                          {isCompleted && report?.conditions && (
                            <span className="text-xs text-muted-foreground">
                              {report.conditions.length} conditions
                            </span>
                          )}
                        </div>
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                          {analysis.patientEmail && (
                            <span className="truncate max-w-[180px]">{analysis.patientEmail}</span>
                          )}
                          {isCompleted && analysis.skinType && (
                            <span className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] font-medium">
                              {analysis.skinType}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(analysis.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {isCompleted && (
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      )}
                    </div>
                  </div>
                );

                return (
                  <motion.div
                    key={analysis.id}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      ...fadeUp,
                      visible: {
                        ...fadeUp.visible,
                        transition: { delay: i * 0.1, duration: 0.5 },
                      },
                    }}
                  >
                    {isCompleted ? (
                      <Link href={`/report/${analysis.id}`}>
                        {cardContent}
                      </Link>
                    ) : (
                      cardContent
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
