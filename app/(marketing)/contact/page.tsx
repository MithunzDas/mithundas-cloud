import { LeadAssessmentForm } from "@/components/forms/lead-assessment-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Automation Assessment",
  description:
    "Complete our structured questionnaire detailing your current workflows, software systems, and target automation outcomes. You will receive a technical audit & proposed n8n workflow architecture.",
};

export default function ContactPage() {
  return (
    <div className="bg-background-app py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12 text-center">
          <span className="font-mono text-label uppercase tracking-wider text-accent-cyan">
            Lead Qualification Intake
          </span>
          <h1 className="mt-3 font-sans text-h1 font-bold text-text-primary md:text-[2.5rem]">
            Start Automation Assessment
          </h1>
          <p className="mx-auto mt-3 max-w-xl font-sans text-body text-text-secondary">
            Provide details about your operational processes. You will receive a proposed system architecture,
            tool recommendations, and next action parameters.
          </p>
        </div>

        <div className="border-t border-border-subtle pt-10">
          <LeadAssessmentForm />
        </div>
      </div>
    </div>
  );
}
