import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { LeadPayload } from "../services/n8n/n8n";

const prisma = new PrismaClient();
const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function main() {
  console.log("Starting migration from JSON to SQLite...");
  
  try {
    const content = await fs.readFile(LEADS_FILE, "utf-8");
    const leads: LeadPayload[] = JSON.parse(content);
    
    if (leads.length === 0) {
      console.log("No leads found in leads.json. Exiting.");
      return;
    }
    
    console.log(`Found ${leads.length} leads in JSON. Migrating...`);
    
    for (const lead of leads) {
      await prisma.lead.upsert({
        where: { leadId: lead.leadId },
        update: {
          status: lead.status,
          // other fields update if needed
        },
        create: {
          leadId: lead.leadId,
          name: lead.name,
          email: lead.email,
          company: lead.company,
          businessType: lead.businessType,
          budget: lead.budget,
          timeline: lead.timeline,
          projectRequirement: lead.projectRequirement,
          whatsapp: lead.whatsapp || null,
          country: lead.country || null,
          status: lead.status,
          submittedAt: lead.submittedAt ? new Date(lead.submittedAt) : new Date(),
        },
      });
      console.log(`Migrated lead: ${lead.leadId}`);
    }
    
    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
