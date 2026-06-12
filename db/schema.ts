import {
  uuid,
  pgTable,
  varchar,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: varchar("password", { length: 255 }).notNull(),

  role: varchar("role", { length: 20 }).default("user").notNull(), // user, admin

  isVerified: boolean("is_verified").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const otpTable = pgTable("otp", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),

  email: varchar("email", { length: 255 }).notNull(),

  otp: varchar("otp", { length: 6 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  expiresAt: timestamp("expires_at").notNull(),
});

export const otpRequestsTable = pgTable(
  "otp_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("otp_req_user_idx").on(table.userId),
  }),
);

export const downloadsTable = pgTable(
  "downloads",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id").references(() => usersTable.id), // Nullable for anonymous users

    visitorId: uuid("visitor_id"), // Robust tracking for anonymous users via signed cookie

    ipAddress: varchar("ip_address", { length: 45 }), // To track anonymous usage limit

    reelUrl: varchar("reel_url", { length: 1024 }).notNull(),
    
    videoUrl: varchar("video_url", { length: 2048 }),
    
    thumbnailUrl: varchar("thumbnail_url", { length: 2048 }),
    
    title: varchar("title", { length: 1024 }),

    status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, completed, failed

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("download_user_idx").on(table.userId),
    reelUrlIdx: index("download_reel_url_idx").on(table.reelUrl), // Added for fast caching lookups
  }),
);

export const logsTable = pgTable(
  "logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    level: varchar("level", { length: 20 }).default("info").notNull(), // info, warn, error

    message: varchar("message", { length: 2048 }).notNull(),
    
    metadata: varchar("metadata", { length: 4096 }), // JSON or stringified data
    
    source: varchar("source", { length: 100 }), // e.g., "instagram-scraper", "auth-api"

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    levelIdx: index("log_level_idx").on(table.level),
  }),
);
