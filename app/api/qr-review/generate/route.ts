import { NextResponse } from "next/server";
import { generateHumanReview } from "@/lib/qr-review/ai-writer";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessId,
      businessName,
      category = "GENERAL_SERVICES",
      city,
      answers = [],
      ratingScore = 5,
    } = body;

    if (!businessName) {
      return NextResponse.json(
        { success: false, error: "Business name is required." },
        { status: 400 }
      );
    }

    const reviewText = await generateHumanReview({
      businessName,
      category,
      city,
      answers,
      ratingScore,
    });

    // Save session in database if businessId is provided
    let sessionId: string | null = null;
    if (businessId) {
      try {
        const session = await prisma.reviewSession.create({
          data: {
            businessId,
            selectedQuestions: JSON.stringify(answers),
            generatedReview: reviewText,
            ratingScore: Number(ratingScore) || 5,
            sentiment: ratingScore >= 4 ? "POSITIVE" : "NEUTRAL",
          },
        });
        sessionId = session.id;

        // Increment scan count on business
        await prisma.reviewBusiness.update({
          where: { id: businessId },
          data: { totalScans: { increment: 1 } },
        });
      } catch (dbErr: unknown) {
        const errorMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
        logger.warn("Could not record review session in db", "qr_review_session_log", { error: errorMsg });
      }
    }

    return NextResponse.json({
      success: true,
      reviewText,
      sessionId,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error("Error in /api/qr-review/generate", "qr_review_generate_error", { error: errorMsg });
    return NextResponse.json(
      { success: false, error: "Failed to generate review." },
      { status: 500 }
    );
  }
}
