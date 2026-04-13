/**
 * Client-Facing Landing Page — Luxury High-End Aesthetic
 *
 * Inspired by La Mer, Augustinus Bader, and Beverly Hills medical spas.
 * Color palette: champagne gold (#B8964A), warm ivory (#FAF7F2),
 * soft rose taupe (#C4A882), charcoal (#2C2C2C).
 * Typography: Cormorant Garamond for headings, Inter Light for body.
 */
import { Button } from "@/components/ui/button";
import {
  Camera,
  Brain,
  ClipboardCheck,
  CalendarCheck,
  Star,
  Shield,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  Gift,
  Hourglass,
  Sparkles,
} from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { fbPixel } from "@/lib/fbPixel";
import { paths } from "@/lib/clientPaths";
import { useEffect, useState } from "react";

const CHECKIN_URL = "https://rkaemr.click/portal";
const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/IMG_2517_3c23507d.PNG";
const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/luxury-hero-spa-TM9GyzeMoTvyGbsxQ49qRv.webp";

/* ── Luxury color tokens ── */
const C = {
  gold: "#B8964A",
  goldLight: "#C4A882",
  ivory: "#FAF7F2",
  charcoal: "#2C2C2C",
  charcoalLight: "#4A4A4A",
  divider: "rgba(184, 150, 74, 0.20)",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ── Data ── */
const HOW_IT_WORKS = [
  {
    step: 1,
    icon: Camera,
    title: "Snap a Few Photos",
    description:
      "Follow our simple guided photo capture — front, left, and right views. Takes less than 30 seconds.",
  },
  {
    step: 2,
    icon: Brain,
    title: "AI Analyzes Your Skin",
    description:
      "Our advanced AI examines your skin at a cellular level — detecting conditions, measuring skin health, and identifying your unique needs.",
  },
  {
    step: 3,
    icon: ClipboardCheck,
    title: "Get Your Personalized Plan",
    description:
      "Receive a detailed report with treatment simulations showing results on YOUR face, product picks, and a step-by-step improvement roadmap.",
  },
  {
    step: 4,
    icon: CalendarCheck,
    title: "Book & Transform",
    description:
      "Ready to start? Book your consultation at either of our locations and our expert team will bring your plan to life.",
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description: "Advanced skin diagnostics that detect conditions others miss",
  },
  {
    icon: Star,
    title: "Personalized For You",
    description: "Every recommendation is tailored to your unique skin type and tone",
  },
  {
    icon: Shield,
    title: "Fitzpatrick-Aware",
    description: "Treatments are matched to your skin tone for safety and best results",
  },
  {
    icon: Clock,
    title: "Results in Minutes",
    description: "Get your comprehensive report in under 60 seconds — no waiting",
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
    text: "The simulation showed me exactly what to expect from fillers. Seeing the before and after of MY face — not someone else's — made me feel so confident about booking.",
    result: "Booked her first treatment the same day",
  },
  {
    name: "Maria R.",
    rating: 5,
    text: "I love that everything was explained in simple terms. No confusing medical jargon. I finally understand what my skin needs and why. The follow-up emails were a nice touch too!",
    result: "Started her skincare routine within a week",
  },
];

const SERVICE_CATEGORIES = [
  {
    title: "AI Skin Analysis",
    description: "Advanced AI diagnostics that detect conditions others miss — personalized to your skin",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/ai-skin-analysis_6d5eb451.jpg",
    label: "Complimentary",
    price: "Complimentary",
  },
  {
    title: "Injectables & Fillers",
    description: "Botox, Daxxify, Restylane, Juvederm, Sculptra & Radiesse — expert injectors",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/injectables_9aa6dfa0.jpg",
    label: "Most Requested",
    price: "Starting at $9/unit",
  },
  {
    title: "Signature Facials",
    description: "From Dermaplaning to 24K Gold Recovery — 7 luxury facials tailored to your skin",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/facials_5471aaad.jpg",
    label: "",
    price: "Starting at $100",
  },
  {
    title: "Scar Treatment",
    description: "Acne scars, keloids, surgical scars, stretch marks & more — multi-step protocols",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/laser-treatments_1bdf48b6.jpg",
    label: "",
    price: "Starting at $650",
    link: "/scar-treatment",
  },
  {
    title: "Laser Treatments",
    description: "CO2 Resurfacing, IPL, PICO/ND:YAG, RF Microneedling — advanced skin renewal",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/laser-treatments_1bdf48b6.jpg",
    label: "",
    price: "Starting at $300",
  },
  {
    title: "HIFU & Ultherapy",
    description: "Precision ultrasound lifting — HIFU for maintenance, Ultherapy for deep lifting",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/laser-treatments_1bdf48b6.jpg",
    label: "",
    price: "Starting at $300",
  },
  {
    title: "Body Contouring",
    description: "RKsculpt muscle toning, lipolytic injections & RF skin tightening",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/body-contouring_075505de.jpg",
    label: "",
    price: "Starting at $150",
  },
  {
    title: "Medical Weight Loss",
    description: "Semaglutide (GLP-1) & Tirzepatide programs — medically supervised, real results",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/weight-loss_9129de16.jpg",
    label: "",
    price: "Starting at $35",
  },
  {
    title: "Peptide Therapy",
    description: "BPC-157, GHK-Cu, Thymosin Alpha-1 & CJC/Ipamorelin — repair, rejuvenate, protect",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/peptide-therapy_3e308073.jpg",
    label: "",
    price: "Starting at $150/mo",
  },
  {
    title: "Hormone Therapy",
    description: "Bioidentical HRT, testosterone optimization & thyroid management — restore balance",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/hormone-therapy_2f7b43ac.jpg",
    label: "",
    price: "Starting at $200/mo",
  },
  {
    title: "Hair Restoration",
    description: "Exosome therapy — regrow thicker, healthier hair with cutting-edge stem cell science",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/hair-restoration_49e5a4dc.webp",
    label: "",
    price: "Starting at $1,200",
  },
];

const LOCATIONS = [
  {
    name: "San Jose",
    address: "2100 Curtner Ave, Ste 1B",
    city: "San Jose, CA 95124",
    hours: "Tue, Thu, Sat, Sun",
    mapUrl: "https://maps.google.com/?q=2100+Curtner+Ave+Ste+1B+San+Jose+CA+95124",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3173.5!2d-121.8886!3d37.2843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808e34d5c6b2f7e5%3A0x0!2s2100+Curtner+Ave+Ste+1B%2C+San+Jose%2C+CA+95124!5e0!3m2!1sen!2sus!4v1",
  },
  {
    name: "San Mateo",
    address: "1528 S El Camino Real #200",
    city: "San Mateo, CA 94402",
    hours: "Thu, Fri, Sat",
    mapUrl: "https://maps.google.com/?q=1528+S+El+Camino+Real+200+San+Mateo+CA+94402",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.5!2d-122.3248!3d37.5512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f9e3c6b2f7e5%3A0x0!2s1528+S+El+Camino+Real+%23200%2C+San+Mateo%2C+CA+94402!5e0!3m2!1sen!2sus!4v1",
  },
];

/* ── Shared luxury components ── */
function GoldDivider() {
  return (
    <div className="flex justify-center">
      <div className="w-full" style={{ maxWidth: 1100, borderTop: `1px solid ${C.divider}` }} />
    </div>
  );
}

function LuxuryButton({
  children,
  onClick,
  variant = "solid",
  size = "default",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "solid" | "outline";
  size?: "default" | "lg";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center font-sans uppercase tracking-[0.15em] transition-all duration-300 rounded-sm";
  const sizeClass = size === "lg" ? "px-10 py-4 text-sm" : "px-7 py-3 text-xs";
  const variantClass =
    variant === "outline"
      ? `border border-[${C.gold}] text-[${C.gold}] hover:bg-[${C.gold}] hover:text-white`
      : "text-white";

  return (
    <button
      onClick={onClick}
      className={`${base} ${sizeClass} ${className}`}
      style={
        variant === "solid"
          ? { backgroundColor: C.gold, color: "#fff" }
          : { borderColor: C.gold, color: C.gold }
      }
      onMouseEnter={(e) => {
        if (variant === "outline") {
          e.currentTarget.style.backgroundColor = C.gold;
          e.currentTarget.style.color = "#fff";
        } else {
          e.currentTarget.style.backgroundColor = "#A6843F";
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "outline") {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = C.gold;
        } else {
          e.currentTarget.style.backgroundColor = C.gold;
        }
      }}
    >
      {children}
    </button>
  );
}

/* ── Seasonal Promo (elegant single line) ── */
interface SeasonalPromotion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  badgeText?: string;
  gradient: string;
  accentColor: string;
  icon?: string;
}

function SeasonalPromoBanner() {
  const [promo, setPromo] = useState<SeasonalPromotion | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/promotions/active")
      .then((r) => r.json())
      .then((data) => {
        if (data.promotion) setPromo(data.promotion);
      })
      .catch(() => {});
  }, []);

  if (!promo || dismissed) return null;

  return (
    <div
      className="relative py-2.5 px-4 text-center"
      style={{ backgroundColor: C.ivory, borderBottom: `1px solid ${C.divider}` }}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-1.5 right-3 text-gray-400 hover:text-gray-600 text-sm leading-none"
        aria-label="Dismiss"
      >
        &times;
      </button>
      <p className="text-xs tracking-wide" style={{ color: C.charcoalLight, fontFamily: "var(--font-sans)" }}>
        {promo.icon && <span className="mr-1">{promo.icon}</span>}
        {promo.title} — <span style={{ color: C.gold }}>{promo.subtitle}</span>
        {promo.ctaUrl && (
          <a
            href={promo.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 underline underline-offset-2 hover:opacity-80 transition-opacity"
            style={{ color: C.gold }}
          >
            {promo.ctaText}
          </a>
        )}
      </p>
    </div>
  );
}

