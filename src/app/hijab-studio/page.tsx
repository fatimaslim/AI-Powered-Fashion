"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Sparkles,
  Download,
  Share2,
  Heart,
  ArrowLeft,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Example hijab images from Unsplash (free license)
const HIJAB_GALLERY = [
  {
    id: 1,
    name: "Chiffon Hijab — Emerald",
    color: "Emerald Green",
    image: "https://images.unsplash.com/photo-1609430528048-8e6a9d0a3e17?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Jersey Hijab — Dusty Rose",
    color: "Dusty Rose",
    image: "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Silk Hijab — Navy Blue",
    color: "Navy Blue",
    image: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Cotton Hijab — Cream",
    color: "Cream",
    image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Printed Hijab — Floral",
    color: "Floral Print",
    image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Satin Hijab — Burgundy",
    color: "Burgundy",
    image: "https://images.unsplash.com/photo-1598555353592-231a4a4df61b?q=80&w=600&auto=format&fit=crop",
  },
];

// Demo results — pre-generated examples for showcase
const DEMO_RESULTS = [
  "https://images.unsplash.com/photo-1609430528048-8e6a9d0a3e17?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?q=80&w=800&auto=format&fit=crop",
];

const LOADING_STAGES = [
  { label: "Analyzing facial landmarks...", icon: "🧠", completed: false },
  { label: "Detecting face boundaries...", icon: "📍", completed: false },
  { label: "Extracting hijab style...", icon: "🧕", completed: false },
  { label: "Mapping head geometry...", icon: "📐", completed: false },
  { label: "Applying fabric texture...", icon: "🎨", completed: false },
  { label: "Generating realistic shadows...", icon: "🌓", completed: false },
  { label: "Rendering final image...", icon: "✨", completed: false },
  { label: "Almost done...", icon: "🚀", completed: false },
];

