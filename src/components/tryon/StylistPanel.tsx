"use client";

import { motion } from "framer-motion";
import {
  Palette,
  Sparkles,
  Shirt,
  Watch,
  Gem,
  ShoppingBag,
  Calendar,
  Star,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Ban,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface StylistAnalysis {
  overallScore: number;
  bodyType: {
    detected: string;
    confidence: number;
    recommendations: string[];
  };
  colorAnalysis: {
    skinTone: string;
    bestColors: { name: string; hex: string; reason: string }[];
    avoidColors: { name: string; hex: string; reason: string }[];
  };
  occasions: {
    name: string;
    icon: string;
    rating: number;
    tips: string;
  }[];
  accessories: {
    type: string;
    suggestion: string;
    icon: string;
  }[];
  seasonRecommendation: {
    best: string;
    icon: string;
    reason: string;
  };
  fashionAdvice: string[];
}

interface StylistPanelProps {
  analysis: StylistAnalysis;
}

const accessoryIconMap: Record<string, React.ElementType> = {
  Watch: Watch,
  Shoes: Shirt,
  Bag: ShoppingBag,
  Jewelry: Gem,
  Belt: Shirt,
};

export default function StylistPanel({ analysis }: StylistPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("colors");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-brand/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg font-[var(--font-plus-jakarta)]">
            AI Stylist <span className="gradient-text">Analysis</span>
          </h3>
          <p className="text-xs text-foreground-muted">
            Personalized styling powered by computer vision
          </p>
        </div>
      </div>

      {/* Body Type */}
      <Card>
        <button
          onClick={() => toggleSection("body")}
          className="w-full cursor-pointer"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-brand" />
                Body Type Analysis
              </span>
              {expandedSection === "body" ? (
                <ChevronUp className="h-4 w-4 text-foreground-muted" />
              ) : (
                <ChevronDown className="h-4 w-4 text-foreground-muted" />
              )}
            </CardTitle>
          </CardHeader>
        </button>
        {expandedSection === "body" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="brand">{analysis.bodyType.detected}</Badge>
                <Badge variant="outline">
                  {Math.round(analysis.bodyType.confidence * 100)}% confidence
                </Badge>
              </div>
              <ul className="space-y-2">
                {analysis.bodyType.recommendations.map((rec, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 text-sm text-foreground-muted"
                  >
                    <span className="text-success mt-0.5">✓</span>
                    {rec}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </motion.div>
        )}
      </Card>

      {/* Color Palette */}
      <Card>
        <button
          onClick={() => toggleSection("colors")}
          className="w-full cursor-pointer"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-brand" />
                Color Analysis
              </span>
              {expandedSection === "colors" ? (
                <ChevronUp className="h-4 w-4 text-foreground-muted" />
              ) : (
                <ChevronDown className="h-4 w-4 text-foreground-muted" />
              )}
            </CardTitle>
          </CardHeader>
        </button>
        {expandedSection === "colors" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground-muted">Skin Tone:</span>
                <Badge variant="outline">{analysis.colorAnalysis.skinTone}</Badge>
              </div>

              {/* Best Colors */}
              <div>
                <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Best Colors
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {analysis.colorAnalysis.bestColors.map((color, i) => (
                    <motion.div
                      key={color.name}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-2 rounded-xl bg-background-secondary/50 hover:bg-background-secondary transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-lg border border-border shadow-sm flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{color.name}</p>
                        <p className="text-[10px] text-foreground-muted truncate">
                          {color.reason}
                        </p>
                      </div>
                      <span className="text-[10px] text-foreground-muted font-mono">
                        {color.hex}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Colors to Avoid */}
              <div>
                <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Ban className="h-3 w-3" />
                  Avoid
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {analysis.colorAnalysis.avoidColors.map((color, i) => (
                    <motion.div
                      key={color.name}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-2 rounded-xl bg-error/5 border border-error/10"
                    >
                      <div
                        className="w-8 h-8 rounded-lg border border-border shadow-sm flex-shrink-0 relative"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-error/70 rotate-45 rounded-full" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{color.name}</p>
                        <p className="text-[10px] text-foreground-muted truncate">
                          {color.reason}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </Card>

      {/* Occasions */}
      <Card>
        <button
          onClick={() => toggleSection("occasions")}
          className="w-full cursor-pointer"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand" />
                Occasion Ratings
              </span>
              {expandedSection === "occasions" ? (
                <ChevronUp className="h-4 w-4 text-foreground-muted" />
              ) : (
                <ChevronDown className="h-4 w-4 text-foreground-muted" />
              )}
            </CardTitle>
          </CardHeader>
        </button>
        {expandedSection === "occasions" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-3">
              {analysis.occasions.map((occasion, i) => (
                <motion.div
                  key={occasion.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <span>{occasion.icon}</span>
                      {occasion.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-background-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background:
                              occasion.rating >= 9
                                ? "rgb(var(--success))"
                                : occasion.rating >= 7
                                ? "rgb(var(--brand-primary))"
                                : "rgb(var(--warning))",
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${occasion.rating * 10}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs font-bold w-5 text-right">
                        {occasion.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-foreground-muted ml-7">
                    {occasion.tips}
                  </p>
                </motion.div>
              ))}
            </CardContent>
          </motion.div>
        )}
      </Card>

      {/* Accessories */}
      <Card>
        <button
          onClick={() => toggleSection("accessories")}
          className="w-full cursor-pointer"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Gem className="h-4 w-4 text-brand" />
                Accessory Suggestions
              </span>
              {expandedSection === "accessories" ? (
                <ChevronUp className="h-4 w-4 text-foreground-muted" />
              ) : (
                <ChevronDown className="h-4 w-4 text-foreground-muted" />
              )}
            </CardTitle>
          </CardHeader>
        </button>
        {expandedSection === "accessories" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {analysis.accessories.map((acc, i) => {
                  const Icon = accessoryIconMap[acc.type] || Gem;
                  return (
                    <motion.div
                      key={acc.type}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-background-secondary/50 hover:bg-background-secondary transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-brand" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium flex items-center gap-1.5">
                          <span>{acc.icon}</span>
                          {acc.type}
                        </p>
                        <p className="text-[11px] text-foreground-muted truncate">
                          {acc.suggestion}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </motion.div>
        )}
      </Card>

      {/* Season + Fashion Advice */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" />
            Fashion Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Season */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-brand/5 to-brand-secondary/5 border border-brand/10">
            <span className="text-2xl">{analysis.seasonRecommendation.icon}</span>
            <div>
              <p className="text-sm font-semibold">
                Best for {analysis.seasonRecommendation.best}
              </p>
              <p className="text-[11px] text-foreground-muted">
                {analysis.seasonRecommendation.reason}
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            {analysis.fashionAdvice.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-start gap-2 text-sm text-foreground-muted p-2 rounded-lg",
                  i % 2 === 0
                    ? "bg-background-secondary/30"
                    : "bg-transparent"
                )}
              >
                <span className="text-brand mt-0.5 flex-shrink-0">💡</span>
                {tip}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
