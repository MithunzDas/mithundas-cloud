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
  ownerName?: string | null;
  category: string;
  city?: string | null;
}

interface StaffScriptConfig {
  roleSubtitle: string;
  contextPrompt: string;
  defaultBeneficiary: string;
  scriptText: (name: string) => string;
  bullet1: { title: string; desc: string };
  bullet2: { title: string; desc: string };
  bullet3: { title: string; desc: string };
}

function resolveStaffTrainingScript(
  category: string,
  businessName: string,
  ownerName?: string | null
): StaffScriptConfig {
  const catUpper = (category || "").toUpperCase().trim();
  const nameLower = (businessName || "").toLowerCase();

  const getDoctorFormattedName = (): string => {
    if (ownerName && ownerName.trim()) {
      const clean = ownerName.trim();
      return /^dr\.?\s+/i.test(clean) ? clean : `Dr. ${clean}`;
    }
    const drMatch = businessName.match(/Dr\.?\s+([A-Za-z]+)/i);
    if (drMatch) return `Dr. ${drMatch[1]}`;
    return "our doctor & medical team";
  };

  // 1. HOTEL / HOSPITALITY / RESORT
  if (
    catUpper.includes("HOTEL") ||
    catUpper.includes("RESORT") ||
    catUpper.includes("HOSPITALITY") ||
    nameLower.includes("hotel") ||
    nameLower.includes("resort") ||
    nameLower.includes("inn") ||
    nameLower.includes("suites") ||
    nameLower.includes("lodge") ||
    nameLower.includes("hospitality")
  ) {
    const beneficiary = ownerName?.trim() ? `${ownerName.trim()} & our hotel team` : "our hotel team";
    return {
      roleSubtitle: `For ${businessName} Front-Desk, Reception & Hospitality Staff`,
      contextPrompt: "WHEN CHECKING OUT A GUEST OR HANDING OVER THEIR ROOM INVOICE & RECEIPT, SAY THIS:",
      defaultBeneficiary: beneficiary,
      scriptText: (name) => `"While your receipt is printing, could you tap this QR code on the counter? It takes 10 seconds and helps ${name} immensely!"`,
      bullet1: {
        title: "Zero Friction",
        desc: "Guests already have their smartphones in hand while settling bills at reception.",
      },
      bullet2: {
        title: "Time Anchor",
        desc: "Saying '10 seconds' eliminates hesitation and the fear of a tedious hotel survey.",
      },
      bullet3: {
        title: "Personal Connection",
        desc: "Mentioning the team or front-desk host by name triggers genuine guest empathy and 5-star ratings.",
      },
    };
  }

  // 2. RESTAURANT / CAFE / DINING
  if (
    catUpper.includes("RESTAU") ||
    catUpper.includes("CAFE") ||
    catUpper.includes("DINING") ||
    catUpper.includes("BISTRO") ||
    catUpper.includes("BAKER") ||
    catUpper.includes("FOOD") ||
    nameLower.includes("restaurant") ||
    nameLower.includes("cafe") ||
    nameLower.includes("bistro") ||
    nameLower.includes("bakery") ||
    nameLower.includes("kitchen") ||
    nameLower.includes("diner") ||
    nameLower.includes("grill")
  ) {
    const beneficiary = ownerName?.trim() ? `${ownerName.trim()} & our culinary team` : "our chef & serving team";
    return {
      roleSubtitle: `For ${businessName} Hosts, Servers & Front-of-House Staff`,
      contextPrompt: "WHEN PRESENTING THE BILL FOLDER OR TENDERED RECEIPT TO THE GUEST, SAY THIS:",
      defaultBeneficiary: beneficiary,
      scriptText: (name) => `"While your bill is processing, could you tap this QR code on the table? It takes 10 seconds and helps ${name} immensely!"`,
      bullet1: {
        title: "Zero Friction",
        desc: "Diners naturally look at their phones while waiting for card payments to clear.",
      },
      bullet2: {
        title: "Time Anchor",
        desc: "Saying '10 seconds' assures diners they won't be stuck filling long forms.",
      },
      bullet3: {
        title: "Personal Connection",
        desc: "Mentioning the chef, server, or kitchen team by name connects great dining to real people.",
      },
    };
  }

  // 3. SALON / SPA / BEAUTY / BARBERSHOP
  if (
    catUpper.includes("SALON") ||
    catUpper.includes("SPA") ||
    catUpper.includes("BEAUTY") ||
    catUpper.includes("HAIR") ||
    catUpper.includes("BARBER") ||
    nameLower.includes("salon") ||
    nameLower.includes("spa") ||
    nameLower.includes("barber") ||
    nameLower.includes("hair") ||
    nameLower.includes("beauty") ||
    nameLower.includes("nails")
  ) {
    const beneficiary = ownerName?.trim() ? `${ownerName.trim()} & our styling team` : "your stylist & our team";
    return {
      roleSubtitle: `For ${businessName} Receptionists, Stylists & Therapists`,
      contextPrompt: "WHEN RINGING UP THE CLIENT AT THE CHECKOUT REGISTER OR WRAPPING UP THEIR VISIT, SAY THIS:",
      defaultBeneficiary: beneficiary,
      scriptText: (name) => `"While your receipt is printing, could you tap this QR code on the counter? It takes 10 seconds and helps ${name} immensely!"`,
      bullet1: {
        title: "Zero Friction",
        desc: "Clients have their phones in hand while settling the bill after their service.",
      },
      bullet2: {
        title: "Time Anchor",
        desc: "Saying '10 seconds' removes hesitation before they step out the door.",
      },
      bullet3: {
        title: "Personal Connection",
        desc: "Mentioning your stylist, barber, or therapist by name locks in personal loyalty and empathy.",
      },
    };
  }

  // 4. DENTIST / DENTAL CLINIC
  if (
    catUpper.includes("DENT") ||
    nameLower.includes("dent") ||
    nameLower.includes("orthodont") ||
    nameLower.includes("teeth") ||
    nameLower.includes("smile")
  ) {
    const docName = getDoctorFormattedName();
    return {
      roleSubtitle: `For ${businessName} Front-Desk, Receptionists & Dental Staff`,
      contextPrompt: "WHEN SCHEDULING THE NEXT APPOINTMENT OR HANDING THE PATIENT THEIR RECEIPT, SAY THIS:",
      defaultBeneficiary: docName,
      scriptText: (name) => `"While your receipt is printing, could you tap this QR code on the counter? It takes 10 seconds and helps ${name} immensely!"`,
      bullet1: {
        title: "Zero Friction",
        desc: "Patients already have their phones out to mark their calendar for the next checkup.",
      },
      bullet2: {
        title: "Time Anchor",
        desc: "Saying '10 seconds' removes any fear of clinical paperwork or long questionnaires.",
      },
      bullet3: {
        title: "Personal Connection",
        desc: `Mentioning ${docName} by name relieves anxiety and triggers deep patient gratitude.`,
      },
    };
  }

  // 5. CLINIC / MEDICAL DOCTOR / SPECIALISTS / HEALTHCARE
  if (
    catUpper.includes("DOCTOR") ||
    catUpper.includes("CLINIC") ||
    catUpper.includes("MED") ||
    catUpper.includes("HEALTH") ||
    catUpper.includes("ENDOCRIN") ||
    nameLower.includes("clinic") ||
    nameLower.includes("doctor") ||
    nameLower.includes("hospital") ||
    nameLower.includes("health") ||
    nameLower.includes("medical")
  ) {
    const docName = getDoctorFormattedName();
    return {
      roleSubtitle: `For ${businessName} Front-Desk, Clinic Receptionists & Care Staff`,
      contextPrompt: "WHEN HANDING THE PATIENT THEIR PRESCRIPTION, RECEIPT, OR FOLLOW-UP SLIP, SAY THIS:",
      defaultBeneficiary: docName,
      scriptText: (name) => `"While your receipt is printing, could you tap this QR code on the counter? It takes 10 seconds and helps ${name} immensely!"`,
      bullet1: {
        title: "Zero Friction",
        desc: "Patients already have their phones in hand while checking prescription notes.",
      },
      bullet2: {
        title: "Time Anchor",
        desc: "Saying '10 seconds' guarantees a friction-free, quick 4-tap feedback flow.",
      },
      bullet3: {
        title: "Personal Connection",
        desc: `Mentioning ${docName} by name inspires genuine patient trust and 5-star Google reviews.`,
      },
    };
  }

  // 6. GYM / FITNESS
  if (
    catUpper.includes("GYM") ||
    catUpper.includes("FIT") ||
    nameLower.includes("gym") ||
    nameLower.includes("fitness") ||
    nameLower.includes("crossfit") ||
    nameLower.includes("workout")
  ) {
    const beneficiary = ownerName?.trim() ? `${ownerName.trim()} & our trainers` : "our coaching team";
    return {
      roleSubtitle: `For ${businessName} Front-Desk, Coaches & Fitness Staff`,
      contextPrompt: "WHEN CHECKING OUT A MEMBER OR SAYING GOODBYE AT THE FRONT COUNTER, SAY THIS:",
      defaultBeneficiary: beneficiary,
      scriptText: (name) => `"Before you head out, could you tap this QR code on the desk? It takes 10 seconds and helps ${name} immensely!"`,
      bullet1: {
        title: "Zero Friction",
        desc: "Members are already putting away their workout earphones and checking their phones.",
      },
      bullet2: {
        title: "Time Anchor",
        desc: "Saying '10 seconds' gets an immediate enthusiastic tap on the counter standee.",
      },
      bullet3: {
        title: "Personal Connection",
        desc: "Mentioning your trainers or gym team by name inspires member community and loyalty.",
      },
    };
  }

  // 7. AUTO REPAIR / MECHANIC
  if (
    catUpper.includes("AUTO") ||
    catUpper.includes("MECHANIC") ||
    catUpper.includes("CAR") ||
    catUpper.includes("GARAGE") ||
    nameLower.includes("auto") ||
    nameLower.includes("mechanic") ||
    nameLower.includes("garage") ||
    nameLower.includes("tire") ||
    nameLower.includes("motor")
  ) {
    const beneficiary = ownerName?.trim() ? `${ownerName.trim()} & our mechanics` : "our technicians & mechanics";
    return {
      roleSubtitle: `For ${businessName} Service Advisors, Cashiers & Front Counter Staff`,
      contextPrompt: "WHEN HANDING OVER THE VEHICLE KEYS, WORK ORDER, AND INVOICE, SAY THIS:",
      defaultBeneficiary: beneficiary,
      scriptText: (name) => `"While I grab your keys, could you tap this QR code on the counter? It takes 10 seconds and helps ${name} immensely!"`,
      bullet1: {
        title: "Zero Friction",
        desc: "Vehicle owners wait at the counter while keys and final invoice are prepared.",
      },
      bullet2: {
        title: "Time Anchor",
        desc: "Saying '10 seconds' ensures they finish the quick review before walking to their car.",
      },
      bullet3: {
        title: "Personal Connection",
        desc: "Mentioning the technician or service advisor by name turns repairs into trusted relationships.",
      },
    };
  }

  // 8. GENERAL SERVICES FALLBACK
  const defaultBeneficiary = ownerName?.trim() ? `${ownerName.trim()} & our team` : "our team";
  return {
    roleSubtitle: `For ${businessName} Front-Desk, Receptionists & Customer Staff`,
    contextPrompt: "WHEN HANDING THE CUSTOMER THEIR RECEIPT, BILL, OR INVOICE, SAY THIS:",
    defaultBeneficiary,
    scriptText: (name) => `"While your receipt is printing, could you tap this QR code on the counter? It takes 10 seconds and helps ${name} immensely!"`,
    bullet1: {
      title: "Zero Friction",
      desc: "Customers already have their phones in hand at the counter checkout.",
    },
    bullet2: {
      title: "Time Anchor",
      desc: "Saying '10 seconds' removes the fear of a long or boring survey.",
    },
    bullet3: {
      title: "Personal Connection",
      desc: "Mentioning the team or specialist by name triggers personal empathy and high ratings.",
    },
  };
}

