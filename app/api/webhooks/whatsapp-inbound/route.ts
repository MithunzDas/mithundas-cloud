import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "mithundas_leadgen_secure_token_2026";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

// 1. Webhook Handshake (GET) for Meta WhatsApp verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[Meta Webhook] GET Handshake successful with challenge:", challenge);
    return new Response(challenge, { status: 200 });
  }

  console.warn("[Meta Webhook] GET Handshake failed. Invalid token or mode.");
  return new Response("Forbidden", { status: 403 });
}

// 2. Inbound Event Handler (POST): Handles Message Replies AND Delivery Statuses
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0]?.value;

    // =========================================================================
    // CASE A: MESSAGE DELIVERY STATUS UPDATES (DELIVERED, READ, FAILED)
    // =========================================================================
    const statuses = changes?.statuses;
    if (statuses && Array.isArray(statuses) && statuses.length > 0) {
      for (const statusObj of statuses) {
        const metaStatus = statusObj.status; // "sent", "delivered", "read", "failed"
        const recipientPhone = statusObj.recipient_id; // e.g. "917679160114"
        const wamid = statusObj.id;

        if (!recipientPhone) continue;
        const phoneSuffix = recipientPhone.replace(/\D/g, "").slice(-10);

        console.log(`[Meta Webhook] Delivery status for +${recipientPhone}: ${metaStatus} (ID: ${wamid})`);

        // Find matching lead in database
        const lead = await prisma.scrapedLead.findFirst({
          where: {
            OR: [
              { whatsappNumber: { contains: phoneSuffix } },
              { phone: { contains: phoneSuffix } }
            ]
          }
        });

        if (lead) {
          // Status state machine: Never overwrite "REPLIED" with a mere "read" or "delivered"
          if (lead.outreachStatus === "REPLIED") {
            continue;
          }

          if (metaStatus === "read") {
            await prisma.scrapedLead.update({
              where: { id: lead.id },
              data: {
                outreachStatus: "READ"
              }
            });
            console.log(`[Meta Webhook] Lead "${lead.businessName}" marked as READ 👀`);
          } else if (metaStatus === "delivered" && lead.outreachStatus !== "READ") {
            await prisma.scrapedLead.update({
              where: { id: lead.id },
              data: {
                outreachStatus: "DELIVERED"
              }
            });
            console.log(`[Meta Webhook] Lead "${lead.businessName}" marked as DELIVERED 📬`);
          } else if (metaStatus === "failed") {
            await prisma.scrapedLead.update({
              where: { id: lead.id },
              data: {
                outreachStatus: "FAILED"
              }
            });
            console.warn(`[Meta Webhook] Lead "${lead.businessName}" outreach FAILED ❌`);
          }
        }
      }
    }

    // =========================================================================
    // CASE B: INBOUND MESSAGES & CLIENT REPLIES (TEXT, BUTTONS, QUICK REPLIES)
    // =========================================================================
    const messages = changes?.messages;
    if (messages && Array.isArray(messages) && messages.length > 0) {
      for (const message of messages) {
        const fromPhone = message.from; // e.g. "917679160114"
        const phoneSuffix = fromPhone.replace(/\D/g, "").slice(-10);

        // Extract message content from all possible WhatsApp message types
        let messageText = "Customer replied via WhatsApp";
        if (message.text?.body) {
          messageText = message.text.body;
        } else if (message.interactive?.button_reply?.title) {
          messageText = message.interactive.button_reply.title;
        } else if (message.interactive?.list_reply?.title) {
          messageText = message.interactive.list_reply.title;
        } else if (message.button?.text) {
          messageText = message.button.text;
        } else if (message.type) {
          messageText = `[${message.type} received]`;
        }

        console.log(`[Meta Webhook] Inbound reply from +${fromPhone}: "${messageText}"`);

        // Find matching lead in database
        const lead = await prisma.scrapedLead.findFirst({
          where: {
            OR: [
              { whatsappNumber: { contains: phoneSuffix } },
              { phone: { contains: phoneSuffix } }
            ]
          }
        });

        if (lead) {
          await prisma.scrapedLead.update({
            where: { id: lead.id },
            data: {
              outreachStatus: "REPLIED",
              lastReplyMessage: messageText,
              repliedAt: new Date()
            }
          });
          console.log(`[Meta Webhook] Lead "${lead.businessName}" flipped to 💬 REPLIED!`);
        }

        // Send Instant Telegram Alert if configured
        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
          const leadName = lead?.businessName || "Prospective Client";
          const city = lead?.city || "West Bengal";
          const directChatUrl = `https://wa.me/${fromPhone}`;

          const alertText =
            `🚨 *HOT CLIENT REPLY RECEIVED!* 🚨\n\n` +
            `🏢 *Business:* ${leadName}\n` +
            `📍 *Location:* ${city}\n` +
            `📱 *Phone:* +${fromPhone}\n` +
            `💬 *Reply:* "${messageText}"\n\n` +
            `👉 [Click to Reply on WhatsApp](${directChatUrl})`;

          fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: alertText,
              parse_mode: "Markdown"
            })
          }).catch((err) => console.error("Telegram notification failed:", err));
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" });
  } catch (error: any) {
    console.error("Error processing inbound WhatsApp webhook:", error);
    return NextResponse.json({ status: "ERROR", error: error.message }, { status: 500 });
  }
}
