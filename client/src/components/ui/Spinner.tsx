/**
 * Spinner — loading indicator.
 */
import React from "react";
import { cn } from "../../lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
};

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => (
  <div
    className={cn(
      "rounded-full border-zinc-800 border-t-amber-500 animate-spin",
      sizeClasses[size],
      className
    )}
  />
);

export default Spinner;