import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * GET /api/affidavit/admin/debug-purchases?email=...&paymentId=...
 * Debug-only: returns purchases for a user or payment.
 * Protected by a simple admin key check.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminKey = searchParams.get("key");
  const expectedSecret = process.env.ADMIN_AUTH_SECRET || "mithundas_admin_secret_2026";
  if (adminKey !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = searchParams.get("email");
  const paymentId = searchParams.get("paymentId");
  const userId = searchParams.get("userId");

  try {
    let user = null;
    if (email) {
      user = await prisma.affidavitUser.findUnique({
        where: { email },
        include: { purchases: { orderBy: { createdAt: "desc" } } },
      });
    } else if (userId) {
      user = await prisma.affidavitUser.findUnique({
        where: { id: userId },
        include: { purchases: { orderBy: { createdAt: "desc" } } },
      });
    }

    let paymentPurchase = null;
    if (paymentId) {
      paymentPurchase = await prisma.affidavitPurchase.findFirst({
        where: { razorpayPaymentId: paymentId },
      });
    }

    return NextResponse.json({
      user: user
        ? {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            creditBalance: user.creditBalance,
            isFirstPurchaseDone: user.isFirstPurchaseDone,
            purchaseCount: user.purchases.length,
            purchases: user.purchases.map((p) => ({
              id: p.id,
              planName: p.planName,
              amount: p.amount,
              creditsAdded: p.creditsAdded,
              status: p.status,
              razorpayOrderId: p.razorpayOrderId,
              razorpayPaymentId: p.razorpayPaymentId,
              createdAt: p.createdAt,
            })),
          }
        : null,
      paymentPurchase,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
