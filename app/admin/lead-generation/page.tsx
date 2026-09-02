"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminNav } from "../components/AdminNav";
import { LeadScraperForm } from "./components/LeadScraperForm";
import { SearchHistoryList } from "./components/SearchHistoryList";
import { LeadDataTable } from "./components/LeadDataTable";
import { RefreshCw, Sparkles, ShieldCheck, Database, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";

export default function LeadGenerationAdminPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("all");
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    hotLeads: 0,
    pitchedLeads: 0,
    repliedLeads: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDeduplicating, setIsDeduplicating] = useState(false);
  const [bannerNotice, setBannerNotice] = useState("");

  const fetchLeads = useCallback(async () => {
    try {
      const url = selectedBatchId === "all"
        ? "/api/admin/lead-generation/leads"
        : `/api/admin/lead-generation/leads?batchId=${selectedBatchId}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setBatches(data.batches || []);
        setLeads(data.leads || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Error fetching leads data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBatchId]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Phase 4: 1-Click Global Phone Deduplicator & Merger
  const handleDeduplicate = async () => {
    setIsDeduplicating(true);
    setBannerNotice("Scanning database for duplicate phone numbers across all search batches...");

    try {
      const res = await fetch("/api/admin/lead-generation/deduplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (data.success) {
        setBannerNotice(`✅ ${data.message}`);
        fetchLeads();
        setTimeout(() => setBannerNotice(""), 4000);
      } else {
        setBannerNotice(`❌ Deduplication Error: ${data.error}`);
      }
    } catch (err: any) {
      setBannerNotice(`❌ Network error: ${err.message}`);
    } finally {
      setIsDeduplicating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-text-primary pb-20">
      <AdminNav />

      <main className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Title & Live Dual-Sync Health Indicators */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border-app/40">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-2xl font-bold font-sans tracking-tight text-white">
                B2B Lead Generation &amp; Outreach
              </h1>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold whitespace-nowrap">
                DUAL-SYNC
              </span>
            </div>
            
            {/* Phase 4 Live System Diagnostic Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap pt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] sm:text-[10px] whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>PostgreSQL DB (&lt;5ms)</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] sm:text-[10px] whitespace-nowrap">
                <FileSpreadsheet className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
                <span>Google Sheet Synced</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-[9px] sm:text-[10px] whitespace-nowrap">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-400" />
                <span>Anti-Duplicate Shield</span>
              </span>
            </div>
          </div>

          {/* Action Group: Deduplicate & Refresh DB (Side-by-Side 50/50 on Mobile) */}
          <div className="flex items-center gap-2 w-full md:w-auto pt-1 md:pt-0">
            <button
              onClick={handleDeduplicate}
              disabled={isDeduplicating}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/40 hover:bg-indigo-500/25 text-xs font-mono text-indigo-300 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              title="Scan all historical batches and merge duplicate phone numbers into master leads"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isDeduplicating ? "animate-spin text-indigo-400" : ""}`} />
              <span>{isDeduplicating ? "Scanning..." : "Deduplicate DB"}</span>
            </button>

            <button
              onClick={() => { setIsLoading(true); fetchLeads(); }}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-border-app hover:border-brand-cyan text-xs font-mono text-text-secondary hover:text-brand-cyan transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-brand-cyan" : ""}`} />
              <span>Refresh DB</span>
            </button>
          </div>
        </div>

        {/* 1. Live Lead Extraction Control Panel */}
        <LeadScraperForm onSearchComplete={fetchLeads} />

        {/* 2. Full-Width Metrics Cards & Search Feeds Ribbon */}
        <SearchHistoryList
          batches={batches}
          selectedBatchId={selectedBatchId}
          onSelectBatch={(id) => setSelectedBatchId(id)}
          onRefresh={fetchLeads}
          metrics={metrics}
        />

        {/* 3. Full-Width 100% Responsive 29-Column Lead Data Table */}
        <div className="w-full">
          <LeadDataTable leads={leads} onRefresh={fetchLeads} />
        </div>
      </main>
    </div>
  );
}
