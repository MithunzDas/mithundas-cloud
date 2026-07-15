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
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            <button className="mt-2 flex items-center gap-1.5 rounded-md bg-accent-green/15 border border-accent-green/30 px-3 py-1.5 font-mono text-[11px] text-accent-green transition-colors hover:bg-accent-green/25">
              <ArrowRight className="h-3 w-3" />
              Book a Call
            </button>
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent-cyan shadow-lg shadow-accent-cyan/20 transition-colors hover:bg-accent-cyan/90 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:ring-offset-2 focus:ring-offset-background-app"
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

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-5 z-50 flex w-[360px] max-w-[calc(100vw-40px)] flex-col rounded-xl border border-border-subtle bg-background-surface shadow-panel overflow-hidden"
            style={{ height: "min(520px, calc(100vh - 140px))" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border-subtle bg-background-elevated px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-cyan/10">
                <Sparkles className="h-4 w-4 text-accent-cyan" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-small font-semibold text-text-primary">
                  AI Operations Assistant
                </h3>
                <p className="font-mono text-[10px] text-text-muted">
                  Powered by Mithun Das
                </p>
              </div>
              <span className="flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-status-success" />
                </span>
                <span className="font-mono text-[9px] text-text-muted">ONLINE</span>
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Welcome Message */}
              {!hasInteracted && messages.length === 0 && (
                <div className="space-y-4">
                  <div className="flex gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-cyan/10 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-accent-cyan" strokeWidth={1.75} />
                    </div>
                    <div className="rounded-lg rounded-tl-none border border-border-subtle bg-background-inset px-3 py-2.5 max-w-[85%]">
                      <p className="font-sans text-[13px] text-text-secondary leading-relaxed">
                        Hello! I&apos;m Mithun&apos;s AI operations assistant. I can explain
                        our automation systems, pricing, or help you schedule a
                        diagnostic consultation.
                      </p>
                    </div>
                  </div>

                  {/* Quick Suggestion Chips */}
                  <div className="flex flex-wrap gap-2 pl-9">
                    {QUICK_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="rounded-full border border-border-subtle bg-background-elevated px-3 py-1.5 font-mono text-[10px] text-text-secondary transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
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
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-cyan/10 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-accent-cyan" strokeWidth={1.75} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2.5 ${
                      msg.role === "user"
                        ? "rounded-tr-none bg-accent-cyan/15 border border-accent-cyan/20"
                        : "rounded-tl-none border border-border-subtle bg-background-inset"
                    }`}
                  >
                    <p
                      className={`font-sans text-[13px] leading-relaxed ${
                        msg.role === "user" ? "text-text-primary" : "text-text-secondary"
                      }`}
                    >
                      {msg.content}
                    </p>
                    {msg.role === "assistant" && getActionButton(msg)}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-border-subtle mt-0.5">
                      <User className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.75} />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-cyan/10 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-accent-cyan" strokeWidth={1.75} />
                  </div>
                  <div className="rounded-lg rounded-tl-none border border-border-subtle bg-background-inset px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 text-accent-cyan animate-spin" />
                      <span className="font-mono text-[10px] text-text-muted">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border-subtle bg-background-elevated px-3 py-2.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about automation systems..."
                disabled={isLoading}
                className="flex-1 min-w-0 rounded-md border border-border-subtle bg-background-inset px-3 py-2 font-sans text-[13px] text-text-primary placeholder:text-text-muted focus:border-accent-cyan/50 focus:outline-none focus:ring-1 focus:ring-accent-cyan/30 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-cyan text-text-inverse transition-colors hover:bg-accent-cyan/90 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" strokeWidth={2} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
