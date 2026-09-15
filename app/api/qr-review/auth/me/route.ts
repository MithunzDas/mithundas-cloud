import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/qr-review/auth-session";
import { prisma } from "@/lib/db";

/**
 * GET /api/qr-review/auth/me
 * Returns current authenticated owner information and their clinics.
 */
export async function GET() {
  try {
    const session = await getOwnerSession();

    if (!session) {
      return NextResponse.json({ authenticated: false, owner: null });
    }

    const businesses = await prisma.reviewBusiness.findMany({
      where: { ownerEmail: session.email },
      select: {
        id: true,
        slug: true,
        businessName: true,
        category: true,
        city: true,
        trialStatus: true,
        trialEndsAt: true,
        subscriptionPlan: true,
        subscriptionMethod: true,
        totalScans: true,
        totalReviewsCopied: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      authenticated: true,
      owner: {
        email: session.email,
        name: session.name,
        picture: session.picture,
        businesses,
      },
    });
  } catch (err) {
    console.error("Error in /api/qr-review/auth/me:", err);
    return NextResponse.json({ authenticated: false, owner: null }, { status: 500 });
  }
}
