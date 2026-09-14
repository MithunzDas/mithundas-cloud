import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    const { slug } = await params;

    const business = await prisma.reviewBusiness.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        businessName: true,
        ownerEmail: true,
        trialStatus: true,
        trialEndsAt: true,
        subscriptionPlan: true,
        subscriptionMethod: true,
        totalScans: true,
        totalReviewsCopied: true,
      },
    });

    if (!business) {
      return NextResponse.json({ success: false, error: "Business not found" }, { status: 404 });
    }

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Run parallel counts for performance
    const [
      allTimeReviews,
      thisMonthReviews,
      prevMonthReviews,
      unresolvedPrivateFeedback,
    ] = await Promise.all([
      prisma.reviewSession.count({
        where: { businessId: business.id, copiedToClipboard: true },
      }),
      prisma.reviewSession.count({
        where: {
          businessId: business.id,
          copiedToClipboard: true,
          createdAt: { gte: startOfCurrentMonth },
        },
      }),
      prisma.reviewSession.count({
        where: {
          businessId: business.id,
          copiedToClipboard: true,
          createdAt: {
            gte: startOfPrevMonth,
            lt: startOfCurrentMonth,
          },
        },
      }),
      prisma.privateFeedback.count({
        where: { businessId: business.id, resolved: false },
      }),
    ]);

    // Compute month-over-month growth percentage
    let momGrowthPercent = 0;
    if (prevMonthReviews > 0) {
      momGrowthPercent = Math.round(((thisMonthReviews - prevMonthReviews) / prevMonthReviews) * 100);
    } else if (thisMonthReviews > 0) {
      momGrowthPercent = 100;
    }

    const effectiveTotalReviews = Math.max(allTimeReviews, business.totalReviewsCopied);
    const conversionRate = business.totalScans > 0
      ? Math.round((effectiveTotalReviews / business.totalScans) * 100)
      : 0;

    const msRemaining = new Date(business.trialEndsAt).getTime() - Date.now();
    const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

    return NextResponse.json({
      success: true,
      stats: {
        subscription: {
          plan: business.subscriptionPlan || "TRIAL",
          status: business.trialStatus,
          method: business.subscriptionMethod,
          trialEndsAt: business.trialEndsAt.toISOString(),
          daysRemaining,
          isSubscribed: business.trialStatus === "SUBSCRIBED",
        },
        reviews: {
          allTime: effectiveTotalReviews,
          thisMonth: thisMonthReviews,
          prevMonth: prevMonthReviews,
          momGrowthPercent,
          totalScans: business.totalScans,
          conversionRate,
          seoValueUsd: effectiveTotalReviews * 150,
        },
        privateFeedback: {
          unresolvedCount: unresolvedPrivateFeedback,
        },
      },
    });
  } catch (err) {
    console.error("Failed to compute dashboard stats:", err);
    return NextResponse.json({ success: false, error: "Failed to load stats" }, { status: 500 });
  }
}
