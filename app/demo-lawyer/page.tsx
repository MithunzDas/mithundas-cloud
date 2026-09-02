"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Scale,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Star,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Send,
  Bot,
  User,
  Activity,
  Award,
  ChevronRight,
  Shield,
  FileText,
  Briefcase,
  Gavel,
  BookOpen,
  ClipboardList,
  Building2,
  AlertCircle,
  ExternalLink
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  quickReplies?: string[];
}

const PRACTICE_AREAS = [
  "⚖️ Criminal Defense & Urgent Bail (BNSS / CrPC)",
  "📜 Land, Flat & Property Dispute Resolution",
  "💍 Matrimonial, Divorce & Child Custody",
  "🏢 Corporate Law, Contracts & Commercial Agreements",
  "🚫 Cheque Bounce (Sec 138 NI Act) & Debt Recovery",
  "🏛️ Calcutta High Court Writ Petitions & Appeals",
  "📑 Deed Drafting, Will, Gift & Power of Attorney",
  "🛡️ Anticipatory Bail & Police Station Representation",
  "💻 Cyber Crime, Financial Fraud & IT Act Disputes",
  "🛒 Consumer Forum & Medical Negligence Disputes",
  "💼 Labor, Employment & Industrial Dispute Matters",
  "🔍 Title Verification & Property Search Report",
  "🚨 Immediate Legal Emergency / 24/7 Arrest Aid"
];

const CONSULTATION_SLOTS = [
  "🌅 10:30 AM – 01:00 PM IST (Morning Court Chamber)",
  "☀️ 02:00 PM – 04:30 PM IST (Afternoon High Court Slot)",
  "🌇 05:30 PM – 07:30 PM IST (Evening Office Chamber)",
  "🌙 08:00 PM – 09:30 PM IST (Online Video / Phone Consult)"
];

const URGENCY_LEVELS = [
  "🚨 Urgent Legal Emergency (Within 24 Hours / Bail)",
  "⚡ High Priority Matter (Next 2-3 Days)",
  "📅 Routine Legal Consultation & Document Review"
];

const SERVICES = [
  {
    icon: Gavel,
    title: "Criminal Defense & Bail",
    desc: "Anticipatory & regular bail hearings under BNSS / CrPC across District & High Courts.",
    fee: "From ₹2,499",
    tag: "High Urgency",
    color: "from-amber-500 to-yellow-600",
    key: "⚖️ Criminal Defense & Urgent Bail (BNSS / CrPC)"
  },
  {
    icon: Building2,
    title: "Property & Land Disputes",
    desc: "Title search reports, partition suits, illegal possession, and registry legal vetting.",
    fee: "From ₹1,999",
    tag: "Most Requested",
    color: "from-amber-400 to-orange-500",
    key: "📜 Land, Flat & Property Dispute Resolution"
  },
  {
    icon: ShieldCheck,
    title: "Matrimonial & Family Law",
    desc: "Mutual divorce, maintenance, domestic violence protection & child custody counseling.",
    fee: "From ₹1,499",
    tag: "Confidential",
    color: "from-rose-400 to-amber-500",
    key: "💍 Matrimonial, Divorce & Child Custody"
  },
  {
    icon: FileText,
    title: "Cheque Bounce (NI Act 138)",
    desc: "Legal demand notices, summary recovery suits, and trial litigation representation.",
    fee: "From ₹1,499",
    tag: "Fast Track",
    color: "from-yellow-400 to-amber-600",
    key: "🚫 Cheque Bounce (Sec 138 NI Act) & Debt Recovery"
  },
  {
    icon: Scale,
    title: "High Court Writs & Appeals",
    desc: "Constitutional writ petitions under Article 226/227 and civil/criminal first appeals.",
    fee: "Case Based",
    tag: "Senior Counsel",
    color: "from-amber-300 to-yellow-500",
    key: "🏛️ Calcutta High Court Writ Petitions & Appeals"
  },
  {
    icon: BookOpen,
    title: "Deed & Agreement Drafting",
    desc: "Sale agreements, commercial lease, wills, gift deeds & employment contract vetting.",
    fee: "From ₹999",
    tag: "Same-Day Delivery",
    color: "from-amber-500 to-orange-600",
    key: "📑 Deed Drafting, Will, Gift & Power of Attorney"
  }
];

