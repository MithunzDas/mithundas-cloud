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
    const amountInSubunits = Math.round(totalUpfrontPayable * 100); // Amount in paisa/cents

    const razorpayKeyId = env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpaySecret = env.RAZORPAY_KEY_SECRET;

    // If Razorpay API keys are configured, create order via Razorpay API
    if (razorpayKeyId && razorpaySecret) {
      try {
        const auth = Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString("base64");
        const res = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountInSubunits,
            currency: invoice.currency || "INR",
            receipt: invoice.invoiceId,
            notes: {
              clientName: invoice.clientName,
              companyName: invoice.companyName,
              invoiceId: invoice.invoiceId,
            },
          }),
        });

        if (res.ok) {
          const order = await res.json();
          return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: razorpayKeyId,
          });
        }
      } catch (err) {
        logger.warn("Razorpay API order creation failed, falling back to client checkout", "razorpay_order_warn", { err: String(err) });
      }
    }

    // Return order details for native checkout
    return NextResponse.json({
      success: true,
      amount: amountInSubunits,
      currency: invoice.currency || "INR",
      depositAmount: totalUpfrontPayable.toFixed(2),
      invoiceId: invoice.invoiceId,
      keyId: razorpayKeyId || "rzp_test_mithundas_agency",
    });
  } catch (error) {
    logger.error("Failed to initialize payment checkout order", "payment_order_error", error);
    return NextResponse.json({ success: false, error: "Failed to initialize payment order" }, { status: 500 });
  }
}
