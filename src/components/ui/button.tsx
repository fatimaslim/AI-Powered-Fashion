"use client";

import { forwardRef, type ReactNode, type MouseEventHandler } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm",
  {
    variants: {
      variant: {
        primary:
          "gradient-brand text-white shadow-lg shadow-brand/25 hover:shadow-xl hover:shadow-brand/30 hover:brightness-110 active:scale-[0.98]",
        secondary:
          "bg-background-secondary text-foreground border border-border hover:bg-border/50 active:scale-[0.98]",
        outline:
          "border border-border text-foreground hover:bg-background-secondary active:scale-[0.98]",
        ghost:
          "text-foreground-muted hover:text-foreground hover:bg-background-secondary active:scale-[0.98]",
        danger:
          "bg-error text-white hover:bg-error/90 shadow-lg shadow-error/25 active:scale-[0.98]",
        glass:
          "glass text-foreground hover:bg-card/90 active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  className?: string;
  loading?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  id?: string;
  "aria-label"?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, icon, children, disabled, type = "button", onClick, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        whileHover={disabled || loading ? {} : { scale: 1.02 }}
        whileTap={disabled || loading ? {} : { scale: 0.98 }}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
