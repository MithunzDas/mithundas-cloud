import { NextRequest, NextResponse } from "next/server";
import { cancelBookingInDB } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, reason } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Mark as cancelled in database
    const success = await cancelBookingInDB(bookingId);

    if (!success) {
      return NextResponse.json({ error: "Failed to cancel booking or booking not found" }, { status: 404 });
    }

    // Dispatch cancellation event to n8n
    const rawCancelUrl = process.env.N8N_CANCEL_WEBHOOK_URL || "https://n8n.srv1594654.hstgr.cloud/webhook/meeting-cancelled";
    const n8nCancelWebhookUrl = rawCancelUrl.replace("n8n.mithundas.cloud", "n8n.srv1594654.hstgr.cloud");

    try {
      await fetch(n8nCancelWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "meeting_cancelled",
          bookingId,
          reason: reason || "Cancelled by host/admin",
          cancelledAt: new Date().toISOString(),
        }),
      });
    } catch (e: any) {
      logger.warn(`Failed to notify n8n cancellation webhook: ${String(e)}`, "booking_cancel_n8n_warn");
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${bookingId} has been cancelled and time slot re-opened for booking!`,
    });
  } catch (error) {
    logger.error("Failed to cancel booking", "booking_cancel_error", error);
    return NextResponse.json({ error: "Failed to process cancellation" }, { status: 500 });
  }
}
