import { HeroSection } from "@/features/lead-intake/hero-section";
import { ProblemMatrixSection } from "@/features/lead-intake/problem-matrix-section";
import { SystemsPreviewSection } from "@/features/lead-intake/systems-preview-section";
import { ArchitecturePreviewSection } from "@/features/lead-intake/architecture-preview-section";
import { FAQSection } from "@/features/lead-intake/faq-section";
import { CTASection } from "@/features/lead-intake/cta-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Business Automation Engineer — Mithun Das",
  description:
    "Operational AI systems for businesses that have outgrown manual workflows. Automation architectures connecting CRM, WhatsApp, email, AI assistants into reliable workflows.",
  openGraph: {
    title: "Mithun Das — AI Business Automation Engineer",
    description:
      "Operational AI systems for businesses that have outgrown manual workflows.",
    url: "https://mithundas.cloud",
  },
};

export default function MarketingHomePage() {
  return (
    <>
      <HeroSection />
      <ProblemMatrixSection />
      <SystemsPreviewSection />
      <ArchitecturePreviewSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
