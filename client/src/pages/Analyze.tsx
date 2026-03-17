import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
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
  Image as ImageIcon,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Analyze() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const analyzeMutation = trpc.skin.analyze.useMutation({
    onSuccess: (data) => {
      if (data?.id) {
        navigate(`/report/${data.id}`);
      }
    },
    onError: (error) => {
      toast.error("Analysis failed: " + error.message);
      setIsAnalyzing(false);
      setAnalysisProgress("");
    },
  });

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image must be under 20MB");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleAnalyze = async () => {
    if (!selectedFile || !selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisProgress("Uploading image...");

    try {
      // Convert to base64
      const base64 = selectedImage.split(",")[1];
      setAnalysisProgress("AI is analyzing your skin...");

      await analyzeMutation.mutateAsync({
        imageBase64: base64,
        imageMimeType: selectedFile.type,
      });
    } catch {
      // Error handled by onError
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Skin Analysis
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              Upload a clear, well-lit photo of your skin for the most accurate
              analysis.
            </p>
          </div>

          {/* Upload Area */}
          {!selectedImage ? (
            <div className="space-y-4">
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200",
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />

                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">
                      Drop your photo here
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse files
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Button>
                </div>
              </div>

              {/* Camera capture for mobile */}
              <div className="text-center">
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photo with Camera
                </Button>
              </div>

              {/* Tips */}
              <div className="mt-8 p-5 rounded-xl bg-accent/50 border border-border/60">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Tips for Best Results
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>Use natural lighting — avoid harsh shadows or flash</li>
                  <li>Remove makeup for the most accurate analysis</li>
                  <li>Take a close-up photo of the area of concern</li>
                  <li>Ensure the image is in focus and not blurry</li>
                  <li>Full face photos provide the most comprehensive analysis</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Image Preview & Analyze */
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-card">
                <img
                  src={selectedImage}
                  alt="Selected skin photo"
                  className="w-full max-h-[500px] object-contain bg-black/5"
                />
                {!isAnalyzing && (
                  <button
                    onClick={clearImage}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary/5 border border-primary/20">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-sm">{analysisProgress}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        This may take 15-30 seconds for a thorough analysis
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={clearImage}
                  >
                    Choose Different Photo
                  </Button>
                  <Button
                    className="flex-1 font-semibold"
                    size="lg"
                    onClick={handleAnalyze}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Skin
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
