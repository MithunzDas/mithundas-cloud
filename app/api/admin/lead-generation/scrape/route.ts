import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VPS_SCRAPER_URL = process.env.VPS_SCRAPER_URL || "http://127.0.0.1:3333";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, city, targetCount = 50 } = body;

    if (!category || !city) {
      return NextResponse.json({ success: false, error: "Category and City are required" }, { status: 400 });
    }

    const searchQuery = `${category} in ${city}`;
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. Create the Batch in VPS DB
    const batch = await prisma.scrapedLeadBatch.create({
      data: {
        batchId,
        category,
        city,
        searchQuery,
        targetCount: Number(targetCount) || 50,
        totalFound: 0,
        hotCount: 0
      }
    });

    let extractedLeads: any[] = [];

    // 2. Try calling the VPS Lead Generation Scraper
    try {
      const scraperRes = await fetch(`${VPS_SCRAPER_URL}/scrape?category=${encodeURIComponent(category)}&location=${encodeURIComponent(city)}&count=${targetCount}`, {
        method: "GET",
        signal: AbortSignal.timeout(35000)
      }).catch(() => null);

      if (scraperRes && scraperRes.ok) {
        const data = await scraperRes.json();
        extractedLeads = data.leads || [];
      }
    } catch (err) {
      console.log("Direct VPS scraper timeout/unreachable, continuing batch setup...");
    }

    // 3. If direct scraper returned leads, insert into VPS Prisma DB
    let hotCount = 0;
    if (extractedLeads.length > 0) {
      for (const lead of extractedLeads) {
        const score = Number(lead.lead_score) || 75;
        if (score >= 70) hotCount++;

        const leadId = `lead_${batchId}_${Math.random().toString(36).substring(2, 9)}`;
        const cleanPhone = (lead.whatsapp_number || lead.phone || "").replace(/\D/g, "");

        await prisma.scrapedLead.create({
          data: {
            leadId,
            batchId,
            placeId: lead.place_id || lead.gmaps_url,
            businessName: lead.business_name || lead.name || "Business",
            category: lead.category || category,
            searchQuery,
            city: lead.city || city,
            fullAddress: lead.full_address || lead.address || "",
            phone: lead.phone || "",
            whatsappNumber: cleanPhone,
            whatsappUrl: lead.whatsapp_url || (cleanPhone ? `https://wa.me/${cleanPhone}` : ""),
            email: lead.email || "",
            secondaryEmails: lead.secondary_emails || "",
            website: lead.website || "",
            hasWebsite: Boolean(lead.website && lead.website !== "No Website"),
            cmsTech: lead.cms_tech || (lead.website ? "Detected" : "No Website"),
            rating: Number(lead.rating) || 4.5,
            reviewCount: Number(lead.review_count) || 0,
            isOpen: lead.is_open !== false,
            businessHours: lead.business_hours || "Open",
            leadScore: score,
            leadTier: lead.lead_tier || (score >= 70 ? "🔥 HOT: Needs New Website" : "⚡ WARM: Optimization"),
            recommendedPitch: lead.recommended_pitch || "Custom High-Converting Mobile Website & WhatsApp Booking Engine",
            gmapsUrl: lead.gmaps_url || "",
            outreachStatus: "NEW"
          }
        }).catch(err => console.error("Error inserting lead:", err));
      }

      // Update Batch counts
      await prisma.scrapedLeadBatch.update({
        where: { id: batch.id },
        data: {
          totalFound: extractedLeads.length,
          hotCount
        }
      });
    }

    return NextResponse.json({
      success: true,
      batchId,
      message: `Extraction initialized for "${searchQuery}"`,
      totalFound: extractedLeads.length,
      hotCount,
      batch
    });
  } catch (error: any) {
    console.error("Error in lead scrape API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
