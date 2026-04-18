/**
 * ClientBook — Appointment booking page.
 * Integrates with Aesthetic Record for online scheduling.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays, Clock, MapPin, Phone, Star,
  ChevronRight, Sparkles, Heart, Syringe, Sun,
  ArrowRight, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/IMG_2517_3c23507d.PNG";
const AESTHETIC_RECORD_URL = "https://rkaemr.click/portal";
const CHERRY_URL = "https://pay.withcherry.com/radiantilyk-aesthetic-llc";

const C = {
  gold: "#B8964A",
  goldLight: "#C4A882",
  ivory: "#FAF7F2",
  charcoal: "#2C2C2C",
  charcoalLight: "#4A4A4A",
};

/* ── Service categories ── */
const SERVICE_CATEGORIES = [
  {
    name: "Injectables",
    icon: Syringe,
    services: [
      { name: "Botox / Dysport", duration: "30 min", price: "Starting at $12/unit" },
      { name: "Dermal Fillers", duration: "45 min", price: "Starting at $650" },
      { name: "Lip Enhancement", duration: "30 min", price: "Starting at $550" },
      { name: "Kybella", duration: "30 min", price: "Starting at $600" },
    ],
  },
  {
    name: "Skin Treatments",
    icon: Sparkles,
    services: [
      { name: "HydraFacial", duration: "60 min", price: "Starting at $199" },
      { name: "Chemical Peel", duration: "45 min", price: "Starting at $150" },
      { name: "Microneedling", duration: "60 min", price: "Starting at $300" },
      { name: "PRP Facial", duration: "75 min", price: "Starting at $500" },
    ],
  },
  {
    name: "Laser & Light",
    icon: Sun,
    services: [
      { name: "IPL Photofacial", duration: "45 min", price: "Starting at $350" },
      { name: "Laser Hair Removal", duration: "30-60 min", price: "Starting at $150" },
      { name: "Laser Skin Resurfacing", duration: "60 min", price: "Starting at $500" },
      { name: "LED Light Therapy", duration: "30 min", price: "Starting at $75" },
    ],
  },
  {
    name: "Body Contouring",
    icon: Heart,
    services: [
      { name: "CoolSculpting", duration: "60 min", price: "Starting at $750" },
      { name: "Body Sculpting", duration: "45 min", price: "Starting at $400" },
      { name: "Skin Tightening", duration: "60 min", price: "Starting at $500" },
    ],
  },
];

