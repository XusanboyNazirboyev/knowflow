/**
 * Button — asosiy interaktiv element.
 * Variantlar: primary (amber), secondary, outline, ghost, destructive.
 * Dark Academia: primary = amber/gold, secondary = muted dark.
 */
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-sm shadow-amber-500/20",
  secondary:
    "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700",
  outline:
    "border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800/50",
  ghost: "bg-transparent text-zinc-300 hover:bg-zinc-800/50",
  destructive:
    "bg-red-600/90 text-white hover:bg-red-600 border border-red-500/30",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
  icon: "h-10 w-10",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;