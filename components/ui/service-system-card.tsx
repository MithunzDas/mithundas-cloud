"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { transitionBase } from "@/animations";
import { Badge } from "./badge";
import type { LucideIcon } from "lucide-react";

interface ServiceSystemCardProps {
  icon: LucideIcon;
  title: string;
  problem: string;
  architecture: string;
  impact: string;
  technologies: string[];
  accentColor?: "cyan" | "green" | "amber" | "blue" | "red";
  className?: string;
}

const accentBorderMap = {
  cyan: "hover:border-accent-cyan/30",
  green: "hover:border-accent-green/30",
  amber: "hover:border-accent-amber/30",
  blue: "hover:border-accent-blue/30",
  red: "hover:border-accent-red/30",
};

const accentTextMap = {
  cyan: "text-accent-cyan",
  green: "text-accent-green",
  amber: "text-accent-amber",
  blue: "text-accent-blue",
  red: "text-accent-red",
};

const accentBgMap = {
  cyan: "bg-accent-cyan/10",
  green: "bg-accent-green/10",
  amber: "bg-accent-amber/10",
  blue: "bg-accent-blue/10",
  red: "bg-accent-red/10",
};

export function ServiceSystemCard({
  icon: Icon,
  title,
  problem,
  architecture,
  impact,
  technologies,
  accentColor = "cyan",
  className,
}: ServiceSystemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={transitionBase}
      className={cn(
        "group flex flex-col gap-4 rounded-lg border border-border-subtle bg-background-surface p-6 shadow-status transition-all duration-base",
        accentBorderMap[accentColor],
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md",
            accentBgMap[accentColor]
          )}
        >
          <Icon className={cn("h-4.5 w-4.5", accentTextMap[accentColor])} strokeWidth={1.75} />
        </div>
        <h3 className="font-sans text-h3 font-semibold text-text-primary">{title}</h3>
      </div>

      <div className="space-y-3">
        <div>
          <span className="font-mono text-label uppercase tracking-wider text-text-muted">
            Problem
          </span>
          <p className="mt-1 font-sans text-small text-text-secondary">{problem}</p>
        </div>

        <div>
          <span className="font-mono text-label uppercase tracking-wider text-text-muted">
            Architecture
          </span>
          <p className="mt-1 font-mono text-label text-text-muted">{architecture}</p>
        </div>

        <div>
          <span className="font-mono text-label uppercase tracking-wider text-text-muted">
            Impact
          </span>
          <p className="mt-1 font-sans text-small text-text-secondary">{impact}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {technologies.map((tech) => (
          <Badge key={tech} variant={accentColor}>
            {tech}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}
