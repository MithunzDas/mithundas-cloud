import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      answer: "This is a placeholder chatbot response.",
      intent: "service_explanation",
      suggestedNextAction: "ask_question",
      receivedData: body
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid payload" },
      { status: 400 }
    );
  }
}
