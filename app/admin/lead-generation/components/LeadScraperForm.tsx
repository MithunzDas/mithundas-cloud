"use client";

import React, { useState, useMemo } from "react";
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
  Flame,
  Zap,
  Radio
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

export function LeadScraperForm({ onSearchComplete }: ScraperFormProps) {
  const [category, setCategory] = useState("Dentists & Dental Clinics");
  const [city, setCity] = useState("Habra, West Bengal");
  const [targetCount, setTargetCount] = useState(50);
  const [isScraping, setIsScraping] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleStartScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !city) {
      setStatusMsg("Please select or enter both Category and City.");
      return;
    }

    setIsScraping(true);
    setStatusMsg(`🚀 Scanning Google Maps live for "${category}" in ${city}...`);

    try {
      const res = await fetch("/api/admin/lead-generation/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          city,
          targetCount
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg(`✅ Extraction complete! Synced to VPS Database & Google Sheets.`);
        setTimeout(() => {
          onSearchComplete();
          setIsScraping(false);
          setStatusMsg("");
        }, 1200);
      } else {
        setStatusMsg(`❌ Error: ${data.error || "Failed to start extraction"}`);
        setIsScraping(false);
      }
    } catch (err: any) {
      setStatusMsg(`❌ Network Error: ${err.message}`);
      setIsScraping(false);
    }
  };

  return (
    <div className="bg-[#090d16] border border-cyan-500/20 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-36 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Header bar */}
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

      {/* Main Search Controls */}
      <form onSubmit={handleStartScrape} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* 1. Category Field */}
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

          {/* Quick Category Pills */}
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

        {/* 2. City / Locality Field */}
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

          {/* Quick City Pills */}
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

        {/* 3. Target Leads Slider & High-Impact Launch Button */}
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

            {/* Quick Count Presets */}
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

          {/* Premium Glowing Launch Button */}
          <button
            type="submit"
            disabled={isScraping}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:via-teal-400 hover:to-emerald-400 text-black font-extrabold text-xs font-mono tracking-wide shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isScraping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Scraping Feed...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black text-black" />
                <span>Launch Live Scraper</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Status Alert Banner */}
      {statusMsg && (
        <div className="mt-4 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-cyan-400" />
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
}
