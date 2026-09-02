"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
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
  Stethoscope,
  HeartPulse,
  Smile,
  Shield,
  Zap,
  ExternalLink,
  ClipboardList,
  Check,
  CalendarDays
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  quickReplies?: string[];
}

const DENTAL_PROBLEMS = [
  "🦷 Severe Toothache & Sensitivity",
  "⚡ Painless Root Canal Treatment (RCT)",
  "✨ Laser Teeth Whitening & Polishing",
  "🛡️ Invisible Braces & Clear Aligners",
  "💎 Titanium Dental Implants",
  "🧼 Ultrasonic Cleaning & Deep Scaling",
  "👑 Ceramic Dental Crowns & Bridges",
  "🧒 Kids Dental Cavity & Fluoride Care",
  "🩸 Bleeding Gums & Pyorrhea Care",
  "🦷 Wisdom Tooth Extraction & Surgery",
  "✨ Cosmetic Veneers & Smile Makeover",
  "🔍 Routine Dental Checkup & 3D X-Ray",
  "🚨 Emergency Dental Trauma / Pain Relief"
];

const TIME_SLOTS = [
  "🌅 10:00 AM – 11:30 AM IST (Morning)",
  "☀️ 12:30 PM – 02:00 PM IST (Afternoon)",
  "🌇 04:30 PM – 06:00 PM IST (Evening)",
  "🌙 07:00 PM – 08:30 PM IST (Night)"
];

const SERVICES = [
  {
    icon: Smile,
    title: "Painless Root Canal (RCT)",
    desc: "Single-sitting rotary endodontics with 3D digital apex locator precision.",
    price: "From ₹2,499",
    tag: "Most Popular",
    color: "from-cyan-500 to-blue-500",
    problemKey: "⚡ Painless Root Canal Treatment (RCT)"
  },
  {
    icon: Sparkles,
    title: "Laser Teeth Whitening",
    desc: "Instant 6-8 shade brightening in 45 minutes with advanced cold-light laser.",
    price: "From ₹1,999",
    tag: "Instant Glow",
    color: "from-emerald-400 to-teal-500",
    problemKey: "✨ Laser Teeth Whitening & Polishing"
  },
  {
    icon: Shield,
    title: "Invisible Dental Aligners",
    desc: "US FDA-cleared transparent braces. Zero food restrictions, 100% discreet.",
    price: "Free 3D Scan",
    tag: "Modern Ortho",
    color: "from-indigo-500 to-purple-500",
    problemKey: "🛡️ Invisible Braces & Clear Aligners"
  },
  {
    icon: Award,
    title: "Titanium Dental Implants",
    desc: "Permanent tooth replacement with Swiss & German lifelong warranty implants.",
    price: "EMI Available",
    tag: "Permanent Fix",
    color: "from-amber-400 to-orange-500",
    problemKey: "💎 Titanium Dental Implants"
  },
  {
    icon: HeartPulse,
    title: "Kids Dental Care (Pediatric)",
    desc: "Child-friendly clinic environment with painless cavity filling & fluoride therapy.",
    price: "From ₹799",
    tag: "Gentle Care",
    color: "from-pink-500 to-rose-500",
    problemKey: "🧒 Kids Dental Cavity & Fluoride Care"
  },
  {
    icon: Stethoscope,
    title: "Full Mouth Rehabilitation",
    desc: "Comprehensive smile makeover combining veneers, crowns, and gum contouring.",
    price: "Custom Plan",
    tag: "Complete Care",
    color: "from-blue-500 to-cyan-400",
    problemKey: "✨ Cosmetic Veneers & Smile Makeover"
  }
];

const DOCTORS = [
  {
    name: "Dr. Ananya Roy, MDS",
    title: "Chief Prosthodontist & Implantologist",
    exp: "14+ Yrs Experience • Ex-AIIMS",
    rating: "4.95 (420+ Reviews)",
    badge: "Smile Specialist"
  },
  {
    name: "Dr. Sourav Banerjee, BDS, MDS",
    title: "Orthodontist & Certified Aligner Specialist",
    exp: "11+ Yrs Experience • 1,200+ Cases",
    rating: "4.92 (310+ Reviews)",
    badge: "Invisalign Certified"
  }
];

