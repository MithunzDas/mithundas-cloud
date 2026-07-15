import type { Metadata } from "next";
import { ClipboardList, Layers, GitPullRequest, ShieldAlert, CheckCircle, MonitorDot, Milestone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Engagement Process",
  description:
    "Explore our 7-stage diagnostic and deployment framework for implementing operational business automations. From initial architecture map to live system monitoring.",
};

const stages = [
  {
    icon: ClipboardList,
    title: "1. Diagnostic Audit",
    timeline: "Days 1 - 3",
    description: "We map your current manual bottlenecks and tools. We calculate time leakage and inspect what APIs are available on your current CRMs and databases.",
    outcomes: ["Current-state process map", "Integration API accessibility check", "High-priority bottleneck shortlist"]
  },
  {
    icon: Layers,
    title: "2. Architecture Design",
    timeline: "Days 4 - 7",
    description: "I engineer the target data pipeline blueprint, showing webhook entry points, validation boundaries, AI extraction structures, and notification outputs.",
    outcomes: ["E2E system design architecture", "Data schema schemas", "Firm scope of work statement"]
  },
  {
    icon: GitPullRequest,
    title: "3. MVP Workflow Assembly",
    timeline: "Weeks 2 - 3",
    description: "Building the automation logic in Next.js/n8n. We configure the webhook interfaces, field formatting blocks, email templates, and OpenAI prompt rules.",
    outcomes: ["Working draft workflow node logic", "Configured webhook API route templates", "AI prompt syntax iterations"]
  },
  {
    icon: ShieldAlert,
    title: "4. Stress Testing & Validation",
    timeline: "Week 4",
    description: "We execute hundreds of test payloads containing missing, duplicate, or corrupted inputs to verify that Zod constraints and webhook retries hold up.",
    outcomes: ["Corrupted data logic test reports", "HMAC webhook verification reports", "Rate limiter verify logs"]
  },
  {
    icon: CheckCircle,
    title: "5. Production Deployment",
    timeline: "Week 5",
    description: "The systems are deployed on Vercel and your self-hosted Hostinger VPS. We route live production records, configure DNS keys, and activate secret vaults.",
    outcomes: ["Active SSL domain connections", "VPS orchestrator active status", "Admin alerts connected"]
  },
  {
    icon: MonitorDot,
    title: "6. Observability & Monitoring",
    timeline: "Ongoing",
    description: "We construct dashboard monitors capturing execution success rates, execution delays, and error lists, with automatic escalation directly to Telegram/Slack.",
    outcomes: ["Live execution telemetry status", "Uptime status notifications", "Execution error triggers"]
  },
  {
    icon: Milestone,
    title: "7. Iteration & Tuning",
    timeline: "Quarterly",
    description: "We review log data to find additional friction points. We update OpenAI models, expand schemas, and connect secondary tools to scale with your organization.",
    outcomes: ["AI classification adjustments", "Data schema updates", "Workforce efficiency audits"]
  }
];

export default function ProcessPage() {
  return (
    <div className="bg-background-app py-16 md:py-24">
      <div className="mx-auto max-w-[760px] px-6">
        {/* Page Header */}
        <div className="mb-16 text-center">
          <span className="font-mono text-label uppercase tracking-wider text-accent-cyan">
            Methodology
          </span>
          <h1 className="mt-3 font-sans text-h1 font-bold text-text-primary">
            Engagement Process
          </h1>
          <p className="mt-4 font-sans text-body text-text-secondary leading-relaxed">
            I follow a rigorous control systems framework to ensure all automations are
            predictable, fail-safe, and require zero manual babysitting.
          </p>
        </div>

        {/* Stages Timeline */}
        <div className="relative border-l border-border-subtle pl-6 space-y-12">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div key={stage.title} className="relative">
                {/* Milestone Dot Indicator */}
                <div className="absolute -left-9.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-border-subtle bg-background-app text-text-muted">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </div>

                {/* Stage detail cards */}
                <div className="rounded-lg border border-border-subtle bg-background-surface/40 p-5 shadow-status">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
                    <h2 className="font-sans text-body font-bold text-text-primary">
                      {stage.title}
                    </h2>
                    <span className="rounded bg-background-elevated px-2 py-0.5 font-mono text-label text-text-muted">
                      {stage.timeline}
                    </span>
                  </div>

                  <p className="mt-3 font-sans text-small text-text-secondary leading-relaxed">
                    {stage.description}
                  </p>

                  <div className="mt-4 border-t border-border-subtle pt-3">
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-text-muted mb-2">
                      Key Deliverables
                    </span>
                    <ul className="grid gap-1.5 sm:grid-cols-2">
                      {stage.outcomes.map((out) => (
                        <li
                          key={out}
                          className="flex items-center gap-2 font-sans text-label text-text-secondary"
                        >
                          <span className="h-1 w-1 rounded-full bg-accent-cyan" />
                          {out}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global callout */}
        <div className="mt-16 rounded-xl border border-border-subtle bg-background-surface p-8 text-center">
          <h2 className="font-sans text-h3 font-bold text-text-primary">
            Ready to begin with Step 1?
          </h2>
          <p className="mt-3 font-sans text-small text-text-secondary leading-relaxed">
            Diagnose your lead flows and software stacks. Fill out our multi-step assessment to get started.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/contact">
              <Button className="font-semibold">Start Free Assessment</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
