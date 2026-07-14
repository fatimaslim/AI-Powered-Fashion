"use client";

import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";

interface LoadingStage {
  label: string;
  icon: string;
  completed: boolean;
}

interface LoadingExperienceProps {
  stages: LoadingStage[];
  currentStage: number;
}

export default function LoadingExperience({ stages, currentStage }: LoadingExperienceProps) {
  const progress = Math.min(((currentStage + 1) / stages.length) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-8">
      {/* Animated spinner */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-full border-4 border-border border-t-brand"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">{stages[currentStage]?.icon || "✨"}</span>
        </div>
      </div>

      {/* Current stage text */}
      <motion.p
        key={currentStage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold text-foreground text-center"
      >
        {stages[currentStage]?.label || "Processing..."}
      </motion.p>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-brand rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-foreground-muted text-center mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Stage list */}
      <div className="w-full max-w-sm space-y-2">
        {stages.map((stage, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: index <= currentStage + 1 ? 1 : 0.3,
              x: 0,
            }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center gap-3 text-sm"
          >
            <div className="flex-shrink-0">
              {stage.completed ? (
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              ) : index === currentStage ? (
                <Loader2 className="h-5 w-5 text-brand animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-border" />
              )}
            </div>
            <span
              className={
                stage.completed
                  ? "text-foreground-muted line-through"
                  : index === currentStage
                  ? "text-foreground font-medium"
                  : "text-foreground-muted"
              }
            >
              {stage.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
