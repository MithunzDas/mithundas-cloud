"use client";

import React, { useState } from "react";
import {
  Phone,
  Globe,
  Mail,
  Flame,
  Send,
  Download,
  ExternalLink,
  CheckSquare,
  Square,
  Search,
  MessageCircle,
  Trash2,
  CheckCircle,
  AlertCircle,
  Zap,
  FileSpreadsheet,
  Copy,
  Check
} from "lucide-react";

interface LeadItem {
  id: string;
  leadId: string;
  businessName: string;
  category: string;
  city?: string;
  fullAddress?: string;
  phone?: string;
  whatsappNumber?: string;
  whatsappUrl?: string;
  email?: string;
  website?: string;
  hasWebsite?: boolean;
  cmsTech?: string;
  rating?: number;
  reviewCount?: number;
  leadScore?: number;
  leadTier?: string;
  recommendedPitch?: string;
  gmapsUrl?: string;
  outreachStatus: string;
  contactedAt?: string;
  repliedAt?: string;
  lastReplyMessage?: string;
}

interface LeadDataTableProps {
  leads: LeadItem[];
  onRefresh: () => void;
}

/**
 * Helper to determine tailored dynamic demo showcase URL by category
 */
export function getDemoRouting(category: string = "", businessName: string = ""): {
  slug: string;
  url: string;
  label: string;
  icon: string;
} {
  const text = `${category} ${businessName}`.toLowerCase();

  if (
    text.includes("dent") ||
    text.includes("teeth") ||
    text.includes("clinic") ||
    text.includes("doctor") ||
    text.includes("hospital") ||
    text.includes("dermatolog") ||
    text.includes("skin") ||
    text.includes("ortho") ||
    text.includes("physio") ||
    text.includes("health") ||
    text.includes("care") ||
    text.includes("salon") ||
    text.includes("spa") ||
    text.includes("advocate") ||
    text.includes("lawyer")
  ) {
    return {
      slug: "demo-dental-clinic",
      url: "https://mithundas.cloud/demo-dental-clinic",
      label: "Dental & Clinic",
      icon: "🦷"
    };
  }

  if (
    text.includes("restaurant") ||
    text.includes("dining") ||
    text.includes("dine") ||
    text.includes("food") ||
    text.includes("biryani") ||
    text.includes("dhaba") ||
    text.includes("bistro") ||
    text.includes("pizza") ||
    text.includes("sweet") ||
    text.includes("bar") ||
    text.includes("kitchen") ||
    text.includes("cater")
  ) {
    return {
      slug: "demo-restaurant",
      url: "https://mithundas.cloud/demo-restaurant",
      label: "Restaurant & Food",
      icon: "🍽️"
    };
  }

  if (
    text.includes("hotel") ||
    text.includes("resort") ||
    text.includes("lodge") ||
    text.includes("stay") ||
    text.includes("inn") ||
    text.includes("guest house")
  ) {
    return {
      slug: "demo-hotel",
      url: "https://mithundas.cloud/demo-hotel",
      label: "Hotel & Resort",
      icon: "🏨"
    };
  }

  if (
    text.includes("cafe") ||
    text.includes("coffee") ||
    text.includes("tea") ||
    text.includes("bakery")
  ) {
    return {
      slug: "demo-cafe",
      url: "https://mithundas.cloud/demo-cafe",
      label: "Cafe & Bakery",
      icon: "☕"
    };
  }

  return {
    slug: "demo-dental-clinic",
    url: "https://mithundas.cloud/demo-dental-clinic",
    label: "Local Business",
    icon: "✨"
  };
}

