"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Badge from "@/components/ui/badge";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Fashion Designer, Milan",
    avatar: "SC",
    rating: 5,
    text: "StyleMind AI has completely transformed how I present designs to clients. The virtual try-on quality is remarkable — it's the closest thing to reality I've seen.",
  },
  {
    name: "Marcus Johnson",
    role: "E-commerce Director",
    avatar: "MJ",
    rating: 5,
    text: "We integrated StyleMind into our online store and saw a 40% increase in customer engagement. The AI stylist recommendations drive additional purchases naturally.",
  },
  {
    name: "Amira Hassan",
    role: "Personal Stylist",
    avatar: "AH",
    rating: 5,
    text: "The outfit scoring and color analysis features are incredibly accurate. My clients love seeing data-backed styling advice alongside the virtual try-on results.",
  },
  {
    name: "David Park",
    role: "Tech Lead, Fashion Startup",
    avatar: "DP",
    rating: 5,
    text: "The engineering quality behind StyleMind is impressive. Fast inference, clean API, and the AI pipeline produces results that rival dedicated research labs.",
  },
  {
    name: "Elena Rossi",
    role: "Fashion Influencer",
    avatar: "ER",
    rating: 5,
    text: "I use StyleMind daily to preview outfits before shoots. The wardrobe feature helps me plan capsule collections for content. An absolute game-changer.",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 200 : -200, opacity: 0 }),
  };

  return (
    <section className="py-24 lg:py-32 bg-background-secondary relative overflow-hidden">
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
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-[var(--font-plus-jakarta)]">
            Loved by{" "}
            <span className="gradient-text">Fashion Professionals</span>
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-3xl mx-auto relative">
          <div className="min-h-[280px] flex items-center">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="text-center px-4 sm:px-12">
                  <Quote className="h-10 w-10 text-brand/30 mx-auto mb-6" />

                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 mb-6">
                    {[...Array(testimonials[current].rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-amber-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-lg sm:text-xl text-foreground leading-relaxed italic mb-8">
                    &ldquo;{testimonials[current].text}&rdquo;
                  </p>

                  {/* Avatar + Info */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
                      {testimonials[current].avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">
                        {testimonials[current].name}
                      </div>
                      <div className="text-sm text-foreground-muted">
                        {testimonials[current].role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-border hover:bg-background-secondary transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    index === current
                      ? "bg-brand w-6"
                      : "bg-border hover:bg-foreground-muted"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-full border border-border hover:bg-background-secondary transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
