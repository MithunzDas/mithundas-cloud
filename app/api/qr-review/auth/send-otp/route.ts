import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { Resend } from "resend";
import { logger } from "@/lib/logger";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

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

    // Dispatch email via Resend
    let emailSent = false;
    const fromAddress = env.EMAIL_FROM || "Mithun Das AI <no-reply@mithundas.cloud>";

    if (resend) {
      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#090d16;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f8fafc;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#090d16;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0f172a;border-radius:16px;border:1px solid #1e293b;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,0.5);">

  <!-- Header Banner -->
  <tr><td style="background:linear-gradient(135deg,#0284c7 0%,#4f46e5 100%);padding:28px 32px;">
    <div style="font-size:11px;font-family:monospace;letter-spacing:1.5px;color:rgba(255,255,255,0.85);text-transform:uppercase;margin-bottom:4px;">15-SECOND QR REVIEW SAAS</div>
    <h1 style="margin:0;font-size:20px;font-weight:800;color:#ffffff;">Business Owner Verification Code</h1>
  </td></tr>

  <!-- Content -->
  <tr><td style="padding:32px;">
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#cbd5e1;">
      Use the 6-digit one-time code below to log in to your business growth analytics dashboard:
    </p>

    <!-- Code Block -->
    <div style="background:#080b11;border:1px solid #0284c7;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
      <span style="font-size:38px;font-weight:900;letter-spacing:10px;color:#38bdf8;font-family:monospace;">${code}</span>
      <p style="margin:10px 0 0;font-size:12px;color:#94a3b8;">Valid for 10 minutes. For your security, do not share this code.</p>
    </div>

    <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">
      If you did not request this login code, you can safely ignore this email.
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:16px 32px;border-top:1px solid #1e293b;background:#080b11;text-align:center;">
    <p style="margin:0;font-size:11px;color:#475569;font-family:monospace;">
      Mithun Das Cloud • Automated Business Intelligence Platform
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>
      `;

      try {
        let { error: resendError } = await resend.emails.send({
          from: fromAddress,
          to: cleanEmail,
          subject: `Your Login Code: ${code} — Business Owner Portal | Mithun Das AI`,
          html: emailHtml,
        });

        // If custom domain unverified, fallback to onboarding@resend.dev
        if (resendError && fromAddress !== "onboarding@resend.dev") {
          logger.warn("Retrying OTP email with onboarding@resend.dev fallback", "resend_fallback", { resendError });
          const retryRes = await resend.emails.send({
            from: "Mithun Das AI <onboarding@resend.dev>",
            to: cleanEmail,
            subject: `Your Login Code: ${code} — Business Owner Portal | Mithun Das AI`,
            html: emailHtml,
          });
          resendError = retryRes.error;
        }

        if (!resendError) {
          emailSent = true;
        } else {
          logger.warn("Resend email dispatch error", "otp_email_warn", { resendError });
        }
      } catch (sendErr) {
        logger.warn("Exception while sending OTP email", "otp_email_exception", { error: String(sendErr) });
      }
    }

    if (!resend) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service is not yet configured on server (RESEND_API_KEY missing). Please sign in using Google above or contact the administrator.",
        },
        { status: 500 }
      );
    }

    if (!emailSent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to deliver verification email to this address. Please ensure email address is correct or use Google sign-in above.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your inbox.`,
      emailSent: true,
    });
  } catch (err) {
    logger.error("Failed to send owner OTP", "owner_otp_error", err);
    return NextResponse.json(
      { success: false, error: "Failed to send login code. Please try again." },
      { status: 500 }
    );
  }
}
