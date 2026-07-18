"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Settings,
  RefreshCw,
  ArrowLeft,
  Zap,
  ChevronDown,
  Key,
  Brain,
  Trophy,
  Shirt,
} from "lucide-react";
import pica from "pica";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ImageUploader from "@/components/tryon/ImageUploader";
import LoadingExperience from "@/components/tryon/LoadingExperience";
import ResultViewer from "@/components/tryon/ResultViewer";
import StylistPanel from "@/components/tryon/StylistPanel";
import OutfitScorePanel from "@/components/tryon/OutfitScorePanel";
import OutfitRecommendation from "@/components/tryon/OutfitRecommendation";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { cn, generateId } from "@/lib/utils";
import { useTryOnStore, type TryOnResult } from "@/store/tryon-store";

const CATEGORY_API_MAP: Record<string, string> = {
  Auto: "auto",
  Top: "tops",
  Bottom: "bottoms",
  "Full-body": "one-pieces",
};

const MODEL_EXAMPLES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
];

const GARMENT_EXAMPLES = [
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?q=80&w=1000&auto=format&fit=crop",
];

const MAX_IMAGE_HEIGHT = 1024;
const JPEG_QUALITY = 0.85;

const modeOptions = [
  { value: "Performance", label: "Fast", desc: "~7s" },
  { value: "Balanced", label: "Balanced", desc: "~9s" },
  { value: "Quality", label: "Quality", desc: "~13s" },
];

const categoryOptions = ["Auto", "Top", "Bottom", "Full-body"];
const photoTypeOptions = ["Auto", "Flat-Lay", "Model"];

type AnalysisTab = "score" | "stylist" | "outfit";

