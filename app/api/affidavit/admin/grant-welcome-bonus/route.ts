import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/affidavit/admin/grant-welcome-bonus
 * Migrates all existing non-paying users (0 credits, no purchases) to 3 Welcome Credits,
 * and syncs each to Google Sheets.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key } = body;

    const expectedSecret = process.env.ADMIN_AUTH_SECRET || "mithundas_admin_secret_2026";
    if (key !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all users who have never made a purchase and currently have 0 credits
    const users = await prisma.affidavitUser.findMany({
      where: {
        isFirstPurchaseDone: false,
        creditBalance: 0,
      },
      include: {
        purchases: true,
      },
    });

    const eligibleUsers = users.filter((u) => {
      const hasCompletedPurchase = u.purchases.some((p) => p.status === "completed");
      return !hasCompletedPurchase;
    });

    const updatedList = [];
    const n8nUserSyncWebhook = "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-user-sync";

    for (const u of eligibleUsers) {
      const updated = await prisma.affidavitUser.update({
        where: { id: u.id },
        data: { creditBalance: 3 },
      });

      updatedList.push({
        id: updated.id,
        email: updated.email,
        name: updated.name,
        creditBalance: updated.creditBalance,
      });

      // Sync to Google Sheet via n8n
      try {
        await fetch(n8nUserSyncWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "welcome_bonus_granted",
            userId: updated.id,
            name: updated.name || "N/A",
            email: updated.email || "N/A",
            phone: updated.phone || "N/A",
            avatarUrl: updated.avatarUrl || "N/A",
            creditBalance: 3,
            credits: 3,
            isFirstPurchaseDone: false,
            defaultAdvocateName: updated.defaultAdvocateName || "N/A",
            defaultCourtHeader: updated.defaultCourtHeader || "N/A",
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
        logger.warn("Failed to sync welcome bonus to Google Sheet", "welcome_bonus_sync_err", { err: String(err) });
      }
    }

    return NextResponse.json({
      success: true,
      migratedCount: updatedList.length,
      users: updatedList,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
