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
    default: "bg-slate-100 text-slate-700 border-slate-200",
    critical: "bg-rose-50 text-rose-700 border-rose-200",
    high: "bg-amber-50 text-amber-700 border-amber-200",
    medium: "bg-sky-50 text-sky-700 border-sky-200",
    low: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    brand: "bg-orange-50 text-orange-700 border-orange-200",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 font-medium tracking-wide",
    md: "text-xs px-3 py-1 font-semibold",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 rounded-full border font-sans select-none",
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
