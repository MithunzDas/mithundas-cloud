import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("batchId");
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const outreachStatus = searchParams.get("outreachStatus");
    const leadTier = searchParams.get("leadTier");
    const query = searchParams.get("q");

    // Fetch all batches for sidebar
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
      take: 500
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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("batchId");
    
    // 1. Batch Deletion (Deletes batch + all associated leads)
    if (batchId) {
      await prisma.scrapedLead.deleteMany({
        where: { batchId }
      });
      await prisma.scrapedLeadBatch.deleteMany({
        where: { batchId }
      });
      return NextResponse.json({ success: true, message: `Batch ${batchId} and all associated leads deleted` });
    }

    // 2. Multiple Leads Deletion
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
