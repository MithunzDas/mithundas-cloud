import { NextRequest, NextResponse } from "next/server";
import { getBookedSlotsFromDB } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, date, time } = body;

    if (!bookingId || !date || !time) {
      return NextResponse.json({ active: false, reason: "Missing required verification parameters" });
    }

    const normalize = (t: string) => (t || "").replace(/^0/, "").toUpperCase().trim();
    const targetNormTime = normalize(time);

    const activeSlots = await getBookedSlotsFromDB();

    // Check if this exact booking ID is still active for this date & time
    const isStillActive = activeSlots.some(
      (slot) => slot.bookingId === bookingId && slot.date === date && normalize(slot.time) === targetNormTime
    );

    return NextResponse.json({
      active: isStillActive,
      bookingId,
      date,
      time,
    });
  } catch (error) {
    logger.error("Failed to verify slot active status", "slot_verify_error", error);
    return NextResponse.json({ active: false, error: "Internal verification error" }, { status: 500 });
  }
}
