"use client";

import { cn } from "@/lib/utils";

type StatusType = "operational" | "degraded" | "outage" | "monitored" | "active";

const statusConfig: Record<StatusType, { label: string; dotClass: string; textClass: string }> = {
  operational: {
    label: "Operational",
    dotClass: "bg-status-success",
    textClass: "text-status-success",
  },
  degraded: {
    label: "Degraded",
    dotClass: "bg-status-warning",
    textClass: "text-status-warning",
  },
  outage: {
    label: "Outage",
    dotClass: "bg-status-error",
    textClass: "text-status-error",
  },
  monitored: {
    label: "Monitored",
    dotClass: "bg-accent-blue",
    textClass: "text-accent-blue",
  },
  active: {
    label: "Active",
    dotClass: "bg-status-success",
    textClass: "text-status-success",
  },
};

interface StatusPillProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusPill({ status, label, className }: StatusPillProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border-subtle bg-background-inset px-3 py-1.5 font-mono text-label",
        config.textClass,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-40",
            config.dotClass
          )}
        />
        <span
          className={cn("relative inline-flex h-2 w-2 rounded-full", config.dotClass)}
        />
      </span>
      {label || config.label}
    </span>
  );
}
