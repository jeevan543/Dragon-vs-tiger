import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameRounds = pgTable("game_rounds", {
  id: uuid("id").defaultRandom().primaryKey(),
  dragonCard: integer("dragon_card").notNull(),
  tigerCard: integer("tiger_card").notNull(),
  winner: text("winner").notNull(), // 'dragon', 'tiger', 'tie'
  status: text("status").default('pending').notNull(), // 'pending', 'completed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

