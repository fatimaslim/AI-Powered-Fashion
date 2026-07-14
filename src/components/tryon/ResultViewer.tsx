"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  Download,
  Heart,
  ChevronLeft,
  ChevronRight,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResultViewerProps {
  results: string[];
  currentIndex: number;
  modelPreview: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onFavorite?: (index: number) => void;
  onGenerateAnother?: () => void;
  favorites?: Set<number>;
}

export default function ResultViewer({
  results,
  currentIndex,
  modelPreview,
  isOpen,
  onClose,
  onNavigate,
  onFavorite,
  onGenerateAnother,
  favorites = new Set(),
}: ResultViewerProps) {
  const [showCompare, setShowCompare] = useState(false);
  const [zoom, setZoom] = useState(1);

  if (!isOpen || results.length === 0) return null;

  const handleDownload = async () => {
    const url = results[currentIndex];
    const a = document.createElement("a");
    a.href = url;
    a.download = `stylemind-result-${currentIndex + 1}.png`;
    a.target = "_blank";
    a.click();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(results[currentIndex]);
    } catch {
      // Fallback
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleZoomReset = () => setZoom(1);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <X className="h-6 w-6" />
        </motion.button>

        {/* Counter */}
        <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} of {results.length}
          {results.length > 1 && (
            <span className="text-xs ml-2 opacity-60">← → to navigate</span>
          )}
        </div>

        {/* Top controls bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {/* Compare toggle */}
          {modelPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCompare(!showCompare);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer",
                showCompare
                  ? "bg-brand text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Before / After
            </button>
          )}

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white cursor-pointer transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs text-white/60 w-10 text-center font-mono">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white cursor-pointer transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            {zoom !== 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomReset();
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white cursor-pointer transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Previous */}
        {currentIndex > 0 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex - 1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>
        )}

        {/* Next */}
        {currentIndex < results.length - 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex + 1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>
        )}

        {/* Main image area */}
        <motion.div
          key={`${currentIndex}-${showCompare}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="p-4 max-w-3xl w-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          style={{ transform: `scale(${zoom})` }}
        >
          {showCompare && modelPreview ? (
            <div className="w-full max-h-[80vh] rounded-lg overflow-hidden">
              <ReactCompareSlider
                itemOne={
                  <ReactCompareSliderImage
                    src={modelPreview}
                    alt="Before — Original"
                    style={{ objectFit: "contain" }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={results[currentIndex]}
                    alt="After — AI Try-On"
                    style={{ objectFit: "contain" }}
                  />
                }
                style={{
                  maxHeight: "80vh",
                  borderRadius: "0.5rem",
                }}
              />
              <div className="flex items-center justify-between mt-3 px-2">
                <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
                  ← Before
                </span>
                <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
                  After →
                </span>
              </div>
            </div>
          ) : (
            <Image
              src={results[currentIndex]}
              alt={`Result ${currentIndex + 1}`}
              width={600}
              height={800}
              className="max-h-[80vh] w-auto object-contain rounded-lg"
              unoptimized
            />
          )}
        </motion.div>

        {/* Bottom actions */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
          <Button
            variant="glass"
            size="sm"
            icon={<Download className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="bg-white/10 text-white hover:bg-white/20 border-white/20"
          >
            Download
          </Button>
          <Button
            variant="glass"
            size="sm"
            icon={<Share2 className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="bg-white/10 text-white hover:bg-white/20 border-white/20"
          >
            Share
          </Button>
          {onFavorite && (
            <Button
              variant="glass"
              size="sm"
              icon={
                <Heart
                  className={cn("h-4 w-4", favorites.has(currentIndex) && "fill-accent text-accent")}
                />
              }
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(currentIndex);
              }}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              Favorite
            </Button>
          )}
          {onGenerateAnother && (
            <Button
              variant="glass"
              size="sm"
              icon={<Sparkles className="h-4 w-4" />}
              onClick={(e) => {
                e.stopPropagation();
                onGenerateAnother();
              }}
              className="bg-brand/80 text-white hover:bg-brand border-brand/50"
            >
              Generate Another
            </Button>
          )}
        </div>

        {/* Dots */}
        {results.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {results.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(idx);
                }}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all cursor-pointer",
                  idx === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
