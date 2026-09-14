"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Script from "next/script";
import { Mail, ShieldCheck, ArrowRight, Loader2, RefreshCw, KeyRound, Building2 } from "lucide-react";

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (owner: {
    email: string;
    name?: string;
    businesses: Array<{ id: string; slug: string; businessName: string; category?: string; trialStatus: string }>;
  }) => void;
  defaultEmail?: string;
  businessName?: string;
}

export default function OwnerAuthModal({
  isOpen,
  onClose,
  onSuccess,
  defaultEmail = "",
  businessName,
}: OwnerAuthModalProps) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [googleInitialized, setGoogleInitialized] = useState(false);

  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultEmail && !email) {
      setEmail(defaultEmail);
    }
  }, [defaultEmail, email]);

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Focus OTP input when switching to OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpInputRef.current?.focus(), 150);
    }
  }, [step]);

  // Handle Google GIS callback
  const handleGoogleResponse = useCallback(async (response: { credential: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/qr-review/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Google verification failed");
      }
      onSuccess(data.owner);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in error");
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onClose]);

  // Initialize Google Identity Services
  const initGoogleGIS = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    if (typeof window !== "undefined" && (window as unknown as { google?: { accounts: { id: { initialize: (o: unknown) => void; renderButton: (el: HTMLElement | null, o: unknown) => void; prompt: () => void } } } }).google) {
      const google = (window as unknown as { google: { accounts: { id: { initialize: (o: unknown) => void; renderButton: (el: HTMLElement | null, o: unknown) => void; prompt: () => void } } } }).google;
      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          auto_select: false,
        });

        const btnContainer = document.getElementById("google-signin-btn-container");
        if (btnContainer) {
          btnContainer.innerHTML = "";
          google.accounts.id.renderButton(btnContainer, {
            theme: "filled_blue",
            size: "large",
            width: "340",
            text: "continue_with",
            shape: "pill",
          });
        }
        setGoogleInitialized(true);
      } catch (e) {
        console.warn("Google GIS init error:", e);
      }
    }
  }, [handleGoogleResponse]);

  // Effect to re-initialize Google whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      initGoogleGIS();
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen, initGoogleGIS]);

  // Trigger Google One-Tap / Sign-In on manual button click
  const triggerGoogleSignIn = () => {
    const google = typeof window !== "undefined" ? (window as unknown as { google?: { accounts: { id: { prompt: (cb?: unknown) => void } } } }).google : null;
    if (google?.accounts?.id) {
      google.accounts.id.prompt((notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One Tap popup was blocked by browser or cookies, click the rendered Google button
          const btn = document.querySelector("#google-signin-btn-container div[role=button]") as HTMLElement;
          if (btn) {
            btn.click();
          } else {
            setError("Google One-Tap is loading or blocked by your browser. Please enter your email below.");
          }
        }
      });
    } else {
      initGoogleGIS();
    }
  };

  if (!isOpen) return null;

  // Send 6-digit OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPreviewOtp(null);

    try {
      const res = await fetch("/api/qr-review/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send code");
      }

      setStep("otp");
      setCountdown(60);

      // If server returned previewCode (e.g. RESEND_API_KEY not configured)
      if (data.previewCode) {
        setPreviewOtp(data.previewCode);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to dispatch login code");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify 6-digit OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otp || otp.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/qr-review/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid code. Please try again.");
      }

      onSuccess(data.owner);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isGmailUser = email.toLowerCase().includes("@gmail.com") || email.toLowerCase().includes("@googlemail.com");

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      {/* Google Identity Services Script */}
      <Script
        id="google-gis-script"
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogleGIS}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-base font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/30 mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {step === "email" ? "Business Owner Sign-In" : "Enter Verification Code"}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed px-2">
            {step === "email"
              ? businessName
                ? `1-Click verification for ${businessName} owners`
                : "Instant access to your growth dashboard and review stats"
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: GOOGLE 1-CLICK OR EMAIL INPUT */}
        {step === "email" ? (
          <div className="space-y-4">
            
            {/* 1. GOOGLE 1-CLICK AUTH BUTTON (PRIMARY FOR GMAIL/GOOGLE USERS) */}
            <div className="space-y-2">
              {/* Google Native / Fallback Button */}
              <button
                type="button"
                onClick={triggerGoogleSignIn}
                className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-white hover:bg-slate-100 text-slate-900 shadow-md flex items-center justify-center gap-3 transition-transform active:scale-[0.98] border border-slate-200"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google (1-Click)</span>
              </button>

              {/* Google Render Container (Auto-injected by GIS if supported) */}
              <div id="google-signin-btn-container" className="flex justify-center empty:hidden"></div>

              <p className="text-[10px] text-center text-slate-500 font-medium">
                Fastest for Gmail &amp; Google Workspace business accounts
              </p>
            </div>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 py-1">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Or With Work Email (OTP)
              </span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            {/* 2. EMAIL OTP FORM (FOR YAHOO, OUTLOOK, HOTMAIL & CUSTOM CLINIC DOMAINS) */}
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Outlook, Yahoo, or Custom Clinic Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@apexclinic.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                {isGmailUser && (
                  <p className="text-[10px] text-blue-400 pt-0.5">
                    💡 Gmail detected! You can use the 1-Click Google button above for instant sign-in.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Send 6-Digit Login Code <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: 6-DIGIT OTP VERIFICATION */
          <div className="space-y-5">
            {/* Auto-fill banner if preview code returned */}
            {previewOtp && (
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Your Verification Code:</span>
                  <button
                    type="button"
                    onClick={() => setOtp(previewOtp)}
                    className="text-blue-400 font-bold hover:underline text-xs"
                  >
                    Click to Auto-Fill ➔
                  </button>
                </div>
                <div className="text-2xl font-mono font-black text-blue-400 tracking-[8px] text-center py-1">
                  {previewOtp}
                </div>
                <p className="text-[10px] text-slate-400 text-center leading-tight">
                  (Resend email key not connected on server. Code displayed here for instant access)
                </p>
              </div>
            )}

            {/* Google alternative button on OTP screen if user prefers */}
            {isGmailUser && (
              <button
                type="button"
                onClick={triggerGoogleSignIn}
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-white/95 hover:bg-white text-slate-900 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Or Sign in with 1-Click Google</span>
              </button>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2 text-center">
                <label className="text-xs font-semibold text-slate-300 block">
                  Type 6-Digit Code
                </label>
                <div className="relative">
                  <input
                    ref={otpInputRef}
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[12px] font-mono text-2xl font-black py-3.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-blue-400 placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    autoComplete="one-time-code"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" /> Verify &amp; Access Dashboard
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  disabled={countdown > 0 || isLoading}
                  onClick={() => handleSendOtp()}
                  className="text-blue-400 hover:text-blue-300 disabled:text-slate-600 disabled:cursor-not-allowed flex items-center gap-1 transition-colors font-medium"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="pt-2 text-center border-t border-slate-800/80">
          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <span>🔒 256-Bit Bank-Grade Encryption</span>
            <span>•</span>
            <span>Passwordless Security</span>
          </p>
        </div>
      </div>
    </div>
  );
}
