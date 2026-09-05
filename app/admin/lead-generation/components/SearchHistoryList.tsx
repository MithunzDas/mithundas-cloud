"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Layers,
  Flame,
  CheckCircle2,
  MessageSquareCheck,
  History,
  Search,
  Trash2,
  Clock,
  Calendar,
  MapPin,
  RotateCcw,
  LayoutGrid,
  Rows3
} from "lucide-react";

interface BatchItem {
  id: string;
  batchId: string;
  category: string;
  city: string;
  searchQuery?: string;
  targetCount: number;
  totalFound: number;
  hotCount: number;
  createdAt: string;
  _count?: {
    leads: number;
  };
}

interface SearchHistoryListProps {
  batches: BatchItem[];
  selectedBatchId: string;
  onSelectBatch: (batchId: string) => void;
  onRefresh: () => void;
  metrics: {
    totalLeads: number;
    hotLeads: number;
    pitchedLeads: number;
    repliedLeads: number;
  };
}

/**
 * Format Indian Timestamp (IST): DD-MM-YYYY • hh:mm AM/PM IST (Strictly without seconds)
 */
export function formatIndianTimestamp(dateInput?: string | Date): string {
  if (!dateInput) return "";
  try {
    const d = new Date(dateInput);
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    const parts = formatter.formatToParts(d);
    const day = parts.find(p => p.type === "day")?.value || "01";
    const month = parts.find(p => p.type === "month")?.value || "01";
    const year = parts.find(p => p.type === "year")?.value || "2026";
    const hour = parts.find(p => p.type === "hour")?.value || "12";
    const minute = parts.find(p => p.type === "minute")?.value || "00";
    const dayPeriod = parts.find(p => p.type === "dayPeriod")?.value?.toUpperCase() || "AM";

    return `${day}-${month}-${year} • ${hour}:${minute} ${dayPeriod} IST`;
  } catch {
    return "";
  }
}

/**
 * Format Indian Date Key: DD-MM-YYYY (For Date Filtering)
 */
export function formatIndianDateKey(dateInput?: string | Date): string {
  if (!dateInput) return "";
  try {
    const d = new Date(dateInput);
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    const parts = formatter.formatToParts(d);
    const day = parts.find(p => p.type === "day")?.value || "01";
    const month = parts.find(p => p.type === "month")?.value || "01";
    const year = parts.find(p => p.type === "year")?.value || "2026";
    return `${day}-${month}-${year}`;
  } catch {
    return "";
  }
}

