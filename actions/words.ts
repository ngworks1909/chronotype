import {api} from "@/lib/api" // adjust to wherever your axios instance is exported from

/**
 * Strips punctuation and splits raw prose into clean, lowercase words
 * suitable for the typing test (no trailing commas/periods, no stray
 * quotes, no empty tokens from double spaces, etc).
 */
function parseContentIntoWords(content: string): string[] {
  return content
    .split(/\s+/)
    .map((raw) =>
      raw
        // strip leading/trailing punctuation but keep internal characters
        // like apostrophes in "Mahmud's" -> "mahmud's"
        .replace(/^[^a-zA-Z0-9']+|[^a-zA-Z0-9']+$/g, "")
        .toLowerCase()
    )
    .filter((word) => word.length > 0)
}

/**
 * The API returns a single prose string (the `content` field), not a
 * pre-split array — so we parse it into words ourselves, then take exactly
 * `count` of them. If the passage doesn't have enough words, we cycle back
 * through it rather than returning short (which would silently shrink the
 * timer, since duration is driven by the returned array's length).
 */
function takeWordCount(words: string[], count: number): string[] {
  if (words.length === 0) return []
  if (words.length >= count) return words.slice(0, count)

  const result: string[] = []
  for (let i = 0; result.length < count; i++) {
    result.push(words[i % words.length])
  }
  return result
}

export async function fetchTypingWords(count: number, topicId?: string): Promise<string[]> {
  const { data } = await api.post<{ content: string }>("/generate", {
    words: count,
    ...(topicId && { topicId }),
  })

  const words = parseContentIntoWords(data.content)
  return takeWordCount(words, count)
}