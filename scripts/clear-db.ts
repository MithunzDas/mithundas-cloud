import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function clearLeads() {
  try {
    const result = await prisma.lead.deleteMany();
    console.log(`SUCCESS: Deleted ${result.count} test leads from Supabase database!`);
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearLeads();
