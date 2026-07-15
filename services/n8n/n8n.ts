import { env } from "@/lib/env";
import { signPayload } from "@/lib/security";
import { logger } from "@/lib/logger";

/* ────────────────────────────────────────────────────── *
 *  Types                                                 *
 * ────────────────────────────────────────────────────── */

export type LeadStatus =
  | "intake"
  | "contacted"
  | "qualified"
  | "silent"
  | "won"
  | "lost";

export interface LeadPayload {
  leadId: string;
  name: string;
  email: string;
  company: string;
  businessType: string;
  budget: string;
  timeline: string;
  projectRequirement: string;
  whatsapp?: string;
  country?: string;
  status: LeadStatus;
  submittedAt: string;
}

export interface StatusUpdatePayload {
  leadId: string;
  status: LeadStatus;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface OnboardingTriggerPayload {
  leadId: string;
  name: string;
  email: string;
  company: string;
  projectScope: string;
  invoiceAmount: string;
  startDate: string;
}

/* ────────────────────────────────────────────────────── *
 *  Core n8n dispatch logic                               *
 * ────────────────────────────────────────────────────── */

async function dispatchToN8n<T extends object>(
  webhookUrl: string,
  payload: T,
  operationLabel: string
): Promise<{ success: boolean; responseData?: unknown }> {
  if (!webhookUrl) {
    logger.warn(`n8n webhook URL not configured for ${operationLabel}`, "n8n_skip");
    return { success: false };
  }

  try {
    const payloadStr = JSON.stringify(payload);
    const signature = signPayload(payloadStr, env.N8N_WEBHOOK_SECRET);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-signature": signature,
        "x-operation": operationLabel,
      },
      body: payloadStr,
    });

    if (!response.ok) {
      throw new Error(`n8n returned HTTP ${response.status} for ${operationLabel}`);
    }

    let responseData: unknown = null;
    try {
      responseData = await response.json();
    } catch {
      // Some n8n responses may not be JSON — that's acceptable
    }

    logger.info(
      `n8n ${operationLabel} dispatched successfully`,
      `n8n_${operationLabel}_success`
    );

    return { success: true, responseData };
  } catch (error) {
    logger.error(
      `n8n ${operationLabel} dispatch failed`,
      `n8n_${operationLabel}_error`,
      error
    );
    return { success: false };
  }
}

/* ────────────────────────────────────────────────────── *
 *  1. Lead Handoff — Forward validated lead to n8n       *
 * ────────────────────────────────────────────────────── */

export async function handoffLead(lead: LeadPayload) {
  return dispatchToN8n(
    env.N8N_LEAD_WEBHOOK_URL,
    lead,
    "lead_handoff"
  );
}

/* ────────────────────────────────────────────────────── *
 *  2. Status Update — Push lead state change to n8n      *
 * ────────────────────────────────────────────────────── */

export async function pushStatusUpdate(update: StatusUpdatePayload) {
  const statusWebhookUrl = env.N8N_STATUS_WEBHOOK_URL;
  return dispatchToN8n(statusWebhookUrl, update, "status_update");
}

/* ────────────────────────────────────────────────────── *
 *  3. Trigger Follow-up Workflow                         *
 * ────────────────────────────────────────────────────── */

export async function triggerFollowUp(
  leadId: string,
  email: string,
  round: "24h" | "72h"
) {
  const followUpUrl = env.N8N_FOLLOWUP_WEBHOOK_URL;
  return dispatchToN8n(
    followUpUrl,
    { leadId, email, round, triggeredAt: new Date().toISOString() },
    `followup_${round}`
  );
}

/* ────────────────────────────────────────────────────── *
 *  4. Trigger Onboarding Workflow (Invoice + Terms)      *
 * ────────────────────────────────────────────────────── */

export async function triggerOnboarding(data: OnboardingTriggerPayload) {
  const onboardingUrl = env.N8N_ONBOARDING_WEBHOOK_URL;
  return dispatchToN8n(onboardingUrl, data, "onboarding_trigger");
}
