"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Script from "next/script";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Download,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Zap,
  RefreshCw,
  Scale,
  Building,
  User,
  MapPin,
  Lock,
  Plus,
  ArrowLeft,
  Settings,
  LogOut,
  ShieldCheck,
  Sparkles,
  Calendar,
  AlertTriangle,
  Phone,
  Mail,
  ArrowRight,
  Check,
} from "lucide-react";

/* ─── n8n Webhook Backend URL ─── */
const API_URL = "https://n8n.srv1594654.hstgr.cloud/webhook/generate-affidavit";

/* ─── Pricing Plans ─── */
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

/* ─── Default Court Options ─── */
const COURT_PRESETS = [
  "Before the Notary Public at Barasat, North 24 Parganas",
  "Before the Notary Public at Alipore, South 24 Parganas",
  "Before the Notary Public at City Civil Court, Calcutta",
  "Before the Notary Public at Sealdah Court, Kolkata",
  "Before the Notary Public at Barrackpore, North 24 Parganas",
  "Before the Notary Public at Bongaon, North 24 Parganas",
  "Before the Notary Public at Ranaghat, Nadia",
  "Before the Notary Public at Krishnanagar, Nadia",
  "Before the Notary Public at Siliguri, Darjeeling",
];

/* ─── Advocate Presets ─── */
const ADVOCATE_PRESETS = [
  "Debabrata Sarkar, Adv, F/1675/856/2020",
  "Mou Roy, Adv, F/3594/1774/2025",
];

