"use client";

import { FAQAccordion } from "@/components/ui/faq-accordion";
import { motion } from "framer-motion";

const faqItems = [
  {
    question: "Do you build websites or automation systems?",
    answer:
      "The focus is automation systems. The website is only one interface when it supports a workflow such as lead capture, chatbot intake, admin review, or workflow monitoring.",
  },
  {
    question: "Can this connect to my existing CRM?",
    answer:
      "Usually yes, if the CRM has an API, webhook support, Zapier/n8n integration, or export/import workflow. A technical check confirms the best route.",
  },
  {
    question: "Do you use AI everywhere?",
    answer:
      "No. AI is used when it improves classification, summarization, response drafting, extraction, or decision support. Deterministic steps such as validation, routing, and status updates should stay predictable.",
  },
  {
    question: "Can you automate WhatsApp follow-ups?",
    answer:
      "Yes, using WhatsApp Cloud API with approved templates, consent-aware messaging, and status tracking.",
  },
  {
    question: "Why start with Google Sheets?",
    answer:
      "Google Sheets is fast for MVP operations, easy to inspect, and simple to migrate if fields are designed like database columns from the beginning.",
  },
  {
    question: "When should we move to MongoDB?",
    answer:
      "Move when workflows require richer relationships, higher volume, advanced querying, multi-user access, or a SaaS-style account model.",
  },
];

export function FAQSection() {
  return (
    <section className="border-b border-border-subtle bg-background-app py-20 md:py-24">
      <div className="mx-auto max-w-[760px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span className="font-mono text-label uppercase tracking-wider text-accent-amber">
            Frequently Asked
          </span>
          <h2 className="mt-3 font-sans text-h2 font-bold text-text-primary">
            Common questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <FAQAccordion items={faqItems} />
        </motion.div>
      </div>
    </section>
  );
}
