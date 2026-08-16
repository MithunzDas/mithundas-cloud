import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * GET /api/affidavit/balance?email=... or ?userId=...
 * Returns the current credit balance and whether first purchase is completed.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    if (!email && !userId) {
      return NextResponse.json(
        { success: false, error: "Provide email or userId" },
        { status: 400 }
      );
    }

    const user = await prisma.affidavitUser.findFirst({
      where: email ? { email } : { id: userId! },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        avatarUrl: true,
        creditBalance: true,
        isFirstPurchaseDone: true,
        defaultAdvocateName: true,
        defaultAdvocateEnrollment: true,
        defaultCourtHeader: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        exists: false,
        creditBalance: 0,
        isFirstPurchaseDone: false,
      });
    }

    return NextResponse.json({
      success: true,
      exists: true,
      user,
    });
  } catch (error) {
    logger.error("Failed to fetch affidavit user balance", "affidavit_balance_error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
