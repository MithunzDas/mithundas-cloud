"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  QrCode,
  Building2,
  Mail,
  User,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Zap,
  Globe,
  Star,
  Check,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  Loader2,
  Phone,
  Briefcase
} from "lucide-react";
import { INDUSTRY_QUESTION_POOLS } from "@/lib/qr-review/question-pools";
import {
  extractPlaceIdFromUrl,
  extractBusinessNameFromUrl,
  getGoogleReviewDeepLink,
  detectCountryFromLocation,
  detectUserCountryFromTimezone,
  cleanCityAndCountry,
} from "@/lib/qr-review/google-places";

function OnboardFormContent() {
  const searchParams = useSearchParams();

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("DENTIST");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("India");
  const [placeId, setPlaceId] = useState("");
  const [ownerName, setOwnerName] = useState(""); // Manager or owner name
  const [position, setPosition] = useState("Owner / Manager"); // Manager/Owner/Director position
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState(""); // Phone or WhatsApp from scraper
  const [isPreFilled, setIsPreFilled] = useState(false);
  const [showPlaceIdHelp, setShowPlaceIdHelp] = useState(false);
  const [showColdEmailHelp, setShowColdEmailHelp] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [autoFillSuccessMsg, setAutoFillSuccessMsg] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [createdBusiness, setCreatedBusiness] = useState<{
    slug: string;
    reviewUrl: string;
    standeeUrl: string;
    dashboardUrl: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Initial timezone detection to ensure country is never blank
  useEffect(() => {
    const tzCountry = detectUserCountryFromTimezone();
    if (tzCountry && !searchParams.get("country") && !searchParams.get("nation")) {
      setCountry(tzCountry);
    }
  }, [searchParams]);

  // Auto-detect and prefill query parameters from cold email links or scraped database
  useEffect(() => {
    const leadId = searchParams.get("leadId") || searchParams.get("id") || searchParams.get("lead") || "";
    const pPlaceId = searchParams.get("placeId") || searchParams.get("place_id") || searchParams.get("place") || "";
    const pMaps = searchParams.get("maps") || searchParams.get("url") || searchParams.get("link") || searchParams.get("gmaps") || "";
    const pName = searchParams.get("name") || searchParams.get("businessName") || searchParams.get("business") || searchParams.get("company") || searchParams.get("biz") || "";
    const pCity = searchParams.get("city") || searchParams.get("town") || searchParams.get("location") || "";
    const pCountry = searchParams.get("country") || searchParams.get("nation") || "";
    const pCategory = searchParams.get("category") || searchParams.get("cat") || searchParams.get("industry") || searchParams.get("type") || "";
    const pEmail = searchParams.get("email") || searchParams.get("ownerEmail") || searchParams.get("mail") || searchParams.get("businessEmail") || "";
    const pOwner = searchParams.get("owner") || searchParams.get("ownerName") || searchParams.get("manager") || searchParams.get("contact") || searchParams.get("person") || "";
    const pPosition = searchParams.get("position") || searchParams.get("title") || searchParams.get("role") || searchParams.get("designation") || "";
    const pPhone = searchParams.get("phone") || searchParams.get("whatsapp") || searchParams.get("tel") || searchParams.get("mobile") || searchParams.get("contactNumber") || searchParams.get("number") || searchParams.get("emailNumber") || "";

    // Set immediate URL parameters for 0ms instantaneous load
    if (pName) {
      setBusinessName(pName);
      setIsPreFilled(true);
    }
    if (pCity) {
      const loc = cleanCityAndCountry({ rawCity: pCity, rawCountry: pCountry });
      setCity(loc.city);
      if (loc.country) setCountry(loc.country);
      setIsPreFilled(true);
    } else if (pCountry) {
      setCountry(pCountry);
    }

    if (pCategory) {
      const upperCat = pCategory.toUpperCase().replace(/[\s-]+/g, "_");
      if (INDUSTRY_QUESTION_POOLS[upperCat]) {
        setCategory(upperCat);
      }
    }

    if (pEmail) {
      setOwnerEmail(pEmail);
      setIsPreFilled(true);
    }
    if (pOwner) {
      setOwnerName(pOwner);
      setIsPreFilled(true);
    }
    if (pPosition) {
      setPosition(pPosition);
    }
    if (pPhone) {
      setOwnerPhone(pPhone);
      setIsPreFilled(true);
    }

    const rawPlaceParam = pPlaceId || pMaps;
    if (rawPlaceParam) {
      const cleanId = extractPlaceIdFromUrl(rawPlaceParam) || rawPlaceParam;
      setPlaceId(cleanId);
      if (!pName) {
        const bizFromUrl = extractBusinessNameFromUrl(rawPlaceParam);
        if (bizFromUrl) {
          const cleanName = bizFromUrl.split("|")[0]?.trim() || bizFromUrl;
          setBusinessName(cleanName);
          setIsPreFilled(true);
        }
      }
    }

    // Query scraped database if leadId, placeId, or email is provided
    const targetLookup = leadId
      ? `leadId=${encodeURIComponent(leadId)}`
      : pPlaceId
      ? `placeId=${encodeURIComponent(pPlaceId)}`
      : pMaps
      ? `url=${encodeURIComponent(pMaps)}`
      : pEmail && !pName
      ? `email=${encodeURIComponent(pEmail)}`
      : "";

    if (targetLookup) {
      setIsLookingUp(true);
      fetch(`/api/qr-review/lead-lookup?${targetLookup}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.lead) {
            const lead = data.lead;
            if (lead.businessName && !pName) setBusinessName(lead.businessName);
            if (lead.city && !pCity) setCity(lead.city);
            if (lead.country && !pCountry) setCountry(lead.country);
            if (lead.email && !pEmail) setOwnerEmail(lead.email);
            if (lead.ownerName && !pOwner) setOwnerName(lead.ownerName);
            if (lead.position && !pPosition) setPosition(lead.position || "Owner / Manager");
            if (lead.phone && !pPhone) setOwnerPhone(lead.phone);
            if (lead.placeId && !pPlaceId && !pMaps) setPlaceId(lead.placeId);
            if (lead.category && !pCategory) {
              const catUpper = lead.category.toUpperCase().replace(/[\s-]+/g, "_");
              if (INDUSTRY_QUESTION_POOLS[catUpper]) {
                setCategory(catUpper);
              }
            }
            setIsPreFilled(true);
            setAutoFillSuccessMsg(`✓ Pre-filled from cold outreach invite for ${lead.businessName || "your business"}`);
          }
        })
        .catch(() => {})
        .finally(() => setIsLookingUp(false));
    }
  }, [searchParams]);

  // Handle Place ID input change (auto-extract clean Place ID, business name, category, and lookup DB)
  const handlePlaceIdChange = (val: string) => {
    setAutoFillSuccessMsg("");
    const extractedId = extractPlaceIdFromUrl(val);
    const targetId = extractedId || val.trim();

    if (extractedId) {
      setPlaceId(extractedId);
    } else {
      setPlaceId(val);
    }

    // Auto-extract business name & city if URL has a place name
    const extractedName = extractBusinessNameFromUrl(val);
    let detectedName = "";
    let detectedCity = "";

    if (extractedName) {
      let namePart = extractedName.split("|")[0]?.trim() || extractedName;

      // Detect city if name has trailing comma + City (e.g. "ITC Royal Bengal, a Luxury Collection Hotel, Kolkata")
      if (namePart.includes(",")) {
        const commaParts = namePart.split(",").map((s) => s.trim()).filter(Boolean);
        if (commaParts.length >= 2) {
          const candidateCity = commaParts[commaParts.length - 1];
          if (
            candidateCity.length <= 25 &&
            !/\b(hotel|clinic|salon|gym|inc|ltd|corp|llc|co|restaurant|cafe)\b/i.test(candidateCity)
          ) {
            detectedCity = candidateCity.charAt(0).toUpperCase() + candidateCity.slice(1);
            namePart = commaParts.slice(0, -1).join(", ");
          }
        }
      }

      detectedName = namePart;
      setBusinessName(detectedName);
    }

    // Additional city detection: "IN+HABRA" or "in Kolkata"
    if (!detectedCity) {
      const cityMatch = val.match(/\bIN\+([A-Za-z0-9_-]+)/i) || val.match(/\bin[\s+]([A-Za-z0-9_-]+)/i);
      if (cityMatch && cityMatch[1]) {
        const raw = decodeURIComponent(cityMatch[1].replace(/\+/g, " "));
        detectedCity = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
      }
    }

    // Query param q=... detection (e.g. q=itc+royal+bengal+kolkata)
    if (!detectedCity) {
      const qMatch = val.match(/[?&]q=([^&]+)/i);
      if (qMatch && qMatch[1]) {
        const decodedQ = decodeURIComponent(qMatch[1].replace(/\+/g, " "));
        const qParts = decodedQ.split(/[\s,]+/).filter(Boolean);
        if (qParts.length >= 2) {
          const lastWord = qParts[qParts.length - 1];
          if (
            lastWord.length > 2 &&
            !/\b(hotel|clinic|salon|gym|restaurant|cafe|best|top|near|me|luxury)\b/i.test(lastWord)
          ) {
            detectedCity = lastWord.charAt(0).toUpperCase() + lastWord.slice(1).toLowerCase();
          }
        }
      }
    }

    // Smart Country & City Detection (from coordinates, city, or URL)
    const loc = cleanCityAndCountry({
      rawCity: detectedCity,
      url: val,
    });
    if (loc.country) {
      setCountry(loc.country);
    }
    if (loc.city) {
      setCity(loc.city);
    }

    // Detect industry category from URL keywords (with dedicated HOTEL_HOSPITALITY support)
    const lower = (val + " " + (extractedName || "")).toLowerCase();
    let detectedCategory = "";
    if (lower.includes("hotel") || lower.includes("resort") || lower.includes("suites") || lower.includes("inn")) {
      detectedCategory = "HOTEL_HOSPITALITY";
      setCategory("HOTEL_HOSPITALITY");
    } else if (
      lower.includes("restaurant") ||
      lower.includes("cafe") ||
      lower.includes("bistro") ||
      lower.includes("food") ||
      lower.includes("dining") ||
      lower.includes("bakery") ||
      lower.includes("bar") ||
      lower.includes("grill")
    ) {
      detectedCategory = "RESTAURANT_CAFE";
      setCategory("RESTAURANT_CAFE");
    } else if (lower.includes("dental") || lower.includes("dentist") || lower.includes("teeth") || lower.includes("ortho")) {
      detectedCategory = "DENTIST";
      setCategory("DENTIST");
    } else if (lower.includes("salon") || lower.includes("spa") || lower.includes("beauty") || lower.includes("hair") || lower.includes("nail")) {
      detectedCategory = "SALON_SPA";
      setCategory("SALON_SPA");
    } else if (lower.includes("gym") || lower.includes("fitness") || lower.includes("crossfit") || lower.includes("workout")) {
      detectedCategory = "GYM_FITNESS";
      setCategory("GYM_FITNESS");
    } else if (lower.includes("auto") || lower.includes("tire") || lower.includes("mechanic") || lower.includes("repair") || lower.includes("car")) {
      detectedCategory = "AUTO_REPAIR";
      setCategory("AUTO_REPAIR");
    } else if (lower.includes("clinic") || lower.includes("hospital") || lower.includes("physio") || lower.includes("doctor")) {
      detectedCategory = "CLINIC_HEALTHCARE";
      setCategory("CLINIC_HEALTHCARE");
    }

    const summaryParts = [detectedName, loc.city, loc.country].filter(Boolean);
    if (summaryParts.length > 0) {
      setAutoFillSuccessMsg(`Auto-detected: ${summaryParts.join(" · ")}`);
    }

    // Async database lookup for owner name, position, phone & business email from scraped leads!
    if (targetId && targetId.length > 5) {
      setIsLookingUp(true);
      fetch(
        `/api/qr-review/lead-lookup?placeId=${encodeURIComponent(targetId)}&url=${encodeURIComponent(val)}&name=${encodeURIComponent(detectedName)}&city=${encodeURIComponent(detectedCity || loc.city)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.lead) {
            const lead = data.lead;
            if (lead.businessName && !detectedName) {
              setBusinessName(lead.businessName);
            }
            if (lead.city && !detectedCity) {
              setCity(lead.city);
            }
            if (lead.country) {
              setCountry(lead.country);
            }
            if (lead.category && !detectedCategory) {
              const upperCat = lead.category.toUpperCase().replace(/[\s-]+/g, "_");
              if (INDUSTRY_QUESTION_POOLS[upperCat]) {
                setCategory(upperCat);
              }
            }
            if (lead.email) {
              setOwnerEmail(lead.email);
            }
            if (lead.ownerName) {
              setOwnerName(lead.ownerName);
            }
            if (lead.position) {
              setPosition(lead.position);
            }
            if (lead.phone) {
              setOwnerPhone(lead.phone);
            }
            if (data.foundInDatabase) {
              setAutoFillSuccessMsg("✓ Connected with database: Business info, email, phone & owner profile auto-filled!");
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsLookingUp(false);
        });
    }
  };

  const currentReviewLink = getGoogleReviewDeepLink(placeId, businessName, city);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/qr-review/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          category,
          city,
          country,
          placeId,
          ownerName: ownerName.trim() || "Business Owner",
          ownerEmail,
          ownerPhone,
          position,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreatedBusiness({
          slug: data.business.slug,
          reviewUrl: data.reviewUrl,
          standeeUrl: data.standeeUrl,
          dashboardUrl: data.dashboardUrl,
        });
      } else {
        setErrorMsg(data.error || "Failed to create business profile.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <Link
            href="/products/theqrbasedsystem"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Back to QR Review System
          </Link>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400">
            <Zap className="w-3.5 h-3.5" /> 3-Day Free Trial (No Credit Card)
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-2">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {isPreFilled ? `Activate 15-Sec Reviews for ${businessName}` : "Activate Your 15-Second QR Review Engine"}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            {isPreFilled
              ? "Your business details have been pre-configured. Enter your name below to generate your counter standee."
              : "Set up your clinic, salon, or gym in 2 minutes. Get an instant printable counter standee and start collecting Google reviews today."}
          </p>
        </div>

        {/* COLD EMAIL PERSONALIZED VIP BANNER */}
        {isPreFilled && !createdBusiness && (
          <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-blue-900/60 border-2 border-blue-500/40 rounded-3xl p-5 sm:p-6 flex items-start gap-4 shadow-2xl animate-fadeIn">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Personalized Setup for {businessName}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Pre-Filled from Invite
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200/90 leading-relaxed">
                We've pre-connected your Google Maps Place ID and business profile. Simply enter your name in Step 2 to personalize your dashboard and print your reception standee.
              </p>
            </div>
          </div>
        )}

        {createdBusiness ? (
          /* SUCCESS STATE */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Your QR Review System is Live!</h2>
              <p className="text-sm text-slate-400">
                Your 3-day free trial has been activated. No card was charged.
              </p>
            </div>

            {/* Quick Action Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Link
                href={createdBusiness.standeeUrl}
                className="bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 p-5 rounded-2xl flex flex-col justify-between space-y-4 text-white shadow-xl shadow-blue-600/20 group transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white/10">
                    <Printer className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Print Counter Standee PDF</h3>
                  <p className="text-xs text-white/80 mt-1">
                    Ready-to-print A5 acrylic standee & receptionist script for your reception desk.
                  </p>
                </div>
              </Link>

              <Link
                href={createdBusiness.dashboardUrl}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-5 rounded-2xl flex flex-col justify-between space-y-4 text-slate-100 shadow-xl group transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-700">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Open Business Dashboard</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Track live QR scans, generated reviews, and customer feedback.
                  </p>
                </div>
              </Link>
            </div>

            {/* Live Link Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="text-slate-400 font-medium">Your Public Customer Review Link:</p>
                <p className="font-mono text-blue-400 font-semibold">{createdBusiness.reviewUrl}</p>
              </div>
              <Link
                href={createdBusiness.reviewUrl}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium shrink-0 transition-colors"
              >
                Test Review Flow →
              </Link>
            </div>
          </div>
        ) : (
          /* ONBOARDING FORM */
          <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl backdrop-blur-sm">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Step 1: Business Details */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-400 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Business Information
                </span>
                {isPreFilled && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium lowercase">
                    <Check className="w-3 h-3" /> pre-filled
                  </span>
                )}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. GOOGLE PLACE ID OR GOOGLE MAPS LINK (HERO TOP POSITION) */}
                <div className="sm:col-span-2 space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-blue-500/30 shadow-inner">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Google Place ID or Google Maps Link *
                      <span className="text-[10px] font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 ml-1">
                        Auto-fills business details
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPlaceIdHelp(true)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>How to find your Place ID (10s)</span>
                    </button>
                  </div>

                  <div className="relative">
                    <Globe className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Paste your Google Maps link (e.g. https://www.google.com/maps/place/...) or Place ID"
                      value={placeId}
                      onChange={(e) => handlePlaceIdChange(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-blue-400 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 focus:outline-none transition-colors font-mono"
                    />
                    {isLookingUp && (
                      <Loader2 className="w-4 h-4 text-blue-400 absolute right-3.5 top-3.5 animate-spin" />
                    )}
                  </div>

                  {/* AUTO-FILL FEEDBACK NOTIFICATION */}
                  {autoFillSuccessMsg && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs animate-fadeIn">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-medium">{autoFillSuccessMsg}</span>
                    </div>
                  )}

                  {/* PLACE ID VERIFICATION & LIVE TEST BUTTON */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-[11px] text-slate-400">
                      {placeId
                        ? "✓ Place ID identified. Test it below to verify your Google review box:"
                        : "Paste any Google Maps link or Place ID above to automatically detect your business profile."}
                    </span>

                    {placeId && (
                      <a
                        href={currentReviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-colors shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Test My Google Review Link</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* 2. BUSINESS / CLINIC / SALON NAME */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Business / Clinic / Salon Name *
                    </label>
                    {businessName && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> auto-filled
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Apex Dental Studio or Glow Hair Lounge"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 3. INDUSTRY CATEGORY */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Industry Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none transition-colors"
                  >
                    {Object.values(INDUSTRY_QUESTION_POOLS).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. CITY (SEPARATE & AUTO-FILLED) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      City *
                    </label>
                    {city && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> auto-filled
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Kolkata, Habra, or Austin"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 5. COUNTRY (SEPARATE & AUTO-FILLED) */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      Country *
                    </label>
                    {country && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> auto-filled
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none transition-colors"
                    >
                      <option value="India">🇮🇳 India</option>
                      <option value="United States">🇺🇸 United States</option>
                      <option value="United Kingdom">🇬🇧 United Kingdom</option>
                      <option value="Canada">🇨🇦 Canada</option>
                      <option value="Australia">🇦🇺 Australia</option>
                      <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                      <option value="Singapore">🇸🇬 Singapore</option>
                      <option value="Germany">🇩🇪 Germany</option>
                      <option value="France">🇫🇷 France</option>
                      <option value="Ireland">🇮🇪 Ireland</option>
                      <option value="New Zealand">🇳🇿 New Zealand</option>
                      {!["India", "United States", "United Kingdom", "Canada", "Australia", "United Arab Emirates", "Singapore", "Germany", "France", "Ireland", "New Zealand", "Other"].includes(country) && (
                        <option value={country}>📍 {country}</option>
                      )}
                      <option value="Other">🌍 Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Owner Contact for Trial (Auto-filled from Google Map Scraping or Lead Invite) */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Owner / Manager Contact
                </h2>
                {(ownerEmail || ownerName || ownerPhone) && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium lowercase">
                    <Check className="w-3 h-3" /> auto-filled from cold email / scraper
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. YOUR NAME */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-200">
                      Your Name (Manager / Owner) *
                    </label>
                    {ownerName ? (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> auto-filled
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-medium">Please enter your name</span>
                    )}
                  </div>
                  <div className="relative">
                    <User className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dr. John Smith or Rajesh Sharma"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 2. POSITION / TITLE */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Position / Title
                    </label>
                    {position && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> auto-filled
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Owner, General Manager, Director"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 3. BUSINESS EMAIL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Business Email (For notifications & standee PDF) *
                    </label>
                    {ownerEmail && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> auto-filled
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      required
                      type="email"
                      placeholder="owner@yourbusiness.com"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 4. PHONE / WHATSAPP NUMBER */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Business Phone / WhatsApp Number
                    </label>
                    {ownerPhone && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> auto-filled
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210 or +1 (512) 555-0199"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cold Email Scraper Outreach Integration Guide (Accordion) */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowColdEmailHelp(!showColdEmailHelp)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Cold Email Scraper Outreach: How to send 100% pre-filled links</span>
                <span className="text-[10px] text-slate-500">({showColdEmailHelp ? "Hide guide" : "Show URL template"})</span>
              </button>

              {showColdEmailHelp && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3 animate-fadeIn">
                  <p className="text-slate-300 leading-relaxed">
                    When approaching leads via cold email with data from your custom Google Map scraper (via Instantly, Smartlead, Lemlist, or Python), use merge tags so all 8 fields are pre-filled automatically with zero typing:
                  </p>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400">Direct URL Format (with Cold Email Merge Tags):</p>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-blue-300 select-all break-all leading-relaxed">
                      https://mithundas.com/products/theqrbasedsystem/onboard?name=&#123;&#123;business_name&#125;&#125;&amp;city=&#123;&#123;city&#125;&#125;&amp;country=&#123;&#123;country&#125;&#125;&amp;cat=&#123;&#123;category&#125;&#125;&amp;placeId=&#123;&#123;place_id&#125;&#125;&amp;email=&#123;&#123;email&#125;&#125;&amp;phone=&#123;&#123;phone&#125;&#125;&amp;owner=&#123;&#123;owner_name&#125;&#125;&amp;position=&#123;&#123;position&#125;&#125;
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    💡 If your scraped leads are saved in the database, use the ultra-clean short link: <code className="text-emerald-400 font-mono">?leadId=&#123;&#123;lead_id&#125;&#125;</code>.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: No Card Trial Notice & CTA */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-emerald-300">100% Free 3-Day Trial Guarantee</p>
                  <p className="text-emerald-400/90 leading-relaxed">
                    Zero credit card required. Print your standee, test it on your front desk, and watch your Google reviews grow. Cancel anytime.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-400 active:scale-[0.98] shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 text-base transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Generating Your Custom QR & Standee...</span>
                ) : (
                  <>
                    <span>
                      {businessName
                        ? `Activate & Print Standee for ${businessName}`
                        : "Generate My Custom QR Standee Now"}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* MODAL: HOW TO FIND YOUR GOOGLE PLACE ID / REVIEW LINK */}
      {showPlaceIdHelp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowPlaceIdHelp(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-sm font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="inline-flex p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 mb-1">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">How to Find Your Google Place ID</h3>
              <p className="text-xs text-slate-400">
                It takes under 15 seconds to grab your official Google Maps ID.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              {/* Method 1: Google Business Profile Share Link */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
                  <span>Easiest Method: Google Maps Share Link</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed pl-1">
                  <li>Search your clinic / salon on Google or Google Maps.</li>
                  <li>Click <strong>"Ask for reviews"</strong> or <strong>"Share review form"</strong>.</li>
                  <li>Copy that link and paste it into the box! Our system automatically extracts your exact Place ID.</li>
                </ol>
              </div>

              {/* Method 2: Official Google Place ID Finder Tool */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-400 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">2</span>
                  <span>Official Google Place ID Finder Map</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Google provides a free map tool. Type your business name and address, and it shows your Place ID (starts with <code className="text-blue-300">ChIJ...</code>).
                </p>
                <a
                  href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors mt-1"
                >
                  <span>Open Google Place ID Finder Tool</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPlaceIdHelp(false)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Got It, Back to Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OnboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <div className="text-xs text-slate-400 animate-pulse">Loading Onboarding Assistant...</div>
        </div>
      }
    >
      <OnboardFormContent />
    </Suspense>
  );
}
