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
            <td align="center" style="padding-bottom: 28px;">
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center">
                    <span style="font-size: 20px; font-weight: 900; letter-spacing: 2px; color: #4f46e5; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      ✦ MITHUN DAS
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
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);">
                <tr>
                  <td align="center">
                    <span style="font-size: 42px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; display: inline-block; line-height: 1; padding-left: 8px;">
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
                <strong style="color: #111827;">Note:</strong> The code will expire in 10 minutes.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-bottom: 32px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Footer Brand -->
          <tr>
            <td align="center" style="padding-bottom: 14px;">
              <span style="font-size: 15px; font-weight: 800; letter-spacing: 1.5px; color: #4f46e5; text-transform: uppercase;">
                ✦ MITHUN DAS
              </span>
            </td>
          </tr>

          <!-- Footer Notice -->
          <tr>
            <td align="center" style="padding-bottom: 18px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.6; max-width: 440px;">
                You have received this email because you requested access to your business account at Mithun Das Cloud, to ensure the implementation of our Terms of Service and for other legitimate matters.
              </p>
            </td>
          </tr>

          <!-- Footer Links -->
          <tr>
            <td align="center" style="padding-bottom: 18px;">
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td>
                    <a href="https://www.mithundas.cloud/privacy" style="font-size: 12px; color: #4f46e5; text-decoration: underline; margin-right: 8px;">Privacy policy</a>
                  </td>
                  <td style="color: #9ca3af; font-size: 12px;">|</td>
                  <td>
                    <a href="https://www.mithundas.cloud" style="font-size: 12px; color: #4f46e5; text-decoration: underline; margin-left: 8px;">Help center</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Copyright -->
          <tr>
            <td align="center">
              <p style="margin: 0; font-size: 11px; color: #9ca3af; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                © 2026 Mithun Das Cloud. All rights reserved.
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
  const text = `Here is your verification code: ${code}\n\nPlease make sure you never share this code with anyone.\nNote: The code will expire in 10 minutes.\n\n— Mithun Das Cloud`;

  // Hostinger SMTP strictly requires sender to match the authenticated mailbox (mithun@mithundas.cloud)
  let fromAddress = env.EMAIL_FROM || "Mithun Das AI <mithun@mithundas.cloud>";
  if (fromAddress.includes("no-reply@")) {
    fromAddress = "Mithun Das AI <mithun@mithundas.cloud>";
  } else if (env.SMTP_USER) {
    fromAddress = `Mithun Das AI <${env.SMTP_USER}>`;
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
