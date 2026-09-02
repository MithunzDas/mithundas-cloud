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
  ExternalLink
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  quickReplies?: string[];
}

const SERVICES = [
  {
    icon: Smile,
    title: "Painless Root Canal (RCT)",
    desc: "Single-sitting rotary endodontics with 3D digital apex locator precision.",
    price: "From ₹2,499",
    tag: "Most Popular",
    color: "from-cyan-500 to-blue-500"
  },
  {
    icon: Sparkles,
    title: "Laser Teeth Whitening",
    desc: "Instant 6-8 shade brightening in 45 minutes with advanced cold-light laser.",
    price: "From ₹1,999",
    tag: "Instant Glow",
    color: "from-emerald-400 to-teal-500"
  },
  {
    icon: Shield,
    title: "Invisible Dental Aligners",
    desc: "US FDA-cleared transparent braces. Zero food restrictions, 100% discreet.",
    price: "Free 3D Scan",
    tag: "Modern Ortho",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Award,
    title: "Titanium Dental Implants",
    desc: "Permanent tooth replacement with Swiss & German lifelong warranty implants.",
    price: "EMI Available",
    tag: "Permanent Fix",
    color: "from-amber-400 to-orange-500"
  },
  {
    icon: HeartPulse,
    title: "Kids Dental Care (Pediatric)",
    desc: "Child-friendly clinic environment with painless cavity filling & fluoride therapy.",
    price: "From ₹799",
    tag: "Gentle Care",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Stethoscope,
    title: "Full Mouth Rehabilitation",
    desc: "Comprehensive smile makeover combining veneers, crowns, and gum contouring.",
    price: "Custom Plan",
    tag: "Complete Care",
    color: "from-blue-500 to-cyan-400"
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

export default function DentalClinicDemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! 🙏 Welcome to Apex Dental & Aesthetics. I am your 24/7 AI Receptionist. How can I help you today?",
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
  }, [messages, isTyping]);

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
        botReply = "Great! Dr. Ananya Roy is available today at 4:30 PM and 6:00 PM. Would you like me to reserve a VIP Consultation slot for you?";
        replies = ["✅ Yes, book 4:30 PM", "✅ Yes, book 6:00 PM", "💬 Chat with Human Doctor"];
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("offer")) {
        botReply = "Our current Special Offers:\n• Single-Sitting RCT: ₹2,499 (Save ₹1,000)\n• Laser Whitening: ₹1,999\n• Full 3D Digital Smile Scan: 100% FREE this week!";
        replies = ["📅 Claim Free 3D Scan", "🦷 Book RCT Offer"];
      } else if (lower.includes("toothache") || lower.includes("pain") || lower.includes("emergency")) {
        botReply = "🚨 Emergency Case Flagged! Please rinse with lukewarm salt water. Our emergency duty dentist can attend you in 30 minutes. Please click below to call immediately!";
        replies = ["📞 Call Clinic Directly", "📍 Get Instant GPS Route"];
      } else if (lower.includes("location") || lower.includes("timing") || lower.includes("address")) {
        botReply = "📍 Address: 2nd Floor, Apex Health City, Barasat-Habra Road (Opp. City Mall).\n⏰ Timings: Mon-Sun, 9:00 AM – 9:00 PM (Open all 7 days).";
        replies = ["📅 Book Visit", "💬 Open in WhatsApp"];
      } else {
        botReply = "Thank you! I have registered your inquiry. One of our doctors will WhatsApp you shortly with personalized details!";
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

  const handleWhatsAppDirect = () => {
    const waText = encodeURIComponent(
      "Hello Apex Dental Clinic! I would like to book a dental appointment for consultation."
    );
    window.open(`https://wa.me/918768138086?text=${waText}`, "_blank");
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
            <span className="font-bold text-white">Live Showcase:</span> Apex Dental Clinic &amp; AI Receptionist
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
          <button
            onClick={handleWhatsAppDirect}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono tracking-wide shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-black" />
            <span>Book Visit</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="px-3 sm:px-6 pt-6 sm:pt-12 pb-10 sm:pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column: Clinic Pitch */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-mono font-medium shadow-inner">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              <span>Advanced Laser &amp; Painless Micro-Dentistry</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Smile With Complete Confidence.{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                100% Painless Care.
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Experience Kolkata’s premier dental care with 3D digital smile design, single-visit painless root canals, and invisible aligners. 
              Open 7 days a week with 24/7 emergency care.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 max-w-lg mx-auto lg:mx-0">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5 sm:p-4 text-center">
                <p className="text-base sm:text-2xl font-black text-cyan-400 font-mono">15,000+</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono">Smiles Crafted</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5 sm:p-4 text-center">
                <p className="text-base sm:text-2xl font-black text-emerald-400 font-mono">4.9 ★</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono">Google Rating</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5 sm:p-4 text-center">
                <p className="text-base sm:text-2xl font-black text-indigo-400 font-mono">100%</p>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono">Painless Tech</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs sm:text-sm font-mono tracking-wide shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Book 1-Tap Appointment (WhatsApp)</span>
              </button>
              <button
                onClick={handleCallDirect}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Emergency: +91 87681 38086</span>
              </button>
            </div>
          </div>

          {/* Right Column: 24/7 AI Receptionist Chat Simulator */}
          <div className="lg:col-span-5">
            <div className="bg-[#0b101d] border border-cyan-500/30 rounded-3xl p-3.5 sm:p-5 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl relative overflow-hidden">
              
              {/* Top Chat Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                      <Bot className="w-5 h-5" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Apex AI Receptionist</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        ONLINE 24/7
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">Instant Appointment &amp; Pricing Bot</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20">
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>&lt; 5s Reply</span>
                </div>
              </div>

              {/* Chat Message Box */}
              <div className="space-y-3 h-[250px] sm:h-[280px] overflow-y-auto pr-1 text-xs font-sans scrollbar-thin scrollbar-thumb-slate-800">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold shadow-md"
                          : "bg-slate-900/90 border border-slate-800 text-slate-200"
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed text-[11px] sm:text-xs">{msg.text}</p>
                      <span
                        className={`text-[9px] block mt-1 ${
                          msg.sender === "user" ? "text-black/70" : "text-slate-400"
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>

                    {/* Quick Reply Chips */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                        {msg.quickReplies.map((reply, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(reply)}
                            className="text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all text-left"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs font-mono w-24">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>Typing...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask treatment price, doctor time..."
                  className="flex-1 bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:scale-105 active:scale-95 transition-transform"
                >
                  <Send className="w-3.5 h-3.5 fill-black" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* TREATMENTS & SERVICES GRID */}
      <section className="px-3 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest font-bold">
            World-Class Care
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Comprehensive Dental Treatments
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Transparent pricing, zero hidden charges, and German precision technology.
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
                    onClick={handleWhatsAppDirect}
                    className="text-[11px] font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Book Now</span>
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
            Certified Expertise
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
            Verified Feedback
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
              ⚡ GROW YOUR LOCAL BUSINESS WITH AI &amp; WHATSAPP
            </span>
            <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white max-w-2xl mx-auto leading-tight">
              Want this kind of customized high-speed mobile website + automated WhatsApp booking receptionist starting at ₹2,999/-?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal">
              Built and delivered in 24 hours. Includes custom domain, 24/7 AI chat widget, Google Maps SEO ranker &amp; Meta WhatsApp Business integration.
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
        <button
          onClick={handleWhatsAppDirect}
          className="flex-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-black" />
          <span>WhatsApp Book</span>
        </button>
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
