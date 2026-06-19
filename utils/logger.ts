import { db } from "@/db";
import { logsTable } from "@/db/schema";

type LogLevel = "info" | "warn" | "error";

interface LogParams {
  level: LogLevel;
  message: string;
  source?: string;
  metadata?: unknown;
}

export const logger = {
  async log({ level, message, source, metadata }: LogParams) {
    try {
      // Truncate message to 2048 characters
      const truncatedMessage = message.length > 2048 ? message.substring(0, 2045) + "..." : message;
      
      // Truncate stringified metadata to 4096 characters
      let truncatedMetadata = null;
      if (metadata) {
        let stringified;
        if (metadata instanceof Error) {
          stringified = JSON.stringify({
            name: metadata.name,
            message: metadata.message,
            stack: metadata.stack,
            cause: metadata.cause,
          });
        } else {
          stringified = JSON.stringify(metadata);
        }
        truncatedMetadata = stringified.length > 4096 ? stringified.substring(0, 4093) + "..." : stringified;
      }

      await db.insert(logsTable).values({
        level,
        message: truncatedMessage,
        source,
        metadata: truncatedMetadata,
      });
    } catch (err) {
      // Fallback to console if DB insert fails to prevent recursion or lost errors
      console.error("Critical: Logger failed to write to database:", err);
    }
  },

  async info(message: string, source?: string, metadata?: unknown) {
    console.log(`[INFO][${source || "system"}]: ${message}`);
    return this.log({ level: "info", message, source, metadata });
  },

  async warn(message: string, source?: string, metadata?: unknown) {
    console.warn(`[WARN][${source || "system"}]: ${message}`);
    return this.log({ level: "warn", message, source, metadata });
  },

  async error(message: string, source?: string, metadata?: unknown) {
    if (metadata instanceof Error) {
      console.error(`[ERROR][${source || "system"}]: ${message} - ${metadata.message}\n${metadata.stack}`);
    } else if (metadata) {
      console.error(`[ERROR][${source || "system"}]: ${message} - ${JSON.stringify(metadata)}`);
    } else {
      console.error(`[ERROR][${source || "system"}]: ${message}`);
    }
    return this.log({ level: "error", message, source, metadata });
  },
};
