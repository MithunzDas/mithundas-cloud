import { NextResponse } from "next/server";
import { getLeads } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-secret");
    
    // Simple secure auth check
    if (!env.ADMIN_AUTH_SECRET || authHeader !== env.ADMIN_AUTH_SECRET) {
      logger.warn("Unauthorized access attempt to admin leads list API", "admin_auth_failed");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const leads = await getLeads();
    return NextResponse.json({
      success: true,
      leads,
    });
  } catch (error) {
    logger.error("Failed to fetch admin leads list", "admin_leads_get_error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
