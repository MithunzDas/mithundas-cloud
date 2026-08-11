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

export interface InvoicePayload {
  id?: string;
  invoiceId: string;
  leadId?: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  currency?: string;
  currencySymbol?: string;
  totalAmount: string;
  totalAmountNumeric?: number;
  depositPercent?: string;
  depositAmount: string;
  receivedAmountNumeric?: number;
  remainingAmountNumeric?: number;
  setupFee?: string;
  monthlyRetainer?: string;
  projectScope: string;
  paymentStatus?: string;
  paymentLink?: string;
  customPaymentMethods?: string;
  issueDate?: string;
  dueDate?: string;
  paidAt?: string;
  createdAt?: string;
}

const LOCAL_INVOICES_FILE = path.join(process.cwd(), ".invoices.json");
const TMP_INVOICES_FILE = "/tmp/invoices.json";

function getLocalInvoices(): InvoicePayload[] {
  try {
    const fileToRead = fs.existsSync(LOCAL_INVOICES_FILE) ? LOCAL_INVOICES_FILE : (fs.existsSync(TMP_INVOICES_FILE) ? TMP_INVOICES_FILE : null);
    if (fileToRead) {
      const data = fs.readFileSync(fileToRead, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {}
  return [];
}

function saveLocalInvoice(inv: InvoicePayload) {
  try {
    const current = getLocalInvoices().filter((i) => i.invoiceId !== inv.invoiceId);
    current.push(inv);
    const data = JSON.stringify(current, null, 2);
    try { fs.writeFileSync(LOCAL_INVOICES_FILE, data); } catch (e) {}
    try { fs.writeFileSync(TMP_INVOICES_FILE, data); } catch (e) {}
  } catch (e) {}
}

export async function saveInvoiceToDB(inv: InvoicePayload): Promise<void> {
  saveLocalInvoice(inv);

  try {
    await (prisma as any).invoice.upsert({
      where: { invoiceId: inv.invoiceId },
      update: {
        clientName: inv.clientName,
        clientEmail: inv.clientEmail,
        companyName: inv.companyName,
        currency: inv.currency || "USD",
        currencySymbol: inv.currencySymbol || "$",
        totalAmount: inv.totalAmount,
        depositPercent: inv.depositPercent || "50",
        depositAmount: inv.depositAmount,
        setupFee: inv.setupFee || null,
        monthlyRetainer: inv.monthlyRetainer || null,
        projectScope: inv.projectScope,
        paymentStatus: inv.paymentStatus || "unpaid",
        paymentLink: inv.paymentLink || null,
        customPaymentMethods: inv.customPaymentMethods || null,
        issueDate: inv.issueDate || new Date().toISOString().split("T")[0],
        dueDate: inv.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
      create: {
        invoiceId: inv.invoiceId,
        leadId: inv.leadId || null,
        clientName: inv.clientName,
        clientEmail: inv.clientEmail,
        companyName: inv.companyName,
        currency: inv.currency || "USD",
        currencySymbol: inv.currencySymbol || "$",
        totalAmount: inv.totalAmount,
        depositPercent: inv.depositPercent || "50",
        depositAmount: inv.depositAmount,
        setupFee: inv.setupFee || null,
        monthlyRetainer: inv.monthlyRetainer || null,
        projectScope: inv.projectScope,
        paymentStatus: inv.paymentStatus || "unpaid",
        paymentLink: inv.paymentLink || null,
        customPaymentMethods: inv.customPaymentMethods || null,
        issueDate: inv.issueDate || new Date().toISOString().split("T")[0],
        dueDate: inv.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
    });
    logger.info(`Invoice ${inv.invoiceId} saved to database`, "invoice_save_success");
  } catch (e) {
    logger.warn(`Failed to save invoice ${inv.invoiceId} to DB, saved to local cache`, "invoice_save_warn");
  }
}

export async function getInvoiceFromDB(invoiceId: string): Promise<InvoicePayload | null> {
  // 1. Try Prisma Invoice table
  try {
    const inv = await (prisma as any).invoice.findUnique({
      where: { invoiceId },
    });
    if (inv) {
      return {
        ...inv,
        createdAt: inv.createdAt ? inv.createdAt.toISOString() : new Date().toISOString(),
        paidAt: inv.paidAt ? inv.paidAt.toISOString() : undefined,
      };
    }
  } catch (e) {}

  // 2. Fallback to local cache
  const local = getLocalInvoices();
  const match = local.find((i) => i.invoiceId === invoiceId);
  return match || null;
}

export async function updateInvoiceStatusInDB(invoiceId: string, status: string, paidAt?: Date): Promise<boolean> {
  let updated = false;

  // Local cache update
  try {
    const local = getLocalInvoices();
    const inv = local.find((i) => i.invoiceId === invoiceId);
    if (inv) {
      inv.paymentStatus = status;
      if (paidAt) inv.paidAt = paidAt.toISOString();
      const data = JSON.stringify(local, null, 2);
      try { fs.writeFileSync(LOCAL_INVOICES_FILE, data); } catch (e) {}
      try { fs.writeFileSync(TMP_INVOICES_FILE, data); } catch (e) {}
      updated = true;
    }
  } catch (e) {}

  // DB update
  try {
    await (prisma as any).invoice.update({
      where: { invoiceId },
      data: {
        paymentStatus: status,
        paidAt: paidAt || new Date(),
      },
    });
    updated = true;
  } catch (e) {}

  return updated;
}

export interface PaymentTransactionPayload {
  id?: string;
  transactionId: string;
  invoiceId: string;
  clientName: string;
  clientEmail: string;
  companyName?: string;
  amount: number;
  currency?: string;
  currencySymbol?: string;
  paymentMethod: string; // "stripe", "razorpay", "upi", "cash", "paypal", "wise", "wire"
  utrOrReference?: string;
  verificationStatus?: string; // "pending", "verified", "rejected"
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt?: string;
}

const LOCAL_TXNS_FILE = path.join(process.cwd(), ".transactions.json");
const TMP_TXNS_FILE = "/tmp/transactions.json";

function getLocalTransactions(): PaymentTransactionPayload[] {
  try {
    const fileToRead = fs.existsSync(LOCAL_TXNS_FILE) ? LOCAL_TXNS_FILE : (fs.existsSync(TMP_TXNS_FILE) ? TMP_TXNS_FILE : null);
    if (fileToRead) {
      const data = fs.readFileSync(fileToRead, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {}
  return [];
}

function saveLocalTransaction(txn: PaymentTransactionPayload) {
  try {
    const current = getLocalTransactions().filter((t) => t.transactionId !== txn.transactionId);
    current.unshift(txn);
    const data = JSON.stringify(current, null, 2);
    try { fs.writeFileSync(LOCAL_TXNS_FILE, data); } catch (e) {}
    try { fs.writeFileSync(TMP_TXNS_FILE, data); } catch (e) {}
  } catch (e) {}
}

export async function recordPaymentTransaction(txn: PaymentTransactionPayload): Promise<void> {
  saveLocalTransaction(txn);

  try {
    await (prisma as any).paymentTransaction.upsert({
      where: { transactionId: txn.transactionId },
      update: {
        amount: txn.amount,
        verificationStatus: txn.verificationStatus || "pending",
        utrOrReference: txn.utrOrReference || null,
        notes: txn.notes || null,
        verifiedBy: txn.verifiedBy || null,
        verifiedAt: txn.verifiedAt ? new Date(txn.verifiedAt) : null,
      },
      create: {
        transactionId: txn.transactionId,
        invoiceId: txn.invoiceId,
        clientName: txn.clientName,
        clientEmail: txn.clientEmail,
        companyName: txn.companyName || null,
        amount: txn.amount,
        currency: txn.currency || "USD",
        currencySymbol: txn.currencySymbol || "$",
        paymentMethod: txn.paymentMethod,
        utrOrReference: txn.utrOrReference || null,
        verificationStatus: txn.verificationStatus || "pending",
        notes: txn.notes || null,
        verifiedBy: txn.verifiedBy || null,
        verifiedAt: txn.verifiedAt ? new Date(txn.verifiedAt) : null,
      },
    });
    logger.info(`Recorded payment transaction ${txn.transactionId} for invoice ${txn.invoiceId}`, "txn_recorded");
  } catch (e) {
    logger.warn(`Failed to save txn ${txn.transactionId} to DB, saved to local cache`, "txn_save_warn");
  }
}

export async function verifyPaymentTransaction(transactionId: string, verifiedBy: string = "Admin"): Promise<PaymentTransactionPayload | null> {
  let matchedTxn: PaymentTransactionPayload | null = null;
  const now = new Date().toISOString();

  // Local update
  try {
    const local = getLocalTransactions();
    const txn = local.find((t) => t.transactionId === transactionId);
    if (txn) {
      txn.verificationStatus = "verified";
      txn.verifiedBy = verifiedBy;
      txn.verifiedAt = now;
      matchedTxn = txn;
      const data = JSON.stringify(local, null, 2);
      try { fs.writeFileSync(LOCAL_TXNS_FILE, data); } catch (e) {}
      try { fs.writeFileSync(TMP_TXNS_FILE, data); } catch (e) {}
    }
  } catch (e) {}

  // DB update
  try {
    const updated = await (prisma as any).paymentTransaction.update({
      where: { transactionId },
      data: {
        verificationStatus: "verified",
        verifiedBy,
        verifiedAt: new Date(),
      },
    });
    if (updated) {
      matchedTxn = {
        ...updated,
        createdAt: updated.createdAt ? updated.createdAt.toISOString() : now,
        verifiedAt: updated.verifiedAt ? updated.verifiedAt.toISOString() : now,
      };
    }
  } catch (e) {}

  if (matchedTxn) {
    // Recalculate invoice balance for matched invoice
    await recalculateInvoiceBalance(matchedTxn.invoiceId);
  }

  return matchedTxn;
}

export async function recalculateInvoiceBalance(invoiceId: string): Promise<void> {
  const invoice = await getInvoiceFromDB(invoiceId);
  if (!invoice) return;

  const allTxns = await getTransactionsForInvoice(invoiceId);
  const verifiedTxns = allTxns.filter((t) => t.verificationStatus === "verified");
  const totalReceived = verifiedTxns.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const rawTotal = parseFloat((invoice.totalAmount || "").replace(/[^0-9.]/g, "")) || 0;
  const remaining = Math.max(0, rawTotal - totalReceived);

  let newStatus = "unpaid";
  if (remaining <= 0 && rawTotal > 0) {
    newStatus = "paid_in_full";
  } else if (totalReceived > 0) {
    newStatus = "partially_paid";
  }

  // Update Invoice in local & DB
  try {
    const local = getLocalInvoices();
    const inv = local.find((i) => i.invoiceId === invoiceId);
    if (inv) {
      inv.receivedAmountNumeric = totalReceived;
      inv.remainingAmountNumeric = remaining;
      inv.paymentStatus = newStatus;
      const data = JSON.stringify(local, null, 2);
      try { fs.writeFileSync(LOCAL_INVOICES_FILE, data); } catch (e) {}
      try { fs.writeFileSync(TMP_INVOICES_FILE, data); } catch (e) {}
    }
  } catch (e) {}

  try {
    await (prisma as any).invoice.update({
      where: { invoiceId },
      data: {
        receivedAmountNumeric: totalReceived,
        remainingAmountNumeric: remaining,
        paymentStatus: newStatus,
        paidAt: newStatus === "paid_in_full" ? new Date() : undefined,
      },
    });
  } catch (e) {}
}

export async function getTransactionsForInvoice(invoiceId: string): Promise<PaymentTransactionPayload[]> {
  try {
    const txns = await (prisma as any).paymentTransaction.findMany({
      where: { invoiceId },
      orderBy: { createdAt: "desc" },
    });
    if (Array.isArray(txns) && txns.length > 0) {
      return txns.map((t: any) => ({
        ...t,
        createdAt: t.createdAt ? t.createdAt.toISOString() : new Date().toISOString(),
        verifiedAt: t.verifiedAt ? t.verifiedAt.toISOString() : undefined,
      }));
    }
  } catch (e) {}

  const local = getLocalTransactions();
  return local.filter((t) => t.invoiceId === invoiceId);
}

export async function getAllInvoicesFromDB(): Promise<InvoicePayload[]> {
  const map = new Map<string, InvoicePayload>();

  try {
    const invoices = await (prisma as any).invoice.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (Array.isArray(invoices)) {
      for (const inv of invoices) {
        map.set(inv.invoiceId, {
          ...inv,
          createdAt: inv.createdAt ? inv.createdAt.toISOString() : new Date().toISOString(),
          paidAt: inv.paidAt ? inv.paidAt.toISOString() : undefined,
        });
      }
    }
  } catch (e) {}

  const local = getLocalInvoices();
  for (const inv of local) {
    if (!map.has(inv.invoiceId)) {
      map.set(inv.invoiceId, inv);
    }
  }

  return Array.from(map.values());
}

export async function getFinancialLedger(): Promise<{
  invoices: InvoicePayload[];
  transactions: PaymentTransactionPayload[];
  metrics: {
    totalGrossValue: number;
    totalCollected: number;
    totalOutstanding: number;
    pendingQueueCount: number;
    currencyTotals: Record<string, { total: number; collected: number; remaining: number }>;
  };
}> {
  const invoices = await getAllInvoicesFromDB();

  let allTxns: PaymentTransactionPayload[] = [];
  try {
    const txns = await (prisma as any).paymentTransaction.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (Array.isArray(txns) && txns.length > 0) {
      allTxns = txns.map((t: any) => ({
        ...t,
        createdAt: t.createdAt ? t.createdAt.toISOString() : new Date().toISOString(),
        verifiedAt: t.verifiedAt ? t.verifiedAt.toISOString() : undefined,
      }));
    }
  } catch (e) {}

  if (allTxns.length === 0) {
    allTxns = getLocalTransactions();
  }

  // Calculate currency metrics
  const currencyTotals: Record<string, { total: number; collected: number; remaining: number }> = {
    USD: { total: 0, collected: 0, remaining: 0 },
    INR: { total: 0, collected: 0, remaining: 0 },
    EUR: { total: 0, collected: 0, remaining: 0 },
    GBP: { total: 0, collected: 0, remaining: 0 },
    AUD: { total: 0, collected: 0, remaining: 0 },
  };

  let totalGrossValue = 0;
  let totalCollected = 0;
  let totalOutstanding = 0;

  for (const inv of invoices) {
    const curr = inv.currency || "USD";
    if (!currencyTotals[curr]) {
      currencyTotals[curr] = { total: 0, collected: 0, remaining: 0 };
    }

    const rawTotal = parseFloat((inv.totalAmount || "").replace(/[^0-9.]/g, "")) || inv.totalAmountNumeric || 0;
    
    // Find all verified txns for this invoice
    const invTxns = allTxns.filter((t) => t.invoiceId === inv.invoiceId && t.verificationStatus === "verified");
    const invCollected = invTxns.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const invRemaining = Math.max(0, rawTotal - invCollected);

    currencyTotals[curr].total += rawTotal;
    currencyTotals[curr].collected += invCollected;
    currencyTotals[curr].remaining += invRemaining;

    totalGrossValue += rawTotal;
    totalCollected += invCollected;
    totalOutstanding += invRemaining;
  }

  const pendingQueueCount = allTxns.filter((t) => t.verificationStatus === "pending").length;

  return {
    invoices,
    transactions: allTxns,
    metrics: {
      totalGrossValue,
      totalCollected,
      totalOutstanding,
      pendingQueueCount,
      currencyTotals,
    },
  };
}



