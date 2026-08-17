import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import crypto from "crypto";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/affidavit/verify-payment
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId }
 *
 * Verifies Razorpay payment signature, marks purchase as completed,
 * adds credits to user balance, and marks first purchase done.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify signature
    const razorpaySecret = env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret) {
      return NextResponse.json(
        { success: false, error: "Payment gateway not configured" },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      logger.warn("Invalid Razorpay signature for affidavit payment", "affidavit_sig_invalid", {
        razorpay_order_id,
        razorpay_payment_id,
      });
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 403 }
      );
    }

    // Find the pending purchase
    const purchase = await prisma.affidavitPurchase.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        userId,
        status: "pending",
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: "Purchase record not found" },
        { status: 404 }
      );
    }

    // Update purchase status and add credits in a transaction
    const [updatedPurchase, updatedUser] = await prisma.$transaction([
      prisma.affidavitPurchase.update({
        where: { id: purchase.id },
        data: {
          status: "completed",
          razorpayPaymentId: razorpay_payment_id,
        },
      }),
      prisma.affidavitUser.update({
        where: { id: userId },
        data: {
          creditBalance: { increment: purchase.creditsAdded },
          isFirstPurchaseDone: true,
        },
      }),
    ]);

    logger.info("Affidavit credits purchased successfully", "affidavit_purchase_success", {
      userId,
      plan: purchase.planName,
      credits: purchase.creditsAdded,
      newBalance: updatedUser.creditBalance,
    });

    // Fetch contact details from Razorpay Payment API to guarantee phone number capture
    let customerPhone = updatedUser.phone || null;
    let customerEmail = updatedUser.email || null;

    if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
      try {
        const basicAuth = Buffer.from(
          `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`
        ).toString("base64");
        const rzpRes = await fetch(
          `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
          {
            headers: {
              Authorization: `Basic ${basicAuth}`,
            },
            signal: AbortSignal.timeout(5000),
          }
        );
        if (rzpRes.ok) {
          const rzpData = await rzpRes.json();
          if (rzpData.contact) {
            customerPhone = String(rzpData.contact).replace(/^\+91/, "").trim();
            // Persist customer contact into database
            await prisma.affidavitUser.update({
              where: { id: userId },
              data: { phone: customerPhone },
            });
          }
          if (rzpData.email && !customerEmail) {
            customerEmail = rzpData.email;
          }
        }
      } catch (rzpFetchErr) {
        logger.warn("Could not fetch payment details from Razorpay", "rzp_fetch_warn", {
          err: String(rzpFetchErr),
        });
      }
    }

    const istDate = new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const istTime = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const istTimestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const planDisplay =
      updatedPurchase.planName === "starter"
        ? "Starter Plan (9 Credits)"
        : updatedPurchase.planName === "basic"
        ? "Basic Plan (49 Credits)"
        : updatedPurchase.planName === "pro"
        ? "Pro Plan (99 Credits)"
        : updatedPurchase.planName === "bulk"
        ? "Bulk Plan (550 Credits)"
        : `${updatedPurchase.planName.toUpperCase()} (${updatedPurchase.creditsAdded} Credits)`;

    // Asynchronously trigger n8n Automated Payment Receipt & Confirmation Workflow
    const n8nReceiptWebhook = "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-payment-receipt";
    try {
      await fetch(n8nReceiptWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "affidavit.payment.verified",
          userId: updatedUser.id,
          customerEmail: customerEmail || "N/A",
          customerPhone: customerPhone || "N/A",
          customerName: updatedUser.name || "Valued Legal Practitioner",
          amount: updatedPurchase.amount,
          amountFormatted: `₹${updatedPurchase.amount}`,
          currency: "INR",
          plan: planDisplay,
          planName: planDisplay,
          creditsAdded: updatedPurchase.creditsAdded,
          newTotalCredits: updatedUser.creditBalance,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          date: istDate,
          paymentDate: istDate,
          time: istTime,
          timestamp: istTimestamp,
          productUrl: "https://mithundas.cloud/products/affidavit-generator",
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      // ignore
    }

    // Guaranteed synchronous trigger to n8n User Sync Webhook for real-time Google Sheets update
    const n8nUserSyncWebhook = "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-user-sync";
    try {
      await fetch(n8nUserSyncWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "payment.completed",
          userId: updatedUser.id,
          name: updatedUser.name || "N/A",
          email: customerEmail || updatedUser.email || "N/A",
          phone: customerPhone || updatedUser.phone || "N/A",
          avatarUrl: updatedUser.avatarUrl || "N/A",
          creditBalance: updatedUser.creditBalance,
          isFirstPurchaseDone: updatedUser.isFirstPurchaseDone,
          defaultAdvocateName: updatedUser.defaultAdvocateName || "N/A",
          defaultCourtHeader: updatedUser.defaultCourtHeader || "N/A",
          lastPaymentAmount: `₹${updatedPurchase.amount}`,
          lastPlanName: planDisplay,
          plan: planDisplay,
          creditsAdded: updatedPurchase.creditsAdded,
          paymentId: razorpay_payment_id,
          date: istDate,
          time: istTime,
          timestamp: istTimestamp,
          provider: "razorpay",
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      creditsAdded: purchase.creditsAdded,
      newBalance: updatedUser.creditBalance,
      message: `Successfully added ${purchase.creditsAdded} credits to your balance.`,
    });
  } catch (error: unknown) {
    logger.error("Failed to verify affidavit payment", "affidavit_verify_error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { success: false, error: "Internal server error during verification" },
      { status: 500 }
    );
  }
}
