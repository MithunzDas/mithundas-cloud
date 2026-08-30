"use client";

import React, { useState, useMemo } from "react";
import { Search, Sparkles, MapPin, Layers, Play, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ScraperFormProps {
  onSearchComplete: () => void;
}

const POPULAR_CATEGORIES = [
  "Dentists & Dental Clinics",
  "Restaurants & Fine Dining",
  "Hotels & Lodgings",
  "Lawyers & Legal Advocates",
  "Doctors & Polyclinics",
  "Gyms & Fitness Centers",
  "Beauty Parlours & Luxury Spas",
  "Real Estate & Property Agents",
  "Cafes & Bakeries",
  "Schools & Coaching Institutes",
  "Car Showrooms & Auto Garages",
  "Jewellery Showrooms"
];

const POPULAR_CITIES = [
  "Habra, West Bengal",
  "Barasat, West Bengal",
  "Kolkata, West Bengal",
  "Siliguri, West Bengal",
  "Mumbai, Maharashtra",
  "Delhi NCR",
  "Bengaluru, Karnataka",
  "London, United Kingdom",
  "Dubai, United Arab Emirates",
  "Singapore"
];

export function LeadScraperForm({ onSearchComplete }: ScraperFormProps) {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [targetCount, setTargetCount] = useState(50);
  const [isScraping, setIsScraping] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Category Autocomplete / Fuzzy Filter
  const filteredCategories = useMemo(() => {
    if (!category) return POPULAR_CATEGORIES;
    return POPULAR_CATEGORIES.filter(c => c.toLowerCase().includes(category.toLowerCase()));
  }, [category]);

  // City Autocomplete Filter
  const filteredCities = useMemo(() => {
    if (!city) return POPULAR_CITIES;
    return POPULAR_CITIES.filter(c => c.toLowerCase().includes(city.toLowerCase()));
  }, [city]);

  const handleStartScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !city) {
      setStatusMsg("Please select or enter both Category and City.");
      return;
    }

    setIsScraping(true);
    setStatusMsg(`Initializing continuous deep scan for "${category}" in ${city}...`);

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
        setStatusMsg(`✅ Extraction batch initialized! Database and Google Sheet synced.`);
        setTimeout(() => {
          onSearchComplete();
          setIsScraping(false);
          setStatusMsg("");
        }, 1500);
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
    <div className="bg-[#101726]/90 border border-brand-cyan/20 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-app">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-indigo/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary tracking-wide">
              Live Lead Extraction Control Panel
            </h2>
            <p className="text-xs text-text-secondary font-mono">
              Continuous GMaps Feed + Domain Email &amp; WhatsApp Enrichment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Dual-Sync: VPS DB + Google Sheet</span>
        </div>
      </div>

      <form onSubmit={handleStartScrape} className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Category Searchable Combobox */}
        <div className="md:col-span-5 relative">
          <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Business Category</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Dentists, Restaurants (Type 're'...)"
              className="w-full bg-[#0b0f17] border border-border-app rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan transition-colors"
            />
            <Search className="w-4 h-4 text-gray-500 absolute right-3.5 top-3 pointer-events-none" />
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {filteredCategories.slice(0, 4).map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat.split(" &")[0])}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-border-app hover:border-brand-cyan/40 text-text-secondary hover:text-brand-cyan transition-all"
              >
                {cat.split(" &")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* City Input */}
        <div className="md:col-span-4 relative">
          <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-indigo" />
            <span>Target City / Area</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Habra, London, Dubai..."
              className="w-full bg-[#0b0f17] border border-border-app rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan transition-colors"
            />
            <MapPin className="w-4 h-4 text-gray-500 absolute right-3.5 top-3 pointer-events-none" />
          </div>

          {/* Quick City Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {filteredCities.slice(0, 3).map((ct) => (
              <button
                type="button"
                key={ct}
                onClick={() => setCity(ct)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-border-app hover:border-brand-indigo/40 text-text-secondary hover:text-brand-indigo transition-all"
              >
                {ct.split(",")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Target Count & Submit */}
        <div className="md:col-span-3 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-2">
              Target Leads: <span className="text-brand-cyan font-bold">{targetCount}</span>
            </label>
            <input
              type="range"
              min="20"
              max="200"
              step="10"
              value={targetCount}
              onChange={(e) => setTargetCount(Number(e.target.value))}
              className="w-full accent-brand-cyan cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={isScraping}
            className="w-full mt-3 bg-gradient-to-r from-brand-cyan to-brand-indigo hover:from-brand-cyan/90 hover:to-brand-indigo/90 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-cyan/20 transition-all disabled:opacity-50"
          >
            {isScraping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Feed...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Scraper</span>
              </>
            )}
          </button>
        </div>
      </form>

      {statusMsg && (
        <div className="mt-4 p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-mono text-brand-cyan flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
}
