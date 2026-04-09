/**
 * Scar Treatment Landing Page — Client-Facing
 *
 * Comprehensive page covering all scar types with treatment packages,
 * pricing, FAQ, and referral incentives. Designed for organic search
 * traffic and Facebook ad campaigns.
 *
 * Important: Uses "reduce" language throughout — no guarantees of
 * complete scar removal. All imagery is generic (no brand photos).
 */
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Star,
  Shield,
  Heart,
  Clock,
  MapPin,
  Phone,
  Users,
  Gift,
  ChevronDown,
  Zap,
  Target,
  Layers,
  Scissors,
  Flame,
  Droplets,
  Sun,
} from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { fbPixel } from "@/lib/fbPixel";
import { paths } from "@/lib/clientPaths";
import { useState } from "react";

const CHECKIN_URL = "https://rkaemr.click/portal";
const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/IMG_2517_3c23507d.PNG";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ── Scar Types ─────────────────────────────────────────────────── */
const SCAR_TYPES = [
  {
    id: "acne",
    icon: Target,
    title: "Acne Scars",
    subtitle: "Ice Pick, Boxcar & Rolling",
    description:
      "Acne scars form when breakouts damage the deeper layers of skin. Ice pick scars are narrow and deep, boxcar scars have sharp edges, and rolling scars create a wave-like texture. Our multi-step protocols target each type differently for the best possible improvement.",
    gradient: "from-purple-500 to-indigo-600",
    packages: [
      {
        name: "Acne Scar Starter",
        price: "$1,650",
        sessions: 3,
        savings: "Save $300",
        includes: ["3x Microneedling with PRP", "Sessions spaced 4-6 weeks apart", "Best for mild scarring"],
      },
      {
        name: "Acne Scar Comprehensive",
        price: "$4,800",
        sessions: 8,
        savings: "Save $1,100",
        popular: true,
        includes: [
          "2x Subcision to release tethered scars",
          "3x TCA CROSS for deep scars",
          "3x RF Microneedling for texture",
        ],
      },
      {
        name: "Acne Scar Premium",
        price: "$6,500",
        sessions: 9,
        savings: "Save $1,600",
        includes: [
          "2x Subcision + 3x TCA CROSS",
          "1 syringe HA filler for volume",
          "3x Fractional CO2 laser resurfacing",
        ],
      },
    ],
  },
  {
    id: "hypertrophic",
    icon: Layers,
    title: "Hypertrophic Scars",
    subtitle: "Raised & Thickened Scars",
    description:
      "Hypertrophic scars are raised, firm scars that stay within the boundaries of the original wound. They often develop after surgery, burns, or deep cuts. Our treatments work to flatten and soften these scars, reducing their appearance over time.",
    gradient: "from-rose-500 to-pink-600",
    packages: [
      {
        name: "Hypertrophic Basic",
        price: "$650",
        sessions: 3,
        savings: "Save vs. individual",
        includes: [
          "3x Steroid (TAC) injections",
          "3-month silicone sheeting supply",
          "Sessions every 4 weeks",
        ],
      },
      {
        name: "Hypertrophic Advanced",
        price: "$2,400",
        sessions: 7,
        savings: "Save $500",
        popular: true,
        includes: [
          "4x 5-FU/TAC combo injections",
          "3x Pulsed dye laser (PDL)",
          "3-month silicone supply",
        ],
      },
    ],
  },
  {
    id: "keloid",
    icon: Shield,
    title: "Keloid Scars",
    subtitle: "Overgrown Scar Tissue",
    description:
      "Keloids extend beyond the original wound and can continue growing. They are more common in darker skin tones and can be challenging to treat. Our protocols use a combination of injections and laser therapy to help reduce keloid size, firmness, and discomfort.",
    gradient: "from-amber-500 to-orange-600",
    packages: [
      {
        name: "Keloid Control",
        price: "$1,800",
        sessions: 6,
        savings: "Save $240",
        includes: [
          "6x 5-FU + TAC combo injections",
          "6-month silicone supply",
          "Injections every 4 weeks",
        ],
      },
      {
        name: "Keloid Comprehensive",
        price: "$3,000",
        sessions: 9,
        savings: "Save $590",
        popular: true,
        includes: [
          "6x 5-FU/TAC combo injections",
          "3x Pulsed dye laser (PDL)",
          "6-month silicone supply",
        ],
      },
    ],
  },
  {
    id: "surgical",
    icon: Scissors,
    title: "Surgical & Traumatic Scars",
    subtitle: "Post-Surgery & Injury Scars",
    description:
      "Scars from surgery, accidents, or injuries can be flat, raised, or depressed. Red or pink scars respond well to laser therapy, while depressed scars benefit from subcision and filler. Our packages are designed to improve both the color and texture of these scars.",
    gradient: "from-blue-500 to-cyan-600",
    packages: [
      {
        name: "Surgical Scar Basic",
        price: "$1,350",
        sessions: 3,
        savings: "Save $120",
        includes: [
          "3x Pulsed dye laser (PDL)",
          "3-month silicone supply",
          "Sessions every 4-6 weeks",
        ],
      },
      {
        name: "Surgical Scar Comprehensive",
        price: "$3,800",
        sessions: 6,
        savings: "Save $700",
        popular: true,
        includes: [
          "2x Subcision for depressed scars",
          "1 syringe HA filler for volume",
          "3x RF Microneedling for texture",
        ],
      },
    ],
  },
  {
    id: "stretch",
    icon: Droplets,
    title: "Stretch Marks",
    subtitle: "Striae on Body Areas",
    description:
      "Stretch marks occur when skin stretches rapidly during growth, pregnancy, or weight changes. While they cannot be completely erased, our treatments can significantly reduce their visibility by stimulating collagen production and improving skin texture in the affected areas.",
    gradient: "from-emerald-500 to-teal-600",
    packages: [
      {
        name: "Stretch Mark Starter",
        price: "$1,800",
        sessions: 3,
        savings: "Save $150",
        includes: [
          "3x Microneedling with PRP (body area)",
          "Sessions spaced 4-6 weeks apart",
          "Best for newer stretch marks",
        ],
      },
      {
        name: "Stretch Mark Comprehensive",
        price: "$4,500",
        sessions: 6,
        savings: "Save $600",
        popular: true,
        includes: [
          "3x RF Microneedling (body area)",
          "3x Fractional erbium laser",
          "For moderate-to-severe marks",
        ],
      },
    ],
  },
  {
    id: "pih",
    icon: Sun,
    title: "Post-Inflammatory Hyperpigmentation",
    subtitle: "Dark Marks & Discoloration",
    description:
      "PIH appears as dark spots or patches left behind after acne, injuries, or inflammation. It is especially common in medium to darker skin tones. Our treatments combine professional peels, light therapy, and targeted home care to help fade these marks and even out skin tone.",
    gradient: "from-violet-500 to-purple-600",
    packages: [
      {
        name: "PIH Basic",
        price: "$1,100",
        sessions: 4,
        savings: "Save $100",
        includes: [
          "4x Medium-depth chemical peels",
          "Home care kit (HQ, tretinoin, vit C, SPF)",
          "For mild-to-moderate PIH",
        ],
      },
      {
        name: "PIH Comprehensive",
        price: "$2,200",
        sessions: 7,
        savings: "Save $350",
        popular: true,
        includes: [
          "4x Chemical peels + 3x IPL",
          "Home care kit included",
          "Fitzpatrick I-IV only",
        ],
      },
    ],
  },
  {
    id: "burn",
    icon: Flame,
    title: "Burn Scars",
    subtitle: "Thermal & Chemical Burns",
    description:
      "Burn scars can be raised, tight, and discolored. They often cause both cosmetic and functional concerns. Our protocols use pulsed dye laser to reduce redness and CO2 laser to improve texture, combined with silicone therapy for ongoing scar management.",
    gradient: "from-red-500 to-orange-600",
    packages: [
      {
        name: "Burn Scar Basic",
        price: "$1,900",
        sessions: 4,
        savings: "Save $240",
        includes: [
          "4x Pulsed dye laser (PDL)",
          "6-month silicone supply",
          "For redness and raised texture",
        ],
      },
      {
        name: "Burn Scar Comprehensive",
        price: "$4,800",
        sessions: 7,
        savings: "Save $840",
        popular: true,
        includes: [
          "4x PDL + 3x Fractional CO2 laser",
          "6-month silicone supply",
          "For moderate burn scars",
        ],
      },
    ],
  },
];

