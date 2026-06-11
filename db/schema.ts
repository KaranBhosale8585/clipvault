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
