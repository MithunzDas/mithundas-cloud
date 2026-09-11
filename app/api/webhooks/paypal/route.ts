import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

/**
 * Webhook handler for PayPal Subscription events.
 * 
 * Configured in PayPal Developer Dashboard:
 * URL: https://www.mithundas.cloud/api/webhooks/paypal
 * 
 * Events handled:
 * - BILLING.SUBSCRIPTION.ACTIVATED
 * - PAYMENT.SALE.COMPLETED
 * - BILLING.SUBSCRIPTION.CANCELLED
 * - BILLING.SUBSCRIPTION.SUSPENDED
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;
    const resource = body.resource;

    if (!eventType || !resource) {
      return NextResponse.json({ success: false, error: "Invalid PayPal webhook payload" }, { status: 400 });
    }

    logger.info(`PayPal webhook received: ${eventType}`, "paypal_webhook", {
      id: resource.id,
      eventType,
    });

    // Custom ID is the business slug passed during checkout
    const businessSlug = resource.custom_id || resource.custom;
    const subscriberEmail = resource.subscriber?.email_address;
    const subscriptionId = resource.id || resource.billing_agreement_id;

    // Determine target business
    let business = null;
    if (businessSlug) {
      business = await prisma.reviewBusiness.findUnique({
        where: { slug: businessSlug },
      });
    }

    if (!business && subscriberEmail) {
      business = await prisma.reviewBusiness.findFirst({
        where: { ownerEmail: subscriberEmail },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!business) {
      logger.warn(`Business not found for PayPal event ${eventType}`, "paypal_webhook_orphan", {
        slug: businessSlug,
        email: subscriberEmail,
      });
      // Return 200 so PayPal doesn't keep retrying unknown customers
      return NextResponse.json({ success: true, message: "No matching business found" });
    }

    // Handle Event Types
    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED" || eventType === "PAYMENT.SALE.COMPLETED") {
      const isAnnual =
        resource.amount?.value === "249.00" ||
        resource.plan_id?.includes("249") ||
        resource.plan_id?.includes("ANNUAL");

      await prisma.reviewBusiness.update({
        where: { id: business.id },
        data: {
          trialStatus: "SUBSCRIBED",
          subscriptionMethod: "PAYPAL",
          subscriptionPlan: isAnnual ? "ANNUAL_249" : "MONTHLY_30",
          subscriptionId: subscriptionId || business.subscriptionId,
          // Extend access (30 days or 365 days)
          trialEndsAt: new Date(Date.now() + (isAnnual ? 365 : 35) * 24 * 60 * 60 * 1000),
        },
      });

      logger.info(`Business ${business.slug} successfully upgraded to SUBSCRIBED via PayPal`, "paypal_subscription_active");
    } else if (
      eventType === "BILLING.SUBSCRIPTION.CANCELLED" ||
      eventType === "BILLING.SUBSCRIPTION.SUSPENDED"
    ) {
      await prisma.reviewBusiness.update({
        where: { id: business.id },
        data: {
          trialStatus: "CANCELLED",
        },
      });

      logger.info(`Business ${business.slug} subscription marked as CANCELLED`, "paypal_subscription_cancelled");
    }

    return NextResponse.json({ success: true, eventType, businessSlug: business.slug });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error("Failed to process PayPal webhook", "paypal_webhook_error", error);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "PayPal webhook listener is running. Send POST requests from PayPal Developer Portal.",
  });
}
