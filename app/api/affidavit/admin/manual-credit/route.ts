import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/affidavit/admin/manual-credit
 * Body: {
 *   key: string,
 *   email: string,
 *   credits: number,
 *   amount: number,
 *   planName: string,
 *   paymentId: string,
 *   phone?: string,
 *   sendEmail?: boolean
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, email, credits = 9, amount = 9, planName = "starter", paymentId, phone, sendEmail = true } = body;

    const expectedSecret = process.env.ADMIN_AUTH_SECRET || "mithundas_admin_secret_2026";
    if (key !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find or create user
    let user = await prisma.affidavitUser.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      user = await prisma.affidavitUser.create({
        data: {
          email: trimmedEmail,
          phone: phone || null,
          creditBalance: 0,
          isFirstPurchaseDone: false,
        },
      });
    }

    // Atomic transaction: Create purchase record + update user balance
    const result = await prisma.$transaction(async (tx) => {
      const purchase = await tx.affidavitPurchase.create({
        data: {
          userId: user!.id,
          planName: planName,
          amount: Number(amount),
          creditsAdded: Number(credits),
          razorpayPaymentId: paymentId || "pay_manual_" + Date.now(),
          razorpayOrderId: "order_manual_" + Date.now(),
          status: "completed",
        },
      });

      const updatedUser = await tx.affidavitUser.update({
        where: { id: user!.id },
        data: {
          creditBalance: { increment: Number(credits) },
          isFirstPurchaseDone: true,
          phone: phone || user!.phone,
        },
      });

      return { purchase, updatedUser };
    });

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
      planName === "starter"
        ? "Starter Plan (9 Credits)"
        : planName === "basic"
        ? "Basic Plan (49 Credits)"
        : planName === "pro"
        ? "Professional Plan (99 Credits)"
        : planName === "bulk"
        ? "Bulk Plan (599 Credits)"
        : `${planName.toUpperCase()} (${credits} Credits)`;

    // Trigger n8n Payment Receipt Webhook
    if (sendEmail) {
      const n8nReceiptWebhook = "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-payment-receipt";
      try {
        await fetch(n8nReceiptWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "affidavit.payment.verified",
            userId: result.updatedUser.id,
            email: result.updatedUser.email,
            customerEmail: result.updatedUser.email,
            userEmail: result.updatedUser.email,
            to: result.updatedUser.email,
            recipientEmail: result.updatedUser.email,
            customerPhone: result.updatedUser.phone || "N/A",
            phone: result.updatedUser.phone || "N/A",
            customerName: result.updatedUser.name || "Valued Legal Practitioner",
            userName: result.updatedUser.name || "Valued Legal Practitioner",
            name: result.updatedUser.name || "Valued Legal Practitioner",
            amount: amount,
            amountFormatted: `₹${amount}`,
            amountPaid: `₹${amount} INR`,
            currency: "INR",
            plan: planDisplay,
            planName: planDisplay,
            plan_name: planDisplay,
            planTitle: planDisplay,
            package: planDisplay,
            packageName: planDisplay,
            creditsAdded: credits,
            credits_added: credits,
            credits: credits,
            newTotalCredits: result.updatedUser.creditBalance,
            totalBalance: result.updatedUser.creditBalance,
            totalCredits: result.updatedUser.creditBalance,
            paymentId: paymentId || result.purchase.razorpayPaymentId,
            payment_id: paymentId || result.purchase.razorpayPaymentId,
            orderId: result.purchase.razorpayOrderId,
            order_id: result.purchase.razorpayOrderId,
            date: istDate,
            paymentDate: istDate,
            payment_date: istDate,
            transactionDate: istDate,
            transaction_date: istDate,
            formattedDate: istDate,
            createdAt: istDate,
            created_at: istDate,
            time: istTime,
            paymentTime: istTime,
            timestamp: istTimestamp,
            dateTime: `${istDate} at ${istTime}`,
            date_time: `${istDate} at ${istTime}`,
            productUrl: "https://mithundas.cloud/products/affidavit-generator",
            source: "admin_manual_credit",
          }),
          signal: AbortSignal.timeout(5000),
        });
      } catch (err) {
        logger.warn("Failed to trigger email receipt webhook", "manual_credit_receipt_err", { err: String(err) });
      }
    }

    // Trigger n8n Google Sheet User Sync Webhook
    const n8nUserSyncWebhook = "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-user-sync";
    try {
      await fetch(n8nUserSyncWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "payment.completed",
          userId: result.updatedUser.id,
          name: result.updatedUser.name || "N/A",
          email: result.updatedUser.email,
          phone: result.updatedUser.phone || "N/A",
          avatarUrl: result.updatedUser.avatarUrl || "N/A",
          creditBalance: result.updatedUser.creditBalance,
          isFirstPurchaseDone: result.updatedUser.isFirstPurchaseDone,
          defaultAdvocateName: result.updatedUser.defaultAdvocateName || "N/A",
          defaultCourtHeader: result.updatedUser.defaultCourtHeader || "N/A",
          lastPaymentAmount: `₹${amount}`,
          lastPlanName: planDisplay,
          plan: planDisplay,
          creditsAdded: credits,
          paymentId: paymentId || result.purchase.razorpayPaymentId,
          date: istDate,
          time: istTime,
          timestamp: istTimestamp,
          provider: "razorpay",
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      logger.warn("Failed to trigger user sync webhook", "manual_credit_sync_err", { err: String(err) });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: result.updatedUser.id,
        email: result.updatedUser.email,
        phone: result.updatedUser.phone,
        name: result.updatedUser.name,
        creditBalance: result.updatedUser.creditBalance,
        isFirstPurchaseDone: result.updatedUser.isFirstPurchaseDone,
      },
      purchase: {
        id: result.purchase.id,
        planName: result.purchase.planName,
        amount: result.purchase.amount,
        creditsAdded: result.purchase.creditsAdded,
        paymentId: result.purchase.razorpayPaymentId,
        status: result.purchase.status,
      },
    });
  } catch (error: unknown) {
    logger.error("Failed to apply manual credit", "admin_manual_credit_error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
