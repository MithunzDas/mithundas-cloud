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
  ArrowRight
} from "lucide-react";

export default function RestaurantDemoPage() {
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("2 Guests");
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Dinner (8:00 PM)");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isReserved, setIsReserved] = useState(false);

  const menuItems = [
    {
      name: "Signature Kolkata Mutton Biryani",
      category: "mains",
      desc: "Fragrant long-grain aged basmati rice cooked in dum with succulent melt-in-mouth mutton and slow-cooked golden potato.",
      price: "₹380",
      tag: "🔥 CHEF SPECIAL",
      rating: "4.9★"
    },
    {
      name: "Tandoori Whole Bhetki / Pomfret",
      category: "starters",
      desc: "Fresh catch marinated in roasted red spices, mustard oil, and char-grilled in traditional clay oven.",
      price: "₹450",
      tag: "⚡ BESTSELLER",
      rating: "4.9★"
    },
    {
      name: "Butter Garlic Prawns",
      category: "starters",
      desc: "Jumbo Bay of Bengal prawns tossed in herb-infused European butter, garlic chips, and white wine glaze.",
      price: "₹420",
      tag: "MUST TRY",
      rating: "4.8★"
    },
    {
      name: "Smoked Paneer Tikka Lababdar",
      category: "mains",
      desc: "Charcoal-roasted cottage cheese simmered in rich creamy tomato-cashew gravy with crushed kasuri methi.",
      price: "₹290",
      tag: "VEG DELIGHT",
      rating: "4.8★"
    },
    {
      name: "Blueberry Cheesecake with Belgian Chocolate",
      category: "desserts",
      desc: "New York style baked cream cheese on buttery biscuit crust topped with wild blueberry compote.",
      price: "₹220",
      tag: "SWEET ENDING",
      rating: "4.9★"
    },
    {
      name: "Artisanal Cold Brew & Hazelnut Mocha",
      category: "beverages",
      desc: "18-hour slow-steeped Arabica coffee beans served over crystal ice with hazelnut cream.",
      price: "₹180",
      tag: "CAFE FAVORITE",
      rating: "4.7★"
    }
  ];

  const filteredMenu = activeCategory === "all"
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleTableBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName) {
      alert("Please enter your name");
      return;
    }

    const text = `Hello Royal Dine Restaurant! I would like to reserve a table.%0A%0A👤 Guest Name: ${encodeURIComponent(guestName)}%0A👥 Party Size: ${encodeURIComponent(guestCount)}%0A📅 Date: ${encodeURIComponent(bookingDate || "Tonight")}%0A⏰ Time Slot: ${encodeURIComponent(timeSlot)}%0A%0A(Sent via mithundas.cloud 1-Click Restaurant Table Booking Demo)`;

    window.open(`https://wa.me/918768138086?text=${text}`, "_blank");
    setIsReserved(true);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Floating Agency Conversion Banner */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 px-4 py-2.5 shadow-2xl backdrop-blur-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-white">
          <div className="flex items-center gap-2">
            <span className="bg-black/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-amber-200 border border-white/20">
              RESTAURANT SHOWCASE DEMO
            </span>
            <span className="font-semibold hidden md:inline">
              Interactive Digital Menu + 1-Click WhatsApp Table Reservation &amp; Takeaway Engine
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-amber-200">Starts at ₹2,999/-</span>
            <a
              href="https://wa.me/918768138086?text=Hi%20Mithun!%20I%20saw%20your%20Restaurant%20Demo.%20I%20want%20this%20website%20for%20my%20restaurant/cafe%20at%20%E2%82%B92999."
              target="_blank"
              rel="noreferrer"
              className="bg-black text-amber-300 hover:text-white px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Get This For Your Restaurant</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-10 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>The Royal Dine &amp; Gourmet Lounge</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  KITCHEN OPEN
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" /> Kolkata • 4.8★ (650+ Google Reviews)
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:8768138086"
              className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+91 87681 38086</span>
            </a>
            <a
              href="#reserve"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shadow-lg shadow-amber-500/20"
            >
              Reserve Table
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Dum Biryani • Continental Delights • Handcrafted Mocktails</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Flavors That Celebrate <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Every Moment.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Step into an ambient dining paradise where authentic slow-cooked recipes meet contemporary culinary mastery. Perfect for family dinners, romantic dates, and corporate parties.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>4.8 / 5.0</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">650+ Foodie Reviews</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1 text-orange-400 font-bold text-sm">
                  <Flame className="w-4 h-4" />
                  <span>Live Charcoal</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Authentic Clay Tandoor</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>100% Fresh</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Locally Sourced Meat</p>
              </div>
            </div>
          </div>

          {/* Right Column: 1-Click WhatsApp Table Reservation Form */}
          <div id="reserve" className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-amber-500/10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Instant Table Booking</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Zero Waiting Time • VIP Seat Reserve</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                  NO COVER CHARGE
                </span>
              </div>

              <form onSubmit={handleTableBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Rahul Sen"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Table Size / Guests</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="2 Guests (Couple Table)">👫 2 Guests (Couple Table)</option>
                    <option value="4 Guests (Family Table)">👨‍👩‍👧‍👦 4 Guests (Family Table)</option>
                    <option value="6-10 Guests (Large Party / Birthday)">🎉 6-10 Guests (Party Table)</option>
                    <option value="12+ Corporate Group">💼 12+ Corporate Group</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Preferred Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                    >
                      <option value="Lunch (1:00 PM - 3:00 PM)">Lunch (1 PM - 3 PM)</option>
                      <option value="Evening Snacks (5:30 PM)">Snacks (5:30 PM)</option>
                      <option value="Prime Dinner (8:00 PM - 10:30 PM)">Dinner (8 PM - 10:30 PM)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Reserve Table via WhatsApp</span>
                </button>
              </form>

              {isReserved && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Opening WhatsApp with your reservation details!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Digital Menu Section */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore Our Signature Menu
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Fresh handcrafted dishes prepared to perfection every single day.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
            {[
              { id: "all", label: "🌟 All Dishes" },
              { id: "starters", label: "🍢 Tandoor & Starters" },
              { id: "mains", label: "🍛 Signature Mains" },
              { id: "desserts", label: "🍰 Gourmet Desserts" },
              { id: "beverages", label: "☕ Mocktails & Brews" }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all hover:bg-slate-900 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                    {item.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {item.price}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-bold">{item.rating}</span>
                <a
                  href={`https://wa.me/918768138086?text=Hi!%20I%20want%20to%20order%20${encodeURIComponent(item.name)}%20for%20takeaway/dine-in.`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-amber-300 hover:text-white flex items-center gap-1 font-bold"
                >
                  <span>Order via WhatsApp</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Agency Hook */}
      <footer className="border-t border-slate-800 bg-[#04060a] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="text-sm font-bold text-white">
              Digital Menu &amp; WhatsApp Reservation System by <span className="text-amber-400">Mithun Das AI Automation</span>
            </p>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Want a digital menu + automated table booking system for your restaurant/cafe starting at ₹2,999/-?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918768138086?text=Hi%20Mithun!%20I%20want%20a%20Restaurant%20Website%20at%20%E2%82%B92999."
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all shadow-lg shadow-amber-500/20"
            >
              Order For Your Cafe / Restaurant (₹2,999/-)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
