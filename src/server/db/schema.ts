import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  integer,
  primaryKey,
  sqliteTableCreator,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `rate-my-code_${name}`);

export const users = createTable("user", {
  id: text("id", { length: 255 }).notNull().primaryKey(),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull(),
  emailVerified: int("emailVerified", {
    mode: "timestamp",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: text("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  snippets: many(snippets),
  reactions: many(reactions),
}));

export const accounts = createTable(
  "account",
  {
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    refresh_token_expires_in: int("refresh_token_expires_in"),
    expires_at: int("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: text("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const snippets = createTable(
  "snippet",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    title: text("title", { length: 100 }).notNull(),
    code: text("code").notNull(),
    language: text("language", { length: 50 }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .$default(() => new Date())
      .notNull(),
    updatedAt: int("updatedAt", { mode: "timestamp" }),
  },
  (snippet) => ({
    userIdIdx: index("snippet_userId_idx").on(snippet.userId),
  }),
);

export const snippetsRelation = relations(snippets, ({ one, many }) => ({
  users: one(users, { fields: [snippets.userId], references: [users.id] }),
  reactions: many(reactions),
}));

export const reactions = createTable(
  "reaction",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    snippetId: int("snippetId")
      .notNull()
      .references(() => snippets.id),
    reactionType: text("reaction_type", {
      enum: ["like", "dislike"],
    }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .$default(() => new Date())
      .notNull(),
    updatedAt: int("updatedAt", { mode: "timestamp" }),
  },
  (reaction) => ({
    userIdIdx: index("reaction_userId_idx").on(reaction.userId),
    snippetIdIdx: index("reaction_snippetId_idx").on(reaction.snippetId),
    snippetUser: unique("snippet_user").on(reaction.userId, reaction.snippetId),
  }),
);

export const reactionsRelations = relations(reactions, ({ one }) => ({
  snippets: one(snippets, {
    fields: [reactions.snippetId],
    references: [snippets.id],
  }),
  users: one(users, { fields: [reactions.userId], references: [users.id] }),
}));
