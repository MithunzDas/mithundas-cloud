import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_NUMBER_ID || "992910547249865";
const ACCESS_TOKEN = process.env.META_WHATSAPP_TOKEN || "EAARuEAVZBFfMBSeoGtvEZBbY0szziHu9ZA60JxIfCGciJMZC8X64eXOlQMjd5UtbqMGvyzRZAOrcRgUYTaIIrW5HljsTKzgfeNU2kJnvSwsZCtSNpE62Gr8GLpp8IudVSnGUvqGN7bcrOjfy41Sy8urjvd4BZBS6NxuPycJpB0wpZBABfm8VnpyIPGkdVK7v";

// 1. GET: Fetch conversation history for a lead
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");

    if (!leadId) {
      return NextResponse.json({ success: false, error: "leadId is required" }, { status: 400 });
    }

    const lead = await prisma.scrapedLead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        businessName: true,
        category: true,
        city: true,
        phone: true,
        whatsappNumber: true,
        outreachStatus: true,
        lastReplyMessage: true,
        repliedAt: true,
        contactedAt: true
      }
    });

    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    // Determine 24-hour window status
    let is24hWindowActive = false;
    let remainingMinutes = 0;

    if (lead.repliedAt) {
      const elapsedMs = Date.now() - new Date(lead.repliedAt).getTime();
      const windowTotalMs = 24 * 60 * 60 * 1000;
      if (elapsedMs < windowTotalMs) {
        is24hWindowActive = true;
        remainingMinutes = Math.max(0, Math.floor((windowTotalMs - elapsedMs) / (60 * 1000)));
      }
    }

    // Fetch chronological messages
    const messages = await (prisma as any).leadChatMessage.findMany({
      where: { leadId },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json({
      success: true,
      lead,
      is24hWindowActive,
      remainingMinutes,
      messages
    });
  } catch (error: any) {
    console.error("[Chat API GET] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: Send manual message to client via Meta WhatsApp Cloud API (+91 82509 68170)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, messageText } = body;

    if (!leadId || !messageText || !messageText.trim()) {
      return NextResponse.json({ success: false, error: "leadId and messageText are required" }, { status: 400 });
    }

    const lead = await prisma.scrapedLead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const rawPhone = (lead.whatsappNumber || lead.phone || "").replace(/\D/g, "");
    if (!rawPhone || rawPhone.length < 10) {
      return NextResponse.json({ success: false, error: "Valid phone number not found for this lead" }, { status: 400 });
    }

    // Standardize to 91XXXXXXXXXX
    const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

    console.log(`[Chat API POST] Sending manual WhatsApp message to +${cleanPhone} for "${lead.businessName}"`);

    const metaRes = await fetch(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanPhone,
        type: "text",
        text: {
          preview_url: true,
          body: messageText.trim()
        }
      })
    });

    const metaData = await metaRes.json();

    if (!metaRes.ok || metaData.error) {
      console.warn("[Chat API POST] Meta API Error:", metaData.error);
      const isOutside24h = metaData.error?.code === 131047 || metaData.error?.message?.includes("24 hours");

      return NextResponse.json({
        success: false,
        error: isOutside24h ? "OUTSIDE_24H_WINDOW" : (metaData.error?.message || "Failed to send message"),
        errorCode: metaData.error?.code,
        details: isOutside24h
          ? "More than 24 hours have passed since the client last replied. Meta allows free-form messaging only within 24 hours of an inbound reply. Use personal WhatsApp (wa.me) or an approved template."
          : metaData.error?.message
      }, { status: 400 });
    }

    const wamid = metaData.messages?.[0]?.id || null;

    // Save outbound message to LeadChatMessage
    const savedMessage = await (prisma as any).leadChatMessage.create({
      data: {
        leadId: lead.id,
        sender: "ADMIN",
        direction: "OUTBOUND",
        channel: "WHATSAPP",
        messageText: messageText.trim(),
        wamid,
        status: "SENT",
        rawPayload: JSON.stringify(metaData)
      }
    });

    return NextResponse.json({
      success: true,
      message: savedMessage,
      metaResponse: metaData
    });
  } catch (error: any) {
    console.error("[Chat API POST] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
