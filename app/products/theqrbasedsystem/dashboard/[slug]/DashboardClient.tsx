"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  QrCode,
  Printer,
  ExternalLink,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sparkles,
  Copy,
  Clock,
  MessageSquare,
  ShieldCheck,
  Star,
  Users,
  ChevronRight,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { getCheckoutUrl } from "@/lib/qr-review/payment-config";

interface BusinessDetails {
  id: string;
  slug: string;
  businessName: string;
  ownerEmail: string;
  category: string;
  city?: string | null;
  trialStatus: string;
  trialEndsAt: string;
  totalScans: number;
  totalReviewsCopied: number;
  privateFeedbacks?: Array<{
    id: string;
    customerName: string | null;
    customerPhone: string | null;
    feedbackText: string;
    ratingScore: number;
    createdAt: string;
  }>;
}

interface DashboardClientProps {
  business: BusinessDetails;
}

export default function DashboardClient({ business }: DashboardClientProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (showPaymentModal && typeof window !== "undefined") {
      // @ts-expect-error LemonSqueezy global
      window.createLemonSqueezy?.();
    }
  }, [showPaymentModal]);

  const reviewUrl = typeof window !== "undefined"
    ? `${window.location.origin}/r/${business.slug}`
    : `https://mithundas.cloud/r/${business.slug}`;

  const conversionRate = business.totalScans > 0
    ? Math.round((business.totalReviewsCopied / business.totalScans) * 100)
    : 0;

  // Calculate days remaining in trial
  const trialEndDate = new Date(business.trialEndsAt);
  const msRemaining = trialEndDate.getTime() - Date.now();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link href="/products/theqrbasedsystem" className="hover:text-slate-200">
                QR Review System
              </Link>
              <span>/</span>
              <span className="text-slate-200 font-medium">Business Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              {business.businessName}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                {business.category}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/products/theqrbasedsystem/standee/${business.slug}`}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Standee
            </Link>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/25 text-xs flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" /> Upgrade Plan
            </button>
          </div>
        </div>

        {/* 3-DAY TRIAL STATUS BANNER */}
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {business.trialStatus === "TRIAL_ACTIVE" ? "Free Trial Active" : "Subscribed"}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {daysRemaining > 0 ? `${daysRemaining} days remaining in trial` : "Trial expired"}
                </span>
              </div>
              <h2 className="text-base font-bold text-white">
                Keep your QR review engine active for just $1 / day ($30/month)
              </h2>
              <p className="text-xs text-slate-400">
                Cancel anytime. Unlocks unlimited scans, AI review generation, and printable standees.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 shrink-0 shadow-lg transition-transform active:scale-95"
          >
            Activate Subscription ($30/mo or $249/yr) →
          </button>
        </div>

        {/* METRICS TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total QR Scans</span>
              <QrCode className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white">{business.totalScans}</p>
            <p className="text-[11px] text-slate-500">Customers who scanned your counter standee</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Reviews Copied</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400">{business.totalReviewsCopied}</p>
            <p className="text-[11px] text-slate-500">AI reviews copied to clipboard for Google</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Conversion Rate</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-indigo-300">{conversionRate}%</p>
            <p className="text-[11px] text-slate-500">Scan to Google submission ratio</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>SEO Value Added</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-3xl font-black text-amber-400">
              ${business.totalReviewsCopied * 150}
            </p>
            <p className="text-[11px] text-slate-500">Estimated organic local SEO customer value</p>
          </div>
        </div>

        {/* QUICK SHARE & TEST BAR */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Your Live Review Link:</span>
            <span className="font-mono text-blue-400">{reviewUrl}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedLink ? "Copied!" : "Copy Link"}
            </button>
            <Link
              href={reviewUrl}
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 transition-colors"
            >
              Open Live <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* PRIVATE FEEDBACK INBOX (1-3 STARS) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-base text-white">Private Feedback Inbox</h2>
            </div>
            <span className="text-xs text-slate-400">
              {business.privateFeedbacks?.length || 0} messages received
            </span>
          </div>

          <p className="text-xs text-slate-400">
            When a customer rates 1–3 stars, their complaint is intercepted and routed here privately so you can resolve it before it damages your public Google reputation.
          </p>

          {(!business.privateFeedbacks || business.privateFeedbacks.length === 0) ? (
            <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500 space-y-1">
              <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto" />
              <p>No negative complaints reported. Your customer satisfaction is pristine!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {business.privateFeedbacks.map((item) => (
                <div key={item.id} className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      {item.customerName || "Anonymous Customer"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    "{item.feedbackText}"
                  </p>
                  {item.customerPhone && (
                    <p className="text-[11px] text-blue-400">Contact: {item.customerPhone}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MULTI-GATEWAY PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-sm font-bold"
            >
              ✕
            </button>

            <div className="space-y-2 text-center">
              <div className="inline-flex p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 mb-1">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">Select Your Subscription</h2>
              <p className="text-xs text-slate-400">
                Cancel anytime. 100% money-back guarantee if you don't collect new reviews.
              </p>
            </div>

            {/* Plan Switcher */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                  selectedPlan === "monthly"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div>$30 / Month</div>
                <div className="text-[10px] font-normal opacity-80 mt-0.5">Auto-renew ($1/day)</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("annual")}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all text-center relative ${
                  selectedPlan === "annual"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="absolute -top-2 right-2 bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                  SAVE 30%
                </span>
                <div>$249 / Year</div>
                <div className="text-[10px] font-normal opacity-80 mt-0.5">Best Value for Clinics</div>
              </button>
            </div>

            {/* MULTI-GATEWAY OPTIONS (Ordered by US/UK Consumer Trust) */}
            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Select Your Preferred Payment Method:
              </p>

              {/* 1. PayPal (Ranked #1 for Western trust) */}
              <a
                href={getCheckoutUrl(selectedPlan, "paypal", business.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center justify-between text-xs transition-transform active:scale-[0.98] shadow-lg shadow-amber-400/20 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-black italic text-base">
                    P
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black">PayPal Auto-Pay Subscription</p>
                    <p className="text-[10px] text-slate-800 font-medium">
                      Fast 1-click recurring setup • Loved in US, UK & Canada
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* 2. Lemon Squeezy (Cards & Apple Pay) */}
              <a
                href={getCheckoutUrl(selectedPlan, "lemonsqueezy", business.slug)}
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

              {/* 3. Razorpay (UPI, NetBanking & Cards) */}
              <a
                href={getCheckoutUrl(selectedPlan, "razorpay", business.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold flex items-center justify-between text-xs transition-transform active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm">
                    R
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold">Razorpay (UPI, NetBanking & Cards)</p>
                    <p className="text-[10px] text-slate-400 font-normal">
                      Instant UPI, GPay, PhonePe, RuPay & International Cards
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <p className="text-[10px] text-center text-slate-500">
              🔒 256-Bit Bank-Grade Encryption • Instant Activation
            </p>
          </div>
        </div>
      )}

      {/* LEMON SQUEEZY OVERLAY CHECKOUT SCRIPT */}
      <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="lazyOnload" />
    </div>
  );
}
