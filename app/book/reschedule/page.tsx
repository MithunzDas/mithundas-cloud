"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Lock,
  Sun,
  Moon,
  RotateCcw,
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

const AFTERNOON_EVENING_SLOTS_IST = [
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
];

const NIGHT_LATENIGHT_SLOTS_IST = [
  "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM",
  "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM",
  "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM",
  "02:00 AM", "02:30 AM",
];

function RescheduleContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId") || "";

  const [selectedTimeZone, setSelectedTimeZone] = useState("Asia/Kolkata");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string; bookingId: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchBookedSlots = async () => {
    try {
      const res = await fetch("/api/book");
      if (res.ok) {
        const data = await res.json();
        setBookedSlots(data.bookedSlots || []);
      }
    } catch (err) {
      console.warn("Failed to fetch booked slots", err);
    }
  };

  useEffect(() => {
    fetchBookedSlots();
    const interval = setInterval(fetchBookedSlots, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    setSelectedDate(todayStr);

    try {
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const match = TIMEZONES.find((tz) => tz.value === userTz);
      if (match) setSelectedTimeZone(match.value);
    } catch (e) {}
  }, []);

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

  // Determine if a slot is PAST, TOO SOON (within 2-hour prep buffer), or AVAILABLE
  const getSlotStatus = (slotIST: string, dateStr: string) => {
    try {
      // Get today's date in IST (not UTC!) to handle post-midnight correctly
      const nowUTC = new Date();
      const istOffsetMs = 5.5 * 60 * 60 * 1000;
      const nowIST = new Date(nowUTC.getTime() + istOffsetMs);
      const todayIST = nowIST.toISOString().split("T")[0];

      if (dateStr !== todayIST) {
        if (dateStr < todayIST) return "PAST";
        return "AVAILABLE";
      }

      const [timeStr, modifier] = slotIST.split(" ");
      let [hours, minutes] = timeStr.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const slotDate = new Date(`${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+05:30`);
      const now = new Date();
      const minBookableTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      if (slotDate.getTime() < now.getTime()) {
        return "PAST";
      }
      if (slotDate.getTime() < minBookableTime.getTime()) {
        return "TOO_SOON";
      }
      return "AVAILABLE";
    } catch (e) {
      return "AVAILABLE";
    }
  };

  const isSlotBooked = (slotIST: string, dateStr: string) => {
    const normSlot = slotIST.replace(/^0/, "").toUpperCase().trim();
    return bookedSlots.some(
      (s) => s.bookingId !== bookingId && s.date === dateStr && s.time.replace(/^0/, "").toUpperCase().trim() === normSlot
    );
  };

  const handleRescheduleSubmit = async () => {
    if (!bookingId || !selectedDate || !selectedTimeSlot) {
      setErrorMsg("Please select a date and time slot.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/book/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          newDate: selectedDate,
          newTime: selectedTimeSlot,
          newTimeZone: selectedTimeZone,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to reschedule session");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process reschedule request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSlotButton = (slotIST: string) => {
    const localTimeStr = convertISTSlotToLocal(slotIST, selectedDate, selectedTimeZone);
    const isSelected = selectedTimeSlot === slotIST;
    const slotStatus = getSlotStatus(slotIST, selectedDate);
    const isPast = slotStatus === "PAST";
    const isTooSoon = slotStatus === "TOO_SOON";
    const isBooked = isSlotBooked(slotIST, selectedDate);
    const isDisabled = isPast || isTooSoon || isBooked;

    return (
      <button
        key={slotIST}
        type="button"
        disabled={isDisabled}
        onClick={() => setSelectedTimeSlot(slotIST)}
        className={`py-2.5 px-3 rounded-xl border text-xs font-mono transition-all flex flex-col items-center justify-center gap-0.5 ${
          isBooked
            ? "bg-red-950/40 border-red-900/50 text-red-400/60 cursor-not-allowed opacity-60"
            : isPast
            ? "bg-slate-950/80 border-slate-900 text-slate-600/70 cursor-not-allowed opacity-30"
            : isTooSoon
            ? "bg-amber-950/20 border-amber-900/40 text-amber-400/70 cursor-not-allowed opacity-60"
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
        <div className="flex items-center gap-1">
          <span className={`text-[9px] ${isTooSoon ? "text-amber-400/90 font-bold" : "text-slate-500"}`}>
            {isBooked ? "[BOOKED]" : isPast ? "[PAST]" : isTooSoon ? "[TOO SOON]" : `(${slotIST} IST)`}
          </span>
        </div>
      </button>
    );
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-[#080b11] text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-emerald-500/30 bg-[#0f172a] p-8 text-center space-y-5 shadow-2xl">
          <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Discovery Session Rescheduled! 🎉</h2>
          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            Your discovery call reference <strong>{bookingId}</strong> has been updated to:
          </p>
          <div className="bg-[#080b11] border border-slate-800 rounded-xl p-4 font-mono text-xs text-sky-300">
            <div>📅 Date: {selectedDate}</div>
            <div>⏰ Time: {convertISTSlotToLocal(selectedTimeSlot, selectedDate, selectedTimeZone)}</div>
          </div>
          <a
            href={`https://mithundas.cloud/meet/${bookingId}`}
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 font-bold text-white text-xs shadow-lg shadow-sky-500/20"
          >
            <span>Open Custom Video Meeting Room</span>
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#080b11] text-slate-100 font-sans flex flex-col justify-between">
      <header className="border-b border-sky-500/20 bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="https://mithundas.cloud" className="flex items-center gap-3">
            <img src="https://mithundas.cloud/logo.png" alt="Mithun Das AI" className="h-9 w-9 rounded-xl border border-sky-500/30" />
            <div>
              <span className="font-extrabold text-base text-white block leading-none">Mithun Das</span>
              <span className="text-[10px] font-mono text-sky-400 uppercase font-bold block mt-0.5">AI AUTOMATION</span>
            </div>
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 w-full flex-1">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs font-semibold">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reschedule Discovery Call</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Select Your New Discovery Session Slot</h1>
          {bookingId && <p className="text-xs font-mono text-slate-400">Booking Reference: {bookingId}</p>}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0f172a]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon className="h-3.5 w-3.5 text-sky-400" />
              Select New Date
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border border-sky-500/30 bg-[#080b11] p-3 text-xs font-mono text-sky-300 focus:outline-none focus:border-sky-400 [color-scheme:dark] cursor-pointer shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Globe className="h-4 w-4 text-sky-400" />
              <span>Time Zone:</span>
            </div>
            <select
              value={selectedTimeZone}
              onChange={(e) => setSelectedTimeZone(e.target.value)}
              className="rounded-lg border border-sky-500/30 bg-[#080b11] px-3 py-1.5 text-xs font-mono text-sky-300"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-sky-400 uppercase">
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span>Afternoon &amp; Evening Sessions</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {AFTERNOON_EVENING_SLOTS_IST.map((slotIST) => renderSlotButton(slotIST))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-indigo-400 uppercase">
                <Moon className="h-3.5 w-3.5 text-indigo-400" />
                <span>Night &amp; Late Night Sessions</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {NIGHT_LATENIGHT_SLOTS_IST.map((slotIST) => renderSlotButton(slotIST))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={isSubmitting || !selectedDate || !selectedTimeSlot}
              onClick={handleRescheduleSubmit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-bold text-slate-950 text-xs shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all"
            >
              <span>{isSubmitting ? "Updating Slot..." : "Confirm New Session Time"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ReschedulePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080b11] text-slate-400 p-8 font-mono text-xs">Loading Reschedule Portal...</div>}>
      <RescheduleContent />
    </Suspense>
  );
}
