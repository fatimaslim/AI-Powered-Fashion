"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Animated floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-brand/10 blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-brand-secondary/10 blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ top: "30%", right: "5%" }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-accent/8 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ bottom: "15%", left: "30%" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm gap-2">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              Powered by Computer Vision & Deep Learning
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] font-[var(--font-plus-jakarta)]"
          >
            Your{" "}
            <span className="gradient-text">AI Fashion</span>
            <br />
            Intelligence Platform
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed"
          >
            Experience virtual try-on powered by state-of-the-art computer vision.
            Get AI styling recommendations, outfit scoring, and build your perfect wardrobe
            — all in one intelligent platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/tryon">
              <Button size="xl" icon={<Sparkles className="h-5 w-5" />}>
                Clothing Try-On
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/hijab-studio">
              <Button variant="outline" size="xl" className="border-brand/30 bg-brand/5 hover:bg-brand/10">
                <span className="text-lg mr-2">🧕</span>
                AI Hijab Studio
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-foreground-muted"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              No Credit Card Required
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              Instant Results
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              AI-Powered Analysis
            </div>
          </motion.div>
        </div>

        {/* Hero visual - Floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-brand/10">
            {/* Browser chrome mockup */}
            <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-error/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background-secondary rounded-lg px-4 py-1 text-xs text-foreground-muted font-mono">
                  stylemind.ai/tryon
                </div>
              </div>
            </div>

            {/* App preview */}
            <div className="bg-gradient-to-br from-background to-background-secondary p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Upload card mock */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                    Your Photo
                  </div>
                  <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-brand/5 to-brand-secondary/5 border border-border/50 flex items-center justify-center">
                    <div className="text-center space-y-2 p-4">
                      <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-xs text-foreground-muted">Upload or drag your photo</p>
                    </div>
                  </div>
                </div>

                {/* Garment card mock */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                    Clothing Item
                  </div>
                  <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-brand-secondary/5 to-accent/5 border border-border/50 flex items-center justify-center">
                    <div className="text-center space-y-2 p-4">
                      <div className="w-12 h-12 rounded-full bg-brand-secondary/10 flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l3.5 2L12 3l3.5 2L19 3v13a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" />
                        </svg>
                      </div>
                      <p className="text-xs text-foreground-muted">Choose your garment</p>
                    </div>
                  </div>
                </div>

                {/* Result card mock */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-foreground-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-brand" />
                    AI Result
                  </div>
                  <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-brand/10 to-brand-secondary/10 border border-brand/20 flex items-center justify-center relative overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                    <div className="text-center space-y-2 p-4">
                      <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center mx-auto shadow-lg shadow-brand/30">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-xs text-foreground-muted">AI-generated try-on</p>
                      <div className="flex items-center gap-1 justify-center">
                        <div className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                          Score: 94/100
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow effect behind */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-brand/20 via-brand-secondary/20 to-accent/20 blur-3xl -z-10 opacity-60" />
        </motion.div>
      </div>
    </section>
  );
}
