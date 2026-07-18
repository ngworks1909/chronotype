import Link from "next/link"
import { Keyboard } from "lucide-react"
import AccountButton from "./AccountButton"

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 lg:px-16 py-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <Keyboard size={32} className="text-[#e2b714]"/>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-[#d1d0c5]">
              monkey<span className="text-[#646669]">type</span>
            </span>
          </div>
        </Link>

      </div>

      <div className="flex items-center gap-4">
        <AccountButton />
      </div>
    </header>
  )
}