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

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),

    reelUrl: varchar("reel_url", { length: 1024 }).notNull(),
    
    videoUrl: varchar("video_url", { length: 2048 }),
    
    thumbnailUrl: varchar("thumbnail_url", { length: 2048 }),
    
    title: varchar("title", { length: 1024 }),

    status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, completed, failed

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("download_user_idx").on(table.userId),
  }),
);
