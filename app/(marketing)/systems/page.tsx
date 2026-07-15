import type { Metadata } from "next";
import { Bot, MessageCircle, Database, FileText, CheckSquare, ArrowRight, Settings, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Operational Systems",
  description:
    "Engineered AI and API integration systems designed for business scale. Explore our architectures for AI customer support, WhatsApp automation, CRM integration, and document parsing.",
};

const detailedSystems = [
  {
    id: "ai-support",
    icon: Bot,
    title: "AI Customer Support System",
    problem: "Support teams spend hours answering repetitive questions, leading to delayed response times and missed opportunities after-hours.",
    solution: "A self-correcting response engine integrated directly into your website chat or support channels, equipped with deterministic escalation filters.",
    architecture: [
      "Visitor submits query through frontend widget or chat API",
      "API route sanitizes input and performs context verification",
      "AI engine matches query against approved product context",
      "Response synthesized with safety guardrails",
      "Uncertain intents escalated to human support via CRM notification"
    ],
    features: [
      "Custom system prompts with pre-injected context",
      "Deterministic human-in-the-loop escalation rules",
      "Structured data capture for CRM sync",
      "Detailed query audit logging"
    ],
    tech: ["OpenAI API", "Next.js Route Handlers", "n8n Orchestrator", "Google Sheets/CRM"],
    color: "border-accent-cyan bg-accent-cyan/5 text-accent-cyan",
  },
  {
    id: "whatsapp",
    icon: MessageCircle,
    title: "WhatsApp Lead Automation System",
    problem: "Leads arriving from meta ads or outbound channels remain uncontacted for hours, reducing conversion likelihood by up to 80%.",
    solution: "Instant, automated WhatsApp acknowledgement pipeline that scores leads, validates contact credentials, and dispatches custom template followups.",
    architecture: [
      "Inbound lead event captured from Webhook (Facebook Ads, landing forms)",
      "Zod schema validation sanitizes name, email, and phone number",
      "Lead scoring node grades qualification level in real-time",
      "WhatsApp Cloud API dispatches interactive template message",
      "Slack/Telegram alert notifies sales team with lead summary"
    ],
    features: [
      "WhatsApp Cloud API template integration",
      "Automated lead scoring based on custom criteria",
      "CRM sync and priority status tagging",
      "Dynamic auto-reminders for non-responders"
    ],
    tech: ["WhatsApp Cloud API", "n8n Orchestrator", "OpenAI API", "PostgreSQL/Sheets"],
    color: "border-accent-green bg-accent-green/5 text-accent-green",
  },
  {
    id: "crm",
    icon: Database,
    title: "CRM & Operations Integration System",
    problem: "Sales representatives waste time duplicating contact data across tools, spreadsheets, email lists, and bookkeeping tools.",
    solution: "A resilient, webhook-driven data router that synchronizes records across your stack with automated field mapping, retry loops, and failure alerts.",
    architecture: [
      "Webhook signals record update in source CRM",
      "Normalizer maps custom fields to target schema",
      "Deduplication check queries target system via API",
      "Synchronized record written; audit log timestamped",
      "Transient failures automatically retried with exponential backoff"
    ],
    features: [
      "Resilient retry policies on transient network errors",
      "Field sanitization and duplicate record prevention",
      "Multi-system sync (HubSpot, Salesforce, n8n, custom DBs)",
      "Secure webhook signature authorization"
    ],
    tech: ["REST APIs", "Node.js Helpers", "n8n Webhooks", "Log Storage"],
    color: "border-accent-blue bg-accent-blue/5 text-accent-blue",
  },
  {
    id: "document",
    icon: FileText,
    title: "Document Processing & AI Extraction System",
    problem: "Operations teams spend hours daily copying data from invoices, contracts, or application PDFs into database systems.",
    solution: "An automated extraction pipeline that parses files, uses GPT models to structure data, and queues doubtful records for manual administrator review.",
    architecture: [
      "File uploaded or received via automated email webhook",
      "File parser extracts text blocks or executes OCR scanning",
      "GPT model extracts parameters based on predefined JSON schema",
      "Confidence score calculated; failures routed to review queue",
      "Verified data exported to production database system"
    ],
    features: [
      "OCR parsing for scanned documents and PDF attachments",
      "Confidence-weighted manual routing (Human-in-the-loop)",
      "Strict schema enforcement using JSON Mode",
      "Automatic folder archiving and cloud storage sync"
    ],
    tech: ["OpenAI JSON Mode", "n8n File Handlers", "Google Drive API", "MongoDB"],
    color: "border-accent-amber bg-accent-amber/5 text-accent-amber",
  },
  {
    id: "approval",
    icon: CheckSquare,
    title: "Internal Approval Workflow System",
    problem: "Purchase requests, expense claims, or operational sign-offs get lost in email threads or chat channels without audit trials.",
    solution: "A central sign-off engine that manages request routes, dispatches action cards to Slack/WhatsApp, and logs decisions to a tamper-proof sheet.",
    architecture: [
      "Requester submits detail form on company intranet portal",
      "Approval engine matches parameters against corporate matrix",
      "Notification sent to approver containing dynamic accept/reject buttons",
      "Approver registers choice; decision written to audit sheet",
      "Requester notified; downstream execution triggered"
    ],
    features: [
      "Interactive WhatsApp/Email choice buttons",
      "Role-based matrix routing logic",
      "SLA timers with automated escalation alerts",
      "Comprehensive CSV audit trail"
    ],
    tech: ["Next.js Forms", "n8n State Management", "Resend API", "Google Sheets"],
    color: "border-accent-green bg-accent-green/5 text-accent-green",
  },
];

