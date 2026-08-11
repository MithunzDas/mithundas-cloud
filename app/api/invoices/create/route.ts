import { NextRequest, NextResponse } from "next/server";
import { saveInvoiceToDB, InvoicePayload } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-admin-secret");
    const expectedSecret = env.ADMIN_AUTH_SECRET || "mithundas_admin_secret_2026";
    
    // Optional secret check if called from admin panel, otherwise allow public generation if requested with token
    if (authHeader && authHeader !== expectedSecret) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      leadId,
      clientName,
      clientEmail,
      companyName,
      currency = "USD",
      currencySymbol = "$",
      totalAmount,
      depositPercent = "50",
      setupFee = "",
      monthlyRetainer = "",
      projectScope,
      paymentLink = "",
      customPaymentMethods = {},
      dueDate,
    } = body;

    if (!clientName || !clientEmail || !companyName || !totalAmount || !projectScope) {
      return NextResponse.json(
        { success: false, error: "Missing required invoice fields (clientName, clientEmail, companyName, totalAmount, projectScope)" },
        { status: 400 }
      );
    }

    const invoiceId = body.invoiceId || `INV-${Date.now().toString().slice(-6)}`;
    const numericTotal = parseFloat(String(totalAmount).replace(/[^0-9.]/g, "")) || 0;
    const numericDepositPct = parseFloat(String(depositPercent).replace(/[^0-9.]/g, "")) || 50;
    const calculatedDeposit = (numericTotal * (numericDepositPct / 100)).toFixed(2);
    const formattedDeposit = `${currencySymbol}${calculatedDeposit}`;

    const issueDateStr = new Date().toISOString().split("T")[0];
    const dueDateStr = dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const invoicePayload: InvoicePayload = {
      invoiceId,
      leadId,
      clientName,
      clientEmail,
      companyName,
      currency,
      currencySymbol,
      totalAmount: `${currencySymbol}${numericTotal.toFixed(2)}`,
      depositPercent: `${numericDepositPct}%`,
      depositAmount: formattedDeposit,
      setupFee: setupFee ? (setupFee.includes(currencySymbol) ? setupFee : `${currencySymbol}${setupFee}`) : undefined,
      monthlyRetainer: monthlyRetainer ? (monthlyRetainer.includes(currencySymbol) ? monthlyRetainer : `${currencySymbol}${monthlyRetainer}`) : undefined,
      projectScope,
      paymentStatus: "unpaid",
      paymentLink,
      customPaymentMethods: JSON.stringify(customPaymentMethods),
      issueDate: issueDateStr,
      dueDate: dueDateStr,
    };

    await saveInvoiceToDB(invoicePayload);

    const digitalInvoiceUrl = `https://mithundas.cloud/invoice/${invoiceId}`;

    // Trigger n8n onboarding webhook
    const n8nWebhookUrl = "https://n8n.srv1594654.hstgr.cloud/webhook/onboarding-trigger";
    const webhookPayload = {
      event: "customer.onboarded",
      // Keys expected by n8n workflow nodes ($json.body.email, $json.body.name, etc.)
      email: clientEmail,
      name: clientName,
      company: companyName,
      invoiceAmount: invoicePayload.totalAmount,
      // Alias fields for full compatibility
      clientEmail,
      clientName,
      companyName,
      toEmail: clientEmail,
      to: clientEmail,
      invoiceId,
      leadId,
      currency,
      currencySymbol,
      totalAmount: invoicePayload.totalAmount,
      depositPercent: invoicePayload.depositPercent,
      depositAmount: invoicePayload.depositAmount,
      setupFee: invoicePayload.setupFee || "",
      monthlyRetainer: invoicePayload.monthlyRetainer || "",
      projectScope,
      startDate: body.startDate || issueDateStr,
      invoiceUrl: digitalInvoiceUrl,
      paymentLink: paymentLink || digitalInvoiceUrl,
      timestamp: new Date().toISOString(),
    };

    try {
      const webhookRes = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload),
      });
      logger.info(
        `n8n onboarding webhook triggered for ${invoiceId} — status: ${webhookRes.status}`,
        "n8n_onboarding_webhook_sent"
      );
    } catch (webhookErr) {
      logger.error("Failed to trigger n8n onboarding webhook", "n8n_onboarding_webhook_error", webhookErr);
    }

    logger.info(`Generated invoice ${invoiceId} for ${companyName}`, "invoice_created");

    return NextResponse.json({
      success: true,
      message: "Invoice successfully created & onboarding package dispatched",
      invoice: invoicePayload,
      invoiceUrl: digitalInvoiceUrl,
    });
  } catch (error) {
    logger.error("Failed to create invoice", "invoice_create_error", error);
    return NextResponse.json(
      { success: false, error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
