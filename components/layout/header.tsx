"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/systems", label: "Systems" },
  { href: "/demo", label: "Demo" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/process", label: "Process" },
  { href: "/affidavit-generator", label: "Products" },
  { href: "/insights", label: "Insights" },
];

const mobileNavLinks = [
  { href: "/systems", label: "Systems" },
  { href: "/demo", label: "Demo" },
  { href: "/process", label: "Process" },
  { href: "/affidavit-generator", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-background-app/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-md overflow-hidden bg-background-surface">
            <img src="/logo.png" alt="Mithun Das AI Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[17px] leading-tight font-semibold text-text-primary">
              Mithun Das
            </span>
            <span className="hidden font-mono text-[11px] leading-tight text-accent-cyan sm:block uppercase tracking-wider font-semibold">
              AI Automation
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-md px-3 py-1.5 font-sans text-small font-medium transition-colors",
                  isActive
                    ? "text-accent-cyan"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="active-nav"
                    className="absolute inset-x-1 -bottom-[17px] h-px bg-accent-cyan"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/contact">
            <Button size="sm">Start Assessment</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" strokeWidth={1.75} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border-subtle bg-background-surface md:hidden"
          >
            <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
              {mobileNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 font-sans text-body font-medium transition-colors",
                      isActive
                        ? "bg-background-elevated text-accent-cyan"
                        : "text-text-secondary hover:bg-background-elevated hover:text-text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 border-t border-border-subtle pt-3">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Start Assessment</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
