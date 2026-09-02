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

    // Fetch batches with at least 1 lead or recently created, ordered by newest
    const rawBatches = await prisma.scrapedLeadBatch.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { leads: true }
        }
      }
    });

    // Filter out 0-lead orphan batches if they are older than 10 mins
    const batches = rawBatches.filter(b => b._count.leads > 0 || (Date.now() - new Date(b.createdAt).getTime() < 600000));

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
    const pitchedLeads = await prisma.scrapedLead.count({ where: { outreachStatus: { in: ["SENT", "DELIVERED", "READ", "REPLIED"] } } });
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

// 2. POST: Smart Batch Grouping Ingestion (Groups all leads of the same search into ONE single batch)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Normalize into leadsArray
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
    const category = body.category || first.category || "Local Business";
    const city = body.city || body.location || first.city || first.location || "West Bengal";
    const searchQuery = body.searchQuery || body.search_query || first.search_query || `${category} in ${city}`;

    // 1. DETERMINISTIC ATOMIC BATCH RESOLUTION (Never create N duplicate boxes for 1 search!)
    const cleanSearchQuery = searchQuery.trim();
    const safeKey = cleanSearchQuery
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .slice(0, 45);

    const deterministicBatchId = body.batchId || body.batch_id || first.batch_id || first.batchId || `batch_${safeKey}`;

    // Atomic upsert: If n8n sends 20 leads concurrently, all 20 will attach to the EXACT SAME batch box!
    const targetBatch = await prisma.scrapedLeadBatch.upsert({
      where: { batchId: deterministicBatchId },
      update: {
        category,
        city,
        searchQuery: cleanSearchQuery,
        createdAt: new Date() // Update Indian timestamp to latest search event!
      },
      create: {
        batchId: deterministicBatchId,
        category,
        city,
        searchQuery: cleanSearchQuery,
        targetCount: leadsArray.length > 1 ? leadsArray.length : 50,
        totalFound: 0,
        hotCount: 0,
        createdAt: new Date()
      }
    });

    const finalBatchId = targetBatch.batchId;
    let hotCount = 0;
    let insertedCount = 0;

    for (let i = 0; i < leadsArray.length; i++) {
      const l = leadsArray[i];
      const score = Number(l.lead_score || l.leadScore || l.score) || 75;
      if (score >= 70) hotCount++;

      let cleanPhone = (l.whatsapp_number || l.whatsappNumber || l.phone || "").replace(/\D/g, "");
      if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.slice(1);
      const phoneSuffix = cleanPhone.slice(-10);

      // Phase 4: Proactive Global Phone Deduplication Check
      let existingLead = null;
      if (phoneSuffix && phoneSuffix.length === 10) {
        existingLead = await prisma.scrapedLead.findFirst({
          where: {
            OR: [
              { whatsappNumber: { contains: phoneSuffix } },
              { phone: { contains: phoneSuffix } }
            ]
          }
        }).catch(() => null);
      }

      if (existingLead) {
        // Merge enriched data while strictly preserving outreach lifecycle status
        const newReviewCount = Number(l.review_count || l.reviewCount) || 0;
        const bestReviewCount = Math.max(existingLead.reviewCount || 0, newReviewCount);
        const bestScore = Math.max(existingLead.leadScore || 0, score);
        const bestEmail = l.email || existingLead.email;
        const bestWebsite = l.website || existingLead.website;

        await prisma.scrapedLead.update({
          where: { id: existingLead.id },
          data: {
            businessName: l.business_name || l.businessName || existingLead.businessName,
            reviewCount: bestReviewCount,
            rating: Number(l.rating) || existingLead.rating,
            leadScore: bestScore,
            email: bestEmail,
            website: bestWebsite,
            hasWebsite: Boolean(bestWebsite && bestWebsite !== "No Website"),
            fullAddress: l.full_address || l.fullAddress || existingLead.fullAddress,
            // Preserve advanced outreach statuses (NEVER downgrade REPLIED, READ, or SENT)
            outreachStatus: ["SENT", "READ", "DELIVERED", "REPLIED"].includes(existingLead.outreachStatus)
              ? existingLead.outreachStatus
              : (l.outreach_status || l.outreachStatus || "NEW")
          }
        });
        insertedCount++;
        continue;
      }

      // New unique lead creation
      const placeKey = (l.place_id || l.placeId || phoneSuffix || l.business_name || `item_${i}`).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
      const leadId = `lead_${finalBatchId}_${placeKey}`;

      await prisma.scrapedLead.create({
        data: {
          leadId,
          batchId: finalBatchId,
          placeId: l.place_id || l.placeId || l.gmaps_url || l.gmapsUrl || `place_${i + 1}`,
          businessName: l.business_name || l.businessName || l.name || "Business",
          category: l.category || category,
          searchQuery,
          city: l.city || city,
          fullAddress: l.full_address || l.fullAddress || l.address || "",
          phone: l.phone || "",
          whatsappNumber: cleanPhone || phoneSuffix,
          whatsappUrl: l.whatsapp_url || l.whatsappUrl || (phoneSuffix ? `https://wa.me/91${phoneSuffix}` : ""),
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

    // Recalculate true lead count for this unified batch
    const trueCount = await prisma.scrapedLead.count({ where: { batchId: finalBatchId } });
    const trueHotCount = await prisma.scrapedLead.count({ where: { batchId: finalBatchId, leadScore: { gte: 70 } } });

    await prisma.scrapedLeadBatch.update({
      where: { id: targetBatch.id },
      data: {
        totalFound: trueCount,
        hotCount: trueHotCount
      }
    });

    return NextResponse.json({
      success: true,
      message: `Grouped and saved lead(s) into batch "${targetBatch.category} in ${targetBatch.city}"`,
      batchId: finalBatchId,
      batchTotal: trueCount,
      hotCount: trueHotCount
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
    const { leadIds, outreachStatus, lastReplyMessage } = body;

    if (!leadIds || !Array.isArray(leadIds) || !outreachStatus) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const updateData: any = {
      outreachStatus
    };

    if (outreachStatus === "SENT") {
      updateData.contactedAt = new Date();
    } else if (outreachStatus === "REPLIED") {
      updateData.repliedAt = new Date();
      if (lastReplyMessage) {
        updateData.lastReplyMessage = lastReplyMessage;
      }
    }

    await prisma.scrapedLead.updateMany({
      where: { leadId: { in: leadIds } },
      data: updateData
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
