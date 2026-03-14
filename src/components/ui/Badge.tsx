interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

export function Badge({ children, className = "", variant = "default" }: BadgeProps) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border";
  const variants = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    outline: "bg-transparent border-gray-300 text-gray-600",
  };
  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}

interface StatusBadgeProps {
  color: string;
  label: string;
}

export function StatusBadge({ color, label }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-gray-200">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
