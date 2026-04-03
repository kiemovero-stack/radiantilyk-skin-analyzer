/**
 * Client-Facing Landing Page — Marketing-Ready for Facebook Ads.
 *
 * High-conversion landing page with:
 * - RadiantilyK Aesthetic logo & branding
 * - Hero section optimized for Facebook ad traffic
 * - Social proof (5,000+ patients, 5-star reviews)
 * - How It Works steps
 * - Location cards with addresses & hours
 * - Testimonials
 * - Strong CTAs throughout
 * - Mobile-first (Facebook traffic is mostly mobile)
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
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { fbPixel } from "@/lib/fbPixel";

const CHECKIN_URL = "https://rkaemr.click/portal";
const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/IMG_2517_3c23507d.PNG";

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
    title: "Snap a Few Photos",
    description:
      "Follow our simple guided photo capture — front, left, and right views. Takes less than 30 seconds.",
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
      "Receive a detailed report with treatment simulations showing results on YOUR face, product picks, and a step-by-step improvement roadmap.",
    color: "from-blue-400 to-cyan-500",
  },
  {
    step: 4,
    icon: CalendarCheck,
    title: "Book & Transform",
    description:
      "Ready to start? Book your consultation at either of our locations and our expert team will bring your plan to life.",
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

export default function ClientLanding() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="container flex items-center justify-between py-2 px-4">
          <div className="flex items-center gap-2.5">
            <img
              src={LOGO_URL}
              alt="RadiantilyK Aesthetic"
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-pink-100"
            />
            <div className="hidden sm:block">
              <span className="font-bold text-sm text-gray-800 leading-tight block">RadiantilyK</span>
              <span className="text-[10px] text-gray-400 leading-tight block">Aesthetic</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:4089002674"
              className="text-xs text-gray-500 hover:text-purple-600 transition-colors hidden md:flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              (408) 900-2674
            </a>
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
              className="rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xs font-semibold hover:opacity-90 border-0 shadow-md"
              onClick={() => { fbPixel.startAnalysis(); navigate("/client/start"); }}
            >
              Get Free Analysis
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Special Offer Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white py-2.5 px-4">
        <div className="container flex items-center justify-center gap-2 text-center">
          <Zap className="w-4 h-4 shrink-0 animate-pulse" />
          <p className="text-xs md:text-sm font-semibold">
            Limited Offer: Book within 48 hours of your analysis and get{" "}
            <span className="underline decoration-2 underline-offset-2">25% off</span>{" "}
            your first treatment!
          </p>
          <Zap className="w-4 h-4 shrink-0 animate-pulse" />
        </div>
      </div>

      {/* Hero Section — Optimized for Facebook Ad Traffic */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50/40 to-white" />
        <div className="absolute top-10 right-0 w-80 h-80 bg-pink-200/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

        <div className="relative container py-16 md:py-28 px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Logo prominent for brand recognition */}
            <div className="mb-6">
              <img
                src={LOGO_URL}
                alt="RadiantilyK Aesthetic"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mx-auto shadow-lg border-2 border-white ring-2 ring-pink-200/50"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-pink-200 text-purple-700 text-xs font-medium mb-5 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Free AI Skin Analysis — Instant Results
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Discover What Your Skin{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Really Needs
              </span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Upload a few photos and our AI will analyze your skin, show you what treatments would look like on{" "}
              <em>your</em> face, and create a personalized plan — all in simple terms you'll actually understand.
            </p>

            <div className="mt-7 flex flex-col items-center gap-3">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold text-base px-8 py-6 hover:opacity-90 border-0 shadow-lg shadow-purple-200/50 w-full sm:w-auto"
                onClick={() => { fbPixel.startAnalysis(); navigate("/client/start"); }}
              >
                <Camera className="w-5 h-5 mr-2" />
                Get My Free Skin Analysis
              </Button>
              <p className="text-xs text-gray-400">
                Takes less than 2 minutes · No account needed · 100% Free
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-gray-400">
              <div className="flex items-center gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5" />
                <span>Trusted by <strong className="text-gray-600">5,000+</strong> Patients</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span><strong className="text-gray-600">5.0</strong> Rating on Google</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Shield className="w-3.5 h-3.5" />
                <span>Led by Certified NP & MD</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-14 bg-white">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto"
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-4 md:p-5 rounded-2xl border border-gray-100 bg-gray-50/50 text-center hover:border-purple-200 hover:bg-purple-50/30 transition-all"
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
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-pink-50/30">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto text-sm md:text-base">
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
                className="relative flex gap-4 md:gap-6 mb-6 last:mb-0"
              >
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute left-[23px] top-14 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-transparent" />
                )}

                {/* Step number */}
                <div
                  className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-lg font-bold text-white">{step.step}</span>
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="p-4 md:p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="w-4 h-4 text-gray-400" />
                      <h3 className="font-bold text-base md:text-lg">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA after How It Works */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-10"
          >
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold text-sm md:text-base px-8 py-5 hover:opacity-90 border-0 shadow-lg shadow-purple-200/50"
              onClick={() => { fbPixel.startAnalysis(); navigate("/client/start"); }}
            >
              Start My Free Analysis Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
              What You'll Get
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto text-sm md:text-base">
              A comprehensive, personalized skin report that's actually useful.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto space-y-2.5"
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
                className="flex items-center gap-3 p-3.5 md:p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-purple-50/30 hover:border-purple-200 transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-pink-50/30 to-white">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
              What Our Clients Say
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto text-sm md:text-base">
              Real results from real people who started their skin journey with us.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto"
          >
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-5 md:p-6 rounded-2xl border border-pink-100 bg-white shadow-sm"
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

      {/* Locations Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
              Visit Us
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto text-sm md:text-base">
              Two convenient locations in the Bay Area. Walk-ins welcome for consultations.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto"
          >
            {LOCATIONS.map((location, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-5 md:p-6 rounded-2xl border border-pink-100 bg-gradient-to-br from-white to-pink-50/30 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">{location.name}</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-medium text-gray-800">{location.address}</p>
                  <p>{location.city}</p>
                  <div className="flex items-center gap-1.5 text-xs text-purple-600">
                    <Clock className="w-3 h-3" />
                    <span>{location.hours}</span>
                  </div>
                </div>
                {/* Google Maps Embed */}
                <div className="mt-3 rounded-xl overflow-hidden border border-pink-100">
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
                  className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
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
            className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-8 text-sm text-gray-500"
          >
            <a
              href="tel:4089002674"
              className="flex items-center gap-2 hover:text-purple-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              (408) 900-2674
            </a>
            <a
              href="mailto:radiantilyk@gmail.com"
              className="flex items-center gap-2 hover:text-purple-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              radiantilyk@gmail.com
            </a>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-2xl mx-auto text-center p-8 md:p-10 rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200"
          >
            <img
              src={LOGO_URL}
              alt="RadiantilyK Aesthetic"
              className="w-14 h-14 rounded-full object-cover mx-auto mb-4 shadow-md border border-white"
            />
            <h2 className="text-xl md:text-3xl font-bold tracking-tight mb-3">
              Ready to See What Your Skin Needs?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm md:text-base">
              It takes less than 2 minutes and it's completely free. No account required — just your photos and a few quick questions.
            </p>
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold text-sm md:text-base px-8 py-6 hover:opacity-90 border-0 shadow-lg shadow-purple-200/50 w-full sm:w-auto"
              onClick={() => { fbPixel.startAnalysis(); navigate("/client/start"); }}
            >
              <Camera className="w-5 h-5 mr-2" />
              Start My Free Skin Analysis
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 bg-gray-50/50">
        <div className="container px-4">
          <div className="flex flex-col items-center gap-6">
            {/* Logo and brand */}
            <div className="flex items-center gap-2.5">
              <img
                src={LOGO_URL}
                alt="RadiantilyK Aesthetic"
                className="w-8 h-8 rounded-full object-cover border border-pink-100"
              />
              <span className="text-sm font-semibold text-gray-600">
                RadiantilyK Aesthetic
              </span>
            </div>

            {/* Locations summary */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                San Jose: 2100 Curtner Ave, Ste 1B
              </div>
              <div className="hidden sm:block text-gray-200">|</div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                San Mateo: 1528 S El Camino Real #200
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-gray-400">
              <a
                href="tel:4089002674"
                className="hover:text-purple-500 transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                (408) 900-2674
              </a>
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
              <a
                href="https://radiantilykaesthetics.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-500 transition-colors"
              >
                Main Website
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61573509510380"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/k_radiantilykaesthetic"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>

            {/* Compliance */}
            <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
              <Shield className="w-3 h-3" />
              HIPAA Compliant · Led by Certified NP & Board-Certified MD
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
