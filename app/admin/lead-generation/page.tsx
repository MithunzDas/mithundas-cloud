"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminNav } from "../components/AdminNav";
import { LeadScraperForm } from "./components/LeadScraperForm";
import { SearchHistoryList } from "./components/SearchHistoryList";
import { LeadDataTable } from "./components/LeadDataTable";
import { Sparkles, RefreshCw, Layers } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-[#070a0f] text-text-primary pb-16">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title & Status Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl font-bold font-sans flex items-center gap-2.5">
              <span>B2B Lead Generation &amp; Outreach Command Center</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-mono font-bold">
                DUAL-SYNC ENGINE
              </span>
            </h1>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Deep Google Maps Extraction ➔ 29-Column Enrichment ➔ Meta WhatsApp Cloud Outreach
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsLoading(true); fetchLeads(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-border-app hover:border-brand-cyan text-xs font-mono text-text-secondary hover:text-brand-cyan transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-brand-cyan" : ""}`} />
              <span>Refresh DB</span>
            </button>
          </div>
        </div>

        {/* Top Scraper Form */}
        <LeadScraperForm onSearchComplete={fetchLeads} />

        {/* Desktop & Tablet Split View (Left: Search History | Right: 29-Column Table) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Search History & Quick Stats (4 cols on lg) */}
          <div className="lg:col-span-4 h-full">
            <SearchHistoryList
              batches={batches}
              selectedBatchId={selectedBatchId}
              onSelectBatch={(id) => setSelectedBatchId(id)}
              metrics={metrics}
            />
          </div>

          {/* Right Column: 29-Column Interactive Lead Grid (8 cols on lg) */}
          <div className="lg:col-span-8 h-full">
            <LeadDataTable leads={leads} onRefresh={fetchLeads} />
          </div>
        </div>
      </main>
    </div>
  );
}
