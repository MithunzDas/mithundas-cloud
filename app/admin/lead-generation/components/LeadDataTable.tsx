"use client";

import React, { useState } from "react";
import LeadChatDrawer from "./LeadChatDrawer";
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
  MessageSquare,
  Trash2,
  CheckCircle,
  AlertCircle,
  Zap,
  FileSpreadsheet,
  Copy,
  Check,
  Eye,
  X,
  Clock,
  CheckCheck,
  Sparkles
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
 * Category-to-Demo Routing Engine
 */
export function getDemoRouting(category: string = "", businessName: string = ""): {
  slug: string;
  url: string;
  label: string;
  icon: string;
} {
  const text = `${category} ${businessName}`.toLowerCase();

  // 1. Lawyers, Advocates, Legal Chambers & Law Firms
  if (
    text.includes("advocate") ||
    text.includes("lawyer") ||
    text.includes("legal") ||
    text.includes("attorney") ||
    text.includes("solicitor") ||
    text.includes("counsel") ||
    text.includes("chamber") ||
    text.includes("court") ||
    text.includes("bar council") ||
    text.includes("notary") ||
    text.includes("vakil")
  ) {
    return {
      slug: "demo-lawyer",
      url: "https://mithundas.cloud/demo-lawyer",
      label: "Lawyer & Advocate",
      icon: "⚖️"
    };
  }

  // 2. Healthcare / Dental / Clinics / Doctors / Salons
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
    text.includes("spa")
  ) {
    return {
      slug: "demo-dental-clinic",
      url: "https://mithundas.cloud/demo-dental-clinic",
      label: "Dental & Clinic",
      icon: "🦷"
    };
  }

  // 3. Restaurants / Food / Dining / Biryani / Sweets / Dhaba
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

  // 4. Hotel / Resorts / Lodges / Stays
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

  // 5. Cafe / Coffee / Bakery / Tea
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

// Format relative/readable timestamp
function formatContactDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "";
  }
}

