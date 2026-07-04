import {
  uuid,
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  index,
  integer,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: varchar("password", { length: 255 }).notNull(),

  role: varchar("role", { length: 20 }).default("user").notNull(), // user, admin

  isVerified: boolean("is_verified").default(false).notNull(),

  dailyDownloadCount: integer("daily_download_count").default(0).notNull(),

  lastDownloadReset: timestamp("last_download_reset").defaultNow().notNull(),

  isProAccess: boolean("is_pro_access").default(false).notNull(),

  proAccessGrantedAt: timestamp("pro_access_granted_at"),

  proAccessGrantedBy: uuid("pro_access_granted_by"),

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

export const unlimitedAccessRequestsTable = pgTable(
  "unlimited_access_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),

    name: varchar("name", { length: 255 }).notNull(),

    email: varchar("email", { length: 255 }).notNull(),

    useCase: varchar("use_case", { length: 2048 }).notNull(),

    expectedUsage: varchar("expected_usage", { length: 255 }).notNull(), // Using varchar to allow ranges or descriptions

    notes: varchar("notes", { length: 4096 }),

    status: varchar("status", { length: 20 }).default("PENDING").notNull(), // PENDING, APPROVED, REJECTED

    reviewedBy: uuid("reviewed_by"),

    reviewedAt: timestamp("reviewed_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdx: index("ua_req_user_idx").on(table.userId),
    statusIdx: index("ua_req_status_idx").on(table.status),
  }),
);

export const contactSubmissionsTable = pgTable(
  "contact_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),

    email: varchar("email", { length: 255 }).notNull(),

    subject: varchar("subject", { length: 255 }).notNull(),

    message: varchar("message", { length: 4096 }).notNull(),

    status: varchar("status", { length: 20 }).default("NEW").notNull(), // NEW, READ, REPLIED

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    emailIdx: index("contact_email_idx").on(table.email),
    statusIdx: index("contact_status_idx").on(table.status),
  }),
);

export const systemSettingsTable = pgTable("system_settings", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

