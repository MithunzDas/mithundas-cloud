import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "qr_owner_token";
const SECRET_KEY =
  process.env.SESSION_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  process.env.LEMON_SQUEEZY_WEBHOOK_SECRET ||
  "mithun-das-qr-review-secret-2026-auth-token";

export interface OwnerSessionPayload {
  email: string;
  name?: string;
  picture?: string;
  exp: number; // Unix timestamp in seconds
}

/**
 * Signs a payload into a secure HMAC-SHA256 token: base64(payload).base64(hmac)
 */
export function signOwnerToken(payload: { email: string; name?: string; picture?: string }): string {
  // 30-day session expiry
  const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const fullPayload: OwnerSessionPayload = {
    email: payload.email.trim().toLowerCase(),
    name: payload.name?.trim(),
    picture: payload.picture?.trim(),
    exp,
  };

  const payloadString = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payloadString)
    .digest("base64url");

  return `${payloadString}.${signature}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 session token
 */
export function verifyOwnerToken(token: string): OwnerSessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadString, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(payloadString)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: OwnerSessionPayload = JSON.parse(
      Buffer.from(payloadString, "base64url").toString("utf-8")
    );

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Sets the owner session cookie on the response
 */
export async function setOwnerSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

/**
 * Reads and verifies the current owner session from request cookies
 */
export async function getOwnerSession(): Promise<OwnerSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyOwnerToken(token);
  } catch {
    return null;
  }
}

/**
 * Clears the owner session cookie
 */
export async function clearOwnerSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