export default function HijabStudioPage() {
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [hijabImage, setHijabImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleImageUpload = (type: "face" | "hijab") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (type === "face") setFaceImage(dataUrl);
      else setHijabImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectGalleryItem = (index: number) => {
    setSelectedGalleryIndex(index);
    setHijabImage(HIJAB_GALLERY[index].image);
  };

  const handleGenerate = async () => {
    if (!faceImage || !hijabImage) return;

    setIsLoading(true);
    setResult(null);
    setCurrentStage(0);

    // Simulate loading stages progression up to stage 6 while waiting
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => (prev < 6 ? prev + 1 : prev));
    }, 2000);

    try {
      const response = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_type: "hijab",
          model_image: faceImage,
          garment_image: hijabImage,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate hijab try-on");
      }

      setIsDemoMode(!!data.isDemo);

      let finalOutput: string = "";

      if (data.id) {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        let isDone = false;
        
        for (let i = 0; i < 60; i++) {
          const statusRes = await fetch(`/api/tryon/status?id=${data.id}`);
          const statusData = await statusRes.json();
          
          if (!statusRes.ok) {
            throw new Error(statusData.error || "Failed to check status");
          }

          if (statusData.status === "completed") {
            if (statusData.output && statusData.output.length > 0) {
              finalOutput = statusData.output[0];
            }
            isDone = true;
            break;
          } else if (statusData.status === "failed") {
            throw new Error(statusData.error || "Generation failed");
          }
          
          await delay(2000);
        }

        if (!isDone) {
          throw new Error("Generation timed out");
        }
      } else {
        if (data.output && data.output.length > 0) {
          finalOutput = data.output[0];
        }
      }

      // Complete the loading stages
      clearInterval(stageInterval);
      setCurrentStage(LOADING_STAGES.length);
      
      // Artificial short delay for smooth transition
      await new Promise(r => setTimeout(r, 800));
      
      if (finalOutput) {
        setResult(finalOutput);
      } else {
        throw new Error("No output generated");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      clearInterval(stageInterval);
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = "hijab-tryon-result.jpg";
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-plus-jakarta)]">
              AI Hijab <span className="gradient-text">Studio</span>
            </h1>
            {isDemoMode && (
              <Badge variant="outline" className="text-xs border-brand/50 text-brand bg-brand/10">
                ✨ Concept Demo
              </Badge>
            )}
          </div>
          <p className="text-foreground-muted max-w-2xl">
            Preview different hijab styles on your photo using AI. Upload your portrait and a hijab reference
            to see how it would look on you.
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-brand/5 border border-brand/20">
            <Info className="h-5 w-5 text-brand flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">AI Concept Demo</p>
              <p className="text-xs text-foreground-muted mt-0.5">
                This is a UI/UX showcase demonstrating the hijab try-on workflow. The generated results are
                pre-selected examples. In production, this would use a dedicated headwear AI model.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Upload Face */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="h-full">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full gradient-brand text-white flex items-center justify-center text-xs font-bold">1</span>
                  Upload Your Portrait
                </h3>
                <label className={cn(
                  "relative flex flex-col items-center justify-center aspect-[3/4] rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                  faceImage ? "border-brand/50 bg-brand/5" : "border-border hover:border-brand/30 hover:bg-background-secondary"
                )}>
                  {faceImage ? (
                    <Image src={faceImage} alt="Your face" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-foreground-muted">
                      <Upload className="h-8 w-8" />
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs">Close-up face or upper body</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload("face")} />
                </label>
                {faceImage && (
                  <button onClick={() => setFaceImage(null)} className="text-xs text-foreground-muted hover:text-foreground mt-2 cursor-pointer">
                    ✕ Remove
                  </button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Result Preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full border-brand/30">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand" />
                  Result Preview
                </h3>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-background-secondary border border-border/50">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6"
                      >
                        <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center animate-pulse">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div className="space-y-2 w-full">
                          {LOADING_STAGES.map((stage, i) => (
                            <div key={i} className={cn(
                              "flex items-center gap-2 text-xs transition-all",
                              i < currentStage ? "text-brand" : i === currentStage ? "text-foreground animate-pulse" : "text-foreground-muted/40"
                            )}>
                              <span>{stage.icon}</span>
                              <span>{stage.label}</span>
                              {i < currentStage && <span className="ml-auto text-success">✓</span>}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : result ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full h-full"
                      >
                        <Image src={result} alt="Hijab try-on result" fill className="object-cover" unoptimized />

                        {/* Before/After Slider */}
                        {faceImage && (
                          <div className="absolute inset-0">
                            <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
                              <Image src={faceImage} alt="Before" fill className="object-cover" unoptimized />
                            </div>
                            <div
                              className="absolute top-0 bottom-0 w-1 bg-white/80 shadow-lg cursor-col-resize z-10"
                              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                              onMouseDown={(e) => {
                                const container = e.currentTarget.parentElement;
                                if (!container) return;
                                const handleMove = (ev: MouseEvent) => {
                                  const rect = container.getBoundingClientRect();
                                  const pos = ((ev.clientX - rect.left) / rect.width) * 100;
                                  setSliderPosition(Math.max(5, Math.min(95, pos)));
                                };
                                const handleUp = () => {
                                  document.removeEventListener("mousemove", handleMove);
                                  document.removeEventListener("mouseup", handleUp);
                                };
                                document.addEventListener("mousemove", handleMove);
                                document.addEventListener("mouseup", handleUp);
                              }}
                            >
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                                <ChevronLeft className="h-3 w-3 text-gray-600" />
                                <ChevronRight className="h-3 w-3 text-gray-600" />
                              </div>
                            </div>
                            <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-medium">Before</div>
                            <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-medium">After</div>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-foreground-muted"
                      >
                        <div className="w-16 h-16 rounded-2xl gradient-brand/10 border border-brand/20 flex items-center justify-center">
                          <span className="text-3xl">🧕</span>
                        </div>
                        <p className="text-sm font-medium">Result will appear here</p>
                        <p className="text-xs text-center px-6">Upload a face photo and select a hijab style, then click Generate</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action buttons */}
                {result && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" icon={<Download className="h-3.5 w-3.5" />} onClick={handleDownload} className="flex-1">
                      Download
                    </Button>
                    <Button size="sm" variant="outline" icon={<Share2 className="h-3.5 w-3.5" />} className="flex-1">
                      Share
                    </Button>
                    <Button size="sm" variant="outline" icon={<Heart className="h-3.5 w-3.5" />}>
                      Save
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upload Hijab Reference */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="h-full">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full gradient-brand text-white flex items-center justify-center text-xs font-bold">2</span>
                  Upload Hijab Reference
                </h3>
                <label className={cn(
                  "relative flex flex-col items-center justify-center aspect-[3/4] rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                  hijabImage ? "border-brand/50 bg-brand/5" : "border-border hover:border-brand/30 hover:bg-background-secondary"
                )}>
                  {hijabImage ? (
                    <Image src={hijabImage} alt="Hijab reference" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-foreground-muted">
                      <Upload className="h-8 w-8" />
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs text-center px-4">A hijab product image or a photo of someone wearing the style you like</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload("hijab")} />
                </label>
                {hijabImage && (
                  <button onClick={() => { setHijabImage(null); setSelectedGalleryIndex(null); }} className="text-xs text-foreground-muted hover:text-foreground mt-2 cursor-pointer">
                    ✕ Remove
                  </button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <Button
            size="lg"
            disabled={!faceImage || !hijabImage || isLoading}
            onClick={handleGenerate}
            icon={isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            className="px-12 py-4 text-base"
          >
            {isLoading ? "Generating..." : result ? "Generate Another Variation" : "Generate Hijab Preview"}
          </Button>
        </motion.div>

        {/* Example Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold font-[var(--font-plus-jakarta)]">
              Hijab Style <span className="gradient-text">Gallery</span>
            </h2>
            <p className="text-sm text-foreground-muted mt-1">
              Click any style to use it as a reference, or upload your own
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {HIJAB_GALLERY.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <button
                  onClick={() => handleSelectGalleryItem(i)}
                  className={cn(
                    "w-full group cursor-pointer rounded-xl overflow-hidden border-2 transition-all",
                    selectedGalleryIndex === i
                      ? "border-brand shadow-lg shadow-brand/20 scale-[1.02]"
                      : "border-transparent hover:border-brand/30 hover:shadow-md"
                  )}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    {selectedGalleryIndex === i && (
                      <div className="absolute inset-0 bg-brand/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-card">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-[10px] text-foreground-muted">{item.color}</p>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back to Try-On Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href="/tryon" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Clothing Virtual Try-On
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
