import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// 1. GET: Fetch Batches, Leads, and Live Metrics
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("batchId");
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const outreachStatus = searchParams.get("outreachStatus");
    const leadTier = searchParams.get("leadTier");
    const query = searchParams.get("q");

    // Fetch all batches
    const batches = await prisma.scrapedLeadBatch.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { leads: true }
        }
      }
    });

    // Build filter for leads
    const where: any = {};
    if (batchId && batchId !== "all") where.batchId = batchId;
    if (category && category !== "all") where.category = { contains: category, mode: "insensitive" };
    if (city && city !== "all") where.city = { contains: city, mode: "insensitive" };
    if (outreachStatus && outreachStatus !== "all") where.outreachStatus = outreachStatus;
    if (leadTier && leadTier !== "all") where.leadTier = { contains: leadTier, mode: "insensitive" };
    if (query) {
      where.OR = [
        { businessName: { contains: query, mode: "insensitive" } },
        { phone: { contains: query } },
        { city: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ];
    }

    const leads = await prisma.scrapedLead.findMany({
      where,
      orderBy: [
        { leadScore: "desc" },
        { createdAt: "desc" }
      ],
      take: 1000
    });

    // Calculate metrics
    const totalLeads = await prisma.scrapedLead.count();
    const hotLeads = await prisma.scrapedLead.count({ where: { leadScore: { gte: 70 } } });
    const pitchedLeads = await prisma.scrapedLead.count({ where: { outreachStatus: "SENT" } });
    const repliedLeads = await prisma.scrapedLead.count({ where: { outreachStatus: "REPLIED" } });

    return NextResponse.json({
      success: true,
      batches,
      leads,
      metrics: {
        totalLeads,
        hotLeads,
        pitchedLeads,
        repliedLeads
      }
    });
  } catch (error: any) {
    console.error("Error fetching scraped leads:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: Universal Ingestion (Single lead item, array of items, or { leads: [...] })
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Normalize into leadsArray: handles single object, array, or object with leads property
    let leadsArray: any[] = [];
    if (Array.isArray(body)) {
      leadsArray = body;
    } else if (body.leads && Array.isArray(body.leads)) {
      leadsArray = body.leads;
    } else if (body && typeof body === "object" && (body.business_name || body.businessName || body.name || body.phone || body.place_id || body.placeId)) {
      leadsArray = [body];
    }

    if (leadsArray.length === 0) {
      return NextResponse.json({ success: false, error: "No valid lead objects found in payload" }, { status: 400 });
    }

    const first = leadsArray[0];
    const batchId = body.batchId || body.batch_id || first.batch_id || first.batchId || `batch_${Date.now()}`;
    const category = body.category || first.category || "Local Business";
    const city = body.city || body.location || first.city || first.location || "West Bengal";
    const searchQuery = body.searchQuery || body.search_query || first.search_query || `${category} in ${city}`;

    // Upsert Batch
    let batch = await prisma.scrapedLeadBatch.findUnique({
      where: { batchId }
    }).catch(() => null);

    if (!batch) {
      batch = await prisma.scrapedLeadBatch.create({
        data: {
          batchId,
          category,
          city,
          searchQuery,
          targetCount: leadsArray.length,
          totalFound: leadsArray.length,
          hotCount: 0
        }
      });
    }

    let hotCount = 0;
    let insertedCount = 0;

    for (let i = 0; i < leadsArray.length; i++) {
      const l = leadsArray[i];
      const score = Number(l.lead_score || l.leadScore || l.score) || 75;
      if (score >= 70) hotCount++;

      const leadId = l.lead_id || l.leadId || `lead_${batchId}_${i + 1}_${Math.random().toString(36).substring(2, 6)}`;
      const cleanPhone = (l.whatsapp_number || l.whatsappNumber || l.phone || "").replace(/\D/g, "");

      await prisma.scrapedLead.upsert({
        where: { leadId },
        update: {
          businessName: l.business_name || l.businessName || l.name || "Business",
          phone: l.phone || "",
          whatsappNumber: cleanPhone,
          whatsappUrl: l.whatsapp_url || l.whatsappUrl || (cleanPhone ? `https://wa.me/${cleanPhone}` : ""),
          email: l.email || "",
          website: l.website || "",
          hasWebsite: Boolean(l.has_website || l.hasWebsite || (l.website && l.website !== "No Website" && l.has_website !== "NO")),
          cmsTech: l.cms_tech || l.cmsTech || (l.website ? "Detected" : "No Website"),
          rating: Number(l.rating) || 0,
          reviewCount: Number(l.review_count || l.reviewCount) || 0,
          leadScore: score,
          leadTier: l.lead_tier || l.leadTier || (score >= 70 ? "🔥 HOT LEAD" : "⚡ WARM LEAD"),
          recommendedPitch: l.recommended_pitch || l.recommendedPitch || "Custom Mobile Website & WhatsApp Booking Engine",
          gmapsUrl: l.gmaps_url || l.gmapsUrl || ""
        },
        create: {
          leadId,
          batchId,
          placeId: l.place_id || l.placeId || l.gmaps_url || l.gmapsUrl || `place_${i + 1}`,
          businessName: l.business_name || l.businessName || l.name || "Business",
          category: l.category || category,
          searchQuery,
          city: l.city || city,
          fullAddress: l.full_address || l.fullAddress || l.address || "",
          phone: l.phone || "",
          whatsappNumber: cleanPhone,
          whatsappUrl: l.whatsapp_url || l.whatsappUrl || (cleanPhone ? `https://wa.me/${cleanPhone}` : ""),
          email: l.email || "",
          secondaryEmails: l.secondary_emails || l.secondaryEmails || "",
          website: l.website || "",
          hasWebsite: Boolean(l.has_website || l.hasWebsite || (l.website && l.website !== "No Website" && l.has_website !== "NO")),
          cmsTech: l.cms_tech || l.cmsTech || (l.website ? "Detected" : "No Website"),
          instagramUrl: l.instagram_url || l.instagramUrl || "",
          facebookUrl: l.facebook_url || l.facebookUrl || "",
          linkedinUrl: l.linkedin_url || l.linkedinUrl || "",
          twitterUrl: l.twitter_url || l.twitterUrl || "",
          youtubeUrl: l.youtube_url || l.youtubeUrl || "",
          rating: Number(l.rating) || 0,
          reviewCount: Number(l.review_count || l.reviewCount) || 0,
          isOpen: l.is_open !== false && l.is_open !== "NO",
          businessHours: l.business_hours || l.businessHours || "Open",
          leadScore: score,
          leadTier: l.lead_tier || l.leadTier || (score >= 70 ? "🔥 HOT LEAD" : "⚡ WARM LEAD"),
          recommendedPitch: l.recommended_pitch || l.recommendedPitch || "Custom Mobile Website & WhatsApp Booking Engine",
          gmapsUrl: l.gmaps_url || l.gmapsUrl || "",
          outreachStatus: l.outreach_status || l.outreachStatus || "NEW"
        }
      });
      insertedCount++;
    }

    // Update batch stats
    if (batch) {
      await prisma.scrapedLeadBatch.update({
        where: { id: batch.id },
        data: {
          totalFound: { increment: insertedCount },
          hotCount: { increment: hotCount }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ingested ${insertedCount} lead(s) into VPS Database`,
      batchId,
      insertedCount,
      hotCount
    });
  } catch (error: any) {
    console.error("Error ingesting leads to DB:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. PATCH: Update Outreach Status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadIds, outreachStatus } = body;

    if (!leadIds || !Array.isArray(leadIds) || !outreachStatus) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await prisma.scrapedLead.updateMany({
      where: { leadId: { in: leadIds } },
      data: {
        outreachStatus,
        contactedAt: outreachStatus === "SENT" ? new Date() : undefined
      }
    });

    return NextResponse.json({ success: true, updatedCount: leadIds.length });
  } catch (error: any) {
    console.error("Error updating lead status:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 4. DELETE: Batch or Selected Leads
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("batchId");
    
    // Batch Deletion
    if (batchId) {
      await prisma.scrapedLead.deleteMany({
        where: { batchId }
      });
      await prisma.scrapedLeadBatch.deleteMany({
        where: { batchId }
      });
      return NextResponse.json({ success: true, message: `Batch ${batchId} and all associated leads deleted` });
    }

    // Multiple Leads Deletion
    const body = await req.json().catch(() => ({}));
    const { leadIds } = body;

    if (leadIds && Array.isArray(leadIds) && leadIds.length > 0) {
      const deleted = await prisma.scrapedLead.deleteMany({
        where: { leadId: { in: leadIds } }
      });
      return NextResponse.json({ success: true, deletedCount: deleted.count });
    }

    return NextResponse.json({ success: false, error: "No batchId or leadIds provided for deletion" }, { status: 400 });
  } catch (error: any) {
    console.error("Error deleting leads / batch:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
