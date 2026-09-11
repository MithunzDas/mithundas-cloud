"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Search,
  Filter,
  Eye,
  SlidersHorizontal
} from "lucide-react";
import {
  INDUSTRY_QUESTION_POOLS,
  IndustryConfig,
  PoolQuestion,
  getRandomQuestionsForCategory
} from "@/lib/qr-review/question-pools";

interface QuestionPoolExplorerProps {
  initialIndustry?: string;
  businessName?: string;
  city?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export default function QuestionPoolExplorer({
  initialIndustry = "DENTIST",
  businessName = "Your Business",
  city = "Your City",
  isModal = false,
  onClose
}: QuestionPoolExplorerProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(initialIndustry);
  const [selectedSubCat, setSelectedSubCat] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Live Simulation state
  const [simQuestions, setSimQuestions] = useState<PoolQuestion[]>(() =>
    getRandomQuestionsForCategory(initialIndustry, 4)
  );
  const [simAnswers, setSimAnswers] = useState<Record<string, string>>({});
  const [simReview, setSimReview] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const currentConfig: IndustryConfig =
    INDUSTRY_QUESTION_POOLS[selectedIndustry] || INDUSTRY_QUESTION_POOLS.DENTIST;

  // Handle switching category
  const handleSelectIndustry = (key: string) => {
    setSelectedIndustry(key);
    setSelectedSubCat("ALL");
    setSearchQuery("");
    const newRandom = getRandomQuestionsForCategory(key, 4);
    setSimQuestions(newRandom);
    setSimAnswers({});
    setSimReview("");
  };

  // Get unique sub-categories
  const subCategories = React.useMemo(() => {
    const map = new Map<string, string>();
    currentConfig.questions.forEach((q) => {
      if (q.category) {
        map.set(q.category, q.categoryLabel || q.category);
      }
    });
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [currentConfig]);

  // Filtered questions
  const filteredQuestions = currentConfig.questions.filter((q) => {
    const matchesSubCat = selectedSubCat === "ALL" || q.category === selectedSubCat;
    const matchesSearch =
      searchQuery.trim() === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubCat && matchesSearch;
  });

  // Shuffle simulation
  const handleShuffleSim = () => {
    const newRandom = getRandomQuestionsForCategory(selectedIndustry, 4);
    setSimQuestions(newRandom);
    setSimAnswers({});
    setSimReview("");
  };

  // Select chip in simulation
  const handleTapChip = (qId: string, label: string) => {
    setSimAnswers((prev) => ({
      ...prev,
      [qId]: label
    }));
  };

  // Generate review in simulation
  const handleGenerateSimReview = () => {
    setIsSimulating(true);
    const answersList = Object.values(simAnswers);
    
    setTimeout(() => {
      if (answersList.length === 0) {
        setSimReview(
          `Outstanding service at ${businessName}! The entire staff was welcoming, attentive, and everything was handled with care. 10/10 experience! ⭐⭐⭐⭐⭐`
        );
      } else {
        const highlights = answersList
          .map((a) => a.replace(/[^\w\s]/gi, "").trim())
          .filter(Boolean);
        
        const reviewDrafts = [
          `Really great experience at ${businessName} in ${city}! ${highlights[0] ? `The team was ${highlights[0].toLowerCase()}` : "Super friendly staff"}, and ${highlights[1] ? `everything was ${highlights[1].toLowerCase()}` : "the service was top notch"}. Noticeably professional and stress-free. Highly recommend to anyone! ✨🙌`,
          `Had a wonderful visit to ${businessName}! ${highlights[0] || "Very attentive and gentle"}. ${highlights[2] ? `Also really appreciated that ${highlights[2].toLowerCase()}` : "Zero hassle from start to finish"}. Definitely coming back! 💯`,
          `5 stars for ${businessName}! ${highlights[0] || "Exceptional quality"}, clean and modern setup, and ${highlights[1] ? highlights[1].toLowerCase() : "courteous staff"}. One of the best in the area! ⭐⭐⭐⭐⭐`
        ];

        setSimReview(reviewDrafts[Math.floor(Math.random() * reviewDrafts.length)]);
      }
      setIsSimulating(false);
    }, 450);
  };

  const handleCopyReview = async () => {
    if (simReview) {
      await navigator.clipboard.writeText(simReview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl ${isModal ? "p-6 sm:p-8 max-w-6xl w-full mx-auto" : "p-6 sm:p-10 my-10"}`}>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Category Question Engine • 30+ Questions Per Industry</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Transparent Question & Review Explorer
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            See the exact, authentic questions and 1-tap chips your customers will be asked. Our algorithm rotates 4 balanced questions per customer to ensure 100% genuine variety and prevent Google spam filters.
          </p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="self-start md:self-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            ✕ Close Preview
          </button>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none border-b border-slate-800/80">
        {Object.values(INDUSTRY_QUESTION_POOLS).map((cat) => {
          const isSelected = selectedIndustry === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectIndustry(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/30 scale-105"
                  : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50"
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name.split("/")[0]?.trim()}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? "bg-blue-700 text-white" : "bg-slate-900 text-slate-400"}`}>
                {cat.questions.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Questions List (60%) + Right Live Mobile Simulator (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Column: Full Question Library */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sub-category filter & search */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedSubCat("ALL")}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap ${
                  selectedSubCat === "ALL"
                    ? "bg-slate-700 text-white"
                    : "bg-slate-800/60 text-slate-400 hover:text-white"
                }`}
              >
                All ({currentConfig.questions.length})
              </button>
              {subCategories.map((sub) => (
                <button
                  key={sub.key}
                  onClick={() => setSelectedSubCat(sub.key)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap ${
                    selectedSubCat === sub.key
                      ? "bg-slate-700 text-white"
                      : "bg-slate-800/60 text-slate-400 hover:text-white"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Scrollable Box */}
          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-800 text-blue-400">
                    {q.categoryLabel || q.category}
                  </span>
                  <span className="text-[10px] text-slate-500">Q#{idx + 1}</span>
                </div>

                <p className="text-xs font-semibold text-slate-200 mb-2.5">
                  {q.question}
                </p>

                {/* 1-Tap Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {q.options.map((opt, optIdx) => (
                    <span
                      key={optIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium inline-flex items-center gap-1 hover:border-blue-500/50 hover:bg-slate-850 cursor-default transition-colors"
                    >
                      {opt.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-xs">
                No questions found matching your filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Live Customer Experience Simulator */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 p-5 rounded-3xl bg-slate-950 border border-slate-800/90 shadow-xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Live Customer Flow (10s)
                </span>
              </div>
              <button
                onClick={handleShuffleSim}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-medium transition-colors"
                title="Shuffle 4 random questions"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Shuffle 4</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mb-4">
              Test what a customer sees when scanning your QR standee. Tap a few chips below to simulate:
            </p>

            {/* 4 Sample Live Questions */}
            <div className="space-y-3 mb-4">
              {simQuestions.map((q) => (
                <div key={q.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <p className="text-[11px] font-bold text-slate-300 mb-1.5">
                    {q.question}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {q.options.slice(0, 3).map((opt, optIdx) => {
                      const isSelected = simAnswers[q.id] === opt.label;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleTapChip(q.id, opt.label)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-medium text-left transition-all ${
                            isSelected
                              ? "bg-blue-600 text-white font-bold ring-1 ring-blue-400"
                              : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerateSimReview}
              disabled={isSimulating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSimulating ? "AI Crafting Authentic Review..." : "Generate Sample Google Review"}</span>
            </button>

            {/* Generated Review Output Box */}
            {simReview && (
              <div className="mt-4 p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">
                      Resulting Google Review
                    </span>
                    <span className="text-amber-400 text-xs">★★★★★</span>
                  </div>
                  <button
                    onClick={handleCopyReview}
                    className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white font-medium"
                  >
                    {copied ? (
                      <span className="text-emerald-400 font-bold">✓ Copied</span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  &ldquo;{simReview}&rdquo;
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    1-Tap Redirect to Google Reviews
                  </span>
                  <span className="text-emerald-400 font-bold">100% Authentic</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
