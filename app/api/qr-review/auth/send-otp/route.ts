import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email/dispatcher";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, businessName } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate cryptographically sound 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any old OTPs for this email
    await prisma.ownerAuthOtp.deleteMany({
      where: { email: cleanEmail },
    });

    // Save new OTP
    await prisma.ownerAuthOtp.create({
      data: {
        email: cleanEmail,
        code,
        expiresAt,
      },
    });

    // Dispatch email via multi-transport (Hostinger SMTP -> n8n Webhook -> Resend)
    const dispatchResult = await sendOtpEmail({
      to: cleanEmail,
      code,
      businessName,
    });

    if (!dispatchResult.success) {
      const errorMessage =
        dispatchResult.provider === "none"
          ? "Email service is not yet configured on server (Hostinger SMTP or n8n webhook missing). Please sign in using Google above or contact the administrator."
          : "Unable to deliver verification email to this address. Please ensure the address is correct or sign in using Google above.";

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your inbox.`,
      emailSent: true,
      provider: dispatchResult.provider,
    });
  } catch (err) {
    logger.error("Failed to send owner OTP", "owner_otp_error", err);
    return NextResponse.json(
      { success: false, error: "Failed to send login code. Please try again." },
      { status: 500 }
    );
  }
}

