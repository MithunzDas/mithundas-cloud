import { Resend } from "resend";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { saveEmailLog } from "@/lib/db";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

/* ────────────────────────────────────────────────────── *
 *  Types                                                 *
 * ────────────────────────────────────────────────────── */

interface LeadEmailData {
  name: string;
  email: string;
  company: string;
  businessType: string;
  budget: string;
  timeline: string;
  projectRequirement: string;
  whatsapp?: string;
  country?: string;
  leadId?: string;
}

interface OnboardingKitData {
  name: string;
  email: string;
  company: string;
  invoiceAmount: string;
  invoiceId: string;
  projectScope: string;
  startDate: string;
  country?: string;
  depositPercent?: number;
  setupFee?: string;
  monthlyRetainer?: string;
  paymentLink?: string;
}

/* ────────────────────────────────────────────────────── *
 *  Helpers                                               *
 * ────────────────────────────────────────────────────── */

const PREMIUM_BUDGETS = ["3000_7500", "7500_plus"];

function getBookingLink(budget: string): { url: string; label: string; duration: string } {
  if (PREMIUM_BUDGETS.includes(budget)) {
    return {
      url: env.CAL_PREMIUM_LINK || "https://cal.com/mithundas/discovery-workshop",
      label: "30-Minute Executive Discovery Workshop",
      duration: "30 min",
    };
  }
  return {
    url: env.CAL_STANDARD_LINK || "https://cal.com/mithundas/diagnostic-call",
    label: "15-Minute Diagnostic Call",
    duration: "15 min",
  };
}

function formatBudget(budget: string): string {
  const map: Record<string, string> = {
    under_500: "Under $500",
    "500_1500": "$500 – $1,500",
    "1500_3000": "$1,500 – $3,000",
    "3000_7500": "$3,000 – $7,500",
    "7500_plus": "$7,500+",
  };
  return map[budget] || budget;
}

function formatTimeline(timeline: string): string {
  const map: Record<string, string> = {
    urgent_7_days: "Urgent (within 7 days)",
    this_month: "This month",
    one_to_three_months: "1–3 months",
    exploring: "Exploring options",
  };
  return map[timeline] || timeline;
}

/* ────────────────────────────────────────────────────── *
 *  1. Lead Confirmation Email (to the prospect)          *
 * ────────────────────────────────────────────────────── */

