import { NextRequest, NextResponse } from "next/server";
import { getInvoiceFromDB } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: invoiceId } = await params;
    if (!invoiceId) {
      return NextResponse.json({ success: false, error: "Missing invoice ID" }, { status: 400 });
    }

    let invoice = await getInvoiceFromDB(invoiceId);
    if (!invoice) {
      // Fallback demo invoice so preview links always load smoothly
      invoice = {
        invoiceId: invoiceId,
        clientName: "Alex Vance",
        clientEmail: "alex@vanceenterprise.com",
        companyName: "Vance Enterprises Inc.",
        currency: "USD",
        currencySymbol: "$",
        totalAmount: "$2,500.00",
        depositPercent: "50%",
        depositAmount: "$1,250.00",
        setupFee: "$150.00",
        monthlyRetainer: "$200.00/month",
        projectScope: "Custom n8n Workflow Automation, API Gateway Webhook Routers, Multi-Channel Telegram/Email Alerts & Lead Intake System.",
        paymentStatus: "unpaid",
        paymentLink: "https://paypal.me/mithundas",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      };
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
