"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Script from "next/script";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  RefreshCw,
  Sliders,
  Scale,
  UserCheck,
  Building,
  User,
  MapPin,
  Calendar,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Plan Definitions ─── */
const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    credits: 9,
    badge: "1st Time Deal",
    firstTimeOnly: true,
    desc: "9 Credits (3 Affidavits)",
  },
  {
    id: "basic",
    name: "Basic",
    price: 49,
    credits: 49,
    badge: null,
    firstTimeOnly: false,
    desc: "49 Credits (~16 Affidavits)",
  },
  {
    id: "pro",
    name: "Professional",
    price: 99,
    credits: 99,
    badge: "Most Popular",
    firstTimeOnly: false,
    desc: "99 Credits (~33 Affidavits)",
  },
  {
    id: "bulk",
    name: "Bulk",
    price: 499,
    credits: 599,
    badge: "Best Value",
    firstTimeOnly: false,
    desc: "599 Credits (~199 Affidavits)",
  },
];

/* ─── Standard Court Options ─── */
const COURT_OPTIONS = [
  "Before the Notary Public at Barasat, North 24 Parganas",
  "Before the Notary Public at Alipore, South 24 Parganas",
  "Before the Notary Public at City Civil Court, Calcutta",
  "Before the Notary Public at Sealdah Court, Kolkata",
  "Before the Notary Public at Barrackpore, North 24 Parganas",
  "Before the Notary Public at Bongaon, North 24 Parganas",
  "Before the Notary Public at Ranaghat, Nadia",
  "Before the Notary Public at Krishnanagar, Nadia",
  "Before the Notary Public at Siliguri, Darjeeling",
  "Custom Court Header",
];

