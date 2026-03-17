import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
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
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type AngleKey = "front" | "left" | "right";

interface AnglePhoto {
  file: File | null;
  preview: string | null;
  base64: string | null;
  mimeType: string;
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

  // Step management: 1 = patient info, 2 = photo upload
  const [step, setStep] = useState<1 | 2>(1);

  // Patient info state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  // Photo state
  const [photos, setPhotos] = useState<Record<AngleKey, AnglePhoto>>({
    front: { file: null, preview: null, base64: null, mimeType: "image/jpeg" },
    left: { file: null, preview: null, base64: null, mimeType: "image/jpeg" },
    right: { file: null, preview: null, base64: null, mimeType: "image/jpeg" },
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState("");
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

  const analyzeMutation = trpc.skin.analyze.useMutation({
    onSuccess: (data: { id: number }) => {
      if (data?.id) {
        navigate(`/report/${data.id}`);
      }
    },
    onError: (error: { message: string }) => {
      toast.error("Analysis failed: " + error.message);
      setIsAnalyzing(false);
      setAnalysisProgress("");
    },
  });

  const handleFile = useCallback((angle: AngleKey, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image must be under 20MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(",")[1];
      setPhotos((prev) => ({
        ...prev,
        [angle]: { file, preview: dataUrl, base64, mimeType: file.type },
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const clearPhoto = (angle: AngleKey) => {
    setPhotos((prev) => ({
      ...prev,
      [angle]: { file: null, preview: null, base64: null, mimeType: "image/jpeg" },
    }));
    const ref = fileInputRefs.current[angle];
    if (ref) ref.value = "";
    const camRef = cameraInputRefs.current[angle];
    if (camRef) camRef.value = "";
  };

  const hasFrontPhoto = !!photos.front.preview;
  const photoCount = [photos.front, photos.left, photos.right].filter((p) => p.preview).length;

  const isPatientFormValid = firstName.trim() && lastName.trim() && email.trim() && dob;

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleNextStep = () => {
    if (!firstName.trim()) { toast.error("First name is required"); return; }
    if (!lastName.trim()) { toast.error("Last name is required"); return; }
    if (!email.trim() || !validateEmail(email)) { toast.error("Valid email is required"); return; }
    if (!dob) { toast.error("Date of birth is required"); return; }
    setStep(2);
  };

  const handleAnalyze = async () => {
    if (!photos.front.base64) {
      toast.error("Front view photo is required");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress("Uploading images...");

    try {
      const images: { base64: string; mimeType: string; angle: "front" | "left" | "right" }[] = [];

      if (photos.front.base64) {
        images.push({ base64: photos.front.base64, mimeType: photos.front.mimeType, angle: "front" });
      }
      if (photos.left.base64) {
        images.push({ base64: photos.left.base64, mimeType: photos.left.mimeType, angle: "left" });
      }
      if (photos.right.base64) {
        images.push({ base64: photos.right.base64, mimeType: photos.right.mimeType, angle: "right" });
      }

      setAnalysisProgress(`AI is analyzing ${images.length} photo${images.length > 1 ? "s" : ""}...`);

      await analyzeMutation.mutateAsync({
        patientFirstName: firstName.trim(),
        patientLastName: lastName.trim(),
        patientEmail: email.trim(),
        patientDob: dob,
        images,
      });
    } catch {
      // Error handled by onError
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
          <div className="flex items-center justify-center gap-3 mb-8">
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
              step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Camera className="w-4 h-4" />
              <span>2. Upload Photos</span>
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
                    <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="patient@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    Date of Birth <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="h-11"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <Button
                  className="w-full h-12 font-semibold text-base mt-2"
                  size="lg"
                  onClick={handleNextStep}
                  disabled={!isPatientFormValid}
                >
                  Continue to Photo Upload
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Photo Upload */}
          {step === 2 && (
            <>
              {/* Patient summary bar */}
              <div className="mb-6 p-4 rounded-xl border border-border/60 bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{firstName} {lastName}</p>
                    <p className="text-xs text-muted-foreground">{email} &middot; DOB: {new Date(dob + "T00:00:00").toLocaleDateString()}</p>
                  </div>
                </div>
                {!isAnalyzing && (
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Upload Skin Photos
                </h1>
                <p className="mt-3 text-muted-foreground text-lg">
                  Upload photos from multiple angles for the most comprehensive analysis.
                  Front view is required; side views are optional but recommended.
                </p>
              </div>

              {/* Multi-Angle Upload Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {ANGLE_CONFIG.map(({ key, label, required, description }) => (
                  <div key={key} className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{label}</h3>
                      {required ? (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          Required
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Optional
                        </span>
                      )}
                    </div>

                    <input
                      ref={(el) => { fileInputRefs.current[key] = el; }}
                      type="file"
                      accept="image/*"
                      style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(key, file);
                      }}
                    />
                    <input
                      ref={(el) => { cameraInputRefs.current[key] = el; }}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(key, file);
                      }}
                    />

                    {photos[key].preview ? (
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border/60 bg-card group">
                        <img
                          src={photos[key].preview!}
                          alt={`${label} photo`}
                          className="w-full h-full object-cover"
                        />
                        {!isAnalyzing && (
                          <button
                            onClick={() => clearPhoto(key)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                          <span className="text-white text-xs font-medium">{label}</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="aspect-[3/4] rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-accent/30 hover:bg-accent/50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer relative"
                        onClick={(e) => {
                          // Only trigger if clicking the zone itself, not the buttons
                          if (e.target === e.currentTarget || !(e.target as HTMLElement).closest('button')) {
                            const input = fileInputRefs.current[key];
                            if (input) {
                              input.value = '';
                              input.click();
                            }
                          }
                        }}
                      >
                        <FaceSilhouette angle={key} className="text-muted-foreground/40" />
                        <p className="text-xs text-muted-foreground text-center px-4">
                          {description}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              const input = fileInputRefs.current[key];
                              if (input) {
                                input.value = '';
                                input.click();
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            Upload
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              const input = cameraInputRefs.current[key];
                              if (input) {
                                input.value = '';
                                input.click();
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors flex items-center gap-1"
                          >
                            <Camera className="w-3 h-3" />
                            Camera
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Analyze Button */}
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary/5 border border-primary/20">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-sm">{analysisProgress}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        This may take 20-40 seconds for a thorough multi-angle analysis
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Button
                    className="font-semibold px-10 h-12 text-base"
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={!hasFrontPhoto}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {hasFrontPhoto
                      ? `Analyze ${photoCount} Photo${photoCount > 1 ? "s" : ""}`
                      : "Upload Front View to Begin"}
                  </Button>
                  {!hasFrontPhoto && (
                    <p className="text-xs text-muted-foreground">
                      Front view is required. Side views enhance accuracy.
                    </p>
                  )}
                </div>
              )}

              {/* Tips */}
              <div className="mt-10 p-5 rounded-xl bg-accent/50 border border-border/60">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Tips for Best Results
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>Use natural lighting — avoid harsh shadows or flash</li>
                  <li>Remove makeup for the most accurate analysis</li>
                  <li>For the front view, look directly at the camera</li>
                  <li>For side views, turn your head 90 degrees to show your profile</li>
                  <li>Ensure images are in focus and well-lit</li>
                  <li>Adding all 3 angles gives the most comprehensive analysis</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
