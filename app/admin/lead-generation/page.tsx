"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminNav } from "../components/AdminNav";
import { LeadScraperForm } from "./components/LeadScraperForm";
import { SearchHistoryList } from "./components/SearchHistoryList";
import { LeadDataTable } from "./components/LeadDataTable";
import { RefreshCw, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-[#070a0f] text-text-primary pb-20">
      <AdminNav />

      <main className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title & Status Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans flex items-center gap-2.5 flex-wrap">
              <span>B2B Lead Generation &amp; WhatsApp Outreach Command Center</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-mono font-bold">
                DUAL-SYNC ENGINE
              </span>
            </h1>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Continuous Google Maps Deep Extraction ➔ 29-Column Enrichment ➔ Meta WhatsApp Cloud Outreach
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsLoading(true); fetchLeads(); }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-border-app hover:border-brand-cyan text-xs font-mono text-text-secondary hover:text-brand-cyan transition-all shadow-sm"
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
