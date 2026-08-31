"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  Star,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  MapPin,
  HeartPulse,
  Send,
  Zap,
  ArrowRight,
  Bot,
  User,
  Activity,
  Smile,
  Check
} from "lucide-react";

export default function DentalClinicDemoPage() {
  const [patientName, setPatientName] = useState("");
  const [selectedService, setSelectedService] = useState("Laser RCT & Pain Relief");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("Evening (5:00 PM - 8:30 PM)");
  const [activeTab, setActiveTab] = useState("rct");

  // AI Chat Simulation State
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Namaste! 🙏 I am Maya, Dr. Roy's 24/7 AI Clinic Assistant. How can I help your smile today?" },
    { sender: "patient", text: "How much does a root canal treatment cost?" },
    { sender: "bot", text: "Our Painless Single-Sitting Laser RCT starts at ₹2,499 with 3D digital x-ray included. Would you like me to reserve a doctor consultation slot for you?" }
  ]);
  const [userChatInput, setUserChatInput] = useState("");

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const newMsg = { sender: "patient", text: userChatInput };
    setChatMessages(prev => [...prev, newMsg]);
    setUserChatInput("");

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "I have forwarded your inquiry directly to Dr. Roy. Tap the WhatsApp button below to confirm your priority time slot instantly!"
        }
      ]);
    }, 900);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const name = patientName || "Guest Patient";
    const text = `Hello Dr. Roy Dental Clinic! I would like to book an appointment.%0A%0A👤 Patient: ${encodeURIComponent(name)}%0A🦷 Treatment: ${encodeURIComponent(selectedService)}%0A📅 Date: ${encodeURIComponent(appointmentDate || "Tomorrow")}%0A⏰ Preferred Slot: ${encodeURIComponent(appointmentTime)}%0A%0A(Booked via mithundas.cloud 1-Click Clinic Engine)`;

    window.open(`https://wa.me/918768138086?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden pb-24 md:pb-0">
      
      {/* 1. TOP CONVERSION BANNER (Mithun Das AI Automation Agency Hook) */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-500/30 px-3 py-2 shadow-2xl backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 truncate">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-cyan-500/30 uppercase">
              LIVE DEMO SHOWCASE
            </span>
            <span className="text-slate-300 truncate hidden sm:inline">
              Custom Clinic Web App + 24/7 AI WhatsApp Receptionist
            </span>
          </div>
          <a
            href="https://wa.me/918768138086?text=Hi%20Mithun!%20I%20saw%20your%20Dental%20Clinic%20Showcase.%20I%20want%20this%20exact%20website%20%2B%20WhatsApp%20engine%20for%20my%20clinic%20at%20%E2%82%B92999."
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-3 py-1.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 text-[11px]"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Claim Website (₹2,999)</span>
          </a>
        </div>
      </div>

      {/* 2. CLINIC HERO NAVIGATION */}
      <nav className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-2xl sticky top-9 z-40 px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Dr. Roy's Advanced Dental Center
                </h1>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  OPEN NOW
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" /> Habra • 4.9★ (250+ Verified Google Reviews)
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:8768138086"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>+91 87681 38086</span>
            </a>
            <a
              href="#book-section"
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition-all shadow-md shadow-cyan-500/20"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </nav>

      {/* 3. 3D GLOW HERO SECTION */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Glowing 3D backdrop spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Painless Laser Dentistry • Certified Implantologist</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
              World-Class Dental Care,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                100% Painless.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Equipped with cutting-edge 3D Digital Intraoral Scanners &amp; German Laser Anesthesia. Experience painless single-sitting root canals, Hollywood smile design, and instant emergency relief in Habra.
            </p>

            {/* 3D Glass Feature Highlights */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-3 rounded-2xl shadow-inner text-left">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.9 / 5.0</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">250+ Google Reviews</p>
              </div>

              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-3 rounded-2xl shadow-inner text-left">
                <div className="flex items-center gap-1 text-cyan-400 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Sterile</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Autoclave Class B</p>
              </div>

              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-3 rounded-2xl shadow-inner text-left">
                <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Single-Sitting</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">45-Min Fast RCT</p>
              </div>
            </div>
          </div>

          {/* Right Column: 1-Click WhatsApp Booking Box (Ultra-Responsive) */}
          <div id="book-section" className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-500/15 backdrop-blur-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Instant Appointment</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">1-Tap WhatsApp Slot Confirmation</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                  PRIORITY PASS
                </span>
              </div>

              <form onSubmit={handleBookAppointment} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Rahul Sen"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">Select Dental Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Laser RCT & Pain Relief">🦷 Painless Laser Root Canal (RCT)</option>
                    <option value="Laser Teeth Whitening">✨ Laser Teeth Whitening &amp; Smile Glow</option>
                    <option value="Dental Implants & Fixed Crown">🔩 Swiss Dental Implants &amp; Crown</option>
                    <option value="Emergency Tooth Extraction">🚨 Emergency Tooth Pain Extraction</option>
                    <option value="Kids Pediatric Dental Care">👶 Kids &amp; Family Dental Checkup</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">Time Slot</label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Morning (10:00 AM - 1:00 PM)">Morning (10 AM - 1 PM)</option>
                      <option value="Evening (5:00 PM - 8:30 PM)">Evening (5 PM - 8:30 PM)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Book Appointment via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 24/7 AI RECEPTIONIST SIMULATOR (The Automation Agency Hook) */}
      <section className="py-12 bg-slate-950/60 border-y border-slate-800/80 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-mono text-indigo-300">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Receptionist Automation System</span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              24/7 AI WhatsApp Receptionist in Action
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
              Never lose a patient after hours. Our AI automatically answers treatment inquiries, explains pricing, and schedules visits directly into WhatsApp.
            </p>
          </div>

          {/* Simulated WhatsApp Phone Frame */}
          <div className="max-w-md mx-auto bg-[#0b0f17] border border-slate-800 rounded-3xl p-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  DR
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Dr. Roy AI Assistant</p>
                  <p className="text-[10px] text-emerald-400 font-mono">🟢 Online (Automated)</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">End-to-End Encrypted</span>
            </div>

            {/* Chat Bubble Thread */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${
                    msg.sender === "patient" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`p-2.5 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                      msg.sender === "patient"
                        ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none font-sans"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendChat} className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                placeholder="Ask Maya about root canal, braces..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 5. SPECIALIZED SERVICES SECTION */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 text-left">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Comprehensive Dental Specialities
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Painless procedures backed by 15+ years of clinical excellence in Habra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Single-Sitting Laser RCT",
              desc: "100% painless rotary root canal treatment with digital 3D apex locator. Save your natural tooth in 45 minutes.",
              icon: "🦷",
              badge: "PAINLESS",
              price: "From ₹2,499"
            },
            {
              title: "Laser Teeth Whitening",
              desc: "Get up to 6 shades brighter teeth in a single 45-minute clinical laser session. Safe, instant & long-lasting.",
              icon: "✨",
              badge: "INSTANT GLOW",
              price: "From ₹1,999"
            },
            {
              title: "Swiss Titanium Implants",
              desc: "Permanent replacement for missing teeth with lifetime warranty. Looks, chews, and feels 100% natural.",
              icon: "🔩",
              badge: "LIFETIME GUARANTEE",
              price: "From ₹18,000"
            }
          ].map((srv, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-3xl transition-all hover:scale-[1.02] group shadow-xl"
            >
              <div className="text-3xl mb-3">{srv.icon}</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                  {srv.badge}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">{srv.price}</span>
              </div>
              <h4 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {srv.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{srv.desc}</p>
              <a
                href="#book-section"
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Book This Treatment</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM AGENCY FOOTER (The ₹2,999 Offer) */}
      <footer className="border-t border-slate-800 bg-[#030509] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="text-sm font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <span>Crafted by</span>
              <span className="text-cyan-400 font-mono">Mithun Das AI Automation</span>
            </p>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Want this exact high-speed mobile website + automated WhatsApp booking receptionist starting at ₹2,999/-?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918768138086?text=Hi%20Mithun!%20I%20want%20to%20order%20this%20Clinic%20Website%20at%20%E2%82%B92999."
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all shadow-lg shadow-cyan-500/20"
            >
              Claim Clinic Website (₹2,999/-)
            </a>
          </div>
        </div>
      </footer>

      {/* 7. MOBILE STICKY 1-TAP BOTTOM ACTION BAR (Ultra-Responsive) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-cyan-500/30 p-2.5 backdrop-blur-xl flex items-center gap-2 shadow-2xl">
        <a
          href="tel:8768138086"
          className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Phone className="w-3.5 h-3.5 text-cyan-400" />
          <span>Call Clinic</span>
        </a>
        <a
          href="https://wa.me/918768138086?text=Hello%20Dr.%20Roy%20Clinic!%20I%20want%20to%20book%20an%20appointment."
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>WhatsApp Book</span>
        </a>
      </div>
    </div>
  );
}
