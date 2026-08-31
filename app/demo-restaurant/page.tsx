"use client";

import React, { useState } from "react";
import { Utensils, MessageCircle, Star, Sparkles, MapPin, Phone, Clock, ShieldCheck } from "lucide-react";

export default function RestaurantDemoPage() {
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("2 Guests");
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Dinner (8:00 PM)");

  const handleTableBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName) {
      alert("Please enter your name");
      return;
    }

    const text = `Hello Royal Dine Restaurant! I would like to reserve a table.%0A%0A👤 Guest: ${encodeURIComponent(guestName)}%0A👥 Party Size: ${encodeURIComponent(guestCount)}%0A📅 Date: ${encodeURIComponent(bookingDate || "Tonight")}%0A⏰ Time: ${encodeURIComponent(timeSlot)}%0A%0A(Sent via mithundas.cloud 1-Click Restaurant Table Booking Demo)`;

    window.open(`https://wa.me/918768138086?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 px-4 py-2.5 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-white">
          <div className="flex items-center gap-2">
            <span className="bg-black/30 px-2.5 py-0.5 rounded-full font-bold uppercase text-amber-200">
              RESTAURANT SHOWCASE DEMO
            </span>
            <span className="hidden md:inline">High-Speed Digital Menu + 1-Click WhatsApp Table Reservation</span>
          </div>
          <a
            href="https://wa.me/918768138086?text=Hi%20Mithun!%20I%20saw%20your%20Restaurant%20Demo.%20I%20want%20this%20website%20at%20%E2%82%B92999."
            target="_blank"
            rel="noreferrer"
            className="bg-black text-amber-300 px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Order For Your Restaurant (₹2,999/-)</span>
          </a>
        </div>
      </div>

      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">The Royal Grand Cafe &amp; Multi-Cuisine Dine</h1>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" /> Kolkata • 4.8★ (650+ Google Reviews)
              </p>
            </div>
          </div>
          <a href="tel:8768138086" className="text-xs font-mono text-slate-300 flex items-center gap-1">
            <Phone className="w-3 h-3 text-amber-400" /> +91 87681 38086
          </a>
        </div>
      </header>

      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
            <Sparkles className="w-3.5 h-3.5" /> Handcrafted Gourmet Food &amp; Cocktails
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Authentic Flavors, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Unforgettable Moments.</span>
          </h2>
          <p className="text-sm text-slate-300">
            Experience signature Mughlai, Pan-Asian, and Continental delights made fresh by master chefs.
          </p>
        </div>

        <div className="lg:col-span-5 bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-1">Instant Table Reservation</h3>
          <p className="text-xs text-slate-400 font-mono mb-4">Direct WhatsApp VIP Confirmation</p>
          <form onSubmit={handleTableBooking} className="space-y-3.5">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Aniket Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Guests</label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400"
                >
                  <option value="2 Guests">2 Guests</option>
                  <option value="4 Guests">4 Guests</option>
                  <option value="6+ Guests (Family/Party)">6+ Guests</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Time</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400"
                >
                  <option value="Lunch (1:00 PM)">Lunch (1:00 PM)</option>
                  <option value="Dinner (8:00 PM)">Dinner (8:00 PM)</option>
                  <option value="Late Night (9:30 PM)">Late Night (9:30 PM)</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs tracking-wide shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Reserve Table via WhatsApp</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
