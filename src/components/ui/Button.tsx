interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variants = {
  primary: "bg-[#C8A951] hover:bg-[#B89A42] text-white shadow-sm",
  secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
  danger: "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200",
};

const sizeClasses = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export function Button({ variant = "primary", size = "md", children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
