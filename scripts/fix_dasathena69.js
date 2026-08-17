require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

// Use the DIRECT_URL to avoid pgbouncer issues
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const prisma = new PrismaClient({
  datasources: { db: { url: databaseUrl } },
});

async function fixBalance() {
  const email = "dasathena69@gmail.com";

  const user = await prisma.affidavitUser.findUnique({
    where: { email },
    include: { purchases: true },
  });

  if (!user) {
    console.log("User not found!");
    return;
  }

  console.log("Before fix:");
  console.log(`  Balance: ${user.creditBalance}`);
  console.log(`  isFirstPurchaseDone: ${user.isFirstPurchaseDone}`);
  console.log(`  Purchases: ${user.purchases.length}`);

  // Calculate expected credits from all completed purchases
  const completedCredits = user.purchases
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.creditsAdded, 0);

  console.log(`  Expected credits from completed purchases: ${completedCredits}`);

  if (user.creditBalance < completedCredits) {
    const updated = await prisma.affidavitUser.update({
      where: { id: user.id },
      data: {
        creditBalance: completedCredits,
        isFirstPurchaseDone: true,
      },
    });
    console.log("\nAfter fix:");
    console.log(`  Balance: ${updated.creditBalance}`);
    console.log(`  isFirstPurchaseDone: ${updated.isFirstPurchaseDone}`);
  } else {
    console.log("\nBalance is already correct, no fix needed.");
  }
}

fixBalance().catch(console.error).finally(() => prisma.$disconnect());
