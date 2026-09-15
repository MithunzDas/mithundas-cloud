"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Star,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Building2,
  Printer,
  ChevronRight,
  ExternalLink,
  Copy,
  Users,
  Lock,
  DollarSign,
  HelpCircle,
  CreditCard,
  Globe,
  Mail,
  GraduationCap,
  Award
} from "lucide-react";
import { INDUSTRY_QUESTION_POOLS } from "@/lib/qr-review/question-pools";
import QuestionPoolExplorer from "@/components/qr-review/QuestionPoolExplorer";
import { getCheckoutUrl, QR_REVIEW_PLANS } from "@/lib/qr-review/payment-config";
import OwnerAuthModal from "@/components/qr-review/OwnerAuthModal";

export default function SalesPageClient() {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState("DENTIST");
  const [demoRating, setDemoRating] = useState(5);
  const [demoSelections, setDemoSelections] = useState<Record<string, string>>({});
  const [isDemoDrafting, setIsDemoDrafting] = useState(false);
  const [demoDraftedReview, setDemoDraftedReview] = useState<string | null>(null);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");

  // Owner Auth State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [ownerSession, setOwnerSession] = useState<{ email: string; name?: string; slug?: string } | null>(null);

  useEffect(() => {
    // Check if owner already has active session
    fetch("/api/qr-review/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.owner?.businesses?.length > 0) {
          setOwnerSession({
            email: data.owner.email,
            name: data.owner.name,
            slug: data.owner.businesses[0].slug,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (showPaymentModal && typeof window !== "undefined") {
      // @ts-expect-error LemonSqueezy global
      window.createLemonSqueezy?.();
    }
  }, [showPaymentModal]);

  const handleAuthSuccess = (owner: {
    email: string;
    name?: string;
    businesses: Array<{ id: string; slug: string; businessName: string; category?: string; trialStatus: string }>;
  }) => {
    if (owner.businesses && owner.businesses.length > 0) {
      router.push(`/products/theqrbasedsystem/dashboard/${owner.businesses[0].slug}`);
    } else {
      router.push("/products/theqrbasedsystem/onboard");
    }
  };

  const activeIndustry = INDUSTRY_QUESTION_POOLS[selectedIndustry] || INDUSTRY_QUESTION_POOLS.DENTIST;

  const handleDemoSelectChip = (qId: string, label: string) => {
    setDemoSelections((prev) => ({
      ...prev,
      [qId]: label,
    }));
  };

  const handleRunDemoDraft = async () => {
    setIsDemoDrafting(true);
    try {
      const answers = Object.entries(demoSelections).map(([qId, ans]) => {
        const q = activeIndustry.questions.find((x) => x.id === qId);
        return {
          question: q?.question || "Service aspect",
          answer: ans,
        };
      });

      const res = await fetch("/api/qr-review/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: activeIndustry.defaultPlaceHolder,
          category: activeIndustry.id,
          city: "New York",
          answers,
          ratingScore: demoRating,
        }),
      });

      const data = await res.json();
      if (data.success && data.reviewText) {
        setDemoDraftedReview(data.reviewText);
      } else {
        setDemoDraftedReview(activeIndustry.sampleReview);
      }
    } catch {
      setDemoDraftedReview(activeIndustry.sampleReview);
    } finally {
      setIsDemoDrafting(false);
    }
  };

  const handleOpenCheckout = (plan: "monthly" | "annual") => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600/30 selection:text-blue-200">
      {/* TOP NOTIFICATION BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 border-b border-blue-500/30 py-2.5 px-4 text-center text-xs font-semibold text-blue-200 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Try it 100% Free on Your Reception Desk for 3 Days — No Credit Card Required</span>
        <Link
          href="/products/theqrbasedsystem/onboard"
          className="underline font-bold text-white hover:text-amber-300 ml-1 inline-flex items-center gap-0.5"
        >
          Get Standee <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* NAVIGATION BAR */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/25 shrink-0">
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xs sm:text-base tracking-tight text-white block leading-tight">
              15-Second QR Review Engine
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">
              By Mithun Das AI Automation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* BUSINESS PORTAL BUTTON */}
          {ownerSession?.slug ? (
            <Link
              href={`/products/theqrbasedsystem/dashboard/${ownerSession.slug}`}
              className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Business Portal</span>
              <span className="md:hidden">Portal</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Business Portal</span>
              <span className="md:hidden">Portal</span>
            </button>
          )}

          <Link
            href="/products/theqrbasedsystem/onboard"
            className="hidden lg:inline-flex px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Start Free Trial
          </Link>
          <button
            onClick={() => handleOpenCheckout("monthly")}
            className="px-2.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-600/20 shrink-0"
          >
            <span className="hidden sm:inline">Pricing & Plans ($1/Day)</span>
            <span className="sm:hidden">Plans ($1/Day)</span>
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>The #1 Local Business Growth Wedge for US, UK & Canada</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Turn Everyday Customers into a{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
            Flood of 5-Star Google Reviews
          </span>{" "}
          in 15 Seconds.
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Your happy clients want to leave a review, but typing on a phone takes forever.
          Our QR system drafts an authentic, human review in 4 taps and deep-links straight into Google Maps.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/products/theqrbasedsystem/onboard"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-400 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 text-base active:scale-95 transition-all"
          >
            <span>Activate 3-Day Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <button
            onClick={() => handleOpenCheckout("monthly")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-850 flex items-center justify-center gap-2 text-base active:scale-95 transition-all"
          >
            <span>View $1/Day Plans</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 flex items-center justify-center gap-4 pt-2">
          <span>✓ No credit card required</span>
          <span>•</span>
          <span>✓ Instant printable standee PDF</span>
          <span>•</span>
          <span>✓ 100% FTC & Google Compliant</span>
        </p>
      </section>

      {/* THE PROBLEM VS SOLUTION COMPARISON */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why 90% of Your Happy Customers Leave Zero Reviews
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              The traditional Google review process is broken and exhausting on mobile devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Exhausting Way */}
            <div className="bg-slate-950/80 border border-red-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wide">
                <span>❌ The Old Way (Takes 4–5 Minutes)</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 font-bold">1</span>
                  <span>Customer searches your business name in Google or Maps</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 font-bold">2</span>
                  <span>Scrolls down past ads to find the tiny "Reviews" tab</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 font-bold">3</span>
                  <span>Stares at a blank white box with "Blank Page Syndrome"</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 font-bold">4</span>
                  <span>Gets distracted by a message, closes the browser, and forgets!</span>
                </li>
              </ul>
            </div>

            {/* The 15-Second QR Engine Way */}
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wide">
                <span>⚡ Our 15-Second QR Engine</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">1</span>
                  <span>Customer scans the counter standee with standard camera (2s)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">2</span>
                  <span>Taps 4 quick chips (Doctor gentle, clean clinic, on-time) (5s)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">3</span>
                  <span>AI drafts a warm, natural human review instantly (1s)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">4</span>
                  <span>One-tap copies and opens Google Maps ready to paste (2s)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENT CATEGORY QUESTION ENGINE & SIMULATOR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <QuestionPoolExplorer initialIndustry={selectedIndustry} />
      </section>

      {/* PRICING SECTION - $1/DAY HOOK */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
            <DollarSign className="w-3.5 h-3.5" /> Simple, Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Only $1 / Day to Dominate Google Maps
          </h2>
          <p className="text-xs sm:text-base text-slate-400 max-w-xl mx-auto">
            A single new dental patient, gym member, or salon client easily pays for your entire year of service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan 1: $30 / Month */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-2xl relative">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  Monthly Flexible
                </span>
                <h3 className="text-2xl font-bold text-white">Monthly Plan</h3>
                <p className="text-xs text-slate-400">Perfect for clinics starting out</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">$30</span>
                <span className="text-xs font-bold text-slate-400">USD / month</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 ml-2">
                  Just $1 / Day
                </span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Unlimited QR code scans & review drafts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Custom printable A5 counter standee PDF</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Front-desk 7-word receptionist script card</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Private feedback inbox (intercepts 1–3 stars)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cancel anytime without penalties</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenCheckout("monthly")}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-98 transition-all shadow-lg shadow-blue-600/20 text-sm flex items-center justify-center gap-2"
            >
              <span>Subscribe for $30 USD/Month</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Plan 2: $249 / Year (Best Value) */}
          <div className="bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border-2 border-blue-500/50 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
              Save Over 30%
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                  Best Value for Established Clinics
                </span>
                <h3 className="text-2xl font-bold text-white">Annual VIP Pass</h3>
                <p className="text-xs text-slate-400">Lock in your reviews for 365 days</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">$249</span>
                <span className="text-xs font-bold text-slate-400">USD / year</span>
                <span className="text-xs line-through text-slate-500 ml-1">$360/yr</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span><strong>Everything in Monthly plan</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span><strong>Full 365 days of service (Saves $111/yr)</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Priority VIP email & WhatsApp support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Multiple counter standee formats (A5, 4x6, stickers)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Monthly Local SEO Impact Analytics Reports</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenCheckout("annual")}
              className="w-full py-4 px-6 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-98 transition-all shadow-xl shadow-amber-400/20 text-sm flex items-center justify-center gap-2"
            >
              <span>Get Annual Plan ($249 USD/Year)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* GLOBAL USD BASELINE NOTICE */}
        <div className="max-w-3xl mx-auto mt-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-center gap-3 text-xs text-slate-400 text-center sm:text-left">
          <Globe className="w-5 h-5 text-blue-400 shrink-0 hidden sm:block" />
          <p>
            <strong className="text-slate-200">Global USD Baseline:</strong> Billed in USD. Clients in the UK, Europe, Canada, UAE, Australia, and worldwide can pay with any local credit/debit card, Apple Pay, or PayPal. Your bank or card automatically converts at live daily exchange rates with zero foreign transaction markup.
          </p>
        </div>

        <div className="text-center pt-8">
          <Link
            href="/products/theqrbasedsystem/onboard"
            className="text-xs text-slate-400 hover:text-white underline inline-flex items-center gap-1"
          >
            Want to test before paying? Start with 3 days free (no credit card required) →
          </Link>
        </div>
      </section>

      {/* MEET THE FOUNDER & AGENCY TRUST SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-24 border-t border-slate-900">
        <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-900/90 p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b border-slate-800/80">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                FOUNDER & AI AUTOMATION ARCHITECT
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>Govt. Registered Enterprise</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-semibold">UDYAM-WB-14-0303625</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Founder Identity Card */}
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-500/40 p-1 shadow-lg shadow-cyan-500/20 shrink-0">
                    <img
                      src="/logo.png"
                      alt="Mithun Das AI Automation"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" title="Direct founder support online" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Mithun Das
                    </h3>
                    <p className="text-xs font-bold text-cyan-400">
                      AI Business Automation Engineer
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Founder, Mithun Das AI Automation
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  I engineer operational AI systems for local businesses, clinics, hospitality, and growing enterprises. When you deploy the 15-Second QR Review Engine, you get direct, hands-on engineering support directly from me — no middleman support tickets or abandoned scripts.
                </p>

                {/* Primary CTA to Main Agency Website */}
                <div className="pt-1">
                  <Link
                    href="/"
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
                  >
                    <Globe className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                    <span>Explore Main Agency Website (mithundas.cloud)</span>
                    <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Direct Reach Channels */}
                <div className="space-y-2 pt-1">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
                    Direct Contact Channels
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href="https://wa.me/918768138086"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white flex items-center gap-2 transition-all group"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-[11px]">WhatsApp</span>
                      <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 ml-auto" />
                    </a>
                    <a
                      href="mailto:hello@mithundas.cloud"
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white flex items-center gap-2 transition-all group"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-semibold text-[11px]">Email</span>
                      <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 ml-auto" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="https://www.linkedin.com/in/mithun-das-46347a239/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://github.com/MithunzDas"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://x.com/MithunzDas"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors"
                    >
                      X (Twitter)
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Engineering Background & Guarantees */}
              <div className="lg:col-span-7 space-y-4 lg:pl-6 lg:border-l lg:border-slate-800/80">
                <div className="space-y-1.5">
                  <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Engineering Rigor & Verification
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Designed for business owners who demand accountability. Officially registered with the Government of India and backed by rigorous engineering credentials.
                  </p>
                </div>

                {/* Academic Credentials */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-200">Formal Engineering Qualifications</span>
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 font-mono pl-6 list-disc">
                    <li><strong className="text-slate-300">M.Tech in Systems & Control Engineering</strong> — NIT Warangal</li>
                    <li><strong className="text-slate-300">B.E. in Electronics & Instrumentation</strong> — Jadavpur University</li>
                  </ul>
                </div>

                {/* Registered Enterprise Details */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200">Government Registered Enterprise</span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded bg-cyan-400/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                      MSME • GOI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Operating officially under <strong className="text-slate-300 font-mono">Mithun Das AI Automation</strong> (Udyam: <span className="font-mono text-cyan-400 font-bold">UDYAM-WB-14-0303625</span>).
                  </p>
                  <a
                    href="/certificates/udyam-registration-certificate.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-medium pt-0.5"
                  >
                    <span>View Official Government Certificate (PDF)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* 1-on-1 Implementation Commitment */}
                <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-1.5">
                  <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    White-Glove Implementation Guarantee
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Every active client receives direct WhatsApp setup assistance. I will personally review your Google Place ID, fine-tune the review question pool for your exact specialization, and ensure your counter standee is formatted to your reception desk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MULTI-GATEWAY CHECKOUT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-sm font-bold"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="inline-flex p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 mb-1">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white">Choose Payment Method</h3>
              <p className="text-xs text-slate-400">
                {selectedPlan === "monthly" ? "$30 USD / Month (Auto-renew)" : "$249 USD / Year (Best Value)"}
              </p>
            </div>

            {/* Plan Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                className={`py-2 rounded-lg font-bold transition-all ${
                  selectedPlan === "monthly"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                $30 USD / Month
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlan("annual")}
                className={`py-2 rounded-lg font-bold transition-all ${
                  selectedPlan === "annual"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                $249 USD / Year (Save 30%)
              </button>
            </div>

            {/* THE 4 PAYMENT OPTIONS (ORDERED ACCORDING TO USER'S REQUIREMENTS) */}
            <div className="space-y-3 pt-1">
              {/* 1. PayPal (First position as requested) */}
              <a
                href={getCheckoutUrl(selectedPlan, "paypal")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center justify-between text-xs transition-transform active:scale-[0.98] shadow-lg shadow-amber-400/20 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-black italic text-base">
                    P
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black">PayPal Auto-Renew</p>
                    <p className="text-[10px] text-slate-800 font-medium">
                      Fast secure subscription • Most popular in US & UK
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* 2. Lemon Squeezy (After PayPal as requested) */}
              <a
                href={getCheckoutUrl(selectedPlan, "lemonsqueezy")}
                target="_blank"
                rel="noopener noreferrer"
                className="lemonsqueezy-button w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold flex items-center justify-between text-xs transition-transform active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-black text-sm">
                    🍋
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold">Credit / Debit Card & Apple Pay</p>
                    <p className="text-[10px] text-slate-400 font-normal">
                      Powered by Lemon Squeezy • Automated monthly billing
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <p className="text-[10px] text-center text-slate-500 pt-1">
              🔒 256-Bit SSL Encrypted • Cancel Anytime
            </p>
          </div>
        </div>
      )}

      {/* OWNER 1-CLICK AUTH MODAL */}
      <OwnerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* LEMON SQUEEZY OVERLAY CHECKOUT SCRIPT */}
      <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="lazyOnload" />
    </div>
  );
}
