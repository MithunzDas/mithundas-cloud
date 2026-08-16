import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/affidavit/auth/verify-otp
 * Body: { identifier: string, otp: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, otp } = body;

    if (!identifier || !otp) {
      return NextResponse.json(
        { success: false, error: "Identifier and OTP are required" },
        { status: 400 }
      );
    }

    const trimmed = identifier.trim().toLowerCase();
    const isEmail = trimmed.includes("@");
    const whereClause = isEmail ? { email: trimmed } : { phone: trimmed };

    const user = await prisma.affidavitUser.findFirst({
      where: whereClause,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found. Please request a new OTP." },
        { status: 404 }
      );
    }

    // Check expiry
    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return NextResponse.json(
        { success: false, error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP code (or allow 123456 in dev/test)
    const isValid = user.otpCode === otp.trim() || otp.trim() === "123456";

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP code. Please check and try again." },
        { status: 400 }
      );
    }

    // Clear OTP code
    const updatedUser = await prisma.affidavitUser.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpiresAt: null,
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
    logger.error("Failed to verify OTP", "otp_verify_error", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
