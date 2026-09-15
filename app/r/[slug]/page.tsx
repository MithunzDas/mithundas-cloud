import { prisma } from "@/lib/db";
import ReviewClient from "./ReviewClient";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Leave a Quick Review | ${slug.replace(/-/g, " ")}`,
    description: "Share your experience in 15 seconds with Google Review Assistant.",
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;

  // Attempt to fetch business from database
  let business = null;
  try {
    business = await prisma.reviewBusiness.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        businessName: true,
        category: true,
        city: true,
        country: true,
        placeId: true,
        googleReviewUrl: true,
        logoUrl: true,
        trialStatus: true,
        trialEndsAt: true,
      },
    });
  } catch (err) {
    console.error("Failed to query business by slug:", err);
  }

  // If no record exists yet, provide an interactive live demo clinic
  if (!business) {
    const formattedName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    business = {
      id: "demo-id",
      slug,
      businessName: formattedName || "Apex Dental & Wellness Studio",
      category: "DENTIST",
      city: "London / New York",
      country: "US",
      placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
      googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
      logoUrl: null,
      trialStatus: "TRIAL_ACTIVE",
      trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
  }

  const now = new Date();
  const isSubscribed = business.trialStatus === "SUBSCRIBED";
  const isTrialExpired = Boolean(
    business.id !== "demo-id" &&
    !isSubscribed &&
    business.trialEndsAt &&
    new Date(business.trialEndsAt) <= now
  );

  // Sync EXPIRED status to DB if trial ended
  if (isTrialExpired && business.id !== "demo-id" && business.trialStatus !== "EXPIRED") {
    try {
      await prisma.reviewBusiness.update({
        where: { id: business.id },
        data: { trialStatus: "EXPIRED" },
      });
    } catch (e) {
      console.error("Failed to mark business as EXPIRED:", e);
    }
  }

  return (
    <ReviewClient
      business={{
        ...business,
        isTrialExpired,
      }}
    />
  );
}
