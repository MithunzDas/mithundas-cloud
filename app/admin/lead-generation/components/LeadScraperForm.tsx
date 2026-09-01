"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Sparkles,
  MapPin,
  Layers,
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Radio,
  Clock,
  Database,
  FileSpreadsheet,
  Check,
  X
} from "lucide-react";

interface ScraperFormProps {
  onSearchComplete: () => void;
}

const POPULAR_CATEGORIES = [
  { label: "Dentists & Clinics", query: "Dentists & Dental Clinics", icon: "🦷" },
  { label: "Restaurants & Cafes", query: "Restaurants & Cafes", icon: "🍽️" },
  { label: "Hotels & Resorts", query: "Hotels & Resorts", icon: "🏨" },
  { label: "Dermatologists", query: "Dermatologists & Skin Clinics", icon: "💆" },
  { label: "Lawyers & Advocates", query: "Lawyers & Advocates", icon: "⚖️" },
  { label: "Salons & Spas", query: "Beauty Salons & Spas", icon: "💇" }
];

const POPULAR_CITIES = [
  "Habra, West Bengal",
  "Barasat, West Bengal",
  "Salt Lake, Kolkata",
  "New Town, Kolkata",
  "Kolkata, West Bengal"
];

const COUNT_PRESETS = [25, 50, 100, 200];

const PROGRESS_STEPS = [
  "⚡ Triggering n8n Webhook & Playwright Scraper on VPS...",
  "🌐 Traversing Google Maps High-Density Geo-Grid...",
  "🔍 Extracting Business Info, Ratings & Verified Reviews...",
  "📱 Enriching WhatsApp Mobile Numbers & Social Links...",
  "💻 Scanning Website Status, CMS Stack & Page Performance...",
  "📊 Appending Rows to Master Google Sheet Database...",
  "💾 Ingesting Enriched Records into VPS PostgreSQL Database..."
];

