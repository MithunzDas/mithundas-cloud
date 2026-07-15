import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatbotPanel } from "@/features/chatbot/chatbot-panel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Mithun Das — AI Business Automation",
    default: "Mithun Das — AI Business Automation Engineer",
  },
  description:
    "Operational AI systems for businesses that have outgrown manual workflows. I design automation architectures that connect your CRM, forms, WhatsApp, email, and AI assistants into reliable business workflows.",
  keywords: [
    "AI business automation",
    "workflow automation",
    "WhatsApp automation",
    "n8n consultant",
    "AI customer support",
    "CRM automation",
    "API integration",
    "business process automation",
  ],
  authors: [{ name: "Mithun Das" }],
  creator: "Mithun Das",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mithundas.cloud",
    siteName: "Mithun Das — AI Business Automation",
    title: "Mithun Das — AI Business Automation Engineer",
    description:
      "Operational AI systems for businesses that have outgrown manual workflows.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mithun Das — AI Business Automation Engineer",
    description:
      "Operational AI systems for businesses that have outgrown manual workflows.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatbotPanel />
    </>
  );
}
