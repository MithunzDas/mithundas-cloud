"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="bg-background-inset py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-xl border border-border-subtle bg-background-surface p-8 shadow-panel md:p-12"
        >
          {/* Background accent */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent-cyan/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent-green/5 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-cyan/10">
              <Zap className="h-6 w-6 text-accent-cyan" strokeWidth={1.75} />
            </div>

            <h2 className="mt-6 font-sans text-h2 font-bold text-text-primary md:text-[2.25rem] md:leading-[2.75rem]">
              Ready to automate your operations?
            </h2>

            <p className="mx-auto mt-4 max-w-xl font-sans text-body text-text-secondary leading-relaxed">
              Share your current workflow, tools, bottlenecks, timeline, and budget. You will
              receive a structured response with the likely automation approach, integration
              requirements, and next step.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact">
                <Button size="lg" className="gap-2 px-6 text-sm font-semibold">
                  Start Automation Assessment
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 text-sm font-semibold"
                >
                  Run Workflow Demo
                </Button>
              </Link>
            </div>

            <p className="mt-6 font-mono text-label text-text-muted">
              Typical response within 24 hours · No commitment required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
