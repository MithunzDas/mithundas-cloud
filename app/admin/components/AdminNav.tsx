"use client";

import React, { useState } from "react";
import LinkNext from "next/link";
import { usePathname } from "next/navigation";
import { Users, Calendar, ShieldCheck, Cpu, DollarSign, Sparkles, Menu, X } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLeads = pathname?.includes("/admin/leads");
  const isBookings = pathname?.includes("/admin/bookings");
  const isFinance = pathname?.includes("/admin/finance");
  const isLeadGen = pathname?.includes("/admin/lead-generation") || pathname?.includes("/admin/lead-genaration");

  const navItems = [
    {
      href: "/admin/lead-generation",
      label: "Lead Generation",
      shortLabel: "Lead Gen",
      icon: Sparkles,
      active: isLeadGen,
      highlight: true
    },
    {
      href: "/admin/leads",
      label: "Leads Intake",
      shortLabel: "Leads",
      icon: Users,
      active: isLeads
    },
    {
      href: "/admin/bookings",
      label: "Discovery Meetings",
      shortLabel: "Meetings",
      icon: Calendar,
      active: isBookings
    },
    {
      href: "/admin/finance",
      label: "Financial Ledger",
      shortLabel: "Finance",
      icon: DollarSign,
      active: isFinance
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b12]/95 backdrop-blur-xl border-b border-border-app/70 px-3 sm:px-6 py-2.5 sm:py-3 mb-4 sm:mb-6 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-indigo/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan flex-shrink-0 shadow-md">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-base font-sans font-bold text-text-primary truncate">
                Mithun Das
              </h1>
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan font-mono font-bold whitespace-nowrap">
                OPS
              </span>
            </div>
            <p className="text-[9px] sm:text-xs text-text-secondary font-mono truncate hidden xs:block">
              Automation &amp; Revenue Command
            </p>
          </div>
        </div>

        {/* Center: Scrollable Swipeable Navigation Ribbon for Mobile + Clean Tabs for Desktop */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-[#0e1422] p-1 sm:p-1.5 rounded-xl border border-border-app/80 overflow-x-auto scrollbar-none max-w-[58vw] sm:max-w-none">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <LinkNext
                key={idx}
                href={item.href}
                className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  item.active
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-brand-cyan border border-cyan-500/40 shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${item.highlight && item.active ? "text-brand-cyan animate-pulse" : ""}`} />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden text-[11px] font-mono">{item.shortLabel}</span>
              </LinkNext>
            );
          })}
        </nav>

        {/* Right: Security Pill (Compact on Mobile, Full on Desktop) */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div
            className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 sm:px-3 py-1.5 rounded-xl"
            title="Session Authenticated & Encrypted"
          >
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden md:inline">Authenticated</span>
          </div>
        </div>

      </div>
    </header>
  );
}
