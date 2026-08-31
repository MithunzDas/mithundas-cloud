import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "992910547249865";
const ACCESS_TOKEN = process.env.META_WHATSAPP_TOKEN || "EAARuEAVZBFfMBScJHrvDD3jqcaWjN2l8Q74tW8dpANvwFZASdZCu7txdd3wo5SU7ZAillh975rbj8EdKtKQMWSAI0stPux5mb13GrZA833N3JbzDYssw7eZB2RWnRoR8sBLVByafOPGUZCO15MhRWAWmqJIWp1zCQAJi4DAk1ZBPqlUwN5IOcbZBEbi1cV07cAZC31ZADJ6ZCHhjnfgZBLAILkaGyZAiLTPvDoJZATqUIQConNsjqTcuZAXV5hML0mMUj9m1GNBZCV14i0BVPW28TbnzItusUZCRWQEQZDZD";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadIds, templateName = "local_business_starter" } = body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ success: false, error: "No leads selected for outreach" }, { status: 400 });
    }

    const leads = await prisma.scrapedLead.findMany({
      where: { leadId: { in: leadIds } }
    });

    const results = [];

    for (const lead of leads) {
      const rawPhone = (lead.whatsappNumber || lead.phone || "").replace(/\D/g, "");
      if (!rawPhone || rawPhone.length < 10) continue;

      let cleanPhone = rawPhone;
      if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
      if (cleanPhone.startsWith("0")) cleanPhone = `91${cleanPhone.slice(1)}`;

      try {
        const res = await fetch(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: cleanPhone,
            type: "template",
            template: {
              name: templateName,
              language: { code: "en_US" }
            }
          })
        });

        const data = await res.json();
        if (res.ok) {
          await prisma.scrapedLead.update({
            where: { id: lead.id },
            data: {
              outreachStatus: "SENT",
              contactedAt: new Date()
            }
          });
          results.push({ leadId: lead.leadId, phone: cleanPhone, status: "SENT" });
        } else {
          results.push({ leadId: lead.leadId, phone: cleanPhone, status: "FAILED", error: data });
        }
      } catch (err: any) {
        results.push({ leadId: lead.leadId, phone: cleanPhone, status: "ERROR", error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      totalProcessed: results.length,
      sentCount: results.filter(r => r.status === "SENT").length,
      results
    });
  } catch (error: any) {
    console.error("Error executing Meta WhatsApp outreach:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
