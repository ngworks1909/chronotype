"use client"

import TestTypeTabs from "./TestTypeTabs"
import WordCountSelector from "./WordCountSelector"
import { useTypingSession } from "@/providers/TypeProvider"

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")
  return `${m}:${s}`
}

export default function ConfigBarRow() {
  const { status, timeLeft } = useTypingSession()
  const isRunning = status === "running"

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 bg-[#2c2e31] rounded-md px-4 py-2 min-h-[40px]">
      {isRunning ? (
        <span className="text-2xl font-mono text-[#e2b714] tabular-nums tracking-wider">
          {formatTime(timeLeft)}
        </span>
      ) : (
        <>
          <div className="w-px h-5 bg-[#646669]/20" />
          <TestTypeTabs />
          <div className="w-px h-5 bg-[#646669]/20" />
          <WordCountSelector />
        </>
      )}
    </div>
  )
}