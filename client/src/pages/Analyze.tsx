import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { uploadImages } from "@/lib/uploadService";
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
  LogIn,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

// ── Skin Concerns (same as client portal) ────────────────────────────────
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

type AngleKey = "front" | "left" | "right";

interface AnglePhoto {
  file: File | null;
  preview: string | null;
}

const ANGLE_CONFIG: { key: AngleKey; label: string; required: boolean; description: string }[] = [
  { key: "front", label: "Front View", required: true, description: "Face the camera directly" },
  { key: "left", label: "Left Side", required: false, description: "Turn head to show left profile" },
  { key: "right", label: "Right Side", required: false, description: "Turn head to show right profile" },
];

function FaceSilhouette({ angle, className }: { angle: AngleKey; className?: string }) {
  if (angle === "front") {
    return (
      <svg viewBox="0 0 80 100" className={cn("w-16 h-20", className)} fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="40" cy="45" rx="25" ry="32" />
        <circle cx="30" cy="40" r="2.5" fill="currentColor" />
        <circle cx="50" cy="40" r="2.5" fill="currentColor" />
        <ellipse cx="40" cy="50" rx="3" ry="2" />
        <path d="M33 60 Q40 66 47 60" />
        <path d="M15 35 Q12 20 25 12 Q40 4 55 12 Q68 20 65 35" />
      </svg>
    );
  }
  if (angle === "left") {
    return (
      <svg viewBox="0 0 80 100" className={cn("w-16 h-20", className)} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M55 15 Q65 10 60 25 Q58 35 60 45 Q62 55 55 65 Q48 75 40 78 Q30 80 28 70 Q25 60 25 50 Q25 35 30 25 Q35 15 45 12 Q50 11 55 15Z" />
        <circle cx="48" cy="40" r="2.5" fill="currentColor" />
        <path d="M58 50 L62 49 L58 52" />
        <path d="M42 62 Q48 66 52 62" />
        <path d="M52 20 Q60 15 62 25" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 100" className={cn("w-16 h-20 scale-x-[-1]", className)} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M55 15 Q65 10 60 25 Q58 35 60 45 Q62 55 55 65 Q48 75 40 78 Q30 80 28 70 Q25 60 25 50 Q25 35 30 25 Q35 15 45 12 Q50 11 55 15Z" />
      <circle cx="48" cy="40" r="2.5" fill="currentColor" />
      <path d="M58 50 L62 49 L58 52" />
      <path d="M42 62 Q48 66 52 62" />
      <path d="M52 20 Q60 15 62 25" />
    </svg>
  );
}

export default function Analyze() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  // Step management: 1 = patient info, 2 = concerns, 3 = photo upload
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Patient info state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  // Concerns state
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [otherConcern, setOtherConcern] = useState("");

  // Photo state — now stores File objects instead of base64
  const [photos, setPhotos] = useState<Record<AngleKey, AnglePhoto>>({
    front: { file: null, preview: null },
    left: { file: null, preview: null },
    right: { file: null, preview: null },
  });
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

  // Start analysis mutation (returns immediately with ID)
  const analyzeMutation = trpc.skin.analyze.useMutation();

  // Poll for analysis status
  const statusQuery = trpc.skin.getStatus.useQuery(
    { id: pollingId! },
    {
      enabled: pollingId !== null,
      refetchInterval: (query) => {
        const data = query.state.data;
        if (data?.status === "completed" || data?.status === "failed") {
          return false; // Stop polling
        }
        return 3000; // Poll every 3 seconds
      },
    }
  );

  // Handle polling results
  useEffect(() => {
    if (!statusQuery.data || pollingId === null) return;

    const { status, id } = statusQuery.data;

    if (status === "completed") {
      setIsAnalyzing(false);
      setAnalysisProgress("");
      setPollingId(null);
      navigate(`/report/${id}`);
    } else if (status === "failed") {
      setIsAnalyzing(false);
      setAnalysisProgress("");
      setPollingId(null);
      toast.error("Analysis failed: " + (statusQuery.data.errorMessage || "Unknown error. Please try again."));
    } else if (status === "processing") {
      setAnalysisProgress("AI is analyzing your photos... This may take 30-60 seconds.");
    }
  }, [statusQuery.data, pollingId, navigate]);

  const handleFile = useCallback((angle: AngleKey, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image must be under 20MB");
      return;
    }
    // Create a preview URL and store the File object
    const preview = URL.createObjectURL(file);
    setPhotos((prev) => ({
      ...prev,
      [angle]: { file, preview },
    }));
  }, []);

  const clearPhoto = (angle: AngleKey) => {
    setPhotos((prev) => {
      // Revoke old preview URL to free memory
      if (prev[angle].preview) {
        URL.revokeObjectURL(prev[angle].preview!);
      }
      return {
        ...prev,
        [angle]: { file: null, preview: null },
      };
    });
    const ref = fileInputRefs.current[angle];
    if (ref) ref.value = "";
    const camRef = cameraInputRefs.current[angle];
    if (camRef) camRef.value = "";
  };

  const toggleConcern = (id: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const hasFrontPhoto = !!photos.front.file;
  const photoCount = [photos.front, photos.left, photos.right].filter((p) => p.file).length;

  const isPatientFormValid = firstName.trim() && lastName.trim() && email.trim() && dob;

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleNextToStep2 = () => {
    if (!firstName.trim()) { toast.error("First name is required"); return; }
    if (!lastName.trim()) { toast.error("Last name is required"); return; }
    if (!email.trim() || !validateEmail(email)) { toast.error("Valid email is required"); return; }
    if (!dob) { toast.error("Date of birth is required"); return; }
    setStep(2);
  };

  const handleNextToStep3 = () => {
    setStep(3);
  };

  const handleAnalyze = async () => {
    if (!photos.front.file) {
      toast.error("Front view photo is required");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress("Compressing images...");

    try {
      // Step 1: Compress and upload images via multipart/form-data (bypasses tRPC)
      const imagesToUpload: { file: File; angle: "front" | "left" | "right" }[] = [];

      if (photos.front.file) {
        imagesToUpload.push({ file: photos.front.file, angle: "front" });
      }
      if (photos.left.file) {
        imagesToUpload.push({ file: photos.left.file, angle: "left" });
      }
      if (photos.right.file) {
        imagesToUpload.push({ file: photos.right.file, angle: "right" });
      }

      const uploadResult = await uploadImages(imagesToUpload, (msg) => {
        setAnalysisProgress(msg);
      });

      setAnalysisProgress("Starting AI analysis...");

      // Build concern labels
      const concernLabels = selectedConcerns.map(
        (id) => SKIN_CONCERNS.find((c) => c.id === id)?.label || id
      );
      if (otherConcern.trim()) {
        concernLabels.push(otherConcern.trim());
      }

      // Step 2: Start analysis with S3 URLs (returns immediately)
      const analyzeResult = await analyzeMutation.mutateAsync({
        patientFirstName: firstName.trim(),
        patientLastName: lastName.trim(),
        patientEmail: email.trim(),
        patientDob: dob,
        concerns: concernLabels.length > 0 ? concernLabels : undefined,
        imageUrls: uploadResult.uploadedImages.map((img) => ({
          url: img.url,
          angle: img.angle as "front" | "left" | "right",
        })),
      });

      setAnalysisProgress("AI is analyzing your photos... This may take 30-60 seconds.");

      // Step 3: Start polling for results
      setPollingId(analyzeResult.id);
    } catch (error: any) {
      setIsAnalyzing(false);
      setAnalysisProgress("");
      toast.error("Failed to start analysis: " + (error?.message || "Please try again."));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  // Not authenticated — show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center p-8 rounded-2xl border border-border/60 bg-card">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <LogIn className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Staff Access Only</h2>
            <p className="text-muted-foreground mb-6">
              This tool is restricted to authorized staff members. Please log in to access the skin analysis system.
            </p>
            <Button asChild size="lg" className="font-semibold px-8">
              <a href={getLoginUrl()}>
                <LogIn className="w-4 h-4 mr-2" />
                Log In
              </a>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
     
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
              step === 1 ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
            )}>
              <User className="w-4 h-4" />
              <span>1. Patient Info</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
              step === 2 ? "bg-primary text-primary-foreground" : step > 2 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <Heart className="w-4 h-4" />
              <span>2. Concerns</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
              step === 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Camera className="w-4 h-4" />
              <span>3. Upload Photos</span>
            </div>
          </div>

          {/* Step 1: Patient Info */}
          {step === 1 && (
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Patient Information
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Enter the patient's details before proceeding to the skin analysis.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-2xl border border-border/60 bg-card space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center gap-1.5 text-sm font-medium">
                      <User className="w-3.5 h-3.5" />
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center gap-1.5 text-sm font-medium">
                      <User className="w-3.5 h-3.5" />
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium">
                    <Mail className="w-3.5 h-3.5" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="patient@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center gap-1.5 text-sm font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Date of Birth *
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full font-semibold mt-4"
                  disabled={!isPatientFormValid}
                  onClick={handleNextToStep2}
                >
                  Continue to Concerns
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Skin Concerns */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Patient Concerns
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Select the patient's skin concerns. This dramatically improves analysis accuracy — the AI will specifically evaluate each selected concern.
                </p>
              </div>

              {/* Back button */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to patient info
              </button>

              {/* Accuracy callout */}
              <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Why This Matters</h3>
                    <p className="text-sm text-muted-foreground">
                      When concerns are selected, the AI is <strong>required</strong> to evaluate each one — confirming, acknowledging, or ruling it out with evidence. Without concerns, the AI may miss issues the patient cares about most.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
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
                <div className="mb-6">
                  <Label className="mb-2">
                    Describe the concern:
                  </Label>
                  <Input
                    placeholder="Describe the patient's concern..."
                    value={otherConcern}
                    onChange={(e) => setOtherConcern(e.target.value)}
                  />
                </div>
              )}

              {selectedConcerns.length > 0 && (
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedConcerns.length} concern{selectedConcerns.length !== 1 ? "s" : ""} selected — the AI will specifically evaluate each one.
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 font-semibold"
                  onClick={handleNextToStep3}
                >
                  Skip — No Concerns
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  className="flex-1 font-semibold"
                  onClick={handleNextToStep3}
                  disabled={selectedConcerns.length === 0}
                >
                  Continue with {selectedConcerns.length} Concern{selectedConcerns.length !== 1 ? "s" : ""}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Photo Upload */}
          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Upload Skin Photos
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Capture or upload photos from up to 3 angles for a comprehensive analysis.
                </p>
              </div>

              {/* Back to concerns */}
              {!isAnalyzing && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to concerns
                </button>
              )}

              {/* Selected concerns summary */}
              {selectedConcerns.length > 0 && (
                <div className="mb-6 p-3 rounded-xl bg-muted/50 border border-border/40">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Selected concerns:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedConcerns.map((id) => {
                      const concern = SKIN_CONCERNS.find((c) => c.id === id);
                      return concern ? (
                        <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {concern.emoji} {concern.label}
                        </span>
                      ) : null;
                    })}
                    {otherConcern.trim() && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        ❓ {otherConcern.trim()}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Photo Upload Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {ANGLE_CONFIG.map(({ key, label, required, description }) => (
                  <div
                    key={key}
                    className={cn(
                      "relative rounded-2xl border-2 border-dashed transition-all overflow-hidden",
                      photos[key].preview
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/60 bg-card hover:border-primary/30 hover:bg-primary/5"
                    )}
                  >
                    {photos[key].preview ? (
                      <div className="relative aspect-[3/4]">
                        <img
                          src={photos[key].preview!}
                          alt={label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <span className="text-white text-sm font-medium">{label}</span>
                        </div>
                        {!isAnalyzing && (
                          <button
                            type="button"
                            onClick={() => clearPhoto(key)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div
                        className="aspect-[3/4] flex flex-col items-center justify-center p-4 cursor-pointer"
                        onClick={() => !isAnalyzing && fileInputRefs.current[key]?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files[0];
                          if (file) handleFile(key, file);
                        }}
                      >
                        <FaceSilhouette angle={key} className="text-muted-foreground/40 mb-3" />
                        <span className="text-sm font-medium text-foreground">{label}</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {required ? "Required" : "Highly Recommended"}
                        </span>
                        <p className="text-xs text-muted-foreground/70 mt-2 text-center">{description}</p>

                        <div className="flex gap-2 mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isAnalyzing}
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRefs.current[key]?.click();
                            }}
                          >
                            <Upload className="w-3.5 h-3.5 mr-1" />
                            Upload
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isAnalyzing}
                            onClick={(e) => {
                              e.stopPropagation();
                              cameraInputRefs.current[key]?.click();
                            }}
                          >
                            <Camera className="w-3.5 h-3.5 mr-1" />
                            Camera
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Hidden file inputs */}
                    <input
                      ref={(el) => { fileInputRefs.current[key] = el; }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(key, file);
                      }}
                      style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
                    />
                    <input
                      ref={(el) => { cameraInputRefs.current[key] = el; }}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(key, file);
                      }}
                      style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
                    />
                  </div>
                ))}
              </div>

              {/* Analyze Button */}
              <div className="flex flex-col items-center gap-4">
                <Button
                  size="lg"
                  className="w-full max-w-md font-semibold text-base py-6"
                  disabled={!hasFrontPhoto || isAnalyzing}
                  onClick={handleAnalyze}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze {photoCount} Photo{photoCount !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>

                {/* Progress indicator */}
                {isAnalyzing && analysisProgress && (
                  <div className="w-full max-w-md p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{analysisProgress}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Please wait — do not close this page.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="mt-8 p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Tips for Best Results</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Use natural lighting — avoid harsh shadows or flash</li>
                      <li>Remove makeup for the most accurate analysis</li>
                      <li>For the front view, look directly at the camera</li>
                      <li>For side views, turn your head 90 degrees to show your profile</li>
                      <li>Ensure images are in focus and well-lit</li>
                      <li><strong>Adding all 3 angles gives the most comprehensive and accurate analysis</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
