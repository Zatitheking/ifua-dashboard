import { getInitials, getAvatarColor } from "../../utils/format";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-12 h-12 text-sm",
};

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const bg = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${className}`}
      style={{ backgroundColor: bg }}
      title={name}
    >
      {initials}
    </div>
  );
}
