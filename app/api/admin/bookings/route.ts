import { NextResponse } from "next/server";
import { getAllBookingsFromDB } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-secret");
    
    // Auth validation using configured admin secret with fallback
    const expectedSecret = env.ADMIN_AUTH_SECRET || "mithundas_admin_secret_2026";
    if (authHeader !== expectedSecret) {
      logger.warn("Unauthorized access attempt to admin bookings API", "admin_bookings_auth_failed");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const bookings = await getAllBookingsFromDB();

    // Summary metrics calculation
    const totalBookings = bookings.length;
    const confirmedCount = bookings.filter((b) => b.status === "confirmed" || !b.status).length;
    const rescheduledCount = bookings.filter((b) => b.status === "rescheduled").length;
    const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

    return NextResponse.json({
      success: true,
      metrics: {
        totalBookings,
        confirmedCount,
        rescheduledCount,
        cancelledCount,
      },
      bookings,
    });
  } catch (error) {
    logger.error("Failed to fetch admin bookings list", "admin_bookings_get_error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
