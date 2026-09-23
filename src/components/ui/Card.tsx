import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverEffect = false, children, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-xl border border-surface-200/80 dark:border-surface-700/60 bg-white/70 dark:bg-surface-100/70 backdrop-blur-sm p-5 shadow-xs transition-all",
          hoverEffect && "hover:border-surface-300 dark:hover:border-surface-600 hover:shadow-sm",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
