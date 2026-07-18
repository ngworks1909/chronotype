"use client"

import { Wrench } from "lucide-react"
import { WordCount } from "@/types/home"
import { useTypingSession } from "@/providers/TypeProvider"

const COUNTS: WordCount[] = [30, 50, 100, 150, 200, 250, 300]

export default function WordCountSelector() {
  const { wordCount, setWordCount, status } = useTypingSession()

  return (
    <div className="flex items-center gap-3 text-sm">
      {COUNTS.map((count) => (
        <button
          key={count}
          onClick={() => setWordCount(count)}
          disabled={status === "loading"}
          className={`transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            wordCount === count ? "text-[#e2b714]" : "text-[#646669] hover:text-[#d1d0c5]"
          }`}
        >
          {count}
        </button>
      ))}
      <button className="text-[#646669] hover:text-[#d1d0c5] transition-colors" aria-label="Custom">
        <Wrench size={14} />
      </button>
    </div>
  )
}