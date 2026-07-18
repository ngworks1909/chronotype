import prisma from '@/lib/client';
import { HistoryTopic } from '@/types/topics';
import {Prisma} from '@prisma/client';

interface BaseTopicResponse{
    success: boolean;
}
interface TopicSuccessResponse extends BaseTopicResponse{
    topics: {
        topicId: string;
        name: string;
        era: string
    }[];
    success: true;
}
interface TopicErrorResponse extends BaseTopicResponse{
    error: string;
    success: false;
}

export type TopicResponse = TopicSuccessResponse | TopicErrorResponse;

export async function fetchTopicById(topicId: string): Promise<HistoryTopic | null> {
    const topic = await prisma.topic.findUnique({
        where: { topicId },
    })
    return topic
}

export async function fetchTopics(): Promise<TopicResponse> {
  try {
    const topcs = await prisma.topic.findMany();
    return { topics: topcs, success: true };
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError) return { error: error.message ?? "Failed to fetch topics from the database.", success: false };
    return { error: "Failed to fetch topics from the database.", success: false };
  }
}
