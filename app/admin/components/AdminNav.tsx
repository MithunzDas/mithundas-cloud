"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Calendar, ShieldCheck, Cpu } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const isLeads = pathname?.includes("/admin/leads");
  const isBookings = pathname?.includes("/admin/bookings");

  return (
    <header className="sticky top-0 z-30 bg-[#0b0f17]/90 backdrop-blur-md border-b border-border-app px-6 py-3.5 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-indigo/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-sans font-bold text-text-primary flex items-center gap-2">
              Mithun Das <span className="text-xs px-2 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-mono font-medium">ADMIN OPS</span>
            </h1>
            <p className="text-xs text-text-secondary font-mono">
              Automation Architecture &amp; Discovery Session Control Center
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-[#121824] p-1.5 rounded-xl border border-border-app/80">
          <Link
            href="/admin/bookings"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isBookings
                ? "bg-gradient-to-r from-brand-cyan/20 to-brand-indigo/20 text-brand-cyan border border-brand-cyan/40 shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Discovery Meetings</span>
          </Link>

          <Link
            href="/admin/leads"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isLeads
                ? "bg-gradient-to-r from-brand-cyan/20 to-brand-indigo/20 text-brand-cyan border border-brand-cyan/40 shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Leads Intake</span>
          </Link>
        </div>

        {/* Security Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4" />
          <span>Session Authenticated</span>
        </div>
      </div>
    </header>
  );
}
