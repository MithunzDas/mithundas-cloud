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
 * Builds clean, professional Hostinger-style HTML verification email template.
 */
function buildOtpEmailHtml(code: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your verification code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased;">
  <!-- Hidden preheader text for inbox preview snippet -->
  <div style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Your verification code is ${code} - Verify it's you to stay secure.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 40px 16px 60px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; width: 100%; text-align: center;">
          
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding-bottom: 26px;">
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center" style="background-color: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 9999px; padding: 8px 22px;">
                    <span style="font-size: 15px; font-weight: 800; letter-spacing: 2px; color: #0284c7; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      <span style="color: #0ea5e9; font-size: 16px; margin-right: 4px;">✦</span> MITHUN DAS
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Heading -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.5px; line-height: 1.3;">
                Here is your verification code:
              </h1>
            </td>
          </tr>

          <!-- OTP Card Box -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1.5px solid #e0f2fe; border-radius: 16px; padding: 28px 20px; box-shadow: 0 4px 6px -1px rgba(2, 132, 199, 0.06), 0 2px 4px -2px rgba(2, 132, 199, 0.06);">
                <tr>
                  <td align="center">
                    <span style="font-size: 44px; font-weight: 800; letter-spacing: 10px; color: #0284c7; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; display: inline-block; line-height: 1; padding-left: 10px;">
                      ${code}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Disclaimer / Advisory -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #374151; line-height: 1.5;">
                Please make sure you never share this code with anyone.
              </p>
              <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.5;">
                <strong style="color: #0284c7;">Note:</strong> The code will expire in 10 minutes.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top: 1px solid #e2e8f0; padding-bottom: 32px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Footer Brand -->
          <tr>
            <td align="center" style="padding-bottom: 12px;">
              <span style="font-size: 14px; font-weight: 800; letter-spacing: 1.5px; color: #0284c7; text-transform: uppercase;">
                ✦ MITHUN DAS AI AUTOMATION
              </span>
            </td>
          </tr>

          <!-- Footer Notice -->
          <tr>
            <td align="center" style="padding-bottom: 18px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.6; max-width: 440px;">
                You have received this email because you requested access to your business account at Mithun Das AI Automation, to ensure the implementation of our Terms of Service and for other legitimate matters.
              </p>
            </td>
          </tr>

          <!-- Social Media Icons Row -->
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <!-- LinkedIn -->
                  <td align="center" style="padding: 0 4px;">
                    <a href="https://www.linkedin.com/in/mithun-das-46347a239/" target="_blank" rel="noopener noreferrer" style="display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 50%; background-color: #f1f5f9; border: 1px solid #cbd5e1; text-decoration: none; color: #0a66c2; font-size: 12px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, sans-serif;" title="LinkedIn">
                      in
                    </a>
                  </td>
                  <!-- WhatsApp -->
                  <td align="center" style="padding: 0 4px;">
                    <a href="https://wa.me/918768138086" target="_blank" rel="noopener noreferrer" style="display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 50%; background-color: #f1f5f9; border: 1px solid #cbd5e1; text-decoration: none; color: #16a34a; font-size: 13px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, sans-serif;" title="WhatsApp">
                      wa
                    </a>
                  </td>
                  <!-- X / Twitter -->
                  <td align="center" style="padding: 0 4px;">
                    <a href="https://x.com/MithunzDas" target="_blank" rel="noopener noreferrer" style="display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 50%; background-color: #f1f5f9; border: 1px solid #cbd5e1; text-decoration: none; color: #0f172a; font-size: 13px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, sans-serif;" title="X (Twitter)">
                      𝕏
                    </a>
                  </td>
                  <!-- Gmail -->
                  <td align="center" style="padding: 0 4px;">
                    <a href="mailto:mithun@mithundas.cloud" style="display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 50%; background-color: #f1f5f9; border: 1px solid #cbd5e1; text-decoration: none; color: #dc2626; font-size: 13px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, sans-serif;" title="Email">
                      ✉
                    </a>
                  </td>
                  <!-- GitHub -->
                  <td align="center" style="padding: 0 4px;">
                    <a href="https://github.com/MithunzDas" target="_blank" rel="noopener noreferrer" style="display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 50%; background-color: #f1f5f9; border: 1px solid #cbd5e1; text-decoration: none; color: #334155; font-size: 11px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, sans-serif;" title="GitHub">
                      git
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Links -->
          <tr>
            <td align="center" style="padding-bottom: 18px;">
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td>
                    <a href="https://www.mithundas.cloud/privacy" style="font-size: 12px; color: #0284c7; text-decoration: underline; margin-right: 8px;">Privacy policy</a>
                  </td>
                  <td style="color: #9ca3af; font-size: 12px;">|</td>
                  <td>
                    <a href="https://www.mithundas.cloud" style="font-size: 12px; color: #0284c7; text-decoration: underline; margin-left: 8px;">Help center</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Copyright -->
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 11px; color: #9ca3af; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                © 2026 Mithun Das AI Automation. All rights reserved.
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
  const subject = "Your verification code - Verify it's you to stay secure";
  const html = buildOtpEmailHtml(code);
  const text = `Here is your verification code: ${code}\n\nPlease make sure you never share this code with anyone.\nNote: The code will expire in 10 minutes.\n\n— Mithun Das AI Automation`;

  // Hostinger SMTP strictly requires sender to match the authenticated mailbox (mithun@mithundas.cloud)
  let fromAddress = env.EMAIL_FROM || "Mithun Das AI Automation <mithun@mithundas.cloud>";
  if (fromAddress.includes("no-reply@")) {
    fromAddress = "Mithun Das AI Automation <mithun@mithundas.cloud>";
  } else if (env.SMTP_USER) {
    fromAddress = `Mithun Das AI Automation <${env.SMTP_USER}>`;
  }

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
  const n8nWebhookUrl =
    env.N8N_OTP_WEBHOOK_URL ||
    "https://n8n.srv1594654.hstgr.cloud/webhook/qr-owner-otp";

  if (n8nWebhookUrl) {
    try {
      const n8nRes = await fetch(n8nWebhookUrl, {
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
