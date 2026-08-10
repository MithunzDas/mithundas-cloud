import { NextRequest, NextResponse } from "next/server";
import { updateInvoiceStatusInDB, getInvoiceFromDB } from "@/lib/db";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, status, secret } = body;

    // Optional admin secret verification for manual updates or webhook secret
    const expectedSecret = env.ADMIN_AUTH_SECRET || "mithundas_admin_secret_2026";
    const authHeader = req.headers.get("x-admin-secret");

    if (secret !== expectedSecret && authHeader !== expectedSecret) {
      logger.warn("Unauthorized attempt to update payment status", "payment_webhook_auth_failed");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!invoiceId || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields (invoiceId, status)" }, { status: 400 });
    }

    const validStatuses = ["unpaid", "deposit_paid", "paid_in_full"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    const updated = await updateInvoiceStatusInDB(invoiceId, status, new Date());
    if (!updated) {
      return NextResponse.json({ success: false, error: "Invoice not found or update failed" }, { status: 404 });
    }

    logger.info(`Invoice ${invoiceId} payment status updated to: ${status}`, "payment_status_updated");

    return NextResponse.json({
      success: true,
      message: `Invoice ${invoiceId} status successfully updated to ${status}`,
      invoiceId,
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Failed to process payment webhook", "payment_webhook_error", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
