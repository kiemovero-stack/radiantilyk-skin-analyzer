import { useState } from "react";
import { useLocation } from "wouter";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle,
  MapPin,
  Clock,
  Scissors,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  AlertCircle,
  Shield,
  Send,
} from "lucide-react";

const SCAR_TYPES = [
  { value: "acne_icepick", label: "Ice Pick Scars (deep, narrow pits)" },
  { value: "acne_boxcar", label: "Boxcar Scars (wide, rectangular depressions)" },
  { value: "acne_rolling", label: "Rolling Scars (wavy, uneven texture)" },
  { value: "acne_mixed", label: "Mixed Acne Scars (combination of types)" },
  { value: "hypertrophic", label: "Hypertrophic Scars (raised, firm, stays within wound area)" },
  { value: "keloid", label: "Keloid Scars (raised, grows beyond wound area)" },
  { value: "surgical", label: "Surgical / Traumatic Scars" },
  { value: "burn", label: "Burn Scars" },
  { value: "stretch_marks", label: "Stretch Marks (Striae)" },
  { value: "pih", label: "Post-Inflammatory Hyperpigmentation (dark spots from past breakouts)" },
  { value: "other", label: "Other / Not Sure" },
];

const BODY_AREAS = [
  "Face — Cheeks",
  "Face — Forehead",
  "Face — Jawline / Chin",
  "Face — Nose",
  "Face — Around Eyes",
  "Neck",
  "Chest / Décolletage",
  "Back",
  "Shoulders",
  "Arms",
  "Abdomen / Stomach",
  "Legs / Thighs",
  "Other",
];

const DURATION_OPTIONS = [
  "Less than 6 months",
  "6 months – 1 year",
  "1 – 3 years",
  "3 – 5 years",
  "5 – 10 years",
  "10+ years",
  "Since childhood",
];

const PREVIOUS_TREATMENTS = [
  "None — this is my first time seeking treatment",
  "Over-the-counter creams / serums",
  "Chemical peels",
  "Microneedling",
  "Laser treatment (CO2, fractional, etc.)",
  "Subcision",
  "Dermal fillers",
  "Steroid injections",
  "Surgical revision",
  "Other",
];

const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone Call" },
  { value: "text", label: "Text Message" },
];

