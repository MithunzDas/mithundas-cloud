import { PrismaClient } from "@prisma/client";
import { LeadPayload, LeadStatus } from "@/services/n8n/n8n";
import { logger } from "./logger";

// Initialize a single instance of Prisma Client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getLeads(): Promise<LeadPayload[]> {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { submittedAt: 'desc' }
    });
    return leads.map(lead => ({
      ...lead,
      status: lead.status as LeadStatus,
      submittedAt: lead.submittedAt.toISOString(),
      whatsapp: lead.whatsapp ?? undefined,
      country: lead.country ?? undefined,
      aiScore: lead.aiScore ?? undefined,
      aiSummary: lead.aiSummary ?? undefined
    }));
  } catch (error) {
    logger.error("Failed to fetch leads from database", "db_read_error", error);
    return [];
  }
}

export async function saveLead(lead: LeadPayload): Promise<void> {
  try {
    await prisma.lead.create({
      data: {
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
        submittedAt: new Date(lead.submittedAt),
      }
    });
    logger.info(`Lead ${lead.leadId} successfully saved to database`, "db_save_success");
  } catch (error) {
    logger.error(`Failed to save lead ${lead.leadId} to database`, "db_save_error", error);
    throw error;
  }
}

export async function getLeadById(id: string): Promise<LeadPayload | null> {
  try {
    const lead = await prisma.lead.findUnique({
      where: { leadId: id }
    });
    if (!lead) return null;
    return {
      ...lead,
      status: lead.status as LeadStatus,
      submittedAt: lead.submittedAt.toISOString(),
      whatsapp: lead.whatsapp ?? undefined,
      country: lead.country ?? undefined,
      aiScore: lead.aiScore ?? undefined,
      aiSummary: lead.aiSummary ?? undefined
    };
  } catch (error) {
    logger.error(`Failed to fetch lead ${id} from database`, "db_read_id_error", error);
    return null;
  }
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  aiScore?: number,
  aiSummary?: string
): Promise<LeadPayload | null> {
  try {
    const updated = await prisma.lead.update({
      where: { leadId: id },
      data: { 
        status,
        ...(aiScore !== undefined && { aiScore }),
        ...(aiSummary !== undefined && { aiSummary })
      }
    });
    logger.info(`Lead ${id} status updated to ${status} in database`, "db_update_success");
    return {
      ...updated,
      status: updated.status as LeadStatus,
      submittedAt: updated.submittedAt.toISOString(),
      whatsapp: updated.whatsapp ?? undefined,
      country: updated.country ?? undefined,
      aiScore: updated.aiScore ?? undefined,
      aiSummary: updated.aiSummary ?? undefined
    };
  } catch (error) {
    logger.error(`Failed to update status for lead ${id}`, "db_update_error", error);
    throw error;
  }
}
