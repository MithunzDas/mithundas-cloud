"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Mail,
  DollarSign,
  Target,
  Sparkles,
  AlertCircle,
  X,
  ChevronRight,
  Shield,
  Key,
  ChevronDown,
  ArrowUpRight
} from "lucide-react";
import { AdminNav } from "../components/AdminNav";

interface MeetingSummaryItem {
  id: string;
  roomId: string;
  leadId?: string;
  bookingId?: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  meetingDate: string;
  criticalObjectives: string[];
  keyDiscussionPoints: string[];
  paymentInfo: {
    totalFee: string;
    depositPercentage: string;
    milestones: string;
  };
  suggestedSOW: string;
  clientPainPoints: string[];
  requiredWorkflows: string[];
  technicalImplementationPlan: string;
  transcript?: string;
  createdAt: string;
}

export default function MeetingSummariesPage() {
  const [summaries, setSummaries] = useState<MeetingSummaryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminSecret, setAdminSecret] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mithundas_admin_secret") || "";
    }
    return "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSummary, setSelectedSummary] = useState<MeetingSummaryItem | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  const fetchSummaries = useCallback(async (secret: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/meeting-summaries", {
        headers: {
          "x-admin-secret": secret,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setSummaries(data.summaries || []);
        setIsAuthenticated(true);
        localStorage.setItem("mithundas_admin_secret", secret);
      } else {
        setIsAuthenticated(false);
        setNotification({ type: "error", text: "Invalid admin secret passphrase" });
      }
    } catch {
      setIsAuthenticated(false);
      setNotification({ type: "error", text: "Failed to connect to meeting summaries server" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedSecret = localStorage.getItem("mithundas_admin_secret");
    if (savedSecret) {
      fetchSummaries(savedSecret);
    }
  }, [fetchSummaries]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminSecret.trim()) {
      fetchSummaries(adminSecret.trim());
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredSummaries = useMemo(() => {
    return summaries.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;

      const nameMatch = (item.clientName || "").toLowerCase().includes(query);
      const emailMatch = (item.clientEmail || "").toLowerCase().includes(query);
      const companyMatch = (item.companyName || "").toLowerCase().includes(query);
      const sowMatch = (item.suggestedSOW || "").toLowerCase().includes(query);
      const pointsMatch = (item.keyDiscussionPoints || []).some((p) => p.toLowerCase().includes(query));
      const objMatch = (item.criticalObjectives || []).some((o) => o.toLowerCase().includes(query));

      return nameMatch || emailMatch || companyMatch || sowMatch || pointsMatch || objMatch;
    });
  }, [summaries, searchQuery]);

  const stats = useMemo(() => {
    const total = summaries.length;
    const withFinancials = summaries.filter(
      (s) => s.paymentInfo && s.paymentInfo.totalFee && s.paymentInfo.totalFee !== "Discussed on call"
    ).length;
    const latestDate = summaries[0]?.meetingDate || summaries[0]?.createdAt?.split("T")[0] || "None";
    return { total, withFinancials, latestDate };
  }, [summaries]);

  // If unauthenticated, display authentication card
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#07090e] text-text-primary flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#0f1420] border border-border-app rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500"></div>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">AI Meeting Dossiers</h1>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Enter admin secret key to access meeting intelligence &amp; SOW dossiers
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase mb-2">Admin Passphrase</label>
              <div className="relative">
                <Key className="w-4 h-4 text-text-secondary absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Enter admin secret..."
                  className="w-full bg-[#161d2c] border border-border-app rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-cyan-400 font-mono"
                  required
                />
              </div>
            </div>

            {notification && (
              <div
                className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                  notification.type === "error"
                    ? "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                    : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{notification.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-semibold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Access Meeting Intelligence"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans pb-16">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1422] p-5 rounded-2xl border border-border-app/80 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                AI Meeting Summaries &amp; Dossiers
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Internal intelligence extracted from discovery calls: key discussion points, critical objectives, statement of work (SOW), and financial scope for manual review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchSummaries(adminSecret)}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono text-slate-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/admin/finance"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-mono font-medium transition-all"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Financial Ledger</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0e1422] border border-border-app/80 p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Total Dossiers</span>
              <span className="text-2xl font-bold text-white mt-1 block">{stats.total}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0e1422] border border-border-app/80 p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Financial Scope Extracted</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 block">{stats.withFinancials}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0e1422] border border-border-app/80 p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Latest Call Recorded</span>
              <span className="text-base font-semibold text-slate-200 mt-1 block truncate max-w-[180px]">
                {stats.latestDate}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, company, critical objectives, SOW keywords..."
            className="w-full bg-[#0e1422] border border-border-app/80 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-white px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
        </div>

        {/* Meeting Summaries List */}
        {filteredSummaries.length === 0 ? (
          <div className="bg-[#0e1422] border border-border-app/80 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No Meeting Summaries Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {searchQuery
                ? "No meeting records match your search filter."
                : "When discovery calls conclude, the meeting intelligence engine automatically transcribes the audio, extracts 3-4 critical points, SOW, and financial scope, and logs them here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSummaries.map((item) => (
              <div
                key={item.id || item.roomId}
                onClick={() => setSelectedSummary(item)}
                className="group bg-[#0e1422] hover:bg-[#131b2e] border border-border-app/80 hover:border-cyan-500/40 rounded-2xl p-5 transition-all cursor-pointer shadow-md relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Client Info */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                        {item.clientName || "Client"}
                      </span>
                      {item.companyName && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono">
                          {item.companyName}
                        </span>
                      )}
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-mono">
                        Room: {item.roomId}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 font-mono">
                      {item.clientEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.clientEmail}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.meetingDate || item.createdAt?.split("T")[0]}</span>
                      </span>
                    </div>

                    {/* Statement of Work snippet */}
                    {item.suggestedSOW && (
                      <p className="text-xs text-slate-300 line-clamp-2 pt-1 font-sans">
                        <strong className="text-cyan-400 font-mono text-[11px] uppercase tracking-wider mr-1.5">
                          SOW:
                        </strong>
                        {item.suggestedSOW}
                      </p>
                    )}

                    {/* 3-4 Key Discussion Points Preview */}
                    {item.keyDiscussionPoints?.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {item.keyDiscussionPoints.slice(0, 3).map((point, pIdx) => (
                          <span
                            key={pIdx}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 max-w-xs truncate"
                            title={point}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                            <span className="truncate">{point}</span>
                          </span>
                        ))}
                        {item.keyDiscussionPoints.length > 3 && (
                          <span className="text-[11px] text-slate-500 font-mono self-center">
                            +{item.keyDiscussionPoints.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Financial Scope & Action */}
                  <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-right">
                      <div className="text-[11px] font-mono text-slate-400 uppercase">Upfront Deposit</div>
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        {item.paymentInfo?.depositPercentage || "50% upfront"}
                      </div>
                      {item.paymentInfo?.totalFee && (
                        <div className="text-[11px] font-mono text-slate-300">
                          {item.paymentInfo.totalFee}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-cyan-400 group-hover:translate-x-1 transition-transform font-mono">
                      <span>Inspect Dossier</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Full Dossier Modal Drawer */}
      {selectedSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-3xl w-full bg-[#0c121e] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-[#0e1626] border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                    AI Intelligence Dossier
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedSummary.meetingDate || selectedSummary.createdAt?.split("T")[0]}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {selectedSummary.clientName}
                  {selectedSummary.companyName ? ` — ${selectedSummary.companyName}` : ""}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                  {selectedSummary.clientEmail && <span>Email: {selectedSummary.clientEmail}</span>}
                  <span>Room: {selectedSummary.roomId}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSummary(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="px-5 py-2.5 bg-[#090e18] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/finance?action=new-invoice&clientName=${encodeURIComponent(selectedSummary.clientName || "")}&clientEmail=${encodeURIComponent(selectedSummary.clientEmail || "")}&companyName=${encodeURIComponent(selectedSummary.companyName || "")}&depositPercent=${encodeURIComponent(selectedSummary.paymentInfo?.depositPercentage?.replace(/[^0-9]/g, "") || "50")}&projectScope=${encodeURIComponent(selectedSummary.suggestedSOW || "")}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Create Deposit Invoice</span>
                </Link>

                <button
                  onClick={() => handleCopy(selectedSummary.suggestedSOW, "sow")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-colors"
                >
                  {copiedText === "sow" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === "sow" ? "Copied SOW" : "Copy SOW"}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const fullText = [
                    `MEETING DOSSIER: ${selectedSummary.clientName} (${selectedSummary.companyName})`,
                    `Date: ${selectedSummary.meetingDate}`,
                    `Room: ${selectedSummary.roomId}`,
                    "",
                    "KEY DISCUSSION POINTS:",
                    ...(selectedSummary.keyDiscussionPoints || []).map((p) => `• ${p}`),
                    "",
                    "CRITICAL OBJECTIVES:",
                    ...(selectedSummary.criticalObjectives || []).map((o) => `• ${o}`),
                    "",
                    "STATEMENT OF WORK (SOW):",
                    selectedSummary.suggestedSOW,
                    "",
                    "FINANCIAL SCOPE:",
                    `• Total Fee: ${selectedSummary.paymentInfo?.totalFee}`,
                    `• Deposit: ${selectedSummary.paymentInfo?.depositPercentage}`,
                    `• Milestones: ${selectedSummary.paymentInfo?.milestones}`,
                    "",
                    "CLIENT PAIN POINTS:",
                    ...(selectedSummary.clientPainPoints || []).map((pt) => `• ${pt}`),
                    "",
                    "TECHNICAL IMPLEMENTATION PLAN:",
                    selectedSummary.technicalImplementationPlan,
                  ].join("\n");
                  handleCopy(fullText, "full");
                }}
                className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 px-2 py-1"
              >
                {copiedText === "full" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === "full" ? "Copied Full Dossier!" : "Copy Full AI Dossier"}</span>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* 1. Key Discussion Points (3-4 Critical Takeaways) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                  <Target className="w-4 h-4" />
                  <span>Key Discussion Points (Critical Takeaways)</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {(selectedSummary.keyDiscussionPoints || []).map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-start gap-3 text-xs sm:text-sm text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </div>
                  ))}
                  {(!selectedSummary.keyDiscussionPoints || selectedSummary.keyDiscussionPoints.length === 0) && (
                    <p className="text-xs text-slate-500 italic">No specific discussion points parsed.</p>
                  )}
                </div>
              </div>

              {/* 2. Critical Objectives */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Critical Objectives / Features Client Wants to Build</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {(selectedSummary.criticalObjectives || []).map((obj, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-2.5 text-xs sm:text-sm text-cyan-100"
                    >
                      <span className="text-cyan-400 font-bold shrink-0 mt-0.5">🚀</span>
                      <span className="leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Executive Statement of Work (SOW) */}
              {selectedSummary.suggestedSOW && (
                <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                      📋 Executive Statement of Work (SOW)
                    </span>
                    <button
                      onClick={() => handleCopy(selectedSummary.suggestedSOW, "sow_body")}
                      className="text-[11px] font-mono text-sky-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedText === "sow_body" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === "sow_body" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <p className="text-slate-100 font-medium leading-relaxed">{selectedSummary.suggestedSOW}</p>
                </div>
              )}

              {/* 4. Payment & Financial Scope */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    💰 Payment &amp; Financial Scope
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300/80 bg-emerald-500/20 px-2 py-0.5 rounded">
                    Human Verification Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 block mb-1">Total Fee / Pricing</span>
                    <span className="text-sm font-bold text-white">
                      {selectedSummary.paymentInfo?.totalFee || "Discussed on call"}
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 block mb-1">Upfront Deposit</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {selectedSummary.paymentInfo?.depositPercentage || "50% upfront"}
                    </span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 block mb-1">Payment Milestones</span>
                    <span className="text-xs font-medium text-slate-200">
                      {selectedSummary.paymentInfo?.milestones || "Upfront deposit + final completion"}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono italic">
                  💡 Note: No automated invoices or payment links have been sent to the client. Click &apos;Create Deposit Invoice&apos; above to generate and send when ready.
                </div>
              </div>

              {/* 5. Client Pain Points */}
              {selectedSummary.clientPainPoints?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    ⚠️ Client Pain Points &amp; Bottlenecks
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-300">
                    {selectedSummary.clientPainPoints.map((point, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 6. Required Workflows */}
              {selectedSummary.requiredWorkflows?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    ⚙️ Required Automation Workflows
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSummary.requiredWorkflows.map((wf, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-200 text-xs font-mono"
                      >
                        {wf}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Phased Technical Implementation Plan */}
              {selectedSummary.technicalImplementationPlan && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                      🏗️ Technical Implementation Architecture
                    </span>
                    <button
                      onClick={() => handleCopy(selectedSummary.technicalImplementationPlan, "plan")}
                      className="text-[11px] font-mono text-purple-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedText === "plan" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === "plan" ? "Copied" : "Copy Architecture"}</span>
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {selectedSummary.technicalImplementationPlan}
                  </div>
                </div>
              )}

              {/* 8. Raw Transcript Section (Collapsible) */}
              {selectedSummary.transcript && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    <span>Raw Call Transcript ({selectedSummary.transcript.length} chars)</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showTranscript ? "rotate-180" : ""}`} />
                  </button>
                  {showTranscript && (
                    <div className="mt-2 p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-400 whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {selectedSummary.transcript}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0e1626] border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-slate-400">
                Internal Dossier • Human in the loop
              </span>
              <button
                onClick={() => setSelectedSummary(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
