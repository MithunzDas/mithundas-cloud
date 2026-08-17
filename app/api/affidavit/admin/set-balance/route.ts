import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/affidavit/admin/set-balance
 * Body: { key: string, email: string, creditBalance: number, isFirstPurchaseDone?: boolean }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, email, creditBalance = 0, isFirstPurchaseDone } = body;

    const expectedSecret = process.env.ADMIN_AUTH_SECRET || "mithundas_admin_secret_2026";
    if (key !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const user = await prisma.affidavitUser.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.affidavitUser.update({
      where: { id: user.id },
      data: {
        creditBalance: Number(creditBalance),
        ...(typeof isFirstPurchaseDone === "boolean" ? { isFirstPurchaseDone } : {}),
      },
    });

    // Trigger n8n Google Sheet User Sync Webhook
    const n8nUserSyncWebhook = "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-user-sync";
    try {
      await fetch(n8nUserSyncWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "balance_updated",
          userId: updatedUser.id,
          name: updatedUser.name || "N/A",
          email: updatedUser.email,
          phone: updatedUser.phone || "N/A",
          avatarUrl: updatedUser.avatarUrl || "N/A",
          creditBalance: updatedUser.creditBalance,
          credits: updatedUser.creditBalance,
          isFirstPurchaseDone: updatedUser.isFirstPurchaseDone,
          defaultAdvocateName: updatedUser.defaultAdvocateName || "N/A",
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
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          provider: "google",
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      logger.warn("Failed to trigger user sync webhook", "set_balance_sync_err", { err: String(err) });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        creditBalance: updatedUser.creditBalance,
        isFirstPurchaseDone: updatedUser.isFirstPurchaseDone,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
