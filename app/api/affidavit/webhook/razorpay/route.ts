import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * POST /api/affidavit/webhook/razorpay
 *
 * Dedicated Razorpay Server-to-Server Webhook handler.
 * Ensures payments made via Mobile UPI apps (PhonePe, GPay, Paytm)
 * are ALWAYS credited and receipt emails are ALWAYS sent, even if
 * the user's mobile browser was closed or refreshed.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    if (!rawBody || rawBody.trim() === "") {
      return NextResponse.json({ received: true });
    }

    const signature = req.headers.get("x-razorpay-signature");

    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    // Verify webhook signature if secret is present
    if (signature && webhookSecret) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        logger.warn("Razorpay webhook signature mismatch", "rzp_webhook_sig_err");
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    // Handle payment.captured or order.paid
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const payment = event.payload?.payment?.entity;
      const orderId = payment?.order_id;
      const paymentId = payment?.id;

      // Ignore payments from other services, consultation links, or custom video call invoices
      if (payment.notes && payment.notes.type && payment.notes.type !== "affidavit_credits") {
        return NextResponse.json({ received: true, ignored: "non_affidavit_service" });
      }

      // Check if purchase exists in Affidavit database
      const purchase = await prisma.affidavitPurchase.findFirst({
        where: { razorpayOrderId: orderId },
      });

      if (!purchase) {
        // Non-affidavit payment (e.g. consultation, video call, custom invoice) -> safely ignore
        return NextResponse.json({ received: true, ignored: "non_affidavit_order" });
      }

      if (purchase.status === "completed") {
        return NextResponse.json({ received: true, status: "already_completed" });
      }

      // Extract details
      const user = await prisma.affidavitUser.findUnique({
        where: { id: purchase.userId },
      });

      if (!user) {
        return NextResponse.json({ received: true });
      }

      let customerPhone = user.phone || null;
      let customerEmail = user.email || null;

      if (payment.contact) {
        customerPhone = String(payment.contact).replace(/^\+91/, "").trim();
      }
      if (payment.email && !customerEmail) {
        customerEmail = payment.email;
      }

      // Update purchase & user credit balance in a transaction
      const [updatedPurchase, updatedUser] = await prisma.$transaction([
        prisma.affidavitPurchase.update({
          where: { id: purchase.id },
          data: {
            razorpayPaymentId: paymentId || purchase.razorpayPaymentId,
            status: "completed",
          },
        }),
        prisma.affidavitUser.update({
          where: { id: user.id },
          data: {
            creditBalance: { increment: purchase.creditsAdded },
            isFirstPurchaseDone: true,
            phone: customerPhone || user.phone,
          },
        }),
      ]);

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

      // Trigger n8n Automated Email Receipt Webhook
      const n8nReceiptWebhook =
        "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-payment-receipt";
      try {
        await fetch(n8nReceiptWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "affidavit.payment.verified",
            userId: updatedUser.id,
            email: customerEmail || updatedUser.email || "N/A",
            customerEmail: customerEmail || updatedUser.email || "N/A",
            userEmail: customerEmail || updatedUser.email || "N/A",
            to: customerEmail || updatedUser.email || "N/A",
            recipientEmail: customerEmail || updatedUser.email || "N/A",
            customerPhone: customerPhone || "N/A",
            phone: customerPhone || "N/A",
            customerName: updatedUser.name || "Valued Legal Practitioner",
            userName: updatedUser.name || "Valued Legal Practitioner",
            name: updatedUser.name || "Valued Legal Practitioner",
            amount: updatedPurchase.amount,
            amountFormatted: `₹${updatedPurchase.amount}`,
            currency: "INR",
            plan: planDisplay,
            planName: planDisplay,
            creditsAdded: updatedPurchase.creditsAdded,
            newTotalCredits: updatedUser.creditBalance,
            paymentId: paymentId || "N/A",
            orderId: orderId,
            date: istDate,
            paymentDate: istDate,
            time: istTime,
            timestamp: istTimestamp,
            productUrl: "https://mithundas.cloud/products/affidavit-generator",
            source: "razorpay_server_webhook",
          }),
          signal: AbortSignal.timeout(5000),
        });
      } catch {
        // ignore
      }

      // Trigger n8n User Sync / Google Sheets Webhook
      const n8nUserSyncWebhook =
        "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-user-sync";
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
            paymentId: paymentId || "N/A",
            date: istDate,
            time: istTime,
            timestamp: istTimestamp,
            provider: "razorpay_webhook",
          }),
          signal: AbortSignal.timeout(5000),
        });
      } catch {
        // ignore
      }

      return NextResponse.json({ success: true, status: "completed" });
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error("Razorpay webhook processing error", "rzp_webhook_err", { err: msg });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
