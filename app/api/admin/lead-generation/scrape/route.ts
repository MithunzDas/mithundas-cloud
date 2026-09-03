import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const N8N_SCRAPE_WEBHOOK = process.env.N8N_SCRAPE_WEBHOOK || "https://n8n.srv1594654.hstgr.cloud/webhook/scrape-leads";
const VPS_SCRAPER_LOCAL = "http://127.0.0.1:3333/scrape";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, city, targetCount = 50 } = body;

    if (!category || !city) {
      return NextResponse.json({ success: false, error: "Category and City are required" }, { status: 400 });
    }

    const searchQuery = `${category} in ${city}`;
    const safeKey = `${category}_${city}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .slice(0, 45);

    const batchId = `batch_${safeKey}`;
    const count = Number(targetCount) || 50;

    // Reuse existing batch or upsert with deterministic batchId
    const batch = await prisma.scrapedLeadBatch.upsert({
      where: { batchId },
      update: {
        category,
        city,
        searchQuery,
        targetCount: count,
        createdAt: new Date()
      },
      create: {
        batchId,
        category,
        city,
        searchQuery,
        targetCount: count,
        totalFound: 0,
        hotCount: 0,
        createdAt: new Date()
      }
    });

    let extractedLeads: any[] = [];

    // 2. Trigger n8n Webhook / VPS Scraper Engine
    try {
      console.log(`Triggering n8n Scrape Webhook: ${N8N_SCRAPE_WEBHOOK}`);
      const n8nRes = await fetch(N8N_SCRAPE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          city,
          location: city,
          targetCount: count,
          target_count: count,
          batchId
        }),
        signal: AbortSignal.timeout(45000)
      }).catch(() => null);

      if (n8nRes && n8nRes.ok) {
        const data = await n8nRes.json().catch(() => ({}));
        extractedLeads = Array.isArray(data) ? data : (data.leads || []);
      }
    } catch (err) {
      console.log("n8n webhook timeout/waiting in background...");
    }

    // 3. Fallback: Check local VPS microservice if n8n webhook is not yet imported
    if (extractedLeads.length === 0) {
      try {
        const localRes = await fetch(`${VPS_SCRAPER_LOCAL}?category=${encodeURIComponent(category)}&location=${encodeURIComponent(city)}&count=${count}`, {
          signal: AbortSignal.timeout(35000)
        }).catch(() => null);

        if (localRes && localRes.ok) {
          const data = await localRes.json();
          extractedLeads = data.leads || [];
        }
      } catch (err) {
        console.log("Local VPS scraper fallback error:", err);
      }
    }

    // 4. Save Extracted Leads into VPS Prisma Database
    let hotCount = 0;
    if (extractedLeads.length > 0) {
      for (const lead of extractedLeads) {
        const score = Number(lead.lead_score || lead.leadScore) || 75;
        if (score >= 70) hotCount++;

        const leadId = `lead_${batchId}_${Math.random().toString(36).substring(2, 9)}`;
        const cleanPhone = (lead.whatsapp_number || lead.whatsappNumber || lead.phone || "").replace(/\D/g, "");

        await prisma.scrapedLead.create({
          data: {
            leadId,
            batchId,
            placeId: lead.place_id || lead.placeId || lead.gmaps_url || lead.gmapsUrl || "",
            businessName: lead.business_name || lead.businessName || lead.name || "Business",
            category: lead.category || category,
            searchQuery,
            city: lead.city || city,
            fullAddress: lead.full_address || lead.fullAddress || lead.address || "",
            phone: lead.phone || "",
            whatsappNumber: cleanPhone,
            whatsappUrl: lead.whatsapp_url || lead.whatsappUrl || (cleanPhone ? `https://wa.me/${cleanPhone}` : ""),
            email: lead.email || "",
            secondaryEmails: lead.secondary_emails || lead.secondaryEmails || "",
            website: lead.website || "",
            hasWebsite: Boolean(lead.website && lead.website !== "No Website" && lead.has_website !== "NO"),
            cmsTech: lead.cms_tech || lead.cmsTech || (lead.website ? "Detected" : "No Website"),
            rating: Number(lead.rating) || 4.5,
            reviewCount: Number(lead.review_count || lead.reviewCount) || 0,
            isOpen: lead.is_open !== false && lead.is_open !== "NO",
            businessHours: lead.business_hours || lead.businessHours || "Open",
            leadScore: score,
            leadTier: lead.lead_tier || lead.leadTier || (score >= 70 ? "🔥 HOT: Needs New Website" : "⚡ WARM: Optimization"),
            recommendedPitch: lead.recommended_pitch || lead.recommendedPitch || "Custom High-Converting Mobile Website & WhatsApp Booking Engine",
            gmapsUrl: lead.gmaps_url || lead.gmapsUrl || "",
            outreachStatus: "NEW"
          }
        }).catch(err => console.error("Error inserting lead:", err));
      }

      // Update Batch counts in DB
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
      message: `Search triggered for "${searchQuery}". Syncing across n8n, VPS DB, and Google Sheets!`,
      totalFound: extractedLeads.length,
      hotCount,
      batch
    });
  } catch (error: any) {
    console.error("Error in lead scrape API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
