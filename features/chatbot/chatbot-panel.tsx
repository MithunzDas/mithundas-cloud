"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: string;
  suggestedNextAction?: string;
  timestamp: Date;
}

const QUICK_SUGGESTIONS = [
  "What automation services do you offer?",
  "How does pricing work?",
  "Can you build n8n workflows?",
  "I want to schedule a call",
];

export function ChatbotPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setHasInteracted(true);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) throw new Error("Chat API failed");

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer || "I couldn't process that. Please try again.",
        intent: data.intent,
        suggestedNextAction: data.suggestedNextAction,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "I'm having a connectivity issue. You can reach me directly through the assessment form.",
        intent: "handoff",
        suggestedNextAction: "start_assessment",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const getActionButton = (msg: ChatMessage) => {
    if (!msg.suggestedNextAction) return null;

    switch (msg.suggestedNextAction) {
      case "start_assessment":
        return (
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            <button className="mt-2 flex items-center gap-1.5 rounded-md bg-accent-cyan/15 border border-accent-cyan/30 px-3 py-1.5 font-mono text-[11px] text-accent-cyan transition-colors hover:bg-accent-cyan/25">
              <ArrowRight className="h-3 w-3" />
              Start Assessment
            </button>
          </Link>
        );
      case "book_call":
        return (
          <a href="https://calendly.com/mithun-mithundas/15min" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
            <button className="mt-2 flex items-center gap-1.5 rounded-md bg-accent-green/15 border border-accent-green/30 px-3 py-1.5 font-mono text-[11px] text-accent-green transition-colors hover:bg-accent-green/25">
              <ArrowRight className="h-3 w-3" />
              Book a Call
            </button>
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue opacity-30 blur-md transition-opacity group-hover:opacity-60 animate-pulse"></div>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue shadow-lg transition-transform focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Close chat" : "Open AI assistant"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-6 w-6 text-text-inverse" strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MessageCircle className="h-6 w-6 text-text-inverse" strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-48px)] flex-col rounded-2xl border border-white/10 bg-background-app/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden"
            style={{ height: "min(600px, calc(100vh - 140px))" }}
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-white/5 bg-background-elevated/40 px-5 py-4 backdrop-blur-md">
              <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent"></div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 border border-white/5 shadow-inner">
                <Sparkles className="h-4 w-4 text-accent-cyan" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-[15px] font-semibold text-text-primary tracking-wide">
                  AI Operations Assistant
                </h3>
                <p className="font-mono text-[10px] text-text-muted mt-0.5">
                  Powered by Mithun Das
                </p>
              </div>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-status-success/10 border border-status-success/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-success" />
                </span>
                <span className="font-mono text-[9px] text-status-success font-medium">ONLINE</span>
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
              {/* Welcome Message */}
              {!hasInteracted && messages.length === 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 border border-white/5 mt-0.5">
                      <Bot className="h-4 w-4 text-accent-cyan" strokeWidth={1.75} />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm border border-white/5 bg-white/5 backdrop-blur-sm px-4 py-3 max-w-[85%] shadow-sm">
                      <p className="font-sans text-[14px] text-text-primary leading-relaxed">
                        Hello! I&apos;m Mithun&apos;s AI operations assistant. I can explain
                        our automation systems, pricing, or help you schedule a
                        diagnostic consultation.
                      </p>
                    </div>
                  </div>

                  {/* Quick Suggestion Chips */}
                  <div className="flex flex-wrap gap-2 pl-11">
                    {QUICK_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-[11px] text-text-secondary transition-all hover:border-accent-cyan/40 hover:bg-accent-cyan/10 hover:text-accent-cyan hover:-translate-y-0.5 shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Thread */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === "user" ? "justify-end" : ""
                    }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 border border-white/5 mt-0.5 shadow-sm">
                      <Bot className="h-4 w-4 text-accent-cyan" strokeWidth={1.75} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === "user"
                        ? "rounded-tr-sm bg-gradient-to-br from-accent-cyan to-accent-blue text-text-inverse border border-accent-cyan/50"
                        : "rounded-tl-sm border border-white/5 bg-white/5 backdrop-blur-sm"
                      }`}
                  >
                    <p
                      className={`font-sans text-[14px] leading-relaxed ${msg.role === "user" ? "text-text-inverse font-medium" : "text-text-primary"
                        }`}
                    >
                      {msg.content}
                    </p>
                    {msg.role === "assistant" && getActionButton(msg)}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/10 mt-0.5 shadow-sm">
                      <User className="h-4 w-4 text-text-primary" strokeWidth={1.75} />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex gap-3 animate-in fade-in duration-300">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 border border-white/5 mt-0.5">
                    <Bot className="h-4 w-4 text-accent-cyan" strokeWidth={1.75} />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-white/5 bg-white/5 backdrop-blur-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 text-accent-cyan animate-spin" />
                      <span className="font-mono text-[11px] text-text-secondary">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center gap-2 border-t border-white/10 bg-background-elevated/60 px-4 py-3 backdrop-blur-md"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about automation systems..."
                disabled={isLoading}
                className="flex-1 min-w-0 rounded-xl border border-white/10 bg-background-app/50 px-4 py-3 font-sans text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/30 disabled:opacity-50 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue text-text-inverse transition-all hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                aria-label="Send message"
              >
                <Send className="h-4 w-4 ml-0.5" strokeWidth={2.5} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
