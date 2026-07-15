import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Agreement rules for using the mithundas.cloud automation diagnostic consoles and integration blueprint assessments.",
};

export default function TermsPage() {
  return (
    <div className="bg-background-app py-16 md:py-24">
      <div className="mx-auto max-w-[760px] px-6">
        <h1 className="font-sans text-h1 font-bold text-text-primary mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-invert font-sans text-body text-text-secondary space-y-6 leading-relaxed">
          <p className="font-mono text-label text-text-muted">Last Updated: July 15, 2026</p>
          
          <p>
            Welcome to mithundas.cloud. By utilizing our workflow demo console, chatbot systems, or
            submitting lead assessment records, you agree to these operational terms.
          </p>

          <h2 className="font-sans text-h3 font-bold text-text-primary pt-4">1. Permitted Use</h2>
          <p>
            The Workflow Demo is a simulated control panel environment designed exclusively to prove
            integration pipeline concepts. You must not input malicious code payloads, executable
            strings, or spam inputs to any API gateway interfaces.
          </p>

          <h2 className="font-sans text-h3 font-bold text-text-primary pt-4">2. Intellectual Property</h2>
          <p>
            All custom n8n configurations, visual design systems, pipeline diagrams, and source
            code architectures hosted on this domain are owned by Mithun Das. Reference blueprints
            are provided as conceptual resources.
          </p>

          <h2 className="font-sans text-h3 font-bold text-text-primary pt-4">3. Disclaimers</h2>
          <p>
            We do not guarantee specific business metrics, exact sales outcomes, or custom SaaS API
            performance prior to execution of a formal diagnostic statement and systems checklist.
          </p>
        </div>
      </div>
    </div>
  );
}
