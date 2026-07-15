"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { transitionBase } from "@/animations";
import type { LucideIcon } from "lucide-react";

interface MetricTileProps {
  label: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function MetricTile({ label, value, description, icon: Icon, className }: MetricTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={transitionBase}
      className={cn(
        "flex flex-col gap-1 rounded-lg border border-border-subtle bg-background-surface p-4 shadow-status",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.75} />}
        <span className="font-mono text-label uppercase tracking-wider text-text-muted">
          {label}
        </span>
      </div>
      <span className="font-sans text-h3 font-semibold text-text-primary">{value}</span>
      {description && (
        <span className="font-mono text-label text-text-muted">{description}</span>
      )}
    </motion.div>
  );
}
