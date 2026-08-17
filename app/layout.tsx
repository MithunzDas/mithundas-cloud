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
    // Brand & Identity
    "Mithun Das",
    "Mithun Das AI Automation",
    "Mithun Das Engineer",

    // Local & Near Me High-Intent Queries
    "Automation Engineer near me",
    "website developers near me",
    "WhatsApp Meta Developers near me",
    "n8n developers near me",
    "AI chatbot developers near me",
    "web development agency near me",
    "Next.js developer near me",

    // Core AI & Workflow Automation
    "n8n developers",
    "n8n automation agency",
    "n8n automation specialist",
    "AI Business Automation Engineer",
    "AI workflow automation consultant",
    "OpenAI API integration developer",
    "AI Software Development",

    // Communication & Lead Automation
    "WhatsApp API automation expert",
    "WhatsApp Cloud API developer",
    "WhatsApp lead automation",
    "CRM integration developers",
    "lead qualification automation",

    // Full-Stack Systems & Architecture
    "Next.js automation platform",
    "business process automation agency",
    "intelligent document processing",
    "custom API integration specialist",
    "systems architecture engineer",
  ],
  authors: [{ name: "Mithun Das", url: siteUrl }],
  creator: "Mithun Das",
  publisher: "Mithun Das AI Automation",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
