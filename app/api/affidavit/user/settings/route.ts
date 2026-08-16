import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/affidavit/user/settings
 * Body: { userId: string, name?: string, defaultAdvocateName?: string, defaultAdvocateEnrollment?: string, defaultCourtHeader?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, defaultAdvocateName, defaultAdvocateEnrollment, defaultCourtHeader } = body;

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
        ...(defaultAdvocateName !== undefined && { defaultAdvocateName }),
        ...(defaultAdvocateEnrollment !== undefined && { defaultAdvocateEnrollment }),
        ...(defaultCourtHeader !== undefined && { defaultCourtHeader }),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        name: updatedUser.name,
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
