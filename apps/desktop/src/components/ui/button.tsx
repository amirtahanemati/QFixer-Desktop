import * as React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "accent";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-panel border border-border text-foreground hover:bg-muted/60 active:scale-[0.98]",
      secondary: "bg-background-secondary border border-border text-foreground hover:bg-panel active:scale-[0.98]",
      outline: "border border-border bg-transparent text-foreground hover:bg-panel active:scale-[0.98]",
      ghost: "bg-transparent text-foreground hover:bg-panel active:scale-[0.98]",
      destructive: "bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 active:scale-[0.98]",
      accent: "bg-accent text-accent-foreground font-semibold hover:bg-accent-hover shadow-sm active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-7 px-2.5 text-xs rounded",
      md: "h-9 px-3.5 text-xs rounded-md",
      lg: "h-11 px-5 text-sm rounded-lg",
      icon: "h-8 w-8 p-0 rounded flex items-center justify-center shrink-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all select-none disabled:pointer-events-none disabled:opacity-40",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
