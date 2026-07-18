import Link from "next/link"
import { Mail, Headset, Code2, MessageCircle, X, FileText, ShieldCheck, Lock } from "lucide-react"

const LINKS = [
  { href: "/contact", label: "contact", icon: Mail },
  { href: "/support", label: "support", icon: Headset },
  { href: "https://github.com", label: "github", icon: Code2 },
  { href: "https://discord.com", label: "discord", icon: MessageCircle },
  { href: "https://twitter.com", label: "twitter", icon: X },
  { href: "/terms", label: "terms", icon: FileText },
  { href: "/security", label: "security", icon: ShieldCheck },
  { href: "/privacy", label: "privacy", icon: Lock },
]

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 px-6 lg:px-16 py-6 text-xs text-[#646669]">
      <div className="flex flex-wrap items-center gap-5">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-1.5 hover:text-[#d1d0c5] transition-colors"
          >
            <Icon size={14} />
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <span>serika dark</span>
        <span>v26.28.0</span>
      </div>
    </footer>
  )
}