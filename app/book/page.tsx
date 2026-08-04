"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  User,
  Mail,
  Building2,
  Sparkles,
  CheckCircle2,
  Video,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Lock,
} from "lucide-react";

const TIMEZONES = [
  { label: "US Eastern (EST / EDT)", value: "America/New_York" },
  { label: "US Pacific (PST / PDT)", value: "America/Los_Angeles" },
  { label: "US Central (CST / CDT)", value: "America/Chicago" },
  { label: "UK GMT / BST", value: "Europe/London" },
  { label: "Europe CET (Paris/Berlin)", value: "Europe/Paris" },
  { label: "Australia Sydney (AEST)", value: "Australia/Sydney" },
  { label: "India (IST)", value: "Asia/Kolkata" },
  { label: "Singapore / Asia (SGT)", value: "Asia/Singapore" },
  { label: "Dubai / UAE (GST)", value: "Asia/Dubai" },
];

// 12:00 PM IST (noon) to 02:30 AM IST (late night) - 15 Active Hours
const AVAILABLE_SLOTS_IST = [
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
  "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM",
  "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM",
  "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM",
  "02:00 AM", "02:30 AM"
];

function BookDiscoveryCallContent() {
  const searchParams = useSearchParams();
  const [selectedTimeZone, setSelectedTimeZone] = useState("America/New_York");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string }[]>([]);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Step navigation: 1 = Date/Time, 2 = Intake Info, 3 = Confirmation
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);

  // Form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    businessType: "",
    projectRequirement: "",
  });

  // Fetch booked slots to prevent double booking
  const fetchBookedSlots = async () => {
    try {
      const res = await fetch("/api/book");
      if (res.ok) {
        const data = await res.json();
        setBookedSlots(data.bookedSlots || []);
      }
    } catch (err) {
      console.warn("Failed to fetch existing booked slots", err);
    }
  };

  // Auto-detect timezone, fetch booked slots, and parse URL query parameters
  useEffect(() => {
    fetchBookedSlots();

    try {
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const match = TIMEZONES.find((tz) => tz.value === userTz);
      if (match) {
        setSelectedTimeZone(match.value);
      }
    } catch (e) {
      console.log("Could not auto-detect timezone", e);
    }

    // Default to Today's date
    const todayStr = new Date().toISOString().split("T")[0];
    setSelectedDate(todayStr);

    // Parse URL query parameters if lead comes from Email 1 link
    if (searchParams) {
      const qName = searchParams.get("name");
      const qEmail = searchParams.get("email");
      const qCompany = searchParams.get("company");
      const qType = searchParams.get("businessType");
      const qReq = searchParams.get("requirement") || searchParams.get("req");

      if (qName || qEmail || qCompany) {
        setFormData({
          name: qName || "",
          email: qEmail || "",
          company: qCompany || "",
          businessType: qType || "General",
          projectRequirement: qReq || "",
        });
      }
    }
  }, [searchParams]);

  // Convert IST slot into client's local selected timezone
  const convertISTSlotToLocal = (slotIST: string, dateStr: string, targetTz: string) => {
    try {
      const [timeStr, modifier] = slotIST.split(" ");
      let [hours, minutes] = timeStr.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const baseDate = dateStr || new Date().toISOString().split("T")[0];
      const istDate = new Date(`${baseDate}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+05:30`);
      
      return istDate.toLocaleTimeString("en-US", {
        timeZone: targetTz,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return slotIST;
    }
  };

  // Check if slot has passed or is within 2-hour preparation buffer for TODAY
  const isSlotTooSoonOrPast = (slotIST: string, dateStr: string) => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      if (dateStr !== todayStr) return false; // Only filter today

      const [timeStr, modifier] = slotIST.split(" ");
      let [hours, minutes] = timeStr.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      // Slot date in IST (+05:30)
      const slotDate = new Date(`${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+05:30`);
      
      // Current time + 2 Hours Preparation Buffer (120 mins)
      const minBookableTime = new Date(Date.now() + 2 * 60 * 60 * 1000);

      return slotDate.getTime() < minBookableTime.getTime();
    } catch (e) {
      return false;
    }
  };

  // Check if slot is already booked by another client
  const isSlotBooked = (slotIST: string, dateStr: string) => {
    return bookedSlots.some((s) => s.date === dateStr && s.time === slotIST);
  };

  // Generate 10 quick dates INCLUDING TODAY (skip Sundays)
  const getNextDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      // Skip Sundays
      if (d.getDay() !== 0) {
        const isToday = i === 0;
        dates.push({
          rawDate: d.toISOString().split("T")[0],
          dayName: isToday ? "TODAY" : d.toLocaleDateString("en-US", { weekday: "short" }),
          dayNum: d.getDate(),
          monthName: d.toLocaleDateString("en-US", { month: "short" }),
          isToday,
        });
      }
    }
    return dates;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBookingError(null);

    const bookingId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const meetUrl = `https://mithundas.cloud/meet/${bookingId}`;

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          businessType: formData.businessType,
          projectRequirement: formData.projectRequirement,
          date: selectedDate,
          time: selectedTimeSlot,
          timeZone: selectedTimeZone,
          meetUrl,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to process booking");
      }

      setBookingConfirmation({
        bookingId,
        meetUrl,
        date: selectedDate,
        time: selectedTimeSlot,
        timeZone: selectedTimeZone,
        name: formData.name,
        company: formData.company,
        email: formData.email,
      });
      setStep(3);
    } catch (err: any) {
      console.error("Booking error:", err);
      setBookingError(err.message || "Slot conflict detected. Please select another slot.");
      fetchBookedSlots(); // Refresh booked slots
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080b11] text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Header Bar */}
      <header className="border-b border-sky-500/20 bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://mithundas.cloud/logo.png" alt="Mithun Das AI" className="h-9 w-9 rounded-xl border border-sky-500/30" />
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-none">Mithun Das</span>
              <span className="text-[10px] font-mono text-sky-400 tracking-widest uppercase font-bold">AI AUTOMATION ARCHITECT</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-300">Accepting Q3 Client Projects</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-10 w-full flex-1">
        {/* Step Indicator Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>15-Minute High-Ticket Architecture Discovery Call</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Schedule Your AI Workflow Discovery Session
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Select a date &amp; time in your local timezone. We will map out your exact n8n/Make automation pipeline &amp; issue a Master Service Agreement.
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* STEP 1: Date & Time Slot Selection */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Timezone Selector Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Globe className="h-4 w-4 text-sky-400" />
                  <span>Your Time Zone:</span>
                </div>
                <select
                  value={selectedTimeZone}
                  onChange={(e) => setSelectedTimeZone(e.target.value)}
                  className="rounded-lg border border-sky-500/30 bg-[#080b11] px-3 py-2 text-xs font-mono text-sky-300 focus:outline-none focus:border-sky-400"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection Carousel + Custom Future Calendar Picker */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <CalendarIcon className="h-3.5 w-3.5 text-sky-400" />
                    1. Select Discovery Date (Includes Today)
                  </label>
                  
                  {/* Custom Future Date Input */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-500">Or pick future date:</span>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-sky-400 focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {getNextDates().map((d) => {
                    const isSelected = selectedDate === d.rawDate;
                    return (
                      <button
                        key={d.rawDate}
                        type="button"
                        onClick={() => setSelectedDate(d.rawDate)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/10 font-bold"
                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <span className={`text-[11px] uppercase font-mono ${d.isToday ? "text-amber-400 font-bold" : ""}`}>
                          {d.dayName}
                        </span>
                        <span className="text-lg font-extrabold my-0.5">{d.dayNum}</span>
                        <span className="text-[10px] font-mono text-slate-500">{d.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Picker (2-Hour Buffer + Conflict Check) */}
              <div className="space-y-2 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-sky-400" />
                    2. Select Available Time Slot
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    🔒 Requires 2-hour prep buffer &amp; prevents double booking
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {AVAILABLE_SLOTS_IST.map((slotIST) => {
                    const localTimeStr = convertISTSlotToLocal(slotIST, selectedDate, selectedTimeZone);
                    const isSelected = selectedTimeSlot === slotIST;
                    const isTooSoon = isSlotTooSoonOrPast(slotIST, selectedDate);
                    const isBooked = isSlotBooked(slotIST, selectedDate);
                    const isDisabled = isTooSoon || isBooked;

                    return (
                      <button
                        key={slotIST}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedTimeSlot(slotIST)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-mono transition-all flex flex-col items-center justify-center gap-0.5 ${
                          isBooked
                            ? "bg-red-950/40 border-red-900/50 text-red-400/60 cursor-not-allowed opacity-60"
                            : isTooSoon
                            ? "bg-slate-950/60 border-slate-900 text-slate-600 cursor-not-allowed opacity-40"
                            : isSelected
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-md shadow-emerald-900/20"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {isBooked ? (
                            <Lock className="h-3 w-3 text-red-400" />
                          ) : (
                            <Clock className="h-3 w-3 opacity-60 text-sky-400" />
                          )}
                          <span>{localTimeStr}</span>
                        </div>
                        <span className="text-[9px] text-slate-500">
                          {isBooked ? "[BOOKED]" : isTooSoon ? "[TOO SOON / PAST]" : `(${slotIST} IST)`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedDate || !selectedTimeSlot}
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 font-bold text-white text-xs shadow-lg shadow-sky-500/25 hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all"
                >
                  <span>Enter Project Details</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Client Intake Form */}
          {step === 2 && (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {bookingError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Your Contact &amp; Project Info
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] font-mono text-slate-400 hover:text-slate-200 underline"
                >
                  ← Change Date/Time
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Your Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Athena Das"
                      className="w-full rounded-xl border border-slate-800 bg-[#080b11] py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Work Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="athena@company.com"
                      className="w-full rounded-xl border border-slate-800 bg-[#080b11] py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Company Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. AthenaX EdTech"
                      className="w-full rounded-xl border border-slate-800 bg-[#080b11] py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Industry / Business Type</label>
                  <input
                    type="text"
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    placeholder="e.g. SaaS / EdTech / E-commerce"
                    className="w-full rounded-xl border border-slate-800 bg-[#080b11] py-2 px-3 text-xs text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Brief Overview of Bottlenecks or Requirements *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.projectRequirement}
                  onChange={(e) => setFormData({ ...formData, projectRequirement: e.target.value })}
                  placeholder="e.g. We want to automate our student mock exam evaluation and Meta lead qualification using n8n and OpenAI..."
                  className="w-full rounded-xl border border-slate-800 bg-[#080b11] p-3 text-xs text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none leading-relaxed resize-none"
                />
              </div>

              <div className="pt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-extrabold text-slate-950 text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin text-slate-950" />
                      <span>Confirming Session...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-slate-950" />
                      <span>Confirm &amp; Generate Custom Room Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Instant Booking Confirmation */}
          {step === 3 && bookingConfirmation && (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-white">Discovery Call Confirmed! 🎉</h2>
                <p className="text-xs text-slate-400">
                  Hi <strong>{bookingConfirmation.name}</strong>, your 15-minute session for <strong>{bookingConfirmation.company}</strong> is scheduled.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="max-w-md mx-auto rounded-xl bg-slate-900/90 border border-slate-800 p-4 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500">Date &amp; Time:</span>
                  <span className="text-sky-400 font-bold">{bookingConfirmation.date} @ {bookingConfirmation.time}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-500">Time Zone:</span>
                  <span className="text-slate-300">{bookingConfirmation.timeZone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Reference:</span>
                  <span className="text-slate-400 font-bold">{bookingConfirmation.bookingId}</span>
                </div>
              </div>

              {/* Custom Video Room Link Box */}
              <div className="max-w-md mx-auto rounded-xl bg-sky-500/10 border border-sky-500/30 p-4 space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-sky-400 font-bold uppercase">
                  <Video className="h-4 w-4" />
                  Your Custom Video Meeting Room Link
                </div>
                <div className="rounded-lg bg-[#080b11] p-2.5 text-xs font-mono text-emerald-400 border border-slate-800 break-all select-all">
                  {bookingConfirmation.meetUrl}
                </div>
                <a
                  href={bookingConfirmation.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 text-xs shadow-md shadow-sky-500/20"
                >
                  <Video className="h-4 w-4" />
                  <span>Test Your Video Meeting Room Now ➔</span>
                </a>
              </div>

              <p className="text-[11px] text-slate-500">
                A calendar invitation with your custom video link has been sent to <strong>{bookingConfirmation.email || "your email"}</strong>.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#080b11] py-6 text-center text-xs text-slate-500">
        <p>© 2026 Mithun Das AI Automation. All rights reserved. · <a href="https://mithundas.cloud" className="text-sky-400 hover:underline">mithundas.cloud</a></p>
      </footer>
    </div>
  );
}

export default function BookDiscoveryCallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-[#080b11] flex items-center justify-center text-sky-400 font-mono text-xs">
        Loading Discovery Booking Page...
      </div>
    }>
      <BookDiscoveryCallContent />
    </Suspense>
  );
}
