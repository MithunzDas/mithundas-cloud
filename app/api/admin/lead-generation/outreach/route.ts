import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_NUMBER_ID || "992910547249865";
const ACCESS_TOKEN = process.env.META_WHATSAPP_TOKEN || "EAARuEAVZBFfMBSeoGtvEZBbY0szziHu9ZA60JxIfCGciJMZC8X64eXOlQMjd5UtbqMGvyzRZAOrcRgUYTaIIrW5HljsTKzgfeNU2kJnvSwsZCtSNpE62Gr8GLpp8IudVSnGUvqGN7bcrOjfy41Sy8urjvd4BZBS6NxuPycJpB0wpZBABfm8VnpyIPGkdVK7v";

/**
 * Dynamic Category Demo Router:
 * Maps lead category and business name to the corresponding high-converting demo showcase.
 */
export function getDemoRoutingForLead(category: string = "", businessName: string = ""): {
  slug: string;
  url: string;
  label: string;
  icon: string;
} {
  const text = `${category} ${businessName}`.toLowerCase();

  // 1. Lawyers, Advocates, Legal Chambers & Law Firms
  if (
    text.includes("advocate") ||
    text.includes("lawyer") ||
    text.includes("legal") ||
    text.includes("attorney") ||
    text.includes("solicitor") ||
    text.includes("counsel") ||
    text.includes("chamber") ||
    text.includes("court") ||
    text.includes("bar council") ||
    text.includes("notary") ||
    text.includes("vakil")
  ) {
    return {
      slug: "demo-lawyer",
      url: "https://mithundas.cloud/demo-lawyer",
      label: "Lawyer & Advocate",
      icon: "⚖️"
    };
  }

  // 2. Healthcare / Dental / Clinics / Doctors / Salons
  if (
    text.includes("dent") ||
    text.includes("teeth") ||
    text.includes("clinic") ||
    text.includes("doctor") ||
    text.includes("hospital") ||
    text.includes("dermatolog") ||
    text.includes("skin") ||
    text.includes("ortho") ||
    text.includes("physio") ||
    text.includes("health") ||
    text.includes("care") ||
    text.includes("salon") ||
    text.includes("spa")
  ) {
    return {
      slug: "demo-dental-clinic",
      url: "https://mithundas.cloud/demo-dental-clinic",
      label: "Dental & Clinic",
      icon: "🦷"
    };
  }

  // 3. Restaurants / Food / Dining / Biryani / Sweets / Dhaba
  if (
    text.includes("restaurant") ||
    text.includes("dining") ||
    text.includes("dine") ||
    text.includes("food") ||
    text.includes("biryani") ||
    text.includes("dhaba") ||
    text.includes("bistro") ||
    text.includes("pizza") ||
    text.includes("sweet") ||
    text.includes("bar") ||
    text.includes("kitchen") ||
    text.includes("cater")
  ) {
    return {
      slug: "demo-restaurant",
      url: "https://mithundas.cloud/demo-restaurant",
      label: "Restaurant & Dining",
      icon: "🍽️"
    };
  }

  // 4. Hotel / Resorts / Lodges / Stays
  if (
    text.includes("hotel") ||
    text.includes("resort") ||
    text.includes("lodge") ||
    text.includes("stay") ||
    text.includes("inn") ||
    text.includes("guest house")
  ) {
    return {
      slug: "demo-hotel",
      url: "https://mithundas.cloud/demo-hotel",
      label: "Hotel & Resort",
      icon: "🏨"
    };
  }

  // 5. Cafe / Coffee / Bakery / Tea
  if (
    text.includes("cafe") ||
    text.includes("coffee") ||
    text.includes("tea") ||
    text.includes("bakery")
  ) {
    return {
      slug: "demo-cafe",
      url: "https://mithundas.cloud/demo-cafe",
      label: "Cafe & Bakery",
      icon: "☕"
    };
  }

  // Fallback default
  return {
    slug: "demo-dental-clinic",
    url: "https://mithundas.cloud/demo-dental-clinic",
    label: "Local Business",
    icon: "✨"
  };
}

// Utility: Sleep helper for anti-ban rate limiting
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

    if (leads.length === 0) {
      return NextResponse.json({ success: false, error: "Selected leads not found in database" }, { status: 404 });
    }

    const results = [];

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      const rawPhone = (lead.whatsappNumber || lead.phone || "").replace(/\D/g, "");
      
      if (!rawPhone || rawPhone.length < 10) {
        results.push({
          leadId: lead.leadId,
          businessName: lead.businessName,
          status: "SKIPPED",
          reason: "Invalid or missing phone number"
        });
        continue;
      }

      // Format Indian phone number standard
      let cleanPhone = rawPhone;
      if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
      if (cleanPhone.startsWith("0")) cleanPhone = `91${cleanPhone.slice(1)}`;

      // 1. Calculate Dynamic Demo Routing per category
      const demoInfo = getDemoRoutingForLead(lead.category, lead.businessName);

      // 2. Prepare Template Parameters for approved "local_business_starter"
      // Clean business name (avoid special character errors)
      const cleanBusinessName = (lead.businessName || "Business Owner")
        .replace(/[\r\n\t]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 55);

      const ratingText = `${lead.rating ? Number(lead.rating).toFixed(1) : "4.8"}★ (${lead.reviewCount || 45}+ reviews)`;
      const cityText = lead.city || "West Bengal";

      const templatePayload = {
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "template",
        template: {
          name: "local_business_starter",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: cleanBusinessName },
                { type: "text", text: ratingText },
                { type: "text", text: cityText }
              ]
            },
            {
              type: "button",
              sub_type: "url",
              index: "1",
              parameters: [
                { type: "text", text: demoInfo.slug }
              ]
            }
          ]
        }
      };

      try {
        console.log(`[Meta Outreach ${i + 1}/${leads.length}] Sending to ${cleanBusinessName} (${cleanPhone}) ➔ ${demoInfo.slug}`);

        const res = await fetch(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(templatePayload)
        });

        const data = await res.json();

        if (res.ok && data.messages && data.messages.length > 0) {
          await prisma.scrapedLead.update({
            where: { id: lead.id },
            data: {
              outreachStatus: "SENT",
              contactedAt: new Date()
            }
          });

          results.push({
            leadId: lead.leadId,
            businessName: cleanBusinessName,
            phone: cleanPhone,
            status: "SENT",
            wamid: data.messages[0].id,
            demoSlug: demoInfo.slug,
            demoUrl: demoInfo.url,
            demoLabel: demoInfo.label
          });
        } else {
          console.error("Meta API dispatch error for lead:", lead.leadId, data);
          results.push({
            leadId: lead.leadId,
            businessName: cleanBusinessName,
            phone: cleanPhone,
            status: "FAILED",
            demoSlug: demoInfo.slug,
            error: data.error?.message || JSON.stringify(data)
          });
        }
      } catch (err: any) {
        console.error("Network error during Meta dispatch:", err);
        results.push({
          leadId: lead.leadId,
          businessName: cleanBusinessName,
          phone: cleanPhone,
          status: "ERROR",
          error: err.message
        });
      }

      // Anti-ban polite delay if multiple leads are being processed
      if (i < leads.length - 1) {
        await sleep(1500);
      }
    }

    const sentCount = results.filter((r) => r.status === "SENT").length;

    return NextResponse.json({
      success: true,
      totalProcessed: results.length,
      sentCount,
      failedCount: results.length - sentCount,
      results
    });
  } catch (error: any) {
    console.error("Error in Meta WhatsApp outreach endpoint:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
