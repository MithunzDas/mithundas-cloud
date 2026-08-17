import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/affidavit/admin/fix-balance
 * Recalculates a user's credit balance based on completed purchases minus used credits.
 * Protected by admin key.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, email } = body;

    const expectedSecret = process.env.ADMIN_AUTH_SECRET || "mithundas_admin_secret_2026";
    if (key !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await prisma.affidavitUser.findUnique({
      where: { email },
      include: { purchases: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completedCredits = user.purchases
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.creditsAdded, 0);

    const beforeBalance = user.creditBalance;
    const beforeFirstPurchaseDone = user.isFirstPurchaseDone;

    const shouldFix = beforeBalance < completedCredits || (!beforeFirstPurchaseDone && completedCredits > 0);

    if (shouldFix) {
      const updated = await prisma.affidavitUser.update({
        where: { id: user.id },
        data: {
          creditBalance: completedCredits,
          isFirstPurchaseDone: true,
        },
      });

      return NextResponse.json({
        fixed: true,
        email,
        before: { balance: beforeBalance, isFirstPurchaseDone: beforeFirstPurchaseDone },
        after: { balance: updated.creditBalance, isFirstPurchaseDone: updated.isFirstPurchaseDone },
        completedPurchases: user.purchases.filter((p) => p.status === "completed").length,
      });
    }

    return NextResponse.json({
      fixed: false,
      email,
      currentBalance: beforeBalance,
      expectedFromPurchases: completedCredits,
      message: "Balance is already correct.",
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
