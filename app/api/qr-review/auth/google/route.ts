import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signOwnerToken, setOwnerSessionCookie } from "@/lib/qr-review/auth-session";
import { logger } from "@/lib/logger";

/**
 * POST /api/qr-review/auth/google
 * Body: { credential: string } - Google ID Token from Google One Tap / GIS
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential } = body;

    if (!credential || typeof credential !== "string") {
      return NextResponse.json(
        { success: false, error: "Google credential token is required." },
        { status: 400 }
      );
    }

    // Verify token directly with Google's public tokeninfo endpoint
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );

    if (!googleRes.ok) {
      logger.warn("Invalid Google token provided", "google_auth_failed");
      return NextResponse.json(
        { success: false, error: "Google authentication failed. Invalid token." },
        { status: 401 }
      );
    }

    const payload = await googleRes.json();
    const email = payload.email?.trim().toLowerCase();
    const emailVerified = payload.email_verified === true || payload.email_verified === "true";
    const name = payload.name;

    if (!email || !emailVerified) {
      return NextResponse.json(
        { success: false, error: "Unverified Google account. Please use a verified email." },
        { status: 400 }
      );
    }

    // Find all businesses matching this owner's email
    const businesses = await prisma.reviewBusiness.findMany({
      where: { ownerEmail: email },
      select: {
        id: true,
        slug: true,
        businessName: true,
        category: true,
        trialStatus: true,
        trialEndsAt: true,
        subscriptionPlan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Sign session token and set HTTP-only cookie
    const token = signOwnerToken({ email, name });
    await setOwnerSessionCookie(token);

    logger.info(`Owner logged in via Google One-Tap: ${email}`, "google_auth_success", {
      businessCount: businesses.length,
    });

    return NextResponse.json({
      success: true,
      message: "Google authentication successful",
      owner: {
        email,
        name,
        picture: payload.picture,
        businesses,
      },
    });
  } catch (err) {
    logger.error("Error during Google authentication", "google_auth_error", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during Google sign-in." },
      { status: 500 }
    );
  }
}