export function LeadDataTable({ leads, onRefresh }: LeadDataTableProps) {
  // View Modes: "outreach" (focused 7-col) vs "full" (all 11-col)
  const [viewMode, setViewMode] = useState<"outreach" | "full">("outreach");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [isDeletingLeads, setIsDeletingLeads] = useState(false);
  const [isSendingOutreach, setIsSendingOutreach] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);

  // Preview Modal State
  const [previewModalLead, setPreviewModalLead] = useState<LeadItem | null>(null);
  const [activeChatLeadId, setActiveChatLeadId] = useState<string | null>(null);
  const [copiedModalText, setCopiedModalText] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"client_followup_checkin" | "local_business_starter">("client_followup_checkin");

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

  // Count unread replies
  const repliedCount = leads.filter(l => l.outreachStatus === "REPLIED").length;

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

  // Phase 3: Inline Status Quick-Changer
  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/lead-generation/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadIds: [leadId],
          outreachStatus: newStatus
        })
      });

      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
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

  // Launch Meta WhatsApp Outreach
  const handleLaunchOutreach = async (targetLeadIds?: string[]) => {
    const ids = targetLeadIds || selectedLeadIds;
    if (ids.length === 0) {
      alert("Please select at least 1 lead to send WhatsApp message.");
      return;
    }

    if (!confirm(`Send official Meta WhatsApp outreach with personalized category demos to ${ids.length} selected business(es)?`)) {
      return;
    }

    setIsSendingOutreach(true);
    setActionMessage(`Dispatching Meta WhatsApp templates to ${ids.length} leads with dynamic demo links...`);

    try {
      const res = await fetch("/api/admin/lead-generation/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadIds: ids,
          templateName: selectedTemplate
        })
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage(`✅ Dispatched ${data.sentCount} / ${data.totalProcessed} WhatsApp messages with dynamic demo links!`);
        setSelectedLeadIds([]);
        if (previewModalLead) setPreviewModalLead(null);
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

  // Build WhatsApp Web link with pre-filled pitch
  const getWhatsAppWebUrl = (lead: LeadItem, demoUrl: string) => {
    const phone = (lead.whatsappNumber || lead.phone || "").replace(/\D/g, "");
    const cleanPhone = phone.length === 10 ? `91${phone}` : phone;
    const text = `Hi ${lead.businessName},\n\nWe noticed your business has a great ${lead.rating ? Number(lead.rating).toFixed(1) : "4.8"}★ reputation in ${lead.city || "West Bengal"}!\n\nWe noticed your business is currently missing an automated 24/7 WhatsApp booking receptionist and modern website.\n\nWe built an interactive live mobile demo for your business: ${demoUrl}\n\nWould you like to see how this captures appointments directly on WhatsApp?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
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
      "Dynamic Demo Target", "Google Maps URL", "Outreach Status", "Last Reply Message", "Contacted At", "Replied At"
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
        `"${l.outreachStatus || "NEW"}"`,
        `"${(l.lastReplyMessage || "").replace(/"/g, '""')}"`,
        `"${l.contactedAt || ""}"`,
        `"${l.repliedAt || ""}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_crm_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#101726]/90 border border-border-app rounded-2xl p-4 sm:p-6 backdrop-blur-xl flex flex-col h-full shadow-2xl relative">
      
      {/* 1. TOP VIEW MODE SWITCHER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-border-app">
        
        {/* Left: View Mode Pills & Search */}
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          {/* View Switcher */}
          <div className="flex items-center p-1 bg-[#0b0f17] border border-border-app rounded-xl">
            <button
              onClick={() => setViewMode("outreach")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "outreach"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="7-Column High-Speed Outreach View (Zero horizontal scroll)"
            >
              <span>🎯 Outreach Focus</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-black/20 font-normal">7 Cols</span>
            </button>
            <button
              onClick={() => setViewMode("full")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "full"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              title="Full 29-Column Deep Data View"
            >
              <span>📊 Full Data</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-black/20 font-normal">11 Cols</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search business, phone, reply text..."
              className="w-full bg-[#0b0f17] border border-border-app rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary placeholder:text-gray-600 focus:outline-none focus:border-brand-cyan transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          {/* Tier Filter */}
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="bg-[#0b0f17] border border-border-app rounded-xl px-3 py-2 text-xs text-text-secondary focus:outline-none focus:border-brand-cyan cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="HOT">🔥 HOT Leads</option>
            <option value="WARM">⚡ WARM Leads</option>
          </select>

          {/* Phase 3 Status Filter: Complete 2-Way CRM Statuses */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0b0f17] border border-border-app rounded-xl px-3 py-2 text-xs text-text-secondary focus:outline-none focus:border-brand-cyan cursor-pointer"
          >
            <option value="all">All Statuses ({leads.length})</option>
            <option value="REPLIED">💬 Replied Inquiries ({repliedCount})</option>
            <option value="READ">👀 Read by Client</option>
            <option value="DELIVERED">📬 Delivered to Phone</option>
            <option value="SENT">📤 Pitched (Sent)</option>
            <option value="NEW">🆕 New / Uncontacted</option>
          </select>
        </div>

        {/* Right: Bulk Action Buttons */}
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
            <span>{isSyncingSheet ? "Syncing..." : "Sync Sheet"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-border-app hover:border-gray-500 text-xs text-text-secondary hover:text-text-primary transition-all font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Template Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-750 px-2.5 py-1.5 rounded-xl shadow-inner">
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">Template:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as any)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none font-medium cursor-pointer"
              title="Choose approved Meta WhatsApp template to dispatch"
            >
              <option value="client_followup_checkin" className="bg-slate-900 text-slate-100">
                💬 Follow-Up Check-in (3 Quick Replies)
              </option>
              <option value="local_business_starter" className="bg-slate-900 text-slate-100">
                🚀 Initial Pitch (Video Demo + Rating)
              </option>
            </select>
          </div>

          <button
            onClick={() => handleLaunchOutreach()}
            disabled={selectedLeadIds.length === 0 || isSendingOutreach}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span>
              {isSendingOutreach
                ? "Dispatching..."
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
              <th className="p-3 min-w-[130px]">Score &amp; Tier</th>
              <th className="p-3 min-w-[140px]">Phone &amp; WhatsApp</th>
              <th className="p-3 min-w-[170px]">Dynamic Demo Target</th>

              {/* Extended Columns in Full View */}
              {viewMode === "full" && (
                <>
                  <th className="p-3 min-w-[140px]">Website &amp; Tech</th>
                  <th className="p-3 min-w-[130px]">Email</th>
                  <th className="p-3 min-w-[100px]">Rating</th>
                  <th className="p-3 min-w-[140px]">Location</th>
                </>
              )}

              <th className="p-3 min-w-[160px]">Outreach &amp; CRM Status</th>
              <th className="p-3 min-w-[100px] text-center">Quick Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-app/50 font-sans">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={viewMode === "full" ? 11 : 7} className="p-12 text-center text-text-secondary font-mono">
                  No leads found matching current filters.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = selectedLeadIds.includes(lead.leadId);
                const score = lead.leadScore || 0;
                const isHot = score >= 70;
                const rawPhone = lead.whatsappNumber || lead.phone || "";
                const demo = getDemoRouting(lead.category, lead.businessName);
                const waWebUrl = getWhatsAppWebUrl(lead, demo.url);
                const contactedTime = formatContactDate(lead.contactedAt);
                const repliedTime = formatContactDate(lead.repliedAt);
                const isReplied = lead.outreachStatus === "REPLIED";
                const isRead = lead.outreachStatus === "READ";
                const isDelivered = lead.outreachStatus === "DELIVERED";

                return (
                  <tr
                    key={lead.id}
                    className={`transition-colors hover:bg-white/[0.03] ${
                      isSelected
                        ? "bg-brand-cyan/10"
                        : isReplied
                        ? "bg-emerald-950/20 border-l-2 border-emerald-500"
                        : ""
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
                      <div className="font-bold text-text-primary flex items-center gap-1.5">
                        <span className="truncate block max-w-[190px]" title={lead.businessName}>
                          {lead.businessName}
                        </span>
                        {isReplied && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" title="Active Client Reply!"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-text-secondary font-mono">{lead.category}</span>
                      {viewMode === "outreach" && (
                        <p className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">
                          {lead.city || "West Bengal"}
                        </p>
                      )}
                    </td>

                    {/* Score & Tier */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-inner ${
                            isHot
                              ? "bg-amber-500/15 border border-amber-500/40 text-amber-300"
                              : "bg-blue-500/15 border border-blue-500/40 text-blue-300"
                          }`}
                        >
                          {score}
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.2 rounded-full font-bold whitespace-nowrap ${
                              isHot
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {isHot ? <Flame className="w-2.5 h-2.5 fill-current text-amber-400" /> : <Zap className="w-2.5 h-2.5 text-blue-400" />}
                            <span>{isHot ? "HOT" : "WARM"}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone & Direct WhatsApp Web Button */}
                    <td className="p-3 font-mono text-[11px]">
                      {rawPhone ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-400 font-medium">+{rawPhone}</span>
                            <a
                              href={waWebUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                              title="Open 1-on-1 Chat in WhatsApp Web"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                          </div>
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

                    {/* Dynamic Demo Showcase Target */}
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

                    {/* Extended Columns (Only in Full View) */}
                    {viewMode === "full" && (
                      <>
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

                        {/* Rating */}
                        <td className="p-3 font-mono text-[11px]">
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <span>★ {lead.rating || "4.5"}</span>
                          </div>
                          <span className="text-[10px] text-text-secondary">
                            {lead.reviewCount || 0} reviews
                          </span>
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
                      </>
                    )}

                    {/* Phase 3: Complete 2-Way CRM Status & Client Reply Bubble */}
                    <td className="p-3">
                      <div className="space-y-1.5">
                        <select
                          value={lead.outreachStatus || "NEW"}
                          onChange={(e) => handleUpdateStatus(lead.leadId, e.target.value)}
                          className={`text-[10px] font-mono font-bold px-2 py-1 rounded-xl border appearance-none pr-5 bg-no-repeat cursor-pointer focus:outline-none ${
                            isReplied
                              ? "bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/10"
                              : isRead
                              ? "bg-sky-500/20 border-sky-400 text-sky-300"
                              : isDelivered
                              ? "bg-indigo-500/20 border-indigo-400 text-indigo-300"
                              : lead.outreachStatus === "SENT"
                              ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                              : "bg-slate-900 border-slate-700 text-slate-400"
                          }`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundPosition: "right 0.35rem center",
                            backgroundSize: "0.75rem"
                          }}
                        >
                          <option value="NEW" className="bg-slate-950 text-slate-300">🆕 NEW</option>
                          <option value="SENT" className="bg-slate-950 text-cyan-300">📤 PITCHED (Sent)</option>
                          <option value="DELIVERED" className="bg-slate-950 text-indigo-300">📬 DELIVERED (✓✓)</option>
                          <option value="READ" className="bg-slate-950 text-sky-300">👀 READ (✓✓)</option>
                          <option value="REPLIED" className="bg-slate-950 text-emerald-300">💬 REPLIED (Inquiry)</option>
                        </select>

                        {/* If Client Replied: Display Inbound Message Bubble (Clickable to open Chat) */}
                        {isReplied && lead.lastReplyMessage && (
                          <button
                            onClick={() => setActiveChatLeadId(lead.id)}
                            className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 hover:border-emerald-400 text-emerald-200 text-[11px] font-mono leading-tight max-w-[200px] shadow-md hover:shadow-emerald-500/20 text-left transition-all cursor-pointer group"
                            title="Click to open live chat history"
                          >
                            <span className="font-bold text-emerald-400 flex items-center justify-between text-[9px] uppercase tracking-wider mb-0.5">
                              <span>💬 Client Reply:</span>
                              <span className="text-[8px] text-emerald-300 group-hover:underline">Open &rarr;</span>
                            </span>
                            <p className="line-clamp-2 italic text-emerald-100">"{lead.lastReplyMessage}"</p>
                            {repliedTime && (
                              <span className="block text-[9px] text-emerald-400/80 mt-1">
                                {repliedTime}
                              </span>
                            )}
                          </button>
                        )}

                        {/* Contacted Timestamp */}
                        {!isReplied && contactedTime && (
                          <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                            {isRead ? (
                              <CheckCheck className="w-3 h-3 text-sky-400" />
                            ) : isDelivered ? (
                              <CheckCheck className="w-3 h-3 text-slate-400" />
                            ) : (
                              <Clock className="w-2.5 h-2.5 text-cyan-400" />
                            )}
                            <span>{contactedTime}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Phase 3: Quick Actions */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* If client replied: Glow green live chat drawer button */}
                        {isReplied ? (
                          <button
                            onClick={() => setActiveChatLeadId(lead.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-[10px] font-mono flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all animate-pulse"
                            title="Open WhatsApp Live Chat & History"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                            <span>Live Chat</span>
                          </button>
                        ) : (
                          <>
                            {/* Open Chat Drawer for any lead */}
                            <button
                              onClick={() => setActiveChatLeadId(lead.id)}
                              className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/25 flex items-center justify-center text-emerald-400 transition-colors"
                              title="Open Conversation History & Chat"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>

                            {/* Message Preview Modal Trigger */}
                            <button
                              onClick={() => setPreviewModalLead(lead)}
                              className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/25 flex items-center justify-center text-cyan-300 transition-colors"
                              title="Preview WhatsApp Pitch Message"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Direct WhatsApp Web Chat */}
                            {rawPhone && (
                              <a
                                href={waWebUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-emerald-500/40 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors"
                                title="Open Personal WhatsApp (wa.me)"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </>
                        )}

                        {/* GMaps Link */}
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

                        {/* Delete */}
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

      {/* 2. INTERACTIVE WHATSAPP MESSAGE PREVIEW MODAL */}
      {previewModalLead && (() => {
        const modalDemo = getDemoRouting(previewModalLead.category, previewModalLead.businessName);
        const ratingStr = `${previewModalLead.rating ? Number(previewModalLead.rating).toFixed(1) : "4.8"}★ (${previewModalLead.reviewCount || 50}+ reviews)`;
        const cityStr = previewModalLead.city || "West Bengal";
        const phone = previewModalLead.whatsappNumber || previewModalLead.phone || "";
        const cleanPhone = phone.replace(/\D/g, "");

        const previewText =
          `Hi ${previewModalLead.businessName},\n\n` +
          `We noticed your business has an exceptional ${ratingStr} reputation in ${cityStr}!\n\n` +
          `Most customers today prefer booking consultations directly through WhatsApp without waiting on phone calls. We noticed your business does not yet have an automated 24/7 WhatsApp appointment booking system.\n\n` +
          `We created an interactive live mobile demo to show you how it works:\n\n` +
          `👉 View Demo: ${modalDemo.url}\n\n` +
          `Would you like to see how this captures 3x more appointments automatically starting at ₹2,999/-?`;

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <div className="bg-[#0b101b] border border-cyan-500/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl shadow-cyan-500/10 flex flex-col">
              
              {/* Modal WhatsApp Green Header */}
              <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-4 py-3 flex items-center justify-between text-white border-b border-emerald-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-base font-bold shadow-md">
                    {modalDemo.icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold truncate max-w-[240px]">
                      {previewModalLead.businessName}
                    </h4>
                    <p className="text-[10px] text-emerald-200 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>+{cleanPhone || "91XXXXXXXXXX"} • {modalDemo.label}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewModalLead(null)}
                  className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Canvas */}
              <div className="p-4 sm:p-6 bg-[#060a12] space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="text-center">
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400">
                    Official Meta WhatsApp Cloud API Template Preview
                  </span>
                </div>

                {/* WhatsApp Message Bubble */}
                <div className="bg-[#121c2c] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                  <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                    <span className="font-bold text-white">Hi {previewModalLead.businessName}</span>,
                    {"\n\n"}
                    We noticed your business has an exceptional <span className="text-amber-400 font-bold">{ratingStr}</span> reputation in <span className="text-cyan-300 font-semibold">{cityStr}</span>!
                    {"\n\n"}
                    Most customers today prefer booking consultations directly through WhatsApp without waiting on phone calls. We noticed your business does not yet have an automated 24/7 WhatsApp appointment booking system.
                    {"\n\n"}
                    We created an interactive live mobile demo to show you how it works:
                  </p>

                  {/* Dynamic CTA Button inside WhatsApp bubble */}
                  <a
                    href={modalDemo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs font-mono tracking-wide shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <span>{modalDemo.icon}</span>
                    <span>View Live {modalDemo.label} Showcase</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center justify-end gap-1 pt-1 text-[10px] text-slate-500 font-mono">
                    <span>Just now</span>
                    <span className="text-cyan-400">✓✓</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="p-3 sm:p-4 bg-[#090e18] border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(previewText);
                      setCopiedModalText(true);
                      setTimeout(() => setCopiedModalText(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    {copiedModalText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedModalText ? "Copied!" : "Copy Pitch"}</span>
                  </button>

                  <a
                    href={getWhatsAppWebUrl(previewModalLead, modalDemo.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-xs font-mono text-emerald-400 flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open WA Web</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLaunchOutreach([previewModalLead.leadId])}
                    disabled={isSendingOutreach}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5 fill-black" />
                    <span>Send via Meta API</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

          {/* Phase 4: Full Two-Way WhatsApp Live Chat Drawer */}
      <LeadChatDrawer
        leadId={activeChatLeadId}
        onClose={() => setActiveChatLeadId(null)}
        onStatusUpdated={onRefresh}
      />
    </div>
  );
}
