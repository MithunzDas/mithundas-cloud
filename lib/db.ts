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
    await prisma.lead.upsert({
      where: { leadId: lead.leadId },
      update: {
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
        submittedAt: new Date(lead.submittedAt),
      },
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
    const leadExists = await prisma.lead.findUnique({
      where: { leadId: id }
    });
    if (!leadExists) {
      logger.warn(`Lead ${id} not found in database for status update`, "db_update_not_found");
      return null;
    }

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
    return null;
  }
}

export interface EmailLogPayload {
  id?: string;
  leadId?: string;
  toEmail: string;
  fromEmail: string;
  subject: string;
  category: string;
  htmlContent?: string;
  status?: string;
  sentAt?: string;
}

export async function saveEmailLog(data: {
  leadId?: string;
  toEmail: string;
  fromEmail: string;
  subject: string;
  category: string;
  htmlContent?: string;
  status?: string;
}): Promise<void> {
  try {
    await prisma.emailLog.create({
      data: {
        leadId: data.leadId || null,
        toEmail: data.toEmail,
        fromEmail: data.fromEmail,
        subject: data.subject,
        category: data.category,
        htmlContent: data.htmlContent || null,
        status: data.status || "sent",
      },
    });
    logger.info(`Email log saved: ${data.category} to ${data.toEmail}`, "email_log_save_success");
  } catch (error) {
    logger.error("Failed to save email log to database", "email_log_save_error", error);
  }
}

export async function getEmailLogs(leadId?: string): Promise<EmailLogPayload[]> {
  try {
    const logs = await prisma.emailLog.findMany({
      where: leadId ? { leadId } : undefined,
      orderBy: { sentAt: "desc" },
      take: 100,
    });
    return logs.map((log) => ({
      ...log,
      leadId: log.leadId ?? undefined,
      htmlContent: log.htmlContent ?? undefined,
      sentAt: log.sentAt.toISOString(),
    }));
  } catch (error) {
    logger.error("Failed to fetch email logs from database", "email_log_read_error", error);
    return [];
  }
}

export interface BookingPayload {
  id?: string;
  bookingId: string;
  name: string;
  email: string;
  company: string;
  businessType?: string;
  projectRequirement?: string;
  date: string;
  time: string;
  timeZone?: string;
  meetUrl: string;
  status?: string;
  createdAt?: string;
}

import fs from "fs";
import path from "path";

const LOCAL_SLOTS_FILE = path.join(process.cwd(), ".booked_slots.json");
const TMP_SLOTS_FILE = "/tmp/booked_slots.json";

