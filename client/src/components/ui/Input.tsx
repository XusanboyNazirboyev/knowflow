/**
 * Input — form input field.
 * Dark Academia: dark zinc bg, amber focus ring.
 */
import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-lg border bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 transition-colors focus:outline-none focus:ring-2",
            error
              ? "border-red-500/50 focus:ring-red-500/30"
              : "border-zinc-800 focus:border-amber-500/50 focus:ring-amber-500/20",
            leftIcon && "pl-10",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;