export async function sendLeadConfirmation(lead: LeadEmailData): Promise<boolean> {
  if (!resend || !env.EMAIL_FROM) {
    logger.warn("Resend not configured — skipping lead confirmation email", "email_skip");
    return false;
  }

  const booking = getBookingLink(lead.budget);

  try {
    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: lead.email,
      subject: `Assessment Received — ${lead.company} | Mithun Das`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#12121a;border-radius:12px;border:1px solid #1e1e2e;overflow:hidden;">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#0891b2 0%,#06b6d4 100%);padding:32px 40px;">
    <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.3px;">Assessment Received</h1>
    <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.85);font-family:monospace;">MITHUN DAS — AI BUSINESS AUTOMATION</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#e0e0e8;line-height:1.7;">
      Hi <strong style="color:#fff;">${lead.name}</strong>,
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#e0e0e8;line-height:1.7;">
      Thank you for submitting your automation assessment for <strong style="color:#fff;">${lead.company}</strong>. I've received your requirements and will review them within the next 24 hours.
    </p>

    <!-- Summary Card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;border:1px solid #1e1e2e;border-radius:8px;margin:24px 0;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:11px;color:#06b6d4;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">Your Submission Summary</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:6px 0;font-size:13px;color:#888;width:120px;">Budget Range</td><td style="padding:6px 0;font-size:13px;color:#e0e0e8;">${formatBudget(lead.budget)}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#888;width:120px;">Timeline</td><td style="padding:6px 0;font-size:13px;color:#e0e0e8;">${formatTimeline(lead.timeline)}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#888;width:120px;">Industry</td><td style="padding:6px 0;font-size:13px;color:#e0e0e8;">${lead.businessType.replace(/_/g, " ")}</td></tr>
        </table>
      </td></tr>
    </table>

    <!-- CTA: Book a Call -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr><td align="center">
        <p style="margin:0 0 12px;font-size:13px;color:#888;">Want to fast-track the process?</p>
        <a href="${booking.url}" target="_blank" style="display:inline-block;background:#06b6d4;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:-0.2px;">
          Book ${booking.label}
        </a>
        <p style="margin:10px 0 0;font-size:11px;color:#666;font-family:monospace;">${booking.duration} — No obligation</p>
      </td></tr>
    </table>

    <p style="margin:24px 0 0;font-size:14px;color:#888;line-height:1.7;">
      I'll be in touch shortly with a tailored proposal.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#e0e0e8;">
      — Mithun Das
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:20px 40px;border-top:1px solid #1e1e2e;">
    <p style="margin:0;font-size:11px;color:#555;font-family:monospace;">mithundas.cloud • AI Business Automation</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`,
    });

    if (error) {
      logger.error("Failed to send lead confirmation email", "email_confirmation_error", error);
      return false;
    }

    logger.info(`Lead confirmation email sent to ${lead.email}`, "email_confirmation_sent");
    return true;
  } catch (error) {
    logger.error("Resend API exception during confirmation email", "email_confirmation_exception", error);
    return false;
  }
}

/* ────────────────────────────────────────────────────── *
 *  2. Admin Notification Email                           *
 * ────────────────────────────────────────────────────── */

export async function sendAdminNotification(lead: LeadEmailData): Promise<boolean> {
  if (!resend || !env.EMAIL_FROM || !env.ADMIN_EMAIL) {
    logger.warn("Resend or admin email not configured — skipping admin notification", "email_skip");
    return false;
  }

  const isPremium = PREMIUM_BUDGETS.includes(lead.budget);

  try {
    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: env.ADMIN_EMAIL,
      subject: `${isPremium ? "🔥 PREMIUM" : "📥"} New Lead: ${lead.company} — ${formatBudget(lead.budget)}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#12121a;border-radius:12px;border:1px solid ${isPremium ? "#f59e0b" : "#1e1e2e"};overflow:hidden;">

  <tr><td style="background:${isPremium ? "linear-gradient(135deg,#d97706,#f59e0b)" : "linear-gradient(135deg,#0891b2,#06b6d4)"};padding:24px 40px;">
    <h1 style="margin:0;font-size:18px;font-weight:700;color:#fff;">${isPremium ? "🔥 Premium Lead Received" : "New Lead Assessment"}</h1>
    <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.8);font-family:monospace;">${lead.leadId || "—"}</p>
  </td></tr>

  <tr><td style="padding:28px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:8px 0;font-size:13px;color:#888;width:140px;">Name</td><td style="padding:8px 0;font-size:14px;color:#fff;font-weight:600;">${lead.name}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;">Email</td><td style="padding:8px 0;font-size:14px;color:#06b6d4;">${lead.email}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;">Company</td><td style="padding:8px 0;font-size:14px;color:#e0e0e8;">${lead.company}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;">Industry</td><td style="padding:8px 0;font-size:14px;color:#e0e0e8;">${lead.businessType.replace(/_/g, " ")}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;">Budget</td><td style="padding:8px 0;font-size:14px;color:${isPremium ? "#f59e0b" : "#e0e0e8"};font-weight:${isPremium ? "700" : "400"};">${formatBudget(lead.budget)}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#888;">Timeline</td><td style="padding:8px 0;font-size:14px;color:#e0e0e8;">${formatTimeline(lead.timeline)}</td></tr>
      ${lead.whatsapp ? `<tr><td style="padding:8px 0;font-size:13px;color:#888;">WhatsApp</td><td style="padding:8px 0;font-size:14px;color:#22c55e;">${lead.whatsapp}</td></tr>` : ""}
      ${lead.country ? `<tr><td style="padding:8px 0;font-size:13px;color:#888;">Country</td><td style="padding:8px 0;font-size:14px;color:#e0e0e8;">${lead.country}</td></tr>` : ""}
    </table>

    <div style="margin:24px 0;padding:16px 20px;background:#0a0a0f;border:1px solid #1e1e2e;border-radius:8px;">
      <p style="margin:0 0 8px;font-size:11px;color:#06b6d4;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">Requirements</p>
      <p style="margin:0;font-size:13px;color:#e0e0e8;line-height:1.7;">${lead.projectRequirement}</p>
    </div>
  </td></tr>

  <tr><td style="padding:16px 40px;border-top:1px solid #1e1e2e;">
    <p style="margin:0;font-size:11px;color:#555;font-family:monospace;">Mithun Das Cloud — Admin Notification System</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`,
    });

    if (error) {
      logger.error("Failed to send admin notification email", "email_admin_error", error);
      return false;
    }

    logger.info(`Admin notification sent for lead: ${lead.company}`, "email_admin_sent");
    return true;
  } catch (error) {
    logger.error("Resend API exception during admin notification", "email_admin_exception", error);
    return false;
  }
}

/* ────────────────────────────────────────────────────── *
 *  3. Silent Lead Follow-up Email                        *
 * ────────────────────────────────────────────────────── */

export async function sendFollowUpEmail(
  lead: LeadEmailData,
  followUpRound: "24h" | "72h" = "24h"
): Promise<boolean> {
  if (!resend || !env.EMAIL_FROM) {
    logger.warn("Resend not configured — skipping follow-up email", "email_skip");
    return false;
  }

  const booking = getBookingLink(lead.budget);
  const is72h = followUpRound === "72h";

  try {
    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: lead.email,
      subject: is72h
        ? `Quick check-in — ${lead.company} automation assessment | Mithun Das`
        : `Following up on your automation assessment — ${lead.company} | Mithun Das`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#12121a;border-radius:12px;border:1px solid #1e1e2e;overflow:hidden;">

  <tr><td style="background:linear-gradient(135deg,#7c3aed 0%,#8b5cf6 100%);padding:28px 40px;">
    <h1 style="margin:0;font-size:18px;font-weight:700;color:#fff;">Following Up</h1>
    <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.8);font-family:monospace;">MITHUN DAS — AI BUSINESS AUTOMATION</p>
  </td></tr>

  <tr><td style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#e0e0e8;line-height:1.7;">
      Hi <strong style="color:#fff;">${lead.name}</strong>,
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#e0e0e8;line-height:1.7;">
      ${is72h
        ? `I wanted to check in once more about the automation assessment you submitted for <strong style="color:#fff;">${lead.company}</strong>. I've prepared some initial ideas and would love to walk through them with you.`
        : `I noticed your automation assessment for <strong style="color:#fff;">${lead.company}</strong> is still pending review on your end. I'd love to discuss the best approach for your requirements.`
      }
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr><td align="center">
        <a href="${booking.url}" target="_blank" style="display:inline-block;background:#8b5cf6;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
          ${is72h ? "Schedule a Quick Chat" : `Book ${booking.label}`}
        </a>
      </td></tr>
    </table>

    <p style="margin:20px 0 0;font-size:14px;color:#888;line-height:1.7;">
      No pressure — just reply to this email if you have any questions or need more time.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#e0e0e8;">
      — Mithun Das
    </p>
  </td></tr>

  <tr><td style="padding:16px 40px;border-top:1px solid #1e1e2e;">
    <p style="margin:0;font-size:11px;color:#555;font-family:monospace;">mithundas.cloud • Automated follow-up</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`,
    });

    if (error) {
      logger.error(`Failed to send ${followUpRound} follow-up email`, "email_followup_error", error);
      return false;
    }

    logger.info(`${followUpRound} follow-up email sent to ${lead.email}`, "email_followup_sent");
    return true;
  } catch (error) {
    logger.error(`Resend API exception during ${followUpRound} follow-up`, "email_followup_exception", error);
    return false;
  }
}

/* ────────────────────────────────────────────────────── *
 *  4. Onboarding Kit Email (Invoice + Terms + MSA)       *
 * ────────────────────────────────────────────────────── */

export async function sendOnboardingKit(data: OnboardingKitData): Promise<boolean> {
  if (!resend || !env.EMAIL_FROM) {
    logger.warn("Resend not configured — skipping onboarding kit", "email_skip");
    return false;
  }

  try {
    const isIndia = (data.country || "").toLowerCase().includes("india");
    const depositPct = data.depositPercent || 25;

    const paymentSectionHtml = isIndia
      ? `
    <!-- Payment Section: Domestic (India) -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;border:1px solid #16a34a;border-radius:8px;margin:24px 0;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:11px;color:#22c55e;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">💳 Upfront Deposit (${depositPct}% Deposit)</p>
        <p style="margin:0 0 16px;font-size:13px;color:#e0e0e8;line-height:1.6;">
          To commence architecture &amp; development, a ${depositPct}% upfront deposit is required.
        </p>

        ${data.paymentLink ? `
        <div style="margin-bottom:16px;">
          <a href="${data.paymentLink}" target="_blank" style="display:inline-block;background:#22c55e;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:6px;">
            Pay via Razorpay / Cards / UPI ➔
          </a>
        </div>
        ` : ""}

        <div style="background:#12121a;padding:14px;border-radius:6px;border:1px solid #1e1e2e;font-size:13px;color:#ccc;font-family:monospace;">
          <strong style="color:#06b6d4;">Direct UPI / Bank Transfer (0% Fee):</strong><br>
          • <strong>UPI ID:</strong> <code>mithun.here01@okaxis</code><br>
          • <strong>Account Holder:</strong> MITHUN DAS<br>
          • <strong>Bank:</strong> Axis Bank / HDFC Bank<br>
          • <strong>Note:</strong> Mention Invoice ID <code>${data.invoiceId}</code> in payment remarks.
        </div>
      </td></tr>
    </table>
    `
      : `
    <!-- Payment Section: International (Global) -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;border:1px solid #0ea5e9;border-radius:8px;margin:24px 0;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:11px;color:#0ea5e9;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">💳 Upfront Deposit (${depositPct}% Deposit)</p>
        <p style="margin:0 0 16px;font-size:13px;color:#e0e0e8;line-height:1.6;">
          To commence architecture &amp; development, a ${depositPct}% upfront deposit is required.
        </p>

        ${data.paymentLink ? `
        <div style="margin-bottom:16px;">
          <a href="${data.paymentLink}" target="_blank" style="display:inline-block;background:#0ea5e9;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:6px;">
            Pay Deposit via Credit Card / Stripe ➔
          </a>
        </div>
        ` : ""}

        <div style="background:#12121a;padding:14px;border-radius:6px;border:1px solid #1e1e2e;font-size:13px;color:#ccc;font-family:monospace;">
          <strong style="color:#0ea5e9;">Global Transfer Options:</strong><br>
          • <strong>PayPal:</strong> <a href="https://paypal.me/mithundas" style="color:#0ea5e9;">paypal.me/mithundas</a><br>
          • <strong>Wise (USD / EUR / GBP):</strong> Available upon request (0.4% fee)<br>
          • <strong>Note:</strong> Include Invoice ID <code>${data.invoiceId}</code> in transfer note.
        </div>
      </td></tr>
    </table>
    `;

    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: data.email,
      subject: `Welcome aboard — Project Kickoff & Invoice for ${data.company} | Mithun Das`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#12121a;border-radius:12px;border:1px solid #22c55e;overflow:hidden;">

  <tr><td style="background:linear-gradient(135deg,#16a34a 0%,#22c55e 100%);padding:28px 40px;">
    <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;">🎉 Welcome Aboard!</h1>
    <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.85);font-family:monospace;">MITHUN DAS — AI BUSINESS AUTOMATION</p>
  </td></tr>

  <tr><td style="padding:32px 40px;">
    <p style="margin:0 0 20px;font-size:15px;color:#e0e0e8;line-height:1.7;">
      Hi <strong style="color:#fff;">${data.name}</strong>,
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#e0e0e8;line-height:1.7;">
      I'm excited to officially kick off the project for <strong style="color:#fff;">${data.company}</strong>! Below you'll find the project invoice details, upfront deposit terms, and payment links.
    </p>

    <!-- Invoice Summary -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;border:1px solid #1e1e2e;border-radius:8px;margin:24px 0;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 16px;font-size:11px;color:#22c55e;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">Invoice &amp; Kickoff Summary</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:6px 0;font-size:13px;color:#888;width:160px;">Invoice ID</td><td style="padding:6px 0;font-size:14px;color:#06b6d4;font-family:monospace;">${data.invoiceId}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#888;">Agreed Project Fee</td><td style="padding:6px 0;font-size:16px;color:#22c55e;font-weight:700;">${data.invoiceAmount}</td></tr>
          ${data.setupFee ? `<tr><td style="padding:6px 0;font-size:13px;color:#888;">Fixed Setup / API Fee</td><td style="padding:6px 0;font-size:14px;color:#f59e0b;font-weight:600;">${data.setupFee}</td></tr>` : ""}
          ${data.monthlyRetainer ? `<tr><td style="padding:6px 0;font-size:13px;color:#888;">Monthly Maintenance</td><td style="padding:6px 0;font-size:14px;color:#06b6d4;font-weight:600;">${data.monthlyRetainer}</td></tr>` : ""}
          <tr><td style="padding:6px 0;font-size:13px;color:#888;">Project Scope</td><td style="padding:6px 0;font-size:13px;color:#e0e0e8;">${data.projectScope}</td></tr>
          <tr><td style="padding:6px 0;font-size:13px;color:#888;">Target Start Date</td><td style="padding:6px 0;font-size:13px;color:#e0e0e8;">${data.startDate}</td></tr>
        </table>
      </td></tr>
    </table>

    ${paymentSectionHtml}

    <!-- Terms -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;border:1px solid #1e1e2e;border-radius:8px;margin:24px 0;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px;font-size:11px;color:#f59e0b;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">Terms &amp; Conditions</p>
        <ul style="margin:0;padding:0 0 0 20px;font-size:13px;color:#e0e0e8;line-height:2;">
          <li>${depositPct}% advance deposit required before project commencement</li>
          <li>Remaining balance due upon delivery and final approval</li>
          <li>All deliverables include 30 days of post-delivery support</li>
          <li>Source code and documentation transfer upon full payment</li>
          <li>Confidentiality and NDA terms apply as per the Master Services Agreement</li>
        </ul>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
      <tr><td align="center">
        <a href="${env.NEXT_PUBLIC_SITE_URL || "https://mithundas.cloud"}/terms" target="_blank" style="display:inline-block;background:#22c55e;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;">
          View Full Terms &amp; MSA
        </a>
      </td></tr>
    </table>

    <p style="margin:24px 0 0;font-size:14px;color:#888;line-height:1.7;">
      Please review the details above. Reply to this email or schedule a call if you have any questions.
    </p>
    <p style="margin:16px 0 0;font-size:14px;color:#e0e0e8;">
      — Mithun Das
    </p>
  </td></tr>

  <tr><td style="padding:16px 40px;border-top:1px solid #1e1e2e;">
    <p style="margin:0;font-size:11px;color:#555;font-family:monospace;">mithundas.cloud • Onboarding &amp; Invoicing System</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`,
    });

    if (error) {
      logger.error("Failed to send onboarding kit email", "email_onboarding_error", error);
      saveEmailLog({
        toEmail: data.email,
        fromEmail: env.EMAIL_FROM,
        subject: `Welcome aboard — Project Kickoff & Invoice for ${data.company} | Mithun Das`,
        category: "onboarding",
        status: "failed",
      });
      return false;
    }

    logger.info(`Onboarding kit sent to ${data.email} for ${data.company}`, "email_onboarding_sent");
    saveEmailLog({
      toEmail: data.email,
      fromEmail: env.EMAIL_FROM,
      subject: `Welcome aboard — Project Kickoff & Invoice for ${data.company} | Mithun Das`,
      category: "onboarding",
      status: "sent",
    });
    return true;
  } catch (error) {
    logger.error("Resend API exception during onboarding kit", "email_onboarding_exception", error);
    return false;
  }
}
