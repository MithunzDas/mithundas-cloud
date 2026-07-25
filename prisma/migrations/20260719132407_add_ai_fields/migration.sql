-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "projectRequirement" TEXT NOT NULL,
    "whatsapp" TEXT,
    "country" TEXT,
    "status" TEXT NOT NULL DEFAULT 'intake',
    "aiScore" INTEGER,
    "aiSummary" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Lead" ("budget", "businessType", "company", "country", "email", "id", "leadId", "name", "projectRequirement", "status", "submittedAt", "timeline", "whatsapp") SELECT "budget", "businessType", "company", "country", "email", "id", "leadId", "name", "projectRequirement", "status", "submittedAt", "timeline", "whatsapp" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
CREATE UNIQUE INDEX "Lead_leadId_key" ON "Lead"("leadId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
