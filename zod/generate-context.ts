import { z } from "zod";

export const generateContextRequestSchema = z.object({
  topicId: z.string().optional(),
  words: z.number().int({ message: "Words must be an integer" })
    .min(30, { message: "Words must be at least 30" })
    .max(300, { message: "Words must be at most 300" }),
});