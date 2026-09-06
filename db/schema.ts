import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    slug: text("slug").notNull().unique(),
    url: text("url").notNull(),
    clicks: integer("clicks").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
