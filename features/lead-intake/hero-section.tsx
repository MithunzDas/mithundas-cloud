"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Webhook,
  ShieldCheck,
  Route,
  Database,
  Bot,
  Mail,
  MessageCircle,
  Bell,
  ArrowRight,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";

const workflowNodes = [
  { icon: Webhook, label: "Lead Form", side: "left" as const, delay: 0.3 },
  { icon: MessageCircle, label: "WhatsApp", side: "left" as const, delay: 0.45 },
  { icon: Mail, label: "Email", side: "left" as const, delay: 0.6 },
  { icon: ShieldCheck, label: "Validate", side: "center" as const, delay: 0.8 },
  { icon: Route, label: "Route", side: "center" as const, delay: 0.95 },
  { icon: Bot, label: "AI Summary", side: "center" as const, delay: 1.1 },
  { icon: Database, label: "Store", side: "right" as const, delay: 1.3 },
  { icon: Mail, label: "Confirm", side: "right" as const, delay: 1.45 },
  { icon: Bell, label: "Alert", side: "right" as const, delay: 1.6 },
];

const sideLabels = {
  left: "Inbound Events",
  center: "Orchestration Layer",
  right: "Outputs",
};

const sideAccentClasses = {
  left: {
    bg: "bg-accent-cyan/8",
    border: "border-accent-cyan/15",
    iconBg: "bg-accent-cyan/10",
    iconText: "text-accent-cyan",
    dotBg: "bg-accent-cyan",
  },
  center: {
    bg: "bg-accent-amber/8",
    border: "border-accent-amber/15",
    iconBg: "bg-accent-amber/10",
    iconText: "text-accent-amber",
    dotBg: "bg-accent-amber",
  },
  right: {
    bg: "bg-accent-green/8",
    border: "border-accent-green/15",
    iconBg: "bg-accent-green/10",
    iconText: "text-accent-green",
    dotBg: "bg-accent-green",
  },
};

const LOG_TEMPLATES = [
  { level: "INFO", event: "GATEWAY", msg: "HMAC Signature authorization header verified." },
  { level: "ZOD", event: "VALIDATE", msg: "Normalized email and sanitization schema resolved." },
  { level: "SCORE", event: "COMPUTE", msg: "Lead score computed: 89/100 (Priority: HIGH)." },
  { level: "n8n", event: "DISPATCH", msg: "Webhook handoff successfully dispatched to self-hosted VPS." },
  { level: "INFO", event: "DATABASE", msg: "Google Sheet Leads worksheet: new row successfully appended." },
  { level: "OPENAI", event: "SYNTHESIS", msg: "Context generated: intent identified, qualification complete." },
  { level: "META", event: "WHATSAPP", msg: "WhatsApp Cloud API template confirmation queued." },
  { level: "INFO", event: "RESEND", msg: "Transactional email dispatched successfully to recipient." },
  { level: "INFO", event: "TELEGRAM", msg: "Admin notification routed to engineering alerts channel." },
  { level: "INFO", event: "GATEWAY", msg: "Pipeline socket connection closed cleanly. HTTP 200 OK." },
];

