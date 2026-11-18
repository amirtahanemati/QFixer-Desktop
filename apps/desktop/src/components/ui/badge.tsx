import * as React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent" | "outline" | "secondary" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-panel border-border text-foreground",
    accent: "bg-accent/20 border-accent/40 text-accent font-semibold",
    outline: "border-border text-foreground bg-transparent",
    secondary: "bg-background-secondary border-border text-muted-foreground",
    success: "bg-emerald-500/15 border-emerald-500/30 text-emerald-500",
    warning: "bg-amber-500/15 border-amber-500/30 text-amber-500",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors select-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
