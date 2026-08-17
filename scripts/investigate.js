require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function investigate() {
  // 1. Find user
  const user = await prisma.affidavitUser.findUnique({
    where: { email: "dasathena69@gmail.com" },
    include: { purchases: true },
  });
  console.log("=== USER ===");
  console.log(JSON.stringify(user, null, 2));

  // 2. Search all purchases for this payment ID
  const allPurchases = await prisma.affidavitPurchase.findMany({
    where: {
      OR: [
        { razorpayPaymentId: "pay_TQwdaycd05DsMf" },
        { userId: user?.id },
      ],
    },
  });
  console.log("\n=== ALL PURCHASES ===");
  console.log(JSON.stringify(allPurchases, null, 2));
}

investigate().catch(console.error).finally(() => prisma.$disconnect());
