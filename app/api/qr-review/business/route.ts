import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getGoogleReviewDeepLink, extractPlaceIdFromUrl } from "@/lib/qr-review/google-places";
import crypto from "crypto";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    const business = await prisma.reviewBusiness.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            sessions: true,
            privateFeedbacks: true,
          },
        },
      },
    });

    if (!business) {
      return NextResponse.json({ success: false, error: "Business not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, business });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessName,
      ownerEmail,
      ownerName,
      ownerPhone,
      category = "DENTIST",
      placeId,
      city,
      country = "US",
    } = body;

    if (!businessName || !ownerEmail) {
      return NextResponse.json(
        { success: false, error: "Business name and owner email are required." },
        { status: 400 }
      );
    }

    // Generate clean unique slug
    let baseSlug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    if (!baseSlug) baseSlug = "biz";

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.reviewBusiness.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Generate clean Google Place ID & Review URL
    const cleanPlaceId = placeId ? (extractPlaceIdFromUrl(placeId) || placeId) : null;
    const googleReviewUrl = getGoogleReviewDeepLink(cleanPlaceId, businessName, city);

    // 3-Day Free Trial
    const trialEndsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const activationToken = crypto.randomBytes(16).toString("hex");

    const business = await prisma.reviewBusiness.create({
      data: {
        slug,
        businessName,
        ownerEmail,
        ownerName,
        ownerPhone: ownerPhone || null,
        category,
        placeId: cleanPlaceId,
        city,
        country,
        googleReviewUrl,
        trialStatus: "TRIAL_ACTIVE",
        trialEndsAt,
        activationToken,
      },
    });

    return NextResponse.json({
      success: true,
      business,
      reviewUrl: `/r/${business.slug}`,
      standeeUrl: `/products/theqrbasedsystem/standee/${business.slug}`,
      dashboardUrl: `/products/theqrbasedsystem/dashboard/${business.slug}`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
