"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminNav } from "../components/AdminNav";
import { LeadScraperForm } from "./components/LeadScraperForm";
import { SearchHistoryList } from "./components/SearchHistoryList";
import { LeadDataTable } from "./components/LeadDataTable";
import { RefreshCw, ShieldCheck, FileSpreadsheet, Key, Lock, LogOut } from "lucide-react";

const ADMIN_STORAGE_KEY = "mithundas_admin_secret";

export default function LeadGenerationAdminPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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

  // Get stored admin secret
  const getSecret = useCallback((): string => {
    if (adminSecret) return adminSecret;
    if (typeof window !== "undefined") {
      return localStorage.getItem(ADMIN_STORAGE_KEY) || "";
    }
    return "";
  }, [adminSecret]);

  const fetchLeads = useCallback(async (secret?: string) => {
    const s = secret || getSecret();
    if (!s) return;

    try {
      const url = selectedBatchId === "all"
        ? "/api/admin/lead-generation/leads"
        : `/api/admin/lead-generation/leads?batchId=${selectedBatchId}`;

      const res = await fetch(url, {
        headers: { "x-admin-secret": s },
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setBatches(data.batches || []);
        setLeads(data.leads || []);
        if (data.metrics) setMetrics(data.metrics);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Error fetching leads data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBatchId, getSecret]);

  // On mount: check stored secret
  useEffect(() => {
    const savedSecret = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (savedSecret) {
      setAdminSecret(savedSecret);
      fetchLeads(savedSecret);
    } else {
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refetch when batch changes (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [selectedBatchId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin/lead-generation/leads", {
        headers: { "x-admin-secret": adminSecret },
      });

      if (res.status === 401) {
        setAuthError("Invalid admin secret. Access denied.");
        setIsAuthenticated(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem(ADMIN_STORAGE_KEY, adminSecret);
        setBatches(data.batches || []);
        setLeads(data.leads || []);
        if (data.metrics) setMetrics(data.metrics);
      } else {
        setAuthError("Authentication failed.");
      }
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLockAdmin = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAuthenticated(false);
    setAdminSecret("");
    setLeads([]);
    setBatches([]);
  };

  // Phase 4: 1-Click Global Phone Deduplicator & Merger
  const handleDeduplicate = async () => {
    setIsDeduplicating(true);
    setBannerNotice("Scanning database for duplicate phone numbers across all search batches...");

    try {
      const res = await fetch("/api/admin/lead-generation/deduplicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": getSecret(),
        },
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

  // ─── AUTH GATE: Admin Password Screen ─────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#070a0f] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Shield Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 shadow-lg shadow-cyan-500/25 mx-auto">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Access Required</h1>
            <p className="text-xs text-slate-400 font-mono">
              B2B Lead Generation &amp; Outreach Console
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono rounded-lg p-3 text-center">
              {authError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-400" htmlFor="admin-secret">
                Enter Admin Access Token
              </label>
              <div className="relative">
                <input
                  id="admin-secret"
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="admin_secret_token..."
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-900/80 py-3 pl-10 pr-4 font-sans text-sm text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  required
                />
                <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 font-mono text-xs font-semibold text-white transition-all hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 shadow-md shadow-cyan-500/20"
            >
              {authLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Authenticate"}
            </button>
          </form>

          <p className="text-[10px] text-slate-600 text-center font-mono">
            mithundas.cloud lead management
          </p>
        </div>
      </main>
    );
  }

  // ─── AUTHENTICATED VIEW ───────────────────────────────────────────────
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

          {/* Action Group: Deduplicate, Refresh DB & Lock Admin */}
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

            <button
              onClick={handleLockAdmin}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-mono text-rose-400 hover:text-rose-300 transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
              title="Lock admin panel and clear credentials"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Admin</span>
            </button>
          </div>
        </div>

        {/* Banner Notice */}
        {bannerNotice && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono rounded-xl p-3 text-center">
            {bannerNotice}
          </div>
        )}

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

        {/* 3. Full-Width 100% Responsive Lead Data Table */}
        <div className="w-full">
          <LeadDataTable leads={leads} onRefresh={fetchLeads} adminSecret={getSecret()} />
        </div>
      </main>
    </div>
  );
}
