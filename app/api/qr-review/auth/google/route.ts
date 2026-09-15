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
    const { credential, accessToken } = body;

    let email = body.email;
    let name = body.name;
    let picture = body.picture;

    // Option A: If Google Access Token provided (via google.accounts.oauth2.initTokenClient)
    if (accessToken) {
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (userInfoRes.ok) {
        const profile = await userInfoRes.json();
        email = profile.email;
        name = profile.name || name;
        picture = profile.picture || picture;
      } else {
        logger.warn("Google accessToken verification failed", "google_token_invalid");
      }
    }
    // Option B: If Google ID Token credential provided (via Google One-Tap)
    else if (credential) {
      const googleRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
      );
      if (googleRes.ok) {
        const payload = await googleRes.json();
        email = payload.email;
        name = payload.name || name;
        picture = payload.picture || picture;
      }
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid Google email could not be verified." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find all businesses matching this owner's email (case-insensitive)
    const businesses = await prisma.reviewBusiness.findMany({
      where: {
        ownerEmail: { equals: cleanEmail, mode: "insensitive" },
      },
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
    const token = signOwnerToken({ email: cleanEmail, name });
    await setOwnerSessionCookie(token);

    logger.info(`Owner logged in via Google: ${cleanEmail}`, "google_auth_success", {
      businessCount: businesses.length,
    });

    return NextResponse.json({
      success: true,
      message: "Google authentication successful",
      owner: {
        email: cleanEmail,
        name,
        picture,
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
