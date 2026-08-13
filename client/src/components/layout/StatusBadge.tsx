/**
 * StatusBadge — document status uchun maxsus badge.
 * processing -> pulsing amber, ready -> green, failed -> red.
 */
import React from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import type { DocumentStatus } from "../../types";
import Badge from "../ui/Badge";

const config: Record<
  DocumentStatus,
  { variant: "processing" | "ready" | "failed"; icon: React.ReactNode; label: string }
> = {
  PENDING: {
    variant: "processing",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    label: "Kutilmoqda",
  },
  PROCESSING: {
    variant: "processing",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    label: "Processing",
  },
  READY: {
    variant: "ready",
    icon: <Check className="h-3 w-3" />,
    label: "Ready",
  },
  FAILED: {
    variant: "failed",
    icon: <AlertCircle className="h-3 w-3" />,
    label: "Failed",
  },
};

export const StatusBadge: React.FC<{ status: DocumentStatus }> = ({
  status,
}) => {
  const c = config[status];
  return (
    <Badge variant={c.variant}>
      {c.icon}
      {c.label}
    </Badge>
  );
};

export default StatusBadge;
