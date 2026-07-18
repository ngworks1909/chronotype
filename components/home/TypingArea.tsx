"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { RotateCw, Loader2 } from "lucide-react"
import { useTypingSession } from "@/providers/TypeProvider"

const VISIBLE_LINES = 5
const LINES_ABOVE_CURRENT = 1 // keep this many completed lines visible above the active line

export default function TypingArea() {
  const { status, words, timeLeft, startTimer, finishTest, reload } = useTypingSession()

  const [wordIndex, setWordIndex] = useState(0)
  const [typed, setTyped] = useState("")
  const [completedWords, setCompletedWords] = useState<string[]>([])
  const [tabArmed, setTabArmed] = useState(false)

  const hasStartedRef = useRef(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])

  // Precomputed once per word-set load: which line index each word sits on,
  // and the pixel line height. Never recomputed per-keystroke.
  const wordLineMapRef = useRef<number[]>([])
  const lastScrollRef = useRef(0)
  const [lineHeight, setLineHeight] = useState(0)

  const restart = () => {
    setWordIndex(0)
    setTyped("")
    setCompletedWords([])
    hasStartedRef.current = false
    setTabArmed(false)
    lastScrollRef.current = 0
    if (viewportRef.current) viewportRef.current.scrollTop = 0
    reload()
  }

  const advanceWord = (finalTyped: string) => {
    const newCompleted = [...completedWords, finalTyped]
    setCompletedWords(newCompleted)
    setTyped("")
    const nextIndex = wordIndex + 1
    setWordIndex(nextIndex)
    if (nextIndex >= words.length) {
      finishTest(newCompleted.length)
    }
  }

  // Build the full word -> line index map ONCE, from the complete rendered
  // layout (all words are always rendered, just dimmed until reached), so
  // per-keystroke scrolling never has to re-derive line boundaries.
  useLayoutEffect(() => {
    const offsets = wordRefs.current.map((el) => (el ? el.offsetTop : 0))
    const uniqueTops: number[] = []
    offsets.forEach((top) => {
      if (uniqueTops.length === 0 || Math.abs(top - uniqueTops[uniqueTops.length - 1]) > 4) {
        uniqueTops.push(top)
      }
    })

    wordLineMapRef.current = offsets.map((top) => {
      let closestIndex = 0
      let closestDist = Infinity
      uniqueTops.forEach((t, idx) => {
        const dist = Math.abs(t - top)
        if (dist < closestDist) {
          closestDist = dist
          closestIndex = idx
        }
      })
      return closestIndex
    })

    if (uniqueTops.length >= 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLineHeight(uniqueTops[1] - uniqueTops[0])
    } else if (wordRefs.current[0]) {
      const lh = parseFloat(window.getComputedStyle(wordRefs.current[0]).lineHeight)
      if (!Number.isNaN(lh) && lh > 0) setLineHeight(lh)
    }

    // Always start pinned at the top for a fresh word set.
    if (viewportRef.current) viewportRef.current.scrollTop = 0
    lastScrollRef.current = 0
  }, [words])

  // Scroll using the precomputed map — just a lookup, no recalculation.
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || !lineHeight) return

    const currentLine = wordLineMapRef.current[wordIndex] ?? 0
    const targetScroll =
      currentLine <= LINES_ABOVE_CURRENT ? 0 : (currentLine - LINES_ABOVE_CURRENT) * lineHeight

    if (Math.abs(targetScroll - lastScrollRef.current) > 2) {
      viewport.scrollTo({ top: targetScroll, behavior: "smooth" })
      lastScrollRef.current = targetScroll
    }
  }, [wordIndex, lineHeight])

  // Auto-finish when the timer runs out, even if not all words were typed
  useEffect(() => {
    if (status === "running" && timeLeft === 0) {
      finishTest(completedWords.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, status])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === "loading") return

      if (e.key === "Tab") {
        e.preventDefault()
        setTabArmed(true)
        return
      }

      if (e.key === "Enter") {
        if (tabArmed) {
          e.preventDefault()
          restart()
        }
        setTabArmed(false)
        return
      }

      setTabArmed(false)

      if (status === "finished") return

      if (e.key === " ") {
        e.preventDefault()
        return
      }

      if (e.key === "Backspace") {
        if (typed.length > 0) {
          setTyped((prev) => prev.slice(0, -1))
        } else if (wordIndex > 0) {
          const previousTyped = completedWords[wordIndex - 1] ?? ""
          setCompletedWords((prev) => prev.slice(0, -1))
          setWordIndex((prev) => prev - 1)
          setTyped(previousTyped)
        }
        return
      }

      if (e.key.length === 1) {
        if (!hasStartedRef.current && status === "ready") {
          hasStartedRef.current = true
          startTimer()
        }

        const currentWord = words[wordIndex] ?? ""
        const newTyped = typed + e.key

        if (currentWord.length > 0 && newTyped.length >= currentWord.length) {
          advanceWord(newTyped)
        } else {
          setTyped(newTyped)
        }
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, words, wordIndex, typed, completedWords, tabArmed, startTimer, finishTest])

  // ---- Loading state ----
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <Loader2 size={28} className="text-[#e2b714] animate-spin" />
        <p className="text-sm text-[#646669]">Generating words…</p>
      </div>
    )
  }

  // ---- Finished state ----
  if (status === "finished") {
    const wps = completedWords.length > 0 ? (completedWords.length / (words.length || 1)) : 0
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="text-center">
          <p className="text-6xl font-mono text-[#e2b714]">{wps.toFixed(2)}</p>
          <p className="text-sm text-[#646669] mt-2">words per second</p>
        </div>
        <p className="text-sm text-[#646669]">
          {completedWords.length} / {words.length} words typed
        </p>
        <button
          onClick={restart}
          className="flex items-center gap-2 text-[#646669] hover:text-[#d1d0c5] transition-colors"
        >
          <RotateCw size={18} />
          <span className="text-sm">restart</span>
        </button>
      </div>
    )
  }

  // ---- Typing state (ready / running) ----
  return (
    <div className="flex flex-col items-center gap-8">
      <div
        ref={viewportRef}
        className="w-full max-w-5xl overflow-y-auto overflow-x-hidden"
        style={{
          height: lineHeight ? lineHeight * VISIBLE_LINES : lineHeight,
          scrollbarWidth: "none",
          // Only fade the bottom edge now — top stays fully visible.
          maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
        }}
      >
        <div className="text-3xl leading-relaxed font-mono select-none text-center">
          {words.map((word, i) => {
            const isCompleted = i < wordIndex
            const isCurrent = i === wordIndex
            const originalWord = isCompleted ? completedWords[i] : null

            return (
              <span
                key={i}
                ref={(el) => {
                  wordRefs.current[i] = el
                }}
                className="mr-3 inline-block transition-colors duration-150"
              >
                {isCurrent
                  ? [...word].map((char, ci) => {
                      const typedChar = typed[ci]
                      let color = "text-[#646669]"
                      if (typedChar !== undefined) {
                        color = typedChar === char ? "text-[#d1d0c5]" : "text-[#ca4754]"
                      }
                      return (
                        <span key={ci} className={`transition-colors duration-100 ${color}`}>
                          {char}
                        </span>
                      )
                    })
                  : (
                    <span
                      className={`transition-colors duration-150 ${
                        isCompleted && originalWord !== word
                          ? "text-[#ca4754]"
                          : isCompleted
                          ? "text-[#d1d0c5]"
                          : "text-[#646669]"
                      }`}
                    >
                      {word}
                    </span>
                  )}
              </span>
            )
          })}
        </div>
      </div>

      <button
        onClick={restart}
        className={`transition-colors ${
          tabArmed ? "text-[#e2b714]" : "text-[#646669] hover:text-[#d1d0c5]"
        }`}
        aria-label="Restart test"
      >
        <RotateCw size={22} />
      </button>

      <div className="flex items-center gap-2 text-xs text-[#646669]">
        <kbd
          className={`px-1.5 py-0.5 bg-[#2c2e31] rounded border ${
            tabArmed ? "border-[#e2b714] text-[#e2b714]" : "border-[#646669]/20"
          }`}
        >
          tab
        </kbd>
        <span>+</span>
        <kbd className="px-1.5 py-0.5 bg-[#2c2e31] rounded border border-[#646669]/20">enter</kbd>
        <span>- restart test</span>
      </div>
    </div>
  )
}