const SENIOR_ADVOCATES = [
  {
    name: "Adv. Souvik Mukherjee, LL.M.",
    title: "Senior Advocate & Criminal Defense Counsel",
    court: "Calcutta High Court & Barasat District Court",
    exp: "18+ Yrs Legal Practice • 2,400+ Cases Represented",
    rating: "4.96 (380+ Reviews)",
    badge: "Trial Specialist"
  },
  {
    name: "Adv. Moumita Sen, B.A. LL.B (Hons)",
    title: "Civil, Matrimonial & Property Law Specialist",
    court: "Barasat & Alipore District Court",
    exp: "12+ Yrs Experience • Land Dispute Arbitrator",
    rating: "4.92 (290+ Reviews)",
    badge: "Property Expert"
  }
];

const REVIEWS = [
  {
    author: "Subir Chakraborty",
    location: "Barasat",
    rating: 5,
    text: "Got anticipatory bail granted in record time before the Sessions Court. Dr. Mukherjee explained the entire BNSS process transparently with no hidden fees.",
    matter: "Anticipatory Bail"
  },
  {
    author: "Pradip Kumar Dey",
    location: "Kolkata",
    rating: 5,
    text: "The property search and title verification report saved me from buying an encumbered land parcel in Madhyamgram. Exceptional legal due diligence!",
    matter: "Property Due Diligence"
  },
  {
    author: "Anindita Roy",
    location: "Habra",
    rating: 5,
    text: "Booking the consultation on WhatsApp took 30 seconds. Adv. Sen listened patiently and resolved our family partition amicably out of court.",
    matter: "Family Settlement"
  }
];

