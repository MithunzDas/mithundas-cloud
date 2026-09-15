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

    // Enforce 3-day trial limit: if businessId provided and trial expired, block review generation
    if (businessId) {
      try {
        const biz = await prisma.reviewBusiness.findUnique({
          where: { id: businessId },
          select: { trialStatus: true, trialEndsAt: true },
        });

        if (biz && biz.trialStatus !== "SUBSCRIBED" && biz.trialEndsAt && new Date(biz.trialEndsAt) <= new Date()) {
          return NextResponse.json(
            {
              success: false,
              trialExpired: true,
              error: "This location's 3-day preview trial has ended. Please activate a growth subscription to continue AI review generation.",
            },
            { status: 403 }
          );
        }
      } catch (checkErr) {
        logger.warn("Could not verify business trial status", "qr_trial_check_warn", { error: String(checkErr) });
      }
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
