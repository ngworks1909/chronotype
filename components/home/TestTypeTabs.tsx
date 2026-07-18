"use client"

import { useState } from "react"
import { Type } from "lucide-react"
import { TestType } from "@/types/home"

const TABS: { type: TestType; label: string; icon: React.ElementType }[] = [
  { type: "words", label: "words", icon: Type },
]

export default function TestTypeTabs() {
  const [active, setActive] = useState<TestType>("words")

  return (
    <div className="flex items-center gap-3 text-sm">
      {TABS.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          onClick={() => setActive(type)}
          className={`flex items-center gap-1.5 transition-colors ${
            active === type ? "text-[#e2b714]" : "text-[#646669] hover:text-[#d1d0c5]"
          }`}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  )
}