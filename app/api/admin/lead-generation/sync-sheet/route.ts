import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || "12JhqOoK4J7GsG7QxISPYlhO9Pnjv1T-T30qIGz4V3AY";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { rows, batchId = `batch_sheet_${Date.now()}`, category = "Imported Leads", city = "West Bengal" } = body;

    // 1. If rows are passed directly in body, ingest them
    if (rows && Array.isArray(rows) && rows.length > 0) {
      return await ingestRows(rows, batchId, category, city);
    }

    // 2. Otherwise fetch from public CSV export of the Google Sheet if accessible
    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`;
      const csvRes = await fetch(csvUrl, { signal: AbortSignal.timeout(10000) });
      
      if (csvRes.ok) {
        const text = await csvRes.text();
        const parsedRows = parseCsv(text);
        if (parsedRows.length > 0) {
          return await ingestRows(parsedRows, batchId, category, city);
        }
      }
    } catch (err) {
      console.log("Could not auto-fetch public CSV, expecting body payload:", err);
    }

    return NextResponse.json({
      success: false,
      error: "No rows provided or Google Sheet is private. Use the n8n DB Sync node or pass rows array."
    }, { status: 400 });

  } catch (error: any) {
    console.error("Error syncing from Google Sheets:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function parseCsv(csvText: string) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const rowObj: any = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || "";
    });
    rows.push(rowObj);
  }

  return rows;
}

async function ingestRows(rows: any[], batchId: string, category: string, city: string) {
  const firstRow = rows[0] || {};
  const batchCat = firstRow.category || category;
  const batchCity = firstRow.city || city;
  const searchQuery = firstRow.search_query || `${batchCat} in ${batchCity}`;

  // Re-use existing batch if same search query exists
  let batch = await prisma.scrapedLeadBatch.findFirst({
    where: {
      OR: [
        { searchQuery },
        { AND: [{ category: batchCat }, { city: batchCity }] }
      ]
    },
    orderBy: { createdAt: "desc" }
  });

  if (batch) {
    await prisma.scrapedLeadBatch.update({
      where: { id: batch.id },
      data: { createdAt: new Date() }
    });
  } else {
    batch = await prisma.scrapedLeadBatch.create({
      data: {
        batchId,
        category: batchCat,
        city: batchCity,
        searchQuery,
        targetCount: rows.length,
        totalFound: rows.length,
        hotCount: 0,
        createdAt: new Date()
      }
    });
  }

  const finalBatchId = batch.batchId;
  let hotCount = 0;
  let inserted = 0;

  for (let i = 0; i < rows.length; i++) {
    const l = rows[i];
    const score = Number(l.lead_score || l.leadScore || l.score) || 75;
    if (score >= 70) hotCount++;

    let cleanPhone = (l.whatsapp_number || l.whatsappNumber || l.phone || "").replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) cleanPhone = cleanPhone.slice(1);
    const phoneSuffix = cleanPhone.slice(-10);
    const placeId = l.place_id || l.placeId;

    // PROACTIVE GLOBAL DEDUPLICATION CHECK (Phone + Place ID)
    let existingLead = null;
    if (phoneSuffix && phoneSuffix.length === 10) {
      existingLead = await prisma.scrapedLead.findFirst({
        where: {
          OR: [
            { whatsappNumber: { contains: phoneSuffix } },
            { phone: { contains: phoneSuffix } },
            ...(placeId ? [{ placeId }] : [])
          ]
        }
      }).catch(() => null);
    } else if (placeId) {
      existingLead = await prisma.scrapedLead.findFirst({
        where: { placeId }
      }).catch(() => null);
    }

    if (existingLead) {
      // Merge & Enrich (Never duplicate, Never downgrade outreach status)
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
          fullAddress: l.full_address || l.address || existingLead.fullAddress,
          outreachStatus: ["SENT", "READ", "DELIVERED", "REPLIED"].includes(existingLead.outreachStatus)
            ? existingLead.outreachStatus
            : (l.outreach_status || l.outreachStatus || "NEW")
        }
      });
      inserted++;
      continue;
    }

    // Unique Lead Creation
    const leadId = l.lead_id || l.leadId || `lead_${finalBatchId}_${phoneSuffix || i + 1}_${Math.random().toString(36).substring(2, 6)}`;

    await prisma.scrapedLead.create({
      data: {
        leadId,
        batchId: finalBatchId,
        placeId: placeId || `place_${i + 1}`,
        businessName: l.business_name || l.businessName || "Business",
        category: l.category || batchCat,
        searchQuery: l.search_query || searchQuery,
        city: l.city || batchCity,
        fullAddress: l.full_address || l.address || "",
        phone: l.phone || "",
        whatsappNumber: cleanPhone || phoneSuffix,
        whatsappUrl: l.whatsapp_url || (phoneSuffix ? `https://wa.me/91${phoneSuffix}` : ""),
        email: l.email || "",
        secondaryEmails: l.secondary_emails || "",
        website: l.website || "",
        hasWebsite: Boolean(l.has_website || (l.website && l.website !== "No Website")),
        cmsTech: l.cms_tech || (l.website ? "Detected" : "No Website"),
        instagramUrl: l.instagram_url || "",
        facebookUrl: l.facebook_url || "",
        linkedinUrl: l.linkedin_url || "",
        twitterUrl: l.twitter_url || "",
        youtubeUrl: l.youtube_url || "",
        rating: Number(l.rating) || 0,
        reviewCount: Number(l.review_count) || 0,
        isOpen: l.is_open !== false && l.is_open !== "NO",
        businessHours: l.business_hours || "Open",
        leadScore: score,
        leadTier: l.lead_tier || (score >= 70 ? "🔥 HOT LEAD" : "⚡ WARM LEAD"),
        recommendedPitch: l.recommended_pitch || "Custom Mobile Website & WhatsApp Booking Engine",
        gmapsUrl: l.gmaps_url || "",
        outreachStatus: l.outreach_status || "NEW"
      }
    });
    inserted++;
  }

  const trueTotal = await prisma.scrapedLead.count({ where: { batchId: finalBatchId } });
  const trueHot = await prisma.scrapedLead.count({ where: { batchId: finalBatchId, leadScore: { gte: 70 } } });

  await prisma.scrapedLeadBatch.update({
    where: { id: batch.id },
    data: { hotCount: trueHot, totalFound: trueTotal }
  });

  return NextResponse.json({
    success: true,
    message: `Synced ${inserted} leads with active phone deduplication!`,
    batchId: finalBatchId,
    insertedCount: inserted,
    hotCount: trueHot
  });
}
