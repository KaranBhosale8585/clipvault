import { db } from "@/db";
import { logsTable } from "@/db/schema";

type LogLevel = "info" | "warn" | "error";

interface LogParams {
  level: LogLevel;
  message: string;
  source?: string;
  metadata?: any;
}

export const logger = {
  async log({ level, message, source, metadata }: LogParams) {
    try {
      await db.insert(logsTable).values({
        level,
        message,
        source,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });
    } catch (err) {
      // Fallback to console if DB insert fails to prevent recursion or lost errors
      console.error("Critical: Logger failed to write to database:", err);
    }
  },

  async info(message: string, source?: string, metadata?: any) {
    console.log(`[INFO][${source || "system"}]: ${message}`);
    return this.log({ level: "info", message, source, metadata });
  },

  async warn(message: string, source?: string, metadata?: any) {
    console.warn(`[WARN][${source || "system"}]: ${message}`);
    return this.log({ level: "warn", message, source, metadata });
  },

  async error(message: string, source?: string, metadata?: any) {
    console.error(`[ERROR][${source || "system"}]: ${message}`);
    return this.log({ level: "error", message, source, metadata });
  },
};
