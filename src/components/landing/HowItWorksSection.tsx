"use client";

import { motion } from "framer-motion";
import { Upload, Sparkles, Wand2, ArrowRight } from "lucide-react";
import Badge from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    icon: <Upload className="h-7 w-7" />,
    title: "Upload Your Photo",
    description:
      "Upload a full-body photo of yourself. Our AI instantly detects your pose, body landmarks, and proportions using advanced computer vision.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    number: "02",
    icon: <Wand2 className="h-7 w-7" />,
    title: "Choose Your Clothing",
    description:
      "Select any clothing item — from your wardrobe uploads, our gallery, or any fashion image. Our model handles flat-lay and on-model photos.",
    color: "from-violet-500 to-purple-500",
  },
  {
    number: "03",
    icon: <Sparkles className="h-7 w-7" />,
    title: "AI Magic",
    description:
      "Our pipeline analyzes pose, segments the garment, estimates fit, applies realistic textures and shadows, then generates your photorealistic try-on.",
    color: "from-rose-500 to-pink-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-background-secondary relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgb(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <Badge variant="outline" className="mb-4 px-3 py-1">
            How It Works
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-[var(--font-plus-jakarta)]">
            Three Steps to Your{" "}
            <span className="gradient-text">Perfect Look</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted">
            From upload to AI-generated try-on in seconds. No complex setup required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-rose-500/30" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center group"
            >
              {/* Step number circle */}
              <div className="relative inline-flex mb-6">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-card border-2 border-border flex items-center justify-center text-xs font-bold text-foreground">
                  {step.number}
                </div>
              </div>

              {/* Arrow between steps (mobile) */}
              {index < steps.length - 1 && (
                <div className="lg:hidden flex justify-center my-4">
                  <ArrowRight className="h-5 w-5 text-foreground-muted rotate-90" />
                </div>
              )}

              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-foreground-muted leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
