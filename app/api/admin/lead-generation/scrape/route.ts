import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, city, targetCount = 50 } = body;

    if (!category || !city) {
      return NextResponse.json({ success: false, error: "Category and City are required" }, { status: 400 });
    }

    const searchQuery = `${category} in ${city}`;
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create the batch record in VPS DB
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

    return NextResponse.json({
      success: true,
      batchId,
      message: `Lead extraction initialized for ${searchQuery}`,
      batch
    });
  } catch (error: any) {
    console.error("Error initializing lead scrape:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
