import type { Metadata } from "next";
import { MessageSquare, Calendar, Database, ShieldAlert, Cpu, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Case Studies & Reference Architectures",
  description:
    "Explore our reference architectures and automated case studies. See how CRM sync, AI support intake, and WhatsApp lead routing achieve operational metrics.",
};

const caseStudies = [
  {
    icon: MessageSquare,
    title: "WhatsApp Lead Response System",
    type: "Reference Architecture",
    domain: "Service Businesses & Agency Operations",
    symptoms: [
      "Inbound inquiries left uncontacted for more than 2 hours",
      "Manual phone number checks and typing mistakes in CRM records",
      "No logging of whether leads responded to SMS followups"
    ],
    stack: ["WhatsApp Cloud API", "n8n Orchestration", "Google Sheets", "Resend API"],
    metrics: [
      { label: "Response Delay", value: "Under 45s", change: "99% reduction" },
      { label: "Data Accuracy", value: "100%", change: "0 manual errors" },
      { label: "Downstream Engagement", value: "+38%", change: "Improved conversion" }
    ],
    decisions: "We chose the native WhatsApp Cloud API over third-party chat wrappers to guarantee maximum uptime, secure API token storage, and webhook handshake stability.",
    failures: "Equipped with automatic API retry policies with exponential backoff on transient WhatsApp Meta outages, logging alerts immediately to our Admin Telegram channel."
  },
  {
    icon: Calendar,
    title: "AI Support Intake & Scheduling System",
    type: "Reference Architecture",
    domain: "Healthcare Clinics & Appointment Services",
    symptoms: [
      "Customer support staff losing 15 hours weekly answering repetitive FAQs",
      "Appointments missed due to delayed manual confirmations after hours",
      "Customer dissatisfaction due to weekend support blackouts"
    ],
    stack: ["OpenAI API (GPT-4o)", "Next.js API widget", "n8n Scheduler", "Google Sheets"],
    metrics: [
      { label: "First Response Speed", value: "Under 60s", change: "Immediate FAQ resolve" },
      { label: "Weekly Support Hours", value: "-12 hrs", change: "Freed support agents" },
      { label: "Bookings Captured", value: "+22%", change: "Captured after hours" }
    ],
    decisions: "Deployed OpenAI context injection containing sanitization prompt rules rather than building RAG vector databases. This simplified updates and reduced query costs by 70%.",
    failures: "Queries containing keyword signals of medical emergencies bypass AI processing entirely and escalate directly to admin alert triggers for manual triage."
  },
  {
    icon: Database,
    title: "CRM & Spreadsheet Sync System",
    type: "Reference Architecture",
    domain: "Marketing Agencies & E-Commerce Operations",
    symptoms: [
      "Inconsistencies in billing metrics between HubSpot CRM records and Google Sheets worksheets",
      "Duplicate lead records generated when customers update forms",
      "Manual exports required daily to keep managers updated"
    ],
    stack: ["HubSpot REST API", "n8n Webhook signing", "Google Drive API", "Structured Logging"],
    metrics: [
      { label: "Synchronization Delay", value: "Real-Time", change: "Triggered on update" },
      { label: "Deduplication Rate", value: "100%", change: "Filtered duplicate entries" },
      { label: "Manual Sync Hours", value: "0 hrs/wk", change: "Fully autonomous router" }
    ],
    decisions: "Implemented HMAC signature headers on inbound webhooks to prevent spoofed data payloads, combined with a local rate-limiter on CRM endpoint calls.",
    failures: "Includes validation schema constraints. Inconsistent currency codes or missing email entries reject the synchronization request and trigger detailed log alerts."
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="bg-background-app py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header block */}
        <div className="mb-16 text-center">
          <span className="font-mono text-label uppercase tracking-wider text-accent-cyan">
            Proven Blueprints
          </span>
          <h1 className="mt-3 font-sans text-h1 font-bold text-text-primary md:text-[3rem]">
            Case Studies & Architectures
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-body text-text-secondary">
            Inspect the mechanics of automated operating systems. The reference architectures below
            demonstrate our typical deployment framework, technology choices, and error postures.
          </p>
        </div>

        {/* Case Studies Grid Layout */}
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {caseStudies.map((cs) => {
            const Icon = cs.icon;
            return (
              <div
                key={cs.title}
                className="flex flex-col rounded-xl border border-border-subtle bg-background-surface/80 p-6 shadow-panel backdrop-blur-md"
              >
                {/* Heading details */}
                <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                  <div>
                    <span className="inline-flex rounded border border-accent-cyan/25 bg-accent-cyan/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-accent-cyan tracking-wider uppercase">
                      {cs.type}
                    </span>
                    <h2 className="mt-2.5 font-sans text-h3 font-bold text-text-primary leading-tight">
                      {cs.title}
                    </h2>
                    <span className="mt-1 block font-mono text-label text-text-muted">
                      {cs.domain}
                    </span>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-background-inset text-accent-cyan">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Key Metrics block */}
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {cs.metrics.map((met) => (
                    <div
                      key={met.label}
                      className="rounded border border-border-subtle bg-background-inset p-2.5 text-center"
                    >
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-text-muted">
                        {met.label}
                      </span>
                      <span className="block font-sans text-body font-bold text-text-primary mt-1">
                        {met.value}
                      </span>
                      <span className="block font-sans text-[10px] text-accent-green leading-none mt-1">
                        {met.change}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Symptoms block */}
                <div className="mt-6 space-y-2">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Operational Symptoms
                  </span>
                  <ul className="space-y-1.5">
                    {cs.symptoms.map((sym, sIdx) => (
                      <li
                        key={sIdx}
                        className="font-sans text-small text-text-secondary leading-relaxed flex items-start gap-2"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-red" />
                        {sym}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stack details */}
                <div className="mt-6 space-y-2">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    <Cpu className="h-3.5 w-3.5" />
                    Stack Deployment
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cs.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-background-inset px-2 py-0.5 font-mono text-label text-text-secondary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strategic Decisions */}
                <div className="mt-6 space-y-1.5">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    <Sparkles className="h-3.5 w-3.5" />
                    Engineering Decisions
                  </span>
                  <p className="font-sans text-small text-text-secondary leading-relaxed">
                    {cs.decisions}
                  </p>
                </div>

                {/* Failure management */}
                <div className="mt-6 border-t border-border-subtle pt-4 mt-auto">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted mb-1">
                    Failure Handling
                  </span>
                  <p className="font-sans text-small text-text-muted leading-relaxed">
                    {cs.failures}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global CTA block */}
        <div className="mt-20 rounded-xl border border-border-subtle bg-background-surface p-8 text-center">
          <h2 className="font-sans text-h2 font-bold text-text-primary">
            Want to see how this deploys in your business?
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-body text-text-secondary">
            Map out your data integrations and tools. We engineer custom architectures for agencies and services.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contact">
              <Button size="lg" className="font-semibold">
                Start Architecture Assessment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
