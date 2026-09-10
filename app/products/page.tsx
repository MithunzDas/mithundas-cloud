import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  QrCode,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Printer,
  FileText,
  Clock,
  Layers,
  Building2,
  Briefcase,
  Star,
  Lock,
  ChevronRight,
  Gavel,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Software Products & AI Systems | Mithun Das — AI Automation Engineer",
  description:
    "Explore production-ready vertical AI software products: The 15-Second QR Review Engine for local businesses, and the LexAutomate Legal Document Suite for advocates and legal practitioners.",
  openGraph: {
    title: "Software Products & AI Systems | Mithun Das",
    description:
      "Production-ready software products engineered to eliminate manual bottlenecks, capture verified customer reviews, and automate complex legal documentation.",
    url: "https://mithundas.cloud/products",
  },
};

interface ProductModule {
  name: string;
  status: "live" | "pipeline";
  description: string;
}

interface ProductItem {
  id: string;
  title: string;
  umbrellaName: string;
  tagline: string;
  description: string;
  badge: string;
  targetAudience: string;
  category: string;
  href: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  primaryLabel: string;
  icon: React.ElementType;
  accentColor: "blue" | "amber";
  status: "live" | "coming_soon";
  pricingSnippet: string;
  highlights: string[];
  modulesTitle?: string;
  modulesBadge?: string;
  modules?: ProductModule[];
}

const PRODUCTS: ProductItem[] = [
  {
    id: "qr-review-system",
    title: "The 15-Second QR-Based AI Google Review Engine",
    umbrellaName: "Customer Growth & Reputation SaaS",
    tagline: "Turn physical walk-in traffic into verified 5-star Google reviews in 15 seconds.",
    description:
      "A complete in-person reputation engine built for clinics, salons, gyms, restaurants, and hotels. Customers tap 4 visual chips on their phone, our specialized AI drafts a humanized review in colloquial language, and redirects directly into Google Maps with the 5-star review modal open in 1 tap.",
    badge: "⭐ Growth SaaS · Active",
    targetAudience: "Clinics · Salons · Gyms · Restaurants · Luxury Hotels",
    category: "Google Review Automation",
    href: "/products/theqrbasedsystem",
    secondaryHref: "/products/theqrbasedsystem/onboard",
    secondaryLabel: "3-Day Free Trial (No Card)",
    primaryLabel: "Explore QR Review Engine",
    icon: QrCode,
    accentColor: "blue",
    status: "live",
    pricingSnippet: "$30 / month or $249 / year",
    highlights: [
      "10–15 second customer review completion with zero app downloads",
      "Instant printable A5 counter standees & 4x6\" tent cards with receptionist script",
      "Multi-industry question pools (Dental, Healthcare, Dining, Hospitality, Beauty)",
      "FTC-compliant 1–3 star private feedback capture to protect public ratings",
      "Live analytics dashboard tracking QR scans, conversion rates, and feedback",
    ],
    modulesTitle: "System Components & Deliverables",
    modulesBadge: "All Included",
    modules: [
      {
        name: "10-Second 4-Tap Customer Review Flow",
        status: "live",
        description: "Mobile web app (/r/[slug]): 4-tap visual chips, humanized AI drafting, and 1-tap Google Maps review opening.",
      },
      {
        name: "Printable Counter Standees & Staff Script",
        status: "live",
        description: "Ready-to-print A5 acrylic standees & 4x6\" table tent cards with reception staff 7-word cheat-sheet script.",
      },
      {
        name: "Smart Google Maps Deep-Link Redirector",
        status: "live",
        description: "Direct write-review deep linking with auto-clipboard copy so customer only taps 'Paste' and 'Post' in Google Maps.",
      },
      {
        name: "Live Scan Analytics & FTC Feedback Shield",
        status: "live",
        description: "Real-time scan counter and rating tracking with private resolution routing for 1–3 star complaints.",
      },
    ],
  },
  {
    id: "legal-tech-suite",
    title: "LexAutomate AI — Legal & Court Document Automation Suite",
    umbrellaName: "LegalTech & Court Practice Automation",
    tagline: "High-accuracy court drafting, statutory compliance affidavits, and case workflow automation.",
    description:
      "A specialized legal automation suite engineered for Indian advocates, notaries, law firms, and legal clerks. Eliminates manual typist bottlenecks and formats court-ready affidavits with stamp paper compliance, legal terminology, and notary endorsements.",
    badge: "⚖️ LegalTech Suite · Active",
    targetAudience: "High Court Advocates · District Court Practitioners · Notaries · Law Firms",
    category: "Legal & Court Documentation",
    href: "/products/affidavit-generator",
    secondaryHref: "/products/affidavit-generator",
    secondaryLabel: "Open Affidavit Generator",
    primaryLabel: "Launch Legal Suite (Affidavit Generator)",
    icon: Scale,
    accentColor: "amber",
    status: "live",
    pricingSnippet: "Pay-per-document credits (Starting at ₹9)",
    highlights: [
      "Instant court-ready formatting matching High Court and District Court filing standards",
      "Automated character witness, naturalization oath, and notary affirmation generation",
      "Credit-based pay-per-use model with zero monthly lock-in or recurring fees",
      "Razorpay instant payment verification with automated credit delivery",
      "Extensible modular architecture ready for additional practice workflows",
    ],
    modulesTitle: "Suite Modules & Roadmap",
    modulesBadge: "Multi-Product Hub",
    modules: [
      {
        name: "CAA & Court Affidavit Generator",
        status: "live",
        description: "Active tool: Schedule 1-C court affidavits, character witness statements, and naturalization oaths.",
      },
      {
        name: "Section 65B Electronic Evidence Certifier",
        status: "pipeline",
        description: "Statutory compliance certificates for WhatsApp chats, call recordings, and CCTV digital evidence.",
      },
      {
        name: "Legal Notice & Demand Letter Drafter",
        status: "pipeline",
        description: "Instant drafting for Section 138 NI Act cheque bounce, eviction, and contract breach notices.",
      },
      {
        name: "Bail Petition & Vakalatnama Builder",
        status: "pipeline",
        description: "Formatted court filing templates with automated party and advocate details.",
      },
    ],
  },
];

