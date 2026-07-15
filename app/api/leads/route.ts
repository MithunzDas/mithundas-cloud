import { NextResponse } from "next/server";
import { LeadSubmissionRequestSchema } from "@/lib/validation";
import { signPayload } from "@/lib/security";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { normalizeEmail, normalizePhoneNumber } from "@/utils";
import { sendLeadConfirmation, sendAdminNotification } from "@/services/email/resend";
import { saveLead } from "@/lib/db";
import { LeadPayload } from "@/services/n8n/n8n";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  
  // Rate Limit check
  const rateLimitResult = await rateLimit(ip, "/api/leads");
  if (!rateLimitResult.success) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`, "lead_intake_rate_limit");
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const rawBody = await request.json();
    
    // Zod verification
    const parsedData = LeadSubmissionRequestSchema.safeParse(rawBody);
    if (!parsedData.success) {
      logger.warn("Validation failed for lead submission", "lead_intake_validation", {
        errors: parsedData.error.flatten(),
      });
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please verify form inputs.",
          errors: parsedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const leadData = parsedData.data;

    // Honeypot spam block
    if (leadData.honeypot) {
      logger.warn("Honeypot field triggered. Blocking spam request.", "lead_intake_spam");
      return NextResponse.json({
        success: true,
        leadId: `spam_${Date.now()}`,
        status: "received",
        message: "Submission processed.",
      });
    }

    // Input normalization
    const normalizedData = {
      ...leadData,
      email: normalizeEmail(leadData.email),
      whatsapp: leadData.whatsapp ? normalizePhoneNumber(leadData.whatsapp) : undefined,
    };

    const leadId = `lead_${Math.random().toString(36).substr(2, 9)}`;

    logger.info(`Received qualified lead assessment request for: ${normalizedData.company}`, "lead_intake_received");

    // n8n Hook Signature Generation
    const payloadStr = JSON.stringify(normalizedData);
    const signature = signPayload(payloadStr, env.N8N_WEBHOOK_SECRET);

    // Construct the full LeadPayload for database storage
    const leadPayload: LeadPayload = {
      leadId,
      name: normalizedData.name,
      email: normalizedData.email,
      company: normalizedData.company,
      businessType: normalizedData.businessType,
      budget: normalizedData.budget,
      timeline: normalizedData.timeline,
      projectRequirement: normalizedData.projectRequirement,
      whatsapp: normalizedData.whatsapp,
      country: normalizedData.country,
      status: "intake",
      submittedAt: new Date().toISOString()
    };

    // Run all async side-effects in parallel — don't block the response
    const sideEffects: Promise<unknown>[] = [];

    // 1. Save to local database
    sideEffects.push(
      saveLead(leadPayload).catch((error) => {
        logger.error(`Database save side-effect failed for ${leadId}`, "lead_db_side_effect_error", error);
      })
    );

    // 2. n8n webhook handoff
    if (env.N8N_LEAD_WEBHOOK_URL) {
      sideEffects.push(
        fetch(env.N8N_LEAD_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-webhook-signature": signature,
          },
          body: payloadStr,
        })
          .then((res) => {
            if (!res.ok) throw new Error(`n8n returned HTTP ${res.status}`);
            logger.info(`Lead handoff to n8n succeeded for: ${normalizedData.company}`, "lead_intake_n8n_success");
          })
          .catch((error) => {
            logger.error(`Failed to dispatch lead to n8n: ${normalizedData.company}`, "lead_intake_n8n_error", error);
          })
      );
    } else {
      logger.warn("N8N_LEAD_WEBHOOK_URL is not set. Handoff skipped.", "lead_intake_n8n_skipped");
    }

    // 3. Send confirmation email to prospect
    sideEffects.push(
      sendLeadConfirmation(leadPayload).catch((error) => {
        logger.error("Email confirmation side-effect failed", "lead_email_side_effect", error);
      })
    );

    // 4. Send admin notification
    sideEffects.push(
      sendAdminNotification(leadPayload).catch((error) => {
        logger.error("Admin notification side-effect failed", "lead_admin_side_effect", error);
      })
    );

    // Await side effects but don't fail if they do
    await Promise.allSettled(sideEffects);

    return NextResponse.json({
      success: true,
      leadId,
      status: "received",
      message: "Lead assessment successfully received and queued.",
    });
  } catch (error) {
    logger.error("Internal server error during lead intake", "lead_intake_internal_error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

