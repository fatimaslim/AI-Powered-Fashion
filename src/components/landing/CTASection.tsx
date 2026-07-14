"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 gradient-brand opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_70%)]" />
          
          {/* Floating elements */}
          <motion.div
            className="absolute w-40 h-40 rounded-full bg-white/10 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            style={{ top: "10%", right: "10%" }}
          />
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-white/5 blur-2xl"
            animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{ bottom: "10%", left: "15%" }}
          />

          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Sparkles className="h-10 w-10 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight font-[var(--font-plus-jakarta)] mb-4">
                Start Styling Smarter Today
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                Join thousands of fashion-forward users who trust AI to elevate their style.
                Free to start, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/tryon">
                  <Button
                    variant="secondary"
                    size="xl"
                    className="bg-white text-brand hover:bg-white/90 shadow-xl border-0"
                    icon={<Sparkles className="h-5 w-5" />}
                  >
                    Try It Free
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button
                    variant="ghost"
                    size="xl"
                    className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20"
                  >
                    Explore Features
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
