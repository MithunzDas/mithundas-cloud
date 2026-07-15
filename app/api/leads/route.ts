import { NextResponse } from "next/server";
import { LeadSubmissionRequestSchema } from "@/lib/validation";
import { signPayload } from "@/lib/security";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { normalizeEmail, normalizePhoneNumber } from "@/utils";

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

    logger.info(`Received qualified lead assessment request for: ${normalizedData.company}`, "lead_intake_received");

    // n8n Hook Signature Generation
    const payloadStr = JSON.stringify(normalizedData);
    const signature = signPayload(payloadStr, env.N8N_WEBHOOK_SECRET);

    // Handoff to self-hosted n8n
    if (env.N8N_LEAD_WEBHOOK_URL) {
      try {
        const response = await fetch(env.N8N_LEAD_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-webhook-signature": signature,
          },
          body: payloadStr,
        });

        if (!response.ok) {
          throw new Error(`n8n webhook dispatch returned HTTP status ${response.status}`);
        }

        logger.info(`Lead successfully handoff to n8n for: ${normalizedData.company}`, "lead_intake_n8n_success");
      } catch (error) {
        logger.error(
          `Failed to dispatch lead payload to n8n webhook: ${normalizedData.company}`,
          "lead_intake_n8n_error",
          error
        );
        // Fallback: We don't fail the user request since we have lead stored in logs & can process manually
      }
    } else {
      logger.warn(
        "N8N_LEAD_WEBHOOK_URL is not set. Handoff skipped.",
        "lead_intake_n8n_skipped"
      );
    }

    return NextResponse.json({
      success: true,
      leadId: `lead_${Math.random().toString(36).substr(2, 9)}`,
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
