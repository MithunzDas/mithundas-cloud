import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "mithundas_leadgen_secure_token_2026";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

// Webhook Handshake (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// Inbound Message Handler (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0]?.value;
    const message = changes?.messages?.[0];

    if (message) {
      const fromPhone = message.from; // e.g. 919800123456
      const messageText = message.text?.body || message?.button?.text || "Replied via Quick Button";

      // 1. Find matching lead in VPS DB
      const lead = await prisma.scrapedLead.findFirst({
        where: {
          OR: [
            { whatsappNumber: { contains: fromPhone.slice(-10) } },
            { phone: { contains: fromPhone.slice(-10) } }
          ]
        }
      });

      if (lead) {
        // 2. Update status to REPLIED
        await prisma.scrapedLead.update({
          where: { id: lead.id },
          data: {
            outreachStatus: "REPLIED",
            lastReplyMessage: messageText,
            repliedAt: new Date()
          }
        });
      }

      // 3. Send Instant Telegram Push Notification to Mithun
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const leadName = lead?.businessName || "New Prospective Client";
        const city = lead?.city || "Local City";
        const directChatUrl = `https://wa.me/${fromPhone}`;

        const alertText = `🚨 *HOT LEAD INQUIRY RECEIVED!* 🚨\n\n` +
          `🏢 *Business:* ${leadName}\n` +
          `📍 *Location:* ${city}\n` +
          `📱 *Phone:* +${fromPhone}\n` +
          `💬 *Message:* "${messageText}"\n\n` +
          `👉 [Chat with Client on WhatsApp](${directChatUrl})`;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: alertText,
            parse_mode: "Markdown"
          })
        }).catch(err => console.error("Telegram alert failed:", err));
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" });
  } catch (error: any) {
    console.error("Error processing inbound WhatsApp webhook:", error);
    return NextResponse.json({ status: "ERROR", error: error.message }, { status: 500 });
  }
}