export function SearchHistoryList({
  batches,
  selectedBatchId,
  onSelectBatch,
  onRefresh,
  metrics
}: SearchHistoryListProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Desktop view toggle: "ribbon" (horizontal single row) vs "grid" (multi-row vertical grid)
  const [viewMode, setViewMode] = useState<"ribbon" | "grid">("ribbon");

  // Load saved view mode from localStorage on mount (desktop only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("leadgen_feed_view_mode");
      if (saved === "grid" || saved === "ribbon") {
        setViewMode(saved);
      }
    } catch {}
  }, []);

  const handleToggleViewMode = (mode: "ribbon" | "grid") => {
    setViewMode(mode);
    try {
      localStorage.setItem("leadgen_feed_view_mode", mode);
    } catch {}
  };

  // Compute unique categories, locations, and dates dynamically from active batches
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(batches.map((b) => b.category).filter(Boolean))).sort();
  }, [batches]);

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(batches.map((b) => b.city).filter(Boolean))).sort();
  }, [batches]);

  const uniqueDates = useMemo(() => {
    return Array.from(
      new Set(batches.map((b) => formatIndianDateKey(b.createdAt)).filter(Boolean))
    ).sort().reverse();
  }, [batches]);

  // Check if any filter is active
  const isAnyFilterActive =
    filterQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedLocation !== "all" ||
    selectedDate !== "all";

  const handleResetFilters = () => {
    setFilterQuery("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedDate("all");
  };

  // Filter Batches by search query, category, location, and date
  const filteredBatches = useMemo(() => {
    const todayKey = formatIndianDateKey(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayKey = formatIndianDateKey(yesterdayDate);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return batches.filter((b) => {
      // 1. Text search
      const q = filterQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        b.category.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        (b.searchQuery && b.searchQuery.toLowerCase().includes(q));

      // 2. Business Category filter
      const matchesCategory =
        selectedCategory === "all" ||
        b.category.toLowerCase() === selectedCategory.toLowerCase();

      // 3. Location filter
      const matchesLocation =
        selectedLocation === "all" ||
        b.city.toLowerCase() === selectedLocation.toLowerCase();

      // 4. Search Date filter
      let matchesDate = true;
      if (selectedDate !== "all") {
        const batchDateKey = formatIndianDateKey(b.createdAt);
        if (selectedDate === "today") {
          matchesDate = batchDateKey === todayKey;
        } else if (selectedDate === "yesterday") {
          matchesDate = batchDateKey === yesterdayKey;
        } else if (selectedDate === "7days") {
          matchesDate = new Date(b.createdAt) >= sevenDaysAgo;
        } else {
          matchesDate = batchDateKey === selectedDate;
        }
      }

      return matchesQuery && matchesCategory && matchesLocation && matchesDate;
    });
  }, [batches, filterQuery, selectedCategory, selectedLocation, selectedDate]);

  const handleDeleteBatch = async (e: React.MouseEvent, batch: BatchItem) => {
    e.stopPropagation();

    if (!confirm(`Delete search batch "${batch.category} in ${batch.city}" and all its leads?`)) {
      return;
    }

    setIsDeleting(batch.batchId);
    try {
      const res = await fetch(`/api/admin/lead-generation/leads?batchId=${batch.batchId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        if (selectedBatchId === batch.batchId) {
          onSelectBatch("all");
        }
        onRefresh();
      } else {
        alert(`Failed to delete batch: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Full-Width 4-Column Live Metric Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-[#101726]/90 p-4 rounded-2xl border border-border-app/80 shadow-lg backdrop-blur-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider block mb-1">
              Total in VPS DB
            </span>
            <p className="text-2xl font-bold font-sans text-text-primary tracking-tight">
              {metrics.totalLeads}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-border-app flex items-center justify-center text-brand-cyan">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 via-[#101726]/90 to-orange-500/10 p-4 rounded-2xl border border-amber-500/30 shadow-lg backdrop-blur-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 fill-current" /> Hot Leads
            </span>
            <p className="text-2xl font-bold font-sans text-amber-300 tracking-tight">
              {metrics.hotLeads}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5 fill-current" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 via-[#101726]/90 to-indigo-500/10 p-4 rounded-2xl border border-blue-500/30 shadow-lg backdrop-blur-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block mb-1">
              Pitched (Sent)
            </span>
            <p className="text-2xl font-bold font-sans text-blue-300 tracking-tight">
              {metrics.pitchedLeads}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 via-[#101726]/90 to-teal-500/10 p-4 rounded-2xl border border-emerald-500/30 shadow-lg backdrop-blur-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <MessageSquareCheck className="w-3.5 h-3.5" /> Replied
            </span>
            <p className="text-2xl font-bold font-sans text-emerald-300 tracking-tight">
              {metrics.repliedLeads}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <MessageSquareCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Full-Width Horizontal Past Extraction Feeds Ribbon */}
      <div className="bg-[#101726]/90 border border-border-app rounded-2xl p-4 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 mb-3 pb-2.5 border-b border-border-app">
          {/* Left Title */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <History className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider whitespace-nowrap">
              Past Extraction Feeds &amp; Batches
            </h3>
          </div>

          {/* Search Categories (Date, Locations, Business Categories) */}
          <div className="flex flex-wrap items-center gap-2 flex-1 justify-start xl:justify-center px-1">
            {/* 1. Business Category Selector */}
            <div className="relative flex items-center">
              <span className="absolute left-2.5 pointer-events-none text-brand-cyan">
                <Layers className="w-3.5 h-3.5" />
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#0b0f17] border border-border-app hover:border-brand-cyan/60 text-text-primary text-xs font-mono rounded-lg pl-8 pr-7 py-1.5 focus:outline-none focus:border-brand-cyan cursor-pointer transition-all appearance-none max-w-[200px] truncate"
                title="Filter by Business Category"
              >
                <option value="all">All Categories ({uniqueCategories.length})</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0b0f17] text-white">
                    {cat}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 pointer-events-none text-[8px] text-gray-400">▼</span>
            </div>

            {/* 2. Location Selector */}
            <div className="relative flex items-center">
              <span className="absolute left-2.5 pointer-events-none text-emerald-400">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-[#0b0f17] border border-border-app hover:border-emerald-400/60 text-text-primary text-xs font-mono rounded-lg pl-8 pr-7 py-1.5 focus:outline-none focus:border-emerald-400 cursor-pointer transition-all appearance-none max-w-[190px] truncate"
                title="Filter by Location"
              >
                <option value="all">All Locations ({uniqueLocations.length})</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc} className="bg-[#0b0f17] text-white">
                    {loc}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 pointer-events-none text-[8px] text-gray-400">▼</span>
            </div>

            {/* 3. Search Date Selector */}
            <div className="relative flex items-center">
              <span className="absolute left-2.5 pointer-events-none text-amber-400">
                <Calendar className="w-3.5 h-3.5" />
              </span>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#0b0f17] border border-border-app hover:border-amber-400/60 text-text-primary text-xs font-mono rounded-lg pl-8 pr-7 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer transition-all appearance-none max-w-[160px] truncate"
                title="Filter by Search Date"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="7days">Last 7 Days</option>
                {uniqueDates.map((dStr) => (
                  <option key={dStr} value={dStr} className="bg-[#0b0f17] text-white">
                    {dStr}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 pointer-events-none text-[8px] text-gray-400">▼</span>
            </div>

            {/* Reset Button */}
            {isAnyFilterActive && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all cursor-pointer whitespace-nowrap"
                title="Clear all active filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right Controls: View Switcher, Filter input & All Leads count button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop Only: Horizontal Single-Row vs Multi-Row Grid View Toggle */}
            <div
              className="hidden md:flex items-center bg-[#0b0f17] border border-border-app rounded-lg p-0.5"
              title="Switch Layout: Single Row vs Multi-Row Grid (Desktop only)"
            >
              <button
                type="button"
                onClick={() => handleToggleViewMode("ribbon")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  viewMode === "ribbon"
                    ? "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 shadow-sm font-bold"
                    : "text-text-secondary hover:text-white"
                }`}
                title="Single Row Horizontal View"
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[10px]">Row</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleViewMode("grid")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 shadow-sm font-bold"
                    : "text-text-secondary hover:text-white"
                }`}
                title="Multi-Row Multi-Column Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[10px]">Grid</span>
              </button>
            </div>

            <div className="relative min-w-[140px] sm:min-w-[170px]">
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter feeds..."
                className="w-full bg-[#0b0f17] border border-border-app rounded-lg pl-7 pr-3 py-1.5 text-xs text-text-primary placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan"
              />
              <Search className="w-3 h-3 text-gray-500 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            <button
              onClick={() => onSelectBatch("all")}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedBatchId === "all"
                  ? "bg-brand-cyan text-black font-bold shadow-md shadow-brand-cyan/20"
                  : "text-text-secondary hover:text-brand-cyan bg-white/5 border border-border-app"
              }`}
            >
              All Leads ({metrics.totalLeads})
            </button>
          </div>
        </div>

        {/* Feeds Card Container: 
            - Mobile: Strictly single-row horizontal scroll (unchanged)
            - Desktop: Toggles between single horizontal row vs multi-row responsive multi-column grid
        */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 max-h-[440px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-800"
              : "flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-gray-800"
          }
        >
          {filteredBatches.length === 0 ? (
            <div className="text-xs text-text-secondary font-mono py-2 flex items-center gap-2">
              <span>No saved batches found matching the selected filters.</span>
              {isAnyFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="text-brand-cyan underline hover:text-cyan-300 cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredBatches.map((batch) => {
              const isSelected = selectedBatchId === batch.batchId;
              const count = batch._count?.leads ?? batch.totalFound ?? 0;
              const isThisDeleting = isDeleting === batch.batchId;
              const istTimestamp = formatIndianTimestamp(batch.createdAt);

              return (
                <div
                  key={batch.batchId}
                  onClick={() => onSelectBatch(batch.batchId)}
                  className={`${
                    viewMode === "grid" ? "w-full" : "flex-shrink-0"
                  } flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-gradient-to-r from-brand-cyan/20 to-brand-indigo/20 border-brand-cyan shadow-md ring-1 ring-brand-cyan/40"
                      : "bg-[#0b0f17] border-border-app hover:border-brand-cyan/40 hover:bg-[#121824]"
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary group-hover:text-brand-cyan transition-colors truncate">
                        {batch.category}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-border-app text-brand-cyan font-bold flex-shrink-0">
                        {count}
                      </span>
                    </div>

                    <span className="text-[10px] text-text-secondary font-mono block truncate">
                      {batch.city}
                    </span>

                    {/* Indian Timestamp: DD-MM-YYYY • hh:mm AM/PM IST (No Seconds) */}
                    <span className="text-[9px] text-amber-400/90 font-mono flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-2.5 h-2.5 text-amber-400 flex-shrink-0" />
                      <span>{istTimestamp}</span>
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteBatch(e, batch)}
                    disabled={isThisDeleting}
                    title="Delete this entire category from DB"
                    className="p-1 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/15 transition-colors opacity-60 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
