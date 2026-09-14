"use client";

import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { Mail, ShieldCheck, ArrowRight, Loader2, RefreshCw, KeyRound } from "lucide-react";

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
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

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

  if (!isOpen) return null;

  // Handle Google GIS callback
  const handleGoogleResponse = async (response: { credential: string }) => {
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
  };

  // Google script load handler
  const handleGoogleScriptLoad = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId && typeof window !== "undefined" && (window as unknown as { google?: { accounts: { id: { initialize: (opts: unknown) => void; renderButton: (el: HTMLElement | null, opts: unknown) => void; prompt: () => void } } } }).google) {
      const google = (window as unknown as { google: { accounts: { id: { initialize: (opts: unknown) => void; renderButton: (el: HTMLElement | null, opts: unknown) => void; prompt: () => void } } } }).google;
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });

      const btnContainer = document.getElementById("google-signin-btn-container");
      if (btnContainer) {
        google.accounts.id.renderButton(btnContainer, {
          theme: "filled_blue",
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "pill",
        });
      }
      google.accounts.id.prompt(); // Trigger Google One-Tap
    }
  };

  // Send 6-digit OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid work or clinic email address.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setDevOtpHint(null);

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
      if (data.devCode) {
        setDevOtpHint(data.devCode);
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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      {/* Google Identity Services Script */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={handleGoogleScriptLoad}
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

        {/* Dev OTP Helper */}
        {devOtpHint && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-mono">
            Dev Code: <strong>{devOtpHint}</strong>
          </div>
        )}

        {/* STEP 1: EMAIL / GOOGLE ONE-TAP */}
        {step === "email" ? (
          <div className="space-y-4">
            {/* Google Container */}
            <div id="google-signin-btn-container" className="w-full min-h-[44px] flex justify-center"></div>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px bg-slate-800 flex-1"></div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Or With Work Email
              </span>
              <div className="h-px bg-slate-800 flex-1"></div>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Clinic / Business Owner Email
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
                  <KeyRound className="w-4 h-4" /> Verify & Access Dashboard
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
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
        )}

        <div className="pt-2 text-center border-t border-slate-800/80">
          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <span>🔒 Bank-Grade 256-Bit SSL</span>
            <span>•</span>
            <span>Passwordless Protection</span>
          </p>
        </div>
      </div>
    </div>
  );
}
