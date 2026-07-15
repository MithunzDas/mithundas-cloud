"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Copy,
  AlertTriangle,
  EyeOff,
  RefreshCcw,
  MessageSquareOff,
} from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Slow Follow-Up",
    description:
      "Leads wait hours for a response because routing depends on someone checking a shared inbox.",
    color: "text-accent-red",
    bgColor: "bg-accent-red/8",
    borderColor: "border-accent-red/15",
  },
  {
    icon: Copy,
    title: "Duplicate Data Entry",
    description:
      "The same customer information is typed into forms, sheets, CRMs, and internal tools by hand.",
    color: "text-accent-amber",
    bgColor: "bg-accent-amber/8",
    borderColor: "border-accent-amber/15",
  },
  {
    icon: AlertTriangle,
    title: "Missed Handoffs",
    description:
      "Work stalls because one team doesn't know the previous step completed. Approvals stay pending.",
    color: "text-accent-amber",
    bgColor: "bg-accent-amber/8",
    borderColor: "border-accent-amber/15",
  },
  {
    icon: EyeOff,
    title: "No Visibility",
    description:
      "Nobody knows if the workflow ran, failed, or is stuck until a customer complains.",
    color: "text-accent-red",
    bgColor: "bg-accent-red/8",
    borderColor: "border-accent-red/15",
  },
  {
    icon: RefreshCcw,
    title: "Brittle Integrations",
    description:
      "Zapier chains break silently. Nobody gets alerted. The fix requires rebuilding the whole flow.",
    color: "text-accent-cyan",
    bgColor: "bg-accent-cyan/8",
    borderColor: "border-accent-cyan/15",
  },
  {
    icon: MessageSquareOff,
    title: "After-Hours Gaps",
    description:
      "Customer inquiries at night or weekends go unanswered until the next business day.",
    color: "text-accent-blue",
    bgColor: "bg-accent-blue/8",
    borderColor: "border-accent-blue/15",
  },
];

export function ProblemMatrixSection() {
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
          <span className="font-mono text-label uppercase tracking-wider text-accent-cyan">
            Operational Friction
          </span>
          <h2 className="mt-3 font-sans text-h2 font-bold text-text-primary md:text-[2.25rem] md:leading-[2.75rem]">
            Does any of this sound familiar?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-body text-text-secondary">
            These patterns appear in every business that has grown beyond what manual
            processes can handle reliably.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group rounded-lg border ${problem.borderColor} ${problem.bgColor} p-5 transition-all duration-200 hover:border-border-default`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${problem.bgColor}`}>
                    <Icon className={`h-4 w-4 ${problem.color}`} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-sans text-body font-semibold text-text-primary">
                      {problem.title}
                    </h3>
                    <p className="mt-1.5 font-sans text-small text-text-muted leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
