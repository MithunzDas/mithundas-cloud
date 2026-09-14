import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signOwnerToken, setOwnerSessionCookie } from "@/lib/qr-review/auth-session";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and 6-digit code are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    // Check OTP record in DB (or allow test 123456 in development)
    const isDevTest = process.env.NODE_ENV !== "production" && cleanOtp === "123456";

    let validRecord = null;
    if (!isDevTest) {
      validRecord = await prisma.ownerAuthOtp.findFirst({
        where: {
          email: cleanEmail,
          code: cleanOtp,
        },
      });

      if (!validRecord) {
        return NextResponse.json(
          { success: false, error: "Invalid code. Please check and try again." },
          { status: 400 }
        );
      }

      if (new Date() > validRecord.expiresAt) {
        await prisma.ownerAuthOtp.delete({ where: { id: validRecord.id } });
        return NextResponse.json(
          { success: false, error: "This code has expired. Please request a new one." },
          { status: 400 }
        );
      }

      // Clear used code
      await prisma.ownerAuthOtp.delete({ where: { id: validRecord.id } });
    }

    // Retrieve all businesses belonging to this owner
    const businesses = await prisma.reviewBusiness.findMany({
      where: { ownerEmail: cleanEmail },
      select: {
        id: true,
        slug: true,
        businessName: true,
        category: true,
        trialStatus: true,
        trialEndsAt: true,
        subscriptionPlan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Generate signed session token and set HTTP-only cookie
    const token = signOwnerToken({ email: cleanEmail });
    await setOwnerSessionCookie(token);

    logger.info(`Owner authenticated via OTP: ${cleanEmail}`, "owner_otp_success", {
      businessCount: businesses.length,
    });

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      owner: {
        email: cleanEmail,
        businesses,
      },
    });
  } catch (err) {
    logger.error("Failed to verify owner OTP", "owner_verify_error", err);
    return NextResponse.json(
      { success: false, error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
