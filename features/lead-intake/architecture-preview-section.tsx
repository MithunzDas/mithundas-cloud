"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Server,
  Workflow,
  Database,
  Mail,
  MessageCircle,
  Bell,
  Bot,
  ArrowRight,
} from "lucide-react";

const layers = [
  {
    label: "Frontend",
    icon: Globe,
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10",
    border: "border-accent-cyan/20",
    items: ["Next.js App", "Lead Form", "Workflow Demo", "Chatbot UI"],
  },
  {
    label: "API Layer",
    icon: Server,
    color: "text-accent-blue",
    bg: "bg-accent-blue/10",
    border: "border-accent-blue/20",
    items: ["Zod Validation", "Rate Limiting", "HMAC Signing", "Route Handlers"],
  },
  {
    label: "Orchestration",
    icon: Workflow,
    color: "text-accent-amber",
    bg: "bg-accent-amber/10",
    border: "border-accent-amber/20",
    items: ["n8n Workflows", "Lead Intake", "Error Handling", "Follow-Up"],
  },
  {
    label: "Data & AI",
    icon: Database,
    color: "text-accent-green",
    bg: "bg-accent-green/10",
    border: "border-accent-green/20",
    items: ["Google Sheets", "OpenAI API", "Lead Scoring", "AI Summary"],
  },
  {
    label: "Notifications",
    icon: Bell,
    color: "text-accent-red",
    bg: "bg-accent-red/10",
    border: "border-accent-red/20",
    items: ["Email (Resend)", "WhatsApp API", "Admin Alerts", "Status Updates"],
  },
];

const flowSteps = [
  { icon: Globe, label: "Visitor", color: "text-accent-cyan" },
  { icon: Server, label: "API", color: "text-accent-blue" },
  { icon: Workflow, label: "n8n", color: "text-accent-amber" },
  { icon: Bot, label: "AI", color: "text-accent-green" },
  { icon: Database, label: "Data", color: "text-accent-green" },
  { icon: Mail, label: "Email", color: "text-accent-red" },
  { icon: MessageCircle, label: "WhatsApp", color: "text-accent-green" },
  { icon: Bell, label: "Admin", color: "text-accent-amber" },
];

export function ArchitecturePreviewSection() {
  return (
    <section className="border-b border-border-subtle bg-background-inset py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="font-mono text-label uppercase tracking-wider text-accent-blue">
            System Architecture
          </span>
          <h2 className="mt-3 font-sans text-h2 font-bold text-text-primary md:text-[2.25rem] md:leading-[2.75rem]">
            How the pieces connect
          </h2>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-body text-text-secondary">
            Frontend, API, automation engine, data store, and notification channels — all
            integrated through a single pipeline architecture.
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 rounded-xl border border-border-subtle bg-background-surface/40 p-6 shadow-panel"
        >
          {/* Horizontal Pipeline Flow */}
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono text-label uppercase tracking-wider text-text-muted">
              Integration Pipeline
            </span>
            <span className="font-mono text-label text-text-muted">
              End-to-End Execution Flow
            </span>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0 pb-2 z-0">
            {/* Horizontal Connecting Node Line (Desktop) */}
            <div className="absolute left-[30px] right-[30px] top-[20px] h-[2px] bg-border-subtle z-0 hidden md:block" />
            
            {/* Vertical Connecting Node Line (Mobile) */}
            <div className="absolute left-[20px] top-[20px] bottom-[20px] w-[2px] bg-border-subtle z-0 block md:hidden" />

            {flowSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + i * 0.1,
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative z-10 flex flex-row md:flex-col items-center gap-3.5 md:gap-1.5 bg-[#0e1219] p-2.5 md:p-0 md:px-3 rounded-lg md:rounded-none border border-border-subtle/40 md:border-0 w-full md:w-auto"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-background-elevated shadow-status transition-colors hover:border-accent-cyan/40">
                    <Icon className={`h-4.5 w-4.5 ${step.color}`} strokeWidth={1.75} />
                  </div>
                  <span className="whitespace-nowrap font-mono text-[10px] text-text-muted">
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Architecture Layers */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`rounded-lg border ${layer.border} ${layer.bg} p-4`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${layer.color}`} strokeWidth={1.75} />
                  <span className={`font-mono text-label font-medium uppercase tracking-wider ${layer.color}`}>
                    {layer.label}
                  </span>
                </div>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {layer.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-label text-text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
