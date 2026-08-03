import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const { rawScope, company, businessType } = await req.json();

    if (!rawScope || typeof rawScope !== "string" || !rawScope.trim()) {
      return NextResponse.json({
        polishedScope: `Custom Workflow Automation & System Architecture for ${company || "Client"}.`,
      });
    }

    const apiKey = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;

    // Clean up double prefix clutter if already present
    const cleanRaw = rawScope
      .replace(/Custom n8n Workflow Automation:\s*/gi, "")
      .replace(/^Primary Needs:\s*/i, "")
      .replace(/⚡/g, "")
      .trim();

    if (apiKey) {
      const client = new OpenAI({ apiKey });
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an executive proposal editor for a high-ticket AI Automation Agency (mithundas.cloud). Your job is to convert messy, informal, or typo-filled client project notes into a single, executive-ready Master Service Agreement (SOW) deliverable line (12 to 22 words max).

CRITICAL RULES:
1. Fix all typos (e.g., "platfoem" -> "Platform", "genaration" -> "Generation", "edutech" -> "EdTech", "neet" -> "NEET").
2. Remove filler words ("etc", "want to build up", "I development of an an", "Primary Needs:", "⚡", "n8n / Make Workflow Automation").
3. Format as a formal, executive agency deliverable starting with strong action nouns (e.g. "Automated Meta Ads Lead Intake & Real-Time CRM Pipeline", "End-to-End n8n Workflow Automation & Student Mock Examination Platform").
4. Output ONLY the clean polished text line without quote marks or prefix tags. No markdown formatting.`,
          },
          {
            role: "user",
            content: `Company: ${company || "Client"}\nIndustry: ${businessType || "General"}\nRaw Notes: "${cleanRaw}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      });

      const polished = response.choices[0]?.message?.content?.trim();
      if (polished) {
        return NextResponse.json({ polishedScope: polished });
      }
    }
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an executive proposal editor for a high-ticket AI Automation Agency (mithundas.cloud). Your job is to convert messy, informal, or typo-filled client project notes into a single, executive-ready Master Service Agreement (SOW) deliverable line (12 to 22 words max).

CRITICAL RULES:
1. Fix all typos (e.g., "platfoem" -> "Platform", "genaration" -> "Generation", "edutech" -> "EdTech").
2. Remove filler words ("etc", "want to build up", "I development of an an", "Primary Needs:", "⚡").
3. Format as a formal, executive agency deliverable starting with strong action nouns (e.g. "Automated Meta Ads Lead Intake & Real-Time CRM Pipeline", "End-to-End n8n Workflow Automation & Student Mock Examination Platform").
4. Output ONLY the clean polished text line without quote marks or prefix tags. No markdown formatting.`,
          },
          {
            role: "user",
            content: `Company: ${company || "Client"}\nIndustry: ${businessType || "General"}\nRaw Notes: "${cleanRaw}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      });

      const polished = response.choices[0]?.message?.content?.trim();
      if (polished) {
        return NextResponse.json({ polishedScope: polished });
      }
    }

    // Fallback if OpenAI client is not active
    let fallback = cleanRaw
      .replace(/\bplatfoem\b/gi, "Platform")
      .replace(/\bedutech\b/gi, "EdTech")
      .replace(/\bneet\b/gi, "NEET")
      .replace(/\bgenaration\b/gi, "Generation")
      .replace(/\bmeta ads\b/gi, "Meta Ads")
      .replace(/I Development of an an/gi, "Development of an")
      .replace(/\s+/g, " ")
      .trim();

    fallback = fallback.charAt(0).toUpperCase() + fallback.slice(1);
    if (!fallback.endsWith(".")) fallback += ".";

    return NextResponse.json({ polishedScope: `Custom n8n Workflow Automation: ${fallback}` });
  } catch (error) {
    logger.error("Failed to polish scope with AI", "polish_scope_error", error);
    return NextResponse.json(
      { error: "Failed to polish scope" },
      { status: 500 }
    );
  }
}
