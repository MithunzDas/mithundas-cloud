import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const directDbUrl = process.env.DIRECT_URL || "postgresql://postgres.drgsznwzuxnyqctgrjtb:JoyMaaKali@6527@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directDbUrl,
    },
  },
});

async function clearInvoices() {
  console.log("Cleaning up all invoices and transactions from Supabase PostgreSQL database...");
  try {
    const deletedTxns = await prisma.paymentTransaction.deleteMany({});
    console.log(`Deleted ${deletedTxns.count} payment transactions from DB.`);

    const deletedInvoices = await prisma.invoice.deleteMany({});
    console.log(`Deleted ${deletedInvoices.count} invoices from DB.`);
  } catch (e) {
    console.error("DB cleanup error:", e);
  }

  // Clear local JSON stores
  const filesToClear = [
    path.join(process.cwd(), "data", "invoices.json"),
    path.join(process.cwd(), ".invoices.json"),
    "/tmp/invoices.json",
  ];

  for (const f of filesToClear) {
    try {
      if (fs.existsSync(f)) {
        fs.writeFileSync(f, JSON.stringify([], null, 2));
        console.log(`Reset ${f} to []`);
      }
    } catch (err) {
      console.error(`Failed clearing ${f}:`, err);
    }
  }

  console.log("Invoice database cleanup completed successfully!");
  await prisma.$disconnect();
}

clearInvoices();