function getLocalSlots(): { date: string; time: string; bookingId: string }[] {
  try {
    const fileToRead = fs.existsSync(LOCAL_SLOTS_FILE) ? LOCAL_SLOTS_FILE : (fs.existsSync(TMP_SLOTS_FILE) ? TMP_SLOTS_FILE : null);
    if (fileToRead) {
      const data = fs.readFileSync(fileToRead, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    // Ignore read errors
  }
  return [];
}

function saveLocalSlot(slot: { date: string; time: string; bookingId: string }) {
  try {
    // Always remove any previous slot for this bookingId FIRST (so rescheduling frees up old slot)
    const current = getLocalSlots().filter((s) => s.bookingId !== slot.bookingId);
    const normalize = (t: string) => (t || "").replace(/^0/, "").toUpperCase().trim();
    const exists = current.some((s) => s.date === slot.date && normalize(s.time) === normalize(slot.time));
    if (!exists) {
      current.push(slot);
      const data = JSON.stringify(current, null, 2);
      try { fs.writeFileSync(LOCAL_SLOTS_FILE, data); } catch (e) {}
      try { fs.writeFileSync(TMP_SLOTS_FILE, data); } catch (e) {}
    }
  } catch (e) {
    // Ignore write errors
  }
}

export async function getBookedSlotsFromDB(): Promise<{ date: string; time: string; bookingId: string }[]> {
  const allSlots: { date: string; time: string; bookingId: string }[] = [...getLocalSlots()];

  // 1. Try Prisma Booking Table
  try {
    const bookings = await (prisma as any).booking.findMany({
      where: { status: "confirmed" },
      select: { date: true, time: true, bookingId: true },
    });
    if (Array.isArray(bookings) && bookings.length > 0) {
      allSlots.push(...bookings);
    }
  } catch (error) {
    // Booking table might not exist yet
  }

  // 2. Try parsing Lead records for discovery call notes
  try {
    const leads = await prisma.lead.findMany({
      select: { leadId: true, projectRequirement: true, status: true },
    });
    for (const l of leads) {
      if (l.status !== "cancelled" && l.projectRequirement && l.projectRequirement.includes("Discovery Call Scheduled for")) {
        const match = l.projectRequirement.match(/Discovery Call Scheduled for ([0-9]{4}-[0-9]{2}-[0-9]{2}) @ ([0-9]{1,2}:[0-9]{2}\s+[AP]M)/i);
        if (match) {
          allSlots.push({
            date: match[1],
            time: match[2],
            bookingId: l.leadId,
          });
        }
      }
    }
  } catch (error) {
    // Ignore lead read error
  }

  // Deduplicate slots by unique slot (date + time)
  const normalize = (t: string) => (t || "").replace(/^0/, "").toUpperCase().trim();
  const uniqueSlots = Array.from(new Set(allSlots.map((s) => `${s.date}_${normalize(s.time)}`)))
    .map((key) => allSlots.find((s) => `${s.date}_${normalize(s.time)}` === key)!);

  return uniqueSlots;
}

export async function saveBookingToDB(booking: BookingPayload): Promise<void> {
  // 1. Always save locally to file cache first (removes old slot for bookingId)
  saveLocalSlot({ date: booking.date, time: booking.time, bookingId: booking.bookingId });

  // 2. Always persist into Lead table (upsert to update existing bookingId)
  try {
    await saveLead({
      leadId: booking.bookingId,
      name: booking.name,
      email: booking.email,
      company: booking.company,
      businessType: booking.businessType || "General",
      budget: "Discovery Call",
      timeline: "Scheduled",
      projectRequirement: `[Discovery Call Scheduled for ${booking.date} @ ${booking.time} (${booking.timeZone || "Asia/Kolkata"})] ${booking.projectRequirement || ""}`,
      status: "contacted",
      submittedAt: new Date().toISOString(),
    });
  } catch (e) {
    logger.warn("Failed to persist booking as Lead record", "db_lead_booking_warn", { message: String(e) });
  }

  // 3. Try optional Booking table (upsert to handle rescheduled slot updates)
  try {
    await (prisma as any).booking.upsert({
      where: { bookingId: booking.bookingId },
      update: {
        date: booking.date,
        time: booking.time,
        timeZone: booking.timeZone || "Asia/Kolkata",
        meetUrl: booking.meetUrl,
        status: booking.status || "confirmed",
      },
      create: {
        bookingId: booking.bookingId,
        name: booking.name,
        email: booking.email,
        company: booking.company,
        businessType: booking.businessType || "General",
        projectRequirement: booking.projectRequirement || "",
        date: booking.date,
        time: booking.time,
        timeZone: booking.timeZone || "Asia/Kolkata",
        meetUrl: booking.meetUrl,
        status: booking.status || "confirmed",
      },
    });
    logger.info(`Booking ${booking.bookingId} saved to database`, "db_booking_save_success");
  } catch (error) {
    logger.warn(`Failed to save booking ${booking.bookingId} to DB table, saved to local cache`, "db_booking_save_warn", { message: String(error) });
  }
}

export async function cancelBookingInDB(bookingId: string): Promise<boolean> {
  let cancelled = false;
  
  // 1. Remove from local file cache
  try {
    const current = getLocalSlots().filter((s) => s.bookingId !== bookingId);
    const data = JSON.stringify(current, null, 2);
    try { fs.writeFileSync(LOCAL_SLOTS_FILE, data); } catch (e) {}
    try { fs.writeFileSync(TMP_SLOTS_FILE, data); } catch (e) {}
    cancelled = true;
  } catch (e) {}

  // 2. Clear Lead record in DB if exists
  try {
    const lead = await prisma.lead.findUnique({ where: { leadId: bookingId } });
    if (lead) {
      await prisma.lead.update({
        where: { leadId: bookingId },
        data: {
          status: "cancelled",
          projectRequirement: lead.projectRequirement.replace(/\[Discovery Call Scheduled for [^\]]+\]\s*/i, ""),
        },
      });
      cancelled = true;
    }
  } catch (e) {}

  // 3. Try optional Booking table
  try {
    await (prisma as any).booking.update({
      where: { bookingId },
      data: { status: "cancelled" },
    });
    logger.info(`Booking ${bookingId} marked as cancelled in database`, "db_booking_cancel_success");
    cancelled = true;
  } catch (error) {
    logger.warn(`Failed to cancel booking ${bookingId} in DB`, "db_booking_cancel_warn", { message: String(error) });
  }

  return cancelled;
}

export async function getBookingDetails(bookingId: string): Promise<BookingPayload | null> {
  // 1. Try optional Booking table first
  try {
    const booking = await (prisma as any).booking.findUnique({
      where: { bookingId },
    });
    if (booking && booking.email) return booking;
  } catch (e) {}

  // 2. Try Lead table (primary DB store)
  try {
    const lead = await getLeadById(bookingId);
    if (lead) {
      const cleanReq = (lead.projectRequirement || "").replace(/\[Discovery Call Scheduled for [^\]]+\]\s*/i, "").trim();
      return {
        bookingId: lead.leadId,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        businessType: lead.businessType || "General",
        projectRequirement: cleanReq,
        date: "",
        time: "",
        meetUrl: `https://mithundas.cloud/meet/${lead.leadId}`,
      };
    }
  } catch (e) {}

  return null;
}

