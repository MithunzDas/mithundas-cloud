import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentTransaction, getInvoiceFromDB } from "@/lib/db";
import { sendPaymentReceiptEmail } from "@/services/email/resend";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-admin-secret");
    const expectedSecret = env.ADMIN_AUTH_SECRET || "mithundas_admin_secret_2026";

    if (authHeader !== expectedSecret) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { transactionId, adminNotes = "" } = body;

    if (!transactionId) {
      return NextResponse.json({ success: false, error: "Missing transactionId" }, { status: 400 });
    }

    const verifiedTxn = await verifyPaymentTransaction(transactionId, "Admin");
    if (!verifiedTxn) {
      return NextResponse.json({ success: false, error: "Transaction not found or verification failed" }, { status: 404 });
    }

    // Fetch updated invoice to calculate remaining balance & email client
    const invoice = await getInvoiceFromDB(verifiedTxn.invoiceId);
    let emailSent = false;

    if (invoice && invoice.clientEmail) {
      const sym = invoice.currencySymbol || "$";
      const totalRaw = parseFloat((invoice.totalAmount || "").replace(/[^0-9.]/g, "")) || 0;
      const recRaw = Number(invoice.receivedAmountNumeric) || 0;
      const remRaw = Math.max(0, totalRaw - recRaw);

      const paidFormatted = `${sym}${verifiedTxn.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const remFormatted = `${sym}${remRaw.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      emailSent = await sendPaymentReceiptEmail({
        toEmail: invoice.clientEmail,
        clientName: invoice.clientName,
        companyName: invoice.companyName,
        invoiceId: invoice.invoiceId,
        transactionId: verifiedTxn.transactionId,
        paidAmount: paidFormatted,
        paymentMethod: verifiedTxn.paymentMethod,
        utrOrReference: verifiedTxn.utrOrReference || undefined,
        remainingBalance: remFormatted,
        paidAtDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      });
    }

    logger.info(`Verified transaction ${transactionId}. Receipt email status: ${emailSent}`, "txn_verification_success");

    return NextResponse.json({
      success: true,
      message: `Transaction ${transactionId} verified and receipt email dispatched`,
      transaction: verifiedTxn,
      emailSent,
    });
  } catch (error) {
    logger.error("Failed to verify transaction", "finance_verify_error", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