function AffidavitAppContent() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams?.get("plan") || null;

  // View state: 'dashboard' | 'form' | 'success'
  const [currentView, setCurrentView] = useState<"dashboard" | "form" | "success">("dashboard");

  // User & Auth State
  const [user, setUser] = useState<{
    id: string;
    email?: string | null;
    phone?: string | null;
    name?: string | null;
    avatarUrl?: string | null;
    creditBalance: number;
    isFirstPurchaseDone: boolean;
    defaultAdvocateName?: string | null;
    defaultAdvocateEnrollment?: string | null;
    defaultCourtHeader?: string | null;
  } | null>(null);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showBuyModal, setShowBuyModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showCaaIneligibleModal, setShowCaaIneligibleModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);

  // Default Profile Toggle (in-form)
  const [saveAsDefaultAdvocate, setSaveAsDefaultAdvocate] = useState<boolean>(true);
  const [isCustomCourtEditing, setIsCustomCourtEditing] = useState<boolean>(false);

  // Enhanced Auth Flow State
  const [authTab, setAuthTab] = useState<"phone" | "email">("phone");
  const [authIdentifier, setAuthIdentifier] = useState<string>("");
  const [authOtp, setAuthOtp] = useState<string>("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Countdown Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Payment State
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan || "starter");
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Settings State
  const [settingsAdvocateName, setSettingsAdvocateName] = useState<string>("");
  const [settingsAdvocateEnrollment, setSettingsAdvocateEnrollment] = useState<string>("");
  const [settingsPhone, setSettingsPhone] = useState<string>("");
  const [settingsCourtHeader, setSettingsCourtHeader] = useState<string>(COURT_PRESETS[0]);
  const [settingsCustomCourt, setSettingsCustomCourt] = useState<string>("");
  const [settingsSaving, setSettingsSaving] = useState<boolean>(false);

  // Form State
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [generatedDocxUrl, setGeneratedDocxUrl] = useState<string>("#");
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string>("#");
  const [generatedApplicantName, setGeneratedApplicantName] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-formatted today's date
  const getTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Today in YYYY-MM-DD format for HTML5 min/max
  const getTodayIso = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD
  const ddmmyyyyToIso = (val: string) => {
    if (!val || !/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return "";
    const [dd, mm, yyyy] = val.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Convert YYYY-MM-DD to DD/MM/YYYY
  const isoToDdmmyyyy = (iso: string) => {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
    const [yyyy, mm, dd] = iso.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const [formData, setFormData] = useState({
    applicant_name: "",
    guardian_type: "",
    father_name: "",
    india_village: "",
    india_po: "",
    india_ps: "",
    india_district: "",
    india_pin: "",
    india_state: "West Bengal",
    bd_village: "",
    bd_po: "",
    bd_ps: "",
    bd_district: "",
    witness_name: "",
    witness_guardian_type: "",
    witness_father: "",
    witness_age: "",
    witness_occupation: "",
    witness_village: "",
    witness_po: "",
    witness_ps: "",
    witness_district: "",
    witness_pin: "",
    witness_state: "West Bengal",
    entry_date: "",
    verification_date: getTodayDate(),
    advocate: "",
    custom_court: "",
  });

  // Load user session on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem("affidavit_user_id");
    const savedIdentifier = localStorage.getItem("affidavit_user_identifier");
    if (savedUserId || savedIdentifier) {
      refreshUserData(savedIdentifier || undefined, savedUserId || undefined);
    }

    if (initialPlan) {
      setShowBuyModal(true);
    }
  }, [initialPlan]);

  // Sync user's default advocate and court settings into form
  useEffect(() => {
    if (user) {
      if (user.defaultAdvocateName && user.defaultAdvocateEnrollment) {
        const fullAdv = `${user.defaultAdvocateName}, Adv, ${user.defaultAdvocateEnrollment}`;
        setFormData((prev) => ({ ...prev, advocate: fullAdv }));
      }
      if (user.defaultCourtHeader) {
        setFormData((prev) => ({ ...prev, custom_court: user.defaultCourtHeader! }));
      }
      if (user.defaultAdvocateName) setSettingsAdvocateName(user.defaultAdvocateName);
      if (user.defaultAdvocateEnrollment)
        setSettingsAdvocateEnrollment(user.defaultAdvocateEnrollment);
      if (user.phone) setSettingsPhone(user.phone);
      if (user.defaultCourtHeader) setSettingsCourtHeader(user.defaultCourtHeader);
    }
  }, [user]);

  const refreshUserData = async (identifier?: string, userId?: string) => {
    try {
      const url = identifier
        ? `/api/affidavit/balance?email=${encodeURIComponent(identifier)}`
        : `/api/affidavit/balance?userId=${encodeURIComponent(userId!)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch {
      // ignore
    }
  };

  // Date Auto-formatter (DD/MM/YYYY)
  const handleDateInput = (name: "entry_date" | "verification_date", rawVal: string) => {
    let digits = rawVal.replace(/\D/g, "");
    if (digits.length > 8) digits = digits.slice(0, 8);
    let formatted = digits;
    if (digits.length >= 5) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setFormData((prev) => ({ ...prev, [name]: formatted }));

    // Real-time CAA Cut-off validation for Entry Date (must be on or before 31/12/2014)
    if (name === "entry_date") {
      if (formatted.length === 10) {
        const [d, m, y] = formatted.split("/").map(Number);
        const entryDateObj = new Date(y, m - 1, d);
        const cutoffDateObj = new Date(2014, 11, 31, 23, 59, 59); // 31 Dec 2014
        if (entryDateObj > cutoffDateObj || y > 2014) {
          setShowCaaIneligibleModal(true);
          setFormErrors((prev) => ({
            ...prev,
            entry_date: "Entry date must be on or before 31/12/2014 (Statutory CAA Cut-off Date)",
          }));
        } else {
          setFormErrors((prev) => ({ ...prev, entry_date: "" }));
        }
      }
    } else if (name === "verification_date" && formErrors.verification_date) {
      setFormErrors((prev) => ({ ...prev, verification_date: "" }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Send OTP Flow
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!authIdentifier.trim()) {
      setAuthError(
        authTab === "phone"
          ? "Please enter your 10-digit mobile number"
          : "Please enter your email address"
      );
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    setAuthMsg(null);
    setOtpDigits(["", "", "", "", "", ""]);

    try {
      const res = await fetch("/api/affidavit/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: authIdentifier.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setResendCountdown(30);
        setAuthMsg(data.previewOtp ? `OTP sent! (Test OTP: ${data.previewOtp})` : data.message);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      } else {
        setAuthError(data.error || "Failed to send OTP.");
      }
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Verify OTP Flow (Accepts direct code string for instant verification)
  const handleVerifyOtp = async (codeToVerify?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalOtp = (codeToVerify || otpDigits.join("") || authOtp).trim();
    if (!finalOtp || finalOtp.length < 6) {
      setAuthError("Please enter the complete 6-digit OTP code");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/affidavit/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: authIdentifier.trim(), otp: finalOtp }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("affidavit_user_id", data.user.id);
        localStorage.setItem("affidavit_user_identifier", authIdentifier.trim());
        setShowAuthModal(false);
        setOtpSent(false);
        setAuthOtp("");
        setOtpDigits(["", "", "", "", "", ""]);
        setAuthMsg(null);
      } else {
        setAuthError(data.error || "Invalid OTP code.");
        setOtpDigits(["", "", "", "", "", ""]);
        otpInputRefs.current[0]?.focus();
      }
    } catch {
      setAuthError("Failed to verify OTP.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Discrete OTP Digit Handlers
  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      return;
    }

    const digit = clean.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (index < 5 && digit) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 filled
    if (newDigits.every((d) => d !== "") && newDigits.join("").length === 6) {
      handleVerifyOtp(newDigits.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = ["", "", "", "", "", ""];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      if (pasted.length === 6) {
        handleVerifyOtp(pasted);
      } else {
        otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
      }
    }
  };

  // Google 1-Click Sign-In Handler
  const handleGoogleSignIn = () => {
    setAuthLoading(true);
    setAuthError(null);

    const googleClientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "1081676413092-m2bl2lsl3n8qshk8jc2fqdktamn9qk18.apps.googleusercontent.com";
    const win =
      typeof window !== "undefined"
        ? (window as unknown as {
            google?: {
              accounts?: {
                oauth2?: {
                  initTokenClient: (config: unknown) => { requestAccessToken: () => void };
                };
              };
            };
          })
        : null;

    if (googleClientId && win?.google?.accounts?.oauth2) {
      try {
        const client = win.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: "email profile openid",
          callback: async (tokenResponse: { access_token?: string }) => {
            if (tokenResponse.access_token) {
              try {
                const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const googleProfile = await userInfoRes.json();
                if (googleProfile.email) {
                  const res = await fetch("/api/affidavit/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: googleProfile.email,
                      name: googleProfile.name,
                      picture: googleProfile.picture,
                      googleId: googleProfile.sub,
                    }),
                  });
                  const data = await res.json();
                  if (data.success && data.user) {
                    setUser(data.user);
                    localStorage.setItem("affidavit_user_id", data.user.id);
                    localStorage.setItem("affidavit_user_identifier", data.user.email);
                    setShowAuthModal(false);
                  } else {
                    setAuthError(data.error || "Google login failed.");
                  }
                }
              } catch {
                setAuthError("Failed to fetch Google profile.");
              } finally {
                setAuthLoading(false);
              }
            }
          },
        });
        client.requestAccessToken();
        return;
      } catch {
        // proceed to instant fallback
      }
    }

    // Instant Seamless Gmail Sign-in Fallback
    const defaultEmail = authIdentifier.includes("@") ? authIdentifier : "mithun.here01@gmail.com";
    const entered = prompt("Sign in with Google (Enter your Gmail address):", defaultEmail);
    if (entered && entered.includes("@")) {
      const cleanEmail = entered.trim().toLowerCase();
      const rawName = cleanEmail.split("@")[0].replace(/[._]/g, " ");
      const formattedName = rawName.replace(/\b\w/g, (c) => c.toUpperCase());
      const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=0EA5E9&color=fff&bold=true`;

      fetch("/api/affidavit/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          name: formattedName,
          picture: fallbackAvatar,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("affidavit_user_id", data.user.id);
            localStorage.setItem("affidavit_user_identifier", data.user.email);
            setShowAuthModal(false);
          } else {
            setAuthError(data.error || "Login failed.");
          }
        })
        .catch(() => setAuthError("Network error. Please try again."))
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  };

  // Save Default Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSettingsSaving(true);

    try {
      const courtVal =
        settingsCourtHeader === "Custom Court Header" && settingsCustomCourt.trim()
          ? settingsCustomCourt.trim()
          : settingsCourtHeader;

      const res = await fetch("/api/affidavit/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          phone: settingsPhone.trim(),
          defaultAdvocateName: settingsAdvocateName.trim(),
          defaultAdvocateEnrollment: settingsAdvocateEnrollment.trim(),
          defaultCourtHeader: courtVal,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setShowSettingsModal(false);
      }
    } catch {
      // ignore
    } finally {
      setSettingsSaving(false);
    }
  };

  // Buy Credits Flow (Razorpay)
  const handlePurchaseCredits = async (planId: string) => {
    const emailToUse = user?.email || user?.phone || authIdentifier.trim();
    if (!emailToUse) {
      setGeneralError("Please enter your mobile number or email address below to proceed.");
      return;
    }

    setGeneralError(null);
    setIsPaying(true);

    try {
      const res = await fetch("/api/affidavit/purchase-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          email: emailToUse,
          name: user?.name || undefined,
        }),
      });

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to initialize payment.");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Mithun Das AI Automation",
        description: `Affidavit Credits (${orderData.planCredits} Credits)`,
        image: "/logo.png",
        order_id: orderData.orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || (emailToUse.includes("@") ? emailToUse : ""),
          contact: user?.phone || (!emailToUse.includes("@") ? emailToUse : ""),
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
              setUser((prev) =>
                prev
                  ? { ...prev, creditBalance: verifyData.newBalance, isFirstPurchaseDone: true }
                  : {
                      id: orderData.userId,
                      email: user?.email || (emailToUse.includes("@") ? emailToUse : null),
                      phone: user?.phone || (!emailToUse.includes("@") ? emailToUse : null),
                      creditBalance: verifyData.newBalance,
                      isFirstPurchaseDone: true,
                    }
              );
              localStorage.setItem("affidavit_user_id", orderData.userId);
              localStorage.setItem("affidavit_user_identifier", emailToUse);
              setShowBuyModal(false);
              setPaymentSuccessMsg(
                `🎉 Success! ${verifyData.creditsAdded} credits added! Balance: ${verifyData.newBalance} credits.`
              );
              setTimeout(() => setPaymentSuccessMsg(null), 8000);
            } else {
              setGeneralError(verifyData.error || "Payment verification failed.");
            }
          } catch {
            setGeneralError("Payment verification failed.");
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
      setGeneralError((err as Error).message || "Payment initialization failed.");
      setIsPaying(false);
    }
  };

  // Form Validation & Submission
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.applicant_name.trim()) errors.applicant_name = "Full name is required";
    if (!formData.guardian_type) errors.guardian_type = "Relation is required";
    if (!formData.father_name.trim()) errors.father_name = "Father / Guardian name is required";
    if (!formData.india_village.trim()) errors.india_village = "Village / Locality is required";
    if (!formData.india_po.trim()) errors.india_po = "Post Office is required";
    if (!formData.india_ps.trim()) errors.india_ps = "Police Station is required";
    if (!formData.india_district.trim()) errors.india_district = "District is required";
    if (!formData.india_pin.trim() || !/^\d{6}$/.test(formData.india_pin.trim()))
      errors.india_pin = "PIN code must be exactly 6 digits";
    if (!formData.india_state.trim()) errors.india_state = "State is required";

    if (!formData.bd_village.trim()) errors.bd_village = "Village is required";
    if (!formData.bd_po.trim()) errors.bd_po = "Post Office is required";
    if (!formData.bd_ps.trim()) errors.bd_ps = "Police Station is required";
    if (!formData.bd_district.trim()) errors.bd_district = "District is required";

    if (!formData.witness_name.trim()) errors.witness_name = "Witness full name is required";
    if (!formData.witness_guardian_type) errors.witness_guardian_type = "Relation is required";
    if (!formData.witness_father.trim()) errors.witness_father = "Witness Guardian name is required";
    if (!formData.witness_age.trim() || isNaN(Number(formData.witness_age)))
      errors.witness_age = "Valid age is required";
    if (!formData.witness_occupation.trim()) errors.witness_occupation = "Occupation is required";
    if (!formData.witness_village.trim()) errors.witness_village = "Village is required";
    if (!formData.witness_po.trim()) errors.witness_po = "Post Office is required";
    if (!formData.witness_ps.trim()) errors.witness_ps = "Police Station is required";
    if (!formData.witness_district.trim()) errors.witness_district = "District is required";
    if (!formData.witness_pin.trim() || !/^\d{6}$/.test(formData.witness_pin.trim()))
      errors.witness_pin = "PIN code must be exactly 6 digits";
    if (!formData.witness_state.trim()) errors.witness_state = "State is required";

    if (!formData.entry_date.trim() || !/^\d{2}\/\d{2}\/\d{4}$/.test(formData.entry_date.trim()))
      errors.entry_date = "Entry date must be in DD/MM/YYYY format";
    if (
      !formData.verification_date.trim() ||
      !/^\d{2}\/\d{2}\/\d{4}$/.test(formData.verification_date.trim())
    ) {
      errors.verification_date = "Verification date must be in DD/MM/YYYY format";
    } else {
      const [vd, vm, vy] = formData.verification_date.split("/").map(Number);
      const inputDate = new Date(vy, vm - 1, vd);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      if (inputDate < todayDate) {
        errors.verification_date = "Verification date must be today or a future date";
      }
    }
    if (!formData.advocate.trim()) errors.advocate = "Advocate selection is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setGeneralError("Please fill out all required fields marked with * correctly.");
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    // Check Credits (Requires 3 Credits)
    if (!user || user.creditBalance < 3) {
      setShowBuyModal(true);
      setGeneralError(
        user
          ? `You have ${user.creditBalance} credits. You need 3 credits to generate this 3-page affidavit.`
          : "Please sign in and top up your credits (starting at ₹9) to generate court affidavits."
      );
      return;
    }

    setFormSubmitting(true);
    setGeneralError(null);

    try {
      // 1. Call n8n webhook backend
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const result = await res.json();
      if (result.success) {
        // 2. Deduct 3 credits from user balance in Supabase
        await fetch("/api/affidavit/deduct-credits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            affidavitType: "caa",
            pageCount: 3,
            formData,
          }),
        });

        // Update balance locally
        setUser((prev) => (prev ? { ...prev, creditBalance: prev.creditBalance - 3 } : null));

        // 3. Auto-save default profile in Supabase if checkbox is checked
        if (user && saveAsDefaultAdvocate && formData.advocate.trim()) {
          const advParts = formData.advocate.split(",");
          const advName = advParts[0]?.trim() || formData.advocate;
          const advEnroll = advParts.slice(1).join(",").trim() || "";
          const courtToSave = formData.custom_court || effectiveCourtHeader;

          fetch("/api/affidavit/user/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              defaultAdvocateName: advName,
              defaultAdvocateEnrollment: advEnroll,
              defaultCourtHeader: courtToSave,
            }),
          }).catch(() => {});
        }

        setGeneratedApplicantName(formData.applicant_name);
        setGeneratedDocxUrl(result.docx || "#");
        setGeneratedPdfUrl(result.pdf || "#");
        setCurrentView("success");
      } else {
        throw new Error(result.message || "Document generation failed.");
      }
    } catch (err: unknown) {
      setGeneralError((err as Error).message || "Failed to generate affidavit document.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      applicant_name: "",
      guardian_type: "",
      father_name: "",
      india_village: "",
      india_po: "",
      india_ps: "",
      india_district: "",
      india_pin: "",
      india_state: "West Bengal",
      bd_village: "",
      bd_po: "",
      bd_ps: "",
      bd_district: "",
      witness_name: "",
      witness_guardian_type: "",
      witness_father: "",
      witness_age: "",
      witness_occupation: "",
      witness_village: "",
      witness_po: "",
      witness_ps: "",
      witness_district: "",
      witness_pin: "",
      witness_state: "West Bengal",
      entry_date: "",
      verification_date: getTodayDate(),
      advocate:
        user?.defaultAdvocateName && user?.defaultAdvocateEnrollment
          ? `${user.defaultAdvocateName}, Adv, ${user.defaultAdvocateEnrollment}`
          : "",
      custom_court: user?.defaultCourtHeader || "",
    });
    setFormErrors({});
  };

  const effectiveCourtHeader =
    user?.defaultCourtHeader || "Before the Notary Public at Barasat, North 24 Parganas";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />

      {/* Main Container styled with smooth dark theme */}
      <div
        className="min-h-screen text-slate-100 font-sans"
        style={{
          backgroundColor: "hsl(225, 25%, 8%)",
          color: "hsl(220, 20%, 92%)",
        }}
      >
        {/* ──────── HEADER / TOP NAVIGATION ──────── */}
        <header
          className="sticky top-0 z-40 border-b flex items-center justify-between px-6 py-3.5 backdrop-blur-md"
          style={{
            borderColor: "hsl(225, 15%, 20%)",
            backgroundColor: "hsla(225, 25%, 8%, 0.85)",
          }}
        >
          {/* Logo on Left: "Mithun Das AI Automation" */}
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-85 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md overflow-hidden bg-slate-900 border border-slate-700 transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="Mithun Das AI Logo" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[15px] leading-tight text-white group-hover:text-sky-300 transition-colors">
                Mithun Das
              </span>
              <span className="font-mono text-[10px] tracking-wider text-sky-400 uppercase font-semibold">
                AI Automation
              </span>
            </div>
          </Link>

          {/* User Account / Credits Area on Right */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                {/* Credit Balance Badge */}
                <div
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[13px] border transition-all hover:border-sky-400/40"
                  style={{
                    backgroundColor: "hsl(225, 20%, 12%)",
                    borderColor: "hsl(225, 15%, 24%)",
                  }}
                >
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span className="font-bold text-sky-400">{user.creditBalance}</span>
                  <span className="text-slate-400 text-[11px]">Credits</span>
                </div>

                {/* Buy Credits Button */}
                <button
                  onClick={() => setShowBuyModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-3 py-1.5 text-[13px] transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] active:scale-95"
                >
                  <CreditCard className="h-3.5 w-3.5" /> Buy Credits
                </button>

                {/* Default Settings & User Name */}
                <button
                  onClick={() => setShowSettingsModal(true)}
                  title="My Default Advocate & Court Settings"
                  className="flex items-center gap-2 rounded-lg border px-2.5 py-1 text-[13px] text-slate-300 hover:text-white transition-all hover:border-slate-600"
                  style={{
                    backgroundColor: "hsl(225, 20%, 12%)",
                    borderColor: "hsl(225, 15%, 24%)",
                  }}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || "User"}
                      className="h-6 w-6 rounded-full object-cover border border-sky-400/60 shrink-0"
                    />
                  ) : (
                    <User className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  <span className="max-w-[120px] truncate font-medium">
                    {user.name || user.email?.split("@")[0] || user.phone || "My Account"}
                  </span>
                  <Settings className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-1.5 text-[13px] transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] active:scale-95"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Global Notifications */}
        {paymentSuccessMsg && (
          <div className="mx-auto max-w-[760px] px-6 pt-4">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300 text-[13px]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{paymentSuccessMsg}</span>
            </div>
          </div>
        )}

        {generalError && (
          <div className="mx-auto max-w-[760px] px-6 pt-4">
            <div className="flex items-center justify-between rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300 text-[13px]">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{generalError}</span>
              </div>
              <button
                onClick={() => setGeneralError(null)}
                className="text-rose-400 hover:text-rose-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ──────── 1. DASHBOARD VIEW (With Smooth Hover Effects) ──────── */}
        {currentView === "dashboard" && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-6 py-12">
            {/* Center App Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center gap-3 mb-2 text-sky-400">
                <svg
                  className="h-8 w-8 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <h1 className="text-[28px] font-bold text-white tracking-tight">
                  CAA Affidavit Generator
                </h1>
              </div>
              <p className="font-mono text-[12px] uppercase tracking-widest text-slate-400">
                Citizenship Amendment Act — Document Automation
              </p>
            </div>

            {/* Dashboard Action Card with Smooth Hover Glow & Lift */}
            <div
              className="group relative w-full max-w-[440px] rounded-2xl border p-8 text-center transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,198,255,0.18)] cursor-pointer"
              style={{
                backgroundColor: "hsl(225, 18%, 14%)",
                borderColor: "hsl(225, 15%, 20%)",
              }}
              onClick={() => setCurrentView("form")}
            >
              {/* Subtle gradient hover highlight background */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Document Icon Wrapper with Hover Glow */}
              <div
                className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110 group-hover:border-sky-400/60 group-hover:text-sky-300 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]"
                style={{
                  backgroundColor: "hsl(225, 20%, 10%)",
                  borderColor: "hsl(225, 15%, 22%)",
                  color: "hsl(215, 80%, 55%)",
                }}
              >
                <svg
                  className="h-8 w-8 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>

              <h2 className="text-[20px] font-bold text-white mb-2 group-hover:text-sky-200 transition-colors">
                New Citizenship Affidavit
              </h2>
              <p className="text-slate-400 text-[14px] leading-relaxed mb-8 group-hover:text-slate-300 transition-colors">
                Generate SCHEDULE-1C affidavit with character witness and naturalization oath
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (user && !user.defaultAdvocateName && !user.defaultCourtHeader) {
                    setShowOnboardingModal(true);
                  } else {
                    setCurrentView("form");
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 group-hover:bg-sky-400 text-slate-950 font-bold py-3 text-[15px] transition-all duration-200 shadow-[0_0_20px_rgba(56,189,248,0.3)] group-hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] active:scale-95"
              >
                <Plus className="h-5 w-5 stroke-[2.5]" /> Create
              </button>
            </div>
          </div>
        )}

        {/* ──────── 2. FORM VIEW ──────── */}
        {currentView === "form" && (
          <div className="mx-auto max-w-[760px] px-6 py-10">
            {/* Back Button & Title Header */}
            <div className="mb-8">
              <button
                onClick={() => setCurrentView("dashboard")}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-[14px] font-medium mb-3 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Dashboard
              </button>
              <h1 className="text-[26px] font-bold text-white">New Citizenship Affidavit</h1>

              {/* Interactive Court Jurisdiction Selector Badge */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="text-slate-400 font-mono text-[12px]">SCHEDULE-1C •</span>

                {!isCustomCourtEditing ? (
                  <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1 text-[13px] text-sky-300 shadow-sm">
                    <Building className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <select
                      value={formData.custom_court || effectiveCourtHeader}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "CUSTOM_COURT") {
                          setIsCustomCourtEditing(true);
                        } else {
                          setFormData((prev) => ({ ...prev, custom_court: val }));
                        }
                      }}
                      className="bg-transparent border-none text-sky-300 focus:outline-none text-[13px] cursor-pointer pr-1"
                    >
                      {COURT_PRESETS.map((c) => (
                        <option key={c} value={c} className="bg-slate-900 text-white">
                          {c}
                        </option>
                      ))}
                      <option
                        value="CUSTOM_COURT"
                        className="bg-slate-900 text-sky-400 font-semibold"
                      >
                        ✏️ + Type Custom Court Jurisdiction...
                      </option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.custom_court}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, custom_court: e.target.value }))
                      }
                      placeholder="e.g. Before the Notary Public at Diamond Harbour"
                      className="rounded-lg border border-sky-400 bg-slate-900 px-3 py-1 text-[13px] text-white focus:outline-none w-[320px]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCourtEditing(false)}
                      className="text-[12px] bg-sky-500 text-slate-950 px-2.5 py-1 rounded-md font-bold hover:bg-sky-400 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
              {/* Section 1: Applicant Information */}
              <div
                className="rounded-2xl border p-6 transition-all hover:border-slate-700"
                style={{
                  backgroundColor: "hsl(225, 18%, 14%)",
                  borderColor: "hsl(225, 15%, 20%)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-slate-950 font-bold text-[13px]">
                    1
                  </div>
                  <h3 className="text-[17px] font-semibold text-white">Applicant Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="applicant_name"
                      value={formData.applicant_name}
                      onChange={handleInputChange}
                      placeholder="e.g., SUSANTA NATH"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none transition-colors"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.applicant_name ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.applicant_name && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.applicant_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Relation <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="guardian_type"
                      value={formData.guardian_type}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white focus:border-sky-400 focus:outline-none transition-colors"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.guardian_type ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    >
                      <option value="">Select...</option>
                      <option value="S/O">S/O — Son of</option>
                      <option value="D/O">D/O — Daughter of</option>
                      <option value="W/O">W/O — Wife of</option>
                    </select>
                    {formErrors.guardian_type && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.guardian_type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Father / Guardian Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleInputChange}
                      placeholder="e.g., SUBASH NATH"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none transition-colors"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.father_name ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.father_name && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.father_name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: India Address */}
              <div
                className="rounded-2xl border p-6 transition-all hover:border-slate-700"
                style={{
                  backgroundColor: "hsl(225, 18%, 14%)",
                  borderColor: "hsl(225, 15%, 20%)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-slate-950 font-bold text-[13px]">
                    2
                  </div>
                  <h3 className="text-[17px] font-semibold text-white">
                    India Address{" "}
                    <span className="text-slate-400 text-[13px] font-normal">
                      (Current Residence)
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Village / Locality <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="india_village"
                      value={formData.india_village}
                      onChange={handleInputChange}
                      placeholder="e.g., MADHYA HARIA"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.india_village ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.india_village && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.india_village}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Post Office <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="india_po"
                      value={formData.india_po}
                      onChange={handleInputChange}
                      placeholder="e.g., BANIPUR"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.india_po ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.india_po && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.india_po}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Police Station <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="india_ps"
                      value={formData.india_ps}
                      onChange={handleInputChange}
                      placeholder="e.g., HABRA"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.india_ps ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.india_ps && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.india_ps}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      District <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="india_district"
                      value={formData.india_district}
                      onChange={handleInputChange}
                      placeholder="e.g., NORTH 24 PARGANAS"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.india_district ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.india_district && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.india_district}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      PIN Code <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="india_pin"
                      maxLength={6}
                      value={formData.india_pin}
                      onChange={handleInputChange}
                      placeholder="e.g., 743233"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.india_pin ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.india_pin && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.india_pin}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      State <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="india_state"
                      value={formData.india_state}
                      onChange={handleInputChange}
                      placeholder="e.g., West Bengal"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.india_state ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.india_state && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.india_state}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Bangladesh Address */}
              <div
                className="rounded-2xl border p-6 transition-all hover:border-slate-700"
                style={{
                  backgroundColor: "hsl(225, 18%, 14%)",
                  borderColor: "hsl(225, 15%, 20%)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-slate-950 font-bold text-[13px]">
                    3
                  </div>
                  <h3 className="text-[17px] font-semibold text-white">
                    Bangladesh Address{" "}
                    <span className="text-slate-400 text-[13px] font-normal">
                      (Previous Residence)
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Village <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="bd_village"
                      value={formData.bd_village}
                      onChange={handleInputChange}
                      placeholder="e.g., SASHI BHUSAN"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.bd_village ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.bd_village && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.bd_village}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Post Office <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="bd_po"
                      value={formData.bd_po}
                      onChange={handleInputChange}
                      placeholder="e.g., SASHI BHUSAN"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.bd_po ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.bd_po && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.bd_po}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Police Station <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="bd_ps"
                      value={formData.bd_ps}
                      onChange={handleInputChange}
                      placeholder="e.g., CHARFATION"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.bd_ps ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.bd_ps && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.bd_ps}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      District <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="bd_district"
                      value={formData.bd_district}
                      onChange={handleInputChange}
                      placeholder="e.g., BHOLA"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.bd_district ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.bd_district && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.bd_district}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Witness Information */}
              <div
                className="rounded-2xl border p-6 transition-all hover:border-slate-700"
                style={{
                  backgroundColor: "hsl(225, 18%, 14%)",
                  borderColor: "hsl(225, 15%, 20%)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-slate-950 font-bold text-[13px]">
                    4
                  </div>
                  <h3 className="text-[17px] font-semibold text-white">Witness Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Witness Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="witness_name"
                      value={formData.witness_name}
                      onChange={handleInputChange}
                      placeholder="e.g., SADHAN DEY"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.witness_name ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.witness_name && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.witness_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Relation <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="witness_guardian_type"
                      value={formData.witness_guardian_type}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.witness_guardian_type
                          ? "#F43F5E"
                          : "hsl(225, 15%, 20%)",
                      }}
                    >
                      <option value="">Select...</option>
                      <option value="S/O">S/O — Son of</option>
                      <option value="D/O">D/O — Daughter of</option>
                      <option value="W/O">W/O — Wife of</option>
                    </select>
                    {formErrors.witness_guardian_type && (
                      <p className="text-rose-400 text-[12px] mt-1">
                        {formErrors.witness_guardian_type}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Father / Guardian Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="witness_father"
                      value={formData.witness_father}
                      onChange={handleInputChange}
                      placeholder="e.g., DURGAPADA DEY"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.witness_father
                          ? "#F43F5E"
                          : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.witness_father && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.witness_father}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Age <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="witness_age"
                      value={formData.witness_age}
                      onChange={handleInputChange}
                      placeholder="e.g., 52"
                      maxLength={3}
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.witness_age ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.witness_age && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.witness_age}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Occupation <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="witness_occupation"
                      value={formData.witness_occupation}
                      onChange={handleInputChange}
                      placeholder="e.g., BUSINESS"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.witness_occupation
                          ? "#F43F5E"
                          : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.witness_occupation && (
                      <p className="text-rose-400 text-[12px] mt-1">
                        {formErrors.witness_occupation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Village / Locality <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="witness_village"
                      value={formData.witness_village}
                      onChange={handleInputChange}
                      placeholder="e.g., K.N ROY ROAD"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.witness_village
                          ? "#F43F5E"
                          : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.witness_village && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.witness_village}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Post Office <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="witness_po"
                      value={formData.witness_po}
                      onChange={handleInputChange}
                      placeholder="e.g., BANIPUR"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.witness_po ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.witness_po && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.witness_po}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      Police Station <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="witness_ps"
                      value={formData.witness_ps}
                      onChange={handleInputChange}
                      placeholder="e.g., HABRA"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white uppercase focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.witness_ps ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.witness_ps && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.witness_ps}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      District <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="witness_district"
                      value={formData.witness_district}
                      onChange={handleInputChange}
                      placeholder="e.g., North 24 Parganas"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.witness_district
                          ? "#F43F5E"
                          : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.witness_district && (
                      <p className="text-rose-400 text-[12px] mt-1">
                        {formErrors.witness_district}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      PIN Code <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="witness_pin"
                      maxLength={6}
                      value={formData.witness_pin}
                      onChange={handleInputChange}
                      placeholder="e.g., 743233"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.witness_pin ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.witness_pin && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.witness_pin}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">
                      State <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="witness_state"
                      value={formData.witness_state}
                      onChange={handleInputChange}
                      placeholder="e.g., West Bengal"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.witness_state ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />
                    {formErrors.witness_state && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.witness_state}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 5: Dates & Advocate */}
              <div
                className="rounded-2xl border p-6 transition-all hover:border-slate-700"
                style={{
                  backgroundColor: "hsl(225, 18%, 14%)",
                  borderColor: "hsl(225, 15%, 20%)",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-slate-950 font-bold text-[13px]">
                    5
                  </div>
                  <h3 className="text-[17px] font-semibold text-white">Dates & Advocate</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>
                        Date of Entry into India <span className="text-rose-400">*</span>
                      </span>
                      <span className="text-[11px] font-mono text-amber-400">≤ 31/12/2014</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="entry_date"
                        value={formData.entry_date}
                        onChange={(e) => handleDateInput("entry_date", e.target.value)}
                        placeholder="DD/MM/YYYY"
                        maxLength={10}
                        className="w-full rounded-lg border px-3.5 py-2.5 pr-11 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                        style={{
                          backgroundColor: "hsl(225, 20%, 10%)",
                          borderColor: formErrors.entry_date ? "#F43F5E" : "hsl(225, 15%, 20%)",
                        }}
                      />
                      <label
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-md bg-slate-800 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 cursor-pointer transition-colors"
                        title="Pick entry date (Must be on or before 31/12/2014)"
                      >
                        <Calendar className="h-4 w-4 text-amber-400" />
                        <input
                          type="date"
                          max="2014-12-31"
                          value={ddmmyyyyToIso(formData.entry_date)}
                          onChange={(e) => {
                            if (e.target.value) {
                              if (e.target.value > "2014-12-31") {
                                setShowCaaIneligibleModal(true);
                                setFormErrors((prev) => ({
                                  ...prev,
                                  entry_date:
                                    "Entry date must be on or before 31/12/2014 (CAA Cut-off Date)",
                                }));
                                return;
                              }
                              const formatted = isoToDdmmyyyy(e.target.value);
                              setFormData((prev) => ({ ...prev, entry_date: formatted }));
                              if (formErrors.entry_date) {
                                setFormErrors((prev) => ({ ...prev, entry_date: "" }));
                              }
                            }
                          }}
                          className="sr-only"
                          aria-label="Select Entry Date"
                          onClick={(e) => {
                            try {
                              (e.target as HTMLInputElement).showPicker();
                            } catch {}
                          }}
                        />
                      </label>
                    </div>
                    <span className="text-slate-400 text-[11px] block mt-1">
                      Format: DD/MM/YYYY — must be on or before 31/12/2014
                    </span>
                    {formErrors.entry_date && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.entry_date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>
                        Verification Date <span className="text-rose-400">*</span>
                      </span>
                      <span className="text-[11px] font-mono text-sky-400">Today / Future only</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="verification_date"
                        value={formData.verification_date}
                        onChange={(e) => handleDateInput("verification_date", e.target.value)}
                        placeholder="DD/MM/YYYY"
                        maxLength={10}
                        className="w-full rounded-lg border px-3.5 py-2.5 pr-11 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                        style={{
                          backgroundColor: "hsl(225, 20%, 10%)",
                          borderColor: formErrors.verification_date
                            ? "#F43F5E"
                            : "hsl(225, 15%, 20%)",
                        }}
                      />
                      <label
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-md bg-slate-800 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 cursor-pointer transition-colors"
                        title="Pick verification date (Today & Future only)"
                      >
                        <Calendar className="h-4 w-4 text-sky-400" />
                        <input
                          type="date"
                          min={getTodayIso()}
                          value={ddmmyyyyToIso(formData.verification_date)}
                          onChange={(e) => {
                            if (e.target.value) {
                              const formatted = isoToDdmmyyyy(e.target.value);
                              setFormData((prev) => ({ ...prev, verification_date: formatted }));
                              if (formErrors.verification_date) {
                                setFormErrors((prev) => ({ ...prev, verification_date: "" }));
                              }
                            }
                          }}
                          className="sr-only"
                          aria-label="Select Verification Date"
                          onClick={(e) => {
                            try {
                              (e.target as HTMLInputElement).showPicker();
                            } catch {}
                          }}
                        />
                      </label>
                    </div>
                    <span className="text-slate-400 text-[11px] block mt-1">
                      Format: DD/MM/YYYY — today or future court submission date
                    </span>
                    {formErrors.verification_date && (
                      <p className="text-rose-400 text-[12px] mt-1">
                        {formErrors.verification_date}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[13px] font-medium text-slate-300">
                        Identified By (Advocate) <span className="text-rose-400">*</span>
                      </label>
                      {user && (
                        <button
                          type="button"
                          onClick={() => setShowSettingsModal(true)}
                          className="text-[12px] text-sky-400 hover:underline flex items-center gap-1"
                        >
                          <Settings className="h-3 w-3" /> Edit Saved Defaults
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      name="advocate"
                      value={formData.advocate}
                      onChange={handleInputChange}
                      placeholder="e.g., Debabrata Sarkar, Adv, F/1675/856/2020"
                      className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: formErrors.advocate ? "#F43F5E" : "hsl(225, 15%, 20%)",
                      }}
                    />

                    {/* Quick Example / Presets */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[11px] text-slate-500 font-mono">Example:</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            advocate: "Debabrata Sarkar, Adv, F/1675/856/2020",
                          }))
                        }
                        className="rounded-md border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-[11px] text-slate-400 hover:border-sky-400 hover:text-sky-300 transition-colors"
                      >
                        Debabrata Sarkar, Adv
                      </button>
                    </div>

                    {/* 1-Click Save as Default Profile Checkbox */}
                    {user && (
                      <label className="flex items-center gap-2.5 cursor-pointer text-[12px] text-slate-300 hover:text-white transition-colors mt-3.5 p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                        <input
                          type="checkbox"
                          checked={saveAsDefaultAdvocate}
                          onChange={(e) => setSaveAsDefaultAdvocate(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0 h-4 w-4 shrink-0"
                        />
                        <span className="text-slate-300 leading-tight">
                          ⭐ <strong className="text-white">Save as My Default Profile</strong> — Auto-fill this Advocate & Court on all my future affidavits.
                        </span>
                      </label>
                    )}

                    {formErrors.advocate && (
                      <p className="text-rose-400 text-[12px] mt-1">{formErrors.advocate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 px-5 py-3 text-[14px] font-medium transition-colors"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-3 text-[15px] transition-all shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] active:scale-95 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Generating Document...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" /> Generate Documents (3 Credits)
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ──────── 3. SUCCESS VIEW ──────── */}
        {currentView === "success" && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-6 py-12">
            <div
              className="w-full max-w-[500px] rounded-2xl border p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300"
              style={{
                backgroundColor: "hsl(225, 18%, 14%)",
                borderColor: "hsl(225, 15%, 20%)",
              }}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <h2 className="text-[22px] font-bold text-white mb-1">
                Document Generated Successfully
              </h2>
              <p className="text-slate-400 text-[14px] font-mono mb-8">
                {generatedApplicantName.replace(/\s+/g, "_")}_Affidavit
              </p>

              <div className="space-y-3 mb-8">
                <a
                  href={generatedPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 text-[15px] transition-all shadow-[0_0_20px_rgba(225,29,72,0.35)] active:scale-95"
                >
                  <Download className="h-4 w-4" /> Download PDF (Court Formatted)
                </a>

                {generatedDocxUrl && generatedDocxUrl !== "#" && (
                  <a
                    href={generatedDocxUrl}
                    download
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 font-semibold py-2.5 text-[14px] transition-all"
                  >
                    <Download className="h-4 w-4" /> Download DOCX (Word File)
                  </a>
                )}
              </div>

              <button
                onClick={() => {
                  handleReset();
                  setCurrentView("form");
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-medium py-2.5 text-[14px] transition-colors"
              >
                + Generate Another
              </button>
            </div>
          </div>
        )}

        {/* ──────── 4-COLUMN FOOTER SECTION (Dedicated to Affidavit Generator) ──────── */}
        <footer
          className="mt-20 border-t pt-14 pb-10 text-slate-400 text-[13px]"
          style={{
            backgroundColor: "hsl(225, 28%, 6%)",
            borderColor: "hsl(225, 15%, 16%)",
          }}
        >
          <div className="mx-auto max-w-[1140px] px-6">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-slate-800/80">
              {/* Column 1: Brand & System Overview */}
              <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md overflow-hidden bg-slate-900 border border-slate-700 transition-transform group-hover:scale-105">
                    <img src="/logo.png" alt="Mithun Das AI Logo" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[15px] leading-tight text-white group-hover:text-sky-300 transition-colors">
                      Mithun Das
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-sky-400 uppercase font-semibold">
                      AI Automation
                    </span>
                  </div>
                </Link>
                <p className="text-slate-400 text-[13px] leading-relaxed">
                  Dedicated court document automation suite engineered for Advocates, Bar Associations, and Cyber Cafes across India.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Systems Operational • n8n Live
                </div>
              </div>

              {/* Column 2: Legal Standards & CAA Compliance */}
              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-bold mb-4">
                  Legal Compliance
                </h4>
                <ul className="space-y-2.5 text-[13px]">
                  <li className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
                    <span className="text-sky-400">✓</span> SCHEDULE-1C Format
                  </li>
                  <li className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
                    <span className="text-sky-400">✓</span> Cut-off Date: ≤ 31/12/2014
                  </li>
                  <li className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
                    <span className="text-sky-400">✓</span> Section 6B Naturalization Oath
                  </li>
                  <li className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
                    <span className="text-sky-400">✓</span> Indian Witness Clause Included
                  </li>
                  <li className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
                    <span className="text-sky-400">✓</span> Notary Public Formatted
                  </li>
                </ul>
              </div>

              {/* Column 3: Pricing & Credits */}
              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-bold mb-4">
                  Credit Wallet Plans
                </h4>
                <ul className="space-y-2.5 text-[13px]">
                  <li>
                    <button
                      onClick={() => setShowBuyModal(true)}
                      className="text-left text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      Starter: <span className="text-white font-medium">₹9</span> for 9 Credits (3 Affidavits)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setShowBuyModal(true)}
                      className="text-left text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      Basic: <span className="text-white font-medium">₹49</span> for 49 Credits
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setShowBuyModal(true)}
                      className="text-left text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      Professional: <span className="text-white font-medium">₹99</span> for 99 Credits
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setShowBuyModal(true)}
                      className="text-left text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      Bulk: <span className="text-white font-medium">₹499</span> for 599 Credits
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 4: Advocate Support & Quick Links */}
              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-bold mb-4">
                  Practitioner Support
                </h4>
                <div className="space-y-3 text-[13px]">
                  <p className="text-slate-400">
                    Need custom court templates or bulk law firm automation?
                  </p>
                  <a
                    href="mailto:mithun@mithundas.cloud"
                    className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors font-mono text-[12px]"
                  >
                    mithun@mithundas.cloud
                  </a>
                  <div className="pt-2">
                    <Link
                      href="/"
                      className="text-[12px] text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
                    >
                      ← Back to Main Platform
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Sub-Footer Bar */}
            <div className="pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[12px] text-slate-500">
              <p>
                © 2026 Mithun Das AI Automation. Built for fast & legally compliant court document compilation.
              </p>
              <div className="flex items-center gap-6 font-mono text-[11px] text-slate-400">
                <span>Habra • North 24 Parganas</span>
                <span>•</span>
                <span>Razorpay 256-bit Encrypted</span>
              </div>
            </div>
          </div>
        </footer>

        {/* ──────── AUTH MODAL (Email / Phone OTP) ──────── */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div
              className="w-full max-w-[440px] rounded-2xl border p-6 shadow-2xl"
              style={{
                backgroundColor: "hsl(225, 18%, 14%)",
                borderColor: "hsl(225, 15%, 20%)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-white">Sign In / Register</h3>
                    <p className="text-[11px] font-mono text-slate-400">
                      Instant OTP • No password needed
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Status Message Banners */}
              {authMsg && (
                <div className="mt-4 p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[12px] flex items-center gap-2 animate-in fade-in">
                  <Sparkles className="h-4 w-4 shrink-0 text-sky-400" />
                  <span>{authMsg}</span>
                </div>
              )}

              {authError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[12px] flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{authError}</span>
                </div>
              )}

                <div className="mt-6 space-y-4">
                  {/* Google 1-Click Sign-In (Primary & Clean) */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={authLoading}
                    className="w-full flex items-center justify-center gap-3.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-white font-semibold py-3.5 text-[15px] transition-all hover:border-sky-500/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] active:scale-95 disabled:opacity-50 group"
                  >
                    <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                      />
                    </svg>
                    <span>{authLoading ? "Signing in with Google..." : "Continue with Google (1-Click)"}</span>
                  </button>

                  {/* Benefit list */}
                  <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 space-y-2 text-[12px] text-slate-300">
                    <div className="flex items-center gap-2 text-slate-300 font-mono">
                      <Zap className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span>Instant 1-Click Access · No OTP or password</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-mono">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Secure Google Identity & Automatic Cloud Backup</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-mono">
                      <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Saves Advocate Profile & Court Jurisdiction</span>
                    </div>
                  </div>

                  <p className="text-center text-[11px] text-slate-500 font-mono pt-1">
                    By continuing, you agree to our Terms of Service & Privacy Policy.
                  </p>
                </div>
            </div>
          </div>
        )}

        {/* ──────── BUY CREDITS MODAL ──────── */}
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div
              className="w-full max-w-[540px] rounded-2xl border p-6 shadow-2xl"
              style={{
                backgroundColor: "hsl(225, 18%, 14%)",
                borderColor: "hsl(225, 15%, 20%)",
              }}
            >
              <div className="flex items-center justify-between border-b pb-4 border-slate-700/60">
                <div>
                  <h3 className="text-[18px] font-bold text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-sky-400" /> Buy Affidavit Credits
                  </h3>
                  <p className="text-slate-400 text-[12px] mt-0.5 font-mono">
                    1 Credit = 1 Page · 3-Page Affidavit = 3 Credits
                  </p>
                </div>
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* User Account Bar or Guest Input */}
              {user ? (
                <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="User Avatar"
                        className="h-8 w-8 rounded-full object-cover border border-sky-400/60"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 font-bold text-[13px]">
                        {user.name?.[0] || "U"}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-white text-[13px] block leading-tight">
                        {user.name || "Logged In User"}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px] block">
                        {user.email || user.phone}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400 font-semibold">
                    <Check className="h-3 w-3" /> Auto-Filled
                  </span>
                </div>
              ) : (
                <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[12px] font-mono text-slate-300 uppercase">
                      Your Email / Mobile (For Invoice & Credits)
                    </label>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      Sign In with Google
                    </button>
                  </div>
                  <input
                    type="text"
                    value={authIdentifier}
                    onChange={(e) => setAuthIdentifier(e.target.value)}
                    placeholder="e.g. advocate@gmail.com or 9876543210"
                    className="w-full rounded-lg border px-3.5 py-2 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                    style={{
                      backgroundColor: "hsl(225, 20%, 10%)",
                      borderColor: "hsl(225, 15%, 20%)",
                    }}
                  />
                </div>
              )}

              {/* Plan Options Grid */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 mt-5">
                {PLANS.filter((p) => !p.firstTimeOnly || !user?.isFirstPurchaseDone).map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 ${
                        isSelected
                          ? "border-sky-400 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-2.5 right-3 rounded-full bg-sky-500 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-950 uppercase">
                          {plan.badge}
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-[15px]">{plan.name}</span>
                        <span className="font-bold text-sky-400 text-[18px]">₹{plan.price}</span>
                      </div>
                      <p className="font-mono text-[11px] text-slate-400 mt-1">{plan.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Trust Footer & Button */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-700/60">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Razorpay 256-bit Secure
                </span>
                <button
                  onClick={() => handlePurchaseCredits(selectedPlan)}
                  disabled={isPaying}
                  className="rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-2.5 text-[14px] transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] active:scale-95"
                >
                  {isPaying ? "Processing..." : "Pay with Razorpay"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ──────── 4. USER SETTINGS MODAL (Default Advocate & Court) ──────── */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div
              className="w-full max-w-[480px] rounded-2xl border p-6 shadow-2xl"
              style={{
                backgroundColor: "hsl(225, 18%, 14%)",
                borderColor: "hsl(225, 15%, 20%)",
              }}
            >
              <div className="flex items-center justify-between border-b pb-4 border-slate-700/60">
                <h3 className="text-[17px] font-bold text-white flex items-center gap-2">
                  <Settings className="h-4 w-4 text-sky-400" /> Default Advocate & Court Settings
                </h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="mt-5 space-y-4">
                <div>
                  <label className="block text-[12px] font-mono text-slate-300 uppercase mb-1">
                    Advocate Name
                  </label>
                  <input
                    type="text"
                    value={settingsAdvocateName}
                    onChange={(e) => setSettingsAdvocateName(e.target.value)}
                    placeholder="e.g. Debabrata Sarkar"
                    className="w-full rounded-lg border px-3.5 py-2 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                    style={{
                      backgroundColor: "hsl(225, 20%, 10%)",
                      borderColor: "hsl(225, 15%, 20%)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-mono text-slate-300 uppercase mb-1">
                    Bar Council Registration / Enrollment No.
                  </label>
                  <input
                    type="text"
                    value={settingsAdvocateEnrollment}
                    onChange={(e) => setSettingsAdvocateEnrollment(e.target.value)}
                    placeholder="e.g. F/1675/856/2020"
                    className="w-full rounded-lg border px-3.5 py-2 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                    style={{
                      backgroundColor: "hsl(225, 20%, 10%)",
                      borderColor: "hsl(225, 15%, 20%)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-mono text-slate-300 uppercase mb-1">
                    WhatsApp / Mobile Number (For Payment Receipts & Alerts)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 flex items-center gap-1 text-[13px] font-mono text-sky-400 font-bold border-r border-slate-700 pr-2">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="w-full rounded-lg border py-2 pl-20 pr-3.5 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: "hsl(225, 15%, 20%)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-mono text-slate-300 uppercase mb-1">
                    Default Court Jurisdiction Header
                  </label>
                  <select
                    value={settingsCourtHeader}
                    onChange={(e) => setSettingsCourtHeader(e.target.value)}
                    className="w-full rounded-lg border px-3.5 py-2 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                    style={{
                      backgroundColor: "hsl(225, 20%, 10%)",
                      borderColor: "hsl(225, 15%, 20%)",
                    }}
                  >
                    {COURT_PRESETS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Custom Court Header">Custom Court Header...</option>
                  </select>
                </div>

                {settingsCourtHeader === "Custom Court Header" && (
                  <div>
                    <label className="block text-[12px] font-mono text-slate-300 uppercase mb-1">
                      Custom Court Header Text
                    </label>
                    <input
                      type="text"
                      value={settingsCustomCourt}
                      onChange={(e) => setSettingsCustomCourt(e.target.value)}
                      placeholder="e.g. Before the Ld. Executive Magistrate at Diamond Harbour"
                      className="w-full rounded-lg border px-3.5 py-2 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: "hsl(225, 15%, 20%)",
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("affidavit_user_id");
                      localStorage.removeItem("affidavit_user_identifier");
                      setUser(null);
                      setShowSettingsModal(false);
                    }}
                    className="text-[12px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="h-3 w-3" /> Sign Out
                  </button>

                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-2 text-[14px] transition-all"
                  >
                    {settingsSaving ? "Saving..." : "Save Defaults"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ──────── 5. CAA INELIGIBILITY WARNING MODAL (Entry Date > 31/12/2014) ──────── */}
        {showCaaIneligibleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div
              className="w-full max-w-[460px] rounded-2xl border p-6 shadow-2xl text-center"
              style={{
                backgroundColor: "hsl(225, 18%, 14%)",
                borderColor: "#F43F5E",
              }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="h-8 w-8" />
              </div>

              <h3 className="text-[20px] font-bold text-white mb-2">
                Not Allowed to Apply for CAA
              </h3>

              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-left text-[13px] text-slate-300 space-y-2 mb-6 leading-relaxed">
                <p>
                  <strong className="text-rose-300">Statutory CAA Cut-off Date:</strong> Under the{" "}
                  <strong>Citizenship (Amendment) Act, 2019</strong> (Section 6B), only persons who
                  entered India on or before <strong className="text-white">31st December 2014 (31/12/2014)</strong> are eligible to apply for Indian citizenship.
                </p>
                <p className="text-slate-400 text-[12px]">
                  Persons who entered India on or after 1st January 2015 cannot generate or submit a CAA Schedule 1-C court affidavit.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, entry_date: "" }));
                    setShowCaaIneligibleModal(false);
                  }}
                  className="w-full rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2.5 text-[14px] transition-all active:scale-95 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                >
                  Change Date of Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ──────── 6. FIRST-TIME QUICK ONBOARDING MODAL ──────── */}
        {showOnboardingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div
              className="w-full max-w-[480px] rounded-2xl border p-6 shadow-2xl"
              style={{
                backgroundColor: "hsl(225, 18%, 14%)",
                borderColor: "hsl(225, 15%, 20%)",
              }}
            >
              <div className="flex items-center justify-between border-b pb-4 border-slate-700/60">
                <h3 className="text-[17px] font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-400" /> Welcome! Set Default Court & Advocate
                </h3>
                <button
                  onClick={() => {
                    setShowOnboardingModal(false);
                    setCurrentView("form");
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-slate-400 text-[13px] mt-3 leading-relaxed">
                Save your court and advocate information once to auto-fill every affidavit in 1 click. You can change this anytime.
              </p>

              <form onSubmit={handleSaveSettings} className="mt-5 space-y-4">
                <div>
                  <label className="block text-[12px] font-mono text-slate-300 uppercase mb-1">
                    Advocate Name
                  </label>
                  <input
                    type="text"
                    value={settingsAdvocateName}
                    onChange={(e) => setSettingsAdvocateName(e.target.value)}
                    placeholder="e.g. Debabrata Sarkar, Adv"
                    className="w-full rounded-lg border px-3.5 py-2 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                    style={{
                      backgroundColor: "hsl(225, 20%, 10%)",
                      borderColor: "hsl(225, 15%, 20%)",
                    }}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-mono text-slate-300 uppercase mb-1">
                    Bar Council Registration No.
                  </label>
                  <input
                    type="text"
                    value={settingsAdvocateEnrollment}
                    onChange={(e) => setSettingsAdvocateEnrollment(e.target.value)}
                    placeholder="e.g. WB/1675/856/2020"
                    className="w-full rounded-lg border px-3.5 py-2 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                    style={{
                      backgroundColor: "hsl(225, 20%, 10%)",
                      borderColor: "hsl(225, 15%, 20%)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-mono text-slate-300 uppercase mb-1">
                    Default Court Jurisdiction
                  </label>
                  <select
                    value={settingsCourtHeader}
                    onChange={(e) => setSettingsCourtHeader(e.target.value)}
                    className="w-full rounded-lg border px-3.5 py-2 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                    style={{
                      backgroundColor: "hsl(225, 20%, 10%)",
                      borderColor: "hsl(225, 15%, 20%)",
                    }}
                  >
                    {COURT_PRESETS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Custom Court Header">Custom Court Jurisdiction...</option>
                  </select>
                </div>

                {settingsCourtHeader === "Custom Court Header" && (
                  <div>
                    <input
                      type="text"
                      value={settingsCustomCourt}
                      onChange={(e) => setSettingsCustomCourt(e.target.value)}
                      placeholder="e.g. Before the Notary Public at Bongaon"
                      className="w-full rounded-lg border px-3.5 py-2 text-[14px] text-white focus:border-sky-400 focus:outline-none"
                      style={{
                        backgroundColor: "hsl(225, 20%, 10%)",
                        borderColor: "hsl(225, 15%, 20%)",
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOnboardingModal(false);
                      setCurrentView("form");
                    }}
                    className="text-[12px] text-slate-400 hover:text-white underline"
                  >
                    Skip for now
                  </button>

                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-2 text-[14px] transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  >
                    {settingsSaving ? "Saving..." : "Save & Continue"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function AffidavitGeneratorProductPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center p-6 text-slate-400 font-mono text-[13px]"
          style={{ backgroundColor: "hsl(225, 25%, 8%)" }}
        >
          Loading CAA Court Affidavit Generator...
        </div>
      }
    >
      <AffidavitAppContent />
    </Suspense>
  );
}
