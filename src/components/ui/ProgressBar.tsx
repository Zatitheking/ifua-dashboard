interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({ value, max = 100, className = "", showLabel = true, size = "md" }: ProgressBarProps) {
  const pct = Math.min(value, 150);
  const width = Math.min((pct / max) * 100, 100);

  let barColor = "bg-emerald-500";
  if (value >= 100) barColor = "bg-red-500";
  else if (value >= 80) barColor = "bg-amber-500";

  const h = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 ${h} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${h} ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${width}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-medium tabular-nums min-w-[36px] text-right ${value > 100 ? "text-red-600" : "text-gray-600"}`}>
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}
