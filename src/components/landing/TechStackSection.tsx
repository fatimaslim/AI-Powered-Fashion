"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/utils";
import Badge from "@/components/ui/badge";
import {
  Eye,
  Brain,
  Activity,
  Cpu,
  Layers,
  Zap,
} from "lucide-react";

const technologies = [
  {
    icon: <Eye className="h-8 w-8" />,
    title: "Computer Vision",
    description: "Pose estimation, body landmark detection, and garment segmentation using deep neural networks.",
    tags: ["OpenCV", "Pose Detection", "Segmentation"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Deep Learning",
    description: "State-of-the-art generative models for photorealistic virtual try-on with natural lighting and textures.",
    tags: ["PyTorch", "Diffusion Models", "GANs"],
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: <Activity className="h-8 w-8" />,
    title: "Pose Estimation",
    description: "Real-time human pose analysis for accurate garment placement, accounting for body shape and posture.",
    tags: ["YOLO", "Keypoint Detection", "SLAM"],
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "AI Reasoning",
    description: "Large language models analyze outfits for style, color harmony, and occasion suitability with expert-level recommendations.",
    tags: ["LLMs", "Fashion AI", "NLP"],
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: <Layers className="h-8 w-8" />,
    title: "3D Understanding",
    description: "3D body reconstruction enables accurate fit prediction and realistic draping simulation across garment types.",
    tags: ["3D Reconstruction", "Mesh", "Depth"],
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Edge Optimization",
    description: "Optimized inference pipeline for near-instant results. Client-side preprocessing with server-side GPU acceleration.",
    tags: ["FastAPI", "GPU Inference", "Optimization"],
    color: "from-indigo-500 to-blue-500",
  },
];

export default function TechStackSection() {
  return (
    <section id="technology" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4 px-3 py-1">
            Technology
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-[var(--font-plus-jakarta)]">
            Powered by{" "}
            <span className="gradient-text">Advanced AI</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted">
            Built on cutting-edge research in computer vision, deep learning, and artificial intelligence.
          </p>
        </motion.div>

        {/* Tech Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.title}
              variants={staggerItem}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />

              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${tech.color} text-white shadow-lg mb-5`}
              >
                {tech.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold mb-2">{tech.title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed mb-4">
                {tech.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tech.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-background-secondary text-foreground-muted font-medium border border-border/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
