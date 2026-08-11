import { NextRequest, NextResponse } from "next/server";
import { getFinancialLedger, recordPaymentTransaction, getInvoiceFromDB, PaymentTransactionPayload } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-admin-secret");
    const expectedSecret = env.ADMIN_AUTH_SECRET || "mithundas_admin_secret_2026";

    if (authHeader !== expectedSecret) {
      return NextResponse.json({ success: false, error: "Unauthorized access to financial ledger" }, { status: 401 });
    }

    const ledger = await getFinancialLedger();

    return NextResponse.json({
      success: true,
      metrics: ledger.metrics,
      invoices: ledger.invoices,
      transactions: ledger.transactions,
    });
  } catch (error) {
    logger.error("Failed to fetch financial ledger", "finance_get_error", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      invoiceId,
      amount,
      paymentMethod = "upi",
      utrOrReference = "",
      notes = "",
      clientName = "",
      clientEmail = "",
    } = body;

    if (!invoiceId || !amount) {
      return NextResponse.json({ success: false, error: "Missing required fields (invoiceId, amount)" }, { status: 400 });
    }

    const invoice = await getInvoiceFromDB(invoiceId);

    const transactionId = `TXN-${Date.now().toString().slice(-6)}`;
    const isAutoVerified = paymentMethod === "stripe" || paymentMethod === "razorpay";

    const txnPayload: PaymentTransactionPayload = {
      transactionId,
      invoiceId,
      clientName: clientName || invoice?.clientName || "Client",
      clientEmail: clientEmail || invoice?.clientEmail || "",
      companyName: invoice?.companyName || "Business",
      amount: parseFloat(String(amount)),
      currency: invoice?.currency || "USD",
      currencySymbol: invoice?.currencySymbol || "$",
      paymentMethod,
      utrOrReference,
      verificationStatus: isAutoVerified ? "verified" : "pending",
      notes,
      createdAt: new Date().toISOString(),
      verifiedBy: isAutoVerified ? "Payment Gateway (Auto)" : undefined,
      verifiedAt: isAutoVerified ? new Date().toISOString() : undefined,
    };

    await recordPaymentTransaction(txnPayload);

    logger.info(`Recorded ${txnPayload.verificationStatus} payment ${transactionId} for ${invoiceId}`, "payment_recorded");

    return NextResponse.json({
      success: true,
      message: isAutoVerified ? "Payment automatically verified" : "Payment reference submitted for admin verification",
      transaction: txnPayload,
    });
  } catch (error) {
    logger.error("Failed to record payment transaction", "finance_post_error", error);
    return NextResponse.json({ success: false, error: "Failed to record payment" }, { status: 500 });
  }
}