export default function ProductsCatalogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Production Software Products by Mithun Das</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Vertical AI Systems Engineered for <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">Direct Business Leverage</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Standalone, production-grade software applications built to solve acute workflow bottlenecks. Each product operates independently with dedicated infrastructure, payment gateways, and automated fulfillment.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {PRODUCTS.map((product) => {
              const Icon = product.icon;
              const isBlue = product.accentColor === "blue";

              return (
                <div
                  key={product.id}
                  className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden backdrop-blur-sm ${
                    isBlue
                      ? "bg-slate-900/80 border-slate-800 hover:border-blue-500/40 shadow-xl shadow-blue-500/5"
                      : "bg-slate-900/80 border-slate-800 hover:border-amber-500/40 shadow-xl shadow-amber-500/5"
                  }`}
                >
                  {/* Background Ambient Glow */}
                  <div
                    className={`absolute -right-20 -top-20 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-20 ${
                      isBlue ? "bg-blue-600" : "bg-amber-600"
                    }`}
                  />

                  {/* Top Card Content */}
                  <div className="space-y-6 relative z-10">
                    {/* Badges & Icon */}
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${
                          isBlue
                            ? "bg-blue-600/10 border-blue-500/30 text-blue-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {product.badge}
                        </span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                        {product.umbrellaName}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {product.title}
                      </h2>
                      <p className={`text-xs sm:text-sm font-medium ${isBlue ? "text-blue-300/90" : "text-amber-300/90"}`}>
                        {product.tagline}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Highlights List */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                      <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                        Core Capabilities:
                      </p>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {product.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-snug">
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                isBlue ? "text-emerald-400" : "text-amber-400"
                              }`}
                            />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Modular Suite Architecture */}
                    {product.modules && product.modules.length > 0 && (
                      <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className={`w-3.5 h-3.5 ${isBlue ? "text-blue-400" : "text-amber-400"}`} />
                            {product.modulesTitle || "System Modules & Architecture:"}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {product.modulesBadge || "Included"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {product.modules.map((module, mIdx) => (
                            <div
                              key={mIdx}
                              className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2 ${
                                module.status === "live"
                                  ? isBlue
                                    ? "bg-slate-950/80 border-blue-500/30 text-slate-200"
                                    : "bg-slate-950/80 border-emerald-500/30 text-slate-200"
                                  : "bg-slate-950/40 border-slate-800 text-slate-400"
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-white">
                                    {module.name}
                                  </span>
                                  {module.status === "live" ? (
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                        isBlue
                                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                          : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                      }`}
                                    >
                                      LIVE NOW
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                      PIPELINE
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 leading-tight">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-6 mt-6 border-t border-slate-800 relative z-10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Target Users:</span>
                      <span className="font-mono text-slate-200 text-[11px] font-medium">
                        {product.targetAudience}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Pricing Model:</span>
                      <span className="font-semibold text-emerald-400 font-mono">
                        {product.pricingSnippet}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                      <Link
                        href={product.href}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                          isBlue
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/20"
                            : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold shadow-amber-600/20"
                        }`}
                      >
                        <span>{product.primaryLabel}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      {product.secondaryHref && (
                        <Link
                          href={product.secondaryHref}
                          className="py-3 px-4 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>{product.secondaryLabel || "Learn More"}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Future Expansion Callout */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-3">
            <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Have a Custom Automation or SaaS Requirement?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              In addition to vertical software products, I engineer enterprise bespoke workflow automations connecting CRM, WhatsApp, LLM agents, and custom APIs for growth-stage businesses.
            </p>
            <div className="pt-2">
              <Link
                href="/book"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <span>Book a Technical Architecture Call</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
