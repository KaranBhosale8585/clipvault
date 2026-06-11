import { db } from "@/db";
import { otpRequestsTable, downloadsTable } from "@/db/schema";
import { and, eq, gt, count } from "drizzle-orm";

export async function checkRateLimit(userId: string) {
  const MAX = 3;
  const TIME = 10 * 60 * 1000; // 10 min

  const now = new Date();
  const windowStart = new Date(Date.now() - TIME);

  //  Count requests in last 10 min
  const result = await db
    .select({ total: count() })
    .from(otpRequestsTable)
    .where(
      and(
        eq(otpRequestsTable.userId, userId),
        gt(otpRequestsTable.createdAt, windowStart),
      ),
    );

  const requestCount = result[0]?.total || 0;

  //  Too many requests
  if (requestCount >= MAX) {
    return false;
  }

  //  Insert new request
  await db.insert(otpRequestsTable).values({
    userId,
    createdAt: now,
  });

  return true;
}

/**
 * Rate limits Reel extraction/download attempts.
 * Limit: 5 requests per 15 minutes.
 */
export async function checkDownloadRateLimit(userId: string) {
  const MAX_DOWNLOADS = 5;
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  const windowStart = new Date(Date.now() - WINDOW_MS);

  const result = await db
    .select({ total: count() })
    .from(downloadsTable)
    .where(
      and(
        eq(downloadsTable.userId, userId),
        gt(downloadsTable.createdAt, windowStart),
      ),
    );

  const usageCount = result[0]?.total || 0;

  return usageCount < MAX_DOWNLOADS;
}
