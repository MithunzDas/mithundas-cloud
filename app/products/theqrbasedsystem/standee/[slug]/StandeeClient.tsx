"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Printer,
  Download,
  Star,
  Sparkles,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Building2
} from "lucide-react";

interface StandeeClientProps {
  slug: string;
  businessName: string;
  category: string;
  city?: string | null;
}

export default function StandeeClient({
  slug,
  businessName,
  category,
  city,
}: StandeeClientProps) {
  const [format, setFormat] = useState<"a5" | "tent" | "script">("a5");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isLoadingQr, setIsLoadingQr] = useState<boolean>(true);

  // Full URL that the QR code will open
  const fullReviewUrl = typeof window !== "undefined"
    ? `${window.location.origin}/r/${slug}`
    : `https://mithundas.cloud/r/${slug}`;

  useEffect(() => {
    // Generate QR code on client mount
    const fetchQr = async () => {
      try {
        const res = await fetch(`/api/qr-review/qr-code?text=${encodeURIComponent(fullReviewUrl)}`);
        const data = await res.json();
        if (data.success && data.dataUrl) {
          setQrDataUrl(data.dataUrl);
        }
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      } finally {
        setIsLoadingQr(false);
      }
    };
    fetchQr();
  }, [fullReviewUrl]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6">
      {/* Non-printable Control Toolbar */}
      <div className="max-w-4xl mx-auto mb-8 space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <Link
            href={`/products/theqrbasedsystem/dashboard/${slug}`}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          {/* Format Selector Tabs */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setFormat("a5")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === "a5"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              A5 Acrylic Standee
            </button>
            <button
              onClick={() => setFormat("tent")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === "tent"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              4x6" Table Tent Card
            </button>
            <button
              onClick={() => setFormat("script")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === "script"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ⭐ Front-Desk Script
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/25 flex items-center gap-2 text-xs active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center justify-between text-xs text-blue-300">
          <span>
            💡 <strong>Printing Tip:</strong> In your browser print dialog, set layout to <strong>Portrait</strong> and margins to <strong>None / Minimum</strong> for best results.
          </span>
          <span className="font-mono text-[11px] text-blue-400/80">{fullReviewUrl}</span>
        </div>
      </div>

      {/* PRINTABLE DISPLAY CONTAINER */}
      <div className="max-w-xl mx-auto">
        {format === "script" ? (
          /* FRONT-DESK RECEPTIONIST CHEAT SHEET */
          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border-4 border-amber-400 space-y-6 print:shadow-none print:border-2 print:p-6 print:m-0">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
              <div>
                <span className="bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                  Staff Training Card
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  The Front-Desk 7-Word Review Script
                </h2>
                <p className="text-xs text-slate-500">For {businessName} Receptionists & Staff</p>
              </div>
              <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                When handing the patient/customer their receipt or bill, SAY THIS:
              </p>
              <blockquote className="text-base sm:text-lg font-extrabold text-slate-900 italic leading-snug">
                "While your receipt is printing, could you tap this QR code on the counter? It takes 10 seconds and helps Dr. Smith immensely!"
              </blockquote>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                Why this 7-word script works 8x better than leaving the standee silent:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Friction:</strong> Customers have their phones already in hand at checkout.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Time Anchor:</strong> Saying "10 seconds" removes the fear of a long survey.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Personal Connection:</strong> Mentioning the doctor or stylist by name triggers empathy.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
              <span>Mithun Das AI Business Platform • QR Review System</span>
              <span>Keep this printed sheet behind the reception desk!</span>
            </div>
          </div>
        ) : (
          /* PHYSICAL PRINTABLE STANDEE (A5 OR TENT CARD) */
          <div
            id="printable-standee"
            className={`bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border-4 border-slate-900 flex flex-col items-center text-center justify-between space-y-6 print:shadow-none print:border-4 print:p-8 print:m-0 ${
              format === "a5" ? "min-h-[640px]" : "min-h-[500px]"
            }`}
          >
            {/* Header / Business Name */}
            <div className="space-y-2 w-full border-b-2 border-slate-100 pb-4">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-6 h-6 fill-amber-400 text-amber-500" />
                ))}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                {businessName}
              </h2>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                {city ? `${city} • ` : ""}Google Reviews
              </p>
            </div>

            {/* Core Hook */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Loved Your Visit Today?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                Scan with your phone camera to share your quick feedback in <strong>15 seconds</strong>!
              </p>
            </div>

            {/* High-Contrast QR Code Card */}
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-3xl shadow-inner flex flex-col items-center">
              {isLoadingQr ? (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                  <span>Loading high-res QR code...</span>
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${businessName}`}
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-red-500 text-xs">
                  Could not load QR
                </div>
              )}
              <span className="text-[11px] font-mono text-slate-500 mt-2">
                Scan with standard smartphone camera
              </span>
            </div>

            {/* 3 Step Micro Guide */}
            <div className="grid grid-cols-3 gap-2 w-full pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <div className="space-y-1">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold inline-flex items-center justify-center text-[10px]">
                  1
                </span>
                <p className="font-semibold">Scan QR</p>
              </div>
              <div className="space-y-1">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold inline-flex items-center justify-center text-[10px]">
                  2
                </span>
                <p className="font-semibold">Tap 4 Answers</p>
              </div>
              <div className="space-y-1">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold inline-flex items-center justify-center text-[10px]">
                  3
                </span>
                <p className="font-semibold">Copy & Post</p>
              </div>
            </div>

            {/* Footer Trust Marker */}
            <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Google Maps Review Partner</span>
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          #printable-standee {
            border: 4px solid black !important;
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
