"use client"

import { type CSSProperties } from "react"
import { User, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

const serikaDarkVars = {
  "--popover": "#2c2e31",
  "--popover-foreground": "#d1d0c5",
  "--accent": "#323437",
  "--accent-foreground": "#d1d0c5",
  "--muted-foreground": "#646669",
} as CSSProperties


export default function AccountDropdown() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto p-0 gap-2 text-sm font-normal text-[#646669] hover:text-[#d1d0c5] hover:bg-transparent aria-expanded:text-[#d1d0c5] aria-expanded:bg-transparent"
            aria-label="Account"
          >
            <User size={18} />
            <ChevronDown size={14} />
          </Button>
        }
      />

      <DropdownMenuContent
        align="end"
        style={serikaDarkVars}
        className="w-40 border border-[#646669]/10"
      >
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-[#ca4754]! focus:text-[#ca4754]! data-highlighted:text-[#ca4754]! [&_svg]:text-[#ca4754]! [&_svg]:stroke-[#ca4754]!"
            >
              <LogOut size={14} />
              Logout
            </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}