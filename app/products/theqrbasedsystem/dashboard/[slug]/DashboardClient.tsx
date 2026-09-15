"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Printer,
  ExternalLink,
  TrendingUp,
  CheckCircle2,
  CreditCard,
  Copy,
  Clock,
  MessageSquare,
  ShieldCheck,
  Star,
  ChevronRight,
  Zap,
  Lock,
  LogOut,
  Building2,
  Calendar,
  BarChart3,
  Sparkles,
  Globe,
  Loader2,
} from "lucide-react";
import { getCheckoutUrl } from "@/lib/qr-review/payment-config";
import OwnerAuthModal from "@/components/qr-review/OwnerAuthModal";

interface BusinessDetails {
  id: string;
  slug: string;
  businessName: string;
  ownerEmail: string;
  category: string;
  city?: string | null;
  trialStatus: string;
  trialEndsAt: string;
  subscriptionPlan?: string | null;
  subscriptionMethod?: string | null;
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

interface GrowthStats {
  allTimeReviews: number;
  thisMonthReviews: number;
  prevMonthReviews: number;
  momGrowthPercent: number;
  conversionRate: number;
  daysRemaining: number;
  isSubscribed: boolean;
  subscriptionPlan: string | null;
}

interface OwnerAuthInfo {
  isAuthenticated: boolean;
  email?: string;
  name?: string;
  picture?: string;
  otherBusinesses?: Array<{ slug: string; businessName: string; category: string }>;
}

interface DashboardClientProps {
  business: BusinessDetails;
  initialStats: GrowthStats;
  initialAuth: OwnerAuthInfo;
}

export default function DashboardClient({
  business,
  initialStats,
  initialAuth,
}: DashboardClientProps) {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Dynamic Auth State
  const [auth, setAuth] = useState<OwnerAuthInfo>(initialAuth);
  // Dynamic Stats State
  const [stats, setStats] = useState<GrowthStats>(initialStats);

  useEffect(() => {
    if (showPaymentModal && typeof window !== "undefined") {
      // @ts-expect-error LemonSqueezy global
      window.createLemonSqueezy?.();
    }
  }, [showPaymentModal]);

  const reviewUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${business.slug}`
      : `https://mithundas.cloud/r/${business.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAuthSuccess = (owner: {
    email: string;
    name?: string;
    picture?: string;
    businesses: Array<{ id: string; slug: string; businessName: string; category?: string; trialStatus: string }>;
  }) => {
    const isOwner = owner.email.toLowerCase() === business.ownerEmail.toLowerCase();
    const otherClinics = owner.businesses
      .filter((b) => b.slug !== business.slug)
      .map((b) => ({ slug: b.slug, businessName: b.businessName, category: b.category || business.category }));

    setAuth({
      isAuthenticated: isOwner,
      email: owner.email,
      name: owner.name,
      picture: owner.picture,
      otherBusinesses: otherClinics,
    });
    router.refresh();
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/qr-review/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      // Clear non-httpOnly fallback cookie if present
      try {
        document.cookie = "qr_owner_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } catch {}
      setAuth({ isAuthenticated: false, email: undefined, name: undefined, picture: undefined });
      // Redirect to the main product page: https://www.mithundas.cloud/products/theqrbasedsystem
      window.location.href = "/products/theqrbasedsystem";
    }
  };

  // Subscription Details
  const isAnnual = business.subscriptionPlan === "ANNUAL_249";
  const isSubscribed = business.trialStatus === "SUBSCRIBED";
  const trialTotalDays = isSubscribed ? (isAnnual ? 365 : 30) : 3;
  const progressPercent = Math.min(100, Math.max(5, (stats.daysRemaining / trialTotalDays) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* TOP OWNER AUTH & BREADCRUMB BAR */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link
              href="/"
              className="hover:text-cyan-400 text-slate-300 transition-colors flex items-center gap-1 font-semibold"
              title="Visit Main Agency Website: mithundas.cloud"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>mithundas.cloud</span>
            </Link>
            <span>/</span>
            <Link href="/products/theqrbasedsystem" className="hover:text-slate-200 transition-colors">
              QR Review System
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-semibold">Business Admin Portal</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {auth.isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                {/* Verified Owner Profile Card */}
                <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-700/90 hover:border-slate-600 px-3 py-1.5 rounded-2xl shadow-md transition-all">
                  {/* Google Profile Avatar Photo */}
                  {auth.picture ? (
                    <img
                      src={auth.picture}
                      alt={auth.name || "Owner Profile"}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/60 shadow-sm shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center shadow-sm ring-2 ring-emerald-500/40 shrink-0">
                      {auth.name ? auth.name.charAt(0).toUpperCase() : auth.email ? auth.email.charAt(0).toUpperCase() : "O"}
                    </div>
                  )}

                  {/* Owner Name & Email */}
                  <div className="flex flex-col text-left leading-tight min-w-0 max-w-[150px] sm:max-w-[200px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {auth.name || auth.email?.split("@")[0] || "Owner"}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" title="Verified Owner"></span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono truncate">
                      {auth.email}
                    </span>
                  </div>

                  {/* Multi-Clinic Switcher Dropdown (if owner has >1 clinic) */}
                  {auth.otherBusinesses && auth.otherBusinesses.length > 0 && (
                    <div className="relative inline-block ml-1 pl-1 border-l border-slate-800">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            router.push(`/products/theqrbasedsystem/dashboard/${e.target.value}`);
                          }
                        }}
                        defaultValue=""
                        className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-[10px] px-1.5 py-0.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                        title="Switch Location"
                      >
                        <option value="" disabled>Switch Clinic ▾</option>
                        {auth.otherBusinesses.map((b) => (
                          <option key={b.slug} value={b.slug}>
                            {b.businessName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sign Out Button */}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    title="Sign out of business portal"
                    className="ml-1 flex items-center gap-1.5 text-slate-400 hover:text-rose-400 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                    aria-label="Sign out of business portal"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                    ) : (
                      <LogOut className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[11px] hidden sm:inline font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-[11px] text-amber-400/90 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  <Lock className="w-3 h-3" /> Public Preview
                </span>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Building2 className="w-3.5 h-3.5" /> Business Owner Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* HERO TITLE & ACTION HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                {business.businessName}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 uppercase tracking-wider">
                {business.category}
              </span>
              {business.city && (
                <span className="text-xs text-slate-400 hidden sm:inline">
                  📍 {business.city}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Live Google Review Growth Engine • Real-Time Customer Analytics
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              href={`/products/theqrbasedsystem/standee/${business.slug}`}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <Printer className="w-4 h-4 text-blue-400" /> Print Standee
            </Link>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              {isSubscribed ? "Manage Plan" : "Upgrade Plan"}
            </button>
          </div>
        </div>

        {/* 1. SUBSCRIPTION & EXPIRATION STATUS METER BANNER */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                {isSubscribed ? (
                  <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isAnnual ? "VIP Annual Subscription Active" : "Growth Monthly Plan Active"}
                  </span>
                ) : (
                  <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> 3-Day Free Trial
                  </span>
                )}

                <span className="text-xs text-slate-300 font-medium">
                  {stats.daysRemaining > 0
                    ? `${stats.daysRemaining} days left before auto-renewal / expiration`
                    : "Plan expired • Click below to reactivate"}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white">
                {isSubscribed
                  ? "Your QR counter standee is fully licensed and protected."
                  : "Keep your QR review engine running for just $1/day ($30/month)."}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Includes automated AI review writer, acrylic counter standees, and negative review defense.
              </p>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full lg:w-auto px-6 py-3 rounded-2xl font-black text-xs bg-white text-slate-950 hover:bg-slate-100 shadow-xl transition-transform active:scale-95 shrink-0 text-center"
            >
              {isSubscribed ? "View / Change Billing ($30/mo or $249/yr) →" : "Activate Autopay ($30/mo or $249/yr) →"}
            </button>
          </div>

          {/* Days Left Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[11px] font-medium text-slate-400">
              <span>Subscription Health</span>
              <span>{stats.daysRemaining} Days Remaining</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isSubscribed
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : stats.daysRemaining <= 1
                    ? "bg-gradient-to-r from-rose-500 to-amber-500 animate-pulse"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500"
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 2. BUSINESS GROWTH ANALYTICS METRICS GRID */}
        {/* Mobile: 1 col, Tablet: 2 cols, Laptop/Desktop: 4 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* TILE 1: All-Time Reviews Generated */}
          <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>All-Time Reviews</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black text-white">{stats.allTimeReviews}</p>
              <span className="text-xs text-emerald-400 font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400">AI drafts copied to clipboard & posted to Google</p>
          </div>

          {/* TILE 2: This Month vs Last Month (Growth Rate) */}
          <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Monthly Growth</span>
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black text-blue-400">{stats.thisMonthReviews}</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                {stats.momGrowthPercent > 0
                  ? `+${stats.momGrowthPercent}% MoM 🚀`
                  : stats.thisMonthReviews > 0
                  ? "Active"
                  : "Starting"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              <strong>{stats.thisMonthReviews}</strong> this month vs <strong>{stats.prevMonthReviews}</strong> last month
            </p>
          </div>

          {/* TILE 3: Conversion Efficiency Rate */}
          <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Conversion Rate</span>
              <QrCode className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black text-indigo-300">
                {stats.conversionRate}%
              </p>
              <span className="text-xs text-slate-500">
                ({business.totalScans} Scans)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Ratio of counter scans that generated reviews</p>
          </div>

          {/* TILE 4: Local SEO Value Added */}
          <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>SEO Value Added</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black text-amber-400">
                ${stats.allTimeReviews * 150}
              </p>
              <span className="text-[10px] text-amber-400/80 font-semibold px-1.5 py-0.5 rounded bg-amber-400/10">
                ROI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Estimated value of high-intent Google Maps rankings</p>
          </div>

        </div>

        {/* 3. QUICK SHARE & TEST BAR */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 overflow-hidden w-full md:w-auto">
            <span className="font-bold text-slate-300 shrink-0">Counter Standee URL:</span>
            <span className="font-mono text-blue-400 truncate max-w-md">{reviewUrl}</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedLink ? "Copied!" : "Copy Link"}
            </button>
            <Link
              href={reviewUrl}
              target="_blank"
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-600/20"
            >
              Test Flow <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4. PRIVATE FEEDBACK INBOX (NEGATIVE REVIEWS INTERCEPTED) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-white">Private Feedback Defense Inbox</h2>
                <p className="text-xs text-slate-400">
                  Unhappy patients rating 1–3 stars are redirected here to protect your public Google rating.
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-400 px-2.5 py-1 rounded-full bg-slate-800 font-semibold shrink-0">
              {business.privateFeedbacks?.length || 0} messages
            </span>
          </div>

          {(!business.privateFeedbacks || business.privateFeedbacks.length === 0) ? (
            <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl text-xs text-slate-400 space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-semibold text-slate-200">Zero Public Complaints Intercepted</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Your customer satisfaction is optimal! Any negative review attempts will be routed here privately.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {business.privateFeedbacks.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-2 text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 flex items-center gap-2">
                      <span>👤</span>
                      <span>{item.customerName || "Anonymous Patient"}</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    "{item.feedbackText}"
                  </p>
                  {item.customerPhone && (
                    <p className="text-[11px] text-blue-400 font-mono">
                      Direct Contact: {item.customerPhone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MULTI-GATEWAY AUTOPAY MODAL (STREAMLINED TO PAYPAL & LEMON SQUEEZY) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-base font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>

            <div className="space-y-2 text-center">
              <div className="inline-flex p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 mb-1">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white">Select Your Plan</h2>
              <p className="text-xs text-slate-400">
                Cancel anytime. Automated recurring SaaS billing.
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

            {/* Autopay Gateways */}
            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Select Your Payment Method:
              </p>

              {/* 1. PayPal (Auto-Renew) */}
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
                      Fast secure recurring setup • Loved in US, UK & Canada
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* 2. Lemon Squeezy (Credit/Debit Card & Apple Pay) */}
              <a
                href={getCheckoutUrl(selectedPlan, "lemonsqueezy", business.slug, auth.email || undefined)}
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
                      Powered by Lemon Squeezy • Automated recurring billing
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <p className="text-[10px] text-center text-slate-500">
              🔒 256-Bit Bank-Grade Encryption • Instant Standee License
            </p>
          </div>
        </div>
      )}

      {/* OWNER 1-CLICK AUTH MODAL */}
      <OwnerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        defaultEmail={business.ownerEmail}
        businessName={business.businessName}
      />

      {/* LEMON SQUEEZY OVERLAY SCRIPT */}
      <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="lazyOnload" />
    </div>
  );
}
