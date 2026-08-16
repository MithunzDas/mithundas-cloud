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

    // Asynchronously trigger n8n User Sync Webhook for Google Sheet log
    const n8nUserSyncWebhook = "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-user-sync";
    try {
      fetch(n8nUserSyncWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "affidavit.generated",
          userId: updatedUser.id,
          name: updatedUser.name || "N/A",
          email: updatedUser.email || "N/A",
          phone: updatedUser.phone || "N/A",
          creditBalance: updatedUser.creditBalance,
          affidavitType,
          applicantName: formData?.applicant_name || "N/A",
          pageCount,
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
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
