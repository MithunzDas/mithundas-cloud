import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DIRECT_URL },
  },
});

async function main() {
  console.log("=== Testing EmailLog table ===");
  
  // 1. Try inserting a test email log
  try {
    const testLog = await prisma.emailLog.create({
      data: {
        toEmail: "test@example.com",
        fromEmail: "mithun@mithundas.cloud",
        subject: "Test Email Log Entry",
        category: "confirmation",
        htmlContent: "<p>Test HTML content</p>",
        status: "sent",
      },
    });
    console.log("✅ INSERT succeeded:", testLog);
  } catch (err) {
    console.error("❌ INSERT failed:", err);
  }

  // 2. Try reading email logs
  try {
    const logs = await prisma.emailLog.findMany({
      orderBy: { sentAt: "desc" },
      take: 10,
    });
    console.log(`✅ SELECT succeeded: ${logs.length} logs found`);
    logs.forEach((log) => {
      console.log(`  - [${log.category}] ${log.subject} → ${log.toEmail} (${log.status}) at ${log.sentAt}`);
    });
  } catch (err) {
    console.error("❌ SELECT failed:", err);
  }

  // 3. Clean up the test entry
  try {
    const deleted = await prisma.emailLog.deleteMany({
      where: { toEmail: "test@example.com" },
    });
    console.log(`✅ Cleanup: deleted ${deleted.count} test entries`);
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
  }

  await prisma.$disconnect();
}

main();
