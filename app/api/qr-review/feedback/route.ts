import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const {
      businessId,
      customerName,
      customerPhone,
      customerEmail,
      feedbackText,
      ratingScore = 2,
    } = await request.json();

    if (!businessId || !feedbackText) {
      return NextResponse.json(
        { success: false, error: "Business ID and feedback are required." },
        { status: 400 }
      );
    }

    const feedback = await prisma.privateFeedback.create({
      data: {
        businessId,
        customerName: customerName || "Anonymous Customer",
        customerPhone,
        customerEmail,
        feedbackText,
        ratingScore: Number(ratingScore) || 2,
      },
    });

    return NextResponse.json({ success: true, feedbackId: feedback.id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error("Error saving private feedback", "qr_private_feedback_error", { error: errorMsg });
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
