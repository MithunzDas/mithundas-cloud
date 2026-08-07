import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getBookedSlotsFromDB, saveBookingToDB } from "@/lib/db";

// In-memory booked slots store (persists across API requests in server instance)
interface BookedSlot {
  date: string;
  time: string;
  bookingId: string;
}

const bookedSlotsStore: BookedSlot[] = [];

export async function GET() {
  const dbSlots = await getBookedSlotsFromDB();
  const allSlots = [...bookedSlotsStore, ...dbSlots];
  const uniqueSlots = Array.from(new Set(allSlots.map((s) => `${s.date}_${s.time}`)))
    .map((key) => allSlots.find((s) => `${s.date}_${s.time}` === key)!);

  return NextResponse.json({
    bookedSlots: uniqueSlots,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, businessType, projectRequirement, date, time, timeZone, meetUrl, bookingId } = body;

    if (!name || !email || !company || !date || !time) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
    }

    const dbSlots = await getBookedSlotsFromDB();
    const allSlots = [...bookedSlotsStore, ...dbSlots];

    // Check for double booking conflict (with normalized time string comparison)
    const normalize = (t: string) => (t || "").replace(/^0/, "").toUpperCase().trim();
    const requestedTimeNorm = normalize(time);

    const isAlreadyBooked = allSlots.some(
      (slot) => slot.date === date && normalize(slot.time) === requestedTimeNorm
    );

    if (isAlreadyBooked) {
      return NextResponse.json(
        { error: "This time slot has already been booked by another client. Please select another slot." },
        { status: 409 }
      );
    }

    const assignedBookingId = bookingId || `INV-${Date.now().toString().slice(-6)}`;
    const newBooking: BookedSlot = {
      date,
      time,
      bookingId: assignedBookingId,
    };
    bookedSlotsStore.push(newBooking);

    // Save to Database persistently
    await saveBookingToDB({
      bookingId: assignedBookingId,
      name,
      email,
      company,
      businessType: businessType || "General",
      projectRequirement: projectRequirement || "",
      date,
      time,
      timeZone: timeZone || "Asia/Kolkata",
      meetUrl: meetUrl || `https://mithundas.cloud/meet/${assignedBookingId}`,
    }).catch((e) => logger.warn("Failed to persist booking in DB", "booking_db_warn", { message: String(e) }));

    // Calculate meeting start ISO timestamp from date + time (IST)
    let meetingStartISO = "";
    try {
      const [timeStr, modifier] = time.split(" ");
      let [hours, minutes] = timeStr.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      const istDate = new Date(`${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+05:30`);
      meetingStartISO = istDate.toISOString();
    } catch (e) {
      meetingStartISO = new Date().toISOString();
    }

    // Pass booking payload to n8n booking webhooks (both production & test mode)
    const n8nBookingWebhookUrl = process.env.N8N_BOOKING_WEBHOOK_URL || "https://n8n.mithundas.cloud/webhook/meeting-booked";
    const n8nTestWebhookUrl = "https://n8n.mithundas.cloud/webhook-test/meeting-booked";
    const n8nLeadWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL || "https://n8n.mithundas.cloud/webhook/lead-intake";

    const webhookPayload = JSON.stringify({
      event: "meeting_booked",
      source: "custom_booking_page",
      bookingId: newBooking.bookingId,
      leadId: newBooking.bookingId,
      name,
      email,
      company,
      businessType: businessType || "General",
      projectRequirement,
      date,
      time,
      timeZone,
      meetUrl,
      hostEmail: "mithun.here01@gmail.com",
      bookedAt: new Date().toISOString(),
      meetingStartISO,
    });

    // Fire webhook side-effects in parallel
    const webhookUrlsToHit = Array.from(new Set([n8nBookingWebhookUrl, n8nTestWebhookUrl, n8nLeadWebhookUrl]));
    const webhookPromises = webhookUrlsToHit.map((url) =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: webhookPayload,
      })
        .then((res) => {
          logger.info(`Booking webhook dispatch to ${url} returned status ${res.status}`, "booking_n8n_webhook_status");
        })
        .catch((e) => {
          logger.warn(`Failed to dispatch to booking webhook ${url}`, "booking_n8n_webhook_err", { message: String(e) });
        })
    );

    await Promise.allSettled(webhookPromises);

    return NextResponse.json({
      success: true,
      message: "Discovery session booked successfully!",
      booking: {
        bookingId: newBooking.bookingId,
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