export default function SystemsPage() {
  return (
    <div className="bg-background-app py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header section */}
        <div className="mb-16 text-center">
          <span className="font-mono text-label uppercase tracking-wider text-accent-cyan">
            Operational Engineering
          </span>
          <h1 className="mt-3 font-sans text-h1 font-bold text-text-primary md:text-[3rem]">
            Operational Systems
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-body text-text-secondary">
            I design and implement custom business operating layers. Every system is built
            resilient, verifiable, and documented to minimize maintenance overhead.
          </p>
        </div>

        {/* Systems Grid layout */}
        <div className="space-y-16">
          {detailedSystems.map((sys, idx) => {
            const Icon = sys.icon;
            return (
              <div
                key={sys.id}
                id={sys.id}
                className="grid gap-8 border-t border-border-subtle pt-12 lg:grid-cols-12"
              >
                {/* Visual Metadata column (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${sys.color}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h2 className="font-sans text-h3 font-bold text-text-primary">
                      {sys.title}
                    </h2>
                  </div>

                  <p className="mt-5 font-sans text-body text-text-secondary leading-relaxed">
                    <strong className="block font-mono text-[11px] uppercase tracking-wider text-text-muted mb-1">
                      Problem Context
                    </strong>
                    {sys.problem}
                  </p>

                  <p className="mt-4 font-sans text-body text-text-secondary leading-relaxed">
                    <strong className="block font-mono text-[11px] uppercase tracking-wider text-text-muted mb-1">
                      Proposed Solution
                    </strong>
                    {sys.solution}
                  </p>

                  <div className="mt-6">
                    <strong className="block font-mono text-[11px] uppercase tracking-wider text-text-muted mb-2">
                      Key Deliverables
                    </strong>
                    <div className="grid grid-cols-2 gap-2">
                      {sys.features.map((feat) => (
                        <div
                          key={feat}
                          className="flex items-center gap-1.5 rounded border border-border-subtle bg-background-surface/50 px-2.5 py-2"
                        >
                          <Settings className="h-3 w-3 text-text-muted" />
                          <span className="font-sans text-label text-text-secondary leading-none">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Technical Architecture flow column (7 cols) */}
                <div className="lg:col-span-7">
                  <div className="rounded-xl border border-border-subtle bg-background-surface/40 p-6 shadow-status">
                    <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-3">
                      <span className="flex items-center gap-1.5 font-mono text-label uppercase tracking-wider text-text-muted">
                        <Activity className="h-3.5 w-3.5" />
                        Execution Pipeline Flow
                      </span>
                      <span className="font-mono text-label text-text-muted">
                        Deterministic
                      </span>
                    </div>

                    {/* Step Timeline */}
                    <div className="space-y-4">
                      {sys.architecture.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-4">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background-inset font-mono text-label text-text-muted">
                            {sIdx + 1}
                          </div>
                          <p className="font-sans text-small text-text-secondary leading-relaxed mt-0.5">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Technology badging */}
                    <div className="mt-6 border-t border-border-subtle pt-4">
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted mb-2.5">
                        Technologies Deployed
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sys.tech.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 rounded-md border border-border-subtle bg-background-inset px-2.5 py-1 font-mono text-label text-text-secondary"
                          >
                            <ShieldCheck className="h-3 w-3 text-accent-cyan" />
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global systems footer block */}
        <div className="mt-20 rounded-xl border border-border-subtle bg-background-surface p-8 text-center md:p-12">
          <h2 className="font-sans text-h2 font-bold text-text-primary">
            Need a custom automation architecture?
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-body text-text-secondary">
            Every business operation has unique quirks. We design integrations that fit your
            existing software stack, API keys, and workflow compliance.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/contact">
              <Button size="lg" className="gap-1.5 font-semibold">
                Start Automation Assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
