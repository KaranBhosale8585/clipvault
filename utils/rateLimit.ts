import { db } from "@/db";
import { otpRequestsTable } from "@/db/schema";
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
