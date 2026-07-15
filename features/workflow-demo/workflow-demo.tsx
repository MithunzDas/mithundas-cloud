"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Webhook,
  ShieldCheck,
  TrendingUp,
  Play,
  Database,
  Sparkles,
  MessageCircle,
  Mail,
  Bell,
  CheckCircle,
  Terminal,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step {
  key: string;
  label: string;
  icon: any;
  status: "idle" | "running" | "success";
  description: string;
}

const initialSteps = [
  {
    key: "webhook",
    label: "Webhook Ingested",
    icon: Webhook,
    status: "idle" as const,
    description: "Webhook handshake verified with HMAC signature validation.",
  },
  {
    key: "validate",
    label: "Zod Sanitization",
    icon: ShieldCheck,
    status: "idle" as const,
    description: "Strict schema verification of contact fields and budget.",
  },
  {
    key: "score",
    label: "Lead Scoring",
    icon: TrendingUp,
    status: "idle" as const,
    description: "Deterministic scoring based on budget, timeline, and company size.",
  },
  {
    key: "trigger",
    label: "n8n Orchestration",
    icon: Play,
    status: "idle" as const,
    description: "Intake workflow triggered on VPS orchestrator.",
  },
  {
    key: "sheets",
    label: "Database Update",
    icon: Database,
    status: "idle" as const,
    description: "Syncing normalized lead details to Google Sheets.",
  },
  {
    key: "ai_summary",
    label: "AI Context Synthesis",
    icon: Sparkles,
    status: "idle" as const,
    description: "OpenAI GPT model compiling intent summary & qualification indicators.",
  },
  {
    key: "whatsapp",
    label: "WhatsApp Dispatch",
    icon: MessageCircle,
    status: "idle" as const,
    description: "Queueing custom template message through WhatsApp Cloud API.",
  },
  {
    key: "email",
    label: "Email Confirmation",
    icon: Mail,
    status: "idle" as const,
    description: "Transactional acknowledgement sent via Resend API.",
  },
  {
    key: "alert",
    label: "Admin Telegram Alert",
    icon: Bell,
    status: "idle" as const,
    description: "Push notification containing AI synthesis routed to engineering.",
  },
  {
    key: "complete",
    label: "Execution Finished",
    icon: CheckCircle,
    status: "idle" as const,
    description: "Workflow metrics saved. Connection closed with HTTP 200.",
  },
];

