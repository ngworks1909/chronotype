import { openai } from '@/lib/openai';

const MODEL = `openai/${process.env.OPENAI_MODEL ?? 'gpt-4o'}`

function buildSystemPrompt(): string {
  return `You are a subject-matter expert who writes study material for SSC CGL, SSC CHSL, and similar Indian competitive exams (Indian History section), covering the full timeline from early medieval invasions through modern India.

Rules for every response:
1. Match SSC CGL exam depth: exact years, correct chronological order of rulers/events, named battles, key figures, administrative/revenue terms, and commonly-asked "firsts" (first to do X, founder of Y) — these are exactly what gets asked as MCQs.
2. Be factually precise. If a date or detail is genuinely disputed among historians, say so briefly rather than inventing a specific number.
3. Write in clear, exam-prep style: short paragraphs, chronological flow, no flowery language.
4. Do NOT pad with generic filler sentences just to hit a word count. If the topic runs out of exam-relevant content before the target, stop rather than add fluff.
5. Return flowing prose paragraphs (no markdown headers/bullets unless asked) — this will be used as reading/context material.
6. Stay strictly within the given topic's scope; do not wander into unrelated eras.
7. Write in a clear, exam-prep style: short paragraphs, chronological flow, no flowery language.
8. Do not use any special characters except commas and full stops, and use those only to separate sentences and clauses. No apostrophes, quotation marks, parentheses, hyphens, colons, semicolons, or em-dashes anywhere in the output, including in possessives and contractions.`;
}

function buildUserPrompt(topic: string, words: number): string {
  return `Write approximately ${words} words of SSC CGL-level study content on: ${topic}\n\nTarget length: ${words} words (aim within +/-15%).`;
}

export async function generateHistoryContent(topic: string, words: number): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }

  const maxTokens = Math.min(4096, Math.ceil(words * 1.6) + 200);

  const completion = await openai.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    temperature: 0.7,
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(topic, words) },
    ],
  });

  const text = completion.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("No text content returned from GitHub Models API");
  }
  const cleanedText = text
  .replace(/\\n/g, " ")      // Removes literal "\n"
  .replace(/\r?\n/g, " ")    // Removes actual newlines
  .replace(/\s+/g, " ")      // Collapses multiple spaces
  .trim();
  return cleanedText;
}
