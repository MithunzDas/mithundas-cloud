import { NextResponse } from "next/server";
import { getLeadById, updateLeadStatus, saveInvoiceToDB, InvoicePayload } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { LeadStatus, triggerOnboarding, triggerFollowUp, pushStatusUpdate } from "@/services/n8n/n8n";

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

    // Dispatch events to n8n for orchestration
    const sideEffects: Promise<unknown>[] = [];

    if (status === "won" && onboardingDetails) {
      const kitData = {
        name: lead.name,
        email: lead.email,
        company: lead.company,
        invoiceAmount: onboardingDetails.invoiceAmount || "$1,500.00",
        invoiceId: onboardingDetails.invoiceId || `INV-${Date.now().toString().slice(-6)}`,
        projectScope: onboardingDetails.projectScope || lead.projectRequirement.slice(0, 100) + "...",
        startDate: onboardingDetails.startDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        country: lead.country || onboardingDetails.country,
        currency: onboardingDetails.currency || "USD",
        currencySymbol: onboardingDetails.currencySymbol || "$",
        depositPercent: onboardingDetails.depositPercent ? Number(onboardingDetails.depositPercent) : 25,
        setupFee: onboardingDetails.setupFee || undefined,
        monthlyRetainer: onboardingDetails.monthlyRetainer || undefined,
        paymentLink: onboardingDetails.paymentLink || undefined,
      };

      const invoicePayload: InvoicePayload = {
        invoiceId: kitData.invoiceId,
        leadId: id,
        clientName: lead.name,
        clientEmail: lead.email,
        companyName: lead.company,
        currency: kitData.currency,
        currencySymbol: kitData.currencySymbol,
        totalAmount: kitData.invoiceAmount,
        depositPercent: `${kitData.depositPercent}%`,
        depositAmount: kitData.invoiceAmount,
        setupFee: kitData.setupFee,
        monthlyRetainer: kitData.monthlyRetainer,
        projectScope: kitData.projectScope,
        paymentStatus: "unpaid",
        paymentLink: kitData.paymentLink,
      };

      sideEffects.push(
        saveInvoiceToDB(invoicePayload).catch((err) => {
          logger.warn(`Failed to save invoice ${kitData.invoiceId}`, "invoice_save_err", { message: String(err) });
        })
      );

      sideEffects.push(
        triggerOnboarding({
          leadId: id,
          ...kitData,
        }).catch((err) => {
          logger.error(`n8n onboarding dispatch failed for lead ${id}`, "n8n_onboarding_error", err);
        })
      );
    } else if (status === "silent") {
      sideEffects.push(
        triggerFollowUp({
          leadId: id,
          email: lead.email,
          name: lead.name,
          company: lead.company,
          businessType: lead.businessType,
          projectRequirement: lead.projectRequirement,
          country: lead.country || undefined,
          whatsapp: lead.whatsapp || undefined,
          round: (followUpRound as "24h" | "72h") || "24h",
        }).catch((err) => {
          logger.error(`n8n follow-up dispatch failed for lead ${id}`, "n8n_followup_error", err);
        })
      );
    } else {
      // Push generic status update for other transitions
      sideEffects.push(
        pushStatusUpdate({
          leadId: id,
          status: status as LeadStatus,
          updatedAt: new Date().toISOString(),
        }).catch((err) => {
          logger.error(`n8n status update dispatch failed for lead ${id}`, "n8n_status_update_error", err);
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
