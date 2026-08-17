require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixAthenaBalance() {
  const updated = await prisma.affidavitUser.update({
    where: { email: "athenadas12@gmail.com" },
    data: { creditBalance: 9 },
  });
  console.log("Corrected athenadas12@gmail.com balance to:", updated.creditBalance);
}

fixAthenaBalance().catch(console.error).finally(() => prisma.$disconnect());
