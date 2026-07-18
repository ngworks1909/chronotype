import { generateContextRequestSchema } from "@/zod/generate-context";
import z from "zod";

export type GenerateContextRequest =  z.infer<typeof generateContextRequestSchema>;

export interface GenerateContextResponse {
  topicId: string;
  era: string;
  topic: string;
  requestedWords: number;
  actualWords: number;
  content: string;
}
