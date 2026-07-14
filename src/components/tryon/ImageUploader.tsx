"use client";

import { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Upload, X, User, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  preview: string | null;
  onFileSelect: (file: File, preview: string) => void;
  onClear: () => void;
  label: string;
  icon: "person" | "garment";
  accept?: string;
  examples?: string[];
}

export default function ImageUploader({
  preview,
  onFileSelect,
  onClear,
  label,
  icon,
  accept = "image/*",
  examples = [],
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file, URL.createObjectURL(file));
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file, URL.createObjectURL(file));
      }
    },
    [onFileSelect]
  );

  const loadExample = useCallback(
    async (url: string) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const name = url.split("/").pop() || "example.jpg";
        const file = new File([blob], name, { type: blob.type });
        onFileSelect(file, URL.createObjectURL(file));
      } catch {
        console.error("Failed to load example");
      }
    },
    [onFileSelect]
  );

  const IconComponent = icon === "person" ? User : ImageIcon;

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <IconComponent className="h-4 w-4 text-brand" />
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            <div className="aspect-[3/4] rounded-2xl border border-border overflow-hidden bg-background-secondary">
              <Image
                src={preview}
                alt={label}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>

            {/* Overlay actions */}
            <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 bg-white/90 text-gray-900 rounded-full text-sm font-medium cursor-pointer hover:bg-white transition-colors mr-2"
              >
                Change
              </button>
            </div>

            {/* Remove button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClear}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full gradient-brand text-white flex items-center justify-center shadow-lg cursor-pointer"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Drop zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "aspect-[3/4] rounded-2xl border-2 border-dashed border-border cursor-pointer",
                "hover:border-brand/50 hover:bg-brand/5 transition-all duration-300",
                "flex flex-col items-center justify-center gap-3 p-6"
              )}
            >
              <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-brand" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Drop image here or click to browse
                </p>
                <p className="text-xs text-foreground-muted mt-1">
                  PNG, JPG, WebP up to 10MB
                </p>
              </div>
            </div>

            {/* Examples */}
            {examples.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-foreground-muted mb-2">Or try an example:</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {examples.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => loadExample(url)}
                      className="flex-shrink-0 w-14 h-14 rounded-lg border border-border overflow-hidden hover:border-brand/50 transition-colors cursor-pointer"
                    >
                      <Image
                        src={url}
                        alt={`Example ${i + 1}`}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