/* ── Referral Banner (elegant) ── */
function ReferralBanner() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const refCode = params.get("ref");
  const [referrer, setReferrer] = useState<{ referrerName: string; discountPercent: number } | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!refCode) return;
    fetch(`/api/referral/lookup/${refCode}`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (data?.valid) {
          setReferrer({ referrerName: data.referrerName, discountPercent: data.discountPercent });
          sessionStorage.setItem("referralCode", refCode);
          sessionStorage.setItem("referralDiscount", String(data.discountPercent));
        }
      })
      .catch(() => {});
  }, [refCode]);

  if (!referrer) return null;

  return (
    <div className="py-3 px-4 text-center" style={{ backgroundColor: C.ivory, borderBottom: `1px solid ${C.divider}` }}>
      <p className="text-xs tracking-wide" style={{ color: C.charcoalLight }}>
        <Gift className="w-3.5 h-3.5 inline mr-1.5" style={{ color: C.gold }} />
        {referrer.referrerName.split(" ")[0]} referred you — you both receive{" "}
        <span className="font-medium" style={{ color: C.gold }}>{referrer.discountPercent}% off</span>{" "}
        your next treatment.{" "}
        <button
          onClick={() => { fbPixel.startAnalysis(); navigate(paths.start); }}
          className="underline underline-offset-2 hover:opacity-80 transition-opacity font-medium"
          style={{ color: C.gold }}
        >
          Claim Your Offer
        </button>
      </p>
    </div>
  );
}

