"use client";

import React, { useState } from "react";
import { Clock, Search, Flame, MessageSquareCheck, Trash2, Layers, AlertTriangle } from "lucide-react";

interface BatchItem {
  id: string;
  batchId: string;
  category: string;
  city: string;
  searchQuery: string;
  targetCount: number;
  totalFound: number;
  hotCount: number;
  createdAt: string;
  _count?: { leads: number };
}

interface SearchHistoryProps {
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

export function SearchHistoryList({
  batches,
  selectedBatchId,
  onSelectBatch,
  onRefresh,
  metrics
}: SearchHistoryProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredBatches = batches.filter(b =>
    b.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
    b.city.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleDeleteBatch = async (e: React.MouseEvent, batch: BatchItem) => {
    e.stopPropagation();
    const count = batch._count?.leads || batch.totalFound || batch.targetCount;
    if (!confirm(`Are you sure you want to delete "${batch.category} (${batch.city})" and all ${count} leads inside the database?`)) {
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
    <div className="bg-[#101726]/90 border border-border-app rounded-2xl p-5 backdrop-blur-xl flex flex-col h-full shadow-2xl">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-5 pb-5 border-b border-border-app">
        <div className="bg-[#0b0f17] p-3 rounded-xl border border-border-app/80">
          <span className="text-[10px] font-mono text-text-secondary uppercase">Total in VPS DB</span>
          <p className="text-lg font-bold text-text-primary">{metrics.totalLeads}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-3 rounded-xl border border-amber-500/30">
          <span className="text-[10px] font-mono text-amber-400 uppercase flex items-center gap-1">
            <Flame className="w-3 h-3 fill-current" /> Hot Leads
          </span>
          <p className="text-lg font-bold text-amber-300">{metrics.hotLeads}</p>
        </div>
        <div className="bg-[#0b0f17] p-3 rounded-xl border border-border-app/80">
          <span className="text-[10px] font-mono text-text-secondary uppercase">Pitched (Sent)</span>
          <p className="text-lg font-bold text-brand-cyan">{metrics.pitchedLeads}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-3 rounded-xl border border-emerald-500/30">
          <span className="text-[10px] font-mono text-emerald-400 uppercase flex items-center gap-1">
            <MessageSquareCheck className="w-3 h-3" /> Replied
          </span>
          <p className="text-lg font-bold text-emerald-300">{metrics.repliedLeads}</p>
        </div>
      </div>

      {/* History Header & Search */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Past Extraction Feeds</span>
        </h3>
        <button
          onClick={() => onSelectBatch("all")}
          className={`text-[11px] font-mono px-2.5 py-1 rounded-lg transition-all ${
            selectedBatchId === "all"
              ? "bg-brand-cyan text-black font-bold shadow-md shadow-brand-cyan/20"
              : "text-text-secondary hover:text-brand-cyan hover:bg-white/5"
          }`}
        >
          View All
        </button>
      </div>

      <div className="relative mb-3">
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter history by category/city..."
          className="w-full bg-[#0b0f17] border border-border-app rounded-xl px-3.5 py-2 text-xs text-text-primary placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan transition-colors"
        />
        <Search className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
      </div>

      {/* Batch Cards List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[520px] pr-1 scrollbar-thin scrollbar-thumb-gray-800">
        {filteredBatches.length === 0 ? (
          <div className="text-center py-10 text-xs text-text-secondary font-mono">
            No search feeds found. Launch a new search above!
          </div>
        ) : (
          filteredBatches.map((batch) => {
            const isSelected = selectedBatchId === batch.batchId;
            const count = batch._count?.leads || batch.totalFound || batch.targetCount;
            const isThisDeleting = isDeleting === batch.batchId;

            return (
              <div
                key={batch.batchId}
                onClick={() => onSelectBatch(batch.batchId)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                  isSelected
                    ? "bg-gradient-to-r from-brand-cyan/15 to-brand-indigo/15 border-brand-cyan shadow-md ring-1 ring-brand-cyan/40"
                    : "bg-[#0b0f17]/80 border-border-app hover:border-brand-cyan/40 hover:bg-[#121824]"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-text-primary truncate max-w-[170px] group-hover:text-brand-cyan transition-colors">
                    {batch.category}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-border-app text-brand-cyan font-bold">
                      {count} leads
                    </span>
                    <button
                      onClick={(e) => handleDeleteBatch(e, batch)}
                      disabled={isThisDeleting}
                      title="Delete this entire category and its leads from DB"
                      className="p-1 rounded-md text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-secondary font-mono">
                  <span className="truncate max-w-[150px]">{batch.city}</span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(batch.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
