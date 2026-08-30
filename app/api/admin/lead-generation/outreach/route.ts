import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "992910547249865";
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "EAARuEAVZBFfMBSTqZBudLVuCiV0mSt75gw3OQxDBb67Dv3umkTAviKvdW1a8IinRd3NTOxS4NRZC6BZASlhy7vr06sJ7SVoJUxfjcQHf8YsyE1OM4JHwQf47LKxdZBENMAKQbRIrouZCiL7oEKCFu76DTFQ1J52HwVXZBiXPqBeTpbORK4gub7GHRZBqZCIVtLX6DjctAAcgkAfAbzI2ZBZCTHPFTcoYtloukXjNFqnqYcKNRhSsIsEVOpZCbbWF5idLb4AuQ8678MFUKVtZCQeuVRSOpPder";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadIds, templateName = "hello_world" } = body;

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