export default function StandeeClient({
  slug,
  businessName,
  ownerName,
  category,
  city,
}: StandeeClientProps) {
  const [format, setFormat] = useState<"a5" | "tent" | "script">("a5");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isLoadingQr, setIsLoadingQr] = useState<boolean>(true);
  const [customPersonName, setCustomPersonName] = useState<string>("");

  const scriptConfig = resolveStaffTrainingScript(category, businessName, ownerName);
  const activeBeneficiary = customPersonName.trim() || scriptConfig.defaultBeneficiary;

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

        {/* Dynamic Personalization Customizer for Staff Script */}
        {format === "script" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Personalize Script:</strong> Edit who the script asks customers to help (preview updates live below):
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={customPersonName}
                onChange={(e) => setCustomPersonName(e.target.value)}
                placeholder={scriptConfig.defaultBeneficiary}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-60"
              />
              {customPersonName && (
                <button
                  onClick={() => setCustomPersonName("")}
                  className="text-[11px] text-slate-400 hover:text-white underline whitespace-nowrap"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}

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
                <p className="text-xs text-slate-500">{scriptConfig.roleSubtitle}</p>
              </div>
              <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {scriptConfig.contextPrompt}
              </p>
              <blockquote className="text-base sm:text-lg font-extrabold text-slate-900 italic leading-snug">
                {scriptConfig.scriptText(activeBeneficiary)}
              </blockquote>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                Why this 7-word script works 8x better than leaving the standee silent:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{scriptConfig.bullet1.title}:</strong> {scriptConfig.bullet1.desc}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{scriptConfig.bullet2.title}:</strong> {scriptConfig.bullet2.desc}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{scriptConfig.bullet3.title}:</strong> {scriptConfig.bullet3.desc}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
              <span>MITHUN DAS AI AUTOMATION • QR Review System</span>
              <span>Keep this printed sheet behind the front desk!</span>
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
