import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "mithundas_leadgen_secure_token_2026";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8778455466:AAFCpetM_e7Hxxqxl28WwUPuSI87VffTuVM";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "5000978436";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mithundas.cloud";

function escapeHtml(str: string = ""): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

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

// 2. Inbound Event Handler (POST): Handles Message Replies, History Storage & Delivery Statuses
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

        // 1. Update LeadChatMessage status if wamid matches
        if (wamid) {
          try {
            await (prisma as any).leadChatMessage.updateMany({
              where: { wamid },
              data: { status: metaStatus.toUpperCase() }
            });
          } catch (chatErr) {
            console.warn("[Meta Webhook] Error updating LeadChatMessage status:", chatErr);
          }
        }

        // 2. Find matching lead in database
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
              data: { outreachStatus: "READ" }
            });
            console.log(`[Meta Webhook] Lead "${lead.businessName}" marked as READ 👀`);
          } else if (metaStatus === "delivered" && lead.outreachStatus !== "READ") {
            await prisma.scrapedLead.update({
              where: { id: lead.id },
              data: { outreachStatus: "DELIVERED" }
            });
            console.log(`[Meta Webhook] Lead "${lead.businessName}" marked as DELIVERED 📬`);
          } else if (metaStatus === "failed") {
            await prisma.scrapedLead.update({
              where: { id: lead.id },
              data: { outreachStatus: "FAILED" }
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
        const wamid = message.id;

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

        console.log(`[Meta Webhook] Inbound reply from +${fromPhone}: "${messageText}" (WAMID: ${wamid})`);

        // 1. Find matching lead in database (by phone suffix, clean digits)
        const lead = await prisma.scrapedLead.findFirst({
          where: {
            OR: [
              { whatsappNumber: { contains: phoneSuffix } },
              { phone: { contains: phoneSuffix } }
            ]
          }
        });

        if (lead) {
          // Update lead status to REPLIED
          await prisma.scrapedLead.update({
            where: { id: lead.id },
            data: {
              outreachStatus: "REPLIED",
              lastReplyMessage: messageText,
              repliedAt: new Date()
            }
          });
          console.log(`[Meta Webhook] Lead "${lead.businessName}" flipped to 💬 REPLIED!`);

          // Save message in LeadChatMessage table
          try {
            await (prisma as any).leadChatMessage.create({
              data: {
                leadId: lead.id,
                sender: "CLIENT",
                direction: "INBOUND",
                channel: "WHATSAPP",
                messageText: messageText,
                wamid: wamid || null,
                status: "DELIVERED",
                rawPayload: JSON.stringify(message)
              }
            });
            console.log(`[Meta Webhook] Saved inbound message to LeadChatMessage for "${lead.businessName}"`);
          } catch (msgErr) {
            console.error("[Meta Webhook] Error saving LeadChatMessage:", msgErr);
          }
        } else {
          console.log(`[Meta Webhook] Inbound message from +${fromPhone} does not match an existing lead. Phone suffix: ${phoneSuffix}`);
        }

        // 2. Send Instant Bulletproof Telegram Push Alert (HTML mode)
        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
          try {
            const leadName = lead?.businessName || "Prospective Client";
            const category = lead?.category || "Local Business";
            const city = lead?.city || "West Bengal";
            const directChatUrl = `https://wa.me/${fromPhone}`;
            const dashboardChatUrl = `${SITE_URL}/admin/lead-generation`;

            const alertHtml =
              `🚨 <b>HOT CLIENT REPLY RECEIVED!</b> 🚨\n\n` +
              `🏢 <b>Business:</b> ${escapeHtml(leadName)}\n` +
              `🏷️ <b>Category:</b> ${escapeHtml(category)}\n` +
              `📍 <b>Location:</b> ${escapeHtml(city)}\n` +
              `📱 <b>Phone:</b> <code>+${fromPhone}</code>\n` +
              `💬 <b>Client Reply:</b> <i>"${escapeHtml(messageText)}"</i>\n\n` +
              `⏱️ <b>Status:</b> 🟢 24h Free Reply Window is ACTIVE!\n\n` +
              `💻 <a href="${dashboardChatUrl}">Open CRM Live Chat</a>\n` +
              `👉 <a href="${directChatUrl}">Click to Reply on WhatsApp</a>`;

            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: alertHtml,
                parse_mode: "HTML"
              })
            });
            console.log(`[Meta Webhook] Telegram push alert delivered for ${leadName}!`);
          } catch (teleErr) {
            console.error("[Meta Webhook] Telegram notification error:", teleErr);
          }
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" });
  } catch (error: any) {
    console.error("[Meta Webhook] Error processing inbound webhook:", error);
    return NextResponse.json({ status: "EVENT_RECEIVED", error: error.message }, { status: 200 });
  }
}
