import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const leadId = formData.get("leadId") as string | null;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    // Step 1: Transcribe Audio using OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en", // Supports multi-language translation to English
    });

    const transcriptText = transcription.text || "";

    if (!transcriptText || transcriptText.trim().length < 10) {
      return NextResponse.json({
        transcript: transcriptText,
        summary: "Meeting was too short or no audible speech was detected.",
      });
    }

    // Step 2: Pass Transcript to GPT-4o-mini for Multi-bullet Summary + Antigravity Technical Plan
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert AI Agency Technical Architect for Mithun Das AI Automation (mithundas.cloud). Your job is to analyze raw meeting transcripts between Mithun (the AI Architect) and high-ticket clients, and output a structured, comprehensive, multi-bullet executive report AND a step-by-step Technical Implementation Plan.

CRITICAL INSTRUCTIONS:
1. DO NOT summarize client pain points in a single line. Provide thorough, multi-bullet breakdowns capturing every single requirement, objection, feature request, and workflow mentioned.
2. Output your response in valid JSON with the following exact keys:
{
  "clientPainPoints": ["Bullet 1", "Bullet 2", "Bullet 3"],
  "requiredWorkflows": ["Workflow 1", "Workflow 2", "Workflow 3"],
  "budgetAndTimeline": "Mentioned fee, deposit %, currency symbol, and start date",
  "suggestedSOW": "One crisp executive Master Service Agreement deliverable line (15-25 words)",
  "technicalImplementationPlan": "A markdown string containing an Antigravity-style technical implementation plan formatted with Phase 1, Phase 2, Phase 3 node breakdowns."
}`,
        },
        {
          role: "user",
          content: `Full Meeting Transcript:\n"${transcriptText}"`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 1500,
    });

    const aiContent = aiResponse.choices[0]?.message?.content;
    const parsedData = aiContent ? JSON.parse(aiContent) : {};

    return NextResponse.json({
      success: true,
      leadId: leadId || "discovery-lead",
      transcript: transcriptText,
      insights: {
        clientPainPoints: parsedData.clientPainPoints || [],
        requiredWorkflows: parsedData.requiredWorkflows || [],
        budgetAndTimeline: parsedData.budgetAndTimeline || "",
        suggestedSOW: parsedData.suggestedSOW || "",
        technicalImplementationPlan: parsedData.technicalImplementationPlan || "",
      },
    });
  } catch (error) {
    logger.error("Failed to transcribe and analyze meeting audio", "transcribe_meeting_error", error);
    return NextResponse.json(
      { error: "Failed to transcribe and analyze meeting audio" },
      { status: 500 }
    );
  }
}
