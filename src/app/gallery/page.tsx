"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Heart, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Badge from "@/components/ui/badge";
import { staggerContainer, staggerItem } from "@/lib/utils";

const galleryCategories = ["All", "Casual", "Business", "Evening", "Summer", "Winter", "Wedding"];

const galleryItems = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  category: galleryCategories[1 + (i % (galleryCategories.length - 1))],
  score: Math.floor(Math.random() * 15) + 82,
  likes: Math.floor(Math.random() * 200) + 50,
  height: [280, 320, 360, 300, 340, 260][i % 6], // For masonry
}));

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  const filtered = selectedCategory === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  const toggleLike = (id: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
            <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-plus-jakarta)]">
              Style <span className="gradient-text">Gallery</span>
            </h1>
            <p className="text-foreground-muted mt-1">
              Browse AI-generated looks for inspiration. Filter by occasion and style.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search styles..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "gradient-brand text-white shadow-sm"
                      : "bg-background-secondary text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4"
          >
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                variants={staggerItem}
                className="break-inside-avoid group cursor-pointer"
              >
                <div
                  className="relative rounded-2xl border border-border overflow-hidden bg-gradient-to-br from-brand/5 to-brand-secondary/5 hover:shadow-xl transition-all duration-300"
                  style={{ height: item.height }}
                >
                  {/* Placeholder for gallery image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-brand/15" />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px]">
                          {item.category}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-white/10 text-white border-0 text-[10px]">
                            Score: {item.score}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Like button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedItems.has(item.id)
                          ? "text-accent fill-accent"
                          : "text-white"
                      }`}
                    />
                  </button>

                  {/* Like count */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 text-xs text-white/80 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                      <Heart className="h-3 w-3" />
                      {item.likes + (likedItems.has(item.id) ? 1 : 0)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
