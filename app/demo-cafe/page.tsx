"use client";

import React, { useState } from "react";
import {
  Utensils,
  MessageCircle,
  Star,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Coffee,
  Wine,
  Award,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from "lucide-react";

export default function RestaurantDemoPage() {
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("2 Guests (Couple Table)");
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Dinner (8:00 PM)");
  const [activeCategory, setActiveCategory] = useState("all");

  const menuItems = [
    {
      name: "Signature Kolkata Mutton Dum Biryani",
      category: "mains",
      desc: "Aged long-grain basmati rice slow-cooked in traditional copper handi with tender melt-in-mouth mutton & saffron potato.",
      price: "₹380",
      tag: "🔥 CHEF SPECIAL",
      rating: "4.9★",
      prepTime: "25 mins"
    },
    {
      name: "Tandoori Whole Bhetki / Pomfret",
      category: "starters",
      desc: "Fresh catch marinated in Kasundi mustard & red clay spices, charcoal-grilled to smoky perfection.",
      price: "₹450",
      tag: "⚡ BESTSELLER",
      rating: "4.9★",
      prepTime: "20 mins"
    },
    {
      name: "Butter Garlic Jumbo Prawns",
      category: "starters",
      desc: "Bay of Bengal prawns tossed in herb-infused European butter, garlic chips & white wine reduction glaze.",
      price: "₹420",
      tag: "MUST TRY",
      rating: "4.8★",
      prepTime: "15 mins"
    },
    {
      name: "Smoked Paneer Tikka Lababdar",
      category: "mains",
      desc: "Charcoal-roasted cottage cheese simmered in rich creamy tomato-cashew gravy with crushed kasuri methi.",
      price: "₹290",
      tag: "VEG DELIGHT",
      rating: "4.8★",
      prepTime: "18 mins"
    },
    {
      name: "Baked Blueberry Cheesecake",
      category: "desserts",
      desc: "New York style baked cream cheese on buttery biscuit crust topped with wild blueberry compote.",
      price: "₹220",
      tag: "SWEET ENDING",
      rating: "4.9★",
      prepTime: "Instant"
    },
    {
      name: "Artisanal Hazelnut Cold Brew",
      category: "beverages",
      desc: "18-hour slow-steeped Arabica coffee beans served over crystal ice with hazelnut cream.",
      price: "₹180",
      tag: "CAFE FAVORITE",
      rating: "4.7★",
      prepTime: "5 mins"
    }
  ];

  const filteredMenu = activeCategory === "all"
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleTableBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const name = guestName || "Guest";
    const text = `Hello Royal Dine Restaurant! I would like to reserve a table.%0A%0A👤 Guest: ${encodeURIComponent(name)}%0A👥 Party Size: ${encodeURIComponent(guestCount)}%0A📅 Date: ${encodeURIComponent(bookingDate || "Tonight")}%0A⏰ Time Slot: ${encodeURIComponent(timeSlot)}%0A%0A(Reserved via mithundas.cloud 1-Click Restaurant Engine)`;

    window.open(`https://wa.me/918768138086?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden pb-24 md:pb-0">
      
      {/* 1. TOP CONVERSION BANNER */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 border-b border-amber-500/30 px-3 py-2 shadow-2xl backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 truncate">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-500/30 uppercase">
              LIVE DEMO SHOWCASE
            </span>
            <span className="text-slate-300 truncate hidden sm:inline">
              Digital QR Menu + 1-Click WhatsApp Table VIP Booking
            </span>
          </div>
          <a
            href="https://wa.me/918768138086?text=Hi%20Mithun!%20I%20saw%20your%20Restaurant%20Showcase.%20I%20want%20this%20exact%20website%20%2B%20WhatsApp%20menu%20for%20my%20restaurant%20at%20%E2%82%B92999."
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold px-3 py-1.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5 text-[11px]"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Claim Website (₹2,999)</span>
          </a>
        </div>
      </div>

      {/* 2. RESTAURANT HERO NAV */}
      <nav className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-2xl sticky top-9 z-40 px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-amber-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Utensils className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  The Royal Dine &amp; Gourmet Lounge
                </h1>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  OPEN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" /> Kolkata • 4.8★ (650+ Foodie Reviews)
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:8768138086"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+91 87681 38086</span>
            </a>
            <a
              href="#reserve-section"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs font-mono transition-all shadow-md shadow-amber-500/20"
            >
              Reserve Table
            </a>
          </div>
        </div>
      </nav>

      {/* 3. 3D GLOW HERO */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-amber-600/15 via-orange-600/10 to-rose-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Dum Handi • Charcoal Clay Tandoor • Artisanal Cocktails</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Taste The Royal Legacy,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                Crafted Fresh Daily.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Immerse yourself in authentic royal recipes passed down through generations. From slow-cooked aromatic Dum Biryani to sizzling clay-oven kebabs, every dish tells a story.
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-3 rounded-2xl shadow-inner text-left">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>4.8 / 5.0</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">650+ Google Reviews</p>
              </div>

              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-3 rounded-2xl shadow-inner text-left">
                <div className="flex items-center gap-1 text-orange-400 font-bold text-xs">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Slow-Cooked</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Authentic Clay Dum</p>
              </div>

              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-3 rounded-2xl shadow-inner text-left">
                <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                  <Award className="w-3.5 h-3.5" />
                  <span>100% Halal</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Farm Fresh Meat</p>
              </div>
            </div>
          </div>

          {/* Right Column: 1-Click WhatsApp Table VIP Booking Box */}
          <div id="reserve-section" className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-amber-500/15 backdrop-blur-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Instant Table Booking</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">1-Tap WhatsApp VIP Seat Reserve</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  NO COVER CHARGE
                </span>
              </div>

              <form onSubmit={handleTableBooking} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Sourav Mukherjee"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">Guests / Table Size</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="2 Guests (Couple Table)">👫 2 Guests (Couple Table)</option>
                    <option value="4 Guests (Family Table)">👨‍👩‍👧‍👦 4 Guests (Family Table)</option>
                    <option value="6-10 Guests (Party Table)">🎉 6-10 Guests (Celebration Table)</option>
                    <option value="12+ Corporate Dinner">💼 12+ Corporate Group</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">Booking Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                    >
                      <option value="Lunch (1:00 PM - 3:30 PM)">Lunch (1 PM - 3:30 PM)</option>
                      <option value="Snacks & Coffee (5:30 PM)">Snacks (5:30 PM)</option>
                      <option value="Dinner (8:00 PM - 10:30 PM)">Dinner (8 PM - 10:30 PM)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Reserve Table via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE DIGITAL MENU (With Filter Pills & Direct WhatsApp Ordering) */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 text-left">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore Signature Digital Menu
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Handcrafted with authentic spices and farm-fresh ingredients.
          </p>

          <div className="flex items-center justify-center gap-2 pt-3 flex-wrap">
            {[
              { id: "all", label: "🌟 All Dishes" },
              { id: "starters", label: "🍢 Tandoor Starters" },
              { id: "mains", label: "🍛 Signature Mains" },
              { id: "desserts", label: "🍰 Desserts" },
              { id: "beverages", label: "☕ Cold Brews" }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMenu.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800 hover:border-amber-500/50 p-5 rounded-3xl transition-all hover:scale-[1.02] group shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                    {item.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{item.price}</span>
                </div>
                <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-amber-400 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-bold">{item.rating}</span>
                <a
                  href={`https://wa.me/918768138086?text=Hi!%20I%20want%20to%20order%20${encodeURIComponent(item.name)}%20(${item.price})`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-amber-300 hover:text-white flex items-center gap-1 font-bold"
                >
                  <span>Order via WhatsApp</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BOTTOM AGENCY FOOTER (The ₹2,999 Offer) */}
      <footer className="border-t border-slate-800 bg-[#030509] py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="text-sm font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <span>Crafted by</span>
              <span className="text-amber-400 font-mono">Mithun Das AI Automation</span>
            </p>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Want this exact high-speed digital menu + 1-click WhatsApp reservation engine starting at ₹2,999/-?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918768138086?text=Hi%20Mithun!%20I%20want%20to%20order%20this%20Restaurant%20Website%20at%20%E2%82%B92999."
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all shadow-lg shadow-amber-500/20"
            >
              Claim Restaurant Website (₹2,999/-)
            </a>
          </div>
        </div>
      </footer>

      {/* 6. MOBILE STICKY 1-TAP BOTTOM ACTION BAR (Ultra-Responsive) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-amber-500/30 p-2.5 backdrop-blur-xl flex items-center gap-2 shadow-2xl">
        <a
          href="tel:8768138086"
          className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>Call Dine</span>
        </a>
        <a
          href="https://wa.me/918768138086?text=Hello%20Royal%20Dine!%20I%20want%20to%20reserve%20a%20table."
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>WhatsApp Table</span>
        </a>
      </div>
    </div>
  );
}
