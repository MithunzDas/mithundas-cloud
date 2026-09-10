import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const { sessionId, businessId, action } = await request.json();

    if (!sessionId && !businessId) {
      return NextResponse.json({ success: false, error: "Identifier required" }, { status: 400 });
    }

    if (sessionId) {
      await prisma.reviewSession.update({
        where: { id: sessionId },
        data: {
          copiedToClipboard: true,
          redirectedToGoogle: action === "redirect",
        },
      });
    }

    if (businessId) {
      await prisma.reviewBusiness.update({
        where: { id: businessId },
        data: {
          totalReviewsCopied: { increment: 1 },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.warn("Could not track session conversion", "qr_session_update_error", { error: errorMsg });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
