"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shield,
  Key,
  RefreshCw,
  Search,
  Plus,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Send,
  X,
  CreditCard,
  Building2,
  QrCode,
  Sparkles,
} from "lucide-react";
import { AdminNav } from "../components/AdminNav";

interface InvoiceItem {
  id?: string;
  invoiceId: string;
  leadId?: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  currency: string;
  currencySymbol: string;
  totalAmount: string;
  totalAmountNumeric?: number;
  depositPercent: string;
  depositAmount: string;
  receivedAmountNumeric?: number;
  remainingAmountNumeric?: number;
  setupFee?: string;
  monthlyRetainer?: string;
  projectScope: string;
  paymentStatus: string;
  paymentLink?: string;
  issueDate: string;
  dueDate: string;
  createdAt?: string;
}

interface TransactionItem {
  id?: string;
  transactionId: string;
  invoiceId: string;
  clientName: string;
  clientEmail: string;
  companyName?: string;
  amount: number;
  currency?: string;
  currencySymbol?: string;
  paymentMethod: string;
  utrOrReference?: string;
  verificationStatus: string;
  notes?: string;
  createdAt?: string;
}

interface FinancialMetrics {
  totalGrossValue: number;
  totalCollected: number;
  totalOutstanding: number;
  pendingQueueCount: number;
  currencyTotals: Record<string, { total: number; collected: number; remaining: number }>;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($) — Global" },
  { code: "INR", symbol: "₹", label: "INR (₹) — India" },
  { code: "EUR", symbol: "€", label: "EUR (€) — Europe" },
  { code: "GBP", symbol: "£", label: "GBP (£) — UK" },
  { code: "AUD", symbol: "A$", label: "AUD (A$) — Australia" },
];

