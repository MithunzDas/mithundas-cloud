import { prisma } from "@/lib/db";
import StandeeClient from "./StandeeClient";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Printable Counter Standee | ${slug}`,
    description: "High-resolution printable A5 counter standee and front-desk script.",
  };
}

export default async function StandeePage({ params }: PageProps) {
  const { slug } = await params;

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
      },
    });
  } catch (err) {
    console.error("Failed to query business for standee:", err);
  }

  // Fallback demo business for previewing
  if (!business) {
    const formattedName = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    business = {
      id: "demo",
      slug,
      businessName: formattedName || "Apex Dental Studio",
      category: "DENTIST",
      city: "London / New York",
    };
  }

  return (
    <StandeeClient
      slug={business.slug}
      businessName={business.businessName}
      category={business.category}
      city={business.city}
    />
  );
}
