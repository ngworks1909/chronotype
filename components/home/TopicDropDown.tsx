"use client"

import { BookOpen, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HistoryTopic } from "@/types/topics"
import { useTypingSession } from "@/providers/TypeProvider"

export default function TopicDropdown({ topics }: { topics: HistoryTopic[] }) {
  const { selectedTopic, setTopic } = useTypingSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto p-0 gap-2 text-sm font-normal text-[#909296]! hover:text-[#d1d0c5]! hover:bg-transparent! aria-expanded:text-[#d1d0c5]! aria-expanded:bg-transparent!"
          >
            <BookOpen size={14} className="text-[#646669]!" />
            {selectedTopic ? selectedTopic.name : "All Topics"}
            <ChevronDown size={14} className="text-[#646669]!" />
          </Button>
        }
      />

      <DropdownMenuContent
        align="start"
        className="w-60 max-h-72 overflow-y-auto scrollbar-thin bg-[#2c2e31] border border-[#646669]/10 text-[#d1d0c5]"
      >
        <DropdownMenuItem
          onClick={() => setTopic(null)}
          className="flex items-center justify-between cursor-pointer focus:bg-[#323437]! data-highlighted:bg-[#323437]!"
        >
          <span className={selectedTopic === null ? "text-[#e2b714]!" : "text-[#d1d0c5]!"}>
            All Topics
          </span>
          {selectedTopic === null && (
            <Check size={14} className="text-[#e2b714]! [&_*]:stroke-[#e2b714]!" />
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[#646669]/20" />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-[#646669]! font-normal">
            Choose a topic
          </DropdownMenuLabel>

          {topics.map((topic) => (
            <DropdownMenuItem
              key={topic.topicId}
              onClick={() => setTopic(topic)}
              className="flex flex-col items-start gap-0.5 cursor-pointer focus:bg-[#323437]! data-highlighted:bg-[#323437]! transition-colors"
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={
                    selectedTopic?.topicId === topic.topicId ? "text-[#e2b714]!" : "text-[#d1d0c5]!"
                  }
                >
                  {topic.name}
                </span>
                {selectedTopic?.topicId === topic.topicId && (
                  <Check size={14} className="text-[#e2b714]! [&_*]:stroke-[#e2b714]!" />
                )}
              </div>
              <span className="text-xs text-[#646669]!">{topic.era}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}