"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/utils";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out AI fashion features.",
    features: [
      "5 virtual try-ons per month",
      "Basic AI styling tips",
      "Standard quality mode",
      "1 saved outfit",
      "Community gallery access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For fashion enthusiasts and professionals.",
    features: [
      "Unlimited virtual try-ons",
      "Full AI Stylist analysis",
      "Outfit scoring (6 dimensions)",
      "AI Fashion Chat (unlimited)",
      "Virtual wardrobe (100 items)",
      "Quality mode access",
      "Priority generation",
      "Export & share results",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For brands, retailers, and e-commerce platforms.",
    features: [
      "Everything in Pro",
      "API access",
      "Custom model training",
      "White-label integration",
      "Bulk processing",
      "Dedicated support",
      "SLA guarantee",
      "Analytics dashboard",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Badge variant="outline" className="mb-4 px-3 py-1">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-[var(--font-plus-jakarta)]">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted">
            Start free. Upgrade when you need more power.
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-foreground-muted"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer ${annual ? "bg-brand" : "bg-border"}`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${annual ? "translate-x-8" : "translate-x-1"}`}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-foreground-muted"}`}>
            Annual <span className="text-success text-xs font-bold">(-20%)</span>
          </span>
        </div>

        {/* Plans */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={staggerItem}
              className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                plan.popular
                  ? "border-brand bg-gradient-to-b from-brand/5 to-transparent shadow-xl shadow-brand/10 scale-[1.02] lg:scale-105"
                  : "border-border bg-card hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="brand" className="px-3 py-1 gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-foreground-muted mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">
                    {plan.price === "Custom"
                      ? "Custom"
                      : annual && plan.price !== "$0"
                      ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
                      : plan.price}
                  </span>
                  {plan.price !== "Custom" && plan.price !== "$0" && (
                    <span className="text-foreground-muted text-sm">/{annual ? "mo" : "mo"}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/tryon" className="block">
                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
