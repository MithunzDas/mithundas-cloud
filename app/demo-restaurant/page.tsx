"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Clock,
  MapPin,
  Phone,
  Star,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  Wine,
  Coffee,
  Heart,
  Calendar,
  Users,
  CheckCircle,
  ExternalLink
} from "lucide-react";

const MENU_CATEGORIES = [
  { id: "all", label: "🌟 All Specials" },
  { id: "starters", label: "🍢 Starters & Tandoor" },
  { id: "mains", label: "🍛 Signature Mains" },
  { id: "biryani", label: "🍚 Dum Biryani" },
  { id: "desserts", label: "🍨 Artisanal Desserts" },
  { id: "mocktails", label: "🍹 Cocktails & Mocktails" }
];

const MENU_ITEMS = [
  {
    id: 1,
    category: "starters",
    name: "Afghani Malai Paneer Tikka",
    desc: "Fresh cottage cheese marinated in rich cashew paste, cardamom, and roasted in clay oven.",
    price: "₹349",
    tag: "Chef's Special",
    rating: "4.9 ★",
    isVeg: true
  },
  {
    id: 2,
    category: "starters",
    name: "Peshawari Murg Seekh Kebab",
    desc: "Minced spring chicken with aromatic hill herbs, smoked with cloves & char-grilled.",
    price: "₹429",
    tag: "Bestseller",
    rating: "4.95 ★",
    isVeg: false
  },
  {
    id: 3,
    category: "mains",
    name: "Royal Dal Makhani 24-Hour",
    desc: "Black lentils slow-cooked overnight on charcoal with churned butter and dairy cream.",
    price: "₹329",
    tag: "Legendary",
    rating: "5.0 ★",
    isVeg: true
  },
  {
    id: 4,
    category: "mains",
    name: "Smoked Butter Chicken Kolkata Style",
    desc: "Charcoal-grilled chicken chunks simmered in satin tomato makhani with fenugreek aroma.",
    price: "₹479",
    tag: "Must Try",
    rating: "4.9 ★",
    isVeg: false
  },
  {
    id: 5,
    category: "biryani",
    name: "Dum Gosht Awadhi Biryani",
    desc: "Aged long-grain basmati rice with tender mutton, saffron, and slow sealed dum pot.",
    price: "₹549",
    tag: "Signature",
    rating: "4.98 ★",
    isVeg: false
  },
  {
    id: 6,
    category: "desserts",
    name: "Saffron Shahi Tukda with Rabri",
    desc: "Crispy bread soaked in saffron syrup, layered with thick condensed milk & pistachios.",
    price: "₹249",
    tag: "Royal Treat",
    rating: "4.8 ★",
    isVeg: true
  },
  {
    id: 7,
    category: "mocktails",
    name: "Kolkata Gondhoraj Gin Fizz",
    desc: "Infusion of fragrant Gondhoraj lime, mint leaves, sparkling tonic, and floral bitters.",
    price: "₹229",
    tag: "Refreshing",
    rating: "4.9 ★",
    isVeg: true
  }
];

