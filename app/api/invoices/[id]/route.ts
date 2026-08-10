import { NextRequest, NextResponse } from "next/server";
import { getInvoiceFromDB } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id;
    if (!invoiceId) {
      return NextResponse.json({ success: false, error: "Missing invoice ID" }, { status: 400 });
    }

    const invoice = await getInvoiceFromDB(invoiceId);
    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    let parsedCustomMethods = {};
    if (invoice.customPaymentMethods) {
      try {
        parsedCustomMethods = JSON.parse(invoice.customPaymentMethods);
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      invoice: {
        ...invoice,
        customPaymentMethods: parsedCustomMethods,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch invoice details", "invoice_get_error", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
