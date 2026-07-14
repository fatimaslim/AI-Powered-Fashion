"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShirtIcon,
  Plus,
  Upload,
  Search,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { staggerContainer, staggerItem } from "@/lib/utils";

const categories = ["All", "Tops", "Bottoms", "Dresses", "Shoes", "Accessories"];

const wardrobeItems = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: [
    "Navy Blazer", "White Tee", "Dark Jeans", "Floral Dress",
    "Leather Sneakers", "Silk Scarf", "Linen Shirt", "Chinos",
    "Cocktail Dress", "Oxford Shoes", "Watch", "Tote Bag",
  ][i],
  category: ["Tops", "Tops", "Bottoms", "Dresses", "Shoes", "Accessories",
    "Tops", "Bottoms", "Dresses", "Shoes", "Accessories", "Accessories"][i],
  timesWorn: Math.floor(Math.random() * 20) + 1,
}));

export default function WardrobePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = selectedCategory === "All"
    ? wardrobeItems
    : wardrobeItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-plus-jakarta)]">
              My <span className="gradient-text">Wardrobe</span>
            </h1>
            <p className="text-foreground-muted text-sm mt-1">
              {wardrobeItems.length} items · Manage your digital closet
            </p>
          </div>
          <Button icon={<Plus className="h-4 w-4" />}>Add Item</Button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search wardrobe..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
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

      {/* Wardrobe Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        {/* Add new item card */}
        <motion.div variants={staggerItem}>
          <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border-dashed border-2 border-border">
            <CardContent className="p-3">
              <div className="aspect-square rounded-xl bg-background-secondary flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-brand" />
                </div>
                <p className="text-xs font-medium text-foreground-muted">Add Item</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {filtered.map((item) => (
          <motion.div key={item.id} variants={staggerItem}>
            <Card className="group hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="p-3">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-brand/5 to-brand-secondary/5 border border-border/50 flex items-center justify-center mb-2 relative overflow-hidden">
                  <ShirtIcon className="h-8 w-8 text-brand/20" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" variant="glass" className="bg-white/90 text-gray-900 text-xs border-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Try On
                    </Button>
                  </div>
                </div>
                <h3 className="font-medium text-xs truncate">{item.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="outline" className="text-[9px] px-1.5">{item.category}</Badge>
                  <span className="text-[10px] text-foreground-muted">{item.timesWorn}× worn</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