export default function ClientBook() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen pb-24" style={{ background: C.ivory }}>
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.charcoalLight} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, ${C.gold}30 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="relative px-5 pt-12 pb-8 text-center">
          <img src={LOGO_URL} alt="RadiantilyK" className="w-12 h-12 rounded-full mx-auto mb-4" />
          <h1
            className="text-2xl tracking-wider mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "white", fontWeight: 400 }}
          >
            Book Your Appointment
          </h1>
          <p className="text-white/60 text-sm max-w-xs mx-auto">
            Schedule your next treatment with our expert providers
          </p>
        </div>
      </div>

      <div className="px-5 py-6 max-w-lg mx-auto space-y-6">
        {/* Quick Book CTA */}
        <motion.a
          href={AESTHETIC_RECORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="block p-5 rounded-xl border text-center"
          style={{
            background: `linear-gradient(135deg, ${C.gold}10, ${C.gold}05)`,
            borderColor: C.gold + "30",
          }}
        >
          <CalendarDays className="w-8 h-8 mx-auto mb-3" style={{ color: C.gold }} />
          <h2
            className="text-lg mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
          >
            Book Online Now
          </h2>
          <p className="text-xs mb-4" style={{ color: C.charcoalLight + "80" }}>
            View available times and book instantly
          </p>
          <Button
            className="px-8 py-3 rounded-lg text-sm font-medium tracking-wider uppercase inline-flex items-center gap-2"
            style={{ background: C.gold, color: "white" }}
          >
            <CalendarDays className="w-4 h-4" />
            Schedule Appointment
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </motion.a>

        {/* Service Categories */}
        <div>
          <h3
            className="text-lg mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
          >
            Our Services
          </h3>
          <div className="space-y-3">
            {SERVICE_CATEGORIES.map((category, i) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl bg-white border overflow-hidden"
                style={{ borderColor: C.gold + "15" }}
              >
                <button
                  onClick={() =>
                    setExpandedCategory(
                      expandedCategory === category.name ? null : category.name
                    )
                  }
                  className="w-full flex items-center gap-4 p-4"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: C.gold + "15" }}
                  >
                    <category.icon className="w-5 h-5" style={{ color: C.gold }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                      {category.name}
                    </p>
                    <p className="text-xs" style={{ color: C.charcoalLight + "70" }}>
                      {category.services.length} services
                    </p>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 transition-transform duration-200"
                    style={{
                      color: C.gold,
                      transform: expandedCategory === category.name ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {expandedCategory === category.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t px-4 pb-4"
                    style={{ borderColor: C.gold + "10" }}
                  >
                    <div className="space-y-3 pt-3">
                      {category.services.map((service) => (
                        <div
                          key={service.name}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="text-sm" style={{ color: C.charcoal }}>
                              {service.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Clock className="w-3 h-3" style={{ color: C.charcoalLight + "60" }} />
                              <span className="text-xs" style={{ color: C.charcoalLight + "60" }}>
                                {service.duration}
                              </span>
                            </div>
                          </div>
                          <span
                            className="text-xs font-medium"
                            style={{ color: C.gold }}
                          >
                            {service.price}
                          </span>
                        </div>
                      ))}
                      <a
                        href={AESTHETIC_RECORD_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 mt-3 py-2.5 rounded-lg border text-xs font-medium tracking-wider uppercase transition-colors hover:bg-[#B8964A10]"
                        style={{ borderColor: C.gold + "40", color: C.gold }}
                      >
                        Book {category.name}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Financing Options */}
        <div
          className="rounded-xl p-5 border"
          style={{ background: "white", borderColor: C.gold + "15" }}
        >
          <h3
            className="text-lg mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
          >
            Flexible Financing
          </h3>
          <p className="text-xs mb-4" style={{ color: C.charcoalLight + "80" }}>
            Make your treatments more affordable with our financing partners
          </p>
          <div className="space-y-3">
            <a
              href={CHERRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-[#B8964A08]"
              style={{ borderColor: C.gold + "20" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#dc262620" }}
              >
                <span className="text-lg">🍒</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                  Cherry Financing
                </p>
                <p className="text-xs" style={{ color: C.charcoalLight + "70" }}>
                  0% APR options available · Apply in minutes
                </p>
              </div>
              <ExternalLink className="w-4 h-4" style={{ color: C.gold }} />
            </a>

            <a
              href="https://www.affirm.com/shopping/RadiantilyK"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-[#B8964A08]"
              style={{ borderColor: C.gold + "20" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#6366f120" }}
              >
                <span className="text-sm font-bold" style={{ color: "#6366f1" }}>A</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                  Affirm
                </p>
                <p className="text-xs" style={{ color: C.charcoalLight + "70" }}>
                  Pay over time · As low as 0% APR
                </p>
              </div>
              <ExternalLink className="w-4 h-4" style={{ color: C.gold }} />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div
          className="rounded-xl p-5 border"
          style={{ background: "white", borderColor: C.gold + "15" }}
        >
          <h3
            className="text-lg mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
          >
            Contact Us
          </h3>
          <div className="space-y-3">
            <a href="tel:+15109901444" className="flex items-center gap-3">
              <Phone className="w-4 h-4" style={{ color: C.gold }} />
              <span className="text-sm" style={{ color: C.charcoal }}>(510) 990-1444</span>
            </a>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: C.gold }} />
              <div>
                <p className="text-sm" style={{ color: C.charcoal }}>
                  39180 Farwell Dr, Ste 110
                </p>
                <p className="text-sm" style={{ color: C.charcoal }}>
                  Fremont, CA 94538
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: C.gold }} />
              <div>
                <p className="text-sm" style={{ color: C.charcoal }}>Mon – Fri: 9 AM – 6 PM</p>
                <p className="text-sm" style={{ color: C.charcoal }}>Sat: 10 AM – 4 PM</p>
                <p className="text-sm" style={{ color: C.charcoalLight + "70" }}>Sun: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking note */}
        <p className="text-center text-xs px-4" style={{ color: C.charcoalLight + "60" }}>
          Appointment bookings are requests and subject to confirmation by your provider.
          A credit card on file is required to secure your booking.
        </p>
      </div>
    </div>
  );
}
