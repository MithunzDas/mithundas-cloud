import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/* ─── Plan Config ─── */
const CREDIT_PLANS: Record<string, { amount: number; credits: number; firstTimeOnly: boolean }> = {
  starter: { amount: 9, credits: 9, firstTimeOnly: true },
  basic: { amount: 49, credits: 49, firstTimeOnly: false },
  pro: { amount: 99, credits: 99, firstTimeOnly: false },
  bulk: { amount: 499, credits: 599, firstTimeOnly: false },
};

/**
 * POST /api/affidavit/purchase-credits
 * Body: { planId: string, email: string, name?: string }
 *
 * Creates a Razorpay order and upserts the user.
 * Returns Razorpay order details for frontend checkout.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, email, name } = body;

    if (!planId || !email) {
      return NextResponse.json(
        { success: false, error: "Missing planId or email" },
        { status: 400 }
      );
    }

    const plan = CREDIT_PLANS[planId];
    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Upsert user
    let user = await prisma.affidavitUser.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.affidavitUser.create({
        data: { email, name: name || null },
      });
    }

    // Check first-time-only restriction
    if (plan.firstTimeOnly && user.isFirstPurchaseDone) {
      return NextResponse.json(
        { success: false, error: "Starter plan is available for first-time users only" },
        { status: 403 }
      );
    }

    // Create Razorpay order
    const razorpayKeyId = env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpaySecret = env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpaySecret) {
      return NextResponse.json(
        { success: false, error: "Payment gateway not configured" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString("base64");
    const amountInPaise = plan.amount * 100;

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `aff_${planId}_${user.id.slice(-8)}`,
        notes: {
          type: "affidavit_credits",
          planId,
          userId: user.id,
          userEmail: email,
          creditsToAdd: String(plan.credits),
        },
      }),
    });

    if (!razorpayRes.ok) {
      const errText = await razorpayRes.text();
      logger.error("Razorpay order creation failed", "affidavit_payment_error", { errText });
      return NextResponse.json(
        { success: false, error: "Failed to create payment order" },
        { status: 500 }
      );
    }

    const order = await razorpayRes.json();

    // Create pending purchase record
    await prisma.affidavitPurchase.create({
      data: {
        userId: user.id,
        planName: planId,
        amount: plan.amount,
        creditsAdded: plan.credits,
        razorpayOrderId: order.id,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayKeyId,
      userId: user.id,
      planCredits: plan.credits,
    });
  } catch (error) {
    logger.error("Failed to process credit purchase", "affidavit_purchase_error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
