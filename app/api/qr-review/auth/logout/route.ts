import { NextResponse } from "next/server";
import { clearOwnerSessionCookie } from "@/lib/qr-review/auth-session";

/**
 * POST /api/qr-review/auth/logout
 * Clears the owner session cookie.
 */
export async function POST() {
  await clearOwnerSessionCookie();
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set("qr_owner_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  try {
    response.cookies.delete("qr_owner_token");
  } catch {}
  return response;
}
