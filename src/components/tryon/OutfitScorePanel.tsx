"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface OutfitScores {
  overall: number;
  categories: {
    name: string;
    score: number;
    icon: string;
    description: string;
  }[];
  summary: string;
}

interface OutfitScorePanelProps {
  scores: OutfitScores;
}

function AnimatedScore({ score, delay = 0 }: { score: number; delay?: number }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 90) return "rgb(var(--success))";
    if (s >= 80) return "rgb(var(--brand-primary))";
    if (s >= 70) return "rgb(var(--warning))";
    return "rgb(var(--error))";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="rgb(var(--border))"
          strokeWidth="6"
          fill="none"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke={getColor(score)}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] text-foreground-muted font-medium">
          /100
        </span>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  icon,
  description,
  index,
}: {
  label: string;
  score: number;
  icon: string;
  description: string;
  index: number;
}) {
  const getBarColor = (s: number) => {
    if (s >= 90) return "bg-success";
    if (s >= 80) return "bg-brand";
    if (s >= 70) return "bg-warning";
    return "bg-error";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.3 }}
      className="space-y-1.5 group"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium flex items-center gap-2">
          <span className="text-base">{icon}</span>
          {label}
        </span>
        <div className="flex items-center gap-2">
          <motion.span
            className="text-sm font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.8 }}
          >
            {score}
          </motion.span>
          <Badge
            variant={score >= 90 ? "success" : score >= 80 ? "brand" : "warning"}
            className="text-[10px] px-1.5"
          >
            {score >= 90 ? "Excellent" : score >= 80 ? "Great" : "Good"}
          </Badge>
        </div>
      </div>
      <div className="w-full h-2.5 bg-background-secondary rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", getBarColor(score))}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
        />
      </div>
      <p className="text-[10px] text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        <Info className="h-3 w-3 flex-shrink-0" />
        {description}
      </p>
    </motion.div>
  );
}

export default function OutfitScorePanel({ scores }: OutfitScorePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        {/* Gradient header */}
        <div className="relative gradient-brand p-5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_70%)]" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Outfit Score
              </h3>
              <p className="text-white/70 text-xs mt-0.5">
                AI-powered multi-dimensional analysis
              </p>
            </div>
            <AnimatedScore score={scores.overall} />
          </div>
        </div>

        <CardContent className="p-5 space-y-5">
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn(
              "p-3 rounded-xl text-sm border",
              scores.overall >= 90
                ? "bg-success/5 border-success/20 text-success"
                : scores.overall >= 80
                ? "bg-brand/5 border-brand/20 text-brand"
                : "bg-warning/5 border-warning/20 text-warning"
            )}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 flex-shrink-0" />
              <p className="font-medium">{scores.summary}</p>
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <div className="space-y-4">
            {scores.categories.map((cat, i) => (
              <ScoreBar
                key={cat.name}
                label={cat.name}
                score={cat.score}
                icon={cat.icon}
                description={cat.description}
                index={i}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
