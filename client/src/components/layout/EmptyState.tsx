/**
 * EmptyState — hech narsa yo'q holat uchun placeholder.
 * Icon + title + description + optional action.
 */
import React from "react";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-16 px-6 text-center",
      className
    )}
  >
    <div className="relative mb-5">
      <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-2xl" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
    {description && (
      <p className="mt-2 max-w-sm text-sm text-zinc-500">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;