// Helper: Convert YYYY-MM-DD to DD-MM-YYYY
function formatToDDMMYYYY(isoDate: string): string {
  if (!isoDate) return "";
  const parts = isoDate.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d}-${m}-${y}`;
  }
  return isoDate;
}

export default function LawyerDemoPage() {
  const [activeTab, setActiveTab] = useState<"form" | "ai">("form");

  // Form State
  const [clientName, setClientName] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [selectedPracticeArea, setSelectedPracticeArea] = useState(PRACTICE_AREAS[0]);
  const [selectedUrgency, setSelectedUrgency] = useState(URGENCY_LEVELS[1]);

  const todayStr = new Date().toISOString().split("T")[0];
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(CONSULTATION_SLOTS[2]);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const displayDateDDMMYYYY = formatToDDMMYYYY(appointmentDate);

  // AI Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! 🙏 Welcome to Apex Chambers of Law. I am the 24/7 AI Legal Assistant. How can we assist you with your legal matter today?",
      time: "Just now",
      quickReplies: [
        "⚖️ Book Legal Consultation",
        "🚨 Urgent Bail / Police Help",
        "📜 Property & Land Dispute",
        "📍 Chamber Locations & Fees"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, activeTab]);

  // Generate Doctor / Advocate WhatsApp Message
  const buildWhatsAppUrl = () => {
    const name = clientName || "Prospective Client";
    const city = clientCity || "West Bengal";
    const dateFormatted = formatToDDMMYYYY(appointmentDate);

    const formattedMsg =
      "⚖️ *NEW LEGAL CONSULTATION REQUEST*\n" +
      "━━━━━━━━━━━━━━━━━━━━\n" +
      "👤 *Client Name:* " + name + "\n" +
      "📍 *Location:* " + city + "\n" +
      "📜 *Matter Category:* " + selectedPracticeArea + "\n" +
      "🚨 *Urgency:* " + selectedUrgency + "\n" +
      "📅 *Preferred Date:* " + dateFormatted + " (DD-MM-YYYY)\n" +
      "⏰ *Preferred Slot:* " + selectedSlot + "\n" +
      "🏛️ *Chamber:* Apex Legal Chambers (High Court & District Court)\n" +
      "━━━━━━━━━━━━━━━━━━━━\n" +
      "_Please confirm appointment slot with Senior Advocate. Thank you!_";

    return "https://wa.me/918768138086?text=" + encodeURIComponent(formattedMsg);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(buildWhatsAppUrl(), "_blank");
  };

  const handleSelectServiceQuickBook = (key: string) => {
    setSelectedPracticeArea(key);
    setActiveTab("form");
    const el = document.getElementById("booking-engine");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let botReply = "";
      let replies: string[] = [];
      const lower = text.toLowerCase();

      if (lower.includes("bail") || lower.includes("police") || lower.includes("arrest") || lower.includes("emergency")) {
        botReply = "🚨 Urgent Legal Matter Flagged! For urgent anticipatory bail (under BNSS / CrPC) or police station notice (Sec 41A), our senior criminal defense counsel is available 24/7. Click below to connect immediately:";
        replies = ["📞 Call Advocate Directly", "💬 Immediate WhatsApp Bail Help"];
      } else if (lower.includes("property") || lower.includes("land") || lower.includes("deed") || lower.includes("flat")) {
        botReply = "Property Matters Handled:\n• 30-Year Chain Deed & Search Report\n• Partition Suits & Mutation Disputes\n• Sale Agreement Drafting & Power of Attorney\n• Encroachment & Injunction Suits";
        replies = ["📅 Book Property Consult", "📜 Request Deed Vetting"];
      } else if (lower.includes("fee") || lower.includes("cost") || lower.includes("price") || lower.includes("charge")) {
        botReply = "Transparent Chamber Consultation Fees:\n• Legal Consultation (45 mins): ₹1,499\n• Document Vetting & Legal Opinion: ₹1,999\n• Court Filing & Litigation: Customized based on jurisdiction & case scope.\nZero hidden fees!";
        replies = ["📅 Book ₹1,499 Consultation", "💬 WhatsApp for Quote"];
      } else if (lower.includes("chamber") || lower.includes("address") || lower.includes("court") || lower.includes("location")) {
        botReply = "🏛️ Chamber Locations:\n1. Calcutta High Court Chamber: Temple Chambers, Old Post Office Street, Kolkata\n2. Barasat Court Chamber: Opp. District & Sessions Court, Barasat\n⏰ Chamber Hours: Mon - Sat, 10:00 AM - 8:30 PM IST.";
        replies = ["📅 Book Visit", "📍 Get GPS Direction"];
      } else {
        botReply = "Thank you. Your legal inquiry has been registered. Our senior advocate will review your matter and contact you via WhatsApp shortly!";
        replies = ["📅 Book Consultation Now", "⭐ View Real Client Reviews"];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          quickReplies: replies
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleCallDirect = () => {
    window.location.href = "tel:+918768138086";
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden antialiased">
      
      {/* 🔴 TOP AGENCY DEMO BANNER */}
      <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-amber-950/95 via-slate-950/95 to-stone-950/95 backdrop-blur-xl border-b border-amber-500/30 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <p className="text-[11px] sm:text-xs font-mono text-amber-200 truncate">
            <span className="font-bold text-white">Live Showcase:</span> Apex Chambers of Law &amp; Legal Intake System
          </p>
        </div>
        <Link
          href="https://wa.me/918768138086?text=Hi%20Mithun,%20I%20want%20a%20website%20like%20Apex%20Law%20Chambers%20for%20my%20legal%20practice!"
          target="_blank"
          className="flex-shrink-0 px-2.5 sm:px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold text-[10px] sm:text-xs font-mono hover:scale-105 transition-transform flex items-center gap-1 shadow-lg shadow-amber-500/20"
        >
          <span>Get Yours ₹2,999/-</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* HEADER NAVIGATION (Pixel-Perfect Mobile Responsive) */}
      <header className="pt-14 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 max-w-7xl mx-auto flex items-center justify-between border-b border-amber-950/60 relative z-30">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-black font-black text-base sm:text-xl shadow-lg shadow-amber-500/20 flex-shrink-0">
            ⚖️
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-base font-black tracking-tight text-white truncate">
                APEX LAW CHAMBERS
              </h1>
              <span className="hidden xs:inline-flex text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                HIGH COURT &amp; SESSIONS
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-amber-400/70 font-mono flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
              <span className="truncate">Calcutta High Court • Barasat • Kolkata</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={handleCallDirect}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-amber-900/40 hover:border-amber-700 text-amber-200 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5"
            title="Call Advocate Directly"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">+91 87681 38086</span>
          </button>
          <a
            href="#booking-engine"
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold text-xs font-mono tracking-wide shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <Gavel className="w-3.5 h-3.5 fill-black text-black" />
            <span>Consult Advocate</span>
          </a>
        </div>
      </header>

      {/* HERO SECTION WITH LEGAL CONSULTATION ENGINE */}
      <section id="booking-engine" className="px-3 sm:px-6 pt-6 sm:pt-10 pb-10 sm:pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Pitch */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-mono font-medium">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Advocates &amp; Senior Legal Consultants</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Strategic Defense.{" "}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Uncompromising Justice.
              </span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Trusted legal representation across Calcutta High Court, Barasat Sessions Court, and City Civil Courts. 1-Tap WhatsApp consultation booking, immediate bail intervention, and comprehensive land due diligence.
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-1 max-w-lg mx-auto lg:mx-0">
              <div className="bg-slate-900/80 border border-amber-900/40 rounded-2xl p-2.5 sm:p-3 text-center">
                <p className="text-base sm:text-xl font-black text-amber-400 font-mono">2,400+</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono">Cases Handled</p>
              </div>
              <div className="bg-slate-900/80 border border-amber-900/40 rounded-2xl p-2.5 sm:p-3 text-center">
                <p className="text-base sm:text-xl font-black text-emerald-400 font-mono">18+ Yrs</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono">Experience</p>
              </div>
              <div className="bg-slate-900/80 border border-amber-900/40 rounded-2xl p-2.5 sm:p-3 text-center">
                <p className="text-base sm:text-xl font-black text-yellow-300 font-mono">100%</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono">Confidential</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Immediate 24/7 urgent bail &amp; police station legal aid</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>30-Year certified title search report for land &amp; flat purchases</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Direct consultation with Senior High Court practicing counsel</span>
              </div>
            </div>
          </div>

          {/* Right Column: LEGAL CONSULTATION ENGINE */}
          <div className="lg:col-span-6">
            <div className="bg-[#090d18] border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-amber-500/10 backdrop-blur-xl relative">
              
              {/* Tab Selector Bar */}
              <div className="flex items-center justify-between p-1 bg-slate-950/80 border border-slate-800 rounded-2xl mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === "form"
                      ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>1-Tap WhatsApp Booking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === "ai"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>24/7 AI Legal Assistant</span>
                </button>
              </div>

              {/* TAB 1: LEGAL INTAKE FORM */}
              {activeTab === "form" ? (
                <form onSubmit={handleFormSubmit} className="space-y-3.5 text-left">
                  
                  {/* Row 1: Client Name + City/Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <User className="w-3 h-3 text-amber-400" />
                        <span>Client Full Name:</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Anirban Mukherjee"
                        className="w-full bg-[#050812] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>Your City / District:</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={clientCity}
                        onChange={(e) => setClientCity(e.target.value)}
                        placeholder="e.g. Barasat, Kolkata, Habra"
                        className="w-full bg-[#050812] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Practice Area Dropdown */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <ClipboardList className="w-3 h-3 text-amber-400" />
                      <span>Select Legal Matter / Practice Area:</span>
                    </label>
                    <select
                      value={selectedPracticeArea}
                      onChange={(e) => setSelectedPracticeArea(e.target.value)}
                      className="w-full bg-[#050812] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                    >
                      {PRACTICE_AREAS.map((prob, idx) => (
                        <option key={idx} value={prob} className="bg-slate-950 text-slate-200">
                          {prob}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Urgency Level */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                      <span>Matter Urgency Level:</span>
                    </label>
                    <select
                      value={selectedUrgency}
                      onChange={(e) => setSelectedUrgency(e.target.value)}
                      className="w-full bg-[#050812] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                    >
                      {URGENCY_LEVELS.map((urg, idx) => (
                        <option key={idx} value={urg} className="bg-slate-950 text-slate-200">
                          {urg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Appointment Date (DD-MM-YYYY format + Past Dates Disabled) & Time Slot in IST */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>Consultation Date:</span>
                        </label>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                          {displayDateDDMMYYYY}
                        </span>
                      </div>

                      <div className="relative flex items-center">
                        <input
                          ref={dateInputRef}
                          type="date"
                          required
                          min={todayStr}
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          className="w-full bg-[#050812] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white [color-scheme:dark] focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            try { dateInputRef.current?.showPicker(); } catch (e) { dateInputRef.current?.focus(); }
                          }}
                          className="absolute right-3 p-1 rounded text-amber-400 hover:text-amber-300 pointer-events-auto"
                          title="Click to Open Calendar"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">Format: DD-MM-YYYY (Past dates disabled)</p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>Chamber Slot (IST):</span>
                      </label>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full bg-[#050812] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                      >
                        {CONSULTATION_SLOTS.map((slot, idx) => (
                          <option key={idx} value={slot} className="bg-slate-950 text-slate-200">
                            {slot}
                          </option>
                        ))}
                      </select>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">All slots in Indian Standard Time (IST)</p>
                    </div>
                  </div>

                  {/* Auto-Filled WhatsApp Live Message Preview Box */}
                  <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>Auto-Filled Legal Consultation Dispatch:</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Chamber Dispatch
                      </span>
                    </div>

                    <div className="bg-[#040711] border border-slate-800 rounded-xl p-2.5 text-[11px] font-mono text-slate-300 whitespace-pre-line leading-relaxed">
                      {"⚖️ *NEW LEGAL CONSULTATION REQUEST*\n" +
                        "👤 Client: " + (clientName || "[Client Name]") + " (" + (clientCity || "[City]") + ")\n" +
                        "📜 Matter: " + selectedPracticeArea + "\n" +
                        "📅 Date: " + displayDateDDMMYYYY + " | Slot: " + selectedSlot.split("(")[0]}
                    </div>
                  </div>

                  {/* Glowing 1-Click WhatsApp Action Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold text-xs sm:text-sm font-mono tracking-wide shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-black" />
                    <span>Confirm Consultation via WhatsApp (+91 87681 38086)</span>
                  </button>
                </form>
              ) : (
                /* TAB 2: 24/7 AI LEGAL ASSISTANT CHAT */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                          <Bot className="w-4 h-4" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Apex Legal Assistant</h4>
                        <p className="text-[9px] text-slate-400 font-mono">Answers bail, property law &amp; chamber fees</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      ONLINE
                    </span>
                  </div>

                  {/* Chat Box */}
                  <div className="space-y-2.5 h-[230px] overflow-y-auto pr-1 text-xs scrollbar-thin scrollbar-thumb-slate-800">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl px-3 py-2 ${
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold shadow-md"
                              : "bg-slate-900/90 border border-slate-800 text-slate-200"
                          }`}
                        >
                          <p className="whitespace-pre-line text-[11px] leading-relaxed">{msg.text}</p>
                          <span className="text-[9px] block mt-0.5 opacity-70">{msg.time}</span>
                        </div>

                        {msg.quickReplies && msg.quickReplies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5 max-w-[95%]">
                            {msg.quickReplies.map((reply, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(reply)}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all text-left"
                              >
                                {reply}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 text-[10px] font-mono w-20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                        <span>Typing...</span>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Chat Input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="pt-2 border-t border-slate-800 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask bail, property dispute, fees..."
                      className="flex-1 bg-[#050812] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:scale-105 active:scale-95 transition-transform"
                    >
                      <Send className="w-3.5 h-3.5 fill-black" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS GRID */}
      <section className="px-3 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-amber-400 text-xs font-mono uppercase tracking-widest font-bold">
            Legal Practice Areas
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Comprehensive Legal Representation
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Dedicated trial and appellate advocacy across all West Bengal and Supreme Court jurisdictions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {SERVICES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-[#090d18] border border-slate-800/80 hover:border-amber-500/40 rounded-3xl p-4 sm:p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-black shadow-lg`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                      {s.tag}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-mono font-bold text-amber-400">
                    {s.fee}
                  </span>
                  <button
                    onClick={() => handleSelectServiceQuickBook(s.key)}
                    className="text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Consult Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SENIOR COUNSELS & ADVOCATES */}
      <section className="px-3 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto border-t border-slate-900 bg-slate-950/40 rounded-3xl my-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-amber-400 text-xs font-mono uppercase tracking-widest font-bold">
            Legal Leadership
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Meet Our Senior Counsel
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Over 30+ combined years of courtroom excellence and judicial advocacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {SENIOR_ADVOCATES.map((adv, idx) => (
            <div
              key={idx}
              className="bg-[#090d18] border border-slate-800 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-amber-500/30 transition-all"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-black font-bold text-2xl flex-shrink-0 shadow-lg">
                👨‍⚖️
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white">{adv.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {adv.badge}
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 font-medium">{adv.title}</p>
                <p className="text-[11px] text-slate-400 font-mono">{adv.court}</p>
                <p className="text-[11px] text-slate-500 font-mono">{adv.exp}</p>
                <p className="text-[11px] text-amber-400 font-mono font-bold flex items-center gap-1 pt-0.5">
                  <span>★</span>
                  <span>{adv.rating}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="px-3 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest font-bold">
            Client Testimonials
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Trusted by Individuals &amp; Corporates
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Real client feedback from Barasat, Kolkata &amp; High Court representations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#090d18] border border-slate-800 rounded-3xl p-4 sm:p-6 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(rev.rating)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {rev.matter}
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{rev.author}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{rev.location}</p>
                </div>
                <span className="text-[10px] font-mono text-amber-400">Verified Client</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🟢 AGENCY BOTTOM CONVERSION CARD (CTA) */}
      <section className="px-3 sm:px-6 py-12 sm:py-16 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-stone-950 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              ⚡ GROW YOUR LAW CHAMBER WITH AUTOMATED WHATSAPP INTAKE
            </span>
            <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white max-w-2xl mx-auto leading-tight">
              Want this kind of customized high-speed mobile website + automated WhatsApp booking receptionist starting at ₹2,999/-?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal">
              Built and delivered in 24 hours. Includes custom domain, practice area WhatsApp consultation form, 24/7 AI legal assistant &amp; Google Maps SEO ranker.
            </p>
            <div className="pt-3">
              <Link
                href="https://wa.me/918768138086?text=Hi%20Mithun,%20I%20want%20this%20exact%20customized%20Lawyer/Advocate%20website%20starting%20at%20₹2,999/-!"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-extrabold text-xs sm:text-sm font-mono tracking-wide shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Claim Your Website on WhatsApp (+91 87681 38086)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 📱 STICKY MOBILE 1-TAP BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#040711]/95 backdrop-blur-2xl border-t border-amber-500/30 p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl">
        <button
          onClick={handleCallDirect}
          className="flex-1 py-2.5 px-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Call Chamber</span>
        </button>
        <a
          href="#booking-engine"
          className="flex-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
        >
          <Gavel className="w-3.5 h-3.5 fill-black" />
          <span>WhatsApp Consult</span>
        </a>
      </div>

      {/* FOOTER */}
      <footer className="pb-24 sm:pb-12 pt-8 text-center text-slate-500 text-xs font-mono border-t border-slate-900 px-4">
        <p>© 2026 Apex Chambers of Law. All rights reserved. Bar Council Compliance.</p>
        <p className="text-[10px] text-slate-600 mt-1">
          Designed &amp; Powered by Mithun Das Agency Automation Platform
        </p>
      </footer>
    </div>
  );
}
