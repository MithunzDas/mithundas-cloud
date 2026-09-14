import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";

const footerLinks = {
  platform: [
    { href: "/systems", label: "Operational Systems" },
    { href: "/products", label: "SaaS Products" },
    { href: "/demo", label: "Workflow Demo" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/process", label: "Engagement Process" },
    { href: "/insights", label: "Insights" },
  ],
  services: [
    { href: "/systems#ai-support", label: "AI Customer Support" },
    { href: "/systems#whatsapp", label: "WhatsApp Automation" },
    { href: "/systems#crm", label: "CRM Integration" },
    { href: "/systems#document", label: "Document Processing" },
    { href: "/systems#approval", label: "Approval Workflows" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/certificates/udyam-registration-certificate.pdf", label: "MSME Registration", external: true },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-background-inset">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md overflow-hidden bg-background-surface">
                <img src="/logo.png" alt="Mithun Das AI Logo" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-body font-semibold text-text-primary">
                  Mithun Das
                </span>
                <span className="font-mono text-[10px] leading-tight text-accent-cyan uppercase tracking-wider font-semibold">
                  AI Automation
                </span>
              </div>
            </Link>
            <p className="mt-3 font-sans text-small text-text-muted leading-relaxed">
              AI Business Automation Engineer. Designing operational AI systems that eliminate
              repetitive work and connect disconnected business software.
            </p>
            
            {/* Academic Credentials Trust Signals */}
            <div className="mt-3 border-t border-border-subtle pt-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Education</span>
              <p className="mt-1 font-mono text-[11px] text-text-secondary leading-relaxed">
                M.Tech in Systems & Control Engineering, NIT Warangal<br />
                B.E. in Electronics & Instrumentation, Jadavpur University
              </p>
            </div>

            {/* Enterprise Registration Trust Signal */}
            <div className="mt-3 border-t border-border-subtle pt-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  Registered Enterprise
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-accent-cyan/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-accent-cyan uppercase tracking-wider">
                  MSME • GOI
                </span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-text-secondary">
                Mithun Das AI Automation
              </p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-text-muted">
                  UDYAM-WB-14-0303625
                </span>
                <a
                  href="/certificates/udyam-registration-certificate.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[10px] font-medium text-accent-cyan hover:underline"
                >
                  <span>Certificate</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="mailto:hello@mithundas.cloud"
                className="flex h-8 items-center gap-1.5 rounded-md border border-border-subtle px-2.5 text-text-muted transition-colors hover:border-border-default hover:text-text-secondary"
                aria-label="Email"
              >
                <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="font-mono text-label">Email</span>
              </a>
              <a
                href="https://wa.me/918768138086"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 items-center gap-1.5 rounded-md border border-border-subtle px-2.5 text-text-muted transition-colors hover:border-border-default hover:text-text-secondary"
                aria-label="WhatsApp"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="font-mono text-label">WhatsApp</span>
              </a>
              <a
                href="https://www.linkedin.com/in/mithun-das-46347a239/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 items-center gap-1.5 rounded-md border border-border-subtle px-2.5 text-text-muted transition-colors hover:border-border-default hover:text-text-secondary"
                aria-label="LinkedIn"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="font-mono text-label">LinkedIn</span>
              </a>
              <a
                href="https://github.com/MithunzDas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 items-center gap-1.5 rounded-md border border-border-subtle px-2.5 text-text-muted transition-colors hover:border-border-default hover:text-text-secondary"
                aria-label="GitHub"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="font-mono text-label">GitHub</span>
              </a>
              <a
                href="https://x.com/MithunzDas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 items-center gap-1.5 rounded-md border border-border-subtle px-2.5 text-text-muted transition-colors hover:border-border-default hover:text-text-secondary"
                aria-label="Twitter / X"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="font-mono text-label">X</span>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-mono text-label uppercase tracking-wider text-text-muted">
              Platform
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-small text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-mono text-label uppercase tracking-wider text-text-muted">
              Systems
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-small text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + CTA */}
          <div>
            <h4 className="font-mono text-label uppercase tracking-wider text-text-muted">
              Legal
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  {'external' in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-sans text-small text-text-secondary transition-colors hover:text-text-primary"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="h-3 w-3 text-text-muted" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="font-sans text-small text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg border border-border-subtle bg-background-surface p-4">
              <p className="font-sans text-small font-medium text-text-primary">
                Ready to automate?
              </p>
              <p className="mt-1 font-sans text-label text-text-muted">
                Share your workflow and get a structured automation assessment.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center font-sans text-small font-medium text-accent-cyan transition-colors hover:text-accent-cyan/80"
              >
                Start Assessment →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-6 sm:flex-row">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-label text-text-muted">
            <span>© {new Date().getFullYear()} Mithun Das AI Automation.</span>
            <span className="text-border-default">•</span>
            <span>
              MSME Reg: <span className="text-text-secondary">UDYAM-WB-14-0303625</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-label text-text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-success opacity-40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-success" />
              </span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
