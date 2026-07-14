"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Badge from "@/components/ui/badge";

const faqs = [
  {
    question: "How does the virtual try-on technology work?",
    answer:
      "StyleMind AI uses advanced computer vision and deep learning models to analyze your body pose, segment the clothing item, and generate a photorealistic composition. The pipeline includes pose estimation, garment warping, shadow generation, and texture blending — all powered by state-of-the-art diffusion models.",
  },
  {
    question: "What kind of photos work best?",
    answer:
      "For best results, use a clear full-body photo with good lighting. The person should be the main subject and fill most of the frame. A 2:3 aspect ratio works best. For garment images, flat-lay product photos or on-model images both work well.",
  },
  {
    question: "How accurate is the AI Stylist?",
    answer:
      "The AI Stylist combines fashion domain knowledge with advanced language models to provide personalized recommendations. It analyzes color harmony, body proportions, occasion appropriateness, and current trends. While AI recommendations are advisory, our users report high satisfaction with the suggestions.",
  },
  {
    question: "Can I use this for my e-commerce business?",
    answer:
      "Absolutely! Our Enterprise plan offers API access, white-label integration, bulk processing, and custom model training. Many fashion retailers use StyleMind to enhance their online shopping experience and reduce return rates.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Images are processed securely and not stored permanently unless you explicitly save them to your wardrobe. We don't use your images for training without consent. All data transmission is encrypted.",
  },
  {
    question: "What makes StyleMind different from other try-on tools?",
    answer:
      "StyleMind is a complete fashion intelligence platform — not just a try-on tool. We combine virtual try-on with AI styling analysis, outfit scoring, smart wardrobe management, and an AI fashion assistant. The entire pipeline is built with production-grade engineering and state-of-the-art AI models.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your Pro features will remain active until the end of your current billing period. You can always downgrade to the free tier.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-background-secondary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-3 py-1">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-[var(--font-plus-jakarta)]">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-background-secondary/50 transition-colors"
              >
                <span className="font-semibold text-sm sm:text-base pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-foreground-muted flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-foreground-muted leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
