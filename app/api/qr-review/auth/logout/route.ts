import { NextResponse } from "next/server";
import { clearOwnerSessionCookie } from "@/lib/qr-review/auth-session";

/**
 * POST /api/qr-review/auth/logout
 * Clears the owner session cookie.
 */
export async function POST() {
  await clearOwnerSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