export function WorkflowDemo() {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [inputName, setInputName] = useState("Jane Doe");
  const [inputCompany, setInputCompany] = useState("Apex Scale");
  const [inputRequirement, setInputRequirement] = useState(
    "Connect WhatsApp Cloud API to HubSpot CRM and use GPT to auto-summarize customer inquiries."
  );
  const [leadScore, setLeadScore] = useState<number | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split("T")[1].slice(0, 8);
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const runDemo = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLeadScore(null);
    setAiSummary(null);
    setLogs([]);
    setSteps(initialSteps.map((s) => ({ ...s, status: "idle" })));

    addLog("⚡ Initializing test pipeline trigger...");

    for (let i = 0; i < initialSteps.length; i++) {
      setActiveStepIndex(i);
      setSteps((prev) =>
        prev.map((step, idx) => (idx === i ? { ...step, status: "running" } : step))
      );

      // Trigger action and logs
      const step = initialSteps[i];
      addLog(`RUNNING: ${step.label}...`);

      // Node custom execution simulation
      switch (step.key) {
        case "webhook":
          await new Promise((r) => setTimeout(r, 900));
          addLog(`✓ HMAC Signature verified. Payload verified for ${inputName} (${inputCompany}).`);
          break;
        case "validate":
          await new Promise((r) => setTimeout(r, 700));
          addLog("✓ Zod schema evaluation succeeded: no fields missing, inputs sanitized.");
          break;
        case "score":
          await new Promise((r) => setTimeout(r, 800));
          const score = Math.floor(Math.random() * 30) + 70; // 70 to 99
          setLeadScore(score);
          addLog(`✓ Lead Scoring complete. Score computed: ${score}/100.`);
          break;
        case "trigger":
          await new Promise((r) => setTimeout(r, 1000));
          addLog("✓ POST handoff webhook acknowledged by n8n orchestrator on hostinger-vps.");
          break;
        case "sheets":
          await new Promise((r) => setTimeout(r, 800));
          addLog(`✓ Google Sheet updated: inserted new row in 'Leads' worksheet.`);
          break;
        case "ai_summary":
          await new Promise((r) => setTimeout(r, 1600));
          setAiSummary(
            `Prospect from ${inputCompany} needs integration of WhatsApp Cloud API with HubSpot CRM. Primary pain point is operational speed. Request contains clear intent and fits custom systems development profile.`
          );
          addLog("✓ OpenAI response compiled context synthesis details.");
          break;
        case "whatsapp":
          await new Promise((r) => setTimeout(r, 900));
          addLog(`✓ WhatsApp Cloud API outbound template dispatched to recipient.`);
          break;
        case "email":
          await new Promise((r) => setTimeout(r, 900));
          addLog(`✓ Resend transactional message sent successfully to email channel.`);
          break;
        case "alert":
          await new Promise((r) => setTimeout(r, 750));
          addLog("✓ Push notification dispatched: Admin alert verified.");
          break;
        case "complete":
          await new Promise((r) => setTimeout(r, 500));
          addLog("✓ Closed event socket stream connection cleanly.");
          break;
      }

      setSteps((prev) =>
        prev.map((step, idx) => (idx === i ? { ...step, status: "success" } : step))
      );
    }

    setActiveStepIndex(null);
    setIsRunning(false);
    addLog("🏁 Pipeline Execution successfully completed.");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Parameters Config Left Column */}
      <div className="flex flex-col gap-4 lg:col-span-4">
        <div className="rounded-lg border border-border-subtle bg-background-surface p-5 shadow-status">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <Sliders className="h-4 w-4 text-accent-cyan" />
            <h3 className="font-mono text-label uppercase tracking-wider text-text-primary">
              Demo Payload Configuration
            </h3>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                Prospect Name
              </label>
              <input
                type="text"
                disabled={isRunning}
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="mt-1.5 w-full rounded border border-border-subtle bg-background-inset px-3 py-2 font-sans text-small text-text-primary outline-none focus:border-accent-cyan disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                Company Name
              </label>
              <input
                type="text"
                disabled={isRunning}
                value={inputCompany}
                onChange={(e) => setInputCompany(e.target.value)}
                className="mt-1.5 w-full rounded border border-border-subtle bg-background-inset px-3 py-2 font-sans text-small text-text-primary outline-none focus:border-accent-cyan disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                Automation Requirement
              </label>
              <textarea
                rows={3}
                disabled={isRunning}
                value={inputRequirement}
                onChange={(e) => setInputRequirement(e.target.value)}
                className="mt-1.5 w-full resize-none rounded border border-border-subtle bg-background-inset px-3 py-2 font-sans text-small text-text-primary outline-none focus:border-accent-cyan disabled:opacity-50"
              />
            </div>

            <Button
              onClick={runDemo}
              disabled={isRunning || !inputName || !inputCompany || !inputRequirement}
              className="mt-2 w-full gap-2 text-sm font-semibold"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running Automation Pipeline...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  Execute Automation Pipeline
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Live Metrics / Outcomes Panel */}
        <AnimatePresence>
          {(leadScore !== null || aiSummary !== null) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg border border-border-subtle bg-background-surface p-5 shadow-status"
            >
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                <Sparkles className="h-4 w-4 text-accent-green" />
                <h3 className="font-mono text-label uppercase tracking-wider text-text-primary">
                  Synthesized Output Node
                </h3>
              </div>

              <div className="mt-4 space-y-4">
                {leadScore !== null && (
                  <div>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                      Calculated Lead Score
                    </span>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="font-sans text-h2 font-bold text-accent-green">
                        {leadScore}
                      </span>
                      <span className="font-mono text-label text-text-muted">/ 100</span>
                      <span className="ml-auto rounded-md border border-accent-green/20 bg-accent-green/10 px-2 py-0.5 font-mono text-[10px] text-accent-green">
                        QUALIFIED
                      </span>
                    </div>
                  </div>
                )}

                {aiSummary !== null && (
                  <div>
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-text-muted">
                      AI Synthesis Context
                    </span>
                    <p className="mt-1.5 rounded border border-border-subtle bg-background-inset p-3 font-sans text-small text-text-secondary leading-relaxed">
                      {aiSummary}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nodes and Timeline Middle Column */}
      <div className="flex flex-col gap-4 lg:col-span-4">
        <div className="rounded-lg border border-border-subtle bg-background-surface p-5 shadow-status">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="font-mono text-label uppercase tracking-wider text-text-primary">
              Pipeline Execution Stack
            </h3>
            {isRunning && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-accent-cyan">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-40" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                </span>
                PROCESSING
              </span>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = activeStepIndex === idx;
              const isFinished = step.status === "success";

              return (
                <div
                  key={step.key}
                  className={cn(
                    "flex items-start gap-3 rounded-md border p-3 transition-colors duration-base",
                    isCurrent
                      ? "border-accent-cyan/35 bg-accent-cyan/8"
                      : isFinished
                      ? "border-accent-green/15 bg-accent-green/4"
                      : "border-border-subtle bg-background-inset/40"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-md border transition-colors",
                      isCurrent
                        ? "border-accent-cyan/25 bg-accent-cyan/15 text-accent-cyan"
                        : isFinished
                        ? "border-accent-green/20 bg-accent-green/10 text-accent-green"
                        : "border-border-subtle bg-background-elevated text-text-muted"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block font-sans text-small font-semibold leading-none",
                        isCurrent
                          ? "text-accent-cyan"
                          : isFinished
                          ? "text-accent-green"
                          : "text-text-primary"
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="mt-1 block font-sans text-label text-text-muted leading-tight">
                      {step.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Terminal Logs Right Column */}
      <div className="flex flex-col gap-4 lg:col-span-4">
        <div className="flex flex-1 flex-col rounded-lg border border-border-subtle bg-background-surface shadow-status">
          {/* Terminal Title Bar */}
          <div className="flex items-center gap-2 border-b border-border-subtle bg-background-inset px-4 py-3">
            <Terminal className="h-4 w-4 text-text-muted" />
            <span className="font-mono text-label uppercase tracking-wider text-text-primary">
              Log Stream Terminal
            </span>
            <div className="ml-auto flex gap-1">
              <span className="h-2 w-2 rounded-full bg-border-strong" />
              <span className="h-2 w-2 rounded-full bg-border-strong" />
              <span className="h-2 w-2 rounded-full bg-border-strong" />
            </div>
          </div>

          {/* Terminal Window Content */}
          <div className="flex-1 overflow-y-auto bg-[#070A0F] p-4 font-mono text-label text-text-secondary leading-relaxed">
            <div className="space-y-1.5 min-h-[300px]">
              {logs.length === 0 ? (
                <span className="italic text-text-muted">
                  Terminal standby. Trigger the test pipeline from the configuration panel to output streaming logs.
                </span>
              ) : (
                logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "break-all",
                      log.includes("RUNNING:")
                        ? "text-accent-cyan"
                        : log.includes("✓")
                        ? "text-accent-green"
                        : log.includes("🏁") || log.includes("⚡")
                        ? "text-accent-amber"
                        : "text-text-secondary"
                    )}
                  >
                    {log}
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
