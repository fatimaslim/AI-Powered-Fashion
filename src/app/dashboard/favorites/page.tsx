"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, FolderPlus, Grid3X3, List, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { staggerContainer, staggerItem } from "@/lib/utils";

const collections = [
  { id: 1, name: "Summer Outfits", count: 5, color: "from-amber-500 to-orange-500" },
  { id: 2, name: "Work Attire", count: 3, color: "from-blue-500 to-indigo-500" },
  { id: 3, name: "Evening Looks", count: 4, color: "from-violet-500 to-purple-500" },
  { id: 4, name: "Casual Weekend", count: 6, color: "from-emerald-500 to-teal-500" },
];

const favoriteItems = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  score: Math.floor(Math.random() * 15) + 82,
  date: `July ${13 - Math.floor(i / 2)}, 2026`,
  collection: collections[i % collections.length].name,
}));

export default function FavoritesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-[var(--font-plus-jakarta)]">
          My <span className="gradient-text">Favorites</span>
        </h1>
        <p className="text-foreground-muted text-sm mt-1">
          Your saved outfits organized in collections.
        </p>
      </motion.div>

      {/* Collections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Collections</h2>
          <Button variant="outline" size="sm" icon={<FolderPlus className="h-4 w-4" />}>
            New Collection
          </Button>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {collections.map((col) => (
            <motion.div key={col.id} variants={staggerItem}>
              <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${col.color} flex items-center justify-center text-white mb-3`}>
                    <Heart className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm">{col.name}</h3>
                  <p className="text-xs text-foreground-muted mt-1">{col.count} outfits</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* All Favorites */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">All Favorites ({favoriteItems.length})</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${view === "grid" ? "bg-brand/10 text-brand" : "text-foreground-muted hover:text-foreground"}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${view === "list" ? "bg-brand/10 text-brand" : "text-foreground-muted hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}
        >
          {favoriteItems.map((item) => (
            <motion.div key={item.id} variants={staggerItem}>
              <Card className="hover:shadow-md transition-shadow group cursor-pointer">
                <CardContent className={view === "grid" ? "p-3" : "p-4"}>
                  {view === "grid" ? (
                    <div>
                      <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-brand/5 to-brand-secondary/5 border border-border/50 flex items-center justify-center mb-3 relative overflow-hidden">
                        <Sparkles className="h-8 w-8 text-brand/30" />
                        <div className="absolute top-2 right-2">
                          <Heart className="h-4 w-4 text-accent fill-accent" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-foreground-muted">{item.date}</p>
                        <Badge variant={item.score >= 90 ? "success" : "default"} className="text-[10px]">
                          {item.score}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Favorite #{item.id}</p>
                          <p className="text-xs text-foreground-muted">{item.date} · {item.collection}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.score >= 90 ? "success" : "default"}>Score: {item.score}</Badge>
                        <Heart className="h-4 w-4 text-accent fill-accent" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