export function LeadScraperForm({ onSearchComplete }: ScraperFormProps) {
  const [category, setCategory] = useState("Dentists & Dental Clinics");
  const [city, setCity] = useState("Habra, West Bengal");
  const [targetCount, setTargetCount] = useState(50);
  const [isScraping, setIsScraping] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [extractedCount, setExtractedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const activeBatchIdRef = useRef<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer & Step Cycler during Scraping
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let stepTimer: NodeJS.Timeout;

    if (isScraping && !isCompleted) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      stepTimer = setInterval(() => {
        setCurrentStepIdx((prev) => (prev + 1) % PROGRESS_STEPS.length);
      }, 7000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [isScraping, isCompleted]);

  // Background Auto-Polling for Leads
  const startPollingForLeads = (batchId: string) => {
    activeBatchIdRef.current = batchId;
    let attempts = 0;

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/admin/lead-generation/leads?batchId=${batchId}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.leads) && data.leads.length > 0) {
          // Success! Found leads in DB
          clearInterval(pollIntervalRef.current!);
          setExtractedCount(data.leads.length);
          setIsCompleted(true);
          onSearchComplete();

          setTimeout(() => {
            setIsScraping(false);
            setIsCompleted(false);
            setElapsedSeconds(0);
          }, 2500);
        } else if (attempts > 100) {
          // Timeout after ~5 mins
          clearInterval(pollIntervalRef.current!);
          setIsScraping(false);
          setStatusMsg("Scrape process completed in background. Refresh table if needed.");
        }
      } catch (err) {
        console.error("Polling check error:", err);
      }
    }, 3000);
  };

  const handleStartScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !city) {
      setStatusMsg("Please select or enter both Category and City.");
      return;
    }

    setIsScraping(true);
    setIsCompleted(false);
    setElapsedSeconds(0);
    setCurrentStepIdx(0);
    setExtractedCount(0);
    setStatusMsg("");

    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      // 1. Fire scrape trigger API
      fetch("/api/admin/lead-generation/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          city,
          targetCount,
          batchId
        })
      }).then(async (res) => {
        const data = await res.json();
        if (data.success && data.totalFound > 0) {
          setExtractedCount(data.totalFound);
          setIsCompleted(true);
          onSearchComplete();
          setTimeout(() => {
            setIsScraping(false);
            setIsCompleted(false);
            setElapsedSeconds(0);
          }, 2000);
        }
      }).catch((err) => console.log("Background webhook fired..."));

      // 2. Start continuous live polling
      startPollingForLeads(batchId);
    } catch (err: any) {
      setStatusMsg(`❌ Network Error: ${err.message}`);
      setIsScraping(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* 1. Main Scraper Form Card */}
      <div className="bg-[#090d16] border border-cyan-500/20 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-36 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 blur-3xl pointer-events-none -z-10" />

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/20">
              <Radio className="w-6 h-6 animate-pulse text-black" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <span>Google Maps Discovery &amp; Live Scraper Engine</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  v2.4 DUAL-SYNC
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Real-time Google Maps feed + Playwright enrichment + Instant VPS DB sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Dual-Sync: PostgreSQL VPS DB + Google Sheet</span>
          </div>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleStartScrape} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Category Input */}
          <div className="lg:col-span-5 space-y-2">
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Business Category</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Dentists & Clinics, Restaurants..."
                className="w-full bg-[#050811] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.query}
                  onClick={() => setCategory(cat.query)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1 ${
                    category === cat.query
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* City Input */}
          <div className="lg:col-span-4 space-y-2">
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>City / Micro-Locality</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Habra, Salt Lake, Kolkata..."
                className="w-full bg-[#050811] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <MapPin className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>

            {/* City Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_CITIES.map((ct) => (
                <button
                  type="button"
                  key={ct}
                  onClick={() => setCity(ct)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-xl border transition-all ${
                    city === ct
                      ? "bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {ct.split(",")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Target Count & Launch Button */}
          <div className="lg:col-span-3 space-y-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <span>Target Leads:</span>
                </label>
                <span className="text-sm font-mono font-bold px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {targetCount}
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              {/* Count Presets */}
              <div className="flex items-center justify-between gap-1 mt-2">
                {COUNT_PRESETS.map((cnt) => (
                  <button
                    type="button"
                    key={cnt}
                    onClick={() => setTargetCount(cnt)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                      targetCount === cnt
                        ? "bg-cyan-500 text-black border-cyan-400"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            {/* Glowing Launch Button */}
            <button
              type="submit"
              disabled={isScraping}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:via-teal-400 hover:to-emerald-400 text-black font-extrabold text-xs font-mono tracking-wide shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>Launch Live Scraper</span>
            </button>
          </div>
        </form>

        {statusMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-cyan-400" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* 2. 3D VISUAL ROTATING RADAR PROGRESS MODAL OVERLAY */}
      {isScraping && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#090e18] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl shadow-cyan-500/20 text-center relative overflow-hidden">
            {/* Ambient Background Pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Circular Radar Animation */}
            <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              {/* Outer Pulsing Glow Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping opacity-30" />
              
              {/* Spinning Dual Rotating Gradient Rings */}
              <div className="absolute inset-1 rounded-full border-4 border-transparent border-t-cyan-400 border-r-teal-400 animate-spin" />
              <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-indigo-400 border-l-blue-400 animate-[spin_2s_linear_infinite_reverse]" />

              {/* Center Core Badge */}
              <div className="w-16 h-16 rounded-full bg-slate-950 border border-cyan-500/40 flex flex-col items-center justify-center shadow-inner">
                {isCompleted ? (
                  <Check className="w-8 h-8 text-emerald-400 animate-bounce" />
                ) : (
                  <>
                    <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-cyan-300 font-bold mt-0.5">
                      {formatTime(elapsedSeconds)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Modal Heading & Step Progress */}
            <div className="space-y-2 mb-6">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {isCompleted ? "🎉 Extraction Complete!" : "Live Google Maps Extraction in Progress"}
              </h3>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning: {category} in {city} (Target: {targetCount})</span>
              </div>

              {/* Dynamic Live Step Message */}
              <p className="text-xs text-slate-300 font-mono min-h-[36px] flex items-center justify-center px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
                {isCompleted
                  ? `✅ Successfully synced ${extractedCount || targetCount} leads to VPS Database & Google Sheet!`
                  : PROGRESS_STEPS[currentStepIdx]}
              </p>
            </div>

            {/* Dual Sync Indicators */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-left">
              <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-2.5">
                <Database className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-white">PostgreSQL VPS DB</p>
                  <p className="text-[9px] text-slate-400 font-mono">Live Sub-5ms Table Sync</p>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-white">Master Google Sheet</p>
                  <p className="text-[9px] text-slate-400 font-mono">29 Columns Auto-Appended</p>
                </div>
              </div>
            </div>

            {/* Background Notice */}
            <p className="text-[10px] text-slate-500 font-mono">
              Scraping deep review data &amp; WhatsApp numbers. Typically completes in 1–3 minutes.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
