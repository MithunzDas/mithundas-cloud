import { NextResponse } from "next/server";
import { getMeetingSummaries } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-secret");

    if (!env.ADMIN_AUTH_SECRET || authHeader !== env.ADMIN_AUTH_SECRET) {
      logger.warn("Unauthorized access attempt to meeting summaries API", "admin_auth_failed");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const summaries = await getMeetingSummaries();
    return NextResponse.json({
      success: true,
      summaries,
    });
  } catch (error) {
    logger.error("Failed to fetch meeting summaries", "meeting_summaries_get_error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
