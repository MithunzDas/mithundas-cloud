import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { getBookedSlotsFromDB, saveBookingToDB } from "@/lib/db";

export async function GET() {
  try {
    const dbSlots = await getBookedSlotsFromDB();
    const normalize = (t: string) => (t || "").replace(/^0/, "").toUpperCase().trim();
    const uniqueSlots = Array.from(new Set(dbSlots.map((s) => `${s.date}_${normalize(s.time)}`)))
      .map((key) => dbSlots.find((s) => `${s.date}_${normalize(s.time)}` === key)!);

    return NextResponse.json({ bookedSlots: uniqueSlots });
  } catch (error) {
    return NextResponse.json({ bookedSlots: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, businessType, projectRequirement, date, time, timeZone, meetUrl, bookingId } = body;

    if (!name || !email || !company || !date || !time) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
    }

    const normalize = (t: string) => (t || "").replace(/^0/, "").toUpperCase().trim();
    const requestedTimeNorm = normalize(time);

    // Slot availability check against DB/local cache
    try {
      const dbSlots = await getBookedSlotsFromDB();
      const isDBConflict = dbSlots.some(
        (slot) => slot.date === date && normalize(slot.time) === requestedTimeNorm
      );
      if (isDBConflict) {
        return NextResponse.json(
          { error: "This time slot has already been booked by another client. Please select another slot." },
          { status: 409 }
        );
      }
    } catch (dbCheckErr) {
      logger.warn("DB slot check failed, proceeding with booking", "db_slot_check_warn");
    }

    // Assign booking ID
    const assignedBookingId = bookingId || `INV-${Date.now().toString().slice(-6)}`;
    const assignedMeetUrl = meetUrl || `https://mithundas.cloud/meet/${assignedBookingId}`;

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

    // ===== STEP 1: FIRE N8N WEBHOOKS FIRST (highest priority) =====
    const sanitizeUrl = (url?: string) => (url || "").replace("n8n.mithundas.cloud", "n8n.srv1594654.hstgr.cloud");

    const directWebhookUrl = "https://n8n.srv1594654.hstgr.cloud/webhook/meeting-booked";
    const n8nBookingWebhookUrl = sanitizeUrl(process.env.N8N_BOOKING_WEBHOOK_URL) || directWebhookUrl;
    const n8nTestWebhookUrl = "https://n8n.srv1594654.hstgr.cloud/webhook-test/meeting-booked";

    const webhookPayload = JSON.stringify({
      event: "meeting_booked",
      source: "custom_booking_page",
      bookingId: assignedBookingId,
      leadId: assignedBookingId,
      name,
      email,
      company,
      businessType: businessType || "General",
      projectRequirement,
      date,
      time,
      timeZone,
      meetUrl: assignedMeetUrl,
      hostEmail: "mithun.here01@gmail.com",
      bookedAt: new Date().toISOString(),
      meetingStartISO,
    });

    // Dispatch to all n8n meeting webhook URLs in parallel
    const webhookUrlsToHit = Array.from(new Set([directWebhookUrl, n8nBookingWebhookUrl, n8nTestWebhookUrl]));
    const webhookResults = await Promise.allSettled(
      webhookUrlsToHit.map((url) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: webhookPayload,
        }).then(async (res) => {
          const status = res.status;
          logger.info(`Webhook dispatch to ${url} → HTTP ${status}`, "booking_n8n_webhook_status");
          return { url, status };
        })
      )
    );

    // Log webhook results
    for (const result of webhookResults) {
      if (result.status === "rejected") {
        logger.warn(`Webhook dispatch failed: ${String(result.reason)}`, "booking_n8n_webhook_err");
      }
    }

    // ===== STEP 2: SAVE TO DB (background, non-blocking for response) =====
    saveBookingToDB({
      bookingId: assignedBookingId,
      name,
      email,
      company,
      businessType: businessType || "General",
      projectRequirement: projectRequirement || "",
      date,
      time,
      timeZone: timeZone || "Asia/Kolkata",
      meetUrl: assignedMeetUrl,
    }).catch((e) => logger.warn("Failed to persist booking in DB", "booking_db_warn", { message: String(e) }));

    // ===== STEP 3: RETURN SUCCESS =====
    return NextResponse.json({
      success: true,
      message: "Discovery session booked successfully!",
      booking: {
        bookingId: assignedBookingId,
        name,
        email,
        company,
        date,
        time,
        timeZone,
        meetUrl: assignedMeetUrl,
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
