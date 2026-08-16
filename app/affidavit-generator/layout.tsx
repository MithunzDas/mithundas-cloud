import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Affidavit Generator — Instant Court-Ready Documents",
  description:
    "Generate court-ready legal affidavits instantly. CAA citizenship affidavits, rent agreements, and more. Powered by Mithun Das Cloud.",
  openGraph: {
    title: "Legal Affidavit Generator — Mithun Das Cloud",
    description:
      "Generate court-ready legal affidavits instantly. Credit-based pricing starting at ₹9.",
    url: "https://mithundas.cloud/affidavit-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Legal Affidavit Generator — Mithun Das Cloud",
    description:
      "Generate court-ready legal affidavits instantly. Credit-based pricing starting at ₹9.",
  },
};

export default function AffidavitGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen bg-[#0E131F]">{children}</main>;
}
