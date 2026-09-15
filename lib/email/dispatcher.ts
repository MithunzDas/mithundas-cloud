import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

interface SendOtpParams {
  to: string;
  code: string;
  businessName?: string;
}

interface DispatchResult {
  success: boolean;
  provider: "hostinger_smtp" | "n8n_webhook" | "resend" | "none";
  error?: string;
}

/**
 * Builds responsive dark-themed HTML email template for 6-digit OTP verification.
 */
function buildOtpEmailHtml(code: string, businessName?: string): string {
  const subtitle = businessName
    ? `Owner verification for ${businessName}`
    : "Business Owner Verification Code";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#090d16;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#090d16;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#0f172a;border-radius:16px;border:1px solid #1e293b;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#0284c7 0%,#4f46e5 100%);padding:28px 32px;">
              <div style="font-size:11px;font-family:monospace;letter-spacing:1.5px;color:rgba(255,255,255,0.85);text-transform:uppercase;margin-bottom:4px;">
                15-SECOND QR REVIEW PLATFORM
              </div>
              <h1 style="margin:0;font-size:20px;font-weight:800;color:#ffffff;">
                ${subtitle}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#cbd5e1;">
                Use the 6-digit one-time code below to log in to your business growth analytics dashboard:
              </p>

              <!-- Code Box -->
              <div style="background-color:#080b11;border:1px solid #0284c7;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
                <span style="font-size:38px;font-weight:900;letter-spacing:10px;color:#38bdf8;font-family:monospace;display:inline-block;">
                  ${code}
                </span>
                <p style="margin:10px 0 0;font-size:12px;color:#94a3b8;">
                  Valid for 10 minutes. For your security, do not share this code.
                </p>
              </div>

              <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
                If you did not request this login code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #1e293b;background-color:#080b11;text-align:center;">
              <p style="margin:0;font-size:11px;color:#475569;font-family:monospace;">
                Mithun Das Cloud • Automated Business Intelligence Platform
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Sends OTP login code to recipient using available channels:
 * 1. Direct Hostinger / Custom SMTP (via nodemailer)
 * 2. Self-Hosted n8n Webhook on Hostinger VPS (N8N_OTP_WEBHOOK_URL)
 * 3. Resend API (RESEND_API_KEY)
 */
export async function sendOtpEmail({ to, code, businessName }: SendOtpParams): Promise<DispatchResult> {
  const cleanEmail = to.trim().toLowerCase();
  const subject = `Your Login Code: ${code} — Business Owner Portal | Mithun Das AI`;
  const html = buildOtpEmailHtml(code, businessName);
  const text = `Your login verification code is: ${code}. Valid for 10 minutes. Use this code to sign in to your business owner portal at Mithun Das Cloud.`;

  const fromAddress =
    env.EMAIL_FROM ||
    (env.SMTP_USER ? `Mithun Das AI <${env.SMTP_USER}>` : "Mithun Das AI <support@mithundas.cloud>");

  // ──────────────────────────────────────────────────────────────────────────
  // CHANNEL 1: Direct Hostinger / Custom SMTP (Fastest, zero 3rd party dependency)
  // ──────────────────────────────────────────────────────────────────────────
  if (env.SMTP_USER && env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST || "smtp.hostinger.com",
        port: env.SMTP_PORT || 465,
        secure: env.SMTP_SECURE, // true for 465, false for 587
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false, // Prevents self-signed cert blocks
        },
      });

      await transporter.sendMail({
        from: fromAddress,
        to: cleanEmail,
        subject,
        text,
        html,
      });

      logger.info("OTP dispatched via Hostinger SMTP", "otp_smtp_success", { to: cleanEmail });
      return { success: true, provider: "hostinger_smtp" };
    } catch (smtpErr) {
      logger.error("Hostinger SMTP failed, checking fallback channels", "otp_smtp_error", smtpErr);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CHANNEL 2: Self-Hosted n8n Webhook on Hostinger VPS
  // ──────────────────────────────────────────────────────────────────────────
  if (env.N8N_OTP_WEBHOOK_URL) {
    try {
      const n8nRes = await fetch(env.N8N_OTP_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: cleanEmail,
          code,
          subject,
          text,
          html,
          from: fromAddress,
          businessName: businessName || null,
          timestamp: new Date().toISOString(),
        }),
      });

      if (n8nRes.ok) {
        logger.info("OTP dispatched via n8n VPS webhook", "otp_n8n_success", { to: cleanEmail });
        return { success: true, provider: "n8n_webhook" };
      } else {
        const errText = await n8nRes.text();
        logger.warn("n8n webhook returned non-200", "otp_n8n_warn", { status: n8nRes.status, errText });
      }
    } catch (n8nErr) {
      logger.error("Failed to post OTP to n8n webhook", "otp_n8n_error", n8nErr);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CHANNEL 3: Resend API Fallback
  // ──────────────────────────────────────────────────────────────────────────
  if (env.RESEND_API_KEY) {
    try {
      const resend = new Resend(env.RESEND_API_KEY);
      let { error: resendError } = await resend.emails.send({
        from: fromAddress,
        to: cleanEmail,
        subject,
        html,
      });

      // Retry with onboarding@resend.dev if custom domain unverified
      if (resendError && fromAddress !== "onboarding@resend.dev") {
        const retryRes = await resend.emails.send({
          from: "Mithun Das AI <onboarding@resend.dev>",
          to: cleanEmail,
          subject,
          html,
        });
        resendError = retryRes.error;
      }

      if (!resendError) {
        logger.info("OTP dispatched via Resend", "otp_resend_success", { to: cleanEmail });
        return { success: true, provider: "resend" };
      } else {
        logger.warn("Resend email dispatch error", "otp_resend_warn", { resendError });
      }
    } catch (resendErr) {
      logger.error("Resend API exception", "otp_resend_error", resendErr);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // If no channel is configured or all failed:
  // ──────────────────────────────────────────────────────────────────────────
  return {
    success: false,
    provider: "none",
    error:
      "Email service is not yet configured. Please configure Hostinger SMTP (SMTP_USER & SMTP_PASS in .env.local), n8n webhook (N8N_OTP_WEBHOOK_URL), or RESEND_API_KEY.",
  };
}