export function HeroSection() {
  const [logs, setLogs] = useState<Array<{ time: string; level: string; event: string; msg: string }>>([]);

  useEffect(() => {
    // Populate initial logs
    const initialLogs = [];
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const timeStr = new Date(now.getTime() - (4 - i) * 3000).toISOString().split("T")[1].slice(0, 8);
      const template = LOG_TEMPLATES[i % LOG_TEMPLATES.length];
      initialLogs.push({ time: timeStr, ...template });
    }
    setLogs(initialLogs);

    // Dynamic rotation interval
    let counter = 4;
    const interval = setInterval(() => {
      const timeStr = new Date().toISOString().split("T")[1].slice(0, 8);
      const template = LOG_TEMPLATES[counter % LOG_TEMPLATES.length];
      setLogs((prev) => [...prev.slice(1), { time: timeStr, ...template }]);
      counter++;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border-subtle bg-background-app">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(69,217,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(69,217,255,.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 pb-16 pt-20 md:pb-24 md:pt-28 overflow-hidden">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 min-w-0">
          {/* Left: Content (5 cols) - Responsive Center-Alignment */}
          <div className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center lg:items-start"
            >
              <div className="mb-6 flex flex-wrap gap-2 justify-center lg:justify-start">
                <StatusPill status="operational" label="API Gateway: Operational" />
              </div>

              <h1 className="font-sans text-[1.5rem] sm:text-[2rem] md:text-[2.25rem] lg:text-display font-bold leading-[2rem] sm:leading-[2.5rem] md:leading-[2.75rem] lg:leading-[4rem] text-text-primary break-words">
                Operational AI systems for businesses that have outgrown manual workflows.
              </h1>

              <p className="mt-5 max-w-lg font-sans text-body text-text-secondary leading-relaxed">
                I design automation architectures that connect your CRM, forms, WhatsApp,
                email, spreadsheets, internal tools, and AI assistants into reliable business
                workflows.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center lg:justify-start">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2 px-5 text-sm font-semibold">
                    Start Automation Assessment
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </Button>
                </Link>
                <Link href="/demo" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full px-5 text-sm font-semibold"
                  >
                    Run Workflow Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right: Animated Infrastructure Visual (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4 min-w-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="rounded-xl border border-border-subtle bg-background-surface/40 p-3 sm:p-4 shadow-panel lg:p-6 overflow-hidden"
            >
              {/* Panel Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-status-success" />
                  </span>
                  <span className="font-mono text-label uppercase tracking-wider text-text-muted">
                    Lead Pipeline — Live Preview
                  </span>
                </div>
                <span className="font-mono text-label text-text-muted">v1.0</span>
              </div>

              {/* Workflow Visualization — Responsive stacking */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-3">
                {(["left", "center", "right"] as const).map((side) => {
                  const accent = sideAccentClasses[side];
                  const nodesForSide = workflowNodes.filter((n) => n.side === side);
                  return (
                    <div key={side} className="flex flex-col gap-2">
                      <span className="mb-1 font-mono text-label uppercase tracking-wider text-text-muted mt-2 first:mt-0 md:mt-0">
                        {sideLabels[side]}
                      </span>
                      {nodesForSide.map((node) => {
                        const Icon = node.icon;
                        return (
                          <motion.div
                            key={node.label}
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: node.delay,
                              duration: 0.35,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className={`flex items-center gap-2.5 rounded-md border ${accent.border} ${accent.bg} px-3 py-2.5 transition-colors`}
                          >
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${accent.iconBg}`}
                            >
                              <Icon className={`h-3.5 w-3.5 ${accent.iconText}`} strokeWidth={1.75} />
                            </div>
                            <span className="font-mono text-small text-text-secondary">
                              {node.label}
                            </span>
                            <span className="ml-auto">
                              <span className="relative flex h-1.5 w-1.5">
                                <span
                                  className={`absolute inline-flex h-full w-full animate-ping rounded-full ${accent.dotBg} opacity-30`}
                                />
                                <span
                                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${accent.dotBg}`}
                                />
                              </span>
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Execution Timeline Bar */}
              <div className="mt-4 rounded-md border border-border-subtle bg-background-inset p-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <span className="font-mono text-label text-text-muted">Execution Timeline</span>
                  <StatusPill status="operational" label="All Steps Passed" className="w-fit" />
                </div>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        delay: 0.5 + i * 0.18,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="h-1.5 flex-1 origin-left rounded-full bg-accent-green/40"
                    />
                  ))}
                </div>
              </div>

              {/* System Status Cluster */}
              <div className="mt-3 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:grid-cols-4">
                {[
                  { label: "API Gateway", status: "operational" as const },
                  { label: "n8n Orchestrator", status: "operational" as const },
                  { label: "Lead Pipeline", status: "monitored" as const },
                  { label: "AI Summary", status: "active" as const },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-md border border-border-subtle bg-background-inset px-2.5 py-2 min-w-0"
                  >
                    <StatusPill status={item.status} label={item.label} className="border-0 bg-transparent px-0 py-0 text-[10px] truncate" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Live Logs Telemetry Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="rounded-xl border border-border-subtle bg-background-surface/40 p-3 sm:p-4 shadow-panel min-w-0 overflow-hidden"
            >
              <div className="mb-2.5 flex items-center gap-2 border-b border-border-subtle pb-2">
                <Terminal className="h-3.5 w-3.5 text-accent-cyan" />
                <span className="font-mono text-label uppercase tracking-wider text-text-primary">
                  Live Log Telemetry Stream
                </span>
                <div className="ml-auto flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
                  <span className="font-mono text-[9px] text-text-muted">ACTIVE</span>
                </div>
              </div>

              <div className="h-[96px] overflow-hidden bg-[#070A0F]/60 p-2 sm:p-2.5 rounded font-mono text-[10px] space-y-1">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-1.5 sm:gap-2 leading-tight min-w-0 items-center overflow-hidden">
                    <span className="text-text-muted shrink-0 hidden sm:inline">[{log.time}]</span>
                    <span className="text-accent-cyan shrink-0">[{log.level}]</span>
                    <span className="text-accent-amber shrink-0">[{log.event}]</span>
                    <span className="text-text-secondary truncate flex-1 min-w-0">{log.msg}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Metrics full-width row */}
        <div className="mt-16 grid grid-cols-1 min-[480px]:grid-cols-2 gap-4 border-t border-border-subtle pt-8 md:grid-cols-4">
          {[
            { label: "Response Automation", value: "< 60s" },
            { label: "Workflow Visibility", value: "Every Step" },
            { label: "Integration Pattern", value: "E2E Pipeline" },
            { label: "Reliability Posture", value: "Retry + Alert" },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-md border border-border-subtle bg-background-surface/60 px-4 py-3"
            >
              <span className="block font-mono text-label uppercase tracking-wider text-text-muted">
                {metric.label}
              </span>
              <span className="block font-sans text-small font-semibold text-text-primary mt-1">
                {metric.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
