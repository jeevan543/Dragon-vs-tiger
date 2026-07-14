"use server";

import { db } from "@/db";
import { gameRounds } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function createPendingRound() {
  const dragonCard = Math.floor(Math.random() * 13) + 1;
  const tigerCard = Math.floor(Math.random() * 13) + 1;
  
  let winner = "tie";
  if (dragonCard > tigerCard) winner = "dragon";
  else if (tigerCard > dragonCard) winner = "tiger";

  const [newRound] = await db.insert(gameRounds).values({
    dragonCard,
    tigerCard,
    winner,
    status: 'pending'
  }).returning();

  return newRound;
}

export async function completeRound(id: string) {
  const [updatedRound] = await db.update(gameRounds)
    .set({ status: 'completed' })
    .where(eq(gameRounds.id, id))
    .returning();
  return updatedRound;
}

export async function getGameHistory() {
  return await db.select()
    .from(gameRounds)
    .where(eq(gameRounds.status, 'completed'))
    .orderBy(desc(gameRounds.createdAt))
    .limit(10);
}

export async function getActivePendingRound() {
  const [pending] = await db.select()
    .from(gameRounds)
    .where(eq(gameRounds.status, 'pending'))
    .orderBy(desc(gameRounds.createdAt))
    .limit(1);
  return pending;
}

// THIS IS THE "SECURITY VULNERABILITY" ENDPOINT
// It returns the full data of a pending round, including the cards that should be hidden!
export async function hack_getPendingOutcome() {
  const pending = await getActivePendingRound();
  if (!pending) return null;
  
  return {
    id: pending.id,
    winner: pending.winner,
    dragonCard: pending.dragonCard,
    tigerCard: pending.tigerCard
  };
}
