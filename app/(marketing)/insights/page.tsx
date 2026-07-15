import type { Metadata } from "next";
import { BookOpen, Calendar, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Automation Playbooks & Insights",
  description:
    "Authoritative playbooks on n8n workflow design, WhatsApp Cloud API integrations, AI support guardrails, and lead scoring pipelines.",
};

const insights = [
  {
    title: "How to automate lead follow-up with WhatsApp and AI",
    slug: "whatsapp-lead-follow-up-ai",
    date: "July 12, 2026",
    readTime: "6 min read",
    author: "Mithun Das",
    category: "WhatsApp API",
    summary: "Discover how to integrate Meta's WhatsApp Cloud API with Next.js webhooks and OpenAI GPT to automate incoming lead qualifiers, response messaging, and admin escalation alerts.",
  },
  {
    title: "When to use n8n instead of custom code for automations",
    slug: "n8n-vs-custom-code",
    date: "June 28, 2026",
    readTime: "8 min read",
    author: "Mithun Das",
    category: "Workflow Design",
    summary: "A technical evaluation of when visual workflow engines like self-hosted n8n outperform hardcoded Node.js API loops, and when to combine both for resilient data routing.",
  },
  {
    title: "Why AI support assistants need deterministic escalation rules",
    slug: "ai-assistants-escalation-rules",
    date: "June 14, 2026",
    readTime: "5 min read",
    author: "Mithun Das",
    category: "AI Operations",
    summary: "Why pure RAG chat systems fail customer expectations. Learn how to design logic boundaries that route complex customer queries out of AI context loops straight into support tickets.",
  },
  {
    title: "How to design observable workflows that fail gracefully",
    slug: "designing-observable-workflows",
    date: "May 30, 2026",
    readTime: "7 min read",
    author: "Mithun Das",
    category: "Reliability",
    summary: "A blueprint for adding logging telemetry, automated retries, and error alert webhooks to n8n processes so that integrations never break silently.",
  },
  {
    title: "Google Sheets as an MVP database for business operations",
    slug: "google-sheets-mvp-database",
    date: "May 15, 2026",
    readTime: "5 min read",
    author: "Mithun Das",
    category: "Data Layer",
    summary: "Why we start early integration phases using Google Sheets, how to configure fields to prevent data corruption, and when to transition the storage layer to Supabase or MongoDB.",
  }
];

export default function InsightsPage() {
  return (
    <div className="bg-background-app py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header Block */}
        <div className="mb-16 text-center">
          <span className="font-mono text-label uppercase tracking-wider text-accent-cyan">
            Automation Playbooks
          </span>
          <h1 className="mt-3 font-sans text-h1 font-bold text-text-primary md:text-[3rem]">
            Insights & Guides
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-body text-text-secondary">
            Technical breakdowns, workflow strategies, and implementation guides for operational AI and API integration systems.
          </p>
        </div>

        {/* Insights list */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((item) => (
            <article
              key={item.slug}
              className="flex flex-col rounded-xl border border-border-subtle bg-background-surface/70 p-6 shadow-panel backdrop-blur-md transition-all duration-base hover:border-accent-cyan/30"
            >
              {/* Category & Read time indicators */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="rounded bg-accent-cyan/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-accent-cyan tracking-wider uppercase">
                  {item.category}
                </span>
                <span className="font-mono text-label text-text-muted">
                  {item.readTime}
                </span>
              </div>

              {/* Title & summary */}
              <h2 className="mt-4 font-sans text-body font-bold text-text-primary leading-snug hover:text-accent-cyan">
                <Link href={`/insights/${item.slug}`}>{item.title}</Link>
              </h2>

              <p className="mt-3 font-sans text-small text-text-muted leading-relaxed flex-1">
                {item.summary}
              </p>

              {/* Author & date metadata */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-border-subtle">
                <div className="flex items-center gap-1.5 font-mono text-label text-text-muted">
                  <User className="h-3 w-3" />
                  {item.author}
                </div>
                <div className="flex items-center gap-1.5 font-mono text-label text-text-muted">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href={`/insights/${item.slug}`}
                  className="inline-flex items-center gap-1.5 font-sans text-small font-semibold text-accent-cyan hover:text-accent-cyan/85"
                >
                  Read Playbook
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Playbook Newsletter CTA */}
        <div className="mt-20 rounded-xl border border-border-subtle bg-background-surface p-8 text-center md:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-cyan/10">
            <BookOpen className="h-6 w-6 text-accent-cyan" />
          </div>
          <h2 className="mt-6 font-sans text-h2 font-bold text-text-primary">
            Get technical playbooks delivered to your inbox
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-body text-text-secondary leading-relaxed">
            Join other business owners and ops managers. Get detailed breakdowns of real-world integrations, API tuning, and n8n scripts.
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
