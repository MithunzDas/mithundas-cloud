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

    const cleanBizName = businessName.trim();
    const cleanEmail = ownerEmail.trim().toLowerCase();
    const cleanPlaceId = placeId ? (extractPlaceIdFromUrl(placeId) || placeId.trim()) : null;

    // PREVENT FREE TRIAL LOOPHOLE: Check if a business already exists for this placeId OR owner email + name
    let existingBusiness = null;

    if (cleanPlaceId) {
      existingBusiness = await prisma.reviewBusiness.findFirst({
        where: { placeId: cleanPlaceId },
        orderBy: { createdAt: "asc" }, // Primary/original registration
      });
    }

    if (!existingBusiness) {
      existingBusiness = await prisma.reviewBusiness.findFirst({
        where: {
          ownerEmail: { equals: cleanEmail, mode: "insensitive" },
          businessName: { equals: cleanBizName, mode: "insensitive" },
        },
        orderBy: { createdAt: "asc" },
      });
    }

    // If business already exists, DO NOT grant another free trial and DO NOT create duplicate slugs!
    if (existingBusiness) {
      const now = new Date();
      const isSubscribed = existingBusiness.trialStatus === "SUBSCRIBED";
      const isTrialExpired = existingBusiness.trialEndsAt <= now;

      // Ensure status is marked EXPIRED if trial time has elapsed
      if (isTrialExpired && !isSubscribed && existingBusiness.trialStatus !== "EXPIRED") {
        existingBusiness = await prisma.reviewBusiness.update({
          where: { id: existingBusiness.id },
          data: { trialStatus: "EXPIRED" },
        });
      }

      // Update owner phone or contact info if newly provided
      if (ownerPhone && !existingBusiness.ownerPhone) {
        existingBusiness = await prisma.reviewBusiness.update({
          where: { id: existingBusiness.id },
          data: { ownerPhone },
        });
      }

      return NextResponse.json({
        success: true,
        isExisting: true,
        trialExpired: isTrialExpired && !isSubscribed,
        isSubscribed,
        business: existingBusiness,
        reviewUrl: `/r/${existingBusiness.slug}`,
        standeeUrl: `/products/theqrbasedsystem/standee/${existingBusiness.slug}`,
        dashboardUrl: `/products/theqrbasedsystem/dashboard/${existingBusiness.slug}`,
        message: isSubscribed
          ? "This business profile is already active on a subscription plan."
          : isTrialExpired
          ? "Your 3-day free trial for this location has ended. Please log in to activate your plan and continue collecting reviews."
          : "Welcome back! Continuing your active 3-day free trial.",
      });
    }

    // Generate clean unique slug for NEW business
    let baseSlug = cleanBizName
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

    const googleReviewUrl = getGoogleReviewDeepLink(cleanPlaceId, cleanBizName, city);

    // 3-Day Free Trial (granted ONLY once for new locations)
    const trialEndsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const activationToken = crypto.randomBytes(16).toString("hex");

    const business = await prisma.reviewBusiness.create({
      data: {
        slug,
        businessName: cleanBizName,
        ownerEmail: cleanEmail,
        ownerName: ownerName ? ownerName.trim() : null,
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
      isExisting: false,
      trialExpired: false,
      isSubscribed: false,
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
