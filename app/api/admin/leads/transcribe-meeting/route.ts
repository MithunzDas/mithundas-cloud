import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { prisma, saveMeetingSummary, MeetingSummaryRecord } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const leadId = formData.get("leadId") as string | null;
    const roomId = (formData.get("roomId") as string | null) || leadId || "discovery-session";

    let clientName = (formData.get("clientName") as string | null) || "";
    let clientCompany = (formData.get("clientCompany") as string | null) || "";
    let clientEmail = (formData.get("clientEmail") as string | null) || "";

    // If client metadata is missing from form data, query database
    if (leadId && (!clientName || !clientEmail)) {
      try {
        const booking = await prisma.booking.findUnique({ where: { bookingId: leadId } });
        if (booking) {
          clientName = clientName || booking.name;
          clientCompany = clientCompany || booking.company;
          clientEmail = clientEmail || booking.email;
        } else {
          const lead = await prisma.lead.findUnique({ where: { leadId } });
          if (lead) {
            clientName = clientName || lead.name;
            clientCompany = clientCompany || lead.company;
            clientEmail = clientEmail || lead.email;
          }
        }
      } catch (dbErr) {
        logger.warn("Could not query booking or lead for meeting dossier metadata", "dossier_db_warn", { error: String(dbErr) });
      }
    }

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

    // Step 2: Pass Transcript to GPT-4o-mini for In-Depth Executive Intelligence
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert AI Agency Technical Architect for Mithun Das AI Automation (mithundas.cloud). Your job is to analyze raw meeting transcripts between Mithun (the AI Architect) and high-ticket clients, and output a structured, comprehensive, executive meeting intelligence report.

CRITICAL INSTRUCTIONS:
1. CRITICAL OBJECTIVES: Extract exactly what high-impact systems, special capabilities, or critical automations the client wants to build.
2. KEY DISCUSSION POINTS: Provide exactly 3 to 4 punchy, high-impact bullet points summarizing the entire core discussion (what the conversation was about, main requirements, client objections, and agreed operational direction).
3. PAYMENT & FINANCIAL SCOPE: Extract the total project fee mentioned, required upfront deposit percentage or amount (e.g. 50% upfront to initiate sprint), currency, and timeline/milestones.
4. SOW: Provide a crisp executive Master Service Agreement deliverable line (15-25 words).
5. CLIENT PAIN POINTS: Breakdown all friction points, bottlenecks, and manual overhead mentioned.
6. REQUIRED WORKFLOWS: List every workflow to build (Next.js frontend, n8n webhook pipelines, OpenAI document parsing, CRM sync).
7. TECHNICAL PLAN: Formatted step-by-step with Phase 1 (Foundation), Phase 2 (Automation Core), Phase 3 (Delivery).

Output your response in valid JSON with the following exact keys:
{
  "criticalObjectives": [
    "Objective 1: What they want to build",
    "Objective 2: Special capability requested"
  ],
  "keyDiscussionPoints": [
    "Discussion Point 1 (Core topic of the conversation)",
    "Discussion Point 2 (Specific operational bottleneck)",
    "Discussion Point 3 (Agreed architecture & scope)",
    "Discussion Point 4 (Expected timeline & next steps)"
  ],
  "paymentClarification": {
    "totalFee": "Mentioned or estimated project fee with currency symbol",
    "depositPercentage": "Required upfront deposit percentage or amount (e.g. '50% upfront deposit to begin')",
    "milestones": "Expected sprint timeline and delivery kickoff window"
  },
  "budgetAndTimeline": "Crisp one-line summary of fee, deposit %, currency symbol, and start date",
  "suggestedSOW": "One crisp executive Master Service Agreement deliverable line (15-25 words)",
  "clientPainPoints": ["Pain Point 1", "Pain Point 2", "Pain Point 3"],
  "requiredWorkflows": ["Workflow 1", "Workflow 2", "Workflow 3"],
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
      max_tokens: 1800,
    });

    const aiContent = aiResponse.choices[0]?.message?.content;
    const parsedData = aiContent ? JSON.parse(aiContent) : {};

    const insights = {
      criticalObjectives: parsedData.criticalObjectives || [],
      keyDiscussionPoints: parsedData.keyDiscussionPoints || [],
      suggestedSOW: parsedData.suggestedSOW || "",
      paymentClarification: parsedData.paymentClarification || {
        totalFee: parsedData.budgetAndTimeline || "Discussed on call",
        depositPercentage: "50% upfront to initiate sprint",
        milestones: "Immediate upon deposit",
      },
      budgetAndTimeline: parsedData.budgetAndTimeline || "",
      clientPainPoints: parsedData.clientPainPoints || [],
      requiredWorkflows: parsedData.requiredWorkflows || [],
      technicalImplementationPlan: parsedData.technicalImplementationPlan || "",
    };

    // Step 3: Resiliently Save Meeting Summary to Database and Client Profile
    // NOTE: Automated email dispatch is completely disabled per strict instruction.
    const meetingDateStr = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const summaryRecord: MeetingSummaryRecord = {
      id: `meet_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      roomId,
      leadId: leadId || undefined,
      bookingId: leadId || undefined,
      clientName: clientName || "Discovery Guest",
      clientEmail: clientEmail || "Not provided",
      companyName: clientCompany || "Client Business",
      meetingDate: meetingDateStr,
      criticalObjectives: insights.criticalObjectives,
      keyDiscussionPoints: insights.keyDiscussionPoints,
      paymentInfo: {
        totalFee: insights.paymentClarification.totalFee,
        depositPercentage: insights.paymentClarification.depositPercentage,
        milestones: insights.paymentClarification.milestones,
      },
      suggestedSOW: insights.suggestedSOW,
      clientPainPoints: insights.clientPainPoints,
      requiredWorkflows: insights.requiredWorkflows,
      technicalImplementationPlan: insights.technicalImplementationPlan,
      transcript: transcriptText,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveMeetingSummary(summaryRecord);
      logger.info(`Successfully stored meeting intelligence record for ${summaryRecord.clientName} (${summaryRecord.companyName})`, "meeting_summary_stored");
    } catch (saveErr) {
      logger.error("Failed to persist meeting summary record", "meeting_summary_save_error", saveErr);
    }

    return NextResponse.json({
      success: true,
      leadId: leadId || "discovery-lead",
      transcript: transcriptText,
      insights,
      summaryRecord,
    });
  } catch (error) {
    logger.error("Failed to transcribe and analyze meeting audio", "transcribe_meeting_error", error);
    return NextResponse.json(
      { error: "Failed to transcribe and analyze meeting audio" },
      { status: 500 }
    );
  }
}