export default function AdminFinancePage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalGrossValue: 0,
    totalCollected: 0,
    totalOutstanding: 0,
    pendingQueueCount: 0,
    currencyTotals: {
      USD: { total: 0, collected: 0, remaining: 0 },
      INR: { total: 0, collected: 0, remaining: 0 },
      EUR: { total: 0, collected: 0, remaining: 0 },
      GBP: { total: 0, collected: 0, remaining: 0 },
      AUD: { total: 0, collected: 0, remaining: 0 },
    },
  });

  const [loading, setLoading] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [verifyingTxnId, setVerifyingTxnId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals
  const [showIssueInvoiceModal, setShowIssueInvoiceModal] = useState(false);
  const [showRecordCashModal, setShowRecordCashModal] = useState(false);

  // New Invoice Form
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    clientName: "",
    clientEmail: "",
    companyName: "",
    currency: "USD",
    currencySymbol: "$",
    totalAmount: "2500.00",
    depositPercent: "20",
    setupFee: "150.00",
    monthlyRetainer: "200.00",
    projectScope: "Custom AI Workflow Automation Architecture & Webhook Gateway",
    paymentLink: "",
  });

  // Record Cash Form
  const [cashForm, setCashForm] = useState({
    invoiceId: "",
    amount: "",
    paymentMethod: "cash",
    utrOrReference: "CASH-RECEIPT-01",
    notes: "Manual cash received from client",
  });

  useEffect(() => {
    const savedSecret = localStorage.getItem("mithundas_admin_secret");
    if (savedSecret) {
      setAdminSecret(savedSecret);
      fetchFinancialData(savedSecret);
    }
  }, []);

  const fetchFinancialData = async (secret: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/finance/transactions", {
        headers: { "x-admin-secret": secret },
      });

      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
        setTransactions(data.transactions || []);
        if (data.metrics) setMetrics(data.metrics);
        setIsAuthenticated(true);
        localStorage.setItem("mithundas_admin_secret", secret);
      } else {
        setIsAuthenticated(false);
        setNotification({ type: "error", text: "Invalid admin authentication token" });
      }
    } catch (err) {
      setIsAuthenticated(false);
      setNotification({ type: "error", text: "Failed to connect to finance server" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminSecret.trim()) fetchFinancialData(adminSecret.trim());
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleVerifyTransaction = async (transactionId: string) => {
    setVerifyingTxnId(transactionId);
    try {
      const res = await fetch("/api/admin/finance/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ transactionId }),
      });

      if (res.ok) {
        const data = await res.json();
        setNotification({ type: "success", text: `Transaction ${transactionId} verified! Receipt email dispatched.` });
        fetchFinancialData(adminSecret);
      } else {
        setNotification({ type: "error", text: `Failed to verify transaction ${transactionId}` });
      }
    } catch (err) {
      setNotification({ type: "error", text: "Error during payment verification" });
    } finally {
      setVerifyingTxnId(null);
    }
  };

  const handleIssueInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/invoices/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify(newInvoiceForm),
      });

      if (res.ok) {
        const data = await res.json();
        setNotification({ type: "success", text: `Custom Invoice ${data.invoice?.invoiceId} generated & active!` });
        setShowIssueInvoiceModal(false);
        fetchFinancialData(adminSecret);
      } else {
        setNotification({ type: "error", text: "Failed to generate custom invoice" });
      }
    } catch (err) {
      setNotification({ type: "error", text: "Network error creating invoice" });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordCashSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashForm.invoiceId || !cashForm.amount) return;

    setLoading(true);
    try {
      const res = await fetch("/api/finance/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cashForm,
          notes: `Admin recorded cash/manual receipt (${cashForm.notes})`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Immediately verify the cash receipt
        if (data.transaction?.transactionId) {
          await handleVerifyTransaction(data.transaction.transactionId);
        }
        setShowRecordCashModal(false);
      } else {
        setNotification({ type: "error", text: "Failed to record cash transaction" });
      }
    } catch (err) {
      setNotification({ type: "error", text: "Error recording cash payment" });
    } finally {
      setLoading(false);
    }
  };

  const pendingTxns = transactions.filter((t) => t.verificationStatus === "pending");

  const filteredInvoices = invoices.filter((item) => {
    const matchesSearch =
      (item.clientName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.clientEmail || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.invoiceId || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unpaid" && item.paymentStatus === "unpaid") ||
      (statusFilter === "partially_paid" && item.paymentStatus === "partially_paid") ||
      (statusFilter === "paid_in_full" && item.paymentStatus === "paid_in_full");

    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#07090e] text-text-primary flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#0f1420] border border-border-app rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500"></div>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Financial Operations Ledger</h1>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Enter admin secret key to access revenue tracking &amp; payment verification
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
                  className="w-full bg-[#161d2c] border border-border-app rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-emerald-400 font-mono"
                  required
                />
              </div>
            </div>

            {notification && (
              <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                notification.type === "error" ? "bg-rose-500/10 border border-rose-500/30 text-rose-400" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{notification.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-medium py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Authenticate Financial Control"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090e] text-text-primary pb-24 font-sans">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              Financial Revenue &amp; Ledger Control
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-medium">
                MULTI-CURRENCY (USD, INR, EUR, GBP, AUD)
              </span>
            </h2>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Agreed Contract Value ($X), Initial Partial Deposits ($Received), &amp; Remaining Balance ($Remaining)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRecordCashModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#121824] hover:bg-[#1a2334] border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-400 transition-all"
            >
              <DollarSign className="w-4 h-4" />
              <span>Record Cash / Bank Receipt</span>
            </button>

            <button
              onClick={() => setShowIssueInvoiceModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-slate-950 rounded-xl text-xs font-sans font-bold transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Custom Invoice / Contract</span>
            </button>

            <button
              onClick={() => fetchFinancialData(adminSecret)}
              disabled={loading}
              className="p-2 bg-[#121824] border border-border-app rounded-xl text-text-secondary hover:text-text-primary transition-all"
              title="Refresh Financial Ledger"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-mono flex items-center justify-between gap-3 ${
            notification.type === "error" ? "bg-rose-500/10 border border-rose-500/30 text-rose-400" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
          }`}>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{notification.text}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-text-secondary hover:text-text-primary">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Financial Revenue Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Gross Contract Value ($X) */}
          <div className="bg-[#0f1420] border border-border-app rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-text-secondary uppercase">Gross Contract Value ($X)</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              ${metrics.totalGrossValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-text-secondary font-mono mt-2 flex flex-wrap gap-2">
              <span>INR: ₹{metrics.currencyTotals.INR?.total.toLocaleString() || 0}</span>
              <span>USD: ${metrics.currencyTotals.USD?.total.toLocaleString() || 0}</span>
            </div>
          </div>

          {/* Collected Revenue ($Received) */}
          <div className="bg-[#0f1420] border border-border-app rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-text-secondary uppercase">Collected Revenue ($Received)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-400 font-mono">
              ${metrics.totalCollected.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-text-secondary font-mono mt-2 flex flex-wrap gap-2">
              <span>INR: ₹{metrics.currencyTotals.INR?.collected.toLocaleString() || 0}</span>
              <span>USD: ${metrics.currencyTotals.USD?.collected.toLocaleString() || 0}</span>
            </div>
          </div>

          {/* Remaining Outstanding Balance ($Remaining) */}
          <div className="bg-[#0f1420] border border-border-app rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-text-secondary uppercase">Outstanding Balance (4X/5)</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-400 font-mono">
              ${metrics.totalOutstanding.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-text-secondary font-mono mt-2 flex flex-wrap gap-2">
              <span>INR: ₹{metrics.currencyTotals.INR?.remaining.toLocaleString() || 0}</span>
              <span>USD: ${metrics.currencyTotals.USD?.remaining.toLocaleString() || 0}</span>
            </div>
          </div>

          {/* Verification Queue */}
          <div className="bg-[#0f1420] border border-border-app rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-text-secondary uppercase">Verification Queue</span>
              <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <QrCode className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-cyan-400 font-mono">{metrics.pendingQueueCount}</div>
            <p className="text-[11px] text-text-secondary font-mono mt-2">Submitted UTR / Cash Receipts</p>
          </div>
        </div>

        {/* Pending Manual Verification Console (Queue for Cash, UPI UTR, Wise, Wire) */}
        {pendingTxns.length > 0 && (
          <div className="bg-[#0f1420] border border-amber-500/40 rounded-2xl p-6 mb-8 shadow-xl">
            <h3 className="text-sm font-mono text-amber-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Pending Manual Verifications Queue ({pendingTxns.length} Submitted Payment References)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-[#141b2b] border-b border-border-app text-text-secondary font-mono text-[11px] uppercase">
                    <th className="py-3 px-4">Invoice ID</th>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Submitted Amount</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">UTR / Reference #</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-app/50">
                  {pendingTxns.map((txn) => (
                    <tr key={txn.transactionId} className="hover:bg-[#131a29]/60">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400">{txn.invoiceId}</td>
                      <td className="py-3 px-4 font-bold text-white">{txn.clientName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {txn.currencySymbol || "$"}{txn.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 font-mono text-text-secondary uppercase">{txn.paymentMethod}</td>
                      <td className="py-3 px-4 font-mono text-cyan-300 font-bold">{txn.utrOrReference || "N/A"}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleVerifyTransaction(txn.transactionId)}
                          disabled={verifyingTxnId === txn.transactionId}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:opacity-90 transition-all shadow-sm"
                        >
                          {verifyingTxnId === txn.transactionId ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>Approve &amp; Issue Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-[#0f1420] border border-border-app rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, email, company or INV-id..."
              className="w-full bg-[#161d2c] border border-border-app/80 rounded-xl pl-10 pr-4 py-2 text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-emerald-400 font-mono"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-text-secondary hover:text-text-primary">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 font-mono text-xs">
            <span className="text-text-secondary shrink-0 mr-1">Status Filter:</span>
            {[
              { key: "all", label: "All Invoices" },
              { key: "partially_paid", label: "Initial Deposit Paid" },
              { key: "paid_in_full", label: "Fully Settled (100%)" },
              { key: "unpaid", label: "Unpaid" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  statusFilter === tab.key
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold"
                    : "bg-[#161d2c] text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Revenue & Invoices Table */}
        <div className="bg-[#0f1420] border border-border-app rounded-2xl overflow-hidden shadow-xl">
          {filteredInvoices.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-text-secondary/30 mx-auto mb-3" />
              <h3 className="text-sm font-mono text-text-secondary">No invoices found matching your criteria</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-[#121824] border-b border-border-app text-text-secondary font-mono text-[11px] uppercase">
                    <th className="py-3.5 px-4">Invoice ID</th>
                    <th className="py-3.5 px-4">Client &amp; Company</th>
                    <th className="py-3.5 px-4">Total Contract ($X)</th>
                    <th className="py-3.5 px-4">Deposit Paid ($Received)</th>
                    <th className="py-3.5 px-4">Balance Remaining</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-app/50">
                  {filteredInvoices.map((inv) => {
                    const sym = inv.currencySymbol || "$";
                    const totalRaw = parseFloat((inv.totalAmount || "").replace(/[^0-9.]/g, "")) || inv.totalAmountNumeric || 0;
                    const recRaw = Number(inv.receivedAmountNumeric) || 0;
                    const remRaw = Math.max(0, totalRaw - recRaw);
                    const pct = totalRaw > 0 ? Math.min(100, Math.round((recRaw / totalRaw) * 100)) : 0;

                    const isPaidFull = inv.paymentStatus === "paid_in_full" || remRaw <= 0;
                    const isPartial = inv.paymentStatus === "partially_paid" || (recRaw > 0 && remRaw > 0);

                    return (
                      <tr key={inv.invoiceId} className="hover:bg-[#131a29]/60 transition-colors">
                        {/* ID */}
                        <td className="py-4 px-4 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
                              {inv.invoiceId}
                            </span>
                            <button
                              onClick={() => handleCopy(inv.invoiceId, inv.invoiceId)}
                              className="text-text-secondary hover:text-text-primary p-1"
                              title="Copy Invoice ID"
                            >
                              {copiedText === inv.invoiceId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        {/* Client & Company */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-text-primary">{inv.clientName}</div>
                          <div className="text-text-secondary font-mono text-[11px] mt-0.5">{inv.companyName}</div>
                          <div className="text-cyan-400/80 font-mono text-[10px]">{inv.clientEmail}</div>
                        </td>

                        {/* Total Contract ($X) */}
                        <td className="py-4 px-4 font-mono">
                          <div className="text-white font-bold text-sm">
                            {sym}{totalRaw.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-text-secondary">{inv.currency} Currency</div>
                        </td>

                        {/* Paid Received */}
                        <td className="py-4 px-4 font-mono">
                          <div className="text-emerald-400 font-bold text-sm">
                            {sym}{recRaw.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                            <div className="bg-emerald-400 h-full transition-all" style={{ width: `${pct}%` }}></div>
                          </div>
                        </td>

                        {/* Balance Remaining */}
                        <td className="py-4 px-4 font-mono">
                          <div className="text-amber-400 font-bold text-sm">
                            {sym}{remRaw.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-text-secondary">{100 - pct}% Outstanding</div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 font-mono">
                          {isPaidFull ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                              🟢 Fully Settled
                            </span>
                          ) : isPartial ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                              🟡 Deposit Paid ({pct}%)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                              🔴 Unpaid
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {(() => {
                              const waText = encodeURIComponent(`Hi ${inv.clientName}! Here is your project proposal & initial deposit payment link for ${inv.companyName}: https://mithundas.cloud/invoice/${inv.invoiceId}`);
                              return (
                                <a
                                  href={`https://wa.me/?text=${waText}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-400 flex items-center gap-1.5 transition-all"
                                  title="Share payment link on WhatsApp"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              );
                            })()}

                            <a
                              href={`/invoice/${inv.invoiceId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-[#161d2c] hover:bg-[#1f293d] border border-border-app/80 rounded-lg text-xs font-mono text-cyan-400 flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>View Portal</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Standalone Issue Custom Invoice Modal */}
      {showIssueInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1420] border border-border-app rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500"></div>

            <div className="p-6 border-b border-border-app flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Issue Standalone Invoice / Contract</h3>
                <p className="text-xs text-text-secondary font-mono">
                  For WhatsApp, direct call, or off-platform clients
                </p>
              </div>
              <button onClick={() => setShowIssueInvoiceModal(false)} className="text-text-secondary hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueInvoiceSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-text-secondary uppercase mb-1">Client Name</label>
                  <input
                    type="text"
                    value={newInvoiceForm.clientName}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, clientName: e.target.value })}
                    placeholder="e.g. Alex Vance"
                    className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-text-secondary uppercase mb-1">Client Email</label>
                  <input
                    type="email"
                    value={newInvoiceForm.clientEmail}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, clientEmail: e.target.value })}
                    placeholder="alex@vance.com"
                    className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-text-secondary uppercase mb-1">Company Name</label>
                  <input
                    type="text"
                    value={newInvoiceForm.companyName}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, companyName: e.target.value })}
                    placeholder="Vance Enterprises"
                    className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-text-secondary uppercase mb-1">Currency</label>
                  <select
                    value={newInvoiceForm.currency}
                    onChange={(e) => {
                      const sel = CURRENCIES.find((c) => c.code === e.target.value);
                      setNewInvoiceForm({ ...newInvoiceForm, currency: e.target.value, currencySymbol: sel?.symbol || "$" });
                    }}
                    className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-emerald-400 font-bold focus:outline-none"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-text-secondary uppercase mb-1">Agreed Total Fee ($X)</label>
                  <input
                    type="text"
                    value={newInvoiceForm.totalAmount}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, totalAmount: e.target.value })}
                    placeholder="2500.00"
                    className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-text-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-text-secondary uppercase mb-1">Deposit Required (%)</label>
                  <select
                    value={newInvoiceForm.depositPercent}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, depositPercent: e.target.value })}
                    className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-text-primary focus:outline-none"
                  >
                    <option value="20">20% Initial Deposit</option>
                    <option value="25">25% Initial Deposit</option>
                    <option value="50">50% Upfront Deposit</option>
                    <option value="100">100% Full Payment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-text-secondary uppercase mb-1">Project Scope / SOW Description</label>
                <textarea
                  value={newInvoiceForm.projectScope}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, projectScope: e.target.value })}
                  rows={3}
                  className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-text-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-text-secondary uppercase mb-1">Custom Payment Link (Stripe / Razorpay / PayPal)</label>
                <input
                  type="url"
                  value={newInvoiceForm.paymentLink}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, paymentLink: e.target.value })}
                  placeholder="https://paypal.me/MithunzDas or https://buy.stripe.com/..."
                  className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-text-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueInvoiceModal(false)}
                  className="px-4 py-2 bg-[#1b2333] text-text-primary rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-xl"
                >
                  {loading ? "Generating..." : "Generate Digital Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Offline Cash Receipt Modal */}
      {showRecordCashModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1420] border border-border-app rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500"></div>

            <div className="p-6 border-b border-border-app flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Record Offline Cash / Bank Receipt</h3>
                <p className="text-xs text-text-secondary font-mono">Instantly verify and issue receipt for local cash/wire</p>
              </div>
              <button onClick={() => setShowRecordCashModal(false)} className="text-text-secondary hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordCashSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[10px] text-text-secondary uppercase mb-1">Target Invoice ID</label>
                <select
                  value={cashForm.invoiceId}
                  onChange={(e) => setCashForm({ ...cashForm, invoiceId: e.target.value })}
                  className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-emerald-400 font-bold focus:outline-none"
                  required
                >
                  <option value="">Select Invoice...</option>
                  {invoices.map((i) => (
                    <option key={i.invoiceId} value={i.invoiceId}>
                      {i.invoiceId} — {i.clientName} ({i.companyName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-text-secondary uppercase mb-1">Amount Received</label>
                <input
                  type="text"
                  value={cashForm.amount}
                  onChange={(e) => setCashForm({ ...cashForm, amount: e.target.value })}
                  placeholder="e.g. 500.00"
                  className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-text-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-text-secondary uppercase mb-1">Payment Method</label>
                <select
                  value={cashForm.paymentMethod}
                  onChange={(e) => setCashForm({ ...cashForm, paymentMethod: e.target.value })}
                  className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-text-primary focus:outline-none"
                >
                  <option value="cash">💵 Cash Received (Offline Local)</option>
                  <option value="upi">🇮🇳 Direct UPI / GPay / PhonePe</option>
                  <option value="wire">🏦 Direct Bank Wire Transfer</option>
                  <option value="paypal">🌐 PayPal / Wise</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-text-secondary uppercase mb-1">Reference / Cash Note</label>
                <input
                  type="text"
                  value={cashForm.utrOrReference}
                  onChange={(e) => setCashForm({ ...cashForm, utrOrReference: e.target.value })}
                  placeholder="CASH-RECEIPT-01 or UTR #"
                  className="w-full bg-[#161d2c] border border-border-app rounded-lg p-2.5 text-text-primary focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecordCashModal(false)}
                  className="px-4 py-2 bg-[#1b2333] text-text-primary rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-xl"
                >
                  {loading ? "Recording..." : "Record & Issue Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
