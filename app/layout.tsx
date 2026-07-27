import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mithundas.cloud";

export const metadata: Metadata = {
  title: {
    template: "%s | Mithun Das — AI Business Automation",
    default: "Mithun Das — AI Business Automation Engineer",
  },
  description:
    "Operational AI systems for businesses that have outgrown manual workflows. Automation architectures connecting CRM, WhatsApp, email, and AI assistants into reliable business workflows.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "AI Business Automation",
    "Workflow Automation Engineer",
    "n8n Automation Specialist",
    "WhatsApp Lead Automation",
    "OpenAI API Integration",
    "Systems Architecture",
    "Mithun Das",
    "Next.js Automation Platform",
  ],
  authors: [{ name: "Mithun Das", url: siteUrl }],
  creator: "Mithun Das",
  publisher: "Mithun Das AI Automation",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Mithun Das AI Automation",
    title: "Mithun Das — AI Business Automation Engineer",
    description:
      "Operational AI systems for businesses that have outgrown manual workflows. Enterprise-grade automation architectures.",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Mithun Das AI Automation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mithun Das — AI Business Automation Engineer",
    description:
      "Operational AI systems for businesses that have outgrown manual workflows.",
    images: [`${siteUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Mithun Das AI Automation",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    description:
      "Operational AI systems for businesses that have outgrown manual workflows. Specialized in n8n, OpenAI, WhatsApp API, and Next.js workflow automation.",
    founder: {
      "@type": "Person",
      name: "Mithun Das",
      jobTitle: "AI Business Automation Engineer",
      alumniOf: [
        {
          "@type": "EducationalOrganization",
          name: "Jadavpur University",
        },
        {
          "@type": "EducationalOrganization",
          name: "NIT Warangal",
        },
      ],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kolkata",
      addressCountry: "IN",
    },
    priceRange: "$$",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
