import { prisma } from "@/lib/db";
import DashboardClient from "./DashboardClient";
import { Metadata } from "next";
import { getOwnerSession } from "@/lib/qr-review/auth-session";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Business Dashboard | ${slug}`,
    description: "Real-time review analytics, growth stats, and QR standee management.",
  };
}

export default async function DashboardPage({ params }: PageProps) {
  const { slug } = await params;

  let business = null;
  try {
    business = await prisma.reviewBusiness.findUnique({
      where: { slug },
      include: {
        privateFeedbacks: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });
  } catch (err) {
    console.error("Failed to query business dashboard:", err);
  }

  // Fallback demo data if testing with an unsaved slug
  if (!business) {
    const formattedName = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    business = {
      id: "demo-id",
      slug,
      businessName: formattedName || "Apex Dental Studio",
      ownerEmail: "owner@demo.com",
      category: "DENTIST",
      city: "London / New York",
      trialStatus: "TRIAL_ACTIVE",
      trialEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      totalScans: 28,
      totalReviewsCopied: 19,
      privateFeedbacks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      country: "US",
      placeId: null,
      googleReviewUrl: "https://google.com",
      logoUrl: null,
      primaryColor: "#2563eb",
      subscriptionPlan: null,
      subscriptionMethod: null,
      subscriptionId: null,
      customQuestions: null,
      activationToken: null,
    };
  }

  // Calculate real-time stats from ReviewSession table
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  let allTimeReviews = business.totalReviewsCopied;
  let thisMonthReviews = 0;
  let prevMonthReviews = 0;

  if (business.id !== "demo-id") {
    try {
      const [allCount, thisMonthCount, prevMonthCount] = await Promise.all([
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
      ]);
      allTimeReviews = Math.max(allCount, business.totalReviewsCopied);
      thisMonthReviews = thisMonthCount;
      prevMonthReviews = prevMonthCount;
    } catch (e) {
      console.error("Failed to query session counts:", e);
    }
  } else {
    thisMonthReviews = 14;
    prevMonthReviews = 5;
  }

  // Calculate Month-over-Month growth
  let momGrowthPercent = 0;
  if (prevMonthReviews > 0) {
    momGrowthPercent = Math.round(((thisMonthReviews - prevMonthReviews) / prevMonthReviews) * 100);
  } else if (thisMonthReviews > 0) {
    momGrowthPercent = 100;
  }

  const conversionRate = business.totalScans > 0
    ? Math.round((allTimeReviews / business.totalScans) * 100)
    : 0;

  const msRemaining = new Date(business.trialEndsAt).getTime() - Date.now();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  // Check authenticated owner session
  const session = await getOwnerSession();
  const isOwnerAuthenticated = session ? session.email === business.ownerEmail.toLowerCase() : false;

  let otherBusinesses: Array<{ slug: string; businessName: string; category: string }> = [];
  if (session && isOwnerAuthenticated) {
    try {
      const list = await prisma.reviewBusiness.findMany({
        where: { ownerEmail: session.email },
        select: { slug: true, businessName: true, category: true },
      });
      otherBusinesses = list.filter((b) => b.slug !== business.slug);
    } catch (err) {
      console.error("Failed to fetch owner businesses:", err);
    }
  }

  const businessData = {
    id: business.id,
    slug: business.slug,
    businessName: business.businessName,
    ownerEmail: business.ownerEmail,
    category: business.category,
    city: business.city,
    trialStatus: business.trialStatus,
    trialEndsAt: business.trialEndsAt.toISOString(),
    subscriptionPlan: business.subscriptionPlan,
    subscriptionMethod: business.subscriptionMethod,
    totalScans: business.totalScans,
    totalReviewsCopied: allTimeReviews,
    privateFeedbacks: business.privateFeedbacks?.map((f) => ({
      id: f.id,
      customerName: f.customerName,
      customerPhone: f.customerPhone,
      feedbackText: f.feedbackText,
      ratingScore: f.ratingScore,
      createdAt: f.createdAt.toISOString(),
    })),
  };

  const initialStats = {
    allTimeReviews,
    thisMonthReviews,
    prevMonthReviews,
    momGrowthPercent,
    conversionRate,
    daysRemaining,
    isSubscribed: business.trialStatus === "SUBSCRIBED",
    subscriptionPlan: business.subscriptionPlan,
  };

  const initialAuth = {
    isAuthenticated: isOwnerAuthenticated,
    email: session?.email,
    name: session?.name,
    otherBusinesses,
  };

  return (
    <DashboardClient
      business={businessData}
      initialStats={initialStats}
      initialAuth={initialAuth}
    />
  );
}

