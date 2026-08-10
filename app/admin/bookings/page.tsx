"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  Search,
  Filter,
  RefreshCw,
  X,
  FileText,
  Copy,
  Check,
  AlertCircle,
  Shield,
  Key,
  ChevronRight,
  User,
  Building,
  Mail,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AdminNav } from "../components/AdminNav";

interface BookingItem {
  id?: string;
  bookingId: string;
  name: string;
  email: string;
  company: string;
  businessType?: string;
  projectRequirement?: string;
  date: string;
  time: string;
  timeZone?: string;
  meetUrl: string;
  status?: string;
  createdAt?: string;
}

interface Metrics {
  totalBookings: number;
  confirmedCount: number;
  rescheduledCount: number;
  cancelledCount: number;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalBookings: 0,
    confirmedCount: 0,
    rescheduledCount: 0,
    cancelledCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBookingModal, setSelectedBookingModal] = useState<BookingItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const savedSecret = localStorage.getItem("mithundas_admin_secret");
    if (savedSecret) {
      setAdminSecret(savedSecret);
      fetchBookings(savedSecret);
    }
  }, []);

  const fetchBookings = async (secret: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        headers: {
          "x-admin-secret": secret,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setMetrics(
          data.metrics || {
            totalBookings: 0,
            confirmedCount: 0,
            rescheduledCount: 0,
            cancelledCount: 0,
          }
        );
        setIsAuthenticated(true);
        localStorage.setItem("mithundas_admin_secret", secret);
      } else {
        setIsAuthenticated(false);
        setNotification({ type: "error", text: "Invalid admin secret passphrase" });
      }
    } catch (err) {
      setIsAuthenticated(false);
      setNotification({ type: "error", text: "Failed to connect to admin bookings server" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminSecret.trim()) {
      fetchBookings(adminSecret.trim());
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm(`Are you sure you want to cancel booking reference ${bookingId}? This will free up the slot.`)) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await fetch("/api/admin/book/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ bookingId }),
      });

      if (res.ok) {
        setNotification({ type: "success", text: `Booking ${bookingId} successfully cancelled!` });
        fetchBookings(adminSecret);
      } else {
        setNotification({ type: "error", text: `Failed to cancel booking ${bookingId}` });
      }
    } catch (err) {
      setNotification({ type: "error", text: "Network error while cancelling booking" });
    } finally {
      setCancellingId(null);
    }
  };

  // Filter & Search Logic
  const filteredBookings = bookings.filter((item) => {
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.bookingId || "").toLowerCase().includes(searchQuery.toLowerCase());

    const itemStatus = item.status || "confirmed";
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "confirmed" && itemStatus === "confirmed") ||
      (statusFilter === "rescheduled" && itemStatus === "rescheduled") ||
      (statusFilter === "cancelled" && itemStatus === "cancelled");

    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#07090e] text-text-primary flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#0f1420] border border-border-app rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-cyan"></div>
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mb-4">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Admin Operations Authentication</h1>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Enter admin secret key to access Discovery Meetings Control Center
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
                  className="w-full bg-[#161d2c] border border-border-app rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-cyan font-mono"
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
              className="w-full bg-gradient-to-r from-brand-cyan to-brand-indigo text-white font-medium py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Authenticate & Access Operations"}
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
        {/* Top Action Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              Discovery Call Meetings
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-mono font-medium">
                {bookings.length} TOTAL SESSIONS
              </span>
            </h2>
            <p className="text-xs text-text-secondary font-mono mt-1">
              Live status, client project specifications, and session management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchBookings(adminSecret)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#121824] hover:bg-[#1a2334] border border-border-app rounded-xl text-xs font-mono text-text-secondary hover:text-text-primary transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-brand-cyan" : ""}`} />
              <span>Refresh Data</span>
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

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0f1420] border border-border-app rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-text-secondary uppercase">Active Confirmed Calls</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-400 font-mono">{metrics.confirmedCount}</div>
            <p className="text-[11px] text-text-secondary font-mono mt-1">Confirmed Discovery Sessions</p>
          </div>

          <div className="bg-[#0f1420] border border-border-app rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-text-secondary uppercase">Rescheduled Sessions</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <RotateCcw className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-400 font-mono">{metrics.rescheduledCount}</div>
            <p className="text-[11px] text-text-secondary font-mono mt-1">Client Shifted Time Slots</p>
          </div>

          <div className="bg-[#0f1420] border border-border-app rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-text-secondary uppercase">Cancelled Sessions</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-rose-400 font-mono">{metrics.cancelledCount}</div>
            <p className="text-[11px] text-text-secondary font-mono mt-1">Freed Time Slots</p>
          </div>

          <div className="bg-[#0f1420] border border-border-app rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-text-secondary uppercase">Total Discovery Intake</span>
              <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-brand-cyan font-mono">{metrics.totalBookings}</div>
            <p className="text-[11px] text-text-secondary font-mono mt-1">All Recorded Webhook Hits</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#0f1420] border border-border-app rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, email, company or INV-id..."
              className="w-full bg-[#161d2c] border border-border-app/80 rounded-xl pl-10 pr-4 py-2 text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-cyan font-mono"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-text-secondary hover:text-text-primary">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-mono text-text-secondary shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>

            {[
              { key: "all", label: "All Calls" },
              { key: "confirmed", label: "Active Confirmed" },
              { key: "rescheduled", label: "Rescheduled" },
              { key: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
                  statusFilter === tab.key
                    ? "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 font-semibold"
                    : "bg-[#161d2c] text-text-secondary hover:text-text-primary border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List Table */}
        <div className="bg-[#0f1420] border border-border-app rounded-2xl overflow-hidden shadow-xl">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-text-secondary/30 mx-auto mb-3" />
              <h3 className="text-sm font-mono text-text-secondary">No discovery session bookings match your filters</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-[#121824] border-b border-border-app text-text-secondary font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Client &amp; Company</th>
                    <th className="py-3.5 px-4">Date &amp; Time (IST / TZ)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Requirements / SOW</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-app/50">
                  {filteredBookings.map((item) => {
                    const status = item.status || "confirmed";
                    const isCancelled = status === "cancelled";
                    const isRescheduled = status === "rescheduled";

                    return (
                      <tr key={item.bookingId} className="hover:bg-[#131a29]/60 transition-colors">
                        {/* Reference ID */}
                        <td className="py-4 px-4 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-brand-cyan bg-brand-cyan/10 px-2 py-1 rounded-md border border-brand-cyan/20">
                              {item.bookingId}
                            </span>
                            <button
                              onClick={() => handleCopy(item.bookingId, item.bookingId)}
                              title="Copy Booking Reference"
                              className="text-text-secondary hover:text-text-primary p-1"
                            >
                              {copiedId === item.bookingId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        {/* Client & Company */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-text-primary flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                            <span>{item.name}</span>
                          </div>
                          <div className="text-text-secondary font-mono text-[11px] mt-0.5 flex items-center gap-1">
                            <Building className="w-3 h-3 shrink-0" />
                            <span>{item.company}</span>
                            {item.businessType && (
                              <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-text-secondary">
                                {item.businessType}
                              </span>
                            )}
                          </div>
                          <div className="text-text-secondary/70 font-mono text-[10px] mt-0.5 flex items-center gap-1">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span>{item.email || "No email"}</span>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-4 font-mono">
                          {item.date ? (
                            <>
                              <div className="text-text-primary font-bold flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                                <span>{item.date}</span>
                              </div>
                              <div className="text-brand-cyan text-[11px] flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 shrink-0" />
                                <span>{item.time} ({item.timeZone || "Asia/Kolkata"})</span>
                              </div>
                            </>
                          ) : (
                            <span className="text-text-secondary italic">Date pending</span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 font-mono">
                          {isCancelled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold">
                              <XCircle className="w-3 h-3" /> Cancelled
                            </span>
                          ) : isRescheduled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
                              <RotateCcw className="w-3 h-3" /> Rescheduled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> Confirmed
                            </span>
                          )}
                        </td>

                        {/* Project Requirement SOW button */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setSelectedBookingModal(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161d2c] hover:bg-[#1f293d] border border-border-app/80 rounded-lg text-xs font-mono text-brand-cyan hover:text-brand-cyan/80 transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View SOW / Requirements</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={item.meetUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-cyan to-brand-indigo text-white rounded-lg text-xs font-medium hover:opacity-90 transition-all shadow-sm"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Meeting</span>
                            </a>

                            {!isCancelled && (
                              <button
                                onClick={() => handleCancelBooking(item.bookingId)}
                                disabled={cancellingId === item.bookingId}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all"
                                title="Cancel Booking & Free Slot"
                              >
                                {cancellingId === item.bookingId ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <X className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
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

      {/* Project Requirements / SOW Detail Modal */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1420] border border-border-app rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="h-1 bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-cyan"></div>
            
            <div className="p-6 border-b border-border-app flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-brand-cyan font-bold bg-brand-cyan/10 border border-brand-cyan/30 px-2.5 py-1 rounded-full">
                  {selectedBookingModal.bookingId}
                </span>
                <h3 className="text-lg font-bold text-text-primary mt-2">
                  Project Specification / Requirements SOW
                </h3>
                <p className="text-xs text-text-secondary font-mono">
                  Submitted by {selectedBookingModal.name} ({selectedBookingModal.company})
                </p>
              </div>

              <button
                onClick={() => setSelectedBookingModal(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4 bg-[#141b2b] p-4 rounded-xl border border-border-app/80">
                <div>
                  <span className="text-[10px] text-text-secondary uppercase">Client Name</span>
                  <div className="text-sm font-bold text-text-primary mt-0.5">{selectedBookingModal.name}</div>
                </div>

                <div>
                  <span className="text-[10px] text-text-secondary uppercase">Company &amp; Industry</span>
                  <div className="text-sm font-bold text-text-primary mt-0.5">
                    {selectedBookingModal.company} ({selectedBookingModal.businessType || "General"})
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-text-secondary uppercase">Email Address</span>
                  <div className="text-sm font-bold text-brand-cyan mt-0.5">{selectedBookingModal.email || "N/A"}</div>
                </div>

                <div>
                  <span className="text-[10px] text-text-secondary uppercase">Scheduled Session</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {selectedBookingModal.date} @ {selectedBookingModal.time} ({selectedBookingModal.timeZone || "IST"})
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-text-secondary uppercase mb-2">Project Requirements / Statement of Work:</label>
                <div className="bg-[#141b2b] border border-border-app/80 rounded-xl p-4 text-text-primary whitespace-pre-wrap leading-relaxed">
                  {selectedBookingModal.projectRequirement || "No specific project requirements submitted."}
                </div>
              </div>

              <div className="bg-[#141b2b] p-4 rounded-xl border border-border-app/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-text-secondary uppercase">Custom Meeting Video Room:</span>
                  <div className="text-brand-cyan font-bold underline mt-0.5">{selectedBookingModal.meetUrl}</div>
                </div>

                <a
                  href={selectedBookingModal.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-brand-cyan to-brand-indigo text-white rounded-lg font-sans font-medium text-xs hover:opacity-90 transition-all shadow-sm"
                >
                  Launch Room
                </a>
              </div>
            </div>

            <div className="p-4 bg-[#121824] border-t border-border-app flex justify-end">
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="px-4 py-2 bg-[#1b2333] hover:bg-[#253045] text-text-primary rounded-xl text-xs font-mono transition-all"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
