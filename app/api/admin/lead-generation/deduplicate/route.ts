import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Hierarchy of outreach status priority
const STATUS_PRIORITY: Record<string, number> = {
  REPLIED: 5,
  READ: 4,
  DELIVERED: 3,
  SENT: 2,
  NEW: 1,
  FAILED: 0
};

export async function POST(req: NextRequest) {
  try {
    console.log("[Deduplication] Starting global phone deduplication scan...");

    const allLeads = await prisma.scrapedLead.findMany({
      orderBy: { createdAt: "desc" }
    });

    // Group leads by canonical 10-digit phone suffix
    const phoneMap = new Map<string, typeof allLeads>();

    for (const lead of allLeads) {
      const raw = (lead.whatsappNumber || lead.phone || "").replace(/\D/g, "");
      const cleanPhone = raw.slice(-10);

      // Skip invalid phones with fewer than 10 digits
      if (!cleanPhone || cleanPhone.length < 10) continue;

      if (!phoneMap.has(cleanPhone)) {
        phoneMap.set(cleanPhone, []);
      }
      phoneMap.get(cleanPhone)!.push(lead);
    }

    let duplicatesRemoved = 0;
    const cloneIdsToDelete: string[] = [];
    const mastersToUpdate: { id: string; data: any }[] = [];

    for (const [phone, group] of phoneMap.entries()) {
      if (group.length <= 1) continue;

      console.log(`[Deduplication] Found ${group.length} duplicates for phone +91${phone}`);

      // 1. Sort to pick the best master record
      // Priority: Highest outreach status, then highest review count, then highest lead score
      const sorted = [...group].sort((a, b) => {
        const priorityA = STATUS_PRIORITY[a.outreachStatus] || 0;
        const priorityB = STATUS_PRIORITY[b.outreachStatus] || 0;
        if (priorityA !== priorityB) return priorityB - priorityA;

        const revA = a.reviewCount || 0;
        const revB = b.reviewCount || 0;
        if (revA !== revB) return revB - revA;

        const scoreA = a.leadScore || 0;
        const scoreB = b.leadScore || 0;
        return scoreB - scoreA;
      });

      const master = sorted[0];
      const clones = sorted.slice(1);

      // 2. Merge richest information into master
      const bestEmail = master.email || clones.find(c => c.email)?.email || "";
      const bestWebsite = master.website || clones.find(c => c.website)?.website || "";
      const bestAddress = master.fullAddress || clones.find(c => c.fullAddress)?.fullAddress || "";
      const maxReviewCount = Math.max(master.reviewCount || 0, ...clones.map(c => c.reviewCount || 0));
      const highestScore = Math.max(master.leadScore || 0, ...clones.map(c => c.leadScore || 0));
      const bestLastReply = master.lastReplyMessage || clones.find(c => c.lastReplyMessage)?.lastReplyMessage || null;

      mastersToUpdate.push({
        id: master.id,
        data: {
          email: bestEmail,
          website: bestWebsite,
          hasWebsite: Boolean(bestWebsite),
          fullAddress: bestAddress,
          reviewCount: maxReviewCount,
          leadScore: highestScore,
          lastReplyMessage: bestLastReply
        }
      });

      for (const clone of clones) {
        cloneIdsToDelete.push(clone.id);
      }
    }

    // 3. Execute master updates
    for (const item of mastersToUpdate) {
      await prisma.scrapedLead.update({
        where: { id: item.id },
        data: item.data
      });
    }

    // 4. Delete redundant clones
    if (cloneIdsToDelete.length > 0) {
      const deleteResult = await prisma.scrapedLead.deleteMany({
        where: { id: { in: cloneIdsToDelete } }
      });
      duplicatesRemoved = deleteResult.count;
    }

    console.log(`[Deduplication] Scan completed. Removed ${duplicatesRemoved} redundant clones. Total unique phones: ${phoneMap.size}`);

    return NextResponse.json({
      success: true,
      totalAnalyzed: allLeads.length,
      uniquePhones: phoneMap.size,
      duplicatesRemoved,
      message: duplicatesRemoved > 0
        ? `Successfully merged and removed ${duplicatesRemoved} duplicate lead clone(s)!`
        : "Database is 100% clean! Zero duplicate phone numbers found."
    });
  } catch (error: any) {
    console.error("Error during lead deduplication:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
