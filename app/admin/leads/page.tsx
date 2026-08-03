"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  DollarSign,
  RefreshCw,
  Mail,
  CheckCircle,
  AlertTriangle,
  User,
  Shield,
  Key,
  Eye,
  X,
  Clock,
  FileText,
  Check,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { LeadPayload, LeadStatus } from "@/services/n8n/n8n";

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($) — Global" },
  { code: "INR", symbol: "₹", label: "INR (₹) — India" },
  { code: "EUR", symbol: "€", label: "EUR (€) — Europe" },
  { code: "GBP", symbol: "£", label: "GBP (£) — UK" },
  { code: "AUD", symbol: "A$", label: "AUD (A$) — Australia" },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<LeadPayload | null>(null);
  
  // Transition inputs
  const [showWonModal, setShowWonModal] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState({
    invoiceAmount: "$2,500.00",
    invoiceId: "",
    projectScope: "",
    startDate: "",
    depositPercent: "25",
    setupFee: "$150.00",
    monthlyRetainer: "$200.00/mo",
    paymentLink: "",
    currency: "USD",
    currencySymbol: "$",
  });
  const [followUpRound, setFollowUpRound] = useState<"24h" | "72h">("24h");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto-generate invoice id on open
  useEffect(() => {
    if (showWonModal) {
      setOnboardingForm((prev) => ({
        ...prev,
        invoiceId: `INV-${Date.now().toString().slice(-6)}`,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      }));
    }
  }, [showWonModal]);

  const [activeTab, setActiveTab] = useState<"leads" | "emails">("leads");
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [emailCategoryFilter, setEmailCategoryFilter] = useState<string>("all");
  const [selectedEmailModal, setSelectedEmailModal] = useState<any | null>(null);

  useEffect(() => {
    const savedSecret = localStorage.getItem("mithundas_admin_secret");
    if (savedSecret) {
      setAdminSecret(savedSecret);
      fetchLeads(savedSecret);
      fetchEmailLogs(savedSecret);
    }
  }, []);

  const fetchEmailLogs = async (secret: string) => {
    try {
      const response = await fetch("/api/admin/emails", {
        headers: { "x-admin-secret": secret },
      });
      if (response.ok) {
        const data = await response.json();
        setEmailLogs(data.emailLogs || []);
      }
    } catch (err) {
      console.error("Failed to fetch email logs", err);
    }
  };

  const fetchLeads = async (secret: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/leads", {
        headers: { "x-admin-secret": secret },
      });
      if (!response.ok) throw new Error("Authentication failed");
      const data = await response.json();
      setLeads(data.leads || []);
      setIsAuthenticated(true);
      localStorage.setItem("mithundas_admin_secret", secret);
      showNotification("success", "Leads refreshed successfully.");
    } catch {
      setIsAuthenticated(false);
      showNotification("error", "Failed to authenticate. Verify admin secret.");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminSecret.trim()) {
      fetchLeads(adminSecret.trim());
      fetchEmailLogs(adminSecret.trim());
    }
  };

  const logout = () => {
    localStorage.removeItem("mithundas_admin_secret");
    setAdminSecret("");
    setIsAuthenticated(false);
    setLeads([]);
  };

  const updateLead = async (leadId: string, status: LeadStatus, extraData = {}) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          status,
          ...extraData,
        }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      
      const data = await response.json();
      setLeads((prev) => prev.map((l) => (l.leadId === leadId ? data.lead : l)));
      if (selectedLead?.leadId === leadId) {
        setSelectedLead(data.lead);
      }
      showNotification("success", `Lead updated to ${status}`);
    } catch (error) {
      showNotification("error", "Failed to update lead status.");
      console.error(error);
    } finally {
      setLoading(false);
      setShowWonModal(false);
    }
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLead) {
      updateLead(selectedLead.leadId, "won", {
        onboardingDetails: onboardingForm,
      });
    }
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case "intake":
        return "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30";
      case "contacted":
        return "bg-accent-blue/15 text-accent-blue border-accent-blue/30";
      case "qualified":
        return "bg-accent-indigo/15 text-accent-indigo border-accent-indigo/30";
      case "silent":
        return "bg-status-warning/15 text-status-warning border-status-warning/30";
      case "won":
        return "bg-accent-green/15 text-accent-green border-accent-green/30";
      case "lost":
        return "bg-border-subtle text-text-muted border-border-subtle";
      default:
        return "bg-background-inset text-text-muted border-border-subtle";
    }
  };

  const getBudgetLabel = (budget: string) => {
    const map: Record<string, string> = {
      under_500: "Under $500",
      "500_1500": "$500 – $1,500",
      "1500_3000": "$1,500 – $3,000",
      "3000_7500": "$3,000 – $7,500",
      "7500_plus": "$7,500+",
    };
    return map[budget] || budget;
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background-app px-4 text-text-primary">
        <div className="w-full max-w-md rounded-xl border border-border-subtle bg-background-surface p-8 shadow-panel">
          <div className="flex flex-col items-center gap-3 text-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-cyan/10">
              <Shield className="h-6 w-6 text-accent-cyan" />
            </div>
            <h1 className="font-sans text-h2 font-bold tracking-tight">Admin Console</h1>
            <p className="font-mono text-xs text-text-muted">
              mithundas.cloud lead management
            </p>
          </div>

          {notification && (
            <div className={`mb-6 rounded-lg p-3 text-xs font-mono border ${
              notification.type === "success" 
                ? "bg-accent-green/10 text-accent-green border-accent-green/20" 
                : "bg-status-error/10 text-status-error border-status-error/20"
            }`}>
              {notification.text}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="font-mono text-xs text-text-secondary" htmlFor="secret">
                Enter Admin Access Token
              </label>
              <div className="relative">
                <input
                  id="secret"
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="admin_secret_token..."
                  className="w-full rounded-lg border border-border-subtle bg-background-inset py-3 pl-10 pr-4 font-sans text-small text-text-primary placeholder:text-text-muted focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/30"
                  required
                />
                <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-text-muted" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-lg bg-accent-cyan py-3 font-mono text-xs font-semibold text-text-inverse transition-colors hover:bg-accent-cyan/90 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Authenticate"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-app px-6 py-10 text-text-primary md:px-12">
      {/* Header Banner */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-border-subtle pb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans text-h1 font-bold">Leads Management</h1>
            <span className="rounded-full bg-accent-cyan/10 border border-accent-cyan/30 px-2 py-0.5 font-mono text-[10px] text-accent-cyan uppercase">
              Admin
            </span>
          </div>
          <p className="font-mono text-xs text-text-secondary mt-1">
            Qualify assessment submissions, trigger Resend follow-ups, and dispatch onboarding invoices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchLeads(adminSecret)}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background-surface px-4 py-2 font-mono text-xs transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Sync
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background-surface px-4 py-2 font-mono text-xs text-text-muted transition-colors hover:border-status-error/40 hover:text-status-error"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 my-8">
        <div className="rounded-xl border border-border-subtle bg-background-surface p-5 shadow-panel">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-secondary uppercase">Total leads</span>
            <User className="h-4 w-4 text-accent-cyan" />
          </div>
          <p className="font-sans text-h1 font-bold mt-2">{leads.length}</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-background-surface p-5 shadow-panel">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-secondary uppercase">Premium Opportunities</span>
            <DollarSign className="h-4 w-4 text-status-warning" />
          </div>
          <p className="font-sans text-h1 font-bold mt-2">
            {leads.filter((l) => ["3000_7500", "7500_plus"].includes(l.budget)).length}
          </p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-background-surface p-5 shadow-panel">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-secondary uppercase">Won / Active</span>
            <CheckCircle className="h-4 w-4 text-accent-green" />
          </div>
          <p className="font-sans text-h1 font-bold mt-2">
            {leads.filter((l) => l.status === "won").length}
          </p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-background-surface p-5 shadow-panel">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-text-secondary uppercase">Silent Leads</span>
            <Clock className="h-4 w-4 text-status-error" />
          </div>
          <p className="font-sans text-h1 font-bold mt-2">
            {leads.filter((l) => l.status === "silent").length}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 border-b border-border-subtle mb-8">
        <button
          onClick={() => setActiveTab("leads")}
          className={`flex items-center gap-2 border-b-2 pb-3 font-mono text-xs font-semibold transition-colors ${
            activeTab === "leads"
              ? "border-accent-cyan text-accent-cyan"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <User className="h-4 w-4" />
          Leads Pipeline ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab("emails")}
          className={`flex items-center gap-2 border-b-2 pb-3 font-mono text-xs font-semibold transition-colors ${
            activeTab === "emails"
              ? "border-accent-cyan text-accent-cyan"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <Mail className="h-4 w-4" />
          Email Outbox Audit Log ({emailLogs.length})
        </button>
      </div>

      {notification && (
        <div className={`fixed bottom-5 left-5 z-50 rounded-lg p-4 border shadow-lg font-mono text-xs ${
          notification.type === "success" 
            ? "bg-accent-green/15 text-accent-green border-accent-green/30" 
            : "bg-status-error/15 text-status-error border-status-error/30"
        }`}>
          {notification.text}
        </div>
      )}

      {activeTab === "emails" ? (
        /* EMAIL OUTBOX AUDIT LOG VIEW */
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-background-surface p-4 rounded-xl border border-border-subtle">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-text-muted" />
              <span className="font-mono text-xs text-text-muted">Filter Category:</span>
              {["all", "onboarding", "confirmation", "followup", "admin_alert"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEmailCategoryFilter(cat)}
                  className={`rounded-lg px-3 py-1 font-mono text-[11px] uppercase font-semibold transition-all ${
                    emailCategoryFilter === cat
                      ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40"
                      : "bg-background-inset text-text-muted border border-border-subtle hover:text-text-primary"
                  }`}
                >
                  {cat === "admin_alert" ? "ADMIN ALERT" : cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => fetchEmailLogs(adminSecret)}
              className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-background-inset px-3 py-1.5 font-mono text-xs text-text-secondary hover:text-accent-cyan"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Outbox
            </button>
          </div>

          <div className="rounded-xl border border-border-subtle bg-background-surface overflow-hidden shadow-panel">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-background-inset font-mono text-[10px] uppercase text-text-muted border-b border-border-subtle">
                <tr>
                  <th className="p-4">Category</th>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Sent</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {emailLogs
                  .filter((log) => emailCategoryFilter === "all" || log.category === emailCategoryFilter)
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-background-inset/50 transition-colors">
                      <td className="p-4">
                        <span className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] uppercase font-bold ${
                          log.category === "onboarding"
                            ? "bg-accent-green/15 text-accent-green border border-accent-green/30"
                            : log.category === "followup"
                            ? "bg-status-warning/15 text-status-warning border border-status-warning/30"
                            : log.category === "admin_alert"
                            ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                            : "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30"
                        }`}>
                          {log.category === "admin_alert" ? "ADMIN ALERT" : log.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono">
                        <div className="font-medium text-text-primary">
                          {log.category === "admin_alert" && (log.toEmail === "hello@mithundas.cloud" || log.toEmail === "mithun@mithundas.cloud" || !log.toEmail)
                            ? "mithun.here01@gmail.com"
                            : log.toEmail}
                        </div>
                        {log.leadId && (
                          <div className="inline-block mt-1 font-mono text-[10px] text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-1.5 py-0.5 rounded">
                            {log.leadId}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-text-secondary">
                        {log.subject.includes(" for ") ? (
                          <span>
                            {log.subject.split(" for ")[0]} for{" "}
                            <span className="font-bold text-accent-green bg-accent-green/15 border border-accent-green/30 px-2 py-0.5 rounded inline-block">
                              {log.subject.split(" for ").slice(1).join(" for ")}
                            </span>
                          </span>
                        ) : (
                          log.subject
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`font-mono text-[10px] uppercase ${log.status === "failed" ? "text-status-error" : "text-accent-green"}`}>
                          {log.status || "sent"}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-text-muted">
                        {new Date(log.sentAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                      </td>
                      <td className="p-4 text-right">
                        {log.htmlContent && (
                          <button
                            onClick={() => setSelectedEmailModal(log)}
                            className="rounded bg-accent-cyan/10 border border-accent-cyan/30 px-3 py-1 font-mono text-[10px] text-accent-cyan hover:bg-accent-cyan/20"
                          >
                            Preview HTML Email
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                {emailLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center font-mono text-xs text-text-muted">
                      No email audit logs recorded yet. Outgoing emails sent via Resend will appear here in real time!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left/Middle Column - Filter & Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, company, email..."
                className="w-full rounded-lg border border-border-subtle bg-background-surface py-2 pl-9 pr-4 font-sans text-xs text-text-primary placeholder:text-text-muted focus:border-accent-cyan/50 focus:outline-none"
              />
              <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-text-muted" />
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Filter className="h-3.5 w-3.5 text-text-muted shrink-0" />
              {["all", "intake", "contacted", "qualified", "silent", "won", "lost"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase transition-colors shrink-0 ${
                    statusFilter === st
                      ? "border-accent-cyan text-accent-cyan bg-accent-cyan/5"
                      : "border-border-subtle text-text-muted bg-background-surface hover:text-text-secondary"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-xl border border-border-subtle bg-background-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-border-subtle bg-background-elevated font-mono text-[10px] text-text-muted uppercase">
                    <th className="p-4 font-semibold">Lead ID</th>
                    <th className="p-4 font-semibold">Client / Company</th>
                    <th className="p-4 font-semibold">Budget</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Submitted</th>
                    <th className="p-4 font-semibold text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle bg-background-surface">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-text-muted font-mono">
                        No leads found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr
                        key={lead.leadId}
                        onClick={() => setSelectedLead(lead)}
                        className={`transition-colors hover:bg-background-elevated/40 cursor-pointer ${
                          selectedLead?.leadId === lead.leadId ? "bg-background-elevated" : ""
                        }`}
                      >
                        <td className="p-4 font-mono text-accent-cyan font-medium">{lead.leadId}</td>
                        <td className="p-4">
                          <div className="font-semibold text-text-primary">{lead.name}</div>
                          <div className="text-text-muted text-[10px]">{lead.company}</div>
                        </td>
                        <td className="p-4 font-medium text-text-secondary">
                          {getBudgetLabel(lead.budget)}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase font-semibold ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4 text-text-muted font-mono text-[10px]">
                          {lead.submittedAt ? new Date(lead.submittedAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="p-4 text-right">
                          <button className="rounded-lg p-1.5 hover:bg-background-inset text-text-muted hover:text-text-primary">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Detail Panel */}
        <div className="lg:col-span-1">
          {selectedLead ? (
            <div className="rounded-xl border border-border-subtle bg-background-surface p-6 shadow-panel space-y-6 sticky top-8">
              {/* Header Info */}
              <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                <div>
                  <h3 className="font-sans text-small font-bold text-text-primary">
                    {selectedLead.company}
                  </h3>
                  <p className="font-mono text-[10px] text-text-muted mt-0.5">
                    ID: {selectedLead.leadId}
                  </p>
                </div>
                <span className={`inline-flex rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase font-semibold ${getStatusColor(selectedLead.status)}`}>
                  {selectedLead.status}
                </span>
              </div>

              {/* AI Assessment Card */}
              {selectedLead.aiScore !== undefined && selectedLead.aiSummary && (
                <div className="rounded-lg border border-accent-cyan/20 bg-accent-cyan/5 p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-accent-cyan uppercase font-bold tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Assessment
                    </div>
                    <div className={`font-sans text-xs font-bold px-2 py-0.5 rounded-full border ${
                      selectedLead.aiScore >= 75 ? "bg-accent-green/10 text-accent-green border-accent-green/20" :
                      selectedLead.aiScore >= 40 ? "bg-status-warning/10 text-status-warning border-status-warning/20" :
                      "bg-status-error/10 text-status-error border-status-error/20"
                    }`}>
                      {selectedLead.aiScore} / 100 Score
                    </div>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedLead.aiSummary}
                  </p>
                </div>
              )}

              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <div className="font-mono text-[10px] text-text-muted uppercase">Contact Name</div>
                  <div className="font-semibold text-text-secondary mt-0.5">{selectedLead.name}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-text-muted uppercase">Email</div>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="font-semibold text-accent-cyan hover:underline mt-0.5 block truncate"
                  >
                    {selectedLead.email}
                  </a>
                </div>
                {selectedLead.whatsapp && (
                  <div>
                    <div className="font-mono text-[10px] text-text-muted uppercase">WhatsApp</div>
                    <div className="font-semibold text-text-secondary mt-0.5">{selectedLead.whatsapp}</div>
                  </div>
                )}
                <div>
                  <div className="font-mono text-[10px] text-text-muted uppercase">Country</div>
                  <div className="font-semibold text-text-secondary mt-0.5">{selectedLead.country || "—"}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-text-muted uppercase">Budget Tier</div>
                  <div className="font-semibold text-text-secondary mt-0.5">{getBudgetLabel(selectedLead.budget)}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-text-muted uppercase">Timeline</div>
                  <div className="font-semibold text-text-secondary mt-0.5">
                    {selectedLead.timeline.replace(/_/g, " ")}
                  </div>
                </div>
              </div>

              {/* Requirement Textbox */}
              <div className="rounded-lg border border-border-subtle bg-background-inset p-4 font-sans text-xs">
                <div className="font-mono text-[9px] text-accent-cyan uppercase tracking-wider mb-2 font-semibold">
                  Project Requirements
                </div>
                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {selectedLead.projectRequirement}
                </p>
              </div>

              {/* Action Buttons / Workflows */}
              <div className="space-y-3 pt-4 border-t border-border-subtle">
                <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  Trigger Automation Operations
                </div>

                {/* Transition to Contacted */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateLead(selectedLead.leadId, "contacted")}
                    className="flex-1 flex justify-center items-center gap-1.5 rounded-lg border border-border-subtle bg-background-surface py-2 font-mono text-[10px] font-semibold text-text-secondary hover:border-accent-cyan/40 hover:text-accent-cyan"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => updateLead(selectedLead.leadId, "qualified")}
                    className="flex-1 flex justify-center items-center gap-1.5 rounded-lg border border-border-subtle bg-background-surface py-2 font-mono text-[10px] font-semibold text-text-secondary hover:border-accent-cyan/40 hover:text-accent-cyan"
                  >
                    Mark Qualified
                  </button>
                </div>

                {/* Follow-up Loop Trigger */}
                <div className="rounded-lg border border-status-warning/20 bg-status-warning/5 p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-status-warning font-mono text-[9px] font-bold uppercase">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Silent Lead Follow-up
                  </div>
                  <p className="font-sans text-[11px] text-text-muted leading-snug">
                    Send automated warm check-in email via Resend and flag lead status as silent.
                  </p>
                  <div className="flex gap-2 items-center">
                    <select
                      value={followUpRound}
                      onChange={(e) => setFollowUpRound(e.target.value as "24h" | "72h")}
                      className="rounded border border-border-subtle bg-background-surface px-2 py-1 font-mono text-[10px] text-text-secondary focus:outline-none"
                    >
                      <option value="24h">24 Hour Round</option>
                      <option value="72h">72 Hour Round</option>
                    </select>
                    <button
                      onClick={() => updateLead(selectedLead.leadId, "silent", { followUpRound })}
                      className="flex-1 flex justify-center items-center gap-1 rounded bg-status-warning/15 hover:bg-status-warning/20 text-status-warning font-mono text-[10px] font-bold py-1.5 border border-status-warning/20"
                    >
                      Trigger Email
                    </button>
                  </div>
                </div>

                {/* Onboarding Kit Trigger */}
                <div className="rounded-lg border border-accent-green/20 bg-accent-green/5 p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-accent-green font-mono text-[9px] font-bold uppercase">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Convert to Customer & Onboard
                  </div>
                  <p className="font-sans text-[11px] text-text-muted leading-snug">
                    Mark won, compile invoice, terms &amp; MSA and dispatch welcome package via Resend.
                  </p>
                  <button
                    onClick={() => {
                      setOnboardingForm((prev) => ({
                        ...prev,
                        projectScope: selectedLead.projectRequirement || `${selectedLead.businessType.replace(/_/g, " ")} integration systems for ${selectedLead.company}.`,
                      }));
                      setShowWonModal(true);
                    }}
                    className="w-full flex justify-center items-center gap-1.5 rounded bg-accent-green hover:bg-accent-green/90 text-text-inverse font-mono text-[10px] font-bold py-2"
                  >
                    Onboard Customer (MSA + PDF)
                  </button>
                </div>

                {/* Mark Lost */}
                <button
                  onClick={() => updateLead(selectedLead.leadId, "lost")}
                  className="w-full flex justify-center items-center gap-1.5 rounded-lg border border-border-subtle bg-background-surface py-2 font-mono text-[10px] text-text-muted hover:border-status-error/40 hover:text-status-error"
                >
                  Mark Lost / Archive
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border-subtle border-dashed bg-background-surface/50 p-12 text-center text-text-muted font-mono text-xs sticky top-8">
              Select a lead from the management table to view requirement parameters and trigger automations.
            </div>
          )}
        </div>
      </div>
      )}

      {/* Won Onboarding Modal */}
      {showWonModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-app/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-xl border border-border-subtle bg-background-surface p-6 shadow-panel">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-5">
              <h3 className="font-sans text-small font-bold text-text-primary">
                Configure Customer Welcome Package
              </h3>
              <div className="flex items-center gap-3">
                {/* Multi-Currency Selector */}
                <select
                  value={onboardingForm.currency}
                  onChange={(e) => {
                    const selected = CURRENCIES.find((c) => c.code === e.target.value) || CURRENCIES[0];
                    setOnboardingForm((prev) => ({
                      ...prev,
                      currency: selected.code,
                      currencySymbol: selected.symbol,
                    }));
                  }}
                  className="rounded-md border border-accent-cyan/40 bg-accent-cyan/10 px-2 py-1 font-mono text-[11px] text-accent-cyan font-semibold focus:outline-none cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-background-elevated text-text-primary font-mono">
                      {c.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowWonModal(false)}
                  className="rounded-lg p-1 hover:bg-background-inset text-text-muted hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-4 font-sans text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-text-muted uppercase font-semibold">
                    Agreed Project Fee
                  </label>
                  <input
                    type="text"
                    value={onboardingForm.invoiceAmount}
                    onChange={(e) => setOnboardingForm({ ...onboardingForm, invoiceAmount: e.target.value })}
                    className="w-full rounded border border-border-subtle bg-background-inset p-2 text-text-primary focus:outline-none"
                    placeholder={`${onboardingForm.currencySymbol}2,500.00`}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-text-muted uppercase font-semibold">
                    Upfront Deposit %
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={onboardingForm.depositPercent}
                      onChange={(e) => setOnboardingForm({ ...onboardingForm, depositPercent: e.target.value })}
                      className="w-full rounded border border-border-subtle bg-background-inset p-2 pr-8 text-text-primary focus:outline-none font-mono"
                      placeholder="25"
                      required
                    />
                    <span className="absolute right-3 text-text-muted font-mono text-xs">%</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Deposit Calculation Helper */}
              {(() => {
                const numericFee = parseFloat(onboardingForm.invoiceAmount.replace(/[^0-9.]/g, "")) || 0;
                const pct = parseFloat(onboardingForm.depositPercent) || 0;
                const depositAmt = (numericFee * pct) / 100;
                const setupAmt = parseFloat(onboardingForm.setupFee.replace(/[^0-9.]/g, "")) || 0;
                const totalPayable = depositAmt + setupAmt;
                const currencySymbol = onboardingForm.currencySymbol || (onboardingForm.invoiceAmount.includes("₹") ? "₹" : "$");
                return (
                  <div className="rounded bg-accent-green/10 border border-accent-green/20 p-2.5 font-mono text-[11px] text-accent-green flex justify-between items-center">
                    <span>💳 Total Upfront Payable ({pct}% Deposit + Setup):</span>
                    <strong className="font-bold text-xs">{currencySymbol}{totalPayable.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-text-muted uppercase font-semibold">
                    Fixed Setup / Infrastructure Fee
                  </label>
                  <input
                    type="text"
                    value={onboardingForm.setupFee}
                    onChange={(e) => setOnboardingForm({ ...onboardingForm, setupFee: e.target.value })}
                    className="w-full rounded border border-border-subtle bg-background-inset p-2 text-text-primary focus:outline-none"
                    placeholder="$150.00 (API & Host setup)"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-text-muted uppercase font-semibold">
                    Monthly Support Retainer
                  </label>
                  <input
                    type="text"
                    value={onboardingForm.monthlyRetainer}
                    onChange={(e) => setOnboardingForm({ ...onboardingForm, monthlyRetainer: e.target.value })}
                    className="w-full rounded border border-border-subtle bg-background-inset p-2 text-text-primary focus:outline-none"
                    placeholder="$200.00/mo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-text-muted uppercase font-semibold">
                    Invoice ID
                  </label>
                  <input
                    type="text"
                    value={onboardingForm.invoiceId}
                    onChange={(e) => setOnboardingForm({ ...onboardingForm, invoiceId: e.target.value })}
                    className="w-full rounded border border-border-subtle bg-background-inset p-2 text-text-primary focus:outline-none font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-text-muted uppercase font-semibold">
                    Target Start Date
                  </label>
                  <input
                    type="date"
                    value={onboardingForm.startDate}
                    onChange={(e) => setOnboardingForm({ ...onboardingForm, startDate: e.target.value })}
                    className="w-full rounded border border-border-subtle bg-background-inset p-2 text-text-primary focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-text-muted uppercase font-semibold">
                  Custom Payment Link (Razorpay / Stripe / PayPal)
                </label>
                <input
                  type="url"
                  value={onboardingForm.paymentLink}
                  onChange={(e) => setOnboardingForm({ ...onboardingForm, paymentLink: e.target.value })}
                  className="w-full rounded border border-border-subtle bg-background-inset p-2 text-text-primary focus:outline-none font-mono text-[11px]"
                  placeholder="https://rzp.io/l/... or https://buy.stripe.com/..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-text-muted uppercase font-semibold">
                  Statement of Work / Scope Description
                </label>
                <textarea
                  value={onboardingForm.projectScope}
                  onChange={(e) => setOnboardingForm({ ...onboardingForm, projectScope: e.target.value })}
                  rows={3}
                  className="w-full rounded border border-border-subtle bg-background-inset p-2 text-text-primary focus:outline-none resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-border-subtle mt-4">
                <button
                  type="button"
                  onClick={() => setShowWonModal(false)}
                  className="rounded px-4 py-2 font-mono text-[10px] font-semibold border border-border-subtle bg-background-surface hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-accent-green px-4 py-2 font-mono text-[10px] font-bold text-text-inverse hover:bg-accent-green/90"
                >
                  Dispatch Welcome Package &amp; Convert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HTML Email Live Preview Modal */}
      {selectedEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-app/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-3xl rounded-xl border border-border-subtle bg-background-surface p-6 shadow-panel">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
              <div>
                <h3 className="font-sans text-small font-bold text-text-primary">
                  {selectedEmailModal.subject}
                </h3>
                <p className="font-mono text-[11px] text-text-muted mt-0.5">
                  To: {selectedEmailModal.toEmail} • {new Date(selectedEmailModal.sentAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmailModal(null)}
                className="rounded-lg p-1 hover:bg-background-inset text-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4 text-text-muted hover:text-text-primary" />
              </button>
            </div>

            <div className="bg-white rounded-lg p-4 max-h-[70vh] overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: selectedEmailModal.htmlContent || "<p style='color:black;'>No HTML content stored.</p>" }} />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedEmailModal(null)}
                className="rounded bg-accent-cyan px-4 py-2 font-mono text-[10px] font-bold text-text-inverse"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
