import { NextResponse } from "next/server";
import { getLeadById, updateLeadStatus } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { LeadStatus } from "@/services/n8n/n8n";
import { sendFollowUpEmail, sendOnboardingKit } from "@/services/email/resend";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("x-admin-secret");

    if (!env.ADMIN_AUTH_SECRET || authHeader !== env.ADMIN_AUTH_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const lead = await getLeadById(id);
    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (error) {
    logger.error("Failed to fetch lead by ID", "admin_lead_get_id_error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("x-admin-secret");

    if (!env.ADMIN_AUTH_SECRET || authHeader !== env.ADMIN_AUTH_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { status, onboardingDetails, followUpRound } = await request.json();
    const validStatuses: LeadStatus[] = ["intake", "contacted", "qualified", "silent", "won", "lost"];

    if (!status || !validStatuses.includes(status as LeadStatus)) {
      return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
    }

    const lead = await getLeadById(id);
    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    // Update status in local database
    const updatedLead = await updateLeadStatus(id, status as LeadStatus);

    // Trigger automation side effects directly if admin manually pushes a transition
    const sideEffects: Promise<unknown>[] = [];

    if (status === "won" && onboardingDetails) {
      // Trigger onboarding email template with invoice + terms + MSA
      sideEffects.push(
        sendOnboardingKit({
          name: lead.name,
          email: lead.email,
          company: lead.company,
          invoiceAmount: onboardingDetails.invoiceAmount || "$1,500.00",
          invoiceId: onboardingDetails.invoiceId || `INV-${Date.now().toString().slice(-6)}`,
          projectScope: onboardingDetails.projectScope || lead.projectRequirement.slice(0, 100) + "...",
          startDate: onboardingDetails.startDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        }).catch((err) => {
          logger.error(`Manual onboarding kit dispatch failed for lead ${id}`, "manual_onboarding_error", err);
        })
      );
    } else if (status === "silent") {
      // Trigger friendly follow-up email
      sideEffects.push(
        sendFollowUpEmail(lead, followUpRound || "24h").catch((err) => {
          logger.error(`Manual follow-up email dispatch failed for lead ${id}`, "manual_followup_error", err);
        })
      );
    }

    await Promise.allSettled(sideEffects);

    return NextResponse.json({
      success: true,
      lead: updatedLead,
      message: `Lead successfully updated to status: ${status}`,
    });
  } catch (error) {
    logger.error("Failed to update lead status via API", "admin_lead_patch_error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
