"use client";

import { motion } from "framer-motion";
import {
  Bot,
  MessageCircle,
  Database,
  FileText,
  CheckSquare,
} from "lucide-react";
import { ServiceSystemCard } from "@/components/ui/service-system-card";

const systems = [
  {
    icon: Bot,
    title: "AI Customer Support",
    problem:
      "Teams lose time answering repetitive questions and miss after-hours inquiries.",
    architecture:
      "website/chat → API → AI response engine → escalation rules → CRM → notification",
    impact:
      "Faster first response, lower manual support load, better lead capture.",
    technologies: ["OpenAI API", "Next.js", "n8n", "Google Sheets"],
    accentColor: "cyan" as const,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Lead Automation",
    problem:
      "Leads from ads, forms, and WhatsApp get slow or inconsistent follow-up.",
    architecture:
      "lead event → validation → lead score → WhatsApp Cloud API → CRM → admin alert",
    impact:
      "Faster response, fewer lost leads, consistent lead handling.",
    technologies: ["WhatsApp API", "n8n", "OpenAI", "Sheets"],
    accentColor: "green" as const,
  },
  {
    icon: Database,
    title: "CRM & Operations Integration",
    problem:
      "Data is duplicated across forms, sheets, CRMs, inboxes, and internal tools.",
    architecture:
      "event router → normalization → deduplication → target systems → audit logs",
    impact:
      "Fewer errors, faster operations, better reporting.",
    technologies: ["Webhooks", "Node.js", "n8n", "REST APIs"],
    accentColor: "blue" as const,
  },
  {
    icon: FileText,
    title: "Document Processing & AI Summary",
    problem:
      "Teams manually read, classify, and summarize documents.",
    architecture:
      "upload/email trigger → validation → AI extraction → review queue → storage",
    impact:
      "Reduced processing time and better handoff quality.",
    technologies: ["OpenAI API", "Next.js", "n8n", "MongoDB"],
    accentColor: "amber" as const,
  },
  {
    icon: CheckSquare,
    title: "Internal Approval Workflows",
    problem:
      "Approvals happen across chat, email, and spreadsheets without visibility.",
    architecture:
      "request form → approval matrix → notifications → decision log → dashboard",
    impact:
      "Predictable approvals and fewer stalled tasks.",
    technologies: ["Next.js", "n8n", "Email", "WhatsApp"],
    accentColor: "green" as const,
  },
];

export function SystemsPreviewSection() {
  return (
    <section className="border-b border-border-subtle bg-background-app py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="font-mono text-label uppercase tracking-wider text-accent-green">
            Operational Systems
          </span>
          <h2 className="mt-3 font-sans text-h2 font-bold text-text-primary md:text-[2.25rem] md:leading-[2.75rem]">
            Engineered automation, not generic services
          </h2>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-body text-text-secondary">
            Your business does not need another disconnected tool. It needs a reliable
            operating layer that routes work, updates systems, informs people, and uses AI
            where it improves speed or decision quality.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {systems.map((system) => (
            <ServiceSystemCard key={system.title} {...system} />
          ))}
        </div>
      </div>
    </section>
  );
}
