import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

// In-memory booked slots store (persists across API requests in server instance)
interface BookedSlot {
  date: string;
  time: string;
  bookingId: string;
}

const bookedSlotsStore: BookedSlot[] = [
  // Example initial seed if needed
];

export async function GET() {
  return NextResponse.json({
    bookedSlots: bookedSlotsStore,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, businessType, projectRequirement, date, time, timeZone, meetUrl, bookingId } = body;

    if (!name || !email || !company || !date || !time) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
    }

    // Check for double booking conflict
    const isAlreadyBooked = bookedSlotsStore.some(
      (slot) => slot.date === date && slot.time === time
    );

    if (isAlreadyBooked) {
      return NextResponse.json(
        { error: "This time slot has already been booked by another client. Please select another slot." },
        { status: 409 }
      );
    }

    // Store booked slot
    const newBooking: BookedSlot = {
      date,
      time,
      bookingId: bookingId || `INV-${Date.now().toString().slice(-6)}`,
    };
    bookedSlotsStore.push(newBooking);

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

    // Pass booking payload to dedicated n8n booking webhook
    const n8nBookingWebhookUrl = process.env.N8N_BOOKING_WEBHOOK_URL || "https://n8n.mithundas.cloud/webhook/meeting-booked";

    try {
      await fetch(n8nBookingWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "meeting_booked",
          bookingId: newBooking.bookingId,
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
        }),
      });
    } catch (e: any) {
      logger.warn("Failed to dispatch to n8n booking webhook, proceeding locally", "booking_n8n_webhook_warn", { message: String(e) });
    }

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
