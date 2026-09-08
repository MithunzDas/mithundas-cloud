import { NextRequest, NextResponse } from "next/server";
import { getBookingDetails } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const booking = await getBookingDetails(bookingId);
    if (!booking) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({
      found: true,
      bookingId: booking.bookingId,
      name: booking.name,
      email: booking.email,
      company: booking.company,
      date: booking.date,
      time: booking.time,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}
