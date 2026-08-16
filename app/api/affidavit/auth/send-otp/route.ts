import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";
import { Resend } from "resend";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/affidavit/auth/send-otp
 * Body: { identifier: string } // email or 10-digit mobile number
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier } = body;

    if (!identifier || typeof identifier !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email or phone number" },
        { status: 400 }
      );
    }

    const trimmed = identifier.trim().toLowerCase();
    const isEmail = trimmed.includes("@");
    const isPhone = /^\+?[0-9]{10,13}$/.test(trimmed.replace(/[\s-]/g, ""));

    if (!isEmail && !isPhone) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address or 10-digit mobile number" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Find or create user
    const whereClause = isEmail ? { email: trimmed } : { phone: trimmed };

    await prisma.affidavitUser.upsert({
      where: whereClause,
      update: {
        otpCode,
        otpExpiresAt,
      },
      create: {
        ...(isEmail ? { email: trimmed } : { phone: trimmed }),
        otpCode,
        otpExpiresAt,
      },
    });

    // If email and resend configured, send email
    if (isEmail && resend && env.EMAIL_FROM) {
      try {
        await resend.emails.send({
          from: env.EMAIL_FROM,
          to: trimmed,
          subject: `Your Login OTP for CAA Affidavit Generator: ${otpCode}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #070A0F; color: #E6EDF3; padding: 30px; border-radius: 12px;">
              <h2 style="color: #00C6FF; margin-bottom: 8px;">CAA Affidavit Generator</h2>
              <p style="color: #8B949E; font-size: 14px;">Legal Document Automation • Mithun Das Cloud</p>
              <div style="margin: 25px 0; background: #0D1118; border: 1px solid #1E293B; border-radius: 10px; padding: 20px; text-align: center;">
                <p style="color: #94A3B8; font-size: 14px; margin-bottom: 8px;">Your One-Time Password (OTP) is:</p>
                <h1 style="font-size: 36px; letter-spacing: 6px; color: #00C6FF; margin: 0; font-family: monospace;">${otpCode}</h1>
                <p style="color: #64748B; font-size: 12px; margin-top: 10px;">Valid for 10 minutes. Do not share this OTP with anyone.</p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        logger.warn("Resend email delivery failed, OTP logged to server", "otp_email_warn", {
          emailErr: String(emailErr),
          otp: otpCode,
        });
      }
    }

    logger.info("OTP generated for affidavit user", "otp_generated", {
      identifier: trimmed,
      isEmail,
      isPhone,
    });

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${trimmed}`,
      // In development or for quick test, provide fallback
      previewOtp: process.env.NODE_ENV !== "production" ? otpCode : undefined,
    });
  } catch (error) {
    logger.error("Failed to send OTP", "otp_send_error", error);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