export default function TryOnPage() {
  const store = useTryOnStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(store.apiKey);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<AnalysisTab>("score");

  // Loading stage animation
  useEffect(() => {
    if (!store.isLoading) return;
    store.resetLoadingStages();
    const interval = setInterval(() => {
      store.advanceLoadingStage();
    }, 4000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.isLoading]);

  // Fetch AI analysis when results arrive
  useEffect(() => {
    if (store.results.length === 0 || store.stylistAnalysis || store.isAnalyzing) return;

    const fetchAnalysis = async () => {
      store.setIsAnalyzing(true);
      try {
        const [stylistRes, scoreRes] = await Promise.all([
          fetch("/api/ai/stylist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resultUrl: store.results[0]?.url }),
          }),
          fetch("/api/ai/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resultUrl: store.results[0]?.url }),
          }),
        ]);

        if (stylistRes.ok) {
          const data = await stylistRes.json();
          store.setStylistAnalysis(data);
        }
        if (scoreRes.ok) {
          const data = await scoreRes.json();
          store.setOutfitScores(data);
        }
      } catch {
        // Silent fail for AI analysis — non-critical
      } finally {
        store.setIsAnalyzing(false);
      }
    };

    fetchAnalysis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.results]);

  // Image preprocessing
  const resizeImage = async (file: File): Promise<File> => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Image load timeout")), 10000);
      img.onload = () => {
        clearTimeout(timeout);
        resolve(null);
      };
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error("Failed to load image"));
      };
      img.src = url;
    });
    const { width, height } = img;
    if (width <= MAX_IMAGE_HEIGHT && height <= MAX_IMAGE_HEIGHT) {
      URL.revokeObjectURL(url);
      return file;
    }
    const aspect = width / height;
    let nw: number, nh: number;
    if (width > height) {
      nw = MAX_IMAGE_HEIGHT;
      nh = Math.round(MAX_IMAGE_HEIGHT / aspect);
    } else {
      nh = MAX_IMAGE_HEIGHT;
      nw = Math.round(MAX_IMAGE_HEIGHT * aspect);
    }
    const src = document.createElement("canvas");
    src.width = width;
    src.height = height;
    src.getContext("2d")?.drawImage(img, 0, 0);
    const tgt = document.createElement("canvas");
    tgt.width = nw;
    tgt.height = nh;
    const p = pica();
    await p.resize(src, tgt);
    const blob = await p.toBlob(tgt, file.type || "image/png", JPEG_QUALITY);
    URL.revokeObjectURL(url);
    return new File([blob], file.name, { type: blob.type });
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!store.modelImageFile || !store.garmentImageFile) {
      store.setError("Please select both a model and a garment image.");
      return;
    }

    store.setIsLoading(true);
    store.setError(null);
    // Clear previous analysis so it re-fetches
    store.setStylistAnalysis(null);
    store.setOutfitScores(null);

    try {
      let modelB64: string, garmentB64: string;
      try {
        const rm = await resizeImage(store.modelImageFile);
        const rg = await resizeImage(store.garmentImageFile);
        modelB64 = await fileToBase64(rm);
        garmentB64 = await fileToBase64(rg);
      } catch {
        modelB64 = await fileToBase64(store.modelImageFile);
        garmentB64 = await fileToBase64(store.garmentImageFile);
      }

      const response = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_image: modelB64,
          garment_image: garmentB64,
          garment_photo_type: store.settings.garmentPhotoType.toLowerCase(),
          category: CATEGORY_API_MAP[store.settings.category],
          mode: store.settings.mode.toLowerCase(),
          segmentation_free: store.settings.segmentationFree,
          seed: store.settings.seed,
          num_samples: store.settings.numSamples,
          api_key: store.apiKey,
          model_name: store.settings.modelVersion,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.requiresApiKey) setShowApiKeyInput(true);
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      setIsDemoMode(!!data.isDemo);

      let finalOutput: string[] = [];

      if (data.id) {
        // Poll for completion
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        let isDone = false;
        
        for (let i = 0; i < 150; i++) {
          const statusRes = await fetch(`/api/tryon/status?id=${data.id}&t=${Date.now()}`, { 
            cache: 'no-store',
            headers: store.apiKey ? { 'x-api-key': store.apiKey } : undefined
          });
          const statusData = await statusRes.json();
          
          if (!statusRes.ok) {
            throw new Error(statusData.error || "Failed to check status");
          }

          if (statusData.status === "completed") {
            finalOutput = statusData.output || [];
            isDone = true;
            break;
          } else if (statusData.status === "failed") {
            const errorMsg = typeof statusData.error === 'object' && statusData.error ? statusData.error.message : statusData.error;
            throw new Error(errorMsg || "Generation failed");
          }
          
          await delay(2000);
        }

        if (!isDone) {
          throw new Error("Generation timed out");
        }
      } else {
        // Demo mode immediately returns output
        finalOutput = data.output || [];
      }

      const results: TryOnResult[] = finalOutput.map((url: string) => ({
        id: generateId(),
        url,
        modelImagePreview: store.modelImagePreview || "",
        garmentImagePreview: store.garmentImagePreview || "",
        timestamp: Date.now(),
        isFavorite: false,
      }));

      store.setResults(results);
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      store.setIsLoading(false);
    }
  };

  const handleGenerateAnother = () => {
    store.updateSettings({ seed: Math.floor(Math.random() * 1000000) });
    store.setIsResultsModalOpen(false);
    // Re-trigger form submission
    const form = document.querySelector("form");
    if (form) {
      form.requestSubmit();
    }
  };

  const resultUrls = store.results.map((r) => r.url);
  const hasResults = store.results.length > 0;
  const hasAnalysis = store.stylistAnalysis || store.outfitScores;

  const analysisTabs: { key: AnalysisTab; label: string; icon: React.ElementType }[] = [
    { key: "score", label: "Score", icon: Trophy },
    { key: "stylist", label: "Stylist", icon: Brain },
    { key: "outfit", label: "Outfit", icon: Shirt },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-plus-jakarta)]">
                    Virtual <span className="gradient-text">Try-On</span>
                  </h1>
                  {isDemoMode && (
                    <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-500 bg-amber-500/10">
                      🎭 Demo Mode
                    </Badge>
                  )}
                </div>
                <p className="text-foreground-muted mt-1">
                  Upload your photo and a clothing item to see AI-powered results
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Key className="h-4 w-4" />}
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                >
                  API Key
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<RefreshCw className="h-4 w-4" />}
                  onClick={store.reset}
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Hijab Studio Link */}
            <Link href="/hijab-studio" className="block mt-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-brand/5 to-brand-secondary/5 border border-brand/20 hover:border-brand/40 transition-all cursor-pointer group">
                <span className="text-xl">🧕</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Looking for Hijab Try-On?</p>
                  <p className="text-xs text-foreground-muted">Visit our AI Hijab Studio →</p>
                </div>
                <ArrowLeft className="h-4 w-4 text-foreground-muted rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* API Key Input */}
          <AnimatePresence>
            {showApiKeyInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <Card className="border-brand/30 bg-brand/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-brand flex-shrink-0" />
                      <input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="Enter your FASHN API key..."
                        className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          store.setApiKey(tempApiKey);
                          setShowApiKeyInput(false);
                        }}
                      >
                        Save
                      </Button>
                    </div>
                    <p className="text-xs text-foreground-muted mt-2 ml-8">
                      Get your API key from{" "}
                      <a
                        href="https://app.fashn.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand underline"
                      >
                        app.fashn.ai
                      </a>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Uploads */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <ImageUploader
                  preview={store.modelImagePreview}
                  onFileSelect={(file, preview) => store.setModelImage(file, preview)}
                  onClear={() => store.setModelImage(null, null)}
                  label="Your Photo"
                  icon="person"
                  examples={MODEL_EXAMPLES}
                />
                <ImageUploader
                  preview={store.garmentImagePreview}
                  onFileSelect={(file, preview) => store.setGarmentImage(file, preview)}
                  onClear={() => store.setGarmentImage(null, null)}
                  label="Clothing Item"
                  icon="garment"
                  examples={GARMENT_EXAMPLES}
                />
              </div>

              {/* Middle: Controls */}
              <div className="lg:col-span-3 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Settings className="h-4 w-4 text-brand" />
                      Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Mode selector */}
                    <div>
                      <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2 block">
                        Quality Mode
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {modeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => store.updateSettings({ mode: opt.value })}
                            className={cn(
                              "py-2 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-center",
                              store.settings.mode === opt.value
                                ? "gradient-brand text-white shadow-md"
                                : "bg-background-secondary text-foreground-muted hover:text-foreground"
                            )}
                          >
                            <div>{opt.label}</div>
                            <div className="text-[10px] opacity-70">{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2 block">
                        Category
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {categoryOptions.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => store.updateSettings({ category: cat })}
                            className={cn(
                              "py-2 rounded-lg text-xs font-medium transition-all cursor-pointer",
                              store.settings.category === cat
                                ? "bg-brand/10 text-brand border border-brand/30"
                                : "bg-background-secondary text-foreground-muted hover:text-foreground border border-transparent"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Photo Type */}
                    <div>
                      <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2 block">
                        Photo Type
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {photoTypeOptions.map((pt) => (
                          <button
                            key={pt}
                            type="button"
                            onClick={() => store.updateSettings({ garmentPhotoType: pt })}
                            className={cn(
                              "py-2 rounded-lg text-xs font-medium transition-all cursor-pointer",
                              store.settings.garmentPhotoType === pt
                                ? "bg-brand/10 text-brand border border-brand/30"
                                : "bg-background-secondary text-foreground-muted hover:text-foreground border border-transparent"
                            )}
                          >
                            {pt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Advanced toggle */}
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full flex items-center justify-center gap-1 text-xs text-foreground-muted hover:text-foreground transition-colors cursor-pointer py-1"
                    >
                      Advanced
                      <ChevronDown className={cn("h-3 w-3 transition-transform", showAdvanced && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-3 overflow-hidden"
                        >
                          {/* Samples */}
                          <div>
                            <label className="text-xs font-medium text-foreground-muted mb-1 block">
                              Samples: {store.settings.numSamples}
                            </label>
                            <input
                              type="range"
                              min={1}
                              max={4}
                              value={store.settings.numSamples}
                              onChange={(e) => store.updateSettings({ numSamples: Number(e.target.value) })}
                              className="w-full accent-brand"
                            />
                          </div>

                          {/* Seed */}
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={store.settings.seed}
                              onChange={(e) => store.updateSettings({ seed: Number(e.target.value) || 0 })}
                              className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand/30"
                              placeholder="Seed"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                store.updateSettings({ seed: Math.floor(Math.random() * 1000000) })
                              }
                              className="px-3 py-1.5 bg-background-secondary rounded-lg text-xs hover:bg-border transition-colors cursor-pointer"
                            >
                              🎲
                            </button>
                          </div>

                          {/* Segmentation Free */}
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={store.settings.segmentationFree}
                              onChange={(e) =>
                                store.updateSettings({ segmentationFree: e.target.checked })
                              }
                              className="rounded accent-brand"
                            />
                            <span className="text-xs text-foreground-muted">Segmentation Free</span>
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Generate Button */}
                    <Button
                      type="submit"
                      disabled={store.isLoading || !store.modelImageFile || !store.garmentImageFile}
                      loading={store.isLoading}
                      className="w-full"
                      size="lg"
                      icon={<Sparkles className="h-5 w-5" />}
                    >
                      {store.isLoading ? "Generating..." : "Generate Try-On"}
                    </Button>

                    {/* Error */}
                    {store.error && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-error/10 border border-error/20 text-sm text-error"
                      >
                        {store.error}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right: Results */}
              <div className="lg:col-span-4">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-brand" />
                      Results
                      {store.isAnalyzing && (
                        <Badge variant="brand" className="text-[10px] animate-pulse">
                          Analyzing...
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="wait">
                      {store.isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <LoadingExperience
                            stages={store.loadingStages}
                            currentStage={store.currentLoadingStage}
                          />
                        </motion.div>
                      ) : store.results.length > 0 ? (
                        <motion.div
                          key="results"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="grid grid-cols-2 gap-3"
                        >
                          {store.results.map((result, index) => (
                            <motion.div
                              key={result.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative group cursor-pointer"
                              onClick={() => {
                                store.setCurrentResultIndex(index);
                                store.setIsResultsModalOpen(true);
                              }}
                            >
                              <div className="aspect-[3/4] rounded-xl border border-border overflow-hidden bg-background-secondary">
                                <Image
                                  src={result.url}
                                  alt={`Result ${index + 1}`}
                                  fill
                                  className="object-contain p-1"
                                  unoptimized
                                />
                              </div>
                              <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="bg-white/90 text-gray-900 rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1.5">
                                  <Zap className="h-3 w-3" />
                                  View Full Size
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="aspect-[3/4] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-center p-6"
                        >
                          <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-brand/20">
                            <Sparkles className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              AI results will appear here
                            </p>
                            <p className="text-xs text-foreground-muted mt-1">
                              Upload both images and click Generate
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>

          {/* AI Analysis Section — appears after generation */}
          <AnimatePresence>
            {hasResults && hasAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10"
              >
                {/* Section header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-[var(--font-plus-jakarta)]">
                      AI <span className="gradient-text">Analysis</span>
                    </h2>
                    <p className="text-foreground-muted text-sm mt-0.5">
                      Computer vision & deep learning insights for your outfit
                    </p>
                  </div>
                  {/* Tab switcher */}
                  <div className="flex gap-1 bg-background-secondary rounded-xl p-1">
                    {analysisTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveAnalysisTab(tab.key)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer",
                            activeAnalysisTab === tab.key
                              ? "gradient-brand text-white shadow-md"
                              : "text-foreground-muted hover:text-foreground"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {activeAnalysisTab === "score" && store.outfitScores && (
                    <motion.div
                      key="score"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <OutfitScorePanel scores={store.outfitScores} />
                    </motion.div>
                  )}
                  {activeAnalysisTab === "stylist" && store.stylistAnalysis && (
                    <motion.div
                      key="stylist"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <StylistPanel analysis={store.stylistAnalysis} />
                    </motion.div>
                  )}
                  {activeAnalysisTab === "outfit" && (
                    <motion.div
                      key="outfit"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <OutfitRecommendation />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Fullscreen result viewer */}
      <ResultViewer
        results={resultUrls}
        currentIndex={store.currentResultIndex}
        modelPreview={store.modelImagePreview}
        isOpen={store.isResultsModalOpen}
        onClose={() => store.setIsResultsModalOpen(false)}
        onNavigate={(i) => store.setCurrentResultIndex(i)}
        onGenerateAnother={handleGenerateAnother}
      />

      <Footer />
    </>
  );
}
