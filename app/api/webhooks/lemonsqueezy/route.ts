import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import crypto from "crypto";

/**
 * Webhook handler for Lemon Squeezy Subscription events.
 * 
 * Configured in Lemon Squeezy Dashboard:
 * Settings -> Webhooks -> Add Webhook
 * URL: https://www.mithundas.cloud/api/webhooks/lemonsqueezy
 * 
 * Events handled:
 * - subscription_created
 * - subscription_updated
 * - subscription_cancelled
 * - subscription_expired
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    // Verify signature if secret is configured
    if (secret && signature) {
      const hmac = crypto.createHmac("sha256", secret);
      const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
      const signatureBuffer = Buffer.from(signature, "utf8");

      if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        logger.warn("Invalid Lemon Squeezy webhook signature", "lemonsqueezy_webhook_auth_failed");
        return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data || {};
    const attributes = payload.data?.attributes || {};

    logger.info(`Lemon Squeezy webhook received: ${eventName}`, "lemonsqueezy_webhook", {
      subscriptionId: payload.data?.id,
      eventName,
    });

    const businessSlug = customData.business_slug;
    const userEmail = attributes.user_email;
    const status = attributes.status; // "active", "cancelled", "expired", "past_due"

    let business = null;
    if (businessSlug) {
      business = await prisma.reviewBusiness.findUnique({
        where: { slug: businessSlug },
      });
    }

    if (!business && userEmail) {
      business = await prisma.reviewBusiness.findFirst({
        where: { ownerEmail: userEmail },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!business) {
      logger.warn(`Business not found for Lemon Squeezy event ${eventName}`, "lemonsqueezy_webhook_orphan", {
        slug: businessSlug,
        email: userEmail,
      });
      return NextResponse.json({ success: true, message: "No matching business found" });
    }

    // Handle Subscription Active
    if (eventName === "subscription_created" || status === "active") {
      const isAnnual = attributes.product_name?.toLowerCase().includes("annual") || attributes.first_subscription_item?.price_id;

      await prisma.reviewBusiness.update({
        where: { id: business.id },
        data: {
          trialStatus: "SUBSCRIBED",
          subscriptionMethod: "LEMON_SQUEEZY",
          subscriptionPlan: isAnnual ? "ANNUAL_249" : "MONTHLY_30",
          subscriptionId: String(payload.data?.id || business.subscriptionId),
          trialEndsAt: new Date(Date.now() + (isAnnual ? 365 : 35) * 24 * 60 * 60 * 1000),
        },
      });

      logger.info(`Business ${business.slug} upgraded to SUBSCRIBED via Lemon Squeezy`, "lemonsqueezy_subscription_active");
    } else if (eventName === "subscription_cancelled" || status === "cancelled" || status === "expired") {
      await prisma.reviewBusiness.update({
        where: { id: business.id },
        data: {
          trialStatus: "CANCELLED",
        },
      });

      logger.info(`Business ${business.slug} subscription marked as CANCELLED`, "lemonsqueezy_subscription_cancelled");
    }

    return NextResponse.json({ success: true, eventName, businessSlug: business.slug });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error("Failed to process Lemon Squeezy webhook", "lemonsqueezy_webhook_error", error);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "Lemon Squeezy webhook listener is running.",
  });
}