function AffidavitGenerateContent() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams?.get("plan") || null;

  // View state: 'form' | 'preview'
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [stampMargin, setStampMargin] = useState<boolean>(true); // 14cm stamp margin toggle

  // User & Credit State
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(true);
  const [showBuyModal, setShowBuyModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan || "starter");
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [printAdvocateOnPdf, setPrintAdvocateOnPdf] = useState<boolean>(false); // Default OFF for cybercafes

  // Today's auto-generated verification date (DD/MM/YYYY)
  const today = new Date();
  const formattedToday = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  // Form State
  const [formData, setFormData] = useState({
    // Default Court & Advocate details
    courtHeader: "Before the Notary Public at Barasat, North 24 Parganas",
    customCourt: "",
    courtLocation: "Barasat, North 24 Parganas",
    advocateName: "Debabrata Sarkar",
    advocateEnrollment: "WB/1675/856/2020",
    advocatePhone: "+91 9876543210",
    verificationDate: formattedToday,

    // Applicant (Deponent) details
    applicantName: "SUSANTA NATH",
    guardianType: "S/O",
    fatherName: "SUBASH NATH",
    religion: "HINDU",
    entryDate: "15/12/2012",

    // Applicant India Address
    indiaVillage: "MADHYA HARIA",
    indiaPo: "BANIPUR",
    indiaPs: "HABRA",
    indiaDistrict: "NORTH 24 PARGANAS",
    indiaPin: "743233",
    indiaState: "West Bengal",

    // Bangladesh Origin Address
    bdVillage: "SASHI BHUSAN",
    bdPo: "SASHI BHUSAN",
    bdPs: "CHARFATION",
    bdDistrict: "BHOLA",

    // Witness details (Schedule 1C requirement)
    witnessName: "SADHAN DEY",
    witnessGuardianType: "S/O",
    witnessFather: "DURGAPADA DEY",
    witnessAge: "52",
    witnessOccupation: "BUSINESS",
    witnessVillage: "K.N ROY ROAD",
    witnessPo: "BANIPUR",
    witnessPs: "HABRA",
    witnessDistrict: "North 24 Parganas",
    witnessPin: "743233",
    witnessState: "West Bengal",
  });

  // Load saved session or initialize
  useEffect(() => {
    const savedEmail = localStorage.getItem("affidavit_user_email");
    const savedName = localStorage.getItem("affidavit_user_name");
    const firstPurchase = localStorage.getItem("affidavit_first_purchase_done");

    if (savedEmail) {
      setUserEmail(savedEmail);
      if (savedName) setUserName(savedName);
      fetchBalance(savedEmail);
    }

    if (firstPurchase === "true") {
      setIsFirstTimeUser(false);
      if (initialPlan === "starter") {
        setSelectedPlan("pro");
      }
    }

    if (initialPlan) {
      setShowBuyModal(true);
    }
  }, [initialPlan]);

  const fetchBalance = async (email: string) => {
    try {
      const res = await fetch(`/api/affidavit/balance?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.user) {
        setCreditBalance(data.user.creditBalance);
        if (data.user.isFirstPurchaseDone) {
          setIsFirstTimeUser(false);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const effectiveCourtHeader =
    formData.courtHeader === "Custom Court Header" && formData.customCourt.trim()
      ? formData.customCourt.trim()
      : formData.courtHeader;

  // Handle Razorpay Payment for Credits
  const handlePurchaseCredits = async (planId: string) => {
    if (!userEmail || !userEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address to receive and credit your balance.");
      return;
    }

    setErrorMsg(null);
    setIsPaying(true);

    try {
      // 1. Create order on server
      const res = await fetch("/api/affidavit/purchase-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          email: userEmail.trim(),
          name: userName.trim() || undefined,
        }),
      });

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to initialize payment.");
      }

      // Save user email locally
      localStorage.setItem("affidavit_user_email", userEmail.trim());
      if (userName) localStorage.setItem("affidavit_user_name", userName.trim());

      // 2. Open Razorpay Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Mithun Das Cloud",
        description: `Affidavit Credits (${orderData.planCredits} Credits)`,
        image: "/logo.png",
        order_id: orderData.orderId,
        prefill: {
          name: userName || "",
          email: userEmail,
        },
        theme: {
          color: "#00C6FF",
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            // 3. Verify payment signature on backend
            const verifyRes = await fetch("/api/affidavit/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: orderData.userId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setCreditBalance(verifyData.newBalance);
              setIsFirstTimeUser(false);
              localStorage.setItem("affidavit_first_purchase_done", "true");
              setShowBuyModal(false);
              setPaymentSuccessMsg(
                `🎉 Success! ${verifyData.creditsAdded} credits added. Your new balance is ${verifyData.newBalance} credits.`
              );
              setTimeout(() => setPaymentSuccessMsg(null), 7000);
            } else {
              setErrorMsg(verifyData.error || "Payment verification failed.");
            }
          } catch (err: unknown) {
            setErrorMsg("Payment verification failed. Please contact support.");
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
          },
        },
      };

      // @ts-expect-error Razorpay is loaded via script
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Payment initialization failed.");
      setIsPaying(false);
    }
  };

  // Handle PDF Export / Print with Credit Deduction
  const handleDownloadPdf = async () => {
    // 3 credits needed for 3 pages CAA affidavit
    const requiredCredits = 3;

    if (!userEmail) {
      setShowBuyModal(true);
      setErrorMsg("Please enter your email and ensure you have at least 3 credits to download.");
      return;
    }

    if (creditBalance < requiredCredits) {
      setShowBuyModal(true);
      setErrorMsg(
        `You need ${requiredCredits} credits to download this 3-page affidavit. Current balance: ${creditBalance} credits.`
      );
      return;
    }

    setIsDownloading(true);
    setErrorMsg(null);

    try {
      // 1. Deduct credits on backend
      const res = await fetch("/api/affidavit/deduct-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          affidavitType: "caa",
          pageCount: 3,
          formData,
        }),
      });

      const deductData = await res.json();
      if (!deductData.success) {
        if (deductData.error === "INSUFFICIENT_CREDITS") {
          setShowBuyModal(true);
          setErrorMsg(deductData.message);
          return;
        }
        throw new Error(deductData.error || "Credit deduction failed.");
      }

      setCreditBalance(deductData.remainingBalance);

      // 2. Open standard court print dialog (creates crisp 3-page PDF with exact margins)
      window.print();
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Failed to process download.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-background-app pb-24">
        {/* ──────── TOP BAR / BANNER ──────── */}
        <div className="sticky top-14 z-40 border-b border-border-subtle bg-background-app/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1300px] flex-wrap items-center justify-between gap-4 px-6 py-3">
            <div className="flex items-center gap-3">
              <Link
                href="/affidavit-generator"
                className="flex items-center gap-1.5 font-mono text-[13px] text-text-secondary hover:text-text-primary transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> All Products
              </Link>
              <span className="text-border-subtle">|</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-cyan/10 px-3 py-1 font-mono text-[12px] font-semibold text-accent-cyan">
                <Scale className="h-3.5 w-3.5" /> CAA Citizenship Affidavit (Schedule 1-C)
              </span>
            </div>

            {/* Credit Balance & Buy Credits Button */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-background-surface px-3 py-1.5 font-mono text-small">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-text-secondary">Balance:</span>
                <span className="font-bold text-text-primary">{creditBalance} Credits</span>
              </div>

              <Button
                size="sm"
                onClick={() => setShowBuyModal(true)}
                className="bg-accent-cyan text-background-app font-semibold hover:bg-accent-cyan/90"
              >
                <CreditCard className="mr-1.5 h-4 w-4" /> Buy Credits
              </Button>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {paymentSuccessMsg && (
          <div className="mx-auto mt-4 max-w-[1300px] px-6">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300 font-sans text-small">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{paymentSuccessMsg}</span>
            </div>
          </div>
        )}

        {/* Global Error Alert */}
        {errorMsg && (
          <div className="mx-auto mt-4 max-w-[1300px] px-6">
            <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300 font-sans text-small">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* ──────── TAB SWITCHER ──────── */}
        <div className="mx-auto mt-6 max-w-[1300px] px-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4 flex-wrap gap-4">
            <div className="flex rounded-lg border border-border-subtle bg-background-surface p-1">
              <button
                onClick={() => setActiveTab("form")}
                className={`flex items-center gap-2 rounded-md px-4 py-2 font-sans text-small font-medium transition-all ${
                  activeTab === "form"
                    ? "bg-accent-cyan text-background-app font-semibold shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Sliders className="h-4 w-4" /> 1. Input Form
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 rounded-md px-4 py-2 font-sans text-small font-medium transition-all ${
                  activeTab === "preview"
                    ? "bg-accent-cyan text-background-app font-semibold shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <FileText className="h-4 w-4" /> 2. Court Preview (3 Pages)
              </button>
            </div>

            {/* Quick Action in Header */}
            <div className="flex items-center gap-3">
              {activeTab === "preview" && (
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-small text-text-secondary font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stampMargin}
                      onChange={(e) => setStampMargin(e.target.checked)}
                      className="rounded border-border-subtle bg-background-surface text-accent-cyan focus:ring-accent-cyan"
                    />
                    14cm Stamp Paper Header
                  </label>
                </div>
              )}

              <Button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="bg-emerald-500 text-white font-semibold hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                {isDownloading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download / Print PDF (3 Credits)
              </Button>
            </div>
          </div>
        </div>

        {/* ──────── TAB 1: FORM VIEW ──────── */}
        {activeTab === "form" && (
          <div className="mx-auto mt-8 max-w-[1300px] px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Step Navigation Sidebar */}
              <div className="lg:col-span-3">
                <div className="sticky top-32 rounded-xl border border-border-subtle bg-background-surface p-4 space-y-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
                    Form Steps
                  </span>

                  <button
                    onClick={() => setActiveStep(1)}
                    className={`w-full flex items-center gap-3 rounded-lg p-3 text-left font-sans text-small transition-all ${
                      activeStep === 1
                        ? "bg-accent-cyan/10 border border-accent-cyan/40 text-accent-cyan font-semibold"
                        : "text-text-secondary hover:bg-background-elevated"
                    }`}
                  >
                    <Building className="h-4 w-4 shrink-0" />
                    <div>
                      <p className="leading-tight">Step 1: Court & Advocate</p>
                      <p className="font-mono text-[11px] text-text-tertiary">Court jurisdiction, bar no.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveStep(2)}
                    className={`w-full flex items-center gap-3 rounded-lg p-3 text-left font-sans text-small transition-all ${
                      activeStep === 2
                        ? "bg-accent-cyan/10 border border-accent-cyan/40 text-accent-cyan font-semibold"
                        : "text-text-secondary hover:bg-background-elevated"
                    }`}
                  >
                    <User className="h-4 w-4 shrink-0" />
                    <div>
                      <p className="leading-tight">Step 2: Applicant Details</p>
                      <p className="font-mono text-[11px] text-text-tertiary">Identity, BD & Indian Address</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveStep(3)}
                    className={`w-full flex items-center gap-3 rounded-lg p-3 text-left font-sans text-small transition-all ${
                      activeStep === 3
                        ? "bg-accent-cyan/10 border border-accent-cyan/40 text-accent-cyan font-semibold"
                        : "text-text-secondary hover:bg-background-elevated"
                    }`}
                  >
                    <UserCheck className="h-4 w-4 shrink-0" />
                    <div>
                      <p className="leading-tight">Step 3: Character Witness</p>
                      <p className="font-mono text-[11px] text-text-tertiary">Schedule 1C Indian Citizen</p>
                    </div>
                  </button>

                  <div className="pt-4 border-t border-border-subtle mt-4">
                    <Button
                      onClick={() => setActiveTab("preview")}
                      className="w-full bg-accent-cyan text-background-app font-semibold hover:bg-accent-cyan/90"
                    >
                      View Court Document <ChevronRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="lg:col-span-9 space-y-6">
                {/* ══ STEP 1: COURT & ADVOCATE ══ */}
                {activeStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border-subtle bg-background-surface p-6 space-y-6"
                  >
                    <div>
                      <h2 className="font-sans text-[18px] font-bold text-text-primary flex items-center gap-2">
                        <Building className="h-5 w-5 text-accent-cyan" /> Court & Advocate Details
                      </h2>
                      <p className="mt-1 font-sans text-small text-text-secondary">
                        These default details will appear on the header and verification clauses across all 3 pages.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Court / Notary Jurisdiction Header
                        </label>
                        <select
                          name="courtHeader"
                          value={formData.courtHeader}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                        >
                          {COURT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {formData.courtHeader === "Custom Court Header" && (
                        <div className="md:col-span-2">
                          <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                            Custom Court Header Text
                          </label>
                          <input
                            type="text"
                            name="customCourt"
                            value={formData.customCourt}
                            onChange={handleInputChange}
                            placeholder="e.g., Before the Ld. Executive Magistrate at Diamond Harbour"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                      )}

                      {/* ON / OFF Toggle for Advocate Details */}
                      <div className="md:col-span-2 rounded-xl border border-border-subtle bg-background-elevated/40 p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <span className="font-sans text-small font-bold text-text-primary">
                              Print Advocate Name & Seal on Final Document
                            </span>
                            <p className="font-sans text-[12px] text-text-tertiary">
                              Choose whether to print advocate details or leave blank space for a physical rubber stamp.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPrintAdvocateOnPdf(!printAdvocateOnPdf)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                              printAdvocateOnPdf
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full transition-colors ${
                                printAdvocateOnPdf ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                              }`}
                            />
                            {printAdvocateOnPdf ? "ON (Print Details)" : "OFF (Leave Blank Space)"}
                          </button>
                        </div>

                        {!printAdvocateOnPdf ? (
                          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-[12px] text-amber-300">
                            ℹ️ <strong>OFF (Default for Cybercafes):</strong> The final affidavit will print &ldquo;<strong>Identified by me</strong>&rdquo; with <strong>blank space below</strong> so any available advocate can stamp their physical rubber seal and sign.
                          </div>
                        ) : (
                          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-[12px] text-emerald-300">
                            ✓ <strong>ON:</strong> The advocate name & enrollment below will be printed under &ldquo;<strong>Identified by me</strong>&rdquo;.
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Advocate Name {printAdvocateOnPdf && <span className="text-accent-rose">*</span>}
                        </label>
                        <input
                          type="text"
                          name="advocateName"
                          value={formData.advocateName}
                          onChange={handleInputChange}
                          placeholder={printAdvocateOnPdf ? "Advocate Full Name" : "Optional / Saved preset"}
                          className={`w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none ${
                            !printAdvocateOnPdf ? "opacity-75" : ""
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Bar Council Enrollment No.
                        </label>
                        <input
                          type="text"
                          name="advocateEnrollment"
                          value={formData.advocateEnrollment}
                          onChange={handleInputChange}
                          placeholder="e.g., WB/1675/856/2020"
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Advocate Contact No.
                        </label>
                        <input
                          type="text"
                          name="advocatePhone"
                          value={formData.advocatePhone}
                          onChange={handleInputChange}
                          placeholder="+91 9876543210"
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Date of Verification (Auto-generated)
                        </label>
                        <input
                          type="text"
                          name="verificationDate"
                          value={formData.verificationDate}
                          onChange={handleInputChange}
                          placeholder="DD/MM/YYYY"
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                        />
                        <span className="mt-1 block font-mono text-[11px] text-text-tertiary">
                          * Defaults to current date for valid court submission.
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border-subtle">
                      <Button
                        onClick={() => setActiveStep(2)}
                        className="bg-accent-cyan text-background-app font-semibold hover:bg-accent-cyan/90"
                      >
                        Next: Applicant Details <ChevronRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ══ STEP 2: APPLICANT DETAILS ══ */}
                {activeStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border-subtle bg-background-surface p-6 space-y-6"
                  >
                    <div>
                      <h2 className="font-sans text-[18px] font-bold text-text-primary flex items-center gap-2">
                        <User className="h-5 w-5 text-accent-cyan" /> Applicant (Deponent) Details
                      </h2>
                      <p className="mt-1 font-sans text-small text-text-secondary">
                        Enter the full legal identity, original Bangladesh residence, and current Indian address of the applicant.
                      </p>
                    </div>

                    {/* Basic Identity */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Applicant Full Name
                        </label>
                        <input
                          type="text"
                          name="applicantName"
                          value={formData.applicantName}
                          onChange={handleInputChange}
                          placeholder="SUSANTA NATH"
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Guardian Relation
                        </label>
                        <select
                          name="guardianType"
                          value={formData.guardianType}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                        >
                          <option value="S/O">Son of (S/O)</option>
                          <option value="D/O">Daughter of (D/O)</option>
                          <option value="W/O">Wife of (W/O)</option>
                          <option value="C/O">Care of (C/O)</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Father / Husband / Guardian Name
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          placeholder="SUBASH NATH"
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Date of Entry to India
                        </label>
                        <input
                          type="text"
                          name="entryDate"
                          value={formData.entryDate}
                          onChange={handleInputChange}
                          placeholder="DD/MM/YYYY (e.g. 15/12/2012)"
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Current Indian Address */}
                    <div className="pt-4 border-t border-border-subtle">
                      <h3 className="font-sans text-[15px] font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-400" /> Current Address in India
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            Village / Road
                          </label>
                          <input
                            type="text"
                            name="indiaVillage"
                            value={formData.indiaVillage}
                            onChange={handleInputChange}
                            placeholder="MADHYA HARIA"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            Post Office (P.O.)
                          </label>
                          <input
                            type="text"
                            name="indiaPo"
                            value={formData.indiaPo}
                            onChange={handleInputChange}
                            placeholder="BANIPUR"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            Police Station (P.S.)
                          </label>
                          <input
                            type="text"
                            name="indiaPs"
                            value={formData.indiaPs}
                            onChange={handleInputChange}
                            placeholder="HABRA"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            District
                          </label>
                          <input
                            type="text"
                            name="indiaDistrict"
                            value={formData.indiaDistrict}
                            onChange={handleInputChange}
                            placeholder="NORTH 24 PARGANAS"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            PIN Code
                          </label>
                          <input
                            type="text"
                            name="indiaPin"
                            value={formData.indiaPin}
                            onChange={handleInputChange}
                            placeholder="743233"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            name="indiaState"
                            value={formData.indiaState}
                            onChange={handleInputChange}
                            placeholder="West Bengal"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Original Bangladesh Address */}
                    <div className="pt-4 border-t border-border-subtle">
                      <h3 className="font-sans text-[15px] font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-400" /> Origin Address in Bangladesh (Pre-Migration)
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            Village
                          </label>
                          <input
                            type="text"
                            name="bdVillage"
                            value={formData.bdVillage}
                            onChange={handleInputChange}
                            placeholder="SASHI BHUSAN"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            Post Office
                          </label>
                          <input
                            type="text"
                            name="bdPo"
                            value={formData.bdPo}
                            onChange={handleInputChange}
                            placeholder="SASHI BHUSAN"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            Police Station
                          </label>
                          <input
                            type="text"
                            name="bdPs"
                            value={formData.bdPs}
                            onChange={handleInputChange}
                            placeholder="CHARFATION"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            District (Bangladesh)
                          </label>
                          <input
                            type="text"
                            name="bdDistrict"
                            value={formData.bdDistrict}
                            onChange={handleInputChange}
                            placeholder="BHOLA"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-border-subtle">
                      <Button
                        variant="outline"
                        onClick={() => setActiveStep(1)}
                        className="border-border-subtle text-text-secondary"
                      >
                        <ChevronLeft className="mr-1.5 h-4 w-4" /> Back to Step 1
                      </Button>
                      <Button
                        onClick={() => setActiveStep(3)}
                        className="bg-accent-cyan text-background-app font-semibold hover:bg-accent-cyan/90"
                      >
                        Next: Witness Details <ChevronRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ══ STEP 3: WITNESS DETAILS ══ */}
                {activeStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border-subtle bg-background-surface p-6 space-y-6"
                  >
                    <div>
                      <h2 className="font-sans text-[18px] font-bold text-text-primary flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-accent-cyan" /> Character Witness Details (Indian Citizen)
                      </h2>
                      <p className="mt-1 font-sans text-small text-text-secondary">
                        Under Schedule 1-C, a respectable Indian citizen who knows the applicant personally must attest to their character.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Witness Full Name
                        </label>
                        <input
                          type="text"
                          name="witnessName"
                          value={formData.witnessName}
                          onChange={handleInputChange}
                          placeholder="SADHAN DEY"
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Relation
                        </label>
                        <select
                          name="witnessGuardianType"
                          value={formData.witnessGuardianType}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                        >
                          <option value="S/O">Son of (S/O)</option>
                          <option value="D/O">Daughter of (D/O)</option>
                          <option value="W/O">Wife of (W/O)</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Witness Father / Husband Name
                        </label>
                        <input
                          type="text"
                          name="witnessFather"
                          value={formData.witnessFather}
                          onChange={handleInputChange}
                          placeholder="DURGAPADA DEY"
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Witness Age (Years)
                        </label>
                        <input
                          type="number"
                          name="witnessAge"
                          value={formData.witnessAge}
                          onChange={handleInputChange}
                          placeholder="52"
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1.5">
                          Witness Occupation
                        </label>
                        <input
                          type="text"
                          name="witnessOccupation"
                          value={formData.witnessOccupation}
                          onChange={handleInputChange}
                          placeholder="BUSINESS / SERVICE / RETIRED"
                          className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Witness Address */}
                    <div className="pt-4 border-t border-border-subtle">
                      <h3 className="font-sans text-[15px] font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-400" /> Witness Residential Address
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            Village / Road
                          </label>
                          <input
                            type="text"
                            name="witnessVillage"
                            value={formData.witnessVillage}
                            onChange={handleInputChange}
                            placeholder="K.N ROY ROAD"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            Post Office (P.O.)
                          </label>
                          <input
                            type="text"
                            name="witnessPo"
                            value={formData.witnessPo}
                            onChange={handleInputChange}
                            placeholder="BANIPUR"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            Police Station (P.S.)
                          </label>
                          <input
                            type="text"
                            name="witnessPs"
                            value={formData.witnessPs}
                            onChange={handleInputChange}
                            placeholder="HABRA"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary uppercase focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            District
                          </label>
                          <input
                            type="text"
                            name="witnessDistrict"
                            value={formData.witnessDistrict}
                            onChange={handleInputChange}
                            placeholder="North 24 Parganas"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            PIN Code
                          </label>
                          <input
                            type="text"
                            name="witnessPin"
                            value={formData.witnessPin}
                            onChange={handleInputChange}
                            placeholder="743233"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-text-secondary mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            name="witnessState"
                            value={formData.witnessState}
                            onChange={handleInputChange}
                            placeholder="West Bengal"
                            className="w-full rounded-lg border border-border-subtle bg-background-app px-3 py-2 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-border-subtle">
                      <Button
                        variant="outline"
                        onClick={() => setActiveStep(2)}
                        className="border-border-subtle text-text-secondary"
                      >
                        <ChevronLeft className="mr-1.5 h-4 w-4" /> Back to Step 2
                      </Button>
                      <Button
                        onClick={() => setActiveTab("preview")}
                        className="bg-emerald-500 text-white font-semibold hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      >
                        <Sparkles className="mr-1.5 h-4 w-4" /> Preview Court Affidavit (3 Pages)
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ──────── TAB 2: COURT DOCUMENT PREVIEW (3 PAGES) ──────── */}
        {activeTab === "preview" && (
          <div className="mx-auto mt-8 max-w-[900px] px-6 space-y-12 print:max-w-none print:m-0 print:p-0">
            {/* Helper banner */}
            <div className="rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 p-4 flex items-start gap-3 print:hidden">
              <Info className="h-5 w-5 text-accent-cyan shrink-0 mt-0.5" />
              <div className="font-sans text-small text-text-secondary">
                <p className="font-semibold text-text-primary">Interactive Live Preview</p>
                <p className="mt-0.5">
                  You can click on any page below and edit text directly if needed. When ready, click &ldquo;Download / Print PDF&rdquo; (deducts 3 credits).
                </p>
              </div>
            </div>

            {/* ════ PAGE 1: SCHEDULE 1-C APPLICANT AFFIRMATION ════ */}
            <div
              id="affidavit-page-1"
              className="relative mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl p-[18mm] font-serif leading-relaxed text-[11pt] border border-gray-300 print:border-none print:shadow-none print:m-0 print:p-[12mm] page-break-after"
              style={{
                paddingTop: stampMargin ? "140mm" : "20mm",
              }}
            >
              {stampMargin && (
                <div className="absolute top-8 left-8 right-8 text-center text-gray-400 font-mono text-[10px] uppercase border-b border-dashed border-gray-300 pb-2 print:hidden">
                  [ 14.0 cm Top Margin Reserved for Court Non-Judicial Stamp Paper ]
                </div>
              )}

              {/* Court Header */}
              <div className="text-center font-bold uppercase tracking-wide text-[12pt] mb-6">
                {effectiveCourtHeader}
              </div>

              <div className="text-center font-bold underline uppercase tracking-wider text-[12pt] mb-6">
                SCHEDULE - 1 C
              </div>

              <div className="text-justify space-y-4 text-[10.5pt] leading-[1.6]">
                <p>
                  Affidavit by the person registered under section 6B of the Citizenship Act, 1955:
                </p>

                <p>
                  I, <strong className="uppercase">{formData.applicantName || "SUSANTA NATH"}</strong>,{" "}
                  {formData.guardianType}-{formData.fatherName || "SUBASH NATH"}, VILL-
                  {formData.indiaVillage || "MADHYA HARIA"}, PO-{formData.indiaPo || "BANIPUR"}, PS-
                  {formData.indiaPs || "HABRA"}, {formData.indiaDistrict || "NORTH 24 PARGANAS"}, PIN-
                  {formData.indiaPin || "743233"}, State –{formData.indiaState || "West Bengal"}, do
                  hereby solemnly affirm and state as follows:
                </p>

                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    That I am a citizen of Bangladesh belonging to Hindu minority community having
                    birthplace/permanent residence at VILL-{formData.bdVillage || "SASHI BHUSAN"}, PO-{" "}
                    {formData.bdPo || "SASHI BHUSAN"}, PS- {formData.bdPs || "CHARFATION"}, DIST-
                    {formData.bdDistrict || "BHOLA"}.
                  </li>
                  <li>
                    That due to religious persecution and fear of such persecution, I was compelled to
                    flee from Bangladesh and entered into India on {formData.entryDate || "15/12/2012"} and
                    since then I have been continuously residing in India.
                  </li>
                  <li>
                    That I have applied for grant of citizenship of India under section 6B of the
                    Citizenship Act, 1955 and I have fulfilled all necessary conditions laid down in
                    the said Act and the Citizenship (Amendment) Rules, 2024.
                  </li>
                </ol>

                {/* Verification Clause */}
                <div className="pt-6">
                  <p className="font-bold underline mb-2">VERIFICATION</p>
                  <p>
                    I, the deponent above-named, do hereby verify and state that the contents of paragraphs
                    1 to 3 above are true and correct to the best of my knowledge, information and
                    belief and nothing material has been concealed therefrom.
                  </p>
                  <p className="mt-2">
                    Verified at <strong>{formData.courtLocation || "Barasat"}</strong> on this{" "}
                    <strong>{formData.verificationDate || formattedToday}</strong>.
                  </p>
                </div>

                {/* Signatures */}
                <div className="pt-10 flex justify-between items-end">
                  <div>
                    <p className="font-semibold">Identified by me:</p>
                    {printAdvocateOnPdf ? (
                      <>
                        <p className="mt-8 font-bold">{formData.advocateName || "Advocate"}</p>
                        <p className="text-[9.5pt] text-gray-700">
                          Advocate, {formData.advocateEnrollment || "Bar Council"}
                        </p>
                      </>
                    ) : (
                      <div className="mt-12 text-[9pt] text-gray-400 font-mono italic print:text-transparent select-none">
                        [ Space for Advocate Seal & Signature ]
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="inline-block border-t border-black pt-1 px-8 text-center font-bold">
                      Deponent
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-0 right-0 text-center font-mono text-[9px] text-gray-400">
                Page 1 of 3 · CAA Schedule 1-C
              </div>
            </div>

            {/* ════ PAGE 2: SCHEDULE 1-C CITIZEN WITNESS VERIFICATION ════ */}
            <div
              id="affidavit-page-2"
              className="relative mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl p-[18mm] font-serif leading-relaxed text-[11pt] border border-gray-300 print:border-none print:shadow-none print:m-0 print:p-[12mm] page-break-after"
              style={{
                paddingTop: stampMargin ? "140mm" : "20mm",
              }}
            >
              {stampMargin && (
                <div className="absolute top-8 left-8 right-8 text-center text-gray-400 font-mono text-[10px] uppercase border-b border-dashed border-gray-300 pb-2 print:hidden">
                  [ 14.0 cm Top Margin Reserved for Court Non-Judicial Stamp Paper ]
                </div>
              )}

              {/* Court Header */}
              <div className="text-center font-bold uppercase tracking-wide text-[12pt] mb-6">
                {effectiveCourtHeader}
              </div>

              <div className="text-center font-bold underline uppercase tracking-wider text-[12pt] mb-6">
                SCHEDULE - 1 C
              </div>

              <div className="text-center font-bold text-[10.5pt] mb-4">
                (Affidavit verifying character of applicant by an Indian Citizen)
              </div>

              <div className="text-justify space-y-4 text-[10.5pt] leading-[1.6]">
                <p>
                  I, <strong className="uppercase">{formData.witnessName || "SADHAN DEY"}</strong>,{" "}
                  {formData.witnessGuardianType}- {formData.witnessFather || "DURGAPADA DEY"}, aged about{" "}
                  {formData.witnessAge || "52"} years, Occupation –{" "}
                  {formData.witnessOccupation || "BUSINESS"}, residing at VILL-
                  {formData.witnessVillage || "K.N ROY ROAD"}, P.O.- {formData.witnessPo || "BANIPUR"},
                  P.S.-{formData.witnessPs || "HABRA"}, DIST. – {formData.witnessDistrict || "North 24 Parganas"},
                  PIN- {formData.witnessPin || "743233"}, {formData.witnessState || "West Bengal"}, an Indian
                  citizen by birth, do hereby solemnly affirm and state as follows:
                </p>

                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    That I am a respectable Indian citizen and holding valid Indian citizenship documents
                    including Voter ID Card / Aadhaar Card.
                  </li>
                  <li>
                    That I personally know the applicant,{" "}
                    <strong className="uppercase">{formData.applicantName || "SUSANTA NATH"}</strong>,{" "}
                    {formData.guardianType}-{formData.fatherName || "SUBASH NATH"}, for the last several
                    years since his arrival and residing at VILL-{formData.indiaVillage || "MADHYA HARIA"},
                    PO-{formData.indiaPo || "BANIPUR"}, PS-{formData.indiaPs || "HABRA"}, DIST-
                    {formData.indiaDistrict || "NORTH 24 PARGANAS"}.
                  </li>
                  <li>
                    That to the best of my knowledge and belief, the applicant bears good moral character,
                    is peaceful, law-abiding, has no criminal record, and is well-disposed to the good
                    order and welfare of India.
                  </li>
                </ol>

                {/* Verification Clause */}
                <div className="pt-6">
                  <p className="font-bold underline mb-2">VERIFICATION</p>
                  <p>
                    I, the deponent above-named, do hereby verify and state that the statements made in
                    paragraphs 1 to 3 above are true to my personal knowledge and belief.
                  </p>
                  <p className="mt-2">
                    Verified at <strong>{formData.courtLocation || "Barasat"}</strong> on this{" "}
                    <strong>{formData.verificationDate || formattedToday}</strong>.
                  </p>
                </div>

                {/* Signatures */}
                <div className="pt-10 flex justify-between items-end">
                  <div>
                    <p className="font-semibold">Identified by me:</p>
                    {printAdvocateOnPdf ? (
                      <>
                        <p className="mt-8 font-bold">{formData.advocateName || "Advocate"}</p>
                        <p className="text-[9.5pt] text-gray-700">
                          Advocate, {formData.advocateEnrollment || "Bar Council"}
                        </p>
                      </>
                    ) : (
                      <div className="mt-12 text-[9pt] text-gray-400 font-mono italic print:text-transparent select-none">
                        [ Space for Advocate Seal & Signature ]
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="inline-block border-t border-black pt-1 px-8 text-center font-bold">
                      Deponent (Witness)
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-0 right-0 text-center font-mono text-[9px] text-gray-400">
                Page 2 of 3 · Witness Character Verification
              </div>
            </div>

            {/* ════ PAGE 3: OATH OF ALLEGIANCE & NATURALIZATION ════ */}
            <div
              id="affidavit-page-3"
              className="relative mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl p-[18mm] font-serif leading-relaxed text-[11pt] border border-gray-300 print:border-none print:shadow-none print:m-0 print:p-[12mm]"
              style={{
                paddingTop: stampMargin ? "140mm" : "20mm",
              }}
            >
              {stampMargin && (
                <div className="absolute top-8 left-8 right-8 text-center text-gray-400 font-mono text-[10px] uppercase border-b border-dashed border-gray-300 pb-2 print:hidden">
                  [ 14.0 cm Top Margin Reserved for Court Non-Judicial Stamp Paper ]
                </div>
              )}

              {/* Court Header */}
              <div className="text-center font-bold uppercase tracking-wide text-[12pt] mb-6">
                {effectiveCourtHeader}
              </div>

              <div className="text-center font-bold underline uppercase tracking-wider text-[12pt] mb-6">
                OATH OF ALLEGIANCE & DECLARATION
              </div>

              <div className="text-justify space-y-4 text-[10.5pt] leading-[1.6]">
                <p>
                  I, <strong className="uppercase">{formData.applicantName || "SUSANTA NATH"}</strong>,{" "}
                  {formData.guardianType}-{formData.fatherName || "SUBASH NATH"}, residing at VILL-
                  {formData.indiaVillage || "MADHYA HARIA"}, PO-{formData.indiaPo || "BANIPUR"}, PS-
                  {formData.indiaPs || "HABRA"}, DIST-{formData.indiaDistrict || "NORTH 24 PARGANAS"}, do
                  solemnly affirm and declare on oath:
                </p>

                <div className="p-4 bg-gray-50 border-l-4 border-black italic space-y-2 text-[10pt]">
                  <p>
                    &ldquo;I do solemnly affirm and declare that I will bear true faith and allegiance to the
                    Constitution of India as by law established and that I will faithfully observe the laws of
                    India and fulfill my duties as a citizen of India.&rdquo;
                  </p>
                </div>

                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    That in the event of my admission to citizenship of India, I shall renounce all
                    allegiance to any foreign State or Country.
                  </li>
                  <li>
                    That I have an intention to permanently make India my permanent home and place of
                    domicile.
                  </li>
                  <li>
                    That all particulars furnished by me in my Citizenship Application under Section 6B are
                    true, accurate and complete in every respect.
                  </li>
                </ol>

                {/* Verification Clause */}
                <div className="pt-6">
                  <p className="font-bold underline mb-2">VERIFICATION</p>
                  <p>
                    I, the deponent above-named, do hereby verify that the contents of this Oath and
                    Declaration are true to my knowledge and solemn affirmation.
                  </p>
                  <p className="mt-2">
                    Verified at <strong>{formData.courtLocation || "Barasat"}</strong> on this{" "}
                    <strong>{formData.verificationDate || formattedToday}</strong>.
                  </p>
                </div>

                {/* Signatures */}
                <div className="pt-10 flex justify-between items-end">
                  <div>
                    <p className="font-semibold">Identified by me:</p>
                    {printAdvocateOnPdf ? (
                      <>
                        <p className="mt-8 font-bold">{formData.advocateName || "Advocate"}</p>
                        <p className="text-[9.5pt] text-gray-700">
                          Advocate, {formData.advocateEnrollment || "Bar Council"}
                        </p>
                      </>
                    ) : (
                      <div className="mt-12 text-[9pt] text-gray-400 font-mono italic print:text-transparent select-none">
                        [ Space for Advocate Seal & Signature ]
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="inline-block border-t border-black pt-1 px-8 text-center font-bold">
                      Deponent
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-0 right-0 text-center font-mono text-[9px] text-gray-400">
                Page 3 of 3 · Oath of Allegiance & Identification
              </div>
            </div>
          </div>
        )}

        {/* ──────── BUY CREDITS MODAL ──────── */}
        <AnimatePresence>
          {showBuyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-xl rounded-2xl border border-border-subtle bg-background-surface p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <div>
                    <h3 className="font-sans text-[18px] font-bold text-text-primary flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-accent-cyan" /> Purchase Affidavit Credits
                    </h3>
                    <p className="mt-1 font-sans text-small text-text-secondary">
                      1 credit = 1 page. A 3-page CAA affidavit costs 3 credits.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBuyModal(false)}
                    className="rounded-lg p-1.5 text-text-tertiary hover:bg-background-elevated hover:text-text-primary"
                  >
                    ✕
                  </button>
                </div>

                {/* Email / Identity input */}
                <div className="mt-5 space-y-3">
                  <div>
                    <label className="block font-mono text-[12px] uppercase text-text-secondary mb-1">
                      Your Email Address (for balance & receipt)
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="advocate@example.com"
                      className="w-full rounded-lg border border-border-subtle bg-background-app px-3.5 py-2.5 font-sans text-small text-text-primary focus:border-accent-cyan focus:outline-none"
                    />
                  </div>
                </div>

                {/* Plan Selection Cards */}
                <div className="mt-5 space-y-2.5">
                  <span className="block font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
                    Select Plan
                  </span>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {PLANS.filter((p) => !p.firstTimeOnly || isFirstTimeUser).map((plan) => {
                      const isSelected = selectedPlan === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`relative cursor-pointer rounded-xl border p-3.5 transition-all ${
                            isSelected
                              ? "border-accent-cyan bg-accent-cyan/10 shadow-[0_0_15px_rgba(0,198,255,0.15)]"
                              : "border-border-subtle bg-background-app hover:border-border-hover"
                          }`}
                        >
                          {plan.badge && (
                            <span className="absolute -top-2.5 right-3 rounded-full bg-accent-cyan px-2 py-0.5 font-mono text-[9px] font-bold text-background-app uppercase">
                              {plan.badge}
                            </span>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[15px] font-semibold text-text-primary">
                              {plan.name}
                            </span>
                            <span className="font-sans text-[16px] font-bold text-accent-cyan">
                              ₹{plan.price}
                            </span>
                          </div>

                          <p className="mt-1 font-mono text-[11px] text-text-tertiary">{plan.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-5 flex items-center justify-center gap-4 text-text-tertiary font-mono text-[11px] border-t border-border-subtle pt-4">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3 text-emerald-400" /> Razorpay 256-bit SSL
                  </span>
                  <span>•</span>
                  <span>UPI / Cards / NetBanking</span>
                </div>

                {/* Modal Actions */}
                <div className="mt-5 flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowBuyModal(false)}
                    className="border-border-subtle text-text-secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handlePurchaseCredits(selectedPlan)}
                    disabled={isPaying || !userEmail}
                    className="bg-accent-cyan text-background-app font-semibold hover:bg-accent-cyan/90"
                  >
                    {isPaying ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="mr-2 h-4 w-4" />
                    )}
                    Pay with Razorpay
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Print Specific CSS */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header,
          footer,
          nav,
          .sticky,
          button,
          .print\\:hidden {
            display: none !important;
          }
          .page-break-after {
            page-break-after: always !important;
            break-after: page !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
}

export default function AffidavitGeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-app flex items-center justify-center p-6 text-text-secondary font-mono text-small">
          Loading Court Document Engine...
        </div>
      }
    >
      <AffidavitGenerateContent />
    </Suspense>
  );
}

