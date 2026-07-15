import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn about how Mithun Das AI Automation platforms capture, protect, and process project parameters, contact emails, and integration logs.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-background-app py-16 md:py-24">
      <div className="mx-auto max-w-[760px] px-6">
        <h1 className="font-sans text-h1 font-bold text-text-primary mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-invert font-sans text-body text-text-secondary space-y-6 leading-relaxed">
          <p className="font-mono text-label text-text-muted">Last Updated: July 15, 2026</p>
          
          <p>
            At mithundas.cloud, we take data security and privacy seriously. As an automation firm,
            we are committed to ensuring your operational metadata and client details are secure.
          </p>

          <h2 className="font-sans text-h3 font-bold text-text-primary pt-4">1. Data Ingestion</h2>
          <p>
            When you complete an assessment form or engage with our chatbot systems, we collect the
            following fields: Full Name, Email Address, WhatsApp phone number, Company Name,
            Business Category, Budget requirements, and operational bottlenecks details.
          </p>

          <h2 className="font-sans text-h3 font-bold text-text-primary pt-4">2. Processing & Handoff</h2>
          <p>
            All submitted payloads are verified using Zod schema constraints. Form entries are
            signed via cryptographic HMAC parameters before handoff to our self-hosted n8n
            orchestrator instances. We do not expose API endpoints or internal databases to public networks.
          </p>

          <h2 className="font-sans text-h3 font-bold text-text-primary pt-4">3. Data Retainment</h2>
          <p>
            Assessment records are safely retained in private worksheet logs on Google Sheets to
            enable initial configuration analysis. You may request the deletion of your logs or
            data by contacting hello@mithundas.cloud at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
