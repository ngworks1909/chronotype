import { generateHistoryContent } from "@/actions/generator";
import { getNextTopic } from "@/actions/randomizer";
import { GenerateContextRequest, GenerateContextResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth'
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { generateContextRequestSchema } from "@/zod/generate-context";
import { fetchTopicById } from "@/actions/topics";
import { HistoryTopic } from "@/types/topics";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();
    const generateContextValidationResponse = generateContextRequestSchema.safeParse(data);
    if (!generateContextValidationResponse.success) {
      return NextResponse.json({ error: generateContextValidationResponse.error.issues[0] }, { status: 400 });
    }
    const { words, topicId: manualTopic }: GenerateContextRequest = generateContextValidationResponse.data;
    const userId = session.user.id;
    let chosen: HistoryTopic | null = null;
    if(manualTopic) {
      chosen = await fetchTopicById(manualTopic);
    }
    if(!chosen) {
      chosen = await getNextTopic(userId);
    }

    const content = await generateHistoryContent(chosen.name, words);
    const actualWords = content.trim().split(/\s+/).length;

    const payload: GenerateContextResponse = {
      topicId: chosen.topicId,
      era: chosen.era,
      topic: chosen.name,
      requestedWords: words,
      actualWords,
      content
    };
    return NextResponse.json(payload);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("[generate-context] error:", err.message);
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}