export default function ScarConsultation() {
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [scarType, setScarType] = useState("");
  const [scarTypeOther, setScarTypeOther] = useState("");
  const [bodyAreas, setBodyAreas] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [previousTreatments, setPreviousTreatments] = useState<string[]>([]);
  const [previousTreatmentOther, setPreviousTreatmentOther] = useState("");
  const [contactMethod, setContactMethod] = useState("email");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [skinTone, setSkinTone] = useState("");

  const toggleBodyArea = (area: string) => {
    setBodyAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const togglePreviousTreatment = (treatment: string) => {
    setPreviousTreatments((prev) =>
      prev.includes(treatment)
        ? prev.filter((t) => t !== treatment)
        : [...prev, treatment]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName || !lastName || !email || !scarType || bodyAreas.length === 0 || !duration) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/client/scar-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          dob,
          scarType: scarType === "other" ? scarTypeOther || "Other" : SCAR_TYPES.find((s) => s.value === scarType)?.label || scarType,
          bodyAreas,
          duration,
          previousTreatments: previousTreatments.includes("Other")
            ? [...previousTreatments.filter((t) => t !== "Other"), previousTreatmentOther || "Other"]
            : previousTreatments,
          contactMethod,
          additionalNotes,
          skinTone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit consultation request");
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span className="font-semibold text-gray-800">RadiantilyK Skin Analysis</span>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Consultation Request Submitted!
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Thank you, {firstName}! We've received your scar consultation request and will be in touch within 24 hours via {contactMethod === "email" ? "email" : contactMethod === "phone" ? "phone call" : "text message"}.
          </p>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-800 mb-4">What Happens Next</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-pink-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">We Review Your Information</p>
                  <p className="text-sm text-gray-500">Our team will review your scar details and medical history.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-pink-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Personalized Plan</p>
                  <p className="text-sm text-gray-500">We'll prepare a preliminary treatment plan tailored to your scar type.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-pink-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Free Consultation</p>
                  <p className="text-sm text-gray-500">We'll schedule your free in-person consultation to assess your scars and finalize your treatment plan.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/scar-treatment")}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              View Scar Treatment Packages
            </button>
            <button
              onClick={() => navigate("/start")}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Get Free AI Skin Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <span className="font-semibold text-gray-800">RadiantilyK Skin Analysis</span>
          </div>
          <a
            href="https://rkaemr.click/portal"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </a>
        </div>
      </header>

      {/* Back Link */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/scar-treatment")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scar Treatments
        </button>
      </div>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Shield className="w-4 h-4" />
          Free Scar Consultation
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Start Your Scar Treatment Journey
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Tell us about your scars and we'll prepare a personalized treatment plan before your consultation. This helps us make the most of your visit.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 pb-16">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Section 1: Personal Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-semibold text-gray-800">Your Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
                placeholder="First name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
                placeholder="Last name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skin Tone (Fitzpatrick Scale)
              </label>
              <select
                value={skinTone}
                onChange={(e) => setSkinTone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all bg-white"
              >
                <option value="">Select (optional)</option>
                <option value="Type I">Type I — Very fair, always burns</option>
                <option value="Type II">Type II — Fair, usually burns</option>
                <option value="Type III">Type III — Medium, sometimes burns</option>
                <option value="Type IV">Type IV — Olive, rarely burns</option>
                <option value="Type V">Type V — Brown, very rarely burns</option>
                <option value="Type VI">Type VI — Dark brown/black, never burns</option>
                <option value="unsure">Not sure</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Scar Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Scissors className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-semibold text-gray-800">About Your Scars</h2>
          </div>

          {/* Scar Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What type of scar do you have? <span className="text-red-500">*</span>
            </label>
            <select
              value={scarType}
              onChange={(e) => setScarType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all bg-white"
              required
            >
              <option value="">Select scar type</option>
              {SCAR_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {scarType === "other" && (
              <input
                type="text"
                value={scarTypeOther}
                onChange={(e) => setScarTypeOther(e.target.value)}
                className="w-full mt-2 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
                placeholder="Please describe your scar type"
              />
            )}
          </div>

          {/* Body Areas */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Where are your scars located? <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-1">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {BODY_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleBodyArea(area)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    bodyAreas.includes(area)
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              How long have you had these scars? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDuration(opt)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all text-center ${
                    duration === opt
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Previous Treatments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Have you tried any previous treatments?
              <span className="text-gray-400 font-normal ml-1">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PREVIOUS_TREATMENTS.map((treatment) => (
                <button
                  key={treatment}
                  type="button"
                  onClick={() => togglePreviousTreatment(treatment)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    previousTreatments.includes(treatment)
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {treatment}
                </button>
              ))}
            </div>
            {previousTreatments.includes("Other") && (
              <input
                type="text"
                value={previousTreatmentOther}
                onChange={(e) => setPreviousTreatmentOther(e.target.value)}
                className="w-full mt-2 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all"
                placeholder="Please describe the treatment"
              />
            )}
          </div>
        </div>

        {/* Section 3: Contact Preferences */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-semibold text-gray-800">Contact Preferences</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you prefer we contact you?
            </label>
            <div className="flex gap-3">
              {CONTACT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setContactMethod(method.value)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all text-center ${
                    contactMethod === method.value
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anything else you'd like us to know?
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all resize-none"
              placeholder="E.g., specific concerns, goals, allergies, medications..."
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Important Disclaimer</p>
              <p>
                Scar treatments can significantly reduce the appearance of scarring, but complete removal is not guaranteed. Results vary by individual, scar type, and skin characteristics. A thorough in-person assessment is required before any treatment plan is finalized.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Request Free Scar Consultation
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Your information is protected with HIPAA-compliant security. We will never share your data.
        </p>
      </form>
    </div>
  );
}
