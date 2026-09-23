import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "critical" | "high" | "medium" | "low" | "success" | "warning" | "brand";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}) => {
  const variantStyles = {
    default: "bg-surface-200/80 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-300/40 dark:border-surface-700/50",
    critical: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    high: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    medium: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    low: "bg-surface-200/60 dark:bg-surface-800/80 text-surface-600 dark:text-surface-400 border-surface-300/30",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    brand: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium tracking-wide",
    md: "text-xs px-2.5 py-1 font-medium",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1 rounded-md border font-sans select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
