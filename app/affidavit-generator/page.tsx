"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Zap,
  Edit3,
  Download,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Check,
  Lock,
  CreditCard,
} from "lucide-react";

/* ─── Pricing Plans ─── */
const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    credits: 9,
    perAffidavit: "₹3",
    badge: "First-Time Only",
    badgeColor: "from-amber-500 to-orange-500",
    description: "Try it out — generate 3 affidavits",
    highlight: false,
    firstTimeOnly: true,
  },
  {
    id: "basic",
    name: "Basic",
    price: 49,
    credits: 49,
    perAffidavit: "₹3",
    badge: null,
    badgeColor: "",
    description: "Perfect for individual advocates",
    highlight: false,
    firstTimeOnly: false,
  },
  {
    id: "pro",
    name: "Professional",
    price: 99,
    credits: 99,
    perAffidavit: "₹3",
    badge: "Most Popular",
    badgeColor: "from-accent-cyan to-blue-500",
    description: "Best for active practitioners",
    highlight: true,
    firstTimeOnly: false,
  },
  {
    id: "bulk",
    name: "Bulk",
    price: 499,
    credits: 599,
    perAffidavit: "₹2.50",
    badge: "Best Value",
    badgeColor: "from-emerald-500 to-green-500",
    description: "Ideal for cyber cafes & law firms",
    highlight: false,
    firstTimeOnly: false,
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Fill in details, get a court-ready affidavit in seconds. No software to install.",
  },
  {
    icon: FileText,
    title: "Court-Formatted",
    description:
      "Proper legal formatting with correct court headers, margins, and oath declarations.",
  },
  {
    icon: Edit3,
    title: "Editable Preview",
    description:
      "Review and edit every field in a live preview before downloading. Full control.",
  },
  {
    icon: Download,
    title: "PDF Export",
    description:
      "Download clean, print-ready PDFs. No watermarks. Ready for court submission.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "256-bit encryption. Your data is never stored on our servers after download.",
  },
  {
    icon: Clock,
    title: "Credit-Based",
    description:
      "Pay per page. 1 credit = 1 page. A 3-page affidavit = 3 credits. Simple.",
  },
];

const AFFIDAVIT_TYPES = [
  {
    name: "CAA Citizenship Affidavit",
    subtitle: "SCHEDULE-1C with character witness & naturalization oath",
    status: "active",
    pages: 3,
  },
  {
    name: "Rent Agreement Affidavit",
    subtitle: "Standard rental agreement with stamp duty provisions",
    status: "coming_soon",
    pages: 4,
  },
  {
    name: "General Court Affidavit",
    subtitle: "Customizable affidavit for any court proceeding",
    status: "coming_soon",
    pages: 2,
  },
  {
    name: "Self-Declaration Affidavit",
    subtitle: "Identity, address & income self-declaration",
    status: "coming_soon",
    pages: 1,
  },
];

