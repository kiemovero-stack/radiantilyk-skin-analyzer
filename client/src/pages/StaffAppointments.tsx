/**
 * StaffAppointments — Staff-facing appointment management page.
 * View upcoming/past appointments, manage bookings, quick actions.
 * Integrates with Aesthetic Record for full booking management.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays, Clock, User, MapPin, ExternalLink,
  ArrowLeft, Phone, Mail, Filter, ChevronRight,
  CheckCircle2, XCircle, AlertCircle, Plus,
} from "lucide-react";
import { useLocation } from "wouter";

const AESTHETIC_RECORD_URL = "https://rkaemr.click/portal";

interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  notes: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  confirmed: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2 },
  pending: { bg: "bg-amber-50", text: "text-amber-700", icon: AlertCircle },
  cancelled: { bg: "bg-red-50", text: "text-red-700", icon: XCircle },
  completed: { bg: "bg-blue-50", text: "text-blue-700", icon: CheckCircle2 },
};

export default function StaffAppointments() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "past">("today");

  // Since appointments are managed through Aesthetic Record,
  // this page serves as a quick-access hub with links to the full system
  const quickActions = [
    {
      title: "Open Aesthetic Record",
      description: "Full appointment management, scheduling, and patient records",
      icon: ExternalLink,
      color: "bg-indigo-600",
      action: () => window.open(AESTHETIC_RECORD_URL, "_blank"),
    },
    {
      title: "View Today's Schedule",
      description: "See all appointments for today",
      icon: CalendarDays,
      color: "bg-amber-600",
      action: () => window.open(AESTHETIC_RECORD_URL, "_blank"),
    },
    {
      title: "New Appointment",
      description: "Book a new appointment for a client",
      icon: Plus,
      color: "bg-green-600",
      action: () => window.open(AESTHETIC_RECORD_URL, "_blank"),
    },
  ];

  const serviceCategories = [
    {
      name: "Injectables",
      services: ["Botox / Dysport", "Dermal Fillers", "Sculptra", "Kybella Alternative"],
      color: "#E0D5F5",
      textColor: "#6B21A8",
    },
    {
      name: "Laser & Energy",
      services: ["HIFU", "Liposonix", "Pico Laser", "Nd:YAG", "Diode Hair Removal"],
      color: "#DBEAFE",
      textColor: "#1E40AF",
    },
    {
      name: "Facials & Peels",
      services: ["Oxygen Facial", "Chemical Peel", "Microneedling", "LED Therapy"],
      color: "#FEF3C7",
      textColor: "#92400E",
    },
    {
      name: "Body Contouring",
      services: ["Liposonix Body", "RF Skin Tightening", "Cellulite Treatment"],
      color: "#FCE7F3",
      textColor: "#BE185D",
    },
    {
      name: "Wellness",
      services: ["Peptide Therapy", "Hormone Replacement", "GLP-1 Weight Loss", "IV Therapy"],
      color: "#D1FAE5",
      textColor: "#065F46",
    },
    {
      name: "Skin Analysis",
      services: ["AI Skin Analysis", "Consultation", "Follow-up"],
      color: "#FFF7ED",
      textColor: "#C2410C",
    },
  ];

  const locations = [
    {
      name: "San Mateo",
      address: "1528 S El Camino Real, Unit 200, San Mateo, CA",
      phone: "(650) 555-0100",
    },
    {
      name: "San Jose",
      address: "2100 Curtner Ave, Unit 1B, San Jose, CA 95124",
      phone: "(408) 555-0100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation("/")} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Appointments</h1>
              <p className="text-sm text-gray-500">Managed via Aesthetic Record</p>
            </div>
          </div>
          <button
            onClick={() => window.open(AESTHETIC_RECORD_URL, "_blank")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Open Aesthetic Record
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={action.action}
                className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Service Categories */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: cat.textColor }}
                  />
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.services.map((service) => (
                    <span
                      key={service}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: cat.color, color: cat.textColor }}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((loc) => (
              <div key={loc.name} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">{loc.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{loc.address}</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{loc.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Note */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-indigo-900">Aesthetic Record Integration</h3>
              <p className="text-sm text-indigo-700 mt-1">
                All appointment scheduling, patient records, and booking management is handled through Aesthetic Record.
                Click "Open Aesthetic Record" to access the full scheduling system. Clients can also book directly
                through the patient portal link on the app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
