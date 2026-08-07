import { NextRequest, NextResponse } from "next/server";
import { getBookedSlotsFromDB, saveBookingToDB, cancelBookingInDB } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, newDate, newTime, newTimeZone, reason } = body;

    if (!bookingId || !newDate || !newTime) {
      return NextResponse.json({ error: "Missing required reschedule parameters" }, { status: 400 });
    }

    const normalize = (t: string) => (t || "").replace(/^0/, "").toUpperCase().trim();
    const requestedNorm = normalize(newTime);

    // 1. Check if the new time slot is already booked by another client
    const existingSlots = await getBookedSlotsFromDB();
    const isConflict = existingSlots.some(
      (slot) => slot.bookingId !== bookingId && slot.date === newDate && normalize(slot.time) === requestedNorm
    );

    if (isConflict) {
      return NextResponse.json(
        { error: "The selected new time slot is already booked. Please choose another time." },
        { status: 409 }
      );
    }

    // 2. Free up the OLD booking slot in DB
    await cancelBookingInDB(bookingId);

    // 3. Save NEW booking slot in DB
    const meetUrl = `https://mithundas.cloud/meet/${bookingId}`;
    await saveBookingToDB({
      bookingId,
      name: body.name || "Client",
      email: body.email || "client@example.com",
      company: body.company || "Client Business",
      businessType: body.businessType || "General",
      projectRequirement: body.projectRequirement || "",
      date: newDate,
      time: newTime,
      timeZone: newTimeZone || "Asia/Kolkata",
      meetUrl,
      status: "confirmed",
    });

    // 4. Calculate new meeting start ISO timestamp
    let meetingStartISO = "";
    try {
      const [timeStr, modifier] = newTime.split(" ");
      let [hours, minutes] = timeStr.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      const istDate = new Date(`${newDate}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+05:30`);
      meetingStartISO = istDate.toISOString();
    } catch (e) {
      meetingStartISO = new Date().toISOString();
    }

    // 5. Dispatch reschedule webhook to n8n (both production & test mode)
    const n8nRescheduleWebhookUrl = process.env.N8N_RESCHEDULE_WEBHOOK_URL || "https://n8n.mithundas.cloud/webhook/meeting-rescheduled";
    const n8nRescheduleTestUrl = "https://n8n.mithundas.cloud/webhook-test/meeting-rescheduled";

    const reschedulePayload = JSON.stringify({
      event: "meeting_rescheduled",
      bookingId,
      newDate,
      newTime,
      newTimeZone: newTimeZone || "Asia/Kolkata",
      meetUrl,
      reason: reason || "Rescheduled by client/host",
      rescheduledAt: new Date().toISOString(),
      meetingStartISO,
    });

    const rescheduleUrlsToHit = Array.from(new Set([n8nRescheduleWebhookUrl, n8nRescheduleTestUrl]));
    await Promise.allSettled(
      rescheduleUrlsToHit.map((url) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: reschedulePayload,
        })
          .then((res) => {
            logger.info(`Reschedule webhook dispatch to ${url} returned status ${res.status}`, "reschedule_n8n_webhook_status");
          })
          .catch((e) => {
            logger.warn(`Failed to dispatch n8n reschedule webhook to ${url}: ${String(e)}`, "booking_reschedule_n8n_warn");
          })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Discovery Session successfully rescheduled!",
      booking: {
        bookingId,
        date: newDate,
        time: newTime,
        timeZone: newTimeZone || "Asia/Kolkata",
        meetUrl,
      },
    });
  } catch (error) {
    logger.error("Failed to process session rescheduling", "booking_reschedule_error", error);
    return NextResponse.json({ error: "Failed to process session rescheduling" }, { status: 500 });
  }
}
