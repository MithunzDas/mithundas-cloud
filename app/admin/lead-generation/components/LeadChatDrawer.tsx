"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Phone,
  ExternalLink,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface LeadMessage {
  id: string;
  sender: "CLIENT" | "ADMIN" | string;
  direction: "INBOUND" | "OUTBOUND" | string;
  channel: string;
  messageText: string;
  status: string;
  wamid?: string;
  createdAt: string;
}

interface LeadChatDrawerProps {
  leadId: string | null;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export default function LeadChatDrawer({
  leadId,
  onClose,
  onStatusUpdated
}: LeadChatDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [lead, setLead] = useState<any>(null);
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [is24hActive, setIs24hActive] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pillsContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const quickReplies = [
    { label: "💰 Package Pricing", text: "Hello! Our custom website package starts at ₹3,999 with 1-year high-speed hosting, custom domain, and mobile-friendly design included. Would you like to see a sample?" },
    { label: "🎥 2-Min Demo Video", text: "Hi! Did you get a chance to view the 2-minute live demo video we shared earlier for your business?" },
    { label: "📞 5-Min Walkthrough Call", text: "What is a convenient time today or tomorrow for a quick 5-minute walkthrough call?" },
    { label: "🩺 Doctor/Clinic Features", text: "Yes! Our clinic websites feature 1-click WhatsApp appointment booking, Google Map directions, doctor profiles, and patient reviews." },
    { label: "⚖️ Legal Practice Features", text: "Yes! Our advocate websites include professional court profiles, case consultation booking, and direct contact forms." },
    { label: "🏨 Restaurant & Menu Features", text: "Yes! Our restaurant websites include digital food menus, table reservation inquiries, and direct WhatsApp ordering." },
    { label: "🚀 Ready to Launch", text: "We can have your live website up and running within 48 to 72 hours. Should I share the onboarding details?" }
  ];

  // Fetch conversation history
  const fetchChat = async (silent = false) => {
    if (!leadId) return;
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/admin/lead-generation/chat?leadId=${leadId}`);
      const data = await res.json();
      if (data.success) {
        setLead(data.lead);
        setMessages(data.messages || []);
        setIs24hActive(data.is24hWindowActive);
        setRemainingMinutes(data.remainingMinutes || 0);
      } else {
        setErrorMessage(data.error || "Failed to load messages");
      }
    } catch (err: any) {
      if (!silent) setErrorMessage(err.message || "Network error loading chat");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchChat();
      const interval = setInterval(() => {
        fetchChat(true);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [leadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!leadId) return null;

  // Smooth Horizontal Scrolling Handlers for PC/Desktop/Tablet
  const handleScrollPills = (direction: "left" | "right") => {
    if (pillsContainerRef.current) {
      pillsContainerRef.current.scrollBy({
        left: direction === "left" ? -240 : 240,
        behavior: "smooth"
      });
    }
  };

  const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (pillsContainerRef.current && e.deltaY !== 0) {
      e.preventDefault();
      pillsContainerRef.current.scrollLeft += e.deltaY * 0.9;
    }
  };

  // Mouse Drag to Scroll for Desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pillsContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - pillsContainerRef.current.offsetLeft);
    setScrollLeftState(pillsContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !pillsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - pillsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    pillsContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || sending) return;

    setSending(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const res = await fetch("/api/admin/lead-generation/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          messageText: inputText.trim()
        })
      });

      const data = await res.json();

      if (data.success) {
        setInputText("");
        setSuccessNotice("Message delivered via Meta WhatsApp Cloud API (+91 82509 68170)");
        setMessages((prev) => [...prev, data.message]);
        if (onStatusUpdated) onStatusUpdated();
        setTimeout(() => setSuccessNotice(null), 4000);
      } else {
        if (data.error === "OUTSIDE_24H_WINDOW") {
          setErrorMessage(
            "⏱️ 24h Window Closed: Client last replied more than 24 hours ago. Meta requires a template message or personal WhatsApp follow-up."
          );
        } else {
          setErrorMessage(data.details || data.error || "Failed to send message via Meta API");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error sending message");
    } finally {
      setSending(false);
    }
  };

  const cleanPhone = (lead?.whatsappNumber || lead?.phone || "").replace(/\D/g, "");
  const waMeUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(inputText || "Hello! Following up from our website demo.")}`;

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatWindowRemaining = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours > 0) return `${hours}h ${m}m remaining`;
    return `${m}m remaining`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm transition-opacity duration-300">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Main Drawer Panel - Responsive width for desktop & tablets */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
              {lead?.businessName ? lead.businessName.charAt(0).toUpperCase() : "C"}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">
                {lead?.businessName || "Client Conversation"}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="truncate">{lead?.city || "West Bengal"}</span>
                <span>•</span>
                <span className="font-mono text-slate-300">+{cleanPhone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => fetchChat()}
              title="Refresh conversation"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href={`tel:+${cleanPhone}`}
              title="Call phone"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={waMeUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Personal WhatsApp (wa.me)"
              className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              title="Close drawer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 24-Hour Window Banner */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
          {is24hActive ? (
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>24h Free Chat Active: {formatWindowRemaining(remainingMinutes)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Outside 24h Window (Meta template or Personal WhatsApp)</span>
            </div>
          )}

          <span className="text-[11px] text-slate-500 font-mono">
            API: +91 82509 68170
          </span>
        </div>

        {/* Error / Notice Alerts */}
        {errorMessage && (
          <div className="m-3 p-3 rounded-lg bg-red-950/80 border border-red-800/80 text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {successNotice && (
          <div className="m-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1">{successNotice}</span>
          </div>
        )}

        {/* Message Stream Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
              <span>Loading conversation history...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 text-xs text-center p-6">
              <MessageCircle className="w-8 h-8 text-slate-600 mb-1" />
              <p className="font-semibold text-slate-300">No message history yet</p>
              <p className="text-slate-500 max-w-xs">
                Send an outreach message or template to begin chatting with this prospect.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOutbound = msg.direction === "OUTBOUND" || msg.sender === "ADMIN";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isOutbound ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-md text-xs leading-relaxed ${
                      isOutbound
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs"
                        : "bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-xs"
                    }`}
                  >
                    {!isOutbound && (
                      <div className="text-[10px] font-semibold text-emerald-400 mb-1">
                        {lead?.businessName || "Client"}
                      </div>
                    )}

                    <div className="whitespace-pre-wrap break-words">{msg.messageText}</div>

                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isOutbound ? "text-emerald-200/80" : "text-slate-400"
                      }`}
                    >
                      <span>{formatTime(msg.createdAt)}</span>
                      {isOutbound && (
                        <span>
                          {msg.status === "READ" ? (
                            <span title="Read by recipient"><CheckCheck className="w-3.5 h-3.5 text-cyan-300 inline" /></span>
                          ) : msg.status === "DELIVERED" ? (
                            <span title="Delivered to device"><CheckCheck className="w-3.5 h-3.5 text-emerald-200 inline" /></span>
                          ) : msg.status === "FAILED" ? (
                            <span title="Delivery blocked: Customer 24h window closed" className="inline-flex items-center gap-1 text-rose-400 font-medium">
                              <AlertCircle className="w-3.5 h-3.5 inline" />
                              <span className="text-[9px]">Failed</span>
                            </span>
                          ) : (
                            <span title="Sent to WhatsApp network"><Check className="w-3.5 h-3.5 text-emerald-300 inline" /></span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Pills with Smooth Horizontal Scrolling for Desktop/Tablet */}
        <div className="px-3.5 py-2.5 bg-slate-900/95 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Replies (Click to Insert)</span>
            </div>

            {/* Desktop Navigation Scroll Controls */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleScrollPills("left")}
                className="w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Scroll left"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollPills("right")}
                className="w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Scroll right"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Smooth Horizontal Scroll Track */}
          <div
            ref={pillsContainerRef}
            onWheel={handleWheelScroll}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            className="flex gap-2 overflow-x-auto pb-2 scroll-smooth select-none cursor-grab active:cursor-grabbing [scrollbar-width:thin] [scrollbar-color:#334155_#0f172a]"
          >
            {quickReplies.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(pill.text)}
                className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700/90 hover:border-emerald-500/50 text-slate-200 hover:text-white transition-all shadow-sm active:scale-95 shrink-0 flex items-center gap-1"
                title={pill.text}
              >
                <span>{pill.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input & Action Area with comfortable padding */}
        <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex flex-col gap-2.5 pb-5">
          <div className="flex gap-2 items-end">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={2}
              placeholder={
                is24hActive
                  ? "Type your reply... (Enter to send via +91 82509 68170)"
                  : "Type your reply... (24h window closed - use Personal WhatsApp or approved template)"
              }
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed"
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !inputText.trim()}
              className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all shrink-0"
            >
              {sending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Send</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Zap className="w-3 h-3 text-emerald-400" />
              Direct Meta Cloud API (+91 82509 68170)
            </span>
            <a
              href={waMeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Chat via Personal WhatsApp (wa.me)
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
