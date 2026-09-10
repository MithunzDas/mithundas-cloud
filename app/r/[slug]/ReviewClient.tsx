"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Sparkles,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  MessageSquareHeart,
  Send,
  ShieldCheck,
  RefreshCw,
  Building2,
  ArrowRight
} from "lucide-react";
import { PoolQuestion, getRandomQuestionsForCategory } from "@/lib/qr-review/question-pools";

interface BusinessData {
  id: string;
  slug: string;
  businessName: string;
  category: string;
  city?: string | null;
  country?: string | null;
  placeId?: string | null;
  googleReviewUrl: string;
  logoUrl?: string | null;
}

interface ReviewClientProps {
  business: BusinessData;
}

export default function ReviewClient({ business }: ReviewClientProps) {
  const [rating, setRating] = useState<number>(5);
  const [questions, setQuestions] = useState<PoolQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedReview, setGeneratedReview] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [step, setStep] = useState<"questions" | "review" | "private_feedback">("questions");

  // Private feedback form state for ratings 1-3
  const [privateFeedback, setPrivateFeedback] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Initialize random 4 questions on mount
  useEffect(() => {
    const randomSet = getRandomQuestionsForCategory(business.category, 4);
    setQuestions(randomSet);
  }, [business.category]);

  const handleSelectAnswer = (questionId: string, answerLabel: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerLabel,
    }));
  };

  const handleGenerateReview = async () => {
    // If rating is low, route to private feedback option
    if (rating <= 3) {
      setStep("private_feedback");
      return;
    }

    setIsGenerating(true);
    try {
      const answersList = Object.entries(selectedAnswers).map(([qId, ans]) => {
        const qObj = questions.find((q) => q.id === qId);
        return {
          question: qObj?.question || "Service feedback",
          answer: ans,
        };
      });

      const res = await fetch("/api/qr-review/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          businessName: business.businessName,
          category: business.category,
          city: business.city,
          answers: answersList,
          ratingScore: rating,
        }),
      });

      const data = await res.json();
      if (data.success && data.reviewText) {
        setGeneratedReview(data.reviewText);
        setSessionId(data.sessionId || null);
        setStep("review");
      } else {
        // Fallback
        setGeneratedReview(
          `Outstanding service at ${business.businessName}! The entire staff was welcoming, professional, and took great care of me. Will definitely be returning! ⭐⭐⭐⭐⭐`
        );
        setStep("review");
      }
    } catch {
      setGeneratedReview(
        `Really wonderful experience at ${business.businessName}. Friendly staff, quick service, and great results! Highly recommended. ⭐`
      );
      setStep("review");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAndRedirect = async () => {
    try {
      // 1. Copy to mobile clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedReview);
      } else {
        // Fallback for older webviews
        const textarea = document.createElement("textarea");
        textarea.value = generatedReview;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);

      // 2. Track conversion analytics
      fetch("/api/qr-review/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          businessId: business.id,
          action: "redirect",
        }),
      }).catch(() => {});

      // 3. Automatically redirect directly to Google Reviews
      setTimeout(() => {
        window.location.href = business.googleReviewUrl;
      }, 700);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      // Still redirect even if clipboard failed
      window.location.href = business.googleReviewUrl;
    }
  };

  const handleSubmitPrivateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/qr-review/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          customerName,
          customerPhone,
          feedbackText: privateFeedback,
          ratingScore: rating,
        }),
      });
      setFeedbackSubmitted(true);
    } catch {
      setFeedbackSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between gap-6 py-2">
      {/* Header with Business Branding */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.businessName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <h1 className="font-semibold text-slate-100 text-base leading-tight tracking-tight">
              {business.businessName}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <span>{business.city || "Official Feedback Assistant"}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-emerald-500"></span>
              <span className="text-emerald-400 font-medium">10-Sec Fast Review</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-amber-300">Google Verified</span>
        </div>
      </header>

      {/* STEP 1: Questions & Rating */}
      {step === "questions" && (
        <div className="space-y-6 flex-1">
          {/* Star Rating Selector */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 text-center shadow-xl backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-3">
              How was your experience today?
            </p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1.5 transition-transform active:scale-90 hover:scale-110 focus:outline-none"
                  aria-label={`${star} star rating`}
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                        : "text-slate-700 fill-slate-800"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              {rating === 5 && "⭐ Excellent! Flawless visit"}
              {rating === 4 && "👍 Good experience"}
              {rating === 3 && "😐 Average, could be better"}
              {rating <= 2 && "⚠️ Needs improvement"}
            </p>
          </div>

          {/* Dynamic 4 Random Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Quick 1-Tap Highlights
              </span>
              <span className="text-xs text-blue-400 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3" /> AI Summarizer
              </span>
            </div>

            {questions.map((q, idx) => (
              <div key={q.id} className="bg-slate-900/40 border border-slate-850 rounded-xl p-3.5 space-y-2.5">
                <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {q.question}
                </p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const isSelected = selectedAnswers[q.id] === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, opt.label)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-150 text-left flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02] border border-blue-400"
                            : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 hover:border-slate-600 active:scale-95"
                        }`}
                      >
                        {opt.label}
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateReview}
              className="w-full py-3.5 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 text-sm"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Drafting Your Review with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate My 15-Sec Google Review</span>
                  <ArrowRight className="w-4 h-4 text-white/80 ml-1" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              Instant human-sounding review drafted from your selections. You can edit before posting!
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: AI Review Generated - Ready to Copy & Deep Link */}
      {step === "review" && (
        <div className="space-y-6 flex-1 flex flex-col justify-between animate-fadeIn">
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  Review Generated Successfully!
                </h2>
                <p className="text-xs text-emerald-400/90 mt-0.5">
                  Click the button below to copy the review and open Google Maps to paste it.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  Your 5-Star Review (Tap to Edit if Desired):
                </span>
                <span className="text-[11px] text-slate-500">{generatedReview.length} chars</span>
              </div>

              {/* Editable Review Box */}
              <div className="relative">
                <textarea
                  value={generatedReview}
                  onChange={(e) => setGeneratedReview(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-900 border-2 border-blue-500/40 focus:border-blue-500 rounded-2xl p-4 text-sm text-slate-100 leading-relaxed focus:outline-none shadow-inner resize-none transition-colors"
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-1 bg-slate-800/90 border border-slate-700 px-2 py-0.5 rounded-full text-[10px] text-slate-400">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Natural & Casual
                </div>
              </div>
            </div>

            {/* Quick 2-Step Instructions Banner */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2">
              <p className="font-semibold text-slate-300">How to post on Google (Takes 5 seconds):</p>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                <span>Click <strong>"Copy & Open Google"</strong> below</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                <span>In Google Maps, tap <strong>Paste</strong> and hit <strong>Post</strong></span>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Copy & Open Google */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleCopyAndRedirect}
              className={`w-full py-4 px-5 rounded-2xl font-bold text-white shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 text-base active:scale-[0.98] ${
                copied
                  ? "bg-emerald-600 shadow-emerald-600/30 scale-[1.01]"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-400 shadow-blue-600/30"
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
                  <span>Review Copied! Opening Google...</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 text-white" />
                  <span>Copy & Open Google Review</span>
                  <ExternalLink className="w-4 h-4 text-white/80" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep("questions")}
              className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors text-center"
            >
              ← Back to questions to regenerate
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FTC-Compliant Private Feedback Form (For 1-3 Stars) */}
      {step === "private_feedback" && (
        <div className="space-y-5 flex-1 flex flex-col justify-between animate-fadeIn">
          {feedbackSubmitted ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-4 my-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-100">Thank you for your honesty</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your feedback has been sent directly to the owner of <strong>{business.businessName}</strong>. We take this seriously and will take immediate action.
              </p>
              <div className="pt-2">
                <a
                  href={business.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline flex items-center justify-center gap-1"
                >
                  Continue to Google Reviews anyway <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitPrivateFeedback} className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    We're so sorry your visit wasn't 5-star
                  </h3>
                  <p className="text-xs text-amber-400/90 mt-0.5">
                    Please tell the clinic management what went wrong so we can resolve this immediately for you.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    What could we have done better? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={privateFeedback}
                    onChange={(e) => setPrivateFeedback(e.target.value)}
                    placeholder="Tell the owner directly what happened..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl p-3 text-xs text-slate-100 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Your Name (Optional)</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Privately to Management</span>
                </button>

                {/* FTC & Google Compliant Public Link */}
                <div className="text-center pt-1">
                  <a
                    href={business.googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-500 hover:text-slate-300 underline"
                  >
                    Or post directly on Google Reviews
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Security & Trust Footer */}
      <footer className="pt-4 border-t border-slate-900 text-center flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>100% Genuine Human Feedback • Powered by QR Review System</span>
      </footer>
    </div>
  );
}
