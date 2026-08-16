import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/affidavit/deduct-credits
 * Body: { userId?: string, email?: string, affidavitType: string, pageCount: number, formData?: any }
 * Deducts pageCount credits from the user balance and logs the download.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, affidavitType = "caa", pageCount = 3, formData } = body;

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: "Provide userId or email" },
        { status: 400 }
      );
    }

    const user = await prisma.affidavitUser.findFirst({
      where: email ? { email } : { id: userId! },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.creditBalance < pageCount) {
      return NextResponse.json(
        {
          success: false,
          error: "INSUFFICIENT_CREDITS",
          message: `Insufficient credits. You need ${pageCount} credits, but currently have ${user.creditBalance}.`,
          currentBalance: user.creditBalance,
          requiredCredits: pageCount,
        },
        { status: 402 }
      );
    }

    const [updatedUser, downloadRecord] = await prisma.$transaction([
      prisma.affidavitUser.update({
        where: { id: user.id },
        data: {
          creditBalance: { decrement: pageCount },
        },
      }),
      prisma.affidavitDownload.create({
        data: {
          userId: user.id,
          affidavitType,
          pageCount,
          creditsDeducted: pageCount,
          formData: formData ? JSON.stringify(formData) : null,
        },
      }),
    ]);

    logger.info("Affidavit credits deducted", "affidavit_deduct_success", {
      userId: user.id,
      deducted: pageCount,
      remaining: updatedUser.creditBalance,
      downloadId: downloadRecord.id,
    });

    // Guaranteed synchronous call to n8n User Sync Webhook for Google Sheet log
    const n8nUserSyncWebhook = "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-user-sync";
    try {
      await fetch(n8nUserSyncWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "affidavit.form_submitted",
          userId: updatedUser.id,
          userEmail: updatedUser.email || "N/A",
          userPhone: updatedUser.phone || "N/A",
          userName: updatedUser.name || "N/A",
          creditBalance: updatedUser.creditBalance,
          affidavitType,
          pageCount,
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          time: new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: new Date().toISOString(),
          // Complete Filled Client Form Data
          applicant_name: formData?.applicant_name || "",
          guardian_type: formData?.guardian_type || "",
          father_name: formData?.father_name || "",
          india_village: formData?.india_village || "",
          india_po: formData?.india_po || "",
          india_ps: formData?.india_ps || "",
          india_district: formData?.india_district || "",
          india_pin: formData?.india_pin || "",
          india_state: formData?.india_state || "West Bengal",
          bd_village: formData?.bd_village || "",
          bd_po: formData?.bd_po || "",
          bd_ps: formData?.bd_ps || "",
          bd_district: formData?.bd_district || "",
          entry_date: formData?.entry_date || "",
          verification_date: formData?.verification_date || "",
          witness_name: formData?.witness_name || "",
          witness_guardian_type: formData?.witness_guardian_type || "",
          witness_father: formData?.witness_father || "",
          witness_age: formData?.witness_age || "",
          witness_occupation: formData?.witness_occupation || "",
          witness_village: formData?.witness_village || "",
          witness_po: formData?.witness_po || "",
          witness_ps: formData?.witness_ps || "",
          witness_district: formData?.witness_district || "",
          witness_pin: formData?.witness_pin || "",
          witness_state: formData?.witness_state || "West Bengal",
          advocate: formData?.advocate || "",
          custom_court: formData?.custom_court || "",
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      deducted: pageCount,
      remainingBalance: updatedUser.creditBalance,
      downloadId: downloadRecord.id,
    });
  } catch (error) {
    logger.error("Failed to deduct affidavit credits", "affidavit_deduct_error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
