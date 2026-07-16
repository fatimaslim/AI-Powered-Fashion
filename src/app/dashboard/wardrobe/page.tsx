"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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

const categories = ["All", "Tops", "Bottoms", "Dresses", "Shoes", "Hijabs", "Accessories"];

const wardrobeItems = [
  {
    id: 1,
    name: "Navy Blazer",
    brand: "Massimo Dutti",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=400&auto=format&fit=crop",
    timesWorn: 12,
  },
  {
    id: 2,
    name: "White Cotton T-Shirt",
    brand: "COS",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop",
    timesWorn: 18,
  },
  {
    id: 3,
    name: "Dark Wash Jeans",
    brand: "Levi's",
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&auto=format&fit=crop",
    timesWorn: 15,
  },
  {
    id: 4,
    name: "Floral Midi Dress",
    brand: "& Other Stories",
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=400&auto=format&fit=crop",
    timesWorn: 6,
  },
  {
    id: 5,
    name: "White Sneakers",
    brand: "Veja",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&auto=format&fit=crop",
    timesWorn: 20,
  },
  {
    id: 6,
    name: "Silk Chiffon Hijab",
    brand: "Haute Hijab",
    category: "Hijabs",
    image: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?q=80&w=400&auto=format&fit=crop",
    timesWorn: 10,
  },
  {
    id: 7,
    name: "Linen Button-Down",
    brand: "Uniqlo",
    category: "Tops",
    image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?q=80&w=400&auto=format&fit=crop",
    timesWorn: 14,
  },
  {
    id: 8,
    name: "Tailored Chinos",
    brand: "Arket",
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=400&auto=format&fit=crop",
    timesWorn: 11,
  },
  {
    id: 9,
    name: "Black Evening Dress",
    brand: "Zara",
    category: "Dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop",
    timesWorn: 4,
  },
  {
    id: 10,
    name: "Leather Ankle Boots",
    brand: "Dr. Martens",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=400&auto=format&fit=crop",
    timesWorn: 9,
  },
  {
    id: 11,
    name: "Jersey Hijab — Dusty Rose",
    brand: "Modanisa",
    category: "Hijabs",
    image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=400&auto=format&fit=crop",
    timesWorn: 16,
  },
  {
    id: 12,
    name: "Leather Tote Bag",
    brand: "Polène",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=400&auto=format&fit=crop",
    timesWorn: 8,
  },
];

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
                <div className="aspect-square rounded-xl border border-border/50 relative overflow-hidden bg-background-secondary mb-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" variant="glass" className="bg-white/90 text-gray-900 text-xs border-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Try On
                    </Button>
                  </div>
                </div>
                <h3 className="font-medium text-xs truncate">{item.name}</h3>
                <p className="text-[10px] text-foreground-muted truncate">{item.brand}</p>
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
