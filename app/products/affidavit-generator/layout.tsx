import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CAA Affidavit Generator — Mithun Das AI Automation",
  description:
    "Citizenship Amendment Act (CAA) Schedule 1-C court affidavit generator with character witness and naturalization oath. Powered by Mithun Das AI Automation.",
  openGraph: {
    title: "CAA Affidavit Generator — Mithun Das AI Automation",
    description:
      "Instant court-ready CAA legal affidavits. Credit-based pricing starting at ₹9.",
    url: "https://mithundas.cloud/products/affidavit-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAA Affidavit Generator — Mithun Das AI Automation",
    description:
      "Instant court-ready CAA legal affidavits. Credit-based pricing starting at ₹9.",
  },
};

export default function AffidavitProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen bg-[#0E131F]">{children}</main>;
}
