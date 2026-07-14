"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 36, text: "text-xl" },
  lg: { icon: 44, text: "text-2xl" },
};

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const s = sizes[size];

  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <motion.div
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Logo icon */}
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="14" fill="url(#logo-grad)" />
          <path
            d="M40 20c0-4.42-3.58-8-8-8h-8c-4.42 0-8 3.58-8 8s3.58 8 8 8h8c4.42 0 8 3.58 8 8s-3.58 8-8 8h-8c-4.42 0-8-3.58-8-8"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="24" cy="20" r="2" fill="white" opacity="0.8" />
          <circle cx="40" cy="36" r="2" fill="white" opacity="0.8" />
          <path d="M46 14l2-5 2 5 5 2-5 2-2 5-2-5-5-2z" fill="white" opacity="0.7" />
        </svg>
      </motion.div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold tracking-tight ${s.text} font-[var(--font-plus-jakarta)]`}>
            <span className="gradient-text-brand">Style</span>
            <span className="text-foreground">Mind</span>
          </span>
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
            AI Fashion
          </span>
        </div>
      )}
    </Link>
  );
}
