"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Globe
} from "lucide-react";
import { INDUSTRY_QUESTION_POOLS } from "@/lib/qr-review/question-pools";
import QuestionPoolExplorer from "@/components/qr-review/QuestionPoolExplorer";
import { getCheckoutUrl, QR_REVIEW_PLANS } from "@/lib/qr-review/payment-config";

export default function SalesPageClient() {
  const [selectedIndustry, setSelectedIndustry] = useState("DENTIST");
  const [demoRating, setDemoRating] = useState(5);
  const [demoSelections, setDemoSelections] = useState<Record<string, string>>({});
  const [isDemoDrafting, setIsDemoDrafting] = useState(false);
  const [demoDraftedReview, setDemoDraftedReview] = useState<string | null>(null);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");

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
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/25">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
              15-Second QR Review Engine
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              By Mithun Das AI Platforms
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/products/theqrbasedsystem/onboard"
            className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Start Free Trial
          </Link>
          <button
            onClick={() => handleOpenCheckout("monthly")}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-600/20"
          >
            Pricing & Plans ($1/Day)
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
                  <span>Cancel anytime with 1-click</span>
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

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-900 text-center space-y-4 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} Mithun Das AI Business Platform • QR-Based AI Review Engine.
        </p>
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <span>•</span>
          <Link href="/contact" className="hover:underline">Support</Link>
        </div>
      </footer>

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
                      Fast 1-click subscription • Most popular in US & UK
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
                className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold flex items-center justify-between text-xs transition-transform active:scale-[0.98] group"
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

              {/* 3. Stripe Direct */}
              <a
                href={getCheckoutUrl(selectedPlan, "stripe")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold flex items-center justify-between text-xs transition-transform active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-sm">
                    S
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold">Stripe Checkout</p>
                    <p className="text-[10px] text-slate-400 font-normal">
                      Direct Visa, Mastercard, American Express
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* 4. Razorpay International */}
              <Link
                href={`/invoice?plan=qr_review_${selectedPlan}&amount=${selectedPlan === "monthly" ? 30 : 249}`}
                className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    R
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-medium">Razorpay International / Wire</p>
                    <p className="text-[10px] text-slate-500">Direct invoice & international card option</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            </div>

            <p className="text-[10px] text-center text-slate-500 pt-1">
              🔒 256-Bit SSL Encrypted • Cancel Anytime with 1-Click
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
