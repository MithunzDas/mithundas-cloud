"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Globe,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  QrCode,
  DollarSign,
  Lock,
  X,
} from "lucide-react";

interface InvoiceData {
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
  customPaymentMethods?: any;
  issueDate: string;
  dueDate: string;
  paidAt?: string;
}

export default function DigitalInvoicePage() {
  const params = useParams();
  const invoiceId = params?.id as string;

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePaymentTab, setActivePaymentTab] = useState<"card" | "upi" | "paypal" | "wire">("card");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice(invoiceId);
    }
  }, [invoiceId]);

  const fetchInvoice = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice(data.invoice);
        // Default to UPI if currency is INR
        if (data.invoice?.currency === "INR") {
          setActivePaymentTab("upi");
        }
      } else {
        setError("Invoice not found or invalid link.");
      }
    } catch (err) {
      setError("Failed to load digital invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const [utrInput, setUtrInput] = useState("");
  const [utrAmountInput, setUtrAmountInput] = useState("");
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [utrNotice, setUtrNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrInput.trim() || !utrAmountInput.trim() || !invoice) return;

    setSubmittingUtr(true);
    try {
      const res = await fetch("/api/finance/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.invoiceId,
          amount: utrAmountInput.replace(/[^0-9.]/g, ""),
          paymentMethod: activePaymentTab,
          utrOrReference: utrInput.trim(),
          clientName: invoice.clientName,
          clientEmail: invoice.clientEmail,
          notes: `Client submitted reference via digital portal (${activePaymentTab.toUpperCase()})`,
        }),
      });

      if (res.ok) {
        setUtrNotice({ type: "success", text: `Payment reference ${utrInput} submitted successfully! Awaiting admin verification.` });
        setUtrInput("");
        setUtrAmountInput("");
      } else {
        setUtrNotice({ type: "error", text: "Failed to submit payment reference. Please try again." });
      }
    } catch (err) {
      setUtrNotice({ type: "error", text: "Network error submitting reference." });
    } finally {
      setSubmittingUtr(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-6 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-slate-400">Loading Secure Digital Invoice...</p>
        </div>
      </main>
    );
  }

  if (error || !invoice) {
    return (
      <main className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#0f1420] border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-white mb-2">Invoice Not Found</h1>
          <p className="text-xs font-mono text-slate-400 mb-6">{error || "The requested invoice reference does not exist or has expired."}</p>
          <a
            href="https://mithundas.cloud"
            className="inline-block px-6 py-2.5 bg-cyan-500 text-slate-950 font-semibold rounded-xl text-xs hover:bg-cyan-400 transition-all"
          >
            Return to Mithun Das Cloud
          </a>
        </div>
      </main>
    );
  }

  const isPaid = invoice.paymentStatus === "paid_in_full";
  const isDepositPaid = invoice.paymentStatus === "deposit_paid";
  const isUnpaid = invoice.paymentStatus === "unpaid" || !invoice.paymentStatus;

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-12 px-4 md:px-8 font-sans print:bg-white print:text-slate-900 print:py-0 print:px-0">
      {/* Top Floating Print / Action Header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <a
          href="https://mithundas.cloud"
          className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>mithundas.cloud</span>
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#141b2b] hover:bg-[#1e293b] border border-slate-700/80 rounded-xl text-xs font-mono text-slate-200 transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Main Invoice Card Container */}
      <div className="max-w-4xl mx-auto bg-[#0f1420] print:bg-white border border-slate-800 print:border-none rounded-3xl print:rounded-none p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 print:hidden"></div>

        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800 print:border-slate-300">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono text-lg print:border-slate-400 print:text-slate-900">
                M
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white print:text-slate-900 tracking-tight">Mithun Das</h1>
                <p className="text-[11px] font-mono text-cyan-400 print:text-slate-600 uppercase font-bold tracking-widest">
                  AI BUSINESS AUTOMATION & ARCHITECTURE
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-600 font-mono">
              Email: mithun@mithundas.cloud | Web: mithundas.cloud
            </p>
          </div>

          <div className="text-left md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold mb-2 border print:border-slate-400">
              {isPaid ? (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PAID IN FULL
                </span>
              ) : isDepositPaid ? (
                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> DEPOSIT RECEIVED
                </span>
              ) : (
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> PAYMENT PENDING
                </span>
              )}
            </div>

            <div className="text-xs font-mono text-slate-400 print:text-slate-600">
              Invoice ID: <span className="font-bold text-cyan-400 print:text-slate-900">{invoice.invoiceId}</span>
            </div>
          </div>
        </div>

        {/* Billing Meta Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-slate-800 print:border-slate-300 font-mono text-xs">
          {/* Billed To */}
          <div className="bg-[#141b2b] print:bg-slate-50 p-5 rounded-2xl border border-slate-800/80 print:border-slate-200">
            <span className="text-[10px] text-slate-400 print:text-slate-500 uppercase tracking-wider font-bold">Billed To (Client):</span>
            <div className="text-sm font-bold text-white print:text-slate-900 mt-1">{invoice.clientName}</div>
            <div className="text-xs text-slate-300 print:text-slate-700 mt-0.5">{invoice.companyName}</div>
            <div className="text-xs text-cyan-400 print:text-slate-600 mt-1">{invoice.clientEmail}</div>
          </div>

          {/* Invoice Dates & Terms */}
          <div className="bg-[#141b2b] print:bg-slate-50 p-5 rounded-2xl border border-slate-800/80 print:border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Issue Date:</span>
              <span className="font-bold text-white print:text-slate-900">{invoice.issueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Payment Due Date:</span>
              <span className="font-bold text-amber-400 print:text-slate-900">{invoice.dueDate}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 print:border-slate-300 pt-2">
              <span className="text-slate-400 print:text-slate-600">Upfront Deposit Terms:</span>
              <span className="font-bold text-emerald-400 print:text-slate-900">{invoice.depositPercent} Initial Deposit</span>
            </div>
          </div>
        </div>

        {/* Itemized Project Scope & Fee Breakdown */}
        <div className="py-8 border-b border-slate-800 print:border-slate-300">
          <h3 className="text-xs font-mono text-slate-400 print:text-slate-600 uppercase font-bold tracking-wider mb-4">
            Itemized Statement of Work &amp; Fees
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-[#141b2b] print:bg-slate-100 text-slate-400 print:text-slate-700 font-mono text-[11px] uppercase border-b border-slate-800 print:border-slate-300">
                  <th className="py-3 px-4 rounded-l-xl">Description / Deliverables</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Amount ({invoice.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                <tr>
                  <td className="py-4 px-4">
                    <div className="font-bold text-white print:text-slate-900 text-sm">Custom AI Architecture &amp; Development</div>
                    <div className="text-xs text-slate-400 print:text-slate-600 font-mono mt-1 whitespace-pre-wrap leading-relaxed">
                      {invoice.projectScope}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-white print:text-slate-900 text-sm align-top">
                    {invoice.totalAmount}
                  </td>
                </tr>

                {invoice.setupFee && (
                  <tr>
                    <td className="py-3 px-4 font-mono text-slate-300 print:text-slate-700">Fixed Setup &amp; API Integration Fee</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-400 print:text-slate-900 font-bold">{invoice.setupFee}</td>
                  </tr>
                )}

                {invoice.monthlyRetainer && (
                  <tr>
                    <td className="py-3 px-4 font-mono text-slate-300 print:text-slate-700">Monthly System Maintenance &amp; Retainer</td>
                    <td className="py-3 px-4 text-right font-mono text-cyan-400 print:text-slate-900 font-bold">{invoice.monthlyRetainer}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Math Breakdown (Total X, Paid Received, Remaining Balance) */}
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141b2b] print:bg-slate-50 p-5 rounded-2xl border border-slate-800/80 print:border-slate-300 font-mono">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Financial Progress Ledger:</span>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-300">Total Agreed: <strong className="text-white font-bold">{invoice.totalAmount}</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400">Verified Paid: <strong className="font-bold">{invoice.currencySymbol || "$"}{(invoice.receivedAmountNumeric || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
              </div>
            </div>

            <div className="bg-[#0b0f17] print:bg-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 text-right w-full md:w-auto">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Remaining Outstanding Balance:</span>
              <span className="text-base font-bold text-amber-400 print:text-slate-900">
                {invoice.currencySymbol || "$"}{((parseFloat((invoice.totalAmount || "").replace(/[^0-9.]/g, "")) || 0) - (invoice.receivedAmountNumeric || 0)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Custom Payment Methods & Selector */}
        {!isPaid && (
          <div className="pt-8 print:hidden">
            <h3 className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Select Payment Method ({invoice.depositAmount} Deposit Required)
            </h3>

            {/* Tabs */}
            <div className="flex items-center gap-2 bg-[#141b2b] p-1.5 rounded-2xl border border-slate-800 mb-6 overflow-x-auto">
              <button
                onClick={() => setActivePaymentTab("card")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activePaymentTab === "card"
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cards / Checkout</span>
              </button>

              <button
                onClick={() => setActivePaymentTab("upi")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activePaymentTab === "upi"
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / India Transfer (0% Fee)</span>
              </button>

              <button
                onClick={() => setActivePaymentTab("paypal")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activePaymentTab === "paypal"
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>PayPal / Wise (Global)</span>
              </button>

              <button
                onClick={() => setActivePaymentTab("wire")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activePaymentTab === "wire"
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Bank Wire / Crypto</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-[#141b2b] border border-slate-800 rounded-2xl p-6 font-mono text-xs">
              {activePaymentTab === "card" && (
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    Instant Card / Online Checkout
                  </h4>
                  <p className="text-slate-400 text-xs mb-4">
                    Pay securely via Stripe / Razorpay using Visa, Mastercard, AMEX, or international cards.
                  </p>

                  {invoice.paymentLink ? (
                    <a
                      href={invoice.paymentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90 text-slate-950 font-sans font-bold text-xs rounded-xl shadow-lg transition-all"
                    >
                      <span>Pay {invoice.depositAmount} Deposit Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400">
                      Payment link is being processed. Please use the UPI, PayPal, or Wire transfer tabs below.
                    </div>
                  )}
                </div>
              )}

              {activePaymentTab === "upi" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    Direct UPI &amp; Domestic Bank Transfer (Zero Transaction Fee)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">UPI ID (GPay / PhonePe / Paytm / BHIM)</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-emerald-400">mithun.here01@okaxis</span>
                        <button
                          onClick={() => handleCopy("mithun.here01@okaxis", "upi")}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-md text-[10px] text-slate-300"
                        >
                          {copiedText === "upi" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">Account Holder</span>
                      <div className="text-sm font-bold text-white mt-1">MITHUN DAS</div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-slate-300 text-[11px]">
                    💡 <strong>Note:</strong> Mention Invoice Reference ID <strong>{invoice.invoiceId}</strong> in the payment remarks/notes.
                  </div>
                </div>
              )}

              {activePaymentTab === "paypal" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Global PayPal &amp; Wise Direct Transfer
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">PayPal Payment Link</span>
                      <div className="mt-2">
                        <a
                          href="https://paypal.me/MithunzDas"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-cyan-400 font-bold hover:underline"
                        >
                          <span>paypal.me/MithunzDas</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">Wise Account (USD / EUR / GBP)</span>
                      <div className="text-slate-300 text-xs mt-1">Available upon request (0.4% fee)</div>
                    </div>
                  </div>

                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-slate-300 text-[11px]">
                    💡 <strong>Note:</strong> Include Invoice ID <strong>{invoice.invoiceId}</strong> in your transfer note.
                  </div>
                </div>
              )}

              {activePaymentTab === "wire" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    Direct International Wire Transfer &amp; Crypto
                  </h4>

                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">SWIFT / Bank Wire:</span>
                      <div className="text-slate-200 mt-0.5">Contact mithun@mithundas.cloud for official SWIFT/IBAN wire instructions.</div>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase">Crypto (USDT / TRC20):</span>
                      <div className="text-slate-200 mt-0.5">USDT TRC20 wallet address available on request.</div>
                    </div>
                  </div>
                </div>
              )}

              {/* UTR / Payment Reference Submission Form for manual payments */}
              {activePaymentTab !== "card" && (
                <div className="mt-6 pt-6 border-t border-slate-800 font-mono">
                  <h5 className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Submit Payment UTR / Transaction Reference for Verification
                  </h5>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Paid via UPI, Wise, PayPal, or Bank Transfer? Enter your UTR reference number or Cash receipt note below to notify admin for instant verification.
                  </p>

                  {utrNotice && (
                    <div className={`p-3 rounded-xl text-xs font-mono mb-3 flex items-center justify-between ${
                      utrNotice.type === "error" ? "bg-rose-500/10 border border-rose-500/30 text-rose-400" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    }`}>
                      <span>{utrNotice.text}</span>
                      <button onClick={() => setUtrNotice(null)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleUtrSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      value={utrInput}
                      onChange={(e) => setUtrInput(e.target.value)}
                      placeholder="Enter 12-digit UTR #, Txn ID, or Cash Ref..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                      required
                    />
                    <input
                      type="text"
                      value={utrAmountInput}
                      onChange={(e) => setUtrAmountInput(e.target.value)}
                      placeholder={`Amount paid (${invoice.currencySymbol || "$"})...`}
                      className="w-full sm:w-44 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                      required
                    />
                    <button
                      type="submit"
                      disabled={submittingUtr}
                      className="w-full sm:w-auto shrink-0 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-slate-950 font-bold text-xs rounded-xl font-sans transition-all disabled:opacity-50"
                    >
                      {submittingUtr ? "Submitting..." : "Submit UTR Reference"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Guarantee & Security */}
        <div className="mt-10 pt-6 border-t border-slate-800 print:border-slate-300 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] text-slate-400 print:text-slate-600">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-cyan-400 print:text-slate-600" />
            <span>256-bit SSL Encrypted Digital Invoice</span>
          </div>

          <div>
            Questions? Contact <a href="mailto:mithun@mithundas.cloud" className="text-cyan-400 print:text-slate-900 underline">mithun@mithundas.cloud</a>
          </div>
        </div>
      </div>
    </main>
  );
}
