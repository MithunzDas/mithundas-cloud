"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ArrowRight
} from "lucide-react";

export default function DentalClinicDemoPage() {
  const [patientName, setPatientName] = useState("");
  const [selectedService, setSelectedService] = useState("Painless Root Canal (RCT)");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("Evening (5:00 PM - 8:00 PM)");
  const [isBooked, setIsBooked] = useState(false);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) {
      alert("Please enter your name");
      return;
    }

    const text = `Hello Dr. Roy Clinic! I would like to book a dental appointment.%0A%0A👤 Patient: ${encodeURIComponent(patientName)}%0A🦷 Service: ${encodeURIComponent(selectedService)}%0A📅 Preferred Date: ${encodeURIComponent(appointmentDate || "Tomorrow")}%0A⏰ Time Slot: ${encodeURIComponent(appointmentTime)}%0A%0A(Sent via mithundas.cloud 1-Click Clinic Booking Demo)`;

    window.open(`https://wa.me/918768138086?text=${text}`, "_blank");
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Floating Agency Conversion Banner */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 px-4 py-2.5 shadow-2xl backdrop-blur-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-white">
          <div className="flex items-center gap-2">
            <span className="bg-black/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-cyan-200 border border-white/20">
              LIVE DEMO SHOWCASE
            </span>
            <span className="font-semibold hidden md:inline">
              Custom High-Speed Clinic Website + 1-Click WhatsApp Booking Engine
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-amber-300">Starts at ₹2,999/-</span>
            <a
              href="https://wa.me/918768138086?text=Hi%20Mithun!%20I%20saw%20your%20Dental%20Clinic%20Demo.%20I%20want%20this%20website%20for%20my%20clinic%20at%20%E2%82%B92999."
              target="_blank"
              rel="noreferrer"
              className="bg-black text-cyan-300 hover:text-white px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Get This For Your Clinic</span>
            </a>
          </div>
        </div>
      </div>

      {/* Clinic Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-10 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>Dr. Roy's Advanced Dental Clinic</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  OPEN NOW
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" /> Habra, West Bengal • 4.9★ (250+ Google Reviews)
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:8768138086"
              className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>+91 87681 38086</span>
            </a>
            <a
              href="#book"
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shadow-lg shadow-cyan-500/20"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Painless Modern Dental Care • Laser &amp; Implant Specialist</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Experience Gentle, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">World-Class Dental Care</span> in Habra.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              No long hospital waiting lines. Get instant pain relief, digital smile makeovers, and painless root canal treatments with state-of-the-art sterile equipment.
            </p>

            {/* Social Proof Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>4.9 / 5.0</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">250+ Patient Reviews</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1 text-cyan-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Painless</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Laser Assisted Care</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>15+ Years</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Senior Dental Surgeon</p>
              </div>
            </div>
          </div>

          {/* Right Hero Column: 1-Click WhatsApp Booking Form */}
          <div id="book" className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Instant Appointment</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Direct WhatsApp Confirmation in 2 Mins</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  FREE CONSULT
                </span>
              </div>

              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Sourav Mukherjee"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Select Dental Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Painless Root Canal (RCT)">🦷 Painless Root Canal (RCT)</option>
                    <option value="Teeth Whitening & Smile Design">✨ Teeth Whitening &amp; Smile Design</option>
                    <option value="Dental Implants & Fixed Teeth">🔩 Dental Implants &amp; Fixed Teeth</option>
                    <option value="Tooth Extraction & Pain Relief">🚨 Emergency Tooth Extraction</option>
                    <option value="Children Dental Checkup">👶 Kids / Pediatric Dental Care</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Time Preference</label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Morning (10:00 AM - 1:00 PM)">Morning (10 AM - 1 PM)</option>
                      <option value="Evening (5:00 PM - 8:30 PM)">Evening (5 PM - 8:30 PM)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Book 1-Click via WhatsApp</span>
                </button>
              </form>

              {isBooked && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Opening WhatsApp with your booking details!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Specialized Dental Treatments
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            State-of-the-art dental procedures with highest international sterilization standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Single-Sitting Root Canal",
              desc: "100% painless rotary RCT with 3D digital imaging. Save your natural tooth in just 45 minutes.",
              icon: "🦷",
              highlight: "Painless Anesthesia"
            },
            {
              title: "Laser Teeth Whitening",
              desc: "Get up to 6 shades brighter teeth in a single clinical session. Safe, instant, and long-lasting.",
              icon: "✨",
              highlight: "Instant 45-Min Glow"
            },
            {
              title: "Permanent Dental Implants",
              desc: "Replace missing teeth with Swiss titanium implants that look and feel 100% natural.",
              icon: "🔩",
              highlight: "Lifetime Warranty"
            }
          ].map((srv, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-2xl transition-all hover:bg-slate-900 group"
            >
              <div className="text-3xl mb-4">{srv.icon}</div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {srv.highlight}
              </span>
              <h4 className="text-base font-bold text-white mt-3 mb-2 group-hover:text-cyan-400 transition-colors">
                {srv.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Mithun Agency Hook */}
      <footer className="border-t border-slate-800 bg-[#05080e] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="text-sm font-bold text-white">
              Website &amp; WhatsApp Booking Engine Crafted by <span className="text-cyan-400">Mithun Das AI Automation</span>
            </p>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Want a high-speed website + automated WhatsApp receptionist for your business starting at ₹2,999/-?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918768138086?text=Hi%20Mithun!%20I%20want%20a%20website%20starting%20at%20%E2%82%B92999."
              target="_blank"
              rel="noreferrer"
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all shadow-lg shadow-cyan-500/20"
            >
              Order Website (₹2,999/-)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
