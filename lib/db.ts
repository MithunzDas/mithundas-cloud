import fs from "fs/promises";
import path from "path";
import { LeadPayload, LeadStatus } from "@/services/n8n/n8n";
import { logger } from "./logger";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function ensureFileExists() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(LEADS_FILE);
    } catch {
      await fs.writeFile(LEADS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    logger.error("Failed to initialize database directories", "db_init_error", error);
  }
}

export async function getLeads(): Promise<LeadPayload[]> {
  await ensureFileExists();
  try {
    const content = await fs.readFile(LEADS_FILE, "utf-8");
    return JSON.parse(content) as LeadPayload[];
  } catch (error) {
    logger.error("Failed to read leads from file database", "db_read_error", error);
    return [];
  }
}

export async function saveLead(lead: LeadPayload): Promise<void> {
  await ensureFileExists();
  try {
    const leads = await getLeads();
    leads.unshift(lead); // Put new lead at the top
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
    logger.info(`Lead ${lead.leadId} successfully saved to file database`, "db_save_success");
  } catch (error) {
    logger.error(`Failed to save lead ${lead.leadId} to file database`, "db_save_error", error);
    throw error;
  }
}

export async function getLeadById(id: string): Promise<LeadPayload | null> {
  const leads = await getLeads();
  return leads.find((l) => l.leadId === id) || null;
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<LeadPayload | null> {
  await ensureFileExists();
  try {
    const leads = await getLeads();
    const index = leads.findIndex((l) => l.leadId === id);
    if (index === -1) {
      logger.warn(`Lead ${id} not found for status update`, "db_update_not_found");
      return null;
    }
    leads[index] = {
      ...leads[index],
      status,
    };
    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
    logger.info(`Lead ${id} status updated to ${status} in file database`, "db_update_success");
    return leads[index];
  } catch (error) {
    logger.error(`Failed to update status for lead ${id}`, "db_update_error", error);
    throw error;
  }
}
