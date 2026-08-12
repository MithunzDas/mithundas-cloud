import { NextRequest, NextResponse } from "next/server";
import { getInvoiceFromDB } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json({ success: false, error: "Missing invoiceId" }, { status: 400 });
    }

    const invoice = await getInvoiceFromDB(invoiceId);
    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    const rawTotal = parseFloat((invoice.totalAmount || "").replace(/[^0-9.]/g, "")) || 0;
    const depPct = parseFloat((invoice.depositPercent || "50").replace(/[^0-9.]/g, "")) || 50;
    const setupFeeNum = parseFloat((invoice.setupFee || "").replace(/[^0-9.]/g, "")) || 0;

    // Upfront Deposit Payable = (% of Project Fee) + (Fixed Setup Fee)
    const baseDeposit = rawTotal * (depPct / 100);
    const totalUpfrontPayable = baseDeposit + setupFeeNum;
    const amountInCents = Math.round(totalUpfrontPayable * 100);

    const stripeSecretKey = env.STRIPE_SECRET_KEY;
    const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://mithundas.cloud";

    if (!stripeSecretKey) {
      // Demo Mode response if Stripe keys are not configured yet
      return NextResponse.json({
        success: true,
        demoMode: true,
        message: "Stripe demo mode. Add STRIPE_SECRET_KEY to enable live checkout.",
        checkoutUrl: `${siteUrl}/invoice/${invoiceId}?status=success&demo=stripe`,
      });
    }

    // Call Stripe REST API to create a Checkout Session
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", `${siteUrl}/invoice/${invoiceId}?status=success&session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${siteUrl}/invoice/${invoiceId}?status=cancelled`);
    params.append("client_reference_id", invoiceId);
    params.append("customer_email", invoice.clientEmail);

    params.append("line_items[0][price_data][currency]", (invoice.currency || "USD").toLowerCase());
    params.append("line_items[0][price_data][product_data][name]", `Initial Deposit (${depPct}%) — ${invoice.companyName}`);
    params.append("line_items[0][price_data][product_data][description]", `Invoice ${invoice.invoiceId}: ${invoice.projectScope}`);
    params.append("line_items[0][price_data][unit_amount]", amountInCents.toString());
    params.append("line_items[0][quantity]", "1");

    params.append("metadata[invoiceId]", invoice.invoiceId);
    params.append("metadata[clientName]", invoice.clientName);
    params.append("metadata[companyName]", invoice.companyName);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${stripeSecretKey}`,
      },
      body: params.toString(),
    });

    if (res.ok) {
      const session = await res.json();
      logger.info(`Created Stripe Checkout Session ${session.id} for invoice ${invoiceId}`, "stripe_session_created");
      return NextResponse.json({
        success: true,
        sessionId: session.id,
        checkoutUrl: session.url,
      });
    } else {
      const err = await res.json();
      logger.error("Stripe Checkout Session creation failed", "stripe_error", err);
      return NextResponse.json({ success: false, error: err.error?.message || "Failed to create Stripe session" }, { status: 400 });
    }
  } catch (error) {
    logger.error("Failed to create Stripe Checkout Session", "stripe_create_error", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
