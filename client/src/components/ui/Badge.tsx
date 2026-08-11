/**
 * Badge — kichik status/label indicator.
 * Variantlar: status (document processing/ready/failed), role (owner/admin/member), default.
 */
import React from "react";
import { cn } from "../../lib/utils";

type BadgeVariant =
  | "default"
  | "processing"
  | "ready"
  | "failed"
  | "owner"
  | "admin"
  | "member";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-zinc-800 text-zinc-400 border-zinc-700",
  processing: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  ready: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  failed: "bg-red-500/10 text-red-400 border-red-500/30",
  owner: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  admin: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  member: "bg-zinc-700/40 text-zinc-400 border-zinc-600/40",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  className,
  children,
  ...props
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium",
      variantClasses[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
);

export default Badge;