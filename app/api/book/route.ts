import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, businessType, projectRequirement, date, time, timeZone, meetUrl, bookingId } = body;

    if (!name || !email || !company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Pass booking payload to n8n webhook or internal database handler
    const n8nWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL || "https://n8n.mithundas.cloud/webhook/lead-intake";

    try {
      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "custom_booking_page",
          leadId: bookingId || `INV-${Date.now().toString().slice(-6)}`,
          name,
          email,
          company,
          businessType: businessType || "General",
          projectRequirement: `[Discovery Call Scheduled for ${date} @ ${time} (${timeZone})] ${projectRequirement || ""}`,
          meetUrl,
          scheduledDate: date,
          scheduledTime: time,
          timeZone,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (e: any) {
      logger.warn("Failed to dispatch to n8n lead intake webhook, proceeding locally", "booking_n8n_webhook_warn", { message: String(e) });
    }

    return NextResponse.json({
      success: true,
      message: "Discovery session booked successfully!",
      booking: {
        bookingId,
        name,
        email,
        company,
        date,
        time,
        timeZone,
        meetUrl,
      },
    });
  } catch (error) {
    logger.error("Failed to process discovery booking", "booking_api_error", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