export function LeadDataTable({ leads, onRefresh }: LeadDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [isDeletingLeads, setIsDeletingLeads] = useState(false);
  const [isSendingOutreach, setIsSendingOutreach] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);

  // Filter Leads
  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      searchTerm === "" ||
      lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone && lead.phone.includes(searchTerm)) ||
      (lead.city && lead.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.category && lead.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const score = lead.leadScore || 0;
    const matchTier =
      filterTier === "all" ||
      (filterTier === "HOT" && score >= 70) ||
      (filterTier === "WARM" && score < 70);

    const matchStatus = filterStatus === "all" || lead.outreachStatus === filterStatus;

    return matchSearch && matchTier && matchStatus;
  });

  // Select / Deselect All
  const toggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map((l) => l.leadId));
    }
  };

  // Toggle Single Lead Checkbox
  const toggleSelectOne = (leadId: string) => {
    if (selectedLeadIds.includes(leadId)) {
      setSelectedLeadIds(selectedLeadIds.filter((id) => id !== leadId));
    } else {
      setSelectedLeadIds([...selectedLeadIds, leadId]);
    }
  };

  // Delete Selected Leads
  const handleDeleteSelected = async () => {
    if (selectedLeadIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedLeadIds.length} selected lead(s) from the database?`)) {
      return;
    }

    setIsDeletingLeads(true);
    setActionMessage(`Deleting ${selectedLeadIds.length} lead(s) from database...`);

    try {
      const res = await fetch("/api/admin/lead-generation/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: selectedLeadIds })
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage(`✅ Successfully deleted ${data.deletedCount} lead(s) from database!`);
        setSelectedLeadIds([]);
        setTimeout(() => {
          onRefresh();
          setActionMessage("");
        }, 1500);
      } else {
        setActionMessage(`❌ Error deleting: ${data.error}`);
      }
    } catch (err: any) {
      setActionMessage(`❌ Network error: ${err.message}`);
    } finally {
      setIsDeletingLeads(false);
    }
  };

  // Single Lead Delete
  const handleDeleteOne = async (leadId: string, name: string) => {
    if (!confirm(`Delete "${name}" from database?`)) return;
    try {
      const res = await fetch("/api/admin/lead-generation/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: [leadId] })
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  // Sync Leads Directly From Master Google Sheet
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const handleSyncSheet = async () => {
    setIsSyncingSheet(true);
    setActionMessage("Syncing latest leads from Master Google Sheet into VPS Database...");

    try {
      const res = await fetch("/api/admin/lead-generation/sync-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage(`✅ ${data.message || "Synced successfully from Google Sheet!"}`);
        setTimeout(() => {
          onRefresh();
          setActionMessage("");
        }, 1500);
      } else {
        setActionMessage(`ℹ️ ${data.error || "Sheet sync triggered."}`);
        onRefresh();
        setTimeout(() => setActionMessage(""), 3000);
      }
    } catch (err: any) {
      setActionMessage(`❌ Sync Error: ${err.message}`);
    } finally {
      setIsSyncingSheet(false);
    }
  };

  // Launch Meta WhatsApp Outreach with Dynamic Category Demo Routing
  const handleLaunchOutreach = async () => {
    if (selectedLeadIds.length === 0) {
      alert("Please select at least 1 lead to send WhatsApp message.");
      return;
    }

    if (!confirm(`Send official Meta WhatsApp outreach with personalized category demos (Dental/Restaurant/Hotel) to ${selectedLeadIds.length} selected businesses?`)) {
      return;
    }

    setIsSendingOutreach(true);
    setActionMessage(`Dispatching Meta WhatsApp templates to ${selectedLeadIds.length} leads with dynamic demo links...`);

    try {
      const res = await fetch("/api/admin/lead-generation/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadIds: selectedLeadIds,
          templateName: "local_business_starter"
        })
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage(`✅ Dispatched ${data.sentCount} / ${data.totalProcessed} WhatsApp messages with dynamic category demo URLs!`);
        setSelectedLeadIds([]);
        setTimeout(() => {
          onRefresh();
          setActionMessage("");
        }, 2000);
      } else {
        setActionMessage(`❌ Outreach Error: ${data.error || "Failed to send"}`);
      }
    } catch (err: any) {
      setActionMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsSendingOutreach(false);
    }
  };

  // Copy Demo Link to Clipboard
  const handleCopyDemoLink = (url: string, leadId: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLeadId(leadId);
    setTimeout(() => {
      setCopiedLeadId(null);
    }, 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      alert("No leads to export.");
      return;
    }

    const headers = [
      "Business Name", "Category", "City", "Full Address",
      "Phone", "WhatsApp Number", "Email", "Website", "CMS Tech", "Rating",
      "Review Count", "Lead Score", "Lead Tier", "Recommended Pitch",
      "Dynamic Demo Target", "Google Maps URL", "Outreach Status"
    ];

    const rows = filteredLeads.map((l) => {
      const demo = getDemoRouting(l.category, l.businessName);
      return [
        `"${(l.businessName || "").replace(/"/g, '""')}"`,
        `"${(l.category || "").replace(/"/g, '""')}"`,
        `"${(l.city || "").replace(/"/g, '""')}"`,
        `"${(l.fullAddress || "").replace(/"/g, '""')}"`,
        `"${l.phone || ""}"`,
        `"${l.whatsappNumber || ""}"`,
        `"${l.email || ""}"`,
        `"${l.website || ""}"`,
        `"${l.cmsTech || ""}"`,
        l.rating || 0,
        l.reviewCount || 0,
        l.leadScore || 0,
        `"${l.leadTier || ""}"`,
        `"${(l.recommendedPitch || "").replace(/"/g, '""')}"`,
        `"${demo.url}"`,
        `"${l.gmapsUrl || ""}"`,
        `"${l.outreachStatus || "NEW"}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#101726]/90 border border-border-app rounded-2xl p-4 sm:p-6 backdrop-blur-xl flex flex-col h-full shadow-2xl">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-border-app">
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search business, phone, city..."
              className="w-full bg-[#0b0f17] border border-border-app rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="bg-[#0b0f17] border border-border-app rounded-xl px-3 py-2 text-xs text-text-secondary focus:outline-none focus:border-brand-cyan cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="HOT">🔥 HOT Leads</option>
            <option value="WARM">⚡ WARM Leads</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0b0f17] border border-border-app rounded-xl px-3 py-2 text-xs text-text-secondary focus:outline-none focus:border-brand-cyan cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="NEW">🆕 New</option>
            <option value="SENT">📤 Pitched</option>
            <option value="REPLIED">💬 Replied</option>
          </select>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedLeadIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={isDeletingLeads}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-400 hover:bg-rose-500/25 transition-all font-mono font-medium shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedLeadIds.length})</span>
            </button>
          )}

          <button
            onClick={handleSyncSheet}
            disabled={isSyncingSheet}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 hover:bg-emerald-500/20 transition-all font-mono font-medium shadow-sm"
            title="Sync newly scraped rows from Master Google Sheet into VPS Database"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{isSyncingSheet ? "Syncing..." : "Sync Google Sheet"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-border-app hover:border-gray-500 text-xs text-text-secondary hover:text-text-primary transition-all font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLaunchOutreach}
            disabled={selectedLeadIds.length === 0 || isSendingOutreach}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span>
              {isSendingOutreach
                ? "Dispatching Meta Templates..."
                : `Launch Meta WhatsApp (${selectedLeadIds.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert Bar */}
      {actionMessage && (
        <div className="mb-4 p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-mono text-brand-cyan flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="overflow-x-auto rounded-xl border border-border-app relative max-h-[700px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-[#121824] z-20 border-b border-border-app font-mono text-text-secondary text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3 w-10 text-center">
                <button onClick={toggleSelectAll} className="text-gray-400 hover:text-brand-cyan">
                  {selectedLeadIds.length > 0 && selectedLeadIds.length === filteredLeads.length ? (
                    <CheckSquare className="w-4 h-4 text-brand-cyan" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3 min-w-[200px]">Business Name</th>
              <th className="p-3 min-w-[170px]">Score &amp; Tier</th>
              <th className="p-3 min-w-[130px]">Phone / WhatsApp</th>
              <th className="p-3 min-w-[180px]">Dynamic Demo Target</th>
              <th className="p-3 min-w-[150px]">Website &amp; Tech</th>
              <th className="p-3 min-w-[140px]">Email</th>
              <th className="p-3 min-w-[100px]">Rating</th>
              <th className="p-3 min-w-[110px]">Status</th>
              <th className="p-3 min-w-[150px]">Location</th>
              <th className="p-3 min-w-[80px] text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-app/50 font-sans">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-12 text-center text-text-secondary font-mono">
                  No leads found in this view.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = selectedLeadIds.includes(lead.leadId);
                const score = lead.leadScore || 0;
                const isHot = score >= 70;
                const rawPhone = lead.whatsappNumber || lead.phone || "";
                const demo = getDemoRouting(lead.category, lead.businessName);

                return (
                  <tr
                    key={lead.id}
                    className={`transition-colors hover:bg-white/[0.03] ${
                      isSelected ? "bg-brand-cyan/10" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleSelectOne(lead.leadId)}
                        className="text-gray-500 hover:text-brand-cyan"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-brand-cyan" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Business Name */}
                    <td className="p-3">
                      <div className="font-bold text-text-primary">
                        <span className="truncate block max-w-[200px]" title={lead.businessName}>
                          {lead.businessName}
                        </span>
                      </div>
                      <span className="text-[10px] text-text-secondary font-mono">{lead.category}</span>
                    </td>

                    {/* Score & Tier */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-inner ${
                            isHot
                              ? "bg-amber-500/15 border border-amber-500/40 text-amber-300"
                              : "bg-blue-500/15 border border-blue-500/40 text-blue-300"
                          }`}
                        >
                          {score}
                        </div>
                        <div className="space-y-0.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                              isHot
                                ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300"
                                : "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/40 text-blue-300"
                            }`}
                          >
                            {isHot ? <Flame className="w-3 h-3 fill-current text-amber-400" /> : <Zap className="w-3 h-3 text-blue-400" />}
                            <span>{isHot ? "HOT LEAD" : "WARM LEAD"}</span>
                          </span>
                          <p className="text-[10px] text-text-secondary font-mono truncate max-w-[120px]">
                            {lead.hasWebsite ? "Optimization" : "Needs Website"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone & WhatsApp */}
                    <td className="p-3 font-mono text-[11px]">
                      {rawPhone ? (
                        <div className="space-y-1">
                          <a
                            href={`https://wa.me/${rawPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>+{rawPhone}</span>
                          </a>
                          <a
                            href={`tel:${rawPhone}`}
                            className="text-gray-400 hover:text-white flex items-center gap-1 text-[10px]"
                          >
                            <Phone className="w-2.5 h-2.5" /> Call
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-600 font-mono">No Phone</span>
                      )}
                    </td>

                    {/* DYNAMIC DEMO SHOWCASE TARGET (Phase 1) */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={demo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-semibold transition-all hover:scale-105"
                          title={`Click to view live ${demo.label}`}
                        >
                          <span>{demo.icon}</span>
                          <span className="truncate max-w-[95px]">{demo.label}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyDemoLink(demo.url, lead.leadId)}
                          className="p-1.5 rounded-lg bg-white/5 border border-border-app hover:border-brand-cyan text-gray-400 hover:text-brand-cyan transition-colors"
                          title="Copy tailored Demo Link"
                        >
                          {copiedLeadId === lead.leadId ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Website & Tech */}
                    <td className="p-3">
                      {lead.website ? (
                        <div className="space-y-0.5">
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-cyan hover:underline flex items-center gap-1 font-mono text-[11px] truncate max-w-[130px]"
                          >
                            <Globe className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
                          </a>
                          <span className="text-[10px] text-gray-400 font-mono px-1.5 py-0.5 rounded bg-white/5 border border-border-app">
                            {lead.cmsTech || "Detected"}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
                          ❌ No Website
                        </span>
                      )}
                    </td>

                    {/* Email */}
                    <td className="p-3 font-mono text-[11px]">
                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-text-primary hover:text-brand-cyan flex items-center gap-1 truncate max-w-[130px]"
                        >
                          <Mail className="w-3 h-3 text-brand-indigo flex-shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </a>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>

                    {/* Rating / Reviews */}
                    <td className="p-3 font-mono text-[11px]">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <span>★ {lead.rating || "4.5"}</span>
                      </div>
                      <span className="text-[10px] text-text-secondary">
                        {lead.reviewCount || 0} reviews
                      </span>
                    </td>

                    {/* Outreach Status */}
                    <td className="p-3">
                      {lead.outreachStatus === "REPLIED" ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> REPLIED
                        </span>
                      ) : lead.outreachStatus === "SENT" ? (
                        <span className="px-2.5 py-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan font-mono text-[10px] font-medium flex items-center gap-1 w-fit">
                          <Send className="w-3 h-3" /> PITCHED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-gray-800/80 border border-gray-700 text-gray-400 font-mono text-[10px] w-fit">
                          NEW
                        </span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="p-3 text-[11px]">
                      <span className="font-semibold text-text-primary block truncate max-w-[140px]">
                        {lead.city || "Local Area"}
                      </span>
                      <span className="text-[10px] text-text-secondary truncate block max-w-[140px]">
                        {lead.fullAddress || ""}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {lead.gmapsUrl && (
                          <a
                            href={lead.gmapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-7 h-7 rounded-lg bg-white/5 border border-border-app hover:border-brand-cyan flex items-center justify-center text-text-secondary hover:text-brand-cyan transition-colors"
                            title="View on Google Maps"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteOne(lead.leadId, lead.businessName)}
                          className="w-7 h-7 rounded-lg bg-white/5 border border-border-app hover:border-rose-500 flex items-center justify-center text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
