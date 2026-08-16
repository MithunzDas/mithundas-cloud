import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Helper to safely decode Google JWT payload without external heavy dependencies
 */
function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * POST /api/affidavit/auth/google
 * Body: { credential?: string, email?: string, name?: string, picture?: string, googleId?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let email = body.email;
    let name = body.name;
    let picture = body.picture;
    let googleId = body.googleId;

    // If Google credential JWT is passed, decode directly
    if (body.credential) {
      const payload = decodeJwtPayload(body.credential);
      if (payload && payload.email) {
        email = payload.email;
        name = payload.name || name;
        picture = payload.picture || picture;
        googleId = payload.sub || googleId;
      }
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid Google email is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find existing user by email or googleId
    const existing = await prisma.affidavitUser.findFirst({
      where: {
        OR: [
          { email: trimmedEmail },
          ...(googleId ? [{ googleId }] : []),
        ],
      },
    });

    let user;
    let isNewUser = false;

    if (existing) {
      user = await prisma.affidavitUser.update({
        where: { id: existing.id },
        data: {
          name: name || existing.name,
          avatarUrl: picture || existing.avatarUrl,
          googleId: googleId || existing.googleId,
        },
      });
    } else {
      isNewUser = true;
      user = await prisma.affidavitUser.create({
        data: {
          email: trimmedEmail,
          name: name || null,
          avatarUrl: picture || null,
          googleId: googleId || null,
          creditBalance: 0,
        },
      });
    }

    logger.info("Google user authenticated successfully", "affidavit_google_auth", {
      userId: user.id,
      email: user.email,
      isNewUser,
    });

    // Asynchronously call n8n webhook to sync user into Google Sheets
    const n8nUserSyncWebhook = "https://n8n.srv1594654.hstgr.cloud/webhook/affidavit-user-sync";
    try {
      fetch(n8nUserSyncWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: isNewUser ? "user.registered" : "user.login",
          userId: user.id,
          name: user.name || "N/A",
          email: user.email,
          phone: user.phone || "N/A",
          avatarUrl: user.avatarUrl || "N/A",
          creditBalance: user.creditBalance,
          isFirstPurchaseDone: user.isFirstPurchaseDone,
          defaultAdvocateName: user.defaultAdvocateName || "N/A",
          defaultCourtHeader: user.defaultCourtHeader || "N/A",
          date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          timestamp: new Date().toISOString(),
          provider: "google",
        }),
      }).catch((err) => {
        logger.warn("n8n user sync failed", "n8n_sync_warn", { err: String(err) });
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        avatarUrl: user.avatarUrl,
        creditBalance: user.creditBalance,
        isFirstPurchaseDone: user.isFirstPurchaseDone,
        defaultAdvocateName: user.defaultAdvocateName,
        defaultAdvocateEnrollment: user.defaultAdvocateEnrollment,
        defaultCourtHeader: user.defaultCourtHeader,
      },
    });
  } catch (error: unknown) {
    logger.error("Google authentication failed", "affidavit_google_auth_error", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { success: false, error: "Failed to authenticate with Google." },
      { status: 500 }
    );
  }
}
