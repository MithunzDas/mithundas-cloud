import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { verifySignature } from "@/lib/security";
import { logger } from "@/lib/logger";
import { sendFollowUpEmail, sendOnboardingKit } from "@/services/email/resend";
import { updateLeadStatus } from "@/lib/db";
import { LeadStatus } from "@/services/n8n/n8n";

/* ────────────────────────────────────────────────────── *
 *  n8n Status Webhook Receiver                           *
 *  Accepts signed callbacks from n8n to trigger          *
 *  follow-up emails, onboarding kits, and status updates *
 * ────────────────────────────────────────────────────── */

interface StatusPayload {
  leadId: string;
  action: "status_update" | "trigger_followup" | "trigger_onboarding";
  status?: string;
  lead?: {
    name: string;
    email: string;
    company: string;
    businessType: string;
    budget: string;
    timeline: string;
    projectRequirement: string;
    whatsapp?: string;
    country?: string;
  };
  followUpRound?: "24h" | "72h";
  onboarding?: {
    invoiceAmount: string;
    invoiceId: string;
    projectScope: string;
    startDate: string;
  };
  aiScore?: number;
  aiSummary?: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // Verify HMAC signature from n8n
    const signature = request.headers.get("x-webhook-signature");
    if (!signature || !env.N8N_WEBHOOK_SECRET) {
      logger.warn("Missing webhook signature or secret", "webhook_auth_fail");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const isValid =
      signature === env.N8N_WEBHOOK_SECRET ||
      verifySignature(rawBody, signature, env.N8N_WEBHOOK_SECRET);

    if (!isValid) {
      logger.warn("Invalid webhook signature", "webhook_sig_invalid");
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 403 }
      );
    }

    const payload: StatusPayload = JSON.parse(rawBody);

    if (!payload.leadId || !payload.action) {
      return NextResponse.json(
        { success: false, message: "Missing leadId or action" },
        { status: 400 }
      );
    }

    logger.info(
      `Webhook received: ${payload.action} for lead ${payload.leadId}`,
      "webhook_received"
    );

    /* ── Route by action ────────────────────────────── */

    switch (payload.action) {
      case "status_update": {
        const newStatus = payload.status as LeadStatus;
        await updateLeadStatus(payload.leadId, newStatus, payload.aiScore, payload.aiSummary);
        logger.info(
          `Lead ${payload.leadId} status updated to: ${newStatus}`,
          "webhook_status_update"
        );
        return NextResponse.json({
          success: true,
          message: `Status updated to ${newStatus}`,
        });
      }

      case "trigger_followup": {
        if (!payload.lead) {
          return NextResponse.json(
            { success: false, message: "Lead data required for follow-up" },
            { status: 400 }
          );
        }

        const round = payload.followUpRound || "24h";
        // Update local state to silent
        await updateLeadStatus(payload.leadId, "silent");

        const emailSent = await sendFollowUpEmail(
          { ...payload.lead, leadId: payload.leadId },
          round
        );

        return NextResponse.json({
          success: true,
          emailSent,
          message: `Follow-up (${round}) ${emailSent ? "sent" : "skipped (Resend not configured)"}`,
        });
      }

      case "trigger_onboarding": {
        if (!payload.lead || !payload.onboarding) {
          return NextResponse.json(
            { success: false, message: "Lead and onboarding data required" },
            { status: 400 }
          );
        }

        // Update local state to won
        await updateLeadStatus(payload.leadId, "won");

        const onboardingSent = await sendOnboardingKit({
          name: payload.lead.name,
          email: payload.lead.email,
          company: payload.lead.company,
          invoiceAmount: payload.onboarding.invoiceAmount,
          invoiceId: payload.onboarding.invoiceId,
          projectScope: payload.onboarding.projectScope,
          startDate: payload.onboarding.startDate,
        });

        return NextResponse.json({
          success: true,
          emailSent: onboardingSent,
          message: `Onboarding kit ${onboardingSent ? "sent" : "skipped (Resend not configured)"}`,
        });
      }

      default: {
        logger.warn(`Unknown webhook action: ${payload.action}`, "webhook_unknown_action");
        return NextResponse.json(
          { success: false, message: `Unknown action: ${payload.action}` },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    logger.error("Webhook processing error", "webhook_error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