const REVIEWS = [
  {
    author: "Rahul Mukherjee",
    location: "Barasat",
    rating: 5,
    text: "Booking via WhatsApp took literally 20 seconds. The root canal was completely painless and done in 45 mins. Truly world-class clinic!",
    treatment: "Single-Sitting RCT"
  },
  {
    author: "Debolina Sen",
    location: "Salt Lake, Kolkata",
    rating: 5,
    text: "Got my teeth whitening before my wedding. The results are unbelievable! Love the modern interior and automated WhatsApp reminders.",
    treatment: "Laser Whitening"
  },
  {
    author: "Subrata Ghosh",
    location: "Habra",
    rating: 5,
    text: "Dr. Roy explained the implant procedure thoroughly on 3D scan. No hidden charges and very clean hygiene standards.",
    treatment: "Titanium Implant"
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

export default function DentalClinicDemoPage() {
  // Clinical Demographics State
  const [activeTab, setActiveTab] = useState<"form" | "ai">("form");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("28");
  const [patientGender, setPatientGender] = useState("Male");
  const [selectedProblem, setSelectedProblem] = useState(DENTAL_PROBLEMS[0]);
  
  // Calculate today's date for disabling past dates (YYYY-MM-DD for native input)
  const todayStr = new Date().toISOString().split("T")[0];
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[2]);

  const dateInputRef = useRef<HTMLInputElement>(null);

  // Formatted date string in DD-MM-YYYY format
  const displayDateDDMMYYYY = formatToDDMMYYYY(appointmentDate);

  // AI Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! 🙏 Welcome to Apex Dental Clinic. I am your 24/7 AI Receptionist. How can I help you today?",
      time: "Just now",
      quickReplies: [
        "📅 Book Appointment Today",
        "💰 Treatment Pricing & Offers",
        "🦷 Emergency Toothache Help",
        "📍 Clinic Location & Timing"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, activeTab]);

  // Generate Doctor's Clinical WhatsApp Message with DD-MM-YYYY and IST slot
  const buildWhatsAppUrl = (customName?: string, customProblem?: string) => {
    const name = customName || patientName || "Patient";
    const problem = customProblem || selectedProblem;
    const formattedDate = formatToDDMMYYYY(appointmentDate);

    const formattedMsg =
      "🦷 *NEW DENTAL APPOINTMENT BOOKING*\n" +
      "━━━━━━━━━━━━━━━━━━━━\n" +
      "👤 *Patient Name:* " + name + "\n" +
      "🧬 *Demographics:* " + patientGender + ", " + (patientAge ? patientAge + " Yrs" : "Adult") + "\n" +
      "🩺 *Dental Concern:* " + problem + "\n" +
      "📅 *Preferred Date:* " + formattedDate + " (DD-MM-YYYY)\n" +
      "⏰ *Preferred Slot:* " + selectedSlot + "\n" +
      "🏥 *Clinic:* Apex Dental & Aesthetic Center\n" +
      "━━━━━━━━━━━━━━━━━━━━\n" +
      "_Please confirm my appointment slot with doctor. Thank you!_";

    return "https://wa.me/918768138086?text=" + encodeURIComponent(formattedMsg);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildWhatsAppUrl();
    window.open(url, "_blank");
  };

  const handleSelectServiceQuickBook = (problemKey: string) => {
    setSelectedProblem(problemKey);
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
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let botReply = "";
      let replies: string[] = [];

      const lower = text.toLowerCase();
      if (lower.includes("book") || lower.includes("appointment") || lower.includes("today")) {
        botReply = "Great! Dr. Ananya Roy is available for consultation. Fill in your name on the Booking Form tab or click below to WhatsApp immediately!";
        replies = ["✅ Open 1-Tap Form", "💬 WhatsApp Doctor Directly"];
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("offer")) {
        botReply = "Special Clinic Offers:\n• Single-Sitting RCT: ₹2,499 (Save ₹1,000)\n• Laser Teeth Whitening: ₹1,999\n• Full 3D Digital Smile Scan: 100% FREE this week!";
        replies = ["📅 Claim Free 3D Scan", "🦷 Book RCT Offer"];
      } else if (lower.includes("toothache") || lower.includes("pain") || lower.includes("emergency")) {
        botReply = "🚨 Emergency Case Flagged! Please rinse with lukewarm salt water. Our emergency duty dentist can attend you in 30 minutes. Click below to call immediately!";
        replies = ["📞 Call Clinic Directly", "📍 Get Instant GPS Route"];
      } else if (lower.includes("location") || lower.includes("timing") || lower.includes("address")) {
        botReply = "📍 Address: 2nd Floor, Apex Health City, Barasat-Habra Road (Opp. City Mall).\n⏰ Timings: Mon-Sun, 9:00 AM – 9:00 PM IST (Open all 7 days).";
        replies = ["📅 Book Visit", "💬 Open in WhatsApp"];
      } else {
        botReply = "Thank you! I have registered your inquiry. Our senior consultant will WhatsApp you shortly with personalized details!";
        replies = ["📅 Book Consultation Now", "⭐ View Real Patient Reviews"];
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
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden antialiased">
      
      {/* 🔴 TOP AGENCY DEMO BANNER */}
      <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-indigo-950/95 via-cyan-950/95 to-slate-950/95 backdrop-blur-xl border-b border-cyan-500/30 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <p className="text-[11px] sm:text-xs font-mono text-cyan-200 truncate">
            <span className="font-bold text-white">Live Showcase:</span> Apex Dental Clinic &amp; WhatsApp Booking Engine
          </p>
        </div>
        <Link
          href="https://wa.me/918768138086?text=Hi%20Mithun,%20I%20want%20a%20website%20like%20Apex%20Dental%20Clinic%20for%20my%20business!"
          target="_blank"
          className="flex-shrink-0 px-2.5 sm:px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-[10px] sm:text-xs font-mono hover:scale-105 transition-transform flex items-center gap-1 shadow-lg shadow-cyan-500/20"
        >
          <span>Get Yours ₹2,999/-</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* HEADER NAVIGATION */}
      <header className="pt-16 sm:pt-20 pb-4 px-3 sm:px-6 max-w-7xl mx-auto flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-black text-base sm:text-lg shadow-lg shadow-cyan-500/30">
            🦷
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span>APEX DENTAL</span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                CLINIC &amp; IMPLANT
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-mono flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
              <span>Barasat • Habra • Kolkata</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCallDirect}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>+91 87681 38086</span>
          </button>
          <a
            href="#booking-engine"
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono tracking-wide shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </a>
        </div>
      </header>

      {/* HERO SECTION WITH CLINICAL BOOKING ENGINE */}
      <section id="booking-engine" className="px-3 sm:px-6 pt-6 sm:pt-10 pb-10 sm:pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Pitch */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-mono font-medium">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              <span>Advanced Laser &amp; Painless Micro-Dentistry</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Smile With Confidence.{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                100% Painless Care.
              </span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Experience Kolkata’s premier dental clinic. Instant 1-tap WhatsApp doctor appointment booking, zero waiting time, and 3D digital smile imaging.
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-1 max-w-lg mx-auto lg:mx-0">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-2.5 sm:p-3 text-center">
                <p className="text-base sm:text-xl font-black text-cyan-400 font-mono">15,000+</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono">Smiles Fixed</p>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-2.5 sm:p-3 text-center">
                <p className="text-base sm:text-xl font-black text-emerald-400 font-mono">4.9 ★</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono">Google Rating</p>
              </div>
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-2.5 sm:p-3 text-center">
                <p className="text-base sm:text-xl font-black text-indigo-400 font-mono">20 Sec</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono">WA Booking</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero waiting time with guaranteed VIP scheduled slot</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Direct WhatsApp doctor dispatch with age &amp; case details</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Complimentary 3D Digital Smile Scan with first visit</span>
              </div>
            </div>
          </div>

          {/* Right Column: CLINICAL WHATSAPP BOOKING ENGINE */}
          <div className="lg:col-span-6">
            <div className="bg-[#0b101e] border border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl relative">
              
              {/* Tab Selector Bar */}
              <div className="flex items-center justify-between p-1 bg-slate-950/80 border border-slate-800 rounded-2xl mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === "form"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20"
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
                  <span>24/7 AI Receptionist</span>
                </button>
              </div>

              {/* TAB 1: CLINICAL WHATSAPP BOOKING FORM */}
              {activeTab === "form" ? (
                <form onSubmit={handleFormSubmit} className="space-y-3.5 text-left">
                  
                  {/* Row 1: Patient Name (50%) + Age (25%) + Gender (25%) */}
                  <div className="grid grid-cols-12 gap-2.5">
                    
                    {/* Patient Name */}
                    <div className="col-span-12 sm:col-span-6">
                      <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <User className="w-3 h-3 text-cyan-400" />
                        <span>Patient Full Name:</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Rahul Mukherjee"
                        className="w-full bg-[#050812] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    {/* Patient Age */}
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-emerald-400" />
                        <span>Age:</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="110"
                        required
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder="e.g. 28"
                        className="w-full bg-[#050812] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors text-center font-mono font-bold"
                      />
                    </div>

                    {/* Patient Gender */}
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <HeartPulse className="w-3 h-3 text-pink-400" />
                        <span>Gender:</span>
                      </label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                        className="w-full bg-[#050812] border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                      >
                        <option value="Male" className="bg-slate-950">Male</option>
                        <option value="Female" className="bg-slate-950">Female</option>
                        <option value="Child" className="bg-slate-950">Child (&lt; 14)</option>
                        <option value="Other" className="bg-slate-950">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* 13-Option Dental Problem Dropdown */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <ClipboardList className="w-3 h-3 text-cyan-400" />
                      <span>Select Dental Problem / Treatment:</span>
                    </label>
                    <select
                      value={selectedProblem}
                      onChange={(e) => setSelectedProblem(e.target.value)}
                      className="w-full bg-[#050812] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                    >
                      {DENTAL_PROBLEMS.map((prob, idx) => (
                        <option key={idx} value={prob} className="bg-slate-950 text-slate-200">
                          {prob}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Appointment Date (DD-MM-YYYY format + Past Dates Disabled) & IST Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-cyan-400" />
                          <span>Appointment Date:</span>
                        </label>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
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
                          className="w-full bg-[#050812] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white [color-scheme:dark] focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            try { dateInputRef.current?.showPicker(); } catch (e) { dateInputRef.current?.focus(); }
                          }}
                          className="absolute right-3 p-1 rounded text-cyan-400 hover:text-cyan-300 pointer-events-auto"
                          title="Click to Open Calendar"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">Format: DD-MM-YYYY (Past dates disabled)</p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Preferred Slot (IST):</span>
                      </label>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full bg-[#050812] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                      >
                        {TIME_SLOTS.map((slot, idx) => (
                          <option key={idx} value={slot} className="bg-slate-950 text-slate-200">
                            {slot}
                          </option>
                        ))}
                      </select>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">All slots in Indian Standard Time (IST)</p>
                    </div>
                  </div>

                  {/* Auto-Filled WhatsApp Live Message Preview Box */}
                  <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>Auto-Filled WhatsApp Message Preview:</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        IST Timezone
                      </span>
                    </div>

                    <div className="bg-[#040711] border border-slate-800 rounded-xl p-2.5 text-[11px] font-mono text-slate-300 whitespace-pre-line leading-relaxed">
                      {"🦷 *APEX DENTAL CLINIC APPOINTMENT*\n" +
                        "👤 Patient: " + (patientName || "[Patient Name]") + " (" + patientGender + ", " + (patientAge ? patientAge + " Yrs" : "Adult") + ")\n" +
                        "🩺 Concern: " + selectedProblem + "\n" +
                        "📅 Date: " + displayDateDDMMYYYY + " (DD-MM-YYYY)\n" +
                        "⏰ Slot: " + selectedSlot}
                    </div>
                  </div>

                  {/* Glowing 1-Click WhatsApp Action Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-extrabold text-xs sm:text-sm font-mono tracking-wide shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-black" />
                    <span>Confirm &amp; Book via WhatsApp (+91 87681 38086)</span>
                  </button>
                </form>
              ) : (
                /* TAB 2: 24/7 AI RECEPTIONIST CHAT */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                          <Bot className="w-4 h-4" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Apex AI Receptionist</h4>
                        <p className="text-[9px] text-slate-400 font-mono">Answers pricing, slots &amp; emergency care (IST)</p>
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
                              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold shadow-md"
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
                                className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all text-left"
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
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
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
                      placeholder="Ask price, timings, emergency..."
                      className="flex-1 bg-[#050812] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:scale-105 active:scale-95 transition-transform"
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

      {/* TREATMENTS & SERVICES GRID */}
      <section className="px-3 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest font-bold">
            World-Class Treatments
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Comprehensive Dental Services
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Transparent pricing, zero hidden charges, and German rotary precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {SERVICES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-[#090e1a] border border-slate-800/80 hover:border-cyan-500/40 rounded-3xl p-4 sm:p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-black shadow-lg`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                      {s.tag}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                    {s.price}
                  </span>
                  <button
                    onClick={() => handleSelectServiceQuickBook(s.problemKey)}
                    className="text-[11px] font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Quick Book</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DOCTORS & SPECIALISTS */}
      <section className="px-3 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto border-t border-slate-900 bg-slate-950/40 rounded-3xl my-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest font-bold">
            Certified Doctors
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Meet Our Senior Specialists
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Over 25+ combined years of clinical excellence in dental surgery and aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {DOCTORS.map((doc, idx) => (
            <div
              key={idx}
              className="bg-[#0b101e] border border-slate-800 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-cyan-500/30 transition-all"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
                👨‍⚕️
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white">{doc.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {doc.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{doc.title}</p>
                <p className="text-[11px] text-slate-400 font-mono">{doc.exp}</p>
                <p className="text-[11px] text-amber-400 font-mono font-bold flex items-center gap-1 pt-0.5">
                  <span>★</span>
                  <span>{doc.rating}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PATIENT REVIEWS */}
      <section className="px-3 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest font-bold">
            Verified Reviews
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Loved By Over 15,000+ Happy Patients
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Real Google Maps &amp; Practo verified reviews from Barasat, Habra &amp; Kolkata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#090e1a] border border-slate-800 rounded-3xl p-4 sm:p-6 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(rev.rating)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {rev.treatment}
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
                <span className="text-[10px] font-mono text-cyan-400">Verified Patient</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🟢 AGENCY BOTTOM CONVERSION CARD (CTA) */}
      <section className="px-3 sm:px-6 py-12 sm:py-16 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              ⚡ GROW YOUR CLINIC WITH WHATSAPP APPOINTMENT AUTOMATION
            </span>
            <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white max-w-2xl mx-auto leading-tight">
              Want this kind of customized high-speed mobile website + automated WhatsApp booking receptionist starting at ₹2,999/-?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal">
              Built and delivered in 24 hours. Includes custom domain, 13-service WhatsApp booking form, 24/7 AI chat widget &amp; Google Maps SEO ranker.
            </p>
            <div className="pt-3">
              <Link
                href="https://wa.me/918768138086?text=Hi%20Mithun,%20I%20want%20this%20exact%20customized%20Dental/Clinic%20website%20starting%20at%20₹2,999/-!"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-black font-extrabold text-xs sm:text-sm font-mono tracking-wide shadow-xl shadow-cyan-500/30 hover:scale-105 transition-transform"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Claim Your Website on WhatsApp (+91 87681 38086)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 📱 STICKY MOBILE 1-TAP BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#060a14]/95 backdrop-blur-2xl border-t border-cyan-500/30 p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl">
        <button
          onClick={handleCallDirect}
          className="flex-1 py-2.5 px-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <Phone className="w-3.5 h-3.5 text-cyan-400" />
          <span>Call Doctor</span>
        </button>
        <a
          href="#booking-engine"
          className="flex-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>WhatsApp Book</span>
        </a>
      </div>

      {/* FOOTER */}
      <footer className="pb-24 sm:pb-12 pt-8 text-center text-slate-500 text-xs font-mono border-t border-slate-900 px-4">
        <p>© 2026 Apex Dental &amp; Aesthetic Clinic. All rights reserved.</p>
        <p className="text-[10px] text-slate-600 mt-1">
          Designed &amp; Powered by Mithun Das Agency Automation Platform
        </p>
      </footer>
    </div>
  );
}
