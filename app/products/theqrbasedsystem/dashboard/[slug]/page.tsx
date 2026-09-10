import { prisma } from "@/lib/db";
import DashboardClient from "./DashboardClient";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Business Dashboard | ${slug}`,
    description: "Real-time review analytics and QR standee management.",
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

  const businessData = {
    id: business.id,
    slug: business.slug,
    businessName: business.businessName,
    ownerEmail: business.ownerEmail,
    category: business.category,
    city: business.city,
    trialStatus: business.trialStatus,
    trialEndsAt: business.trialEndsAt.toISOString(),
    totalScans: business.totalScans,
    totalReviewsCopied: business.totalReviewsCopied,
    privateFeedbacks: business.privateFeedbacks?.map((f) => ({
      id: f.id,
      customerName: f.customerName,
      customerPhone: f.customerPhone,
      feedbackText: f.feedbackText,
      ratingScore: f.ratingScore,
      createdAt: f.createdAt.toISOString(),
    })),
  };

  return <DashboardClient business={businessData} />;
}
