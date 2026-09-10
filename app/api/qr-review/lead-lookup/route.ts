import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  extractPlaceIdFromUrl,
  extractBusinessNameFromUrl,
  detectCountryFromLocation,
  cleanCityAndCountry,
} from "@/lib/qr-review/google-places";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId") || searchParams.get("id");
    const rawPlaceId =
      searchParams.get("placeId") ||
      searchParams.get("place_id") ||
      searchParams.get("url") ||
      searchParams.get("maps");
    const rawName = searchParams.get("name") || searchParams.get("businessName");
    const rawCity = searchParams.get("city");
    const rawPhone = searchParams.get("phone") || searchParams.get("whatsapp") || searchParams.get("emailNumber");
    const rawEmail = searchParams.get("email");

    const cleanPlaceId = rawPlaceId ? (extractPlaceIdFromUrl(rawPlaceId) || rawPlaceId.trim()) : null;
    const extractedName = rawPlaceId ? extractBusinessNameFromUrl(rawPlaceId) : null;
    const searchName = rawName || (extractedName ? (extractedName.split("|")[0]?.trim() || extractedName) : null);

    // Extract any hex substring (e.g. 0x39f899...) from place ID or URL to match scraper database
    const hexMatch = rawPlaceId?.match(/0x[0-9a-fA-F]{8,}/);
    const hexPart = hexMatch ? hexMatch[0] : null;

    if (!leadId && !cleanPlaceId && !searchName && !rawCity && !rawPhone && !rawEmail && !hexPart) {
      return NextResponse.json(
        { success: false, error: "leadId, placeId, city, businessName, phone, or email is required" },
        { status: 400 }
      );
    }

    // 1. Search in ScrapedLead table (from your custom Google Maps scraper)
    const scrapedLead = await prisma.scrapedLead.findFirst({
      where: {
        OR: [
          leadId ? { leadId } : undefined,
          leadId ? { id: leadId } : undefined,
          cleanPlaceId ? { placeId: cleanPlaceId } : undefined,
          cleanPlaceId ? { gmapsUrl: { contains: cleanPlaceId, mode: "insensitive" } } : undefined,
          hexPart ? { placeId: { contains: hexPart } } : undefined,
          hexPart ? { gmapsUrl: { contains: hexPart, mode: "insensitive" } } : undefined,
          rawPlaceId ? { gmapsUrl: { contains: rawPlaceId, mode: "insensitive" } } : undefined,
          rawPhone ? { phone: { contains: rawPhone.replace(/\D/g, "") } } : undefined,
          rawPhone ? { whatsappNumber: { contains: rawPhone.replace(/\D/g, "") } } : undefined,
          rawEmail ? { email: { contains: rawEmail, mode: "insensitive" } } : undefined,
          rawEmail ? { secondaryEmails: { contains: rawEmail, mode: "insensitive" } } : undefined,
          searchName ? { businessName: { contains: searchName, mode: "insensitive" } } : undefined,
        ].filter(Boolean) as any,
      },
      select: {
        leadId: true,
        businessName: true,
        category: true,
        city: true,
        fullAddress: true,
        email: true,
        secondaryEmails: true,
        placeId: true,
        phone: true,
        whatsappNumber: true,
        website: true,
        rating: true,
        reviewCount: true,
        gmapsUrl: true,
      },
    });

    if (scrapedLead) {
      const location = cleanCityAndCountry({
        rawCity: scrapedLead.city,
        address: scrapedLead.fullAddress,
        url: scrapedLead.gmapsUrl || rawPlaceId,
      });

      const formattedLocation = [location.city, location.country].filter(Boolean).join(", ");
      const resolvedPhone = scrapedLead.whatsappNumber || scrapedLead.phone || "";

      return NextResponse.json({
        success: true,
        foundInDatabase: true,
        source: "scraped_lead",
        lead: {
          businessName: scrapedLead.businessName,
          category: scrapedLead.category,
          city: location.city,
          country: location.country,
          formattedLocation,
          email: scrapedLead.email || scrapedLead.secondaryEmails || "",
          ownerName: "",
          position: "Owner / Manager",
          phone: resolvedPhone,
          website: scrapedLead.website,
          placeId: scrapedLead.placeId || cleanPlaceId,
          gmapsUrl: scrapedLead.gmapsUrl,
          rating: scrapedLead.rating,
          reviewCount: scrapedLead.reviewCount,
        },
      });
    }

    // 2. Search in Lead table (inbound / intake leads with personal owner name & phone)
    if (searchName || leadId || rawEmail || rawPhone) {
      const generalLead = await prisma.lead.findFirst({
        where: {
          OR: [
            leadId ? { leadId } : undefined,
            rawEmail ? { email: { equals: rawEmail, mode: "insensitive" } } : undefined,
            rawPhone ? { whatsapp: { contains: rawPhone.replace(/\D/g, "") } } : undefined,
            searchName ? { company: { contains: searchName, mode: "insensitive" } } : undefined,
          ].filter(Boolean) as any,
        },
      });

      if (generalLead) {
        const location = cleanCityAndCountry({
          rawCity: rawCity || generalLead.country,
          rawCountry: generalLead.country,
          url: rawPlaceId,
        });

        return NextResponse.json({
          success: true,
          foundInDatabase: true,
          source: "intake_lead",
          lead: {
            businessName: generalLead.company,
            category: generalLead.businessType,
            city: location.city,
            country: location.country,
            formattedLocation: [location.city, location.country].filter(Boolean).join(", "),
            email: generalLead.email,
            ownerName: generalLead.name,
            position: "Owner",
            phone: generalLead.whatsapp || "",
            placeId: cleanPlaceId,
          },
        });
      }
    }

    // 3. Search in ReviewBusiness table
    if (cleanPlaceId || searchName || rawEmail) {
      const existingBiz = await prisma.reviewBusiness.findFirst({
        where: {
          OR: [
            cleanPlaceId ? { placeId: cleanPlaceId } : undefined,
            rawEmail ? { ownerEmail: { equals: rawEmail, mode: "insensitive" } } : undefined,
            searchName ? { businessName: { contains: searchName, mode: "insensitive" } } : undefined,
          ].filter(Boolean) as any,
        },
      });

      if (existingBiz) {
        const location = cleanCityAndCountry({
          rawCity: existingBiz.city,
          rawCountry: existingBiz.country,
        });

        return NextResponse.json({
          success: true,
          foundInDatabase: true,
          source: "existing_business",
          lead: {
            businessName: existingBiz.businessName,
            category: existingBiz.category,
            city: location.city,
            country: location.country,
            formattedLocation: [location.city, location.country].filter(Boolean).join(", "),
            email: existingBiz.ownerEmail,
            ownerName: existingBiz.ownerName,
            position: "Manager / Owner",
            phone: existingBiz.ownerPhone || "",
            placeId: existingBiz.placeId,
          },
        });
      }
    }

    // 4. Not in database: calculate country & clean city from coordinates / city / URL
    const location = cleanCityAndCountry({
      rawCity,
      url: rawPlaceId,
    });

    return NextResponse.json({
      success: true,
      foundInDatabase: false,
      lead: {
        placeId: cleanPlaceId,
        businessName: searchName || "",
        city: location.city,
        country: location.country,
        formattedLocation: [location.city, location.country].filter(Boolean).join(", "),
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
