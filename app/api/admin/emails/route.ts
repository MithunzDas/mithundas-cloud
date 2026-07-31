import { NextResponse } from "next/server";
import { getEmailLogs } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-secret");

    if (!env.ADMIN_AUTH_SECRET || authHeader !== env.ADMIN_AUTH_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId") || undefined;

    const emailLogs = await getEmailLogs(leadId);

    return NextResponse.json({
      success: true,
      emailLogs,
    });
  } catch (error) {
    logger.error("Failed to fetch email logs", "admin_email_logs_error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
