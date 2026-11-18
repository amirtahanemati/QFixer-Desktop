import { cn } from "@/utils/cn";

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  unit?: string;
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  className,
  label,
  unit = "",
}: SliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-foreground/80 font-medium">{label}</span>
          <span className="font-mono text-muted-foreground text-[11px]">
            {value}
            {unit}
          </span>
        </div>
      )}
      <div className="relative flex items-center select-none touch-none w-full h-5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, var(--accent) ${percentage}%, var(--muted) ${percentage}%)`,
          }}
        />
      </div>
    </div>
  );
}