/* ─── Animations ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function AffidavitGeneratorPage() {
  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState(true);

  useEffect(() => {
    const hasPurchased = localStorage.getItem("affidavit_first_purchase_done");
    if (hasPurchased === "true") {
      setIsFirstTimeVisitor(false);
    }
  }, []);

  const visiblePlans = isFirstTimeVisitor
    ? PLANS
    : PLANS.filter((p) => !p.firstTimeOnly);

  return (
    <div className="min-h-screen bg-background-app">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden border-b border-border-subtle">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(0, 198, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 198, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent-cyan/5 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/5 blur-[120px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-accent-cyan" />
              <span className="font-mono text-[12px] font-medium uppercase tracking-wider text-accent-cyan">
                Legal Document Automation
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="mx-auto max-w-3xl font-sans text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-text-primary"
            >
              Court-Ready Affidavits
              <br />
              <span className="bg-gradient-to-r from-accent-cyan to-blue-400 bg-clip-text text-transparent">
                Generated Instantly
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="mx-auto mt-5 max-w-xl font-sans text-body text-text-secondary leading-relaxed"
            >
              Fill in your details. Preview & edit in real-time. Download court-formatted PDFs.
              Built for advocates, law firms & cyber cafes across India.
            </motion.p>

            {/* Trust Badges */}
            <motion.div variants={fadeInUp} className="mt-8 flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background-surface/50 px-3 py-1.5">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-mono text-[11px] text-text-tertiary">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background-surface/50 px-3 py-1.5">
                <CreditCard className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-mono text-[11px] text-text-tertiary">Razorpay Secure</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background-surface/50 px-3 py-1.5">
                <Shield className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-mono text-[11px] text-text-tertiary">Data Not Stored</span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <a href="#pricing" className="inline-flex items-center gap-2 rounded-lg bg-accent-cyan px-6 py-3 font-sans text-[15px] font-semibold text-background-app transition-all hover:bg-accent-cyan/90 hover:shadow-[0_0_24px_rgba(0,198,255,0.3)]">
                Buy Credits & Start
                <ChevronRight className="h-4 w-4" />
              </a>
              <a href="#affidavit-types" className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-background-surface px-6 py-3 font-sans text-[15px] font-medium text-text-secondary transition-all hover:text-text-primary hover:border-text-tertiary">
                View Affidavit Types
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section className="border-b border-border-subtle py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <span className="font-mono text-[12px] font-medium uppercase tracking-wider text-accent-cyan">
                How it works
              </span>
              <h2 className="mt-3 font-sans text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-text-primary">
                From Form to Court in Minutes
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="group relative rounded-xl border border-border-subtle bg-background-surface p-6 transition-all duration-300 hover:border-accent-cyan/30 hover:bg-background-elevated"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-cyan/10 text-accent-cyan transition-colors group-hover:bg-accent-cyan/20">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-sans text-[16px] font-semibold text-text-primary">{feature.title}</h3>
                  <p className="mt-2 font-sans text-small text-text-secondary leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── AFFIDAVIT TYPES ───────── */}
      <section id="affidavit-types" className="border-b border-border-subtle py-20 scroll-mt-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <span className="font-mono text-[12px] font-medium uppercase tracking-wider text-accent-cyan">
                Available Templates
              </span>
              <h2 className="mt-3 font-sans text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-text-primary">
                Choose Your Affidavit Type
              </h2>
              <p className="mt-3 mx-auto max-w-lg text-text-secondary text-body">
                Start with CAA Citizenship Affidavit. More templates launching soon for advocates and legal professionals.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {AFFIDAVIT_TYPES.map((type) => (
                <motion.div
                  key={type.name}
                  variants={fadeInUp}
                  className={`relative rounded-xl border p-6 transition-all duration-300 ${
                    type.status === "active"
                      ? "border-accent-cyan/40 bg-accent-cyan/5 hover:border-accent-cyan/60"
                      : "border-border-subtle bg-background-surface opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <FileText className={`h-5 w-5 ${type.status === "active" ? "text-accent-cyan" : "text-text-tertiary"}`} />
                        <h3 className="font-sans text-[16px] font-semibold text-text-primary">{type.name}</h3>
                      </div>
                      <p className="mt-2 ml-8 font-sans text-small text-text-secondary">{type.subtitle}</p>
                      <p className="mt-1 ml-8 font-mono text-[12px] text-text-tertiary">{type.pages} pages · {type.pages} credits</p>
                    </div>
                    {type.status === "active" ? (
                      <span className="rounded-full bg-accent-cyan/10 px-3 py-1 font-mono text-[11px] font-medium text-accent-cyan">
                        Available
                      </span>
                    ) : (
                      <span className="rounded-full bg-background-elevated px-3 py-1 font-mono text-[11px] font-medium text-text-tertiary">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  {type.status === "active" && (
                    <div className="mt-4 ml-8">
                      <Link
                        href="/affidavit-generator/generate"
                        className="inline-flex items-center gap-1.5 font-sans text-small font-medium text-accent-cyan transition-colors hover:text-accent-cyan/80"
                      >
                        Generate Now <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── PRICING ───────── */}
      <section id="pricing" className="py-20 scroll-mt-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <span className="font-mono text-[12px] font-medium uppercase tracking-wider text-accent-cyan">
                Simple Pricing
              </span>
              <h2 className="mt-3 font-sans text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-text-primary">
                1 Credit = 1 Page. That&apos;s It.
              </h2>
              <p className="mt-3 mx-auto max-w-lg text-text-secondary text-body">
                Buy credits, generate affidavits. A 3-page CAA affidavit costs 3 credits.
                No subscriptions. No hidden fees.
              </p>
            </motion.div>

            <div className={`grid grid-cols-1 gap-5 ${visiblePlans.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3 max-w-4xl mx-auto"}`}>
              {visiblePlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={fadeInUp}
                  className={`relative flex flex-col rounded-xl border p-6 transition-all duration-300 ${
                    plan.highlight
                      ? "border-accent-cyan/50 bg-accent-cyan/5 shadow-[0_0_40px_rgba(0,198,255,0.08)]"
                      : "border-border-subtle bg-background-surface hover:border-accent-cyan/20"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r ${plan.badgeColor} px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white whitespace-nowrap`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="mt-2">
                    <h3 className="font-sans text-[15px] font-semibold text-text-primary">{plan.name}</h3>
                    <p className="mt-1 font-sans text-[12px] text-text-tertiary">{plan.description}</p>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-baseline gap-1">
                      <span className="font-sans text-[32px] font-bold text-text-primary">₹{plan.price}</span>
                    </div>
                    <p className="mt-1 font-mono text-[12px] text-text-tertiary">
                      {plan.credits} credits · {plan.perAffidavit}/affidavit
                    </p>
                  </div>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span className="font-sans text-small text-text-secondary">{plan.credits} credits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span className="font-sans text-small text-text-secondary">~{Math.floor(plan.credits / 3)} CAA affidavits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span className="font-sans text-small text-text-secondary">PDF download</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span className="font-sans text-small text-text-secondary">Editable preview</span>
                    </li>
                  </ul>

                  <Link
                    href={`/affidavit-generator/generate?plan=${plan.id}`}
                    className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-sans text-[14px] font-semibold transition-all ${
                      plan.highlight
                        ? "bg-accent-cyan text-background-app hover:bg-accent-cyan/90 hover:shadow-[0_0_20px_rgba(0,198,255,0.3)]"
                        : "border border-border-subtle bg-background-elevated text-text-primary hover:border-accent-cyan/30 hover:text-accent-cyan"
                    }`}
                  >
                    Get {plan.name}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Credit info */}
            <motion.div variants={fadeInUp} className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 rounded-xl border border-border-subtle bg-background-surface px-6 py-3">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="font-sans text-small text-text-secondary">
                  Credits never expire. Use them anytime, on any affidavit type.
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
