"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/utils";
import Badge from "@/components/ui/badge";
import {
  Sparkles,
  Palette,
  Star,
  ShirtIcon,
  MessageSquare,
  LayoutGrid,
} from "lucide-react";

const features = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Virtual Try-On",
    description:
      "Upload your photo and any clothing item. Our AI generates photorealistic try-on results using state-of-the-art diffusion models.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "AI Stylist",
    description:
      "Get personalized styling advice powered by LLMs. Color analysis, body type recommendations, occasion-based outfits, and accessory pairings.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Outfit Scoring",
    description:
      "AI evaluates your outfit across 6 dimensions: color harmony, style match, fit quality, professionalism, fashion score, and overall confidence.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: <ShirtIcon className="h-6 w-6" />,
    title: "Smart Wardrobe",
    description:
      "Digitize your wardrobe, create capsule collections, and let AI suggest outfit combinations you haven't tried.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Fashion Chat",
    description:
      "Chat with an AI fashion assistant. Ask about trends, get outfit ideas for any event, or discover what colors match your skin tone.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: <LayoutGrid className="h-6 w-6" />,
    title: "Style Gallery",
    description:
      "Browse AI-generated looks for inspiration. Filter by occasion, style, season, and more. Save favorites to your collection.",
    gradient: "from-sky-500 to-blue-500",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4 px-3 py-1">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-[var(--font-plus-jakarta)]">
            Everything You Need for{" "}
            <span className="gradient-text">Intelligent Fashion</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted">
            A complete AI-powered fashion platform combining computer vision, deep learning,
            and natural language processing.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-4`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">
                {feature.description}
              </p>

              {/* Hover gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/10 to-brand-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
