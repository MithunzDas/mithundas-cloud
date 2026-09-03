"use client";

import React, { useState } from "react";
import {
  Layers,
  Flame,
  CheckCircle2,
  MessageSquareCheck,
  History,
  Search,
  Trash2,
  Clock
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

export function SearchHistoryList({
  batches,
  selectedBatchId,
  onSelectBatch,
  onRefresh,
  metrics
}: SearchHistoryListProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filter Batches by search query
  const filteredBatches = batches
    .filter((b) => (b._count?.leads ?? b.totalFound ?? 0) > 0) // Hide placeholder boxes with 0 leads
    .filter(
      (b) =>
        b.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
        b.city.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (b.searchQuery && b.searchQuery.toLowerCase().includes(filterQuery.toLowerCase()))
    );

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2.5 border-b border-border-app">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-brand-cyan" />
            <h3 className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">
              Past Extraction Feeds &amp; Batches
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[180px]">
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter feeds..."
                className="w-full bg-[#0b0f17] border border-border-app rounded-lg pl-7 pr-3 py-1 text-xs text-text-primary placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan"
              />
              <Search className="w-3 h-3 text-gray-500 absolute left-2.5 top-2 pointer-events-none" />
            </div>

            <button
              onClick={() => onSelectBatch("all")}
              className={`text-xs font-mono px-3 py-1 rounded-lg transition-all ${
                selectedBatchId === "all"
                  ? "bg-brand-cyan text-black font-bold shadow-md shadow-brand-cyan/20"
                  : "text-text-secondary hover:text-brand-cyan bg-white/5 border border-border-app"
              }`}
            >
              All Leads ({metrics.totalLeads})
            </button>
          </div>
        </div>

        {/* Horizontal Chips Feed - Exactly ONE dedicated box per search query */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-gray-800">
          {filteredBatches.length === 0 ? (
            <div className="text-xs text-text-secondary font-mono py-1">
              No saved batches found matching filter.
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
                  className={`flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-gradient-to-r from-brand-cyan/20 to-brand-indigo/20 border-brand-cyan shadow-md ring-1 ring-brand-cyan/40"
                      : "bg-[#0b0f17] border-border-app hover:border-brand-cyan/40 hover:bg-[#121824]"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary group-hover:text-brand-cyan transition-colors truncate max-w-[200px]">
                        {batch.category}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-border-app text-brand-cyan font-bold">
                        {count}
                      </span>
                    </div>

                    <span className="text-[10px] text-text-secondary font-mono block truncate max-w-[220px]">
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
                    className="p-1 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/15 transition-colors opacity-60 group-hover:opacity-100"
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
