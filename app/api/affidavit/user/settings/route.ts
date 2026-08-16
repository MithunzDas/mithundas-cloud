import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/affidavit/user/settings
 * Body: { userId: string, name?: string, phone?: string, defaultAdvocateName?: string, defaultAdvocateEnrollment?: string, defaultCourtHeader?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, phone, defaultAdvocateName, defaultAdvocateEnrollment, defaultCourtHeader } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.affidavitUser.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(defaultAdvocateName !== undefined && { defaultAdvocateName }),
        ...(defaultAdvocateEnrollment !== undefined && { defaultAdvocateEnrollment }),
        ...(defaultCourtHeader !== undefined && { defaultCourtHeader }),
      },
    });

    // Guaranteed synchronous trigger to n8n Google Sheet Webhook on Settings Update
    const n8nUserSyncWebhook = "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-user-sync";
    try {
      await fetch(n8nUserSyncWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "settings_updated",
          userId: updatedUser.id,
          name: updatedUser.name || "N/A",
          email: updatedUser.email || "N/A",
          phone: updatedUser.phone || "N/A",
          avatarUrl: updatedUser.avatarUrl || "N/A",
          creditBalance: updatedUser.creditBalance,
          isFirstPurchaseDone: updatedUser.isFirstPurchaseDone,
          defaultAdvocateName: updatedUser.defaultAdvocateName
            ? `${updatedUser.defaultAdvocateName}${updatedUser.defaultAdvocateEnrollment ? `, Adv, ${updatedUser.defaultAdvocateEnrollment}` : ""}`
            : "N/A",
          defaultCourtHeader: updatedUser.defaultCourtHeader || "N/A",
          date: new Date().toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          time: new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          timestamp: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      logger.warn("n8n settings sync failed", "n8n_settings_sync_warn", { err: String(err) });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        name: updatedUser.name,
        avatarUrl: updatedUser.avatarUrl,
        creditBalance: updatedUser.creditBalance,
        isFirstPurchaseDone: updatedUser.isFirstPurchaseDone,
        defaultAdvocateName: updatedUser.defaultAdvocateName,
        defaultAdvocateEnrollment: updatedUser.defaultAdvocateEnrollment,
        defaultCourtHeader: updatedUser.defaultCourtHeader,
      },
    });
  } catch (error) {
    logger.error("Failed to update user settings", "user_settings_error", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
