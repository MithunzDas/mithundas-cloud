import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { verifySignature } from "@/lib/security";
import { logger } from "@/lib/logger";
import { saveEmailLog } from "@/lib/db";

/* ────────────────────────────────────────────────────── *
 *  n8n Email Log Webhook Receiver                        *
 *  Called by n8n after each email is sent via Resend.     *
 *  Logs the email details to Supabase EmailLog table     *
 *  so the admin can view them in the Email Outbox tab.   *
 * ────────────────────────────────────────────────────── */

interface EmailLogPayload {
  leadId?: string;
  toEmail: string;
  fromEmail?: string;
  subject: string;
  category: string;        // "onboarding", "confirmation", "followup", "admin_alert"
  htmlContent?: string;     // The rendered HTML body (optional, for preview)
  status?: string;          // "sent" or "failed"
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // Verify HMAC signature from n8n
    const signature = request.headers.get("x-webhook-signature");
    if (!signature || !env.N8N_WEBHOOK_SECRET) {
      logger.warn("Missing webhook signature or secret", "email_log_webhook_auth_fail");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const isValid =
      signature === env.N8N_WEBHOOK_SECRET ||
      verifySignature(rawBody, signature, env.N8N_WEBHOOK_SECRET);

    if (!isValid) {
      logger.warn("Invalid webhook signature for email log", "email_log_webhook_sig_invalid");
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 403 }
      );
    }

    const payload: EmailLogPayload = JSON.parse(rawBody);

    // Validate required fields
    if (!payload.toEmail || !payload.subject || !payload.category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: toEmail, subject, category" },
        { status: 400 }
      );
    }

    // Save to database
    await saveEmailLog({
      leadId: payload.leadId || undefined,
      toEmail: payload.toEmail,
      fromEmail: payload.fromEmail || env.EMAIL_FROM || "mithun@mithundas.cloud",
      subject: payload.subject,
      category: payload.category,
      htmlContent: payload.htmlContent || undefined,
      status: payload.status || "sent",
    });

    logger.info(
      `Email log received from n8n: [${payload.category}] "${payload.subject}" → ${payload.toEmail}`,
      "email_log_webhook_success"
    );

    return NextResponse.json({
      success: true,
      message: `Email log saved: ${payload.category} to ${payload.toEmail}`,
    });
  } catch (error) {
    logger.error("Failed to process email log webhook", "email_log_webhook_error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