/* ── Main Component ── */
export default function ClientLanding() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.ivory, color: C.charcoal }}>
      {/* ─── Header ─── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: `${C.ivory}ee`, borderBottom: `1px solid ${C.divider}` }}
      >
        <div className="flex items-center justify-between py-3 px-4 mx-auto" style={{ maxWidth: 1100 }}>
          <div className="flex items-center gap-2.5">
            <img
              src={LOGO_URL}
              alt="RadiantilyK Aesthetic"
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: `1px solid ${C.divider}` }}
            />
            <div className="hidden sm:block">
              <span
                className="text-sm leading-tight block"
                style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "0.05em", color: C.charcoal }}
              >
                RadiantilyK
              </span>
              <span className="text-[10px] leading-tight block" style={{ color: C.goldLight, letterSpacing: "0.1em" }}>
                AESTHETIC
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:4089002674"
              className="text-xs hidden md:flex items-center gap-1 hover:opacity-70 transition-opacity"
              style={{ color: C.charcoalLight }}
            >
              <Phone className="w-3 h-3" />
              (408) 900-2674
            </a>
            <a
              href={CHECKIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hidden sm:block hover:opacity-70 transition-opacity"
              style={{ color: C.charcoalLight }}
            >
              Already a client? Check in
            </a>
            <LuxuryButton
              onClick={() => { fbPixel.startAnalysis(); navigate(paths.start); }}
              size="default"
            >
              GET YOUR ANALYSIS
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </LuxuryButton>
          </div>
        </div>
      </header>

      {/* Referral & Promo Banners (elegant single-line) */}
      <ReferralBanner />
      <SeasonalPromoBanner />

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden" style={{ minHeight: "70vh" }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark frosted overlay for readability */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(44,44,44,0.55) 0%, rgba(44,44,44,0.35) 50%, rgba(184,150,74,0.15) 100%)" }} />
        </div>

        <div className="relative mx-auto px-4 flex items-center justify-center" style={{ maxWidth: 1100, minHeight: "70vh" }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center max-w-2xl"
          >
            {/* Logo */}
            <div className="mb-8">
              <img
                src={LOGO_URL}
                alt="RadiantilyK Aesthetic"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mx-auto shadow-xl"
                style={{ border: "2px solid rgba(255,255,255,0.3)" }}
              />
            </div>

            <p
              className="text-xs md:text-sm mb-5 uppercase"
              style={{ letterSpacing: "0.2em", color: C.goldLight, fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              Complimentary AI Skin Analysis
            </p>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "0.03em", color: "#fff" }}
            >
              Discover What Your Skin{" "}
              <span style={{ color: C.goldLight }}>Really Needs</span>
            </h1>

            <p
              className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              Upload a few photos and our AI will analyze your skin, show you what treatments would look like on{" "}
              <em>your</em> face, and create a personalized plan — all in simple terms you'll actually understand.
            </p>

            <div className="flex flex-col items-center gap-4">
              <LuxuryButton
                size="lg"
                onClick={() => { fbPixel.startAnalysis(); navigate(paths.start); }}
              >
                <Camera className="w-4 h-4 mr-2.5" />
                GET YOUR SKIN ANALYSIS
              </LuxuryButton>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)", fontWeight: 300 }}>
                Takes less than 2 minutes · No account needed · Complimentary
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              <div className="flex items-center gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5" />
                <span>Trusted by <strong style={{ color: "rgba(255,255,255,0.8)" }}>5,000+</strong> Patients</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span><strong style={{ color: "rgba(255,255,255,0.8)" }}>5.0</strong> Rating on Google</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Shield className="w-3.5 h-3.5" />
                <span>Led by Certified NP & MD</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="py-24" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto px-4" style={{ maxWidth: 1100 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="text-center p-6 rounded-sm transition-all duration-300 hover:shadow-sm"
                style={{ backgroundColor: C.ivory }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "rgba(184,150,74,0.1)" }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: C.gold }} />
                </div>
                <h3
                  className="text-sm mb-2"
                  style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "0.05em", color: C.charcoal }}
                >
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: C.charcoalLight, fontWeight: 300 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* ─── Our Services ─── */}
      <section className="py-24" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto px-4" style={{ maxWidth: 1100 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <p
              className="text-xs uppercase mb-3"
              style={{ letterSpacing: "0.2em", color: C.gold, fontFamily: "var(--font-sans)", fontWeight: 400 }}
            >
              Comprehensive Care
            </p>
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "0.05em", color: C.charcoal }}
            >
              Our Services
            </h2>
            <p className="max-w-lg mx-auto text-sm leading-relaxed" style={{ color: C.charcoalLight, fontWeight: 300 }}>
              From AI skin analysis to weight loss, peptides, and hormones — everything you need under one roof.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {SERVICE_CATEGORIES.map((cat, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="group cursor-pointer overflow-hidden rounded-sm transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: "#fff", border: `1px solid ${C.divider}` }}
                onClick={() => { if (cat.link) { navigate(cat.link); } else { fbPixel.startAnalysis(); navigate(paths.start); } }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className="text-base"
                      style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "0.03em", color: C.charcoal }}
                    >
                      {cat.title}
                    </h3>
                    <span
                      className="text-xs whitespace-nowrap ml-2 mt-0.5"
                      style={{ color: C.gold, fontWeight: 400 }}
                    >
                      {cat.price}
                    </span>
                  </div>
                  {cat.label && (
                    <p
                      className="text-[11px] mb-2 italic"
                      style={{ fontFamily: "var(--font-serif)", color: C.goldLight }}
                    >
                      {cat.label}
                    </p>
                  )}
                  <p className="text-xs leading-relaxed mb-3" style={{ color: C.charcoalLight, fontWeight: 300 }}>
                    {cat.description}
                  </p>
                  <div
                    className="flex items-center gap-1 text-xs group-hover:gap-2 transition-all"
                    style={{ color: C.gold, fontWeight: 400 }}
                  >
                    Learn More <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA after services */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-14"
          >
            <LuxuryButton
              size="lg"
              variant="outline"
              onClick={() => { fbPixel.startAnalysis(); navigate(paths.start); }}
            >
              START MY ANALYSIS
              <ArrowRight className="w-4 h-4 ml-2" />
            </LuxuryButton>
            <p className="mt-4 text-xs" style={{ color: C.charcoalLight, fontWeight: 300 }}>
              Our AI will recommend the best services for your unique skin
            </p>
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* ─── How It Works ─── */}
      <section className="py-24" style={{ backgroundColor: C.ivory }}>
        <div className="mx-auto px-4" style={{ maxWidth: 900 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "0.05em", color: C.charcoal }}
            >
              How It Works
            </h2>
            <p className="max-w-lg mx-auto text-sm leading-relaxed" style={{ color: C.charcoalLight, fontWeight: 300 }}>
              Four simple steps to understanding your skin and getting a personalized treatment plan.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="relative flex gap-5 md:gap-6 mb-8 last:mb-0"
              >
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div
                    className="absolute left-[22px] top-14 bottom-0 w-px"
                    style={{ backgroundColor: C.divider }}
                  />
                )}

                {/* Step number */}
                <div
                  className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: C.gold }}
                >
                  <span className="text-sm font-medium text-white">{step.step}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div
                    className="p-5 rounded-sm"
                    style={{ backgroundColor: "#fff", border: `1px solid ${C.divider}` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="w-4 h-4" style={{ color: C.goldLight }} />
                      <h3
                        className="text-base"
                        style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "0.03em", color: C.charcoal }}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: C.charcoalLight, fontWeight: 300 }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-12"
          >
            <LuxuryButton
              size="lg"
              onClick={() => { fbPixel.startAnalysis(); navigate(paths.start); }}
            >
              START MY ANALYSIS NOW
              <ArrowRight className="w-4 h-4 ml-2" />
            </LuxuryButton>
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* ─── What You'll Get ─── */}
      <section className="py-24" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto px-4" style={{ maxWidth: 900 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "0.05em", color: C.charcoal }}
            >
              What You'll Receive
            </h2>
            <p className="max-w-lg mx-auto text-sm leading-relaxed" style={{ color: C.charcoalLight, fontWeight: 300 }}>
              A comprehensive, personalized skin report that's actually useful.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-3"
          >
            {[
              "Skin health score with detailed breakdown",
              "Every condition detected and explained in plain English",
              "Treatment simulations showing what results look like on YOUR face",
              "Fitzpatrick-aware recommendations safe for your skin tone",
              "Personalized skincare product picks from our curated line",
              "Step-by-step improvement roadmap with realistic timelines",
              "Follow-up check-ins to track your progress",
              "Direct booking link to start your transformation",
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="flex items-center gap-3.5 p-4 rounded-sm transition-all duration-300 hover:shadow-sm"
                style={{ backgroundColor: C.ivory, border: `1px solid transparent` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.divider; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
              >
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0" style={{ color: C.gold }} />
                <span className="text-sm" style={{ color: C.charcoalLight, fontWeight: 300 }}>{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* ─── See Your Future Self ─── */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: C.charcoal }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full blur-[120px]" style={{ backgroundColor: C.gold }} />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full blur-[120px]" style={{ backgroundColor: C.goldLight }} />
        </div>
        <div className="mx-auto px-4 relative z-10" style={{ maxWidth: 900 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center"
          >
            <p
              className="text-xs uppercase mb-6"
              style={{ letterSpacing: "0.2em", color: C.goldLight, fontFamily: "var(--font-sans)", fontWeight: 300 }}
            >
              AI-Powered Aging Simulation
            </p>
            <h2
              className="text-3xl md:text-5xl mb-5"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "0.03em", color: "#fff" }}
            >
              See Your Future Self
            </h2>
            <p className="text-base md:text-lg mb-4" style={{ color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>
              What will you look like in <span style={{ color: C.goldLight, fontWeight: 400 }}>20 years</span>?
            </p>
            <p className="text-sm mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>
              Our AI generates two futures: one without treatment, and one with consistent skincare.
              The difference is striking — and it starts with a single photo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(200,80,80,0.15)" }}>
                  <Hourglass className="w-5 h-5" style={{ color: "#C87070" }} />
                </div>
                <h3 className="text-white font-medium mb-1.5" style={{ fontFamily: "var(--font-serif)", fontWeight: 500 }}>Without Treatment</h3>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>See the natural aging process — sun damage, volume loss, and fine lines compounding over time.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(184,150,74,0.15)" }}>
                  <Sparkles className="w-5 h-5" style={{ color: C.goldLight }} />
                </div>
                <h3 className="text-white font-medium mb-1.5" style={{ fontFamily: "var(--font-serif)", fontWeight: 500 }}>With Treatment</h3>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>See how consistent treatments preserve your youthful appearance — prevention is the best anti-aging.</p>
              </motion.div>
            </div>

            <LuxuryButton
              size="lg"
              onClick={() => {
                fbPixel.trackCustom("FutureSelfCTA");
                navigate(paths.start);
              }}
            >
              <Camera className="w-4 h-4 mr-2.5" />
              SEE MY FUTURE SELF
              <ArrowRight className="w-4 h-4 ml-2" />
            </LuxuryButton>
            <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
              Takes 60 seconds. No signup required.
            </p>
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* ─── Testimonials ─── */}
      <section className="py-24" style={{ backgroundColor: C.ivory }}>
        <div className="mx-auto px-4" style={{ maxWidth: 1100 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "0.05em", color: C.charcoal }}
            >
              What Our Clients Say
            </h2>
            <p className="max-w-lg mx-auto text-sm leading-relaxed" style={{ color: C.charcoalLight, fontWeight: 300 }}>
              Real results from real people who started their skin journey with us.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-6 rounded-sm"
                style={{ backgroundColor: "#fff", border: `1px solid ${C.divider}` }}
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5" style={{ color: C.gold, fill: C.gold }} />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: C.charcoalLight, fontWeight: 300, fontStyle: "italic", fontFamily: "var(--font-serif)" }}
                >
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ fontWeight: 500, color: C.charcoal }}>{testimonial.name}</span>
                  <span
                    className="text-[10px] px-2.5 py-1 rounded-sm"
                    style={{ color: C.gold, backgroundColor: "rgba(184,150,74,0.08)", fontWeight: 400 }}
                  >
                    {testimonial.result}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* ─── Locations ─── */}
      <section className="py-24" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto px-4" style={{ maxWidth: 900 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl mb-4"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "0.05em", color: C.charcoal }}
            >
              Visit Us
            </h2>
            <p className="max-w-lg mx-auto text-sm leading-relaxed" style={{ color: C.charcoalLight, fontWeight: 300 }}>
              Two convenient locations in the Bay Area. By appointment only.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {LOCATIONS.map((location, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-6 rounded-sm"
                style={{ backgroundColor: C.ivory, border: `1px solid ${C.divider}` }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: C.gold }}
                  >
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <h3
                    className="text-lg"
                    style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: C.charcoal }}
                  >
                    {location.name}
                  </h3>
                </div>
                <div className="space-y-2 text-sm" style={{ color: C.charcoalLight }}>
                  <p style={{ fontWeight: 400 }}>{location.address}</p>
                  <p style={{ fontWeight: 300 }}>{location.city}</p>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: C.gold }}>
                    <Clock className="w-3 h-3" />
                    <span>{location.hours}</span>
                  </div>
                </div>
                {/* Google Maps Embed */}
                <div className="mt-4 rounded-sm overflow-hidden" style={{ border: `1px solid ${C.divider}` }}>
                  <iframe
                    src={location.embedUrl}
                    width="100%"
                    height="180"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${location.name} location map`}
                  />
                </div>
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs hover:opacity-70 transition-opacity"
                  style={{ color: C.gold, fontWeight: 400 }}
                >
                  Get Directions
                  <ChevronRight className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-10 text-sm"
            style={{ color: C.charcoalLight }}
          >
            <a href="tel:4089002674" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <Phone className="w-4 h-4" />
              (408) 900-2674
            </a>
            <a href="mailto:radiantilyk@gmail.com" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <Mail className="w-4 h-4" />
              radiantilyk@gmail.com
            </a>
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* ─── Final CTA ─── */}
      <section className="py-24" style={{ backgroundColor: C.ivory }}>
        <div className="mx-auto px-4" style={{ maxWidth: 700 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center p-10 md:p-14 rounded-sm"
            style={{ backgroundColor: "#fff", border: `1px solid ${C.divider}` }}
          >
            <img
              src={LOGO_URL}
              alt="RadiantilyK Aesthetic"
              className="w-16 h-16 rounded-full object-cover mx-auto mb-6 shadow-md"
              style={{ border: `2px solid ${C.divider}` }}
            />
            <h2
              className="text-2xl md:text-3xl mb-4"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "0.05em", color: C.charcoal }}
            >
              Ready to See What Your Skin Needs?
            </h2>
            <p className="mb-8 max-w-md mx-auto text-sm leading-relaxed" style={{ color: C.charcoalLight, fontWeight: 300 }}>
              It takes less than 2 minutes and it's completely complimentary. No account required — just your photos and a few quick questions.
            </p>
            <LuxuryButton
              size="lg"
              onClick={() => { fbPixel.startAnalysis(); navigate(paths.start); }}
            >
              <Camera className="w-4 h-4 mr-2.5" />
              START MY SKIN ANALYSIS
            </LuxuryButton>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ backgroundColor: C.charcoal, borderTop: `1px solid rgba(255,255,255,0.08)` }} className="py-12">
        <div className="mx-auto px-4" style={{ maxWidth: 1100 }}>
          <div className="flex flex-col items-center gap-6">
            {/* Logo and brand */}
            <div className="flex items-center gap-2.5">
              <img
                src={LOGO_URL}
                alt="RadiantilyK Aesthetic"
                className="w-8 h-8 rounded-full object-cover"
                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
              />
              <span
                className="text-sm"
                style={{ fontFamily: "var(--font-serif)", fontWeight: 400, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}
              >
                RadiantilyK Aesthetic
              </span>
            </div>

            {/* Locations summary */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                San Jose: 2100 Curtner Ave, Ste 1B
              </div>
              <div className="hidden sm:block" style={{ color: "rgba(255,255,255,0.15)" }}>|</div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                San Mateo: 1528 S El Camino Real #200
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              <a href="tel:4089002674" className="hover:opacity-70 transition-opacity flex items-center gap-1">
                <Phone className="w-3 h-3" />
                (408) 900-2674
              </a>
              <a href={CHECKIN_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                Book Appointment
              </a>
              <a href="https://rkaskin.co" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                Shop Products
              </a>
              <a href="https://radiantilykaesthetics.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                Main Website
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61573509510380"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/k_radiantilykaesthetic"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>

            {/* Compliance */}
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              <Shield className="w-3 h-3" />
              HIPAA Compliant · Led by Certified NP & Board-Certified MD
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
