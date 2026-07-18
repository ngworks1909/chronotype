"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { fetchTypingWords } from "@/actions/words"
import { WordCount } from "@/types/home"
import { HistoryTopic } from "@/types/topics"

type SessionStatus = "loading" | "ready" | "running" | "finished"

interface TypeContextValue {
  status: SessionStatus
  words: string[]
  wordCount: WordCount
  timeLeft: number
  totalTime: number
  wps: number | null
  selectedTopic: HistoryTopic | null
  setWordCount: (count: WordCount) => void
  setTopic: (topic: HistoryTopic | null) => void
  startTimer: () => void
  finishTest: (wordsTyped: number) => void
  reload: () => void
}

const TypeContext = createContext<TypeContextValue | null>(null)

export function TypingSessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading")
  const [words, setWords] = useState<string[]>([])
  const [wordCount, setWordCountState] = useState<WordCount>(30)
  const [selectedTopic, setSelectedTopic] = useState<HistoryTopic | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [wps, setWps] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const WORD_PER_SECOND = 2

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const load = useCallback(
    async (count: WordCount, topicId?: string) => {
      clearTimer()
      setStatus("loading")
      setWps(null)
      // No topic selected -> only count is passed.
      // Topic selected -> count and topicId are both passed.
      const fetched = topicId
        ? await fetchTypingWords(count, topicId)
        : await fetchTypingWords(count)
      // Timer duration = actual words returned, per your spec (35 → 35s, 40+ → 40s, etc.)
      setWords(fetched)
      setTotalTime(fetched.length * WORD_PER_SECOND)
      setTimeLeft(fetched.length * WORD_PER_SECOND)
      setStatus("ready")
    },
    [clearTimer]
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(wordCount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setWordCount = useCallback(
    (count: WordCount) => {
      setWordCountState(count)
      load(count, selectedTopic?.topicId)
    },
    [load, selectedTopic]
  )

  const setTopic = useCallback(
    (topic: HistoryTopic | null) => {
      setSelectedTopic(topic)
      load(wordCount, topic?.topicId)
    },
    [load, wordCount]
  )

  const reload = useCallback(() => {
    load(wordCount, selectedTopic?.topicId)
  }, [load, wordCount, selectedTopic])

  const finishTest = useCallback(
    (wordsTyped: number) => {
      clearTimer()
      setStatus("finished")
      setWps(totalTime > 0 ? Number((wordsTyped / (totalTime)).toFixed(2)) : 0)
    },
    [clearTimer, totalTime]
  )

  const startTimer = useCallback(() => {
    if (status !== "ready") return
    setStatus("running")
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
  }, [status])

  useEffect(() => () => clearTimer(), [clearTimer])

  return (
    <TypeContext.Provider
      value={{
        status,
        words,
        wordCount,
        timeLeft,
        totalTime,
        wps,
        selectedTopic,
        setWordCount,
        setTopic,
        startTimer,
        finishTest,
        reload,
      }}
    >
      {children}
    </TypeContext.Provider>
  )
}

export function useTypingSession() {
  const ctx = useContext(TypeContext)
  if (!ctx) throw new Error("useTypingSession must be used within TypingSessionProvider")
  return ctx
}