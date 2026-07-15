import { WorkflowDemo } from "@/features/workflow-demo/workflow-demo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Workflow Demo",
  description:
    "Test run our simulated automation pipeline. Provide custom parameters to see real-time schema validation, lead scoring, OpenAI intent synthesis, and notification dispatch logs.",
};

export default function DemoPage() {
  return (
    <div className="bg-background-app py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12 text-center md:text-left">
          <span className="font-mono text-label uppercase tracking-wider text-accent-cyan">
            Interactive Console
          </span>
          <h1 className="mt-3 font-sans text-h1 font-bold text-text-primary md:text-[2.5rem] md:leading-[3rem]">
            Workflow Orchestration Demo
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-body text-text-secondary">
            Simulate a real-time lead ingestion and processing pipeline. Customize the sample
            payload parameters below to test the routing, lead scoring, and AI synthesis engines.
          </p>
        </div>

        <div className="border-t border-border-subtle pt-10">
          <WorkflowDemo />
        </div>
      </div>
    </div>
  );
}