/* ── FAQ ────────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: "Can scars be completely removed?",
    a: "No treatment can completely remove a scar. However, modern treatments can significantly reduce the appearance of scars — improving texture, color, and overall visibility. Most patients see 50-80% improvement depending on the scar type and severity. During your consultation, we'll set realistic expectations based on your specific scars.",
  },
  {
    q: "How many sessions will I need?",
    a: "The number of sessions depends on your scar type, severity, and chosen package. Our starter packages typically include 3-4 sessions, while comprehensive packages include 6-9 sessions. Sessions are usually spaced 4-6 weeks apart to allow proper healing between treatments.",
  },
  {
    q: "Is scar treatment painful?",
    a: "We apply topical numbing cream before most procedures to minimize discomfort. Most patients describe the sensation as mild to moderate — similar to a rubber band snap. Some treatments like subcision may require local anesthesia for comfort.",
  },
  {
    q: "What is the downtime after treatment?",
    a: "Downtime varies by treatment. Chemical peels and microneedling typically have 2-5 days of redness and peeling. Laser treatments may have 5-7 days of recovery. Injection-based treatments usually have minimal downtime. We'll provide detailed aftercare instructions for your specific treatment plan.",
  },
  {
    q: "Are these treatments safe for darker skin tones?",
    a: "Yes, but treatment selection matters. We use Fitzpatrick skin typing to ensure every treatment is appropriate for your skin tone. Some treatments like IPL are limited to lighter skin types (I-IV), while others like RF microneedling and subcision are safe for all skin tones. Your provider will customize your plan accordingly.",
  },
  {
    q: "Can I combine scar treatment with other services?",
    a: "Absolutely. Many patients combine scar treatment with other skin care services. For example, you might add neurotoxins or fillers to address aging concerns alongside scar treatment. We'll create a comprehensive plan that addresses all your skin goals.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes, we understand that scar treatment packages are an investment. We offer flexible payment plans and accept CareCredit and other financing options. Ask about our payment plans during your free consultation.",
  },
  {
    q: "What results can I realistically expect?",
    a: "Results vary by individual, scar type, and treatment plan. Most patients see noticeable improvement after 2-3 sessions, with continued improvement over 3-6 months as collagen remodels. We'll show you examples of typical outcomes during your consultation so you know what to expect. Individual results may vary.",
  },
];

/* ── Component ──────────────────────────────────────────────────── */
export default function ScarTreatment() {
  const [, navigate] = useLocation();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeScarType, setActiveScarType] = useState<string>("acne");

  const activeScar = SCAR_TYPES.find((s) => s.id === activeScarType) || SCAR_TYPES[0];

  const handleCTA = () => {
    fbPixel.bookAppointment();
    navigate("/scar-consultation");
  };

  const handleAnalysis = () => {
    fbPixel.startAnalysis();
    navigate(paths.start);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <img src={LOGO_URL} alt="RadiantilyK" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-bold text-lg text-gray-900">RadiantilyK</span>
          </a>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(paths.landing)}
              className="text-gray-600 hover:text-gray-900"
            >
              Home
            </Button>
            <Button
              size="sm"
              onClick={handleCTA}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Free Consultation
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.1),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-purple-200 mb-6">
              <Sparkles className="w-4 h-4" />
              Advanced Scar Reduction Treatments
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Reduce the Appearance of
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Your Scars
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-4">
              Personalized treatment packages for acne scars, keloids, surgical scars, stretch marks, and more.
              Our multi-step protocols combine the latest techniques to help you feel confident in your skin again.
            </p>
            <p className="text-sm text-gray-400 max-w-xl mx-auto mb-8">
              Results vary by individual. Treatments can significantly reduce scar appearance but cannot guarantee complete removal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleCTA}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25"
              >
                Book a Free Scar Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAnalysis}
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
              >
                Get Free AI Skin Analysis
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Trust Bar ───────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Users, label: "5,000+ Patients Treated", color: "text-purple-600" },
              { icon: Star, label: "5-Star Rated Practice", color: "text-amber-500" },
              { icon: Shield, label: "NP-Led Expert Care", color: "text-blue-600" },
              { icon: Heart, label: "All Skin Tones Welcome", color: "text-rose-500" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scar Type Selector ──────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white" id="scar-types">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Treatment Packages by Scar Type
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select your scar type below to see recommended treatment packages with transparent pricing.
              Every package is designed to deliver the best possible improvement for your specific scar.
            </p>
          </motion.div>

          {/* Scar type tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {SCAR_TYPES.map((scar) => (
              <button
                key={scar.id}
                onClick={() => setActiveScarType(scar.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeScarType === scar.id
                    ? `bg-gradient-to-r ${scar.gradient} text-white shadow-lg`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <scar.icon className="w-4 h-4" />
                {scar.title}
              </button>
            ))}
          </div>

          {/* Active scar type detail */}
          <motion.div
            key={activeScar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Description card */}
            <div className={`bg-gradient-to-r ${activeScar.gradient} rounded-2xl p-6 sm:p-8 text-white mb-8`}>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <activeScar.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{activeScar.title}</h3>
                  <p className="text-white/80 text-sm mb-3">{activeScar.subtitle}</p>
                  <p className="text-white/90 leading-relaxed">{activeScar.description}</p>
                </div>
              </div>
            </div>

            {/* Package cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeScar.packages.map((pkg, i) => (
                <div
                  key={i}
                  className={`relative bg-white rounded-2xl border-2 ${
                    pkg.popular ? "border-purple-500 shadow-lg shadow-purple-100" : "border-gray-200"
                  } p-6 flex flex-col`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                      MOST POPULAR
                    </span>
                  )}
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h4>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-extrabold text-gray-900">{pkg.price}</span>
                    <span className="text-sm text-gray-500">/ package</span>
                  </div>
                  <span className="inline-block text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mb-4">
                    {pkg.savings}
                  </span>
                  <p className="text-sm text-gray-500 mb-4">{pkg.sessions} sessions included</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {pkg.includes.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={handleCTA}
                    className={`w-full ${
                      pkg.popular
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    Book Consultation
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Scar Treatment Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From your first consultation to seeing real improvement — here's what to expect.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              {
                step: 1,
                icon: Sparkles,
                title: "Free Consultation",
                description:
                  "Meet with our provider to assess your scars, discuss your goals, and create a personalized treatment plan with transparent pricing.",
                color: "from-purple-500 to-indigo-600",
              },
              {
                step: 2,
                icon: Target,
                title: "Customized Plan",
                description:
                  "We'll recommend the right package for your scar type and severity. No cookie-cutter approaches — every plan is tailored to you.",
                color: "from-pink-500 to-rose-600",
              },
              {
                step: 3,
                icon: Zap,
                title: "Treatment Sessions",
                description:
                  "Begin your treatment series. Most sessions take 30-60 minutes with minimal downtime. We'll track your progress at every visit.",
                color: "from-blue-500 to-cyan-600",
              },
              {
                step: 4,
                icon: Heart,
                title: "See Improvement",
                description:
                  "Watch your scars fade over the course of treatment. Most patients see noticeable improvement after 2-3 sessions.",
                color: "from-emerald-500 to-teal-600",
              },
            ].map((item) => (
              <motion.div key={item.step} variants={staggerItem} className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  Step {item.step}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Referral Program ────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 sm:p-8 text-center text-white">
              <Gift className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Refer a Friend, Save Together</h2>
              <p className="text-purple-100 max-w-lg mx-auto">
                Know someone who could benefit from scar treatment? Refer them and you both save.
              </p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-purple-50 rounded-xl p-5 text-center">
                  <p className="text-3xl font-extrabold text-purple-700 mb-1">$250</p>
                  <p className="text-sm font-medium text-purple-600">Off Your Next Treatment</p>
                  <p className="text-xs text-gray-500 mt-1">When your friend books a scar package</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-5 text-center">
                  <p className="text-3xl font-extrabold text-indigo-700 mb-1">$250</p>
                  <p className="text-sm font-medium text-indigo-600">Off Their First Package</p>
                  <p className="text-xs text-gray-500 mt-1">Your friend saves on their first scar treatment</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Simply mention your name when your friend books their consultation, or share your referral link.
                  There's no limit to how many friends you can refer.
                </p>
                <Button
                  onClick={handleCTA}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8"
                >
                  Get Your Referral Link
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Everything you need to know about scar treatment at RadiantilyK.
            </p>
          </motion.div>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      expandedFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Your Scar Treatment Journey?
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8">
              Book a free consultation and let our expert team create a personalized plan for you.
              No obligation, no pressure — just honest advice about what's possible for your scars.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button
                size="lg"
                onClick={handleCTA}
                className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl font-bold"
              >
                Book Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAnalysis}
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
              >
                Try Free AI Skin Analysis
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                San Jose & San Mateo, CA
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                (408) 900-2674
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Disclaimer Footer ───────────────────────────────────── */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <img src={LOGO_URL} alt="RadiantilyK" className="h-10 w-10 rounded-full mx-auto mb-3" />
            <p className="font-semibold text-gray-900">RadiantilyK Aesthetic</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              <strong>Medical Disclaimer:</strong> The information on this page is for educational purposes only and does not constitute medical advice.
              Scar treatment results vary by individual and depend on scar type, severity, skin type, and other factors.
              No treatment can guarantee complete scar removal. The treatments described can help reduce the appearance of scars but individual results may vary.
              All treatments are performed by or under the supervision of a licensed healthcare provider.
              A consultation is required before any treatment to determine the most appropriate plan for your needs.
              Pricing is subject to change. Package pricing reflects bundled savings compared to individual session pricing.
            </p>
          </div>
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} RadiantilyK Aesthetic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
