import { NextResponse } from "next/server";
import { ChatRequestSchema } from "@/lib/validation";
import { generateChatResponse } from "@/services/openai/openai";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

  // Rate Limiting check
  const rateLimitResult = await rateLimit(ip, "/api/chat");
  if (!rateLimitResult.success) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`, "chat_rate_limit");
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  try {
    const rawBody = await request.json();

    // Validation schema check
    const parsedData = ChatRequestSchema.safeParse(rawBody);
    if (!parsedData.success) {
      logger.warn("Validation failed for chat request", "chat_validation", {
        errors: parsedData.error.flatten(),
      });
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: parsedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { messages, leadContext } = parsedData.data;

    // Call OpenAI AI response engine
    const aiResponse = await generateChatResponse(messages, leadContext);

    return NextResponse.json(aiResponse);
  } catch (error) {
    logger.error("Internal error in Chat API route", "chat_api_route_error", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