export async function getAllBookingsFromDB(): Promise<BookingPayload[]> {
  const map = new Map<string, BookingPayload>();

  // 1. Try Prisma Booking Table first
  try {
    const bookings = await (prisma as any).booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (Array.isArray(bookings)) {
      for (const b of bookings) {
        if (b.bookingId) {
          map.set(b.bookingId, {
            id: b.id,
            bookingId: b.bookingId,
            name: b.name || "Client",
            email: b.email || "",
            company: b.company || "Client Business",
            businessType: b.businessType || "General",
            projectRequirement: b.projectRequirement || "",
            date: b.date || "",
            time: b.time || "",
            timeZone: b.timeZone || "Asia/Kolkata",
            meetUrl: b.meetUrl || `https://mithundas.cloud/meet/${b.bookingId}`,
            status: b.status || "confirmed",
            createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString(),
          });
        }
      }
    }
  } catch (e) {
    // Optional table
  }

  // 2. Parse Lead records
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { submittedAt: "desc" },
    });
    for (const l of leads) {
      if (l.projectRequirement && (l.projectRequirement.includes("Discovery Call Scheduled for") || l.leadId.startsWith("INV-"))) {
        const match = l.projectRequirement.match(/Discovery Call Scheduled for ([0-9]{4}-[0-9]{2}-[0-9]{2}) @ ([0-9]{1,2}:[0-9]{2}\s+[AP]M)(?:\s+\(([^\)]+)\))?/i);
        const cleanReq = l.projectRequirement.replace(/\[Discovery Call Scheduled for [^\]]+\]\s*/i, "").trim();

        if (!map.has(l.leadId)) {
          map.set(l.leadId, {
            bookingId: l.leadId,
            name: l.name,
            email: l.email,
            company: l.company,
            businessType: l.businessType || "General",
            projectRequirement: cleanReq,
            date: match ? match[1] : "",
            time: match ? match[2] : "",
            timeZone: match && match[3] ? match[3] : "Asia/Kolkata",
            meetUrl: `https://mithundas.cloud/meet/${l.leadId}`,
            status: l.status === "cancelled" ? "cancelled" : "confirmed",
            createdAt: l.submittedAt.toISOString(),
          });
        }
      }
    }
  } catch (e) {}

  // 3. Check local slot cache
  try {
    const local = getLocalSlots();
    for (const slot of local) {
      if (!map.has(slot.bookingId)) {
        map.set(slot.bookingId, {
          bookingId: slot.bookingId,
          name: "Client",
          email: "",
          company: "Client Business",
          businessType: "General",
          projectRequirement: "Discovery Call Session",
          date: slot.date,
          time: slot.time,
          timeZone: "Asia/Kolkata",
          meetUrl: `https://mithundas.cloud/meet/${slot.bookingId}`,
          status: "confirmed",
          createdAt: new Date().toISOString(),
        });
      }
    }
  } catch (e) {}

  return Array.from(map.values());
}

