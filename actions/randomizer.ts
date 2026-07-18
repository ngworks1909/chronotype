import { HistoryTopic } from "@/types/topics";
import prisma from "@/lib/client";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function getNextTopic(userId: string): Promise<HistoryTopic> {
  const latest = await prisma.servedTopic.findFirst({
    where: { userId },
    orderBy: { servedAt: "desc" },
  });
  const currentCycle = latest?.cycle ?? 1;
  const HISTORY_TOPICS = await prisma.topic.findMany({
    select: {
      topicId: true,
      name: true,
      era: true,
    },
  });
  
  if (HISTORY_TOPICS.length === 0) {
    throw new Error("No topics available in the database.");
  }
  const servedThisCycle = await prisma.servedTopic.findMany({
    where: { userId, cycle: currentCycle },
    select: { topicId: true },
  });
  const servedIds = new Set(servedThisCycle.map((s) => s.topicId));

  let remaining = HISTORY_TOPICS.filter((t) => !servedIds.has(t.topicId));
  let cycle = currentCycle;

  if (remaining.length === 0) {
    cycle = currentCycle + 1;
    remaining = HISTORY_TOPICS.filter((t) => t.topicId !== latest?.topicId);
  }

  const next = pickRandom(remaining);

  await prisma.servedTopic.create({
    data: { userId, topicId: next.topicId, cycle },
  });

  return next;
}


export async function resetSession(userId: string): Promise<void> {
  await prisma.servedTopic.deleteMany({ where: { userId } });
}