export default function RestaurantDemoPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [guestCount, setGuestCount] = useState("2 Guests");
  const [bookingTime, setBookingTime] = useState("7:30 PM (Dinner)");
  const [isBooked, setIsBooked] = useState(false);

  const filteredItems =
    selectedCategory === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  const handleWhatsAppBooking = (customItem?: string) => {
    let msg = "";
    if (customItem) {
      msg = `Hello Grand Saffron! I would like to order / inquire about "${customItem}".`;
    } else {
      msg = `Hello Grand Saffron! I would like to reserve a table for ${guestCount} at ${bookingTime}.`;
    }
    window.open(`https://wa.me/918768138086?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleCallDirect = () => {
    window.location.href = "tel:+918768138086";
  };

  return (
    <div className="min-h-screen bg-[#070503] text-amber-50 font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden antialiased">
      
      {/* 🔴 TOP AGENCY DEMO BANNER */}
      <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-amber-950/95 via-rose-950/95 to-slate-950/95 backdrop-blur-xl border-b border-amber-500/30 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <p className="text-[11px] sm:text-xs font-mono text-amber-200 truncate">
            <span className="font-bold text-white">Live Showcase:</span> Grand Saffron Fine Dine &amp; Digital Menu
          </p>
        </div>
        <Link
          href="https://wa.me/918768138086?text=Hi%20Mithun,%20I%20want%20a%20website%20like%20Grand%20Saffron%20Restaurant%20for%20my%20business!"
          target="_blank"
          className="flex-shrink-0 px-2.5 sm:px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold text-[10px] sm:text-xs font-mono hover:scale-105 transition-transform flex items-center gap-1 shadow-lg shadow-amber-500/20"
        >
          <span>Get Yours ₹2,999/-</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* HEADER NAVIGATION */}
      <header className="pt-16 sm:pt-20 pb-4 px-3 sm:px-6 max-w-7xl mx-auto flex items-center justify-between border-b border-amber-950/60">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-black font-black text-base sm:text-lg shadow-lg shadow-amber-500/20">
            🍽️
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span>THE GRAND SAFFRON</span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                FINE DINE
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-amber-400/70 font-mono flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              <span>Barasat • Salt Lake • Kolkata</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCallDirect}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-900/60 text-amber-200 hover:text-white text-xs font-mono transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>+91 87681 38086</span>
          </button>
          <button
            onClick={() => handleWhatsAppBooking()}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-bold text-xs font-mono tracking-wide shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reserve Table</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="px-3 sm:px-6 pt-6 sm:pt-12 pb-10 sm:pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column: Pitch */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-mono font-medium">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span>Authentic Awadhi &amp; Mughlai Gastronomy</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Royal Dining Experience.{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                Every Single Night.
              </span>
            </h2>

            <p className="text-xs sm:text-base text-amber-100/70 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Immerse yourself in heritage recipes slow-cooked over charcoal woodfires. Live ghazal nights, private dining cabanas &amp; instant 1-click WhatsApp VIP reservations.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 max-w-lg mx-auto lg:mx-0">
              <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-2.5 sm:p-4 text-center">
                <p className="text-base sm:text-2xl font-black text-amber-400 font-mono">100%</p>
                <p className="text-[10px] sm:text-xs text-amber-300/60 font-mono">Pure Charcoal</p>
              </div>
              <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-2.5 sm:p-4 text-center">
                <p className="text-base sm:text-2xl font-black text-emerald-400 font-mono">4.9 ★</p>
                <p className="text-[10px] sm:text-xs text-amber-300/60 font-mono">2,400+ Reviews</p>
              </div>
              <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-2.5 sm:p-4 text-center">
                <p className="text-base sm:text-2xl font-black text-orange-400 font-mono">20 Sec</p>
                <p className="text-[10px] sm:text-xs text-amber-300/60 font-mono">Table Booking</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
              <button
                onClick={() => handleWhatsAppBooking()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs sm:text-sm font-mono tracking-wide shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Reserve VIP Table (WhatsApp)</span>
              </button>
              <button
                onClick={handleCallDirect}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800 text-amber-200 font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Restaurant: +91 87681 38086</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Quick Table Reservation Box */}
          <div className="lg:col-span-5">
            <div className="bg-[#120b06] border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-amber-500/10 backdrop-blur-xl relative">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-900/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                    🍷
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Instant Table Reservation</h3>
                    <p className="text-[10px] text-amber-300/60 font-mono">No Waiting • Confirmed on WhatsApp</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  SLOTS OPEN
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-[10px] sm:text-xs font-mono text-amber-300/80 uppercase block mb-1">
                    Number of Guests:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {["2 Guests", "4 Guests", "6 Guests", "8+ VIP"].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGuestCount(g)}
                        className={`py-2 rounded-xl text-[10px] sm:text-xs font-mono font-bold border transition-all ${
                          guestCount === g
                            ? "bg-amber-400 text-black border-amber-300 shadow-md"
                            : "bg-amber-950/40 border-amber-900/60 text-amber-300 hover:text-white"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-mono text-amber-300/80 uppercase block mb-1">
                    Preferred Time Slot:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {["1:30 PM (Lunch)", "7:30 PM (Dinner)", "9:00 PM (Dinner)"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setBookingTime(t)}
                        className={`py-2 rounded-xl text-[10px] sm:text-xs font-mono font-bold border transition-all ${
                          bookingTime === t
                            ? "bg-amber-400 text-black border-amber-300 shadow-md"
                            : "bg-amber-950/40 border-amber-900/60 text-amber-300 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-950/50 border border-amber-900/60 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-300/70">Selected:</span>
                    <span className="font-bold text-amber-300">{guestCount} • {bookingTime}</span>
                  </div>
                  <p className="text-[10px] text-emerald-400 font-mono">
                    ✨ Complimentary welcome mocktail included with online reservation!
                  </p>
                </div>

                <button
                  onClick={() => handleWhatsAppBooking()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-black font-extrabold text-xs sm:text-sm font-mono tracking-wide shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-black" />
                  <span>Confirm Reservation on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DIGITAL MENU */}
      <section className="px-3 sm:px-6 py-10 sm:py-16 max-w-7xl mx-auto border-t border-amber-950">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 space-y-2">
          <span className="text-amber-400 text-xs font-mono uppercase tracking-widest font-bold">
            Culinary Highlights
          </span>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Interactive Digital Menu
          </h3>
          <p className="text-xs sm:text-sm text-amber-200/60">
            Tap any dish to order or ask chef customization directly on WhatsApp.
          </p>
        </div>

        {/* Menu Category Pills (Scrollable on small mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar justify-start sm:justify-center -mx-3 px-3 sm:mx-0 sm:px-0">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-400 text-black border-amber-300 shadow-md"
                  : "bg-amber-950/40 border-amber-900/60 text-amber-300 hover:text-white hover:border-amber-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#120a05] border border-amber-900/50 hover:border-amber-500/40 rounded-3xl p-4 sm:p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-emerald-400" : "bg-rose-500"}`}></span>
                    <span className="text-[10px] font-mono text-amber-300/60 uppercase">
                      {item.isVeg ? "VEG" : "NON-VEG"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                    {item.tag}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-amber-200/60 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-amber-950/80 flex items-center justify-between">
                <div>
                  <span className="text-sm sm:text-base font-mono font-black text-amber-400">
                    {item.price}
                  </span>
                  <span className="text-[10px] font-mono text-amber-300/50 ml-2">{item.rating}</span>
                </div>

                <button
                  onClick={() => handleWhatsAppBooking(item.name)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1 transition-all"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Order on WA</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🟢 AGENCY BOTTOM CONVERSION CARD (CTA) */}
      <section className="px-3 sm:px-6 py-12 sm:py-16 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-orange-950 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              ⚡ GROW YOUR RESTAURANT WITH WHATSAPP AUTOMATION
            </span>
            <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white max-w-2xl mx-auto leading-tight">
              Want this kind of customized high-speed digital menu + 1-click WhatsApp reservation engine starting at ₹2,999/-?
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/70 max-w-xl mx-auto font-normal">
              Built and delivered in 24 hours. Includes QR code digital menu generator, 1-click table booking, automated WhatsApp confirmations &amp; Google Maps SEO booster.
            </p>
            <div className="pt-3">
              <Link
                href="https://wa.me/918768138086?text=Hi%20Mithun,%20I%20want%20this%20exact%20customized%20Restaurant/Cafe%20website%20starting%20at%20₹2,999/-!"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-black font-extrabold text-xs sm:text-sm font-mono tracking-wide shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Claim Your Website on WhatsApp (+91 87681 38086)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 📱 STICKY MOBILE 1-TAP BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#070503]/95 backdrop-blur-2xl border-t border-amber-500/30 p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl">
        <button
          onClick={handleCallDirect}
          className="flex-1 py-2.5 px-2 rounded-xl bg-amber-950/80 border border-amber-900 text-white font-bold text-xs font-mono flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Call Table</span>
        </button>
        <button
          onClick={() => handleWhatsAppBooking()}
          className="flex-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold text-xs font-mono flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Reserve Table</span>
        </button>
      </div>

      {/* FOOTER */}
      <footer className="pb-24 sm:pb-12 pt-8 text-center text-amber-400/50 text-xs font-mono border-t border-amber-950 px-4">
        <p>© 2026 The Grand Saffron Fine Dine. All rights reserved.</p>
        <p className="text-[10px] text-amber-500/40 mt-1">
          Designed &amp; Powered by Mithun Das Agency Automation Platform
        </p>
      </footer>
    </div>
  );
}
