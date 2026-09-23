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
          "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all",
          hoverEffect && "hover:border-slate-300 hover:shadow-card-hover",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
