/**
 * Client-Facing Landing Page.
 *
 * Beautiful, branded entry point for clients at /client.
 * Includes hero section, how-it-works steps, testimonials,
 * and CTA to start the analysis.
 */
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Camera,
  Brain,
  ClipboardCheck,
  CalendarCheck,
  Star,
  Shield,
  ChevronRight,
  Heart,
  ArrowRight,
  CheckCircle2,
  Zap,
  Users,
  Clock,
} from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

const CHECKIN_URL = "https://rkaemr.click/portal";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: Camera,
    title: "Take Your Photos",
    description:
      "Follow our simple guided photo capture — front, left, and right views. Our AI needs just a few angles to give you a complete picture.",
    color: "from-pink-400 to-rose-500",
  },
  {
    step: 2,
    icon: Brain,
    title: "AI Analyzes Your Skin",
    description:
      "Our advanced AI examines your skin at a cellular level — detecting conditions, measuring skin health, and identifying your unique needs.",
    color: "from-purple-400 to-indigo-500",
  },
  {
    step: 3,
    icon: ClipboardCheck,
    title: "Get Your Personalized Plan",
    description:
      "Receive a detailed report with treatment simulations, product recommendations, and a step-by-step improvement roadmap — all in plain English.",
    color: "from-blue-400 to-cyan-500",
  },
  {
    step: 4,
    icon: CalendarCheck,
    title: "Book & Transform",
    description:
      "Ready to start? Book your consultation and our expert team will bring your personalized plan to life. We follow up to make sure you're seeing results.",
    color: "from-emerald-400 to-teal-500",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "AI-Powered Analysis",
    description: "Advanced skin diagnostics that detect conditions others miss",
  },
  {
    icon: Heart,
    title: "Personalized For You",
    description: "Every recommendation is tailored to your unique skin type",
  },
  {
    icon: Shield,
    title: "Fitzpatrick-Aware",
    description: "Treatments are matched to your skin tone for safety and results",
  },
  {
    icon: Clock,
    title: "Results in Minutes",
    description: "Get your comprehensive report in under 60 seconds",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "I was amazed at how detailed the analysis was. It found things I didn't even know were happening with my skin. The treatment plan was so clear and easy to follow!",
    result: "Skin score improved from 52 to 78",
  },
  {
    name: "Jessica L.",
    rating: 5,
    text: "The simulation showed me exactly what to expect from fillers. Seeing the before and after description of MY face — not someone else's — made me feel so confident about booking.",
    result: "Booked her first treatment the same day",
  },
  {
    name: "Maria R.",
    rating: 5,
    text: "I love that everything was explained in simple terms. No confusing medical jargon. I finally understand what my skin needs and why. The follow-up emails were a nice touch too!",
    result: "Started her skincare routine within a week",
  },
];

export default function ClientLanding() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="font-bold text-sm">RadiantilyK Skin Analysis</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={CHECKIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-purple-600 transition-colors hidden sm:block"
            >
              Already a client? Check in
            </a>
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xs font-semibold hover:opacity-90 border-0"
              onClick={() => navigate("/client/start")}
            >
              Start Analysis
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50/30 to-white" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

        <div className="relative container py-20 md:py-32 px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-pink-200 text-purple-700 text-xs font-medium mb-6 shadow-sm">
              <Sparkles className="w-3 h-3" />
              AI-Powered Skin Analysis — Free & Instant
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              See What Your Skin{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Really Needs
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Upload a few photos and our AI will analyze your skin, show you what treatments would look like on{" "}
              <em>your</em> face, and create a personalized plan — all explained in simple terms you'll actually understand.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold text-base px-8 py-6 hover:opacity-90 border-0 shadow-lg shadow-purple-200/50"
                onClick={() => navigate("/client/start")}
              >
                <Camera className="w-5 h-5 mr-2" />
                Analyze My Skin — It's Free
              </Button>
              <p className="text-xs text-gray-400">
                Takes less than 2 minutes. No account needed.
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-1.5 text-xs">
                <Shield className="w-3.5 h-3.5" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5" />
                1,000+ Clients Analyzed
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                5.0 Average Rating
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 text-center hover:border-purple-200 hover:bg-purple-50/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50/30">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Four simple steps to understanding your skin and getting a personalized treatment plan.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="relative flex gap-6 mb-8 last:mb-0"
              >
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute left-[23px] top-14 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-gray-100" />
                )}

                {/* Step number */}
                <div
                  className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-lg font-bold text-white">{step.step}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="w-4 h-4 text-gray-400" />
                      <h3 className="font-bold text-lg">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              What You'll Get
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              A comprehensive, personalized skin report that's actually useful.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-3"
          >
            {[
              "Skin health score with detailed breakdown",
              "Every condition detected and explained in plain English",
              "Treatment simulations showing what results to expect on YOUR face",
              "Fitzpatrick-aware recommendations safe for your skin tone",
              "Personalized skincare product picks from our curated line",
              "Step-by-step improvement roadmap with realistic timelines",
              "Follow-up check-ins at 24 and 48 hours to track your progress",
              "Direct booking link to start your transformation",
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-purple-50/30 hover:border-purple-200 transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-pink-50/30 to-white">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              What Our Clients Say
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Real results from real people who started their skin journey with us.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-6 rounded-2xl border border-pink-100 bg-white shadow-sm"
              >
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{testimonial.name}</span>
                  <span className="text-[10px] text-purple-600 font-medium px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200">
                    {testimonial.result}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-2xl mx-auto text-center p-10 rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200"
          >
            <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Ready to See What Your Skin Needs?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              It takes less than 2 minutes and it's completely free. No account required — just your photos and a few quick questions.
            </p>
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold text-base px-8 py-6 hover:opacity-90 border-0 shadow-lg shadow-purple-200/50"
              onClick={() => navigate("/client/start")}
            >
              <Camera className="w-5 h-5 mr-2" />
              Start My Free Skin Analysis
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-gray-600">
                RadiantilyK Aesthetic
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <a
                href={CHECKIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-500 transition-colors"
              >
                Book Appointment
              </a>
              <a
                href="https://rkaskin.co"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-500 transition-colors"
              >
                Shop Products
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Shield className="w-3 h-3" />
              HIPAA Compliant
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
