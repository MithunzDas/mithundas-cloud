import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const { company, businessType, rawRequirement } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        sowText: `🎯 PROJECT OBJECTIVE:
Automate business operations and scale system throughput for ${company || "your business"}.

⚙️ RECOMMENDED AUTOMATION ARCHITECTURE:
• Intelligent Workflow Routing: Next.js frontend integrated with n8n workflow triggers.
• AI Engine Integration: OpenAI gpt-4o-mini for real-time document parsing & lead qualification.
• Data & CRM Synchronization: Automated Google Sheets & CRM logging pipeline.

🚀 TARGET OUTCOME:
Eliminate manual bottlenecks, accelerate response times, and establish scalable AI-driven operational infrastructure.`,
      });
    }

    const openai = new OpenAI({ apiKey });

    const prompt = `You are a Lead Systems Architect at Mithun Das AI Automation (mithundas.cloud).
Convert the client's business details into a crisp, executive 3-part Mini Statement of Work (SOW).

Client Company: "${company || "Client Business"}"
Industry/Type: "${businessType || "General Business"}"
Client Requirement/Bottlenecks: "${rawRequirement || "Automate operational processes & reduce manual work."}"

Format your response EXACTLY as follows (with emojis):

🎯 PROJECT OBJECTIVE:
[1-2 clear, punchy sentences stating what high-impact system will be built for the client.]

⚙️ RECOMMENDED AUTOMATION ARCHITECTURE:
• [Key Component 1: e.g. Frontend / Lead Intake / WhatsApp API integration]
• [Key Component 2: e.g. n8n workflow pipeline & OpenAI gpt-4o-mini processing]
• [Key Component 3: e.g. Centralized CRM & Automated Email/Notification Dispatch]

🚀 TARGET OUTCOME:
[1-2 sentences on operational efficiency, manual hours saved, and business scaling impact.]

Keep it professional, executive-ready, and concise. No markdown headers (no #), no extra intro text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 350,
    });

    const sowText = response.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ sowText });
  } catch (error: any) {
    logger.error("Failed to generate AI SOW in /api/book/generate-sow", "generate_sow_error", error);
    return NextResponse.json(
      { error: "Failed to generate Statement of Work." },
      { status: 500 }
    );
  }
}
