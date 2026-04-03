import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { uploadImagesPublic } from "@/lib/uploadServicePublic";
import {
  Camera,
  Upload,
  X,
  Loader2,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Calendar,
  CheckCircle2,
  Heart,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────
type AngleKey = "front" | "left" | "right";

interface AnglePhoto {
  file: File | null;
  preview: string | null;
}

// ── Skin Concerns ──────────────────────────────────────────────────────
const SKIN_CONCERNS = [
  { id: "acne", label: "Acne & Breakouts", emoji: "🔴" },
  { id: "wrinkles", label: "Wrinkles & Fine Lines", emoji: "〰️" },
  { id: "dark_spots", label: "Dark Spots & Uneven Tone", emoji: "🟤" },
  { id: "sagging", label: "Sagging & Loss of Volume", emoji: "⬇️" },
  { id: "dryness", label: "Dryness & Dehydration", emoji: "💧" },
  { id: "oiliness", label: "Excess Oil & Shine", emoji: "✨" },
  { id: "redness", label: "Redness & Sensitivity", emoji: "🌡️" },
  { id: "scarring", label: "Acne Scars & Texture", emoji: "🔲" },
  { id: "pores", label: "Large Pores", emoji: "⭕" },
  { id: "dark_circles", label: "Under-Eye Dark Circles", emoji: "👁️" },
  { id: "sun_damage", label: "Sun Damage & Age Spots", emoji: "☀️" },
  { id: "lips", label: "Lip Volume & Shape", emoji: "👄" },
  { id: "jawline", label: "Jawline & Chin Definition", emoji: "💎" },
  { id: "body_skin", label: "Body Skin Concerns", emoji: "🧴" },
  { id: "general", label: "General Anti-Aging", emoji: "⏳" },
  { id: "other", label: "Other / Not Sure", emoji: "❓" },
];

// ── Photo Angle Config ─────────────────────────────────────────────────
type AngleConfig = {
  key: AngleKey;
  label: string;
  required: boolean;
  description: string;
  instruction: string;
};

const FACE_ANGLE_CONFIG: AngleConfig[] = [
  {
    key: "front",
    label: "Front View",
    required: true,
    description: "Face the camera directly",
    instruction:
      "Look straight at the camera. Keep your face relaxed — no smiling. Pull hair away from your face. Make sure lighting is even (no harsh shadows).",
  },
  {
    key: "left",
    label: "Left Side",
    required: false,
    description: "Turn head to show left profile",
    instruction:
      "Turn your head to the right so the camera sees your LEFT side. Keep your chin level — don't tilt up or down. Show your full profile from forehead to chin.",
  },
  {
    key: "right",
    label: "Right Side",
    required: false,
    description: "Turn head to show right profile",
    instruction:
      "Turn your head to the left so the camera sees your RIGHT side. Keep your chin level — don't tilt up or down. Show your full profile from forehead to chin.",
  },
];

const BODY_ANGLE_CONFIG: AngleConfig[] = [
  {
    key: "front",
    label: "Target Area — Close Up",
    required: true,
    description: "Photo of the area you want analyzed",
    instruction:
      "Take a close-up photo of the body area you're concerned about (e.g., neck, chest, arms, legs, stomach). Make sure the area is well-lit and clearly visible. Remove clothing from the area if possible.",
  },
  {
    key: "left",
    label: "Wider View",
    required: false,
    description: "Step back to show the surrounding area",
    instruction:
      "Take a slightly wider photo showing the area in context. This helps our AI understand the full scope. Stand about 2-3 feet from the camera.",
  },
  {
    key: "right",
    label: "Different Angle",
    required: false,
    description: "Show the area from another angle",
    instruction:
      "Take the area from a different angle or side. This gives our AI a more complete picture for accurate analysis.",
  },
];

// ── Face Silhouette SVGs ───────────────────────────────────────────────
function FaceSilhouette({
  angle,
  className,
}: {
  angle: AngleKey;
  className?: string;
}) {
  if (angle === "front") {
    return (
      <svg
        viewBox="0 0 80 100"
        className={cn("w-20 h-24", className)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <ellipse cx="40" cy="45" rx="25" ry="32" />
        <circle cx="30" cy="40" r="2.5" fill="currentColor" />
        <circle cx="50" cy="40" r="2.5" fill="currentColor" />
        <ellipse cx="40" cy="50" rx="3" ry="2" />
        <path d="M33 60 Q40 66 47 60" />
        <path d="M15 35 Q12 20 25 12 Q40 4 55 12 Q68 20 65 35" />
        {/* Guide lines */}
        <line
          x1="40"
          y1="10"
          x2="40"
          y2="80"
          strokeDasharray="3 3"
          opacity="0.3"
        />
        <line
          x1="15"
          y1="45"
          x2="65"
          y2="45"
          strokeDasharray="3 3"
          opacity="0.3"
        />
      </svg>
    );
  }
  if (angle === "left") {
    return (
      <svg
        viewBox="0 0 80 100"
        className={cn("w-20 h-24", className)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M55 15 Q65 10 60 25 Q58 35 60 45 Q62 55 55 65 Q48 75 40 78 Q30 80 28 70 Q25 60 25 50 Q25 35 30 25 Q35 15 45 12 Q50 11 55 15Z" />
        <circle cx="48" cy="40" r="2.5" fill="currentColor" />
        <path d="M58 50 L62 49 L58 52" />
        <path d="M42 62 Q48 66 52 62" />
        <path d="M52 20 Q60 15 62 25" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 80 100"
      className={cn("w-20 h-24 scale-x-[-1]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M55 15 Q65 10 60 25 Q58 35 60 45 Q62 55 55 65 Q48 75 40 78 Q30 80 28 70 Q25 60 25 50 Q25 35 30 25 Q35 15 45 12 Q50 11 55 15Z" />
      <circle cx="48" cy="40" r="2.5" fill="currentColor" />
      <path d="M58 50 L62 49 L58 52" />
      <path d="M42 62 Q48 66 52 62" />
      <path d="M52 20 Q60 15 62 25" />
    </svg>
  );
}

// ── Body Silhouette SVGs ───────────────────────────────────────────────
function BodySilhouette({
  angle,
  className,
}: {
  angle: AngleKey;
  className?: string;
}) {
  if (angle === "front") {
    // Target/close-up icon: a magnifying glass over skin
    return (
      <svg
        viewBox="0 0 80 100"
        className={cn("w-20 h-24", className)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* Body outline */}
        <ellipse cx="40" cy="20" rx="10" ry="12" />
        <path d="M30 30 L20 55 L25 55 L28 40 L32 65 L35 90 L40 90 L42 65 L48 65 L45 90 L50 90 L52 65 L55 40 L58 55 L63 55 L52 30" />
        {/* Target circle */}
        <circle cx="42" cy="50" r="12" strokeDasharray="3 2" opacity="0.6" />
        <line x1="42" y1="42" x2="42" y2="58" strokeDasharray="2 2" opacity="0.4" />
        <line x1="34" y1="50" x2="50" y2="50" strokeDasharray="2 2" opacity="0.4" />
      </svg>
    );
  }
  if (angle === "left") {
    // Wider view icon
    return (
      <svg
        viewBox="0 0 80 100"
        className={cn("w-20 h-24", className)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* Body outline */}
        <ellipse cx="40" cy="20" rx="10" ry="12" />
        <path d="M30 30 L20 55 L25 55 L28 40 L32 65 L35 90 L40 90 L42 65 L48 65 L45 90 L50 90 L52 65 L55 40 L58 55 L63 55 L52 30" />
        {/* Wider frame */}
        <rect x="10" y="5" width="60" height="90" rx="4" strokeDasharray="4 3" opacity="0.3" />
      </svg>
    );
  }
  // Different angle icon
  return (
    <svg
      viewBox="0 0 80 100"
      className={cn("w-20 h-24", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Body outline - slightly rotated perspective */}
      <ellipse cx="40" cy="20" rx="10" ry="12" />
      <path d="M30 30 L20 55 L25 55 L28 40 L32 65 L35 90 L40 90 L42 65 L48 65 L45 90 L50 90 L52 65 L55 40 L58 55 L63 55 L52 30" />
      {/* Rotation arrow */}
      <path d="M62 25 Q70 35 62 45" />
      <path d="M62 45 L65 40 L58 42" fill="currentColor" />
    </svg>
  );
}

// ── Step Indicator ─────────────────────────────────────────────────────
function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const steps = [
    { num: 1, label: "Your Info" },
    { num: 2, label: "Concerns" },
    { num: 3, label: "Photos" },
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.slice(0, total).map((s, i) => (
        <div key={s.num} className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
              current === s.num
                ? "bg-primary text-primary-foreground scale-110"
                : current > s.num
                ? "bg-green-500 text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            {current > s.num ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              s.num
            )}
          </div>
          <span
            className={cn(
              "text-xs font-medium hidden sm:inline",
              current === s.num
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {s.label}
          </span>
          {i < total - 1 && (
            <div
              className={cn(
                "w-8 h-0.5 rounded",
                current > s.num ? "bg-green-500" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
export default function ClientAnalyze() {
  const [, navigate] = useLocation();

  // Step: 1 = info, 2 = concerns, 3 = photos
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Patient info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");

  // Concerns
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [otherConcern, setOtherConcern] = useState("");

  // Photos
  const [photos, setPhotos] = useState<Record<AngleKey, AnglePhoto>>({
    front: { file: null, preview: null },
    left: { file: null, preview: null },
    right: { file: null, preview: null },
  });

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState("");
  const [pollingId, setPollingId] = useState<number | null>(null);

  const fileInputRefs = useRef<Record<AngleKey, HTMLInputElement | null>>({
    front: null,
    left: null,
    right: null,
  });
  const cameraInputRefs = useRef<Record<AngleKey, HTMLInputElement | null>>({
    front: null,
    left: null,
    right: null,
  });

  // Poll for analysis status via public endpoint
  useEffect(() => {
    if (pollingId === null) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/client/status/${pollingId}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.status === "completed") {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisProgress("");
          setPollingId(null);
          navigate(`/client/report/${data.id}`);
        } else if (data.status === "failed") {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisProgress("");
          setPollingId(null);
          toast.error(
            "Analysis failed: " +
              (data.errorMessage || "Please try again.")
          );
        }
      } catch {
        // Ignore polling errors, will retry
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pollingId, navigate]);

  // ── Handlers ───────────────────────────────────────────────────────
  const validateEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleStep1Next = () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!dobMonth || !dobDay || !dobYear || dobYear.length < 4) {
      toast.error("Please enter your complete date of birth");
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (selectedConcerns.length === 0) {
      toast.error("Please select at least one concern");
      return;
    }
    setStep(3);
  };

  const toggleConcern = (id: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleFile = useCallback((angle: AngleKey, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image must be under 20MB");
      return;
    }
    const preview = URL.createObjectURL(file);
    setPhotos((prev) => ({
      ...prev,
      [angle]: { file, preview },
    }));
  }, []);

  const clearPhoto = (angle: AngleKey) => {
    setPhotos((prev) => {
      if (prev[angle].preview) {
        URL.revokeObjectURL(prev[angle].preview!);
      }
      return { ...prev, [angle]: { file: null, preview: null } };
    });
    const ref = fileInputRefs.current[angle];
    if (ref) ref.value = "";
    const camRef = cameraInputRefs.current[angle];
    if (camRef) camRef.value = "";
  };

  const hasFrontPhoto = !!photos.front.file;
  const photoCount = [photos.front, photos.left, photos.right].filter(
    (p) => p.file
  ).length;

  const handleAnalyze = async () => {
    if (!photos.front.file) {
      toast.error("Front view photo is required");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress("Preparing your photos...");

    try {
      // Step 1: Upload images via public multipart endpoint
      const imagesToUpload: {
        file: File;
        angle: "front" | "left" | "right";
      }[] = [];
      if (photos.front.file)
        imagesToUpload.push({ file: photos.front.file, angle: "front" });
      if (photos.left.file)
        imagesToUpload.push({ file: photos.left.file, angle: "left" });
      if (photos.right.file)
        imagesToUpload.push({ file: photos.right.file, angle: "right" });

      const uploadResult = await uploadImagesPublic(imagesToUpload, (msg: string) => {
        setAnalysisProgress(msg);
      });

      setAnalysisProgress("Starting your personalized analysis...");

      // Step 2: Start analysis via public endpoint
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const dob = `${dobYear}-${dobMonth.padStart(2, "0")}-${dobDay.padStart(2, "0")}`;

      const concernLabels = selectedConcerns.map(
        (id) => SKIN_CONCERNS.find((c) => c.id === id)?.label || id
      );
      if (otherConcern.trim()) {
        concernLabels.push(otherConcern.trim());
      }

      const res = await fetch("/api/client/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientFirstName: firstName,
          patientLastName: lastName,
          patientEmail: email.trim(),
          patientDob: dob,
          concerns: concernLabels,
          imageUrls: uploadResult.uploadedImages.map((img: { url: string; angle: string }) => ({
            url: img.url,
            angle: img.angle,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error || "Failed to start analysis");
      }

      const { id } = await res.json();
      setAnalysisProgress(
        "Our AI is analyzing your skin... This takes about 30-60 seconds."
      );
      setPollingId(id);
    } catch (error: any) {
      setIsAnalyzing(false);
      setAnalysisProgress("");
      toast.error(
        "Something went wrong: " +
          (error?.message || "Please try again.")
      );
    }
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/50 via-background to-background">
      {/* Simple branded header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              RadiantilyK
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            AI Skin Analysis
          </span>
        </div>
      </header>

      <main className="flex-1 container py-6 md:py-10">
        <div className="max-w-2xl mx-auto">
          <StepIndicator current={step} total={3} />

          <AnimatePresence mode="wait">
            {/* ── Step 1: Patient Info ─────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Welcome! Let's Get Started
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Tell us a little about yourself so we can personalize
                    your skin analysis.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-border/60 bg-card space-y-5">
                  <div>
                    <Label
                      htmlFor="fullName"
                      className="flex items-center gap-2 mb-2"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Jane Smith"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 mb-2"
                    >
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll send your personalized report to this email.
                    </p>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Date of Birth
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <select
                          value={dobMonth}
                          onChange={(e) => setDobMonth(e.target.value)}
                          className="w-full h-12 rounded-md border border-input bg-background px-3 text-base"
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1)}>
                              {new Date(2000, i).toLocaleString("en", {
                                month: "long",
                              })}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          value={dobDay}
                          onChange={(e) => setDobDay(e.target.value)}
                          className="w-full h-12 rounded-md border border-input bg-background px-3 text-base"
                        >
                          <option value="">Day</option>
                          {Array.from({ length: 31 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1)}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Input
                          placeholder="Year"
                          value={dobYear}
                          onChange={(e) =>
                            setDobYear(
                              e.target.value.replace(/\D/g, "").slice(0, 4)
                            )
                          }
                          className="h-12 text-base"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full h-12 text-base font-semibold"
                  onClick={handleStep1Next}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* ── Step 2: Concerns ────────────────────────────────── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    What Are Your Skin Concerns?
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Select everything that applies — this helps our AI focus
                    on what matters most to you.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {SKIN_CONCERNS.map((concern) => (
                    <button
                      key={concern.id}
                      onClick={() => toggleConcern(concern.id)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                        selectedConcerns.includes(concern.id)
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border/60 bg-card hover:border-primary/30 hover:bg-accent/50"
                      )}
                    >
                      <span className="text-xl">{concern.emoji}</span>
                      <span className="text-sm font-medium">
                        {concern.label}
                      </span>
                      {selectedConcerns.includes(concern.id) && (
                        <CheckCircle2 className="w-4 h-4 text-primary ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {selectedConcerns.includes("other") && (
                  <div>
                    <Label className="mb-2">
                      Tell us more about your concern:
                    </Label>
                    <Input
                      placeholder="Describe your concern..."
                      value={otherConcern}
                      onChange={(e) => setOtherConcern(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 h-12 text-base font-semibold"
                    onClick={handleStep2Next}
                  >
                    Continue to Photos
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Photo Capture ───────────────────────────── */}
            {step === 3 && (() => {
              const isBodyConcern = selectedConcerns.includes("body_skin") && !selectedConcerns.some(c => !["body_skin", "other", "general"].includes(c));
              const activeAngleConfig = isBodyConcern ? BODY_ANGLE_CONFIG : FACE_ANGLE_CONFIG;
              const SilhouetteComponent = isBodyConcern ? BodySilhouette : FaceSilhouette;
              return (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {isBodyConcern ? "Take Your Body Photos" : "Take Your Photos"}
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    {isBodyConcern
                      ? "Follow the guides below to capture the body area you'd like analyzed. Good lighting is key."
                      : "Follow the guides below for the best results. Good lighting and a neutral expression work best."}
                  </p>
                </div>

                {/* Photo tips banner */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                  <p className="text-sm font-medium mb-2">
                    {isBodyConcern ? "Tips for Great Body Photos:" : "Tips for Great Photos:"}
                  </p>
                  <ul className="text-xs space-y-1 list-disc list-inside text-amber-700">
                    <li>Use natural daylight or bright, even lighting</li>
                    {isBodyConcern ? (
                      <>
                        <li>Remove clothing from the target area if possible</li>
                        <li>Include a close-up of the specific area of concern</li>
                        <li>Keep the camera steady and in focus</li>
                        <li>Stand about 1–3 feet from the camera depending on the area</li>
                      </>
                    ) : (
                      <>
                        <li>Remove makeup and glasses if possible</li>
                        <li>Pull hair away from your face</li>
                        <li>Keep a neutral expression — no smiling</li>
                        <li>Hold the camera at eye level, about arm's length away</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Photo upload cards */}
                <div className="space-y-4">
                  {activeAngleConfig.map((angle) => {
                    const photo = photos[angle.key];
                    return (
                      <div
                        key={angle.key}
                        className="p-5 rounded-2xl border border-border/60 bg-card"
                      >
                        <div className="flex items-start gap-4">
                          {/* Silhouette guide */}
                          <div className="shrink-0 flex flex-col items-center">
                            <SilhouetteComponent
                              angle={angle.key}
                              className="text-muted-foreground/50"
                            />
                            {angle.required && (
                              <span className="text-[10px] font-medium text-red-500 mt-1">
                                Required
                              </span>
                            )}
                            {!angle.required && (
                              <span className="text-[10px] text-muted-foreground mt-1">
                                Optional
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base">
                              {angle.label}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                              {angle.instruction}
                            </p>

                            {photo.preview ? (
                              <div className="mt-3 relative">
                                <img
                                  src={photo.preview}
                                  alt={`${angle.label} preview`}
                                  className="w-full max-w-[200px] h-auto rounded-xl object-cover border"
                                />
                                <button
                                  onClick={() => clearPhoto(angle.key)}
                                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="mt-3 flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    fileInputRefs.current[
                                      angle.key
                                    ]?.click()
                                  }
                                >
                                  <Upload className="w-4 h-4 mr-1" />
                                  Upload
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    cameraInputRefs.current[
                                      angle.key
                                    ]?.click()
                                  }
                                >
                                  <Camera className="w-4 h-4 mr-1" />
                                  Camera
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Hidden file inputs */}
                        <input
                          ref={(el) => {
                            fileInputRefs.current[angle.key] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFile(angle.key, f);
                          }}
                        />
                        <input
                          ref={(el) => {
                            cameraInputRefs.current[angle.key] = el;
                          }}
                          type="file"
                          accept="image/*"
                          capture="user"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFile(angle.key, f);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12"
                    onClick={() => setStep(2)}
                    disabled={isAnalyzing}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 h-12 text-base font-semibold"
                    onClick={handleAnalyze}
                    disabled={!hasFrontPhoto || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyze {photoCount}{" "}
                        {photoCount === 1 ? "Photo" : "Photos"}
                      </>
                    )}
                  </Button>
                </div>

                {/* Progress message */}
                {isAnalyzing && analysisProgress && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-primary">
                      {analysisProgress}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please don't close this page
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
            })()}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/30">
        <div className="container py-6">
          <div className="flex items-start gap-3 max-w-2xl mx-auto">
            <Shield className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Your information is protected under HIPAA privacy regulations.
              This AI analysis is for informational purposes only and does
              not constitute medical advice. Always consult a qualified
              healthcare provider.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
