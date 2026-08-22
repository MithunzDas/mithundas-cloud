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

    try {
      const existingUser = await prisma.affidavitUser.findFirst({
        where: whereClause,
      });

      if (existingUser) {
        await prisma.affidavitUser.update({
          where: { id: existingUser.id },
          data: {
            otpCode,
            otpExpiresAt,
          },
        });
      } else {
        await prisma.affidavitUser.create({
          data: {
            ...(isEmail ? { email: trimmed } : { phone: trimmed }),
            otpCode,
            otpExpiresAt,
            creditBalance: 3, // 🎁 3 Free Welcome Credits for 1st Time Sign-up
          },
        });
      }
    } catch (dbErr) {
      logger.error("DB error during OTP upsert", "otp_db_error", { err: String(dbErr) });
    }

    // If email and resend configured, send email
    let emailDispatched = false;
    if (isEmail && resend && env.EMAIL_FROM) {
      try {
        const { error: resendError } = await resend.emails.send({
          from: env.EMAIL_FROM,
          to: trimmed,
          subject: `Your Login OTP for CAA Affidavit Generator: ${otpCode}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <div style="height: 4px; background: linear-gradient(90deg, #0ea5e9, #6366f1, #0ea5e9);"></div>
              <div style="padding: 24px 32px 18px 32px; border-bottom: 1px solid #f1f5f9;">
                <table cellpadding="0" cellspacing="0" style="border: none; width: 100%;">
                  <tr>
                    <td style="vertical-align: middle; width: 48px;">
                      <img src="https://mithundas.cloud/logo.png" alt="M" style="width: 38px; height: 38px; border-radius: 8px; display: block;">
                    </td>
                    <td style="vertical-align: middle;">
                      <span style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">Mithun Das</span><br>
                      <span style="font-family: Arial, sans-serif; font-size: 10px; color: #0ea5e9; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px;">AI AUTOMATION</span>
                    </td>
                  </tr>
                </table>
              </div>
              <div style="padding: 28px 32px; font-size: 15px; color: #334155; line-height: 1.7;">
                <p style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a;">Your One-Time Login Code</p>
                <p style="margin: 0 0 20px 0;">Use the 6-digit verification code below to sign in to the CAA Affidavit Generator:</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; text-align: center; margin: 20px 0;">
                  <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0ea5e9; font-family: monospace;">${otpCode}</span>
                  <p style="color: #64748b; font-size: 12px; margin: 8px 0 0 0;">Valid for 10 minutes. Do not share this code.</p>
                </div>
              </div>
              <div style="height: 3px; background: linear-gradient(90deg, #0ea5e9, #6366f1, #0ea5e9);"></div>
            </div>
          `,
        });
        if (!resendError) {
          emailDispatched = true;
        } else {
          logger.warn("Resend returned error", "resend_err", { resendError });
        }
      } catch (emailErr) {
        logger.warn("Resend email delivery failed, OTP logged", "otp_email_warn", {
          emailErr: String(emailErr),
          otp: otpCode,
        });
      }
    }

    logger.info("OTP generated for affidavit user", "otp_generated", {
      identifier: trimmed,
      isEmail,
      isPhone,
      emailDispatched,
    });

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${trimmed}`,
      // Fallback preview code if email delivery not completed or in development
      previewOtp: !emailDispatched ? otpCode : undefined,
    });
  } catch (error: unknown) {
    logger.error("Failed to send OTP", "otp_send_error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { success: false, error: "Failed to generate OTP. Please try again." },
      { status: 500 }
    );
  }
}
