import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { getLoginUrl } from "@/const";
import {
  Sparkles,
  Camera,
  Brain,
  FileText,
  Shield,
  ArrowRight,
  Zap,
  Eye,
  TrendingUp,
  Microscope,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-premium opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.55_0.18_280_/_20%),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.55_0.15_200_/_15%),transparent_60%)]" />

        <div className="relative container py-24 md:py-36 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-sm mb-8">
              <Zap className="w-3.5 h-3.5" />
              Next-Generation AI Skin Diagnostics
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight"
            >
              Your Skin, Decoded at the{" "}
              <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-teal-300 bg-clip-text text-transparent">
                Cellular Level
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
            >
              Upload a photo and receive a comprehensive AI-powered skin analysis
              with advanced diagnostics, severity grading, predictive aging insights,
              and a personalized treatment roadmap.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-white/90 font-semibold px-8 h-12 text-base"
                  asChild
                >
                  <Link href="/analyze">
                    <Camera className="w-5 h-5 mr-2" />
                    Start Patient Analysis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-white/90 font-semibold px-8 h-12 text-base"
                  asChild
                >
                  <a href={getLoginUrl()}>
                    Staff Login
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              )}
              {isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/25 text-white hover:bg-white/10 font-semibold px-8 h-12 text-base"
                  asChild
                >
                  <Link href="/history">View Patient History</Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight">
              Beyond Surface-Level Analysis
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI system delivers clinical-grade insights that go deeper than
              traditional skin analyzers, providing actionable intelligence for
              your skin health journey.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: Eye,
                title: "Advanced Detection",
                desc: "Identifies conditions often missed by standard analyzers, including acne scarring patterns, collagen degradation markers, and sub-surface pigmentation.",
              },
              {
                icon: Brain,
                title: "Severity Intelligence",
                desc: "Dynamic evidence-based scoring that differentiates between mild, moderate, and severe conditions with clinical precision.",
              },
              {
                icon: Microscope,
                title: "Cellular Insights",
                desc: "Predictive aging analysis, skin trajectory modeling, and cellular-level explanations for each detected condition.",
              },
              {
                icon: TrendingUp,
                title: "Optimization Roadmap",
                desc: "A phased treatment plan with prioritized procedures, limited to high-impact recommendations tailored to your specific needs.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group p-6 rounded-2xl border border-border/60 bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Report Structure Preview */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight">
              Your Comprehensive Report Includes
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Eight meticulously structured sections designed to give you
              complete clarity on your skin health.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto"
          >
            {[
              { num: "01", title: "Skin Health Score", desc: "Dynamic, evidence-based scoring with full justification" },
              { num: "02", title: "Advanced Analysis", desc: "Conditions categorized by severity with cellular insights" },
              { num: "03", title: "Missed Conditions", desc: "Identifies issues often overlooked by standard analysis" },
              { num: "04", title: "Top 2 Facial Treatments", desc: "Curated, high-impact facial recommendations" },
              { num: "05", title: "Top 4 Skin Procedures", desc: "Prioritized procedures with clinical reasoning" },
              { num: "06", title: "Skincare Products", desc: "3-5 targeted products with key ingredients" },
              { num: "07", title: "Predictive Insights", desc: "Aging trajectory, cellular analysis, and skin forecasting" },
              { num: "08", title: "Optimization Roadmap", desc: "Phased improvement plan with milestones" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/60 hover:border-primary/30 transition-colors"
              >
                <span className="text-2xl font-bold text-primary/30 font-mono">
                  {item.num}
                </span>
                <div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-2xl mx-auto"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to Understand Your Skin?
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground text-lg">
              Get your personalized analysis in under 30 seconds. No appointment
              needed.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Button size="lg" className="font-semibold px-8 h-12 text-base" asChild>
                <Link href="/analyze">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Free Analysis
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Footer */}
      <footer className="border-t border-border/60 bg-muted/30">
        <div className="container py-8">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Medical Disclaimer:</strong> This AI skin analysis is for
              informational purposes only and is not a substitute for professional
              medical advice, diagnosis, or treatment. Always consult a qualified
              dermatologist or healthcare provider before starting any treatment.
              Results are based on AI image analysis and may not capture all
              conditions.
            </p>
          </div>
          <div className="text-center mt-6 text-xs text-muted-foreground/60">
            SkinAI — Advanced AI Skin Diagnostics
          </div>
        </div>
      </footer>
    </div>
  );
}
