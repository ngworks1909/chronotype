import { AuthType } from "@/interfaces/auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldDescription } from "@/components/ui/field"
import Link from 'next/link'
import AuthForm from './AuthForm'
import { Keyboard } from "lucide-react"

export default function Auth({ type }: { type: AuthType }) {
  return (
    <div className="min-h-screen w-full bg-[#323437] flex">
      {/* Left panel — brand / hero, mirrors the homepage's typing test feel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#2c2e31] border-r border-[#646669]/10 relative overflow-hidden">
        <Link href="/" className="flex items-center gap-3 z-10">
          {/* <div className="flex items-center justify-center w-10 h-10 rounded-md border-2 border-[#e2b714]">
            <span className="text-[#e2b714] font-bold text-lg">m</span>
          </div> */}
          <Keyboard size={32} className="text-[#e2b714]"/>
          <span className="text-2xl font-bold text-[#d1d0c5] tracking-tight">
            monkey<span className="text-[#e2b714]">type</span>
          </span>
        </Link>

        <div className="z-10 space-y-4">
          <p className="text-3xl leading-relaxed font-mono text-[#97999c] select-none">
            the <span className="text-[#e2b714]">quick</span> brown fox{" "}
            <span className="text-[#d1d0c5]">jumps</span> over the lazy dog
            while <span className="text-[#e2b714]">practicing</span> to type
            faster <span className="text-[#d1d0c5]">every</span> single day
          </p>
        </div>

        <p className="z-10 text-sm text-[#97999c]">
          Minimalistic typing tests. Track your progress. Compete with the world.
        </p>

        {/* subtle ambient glow, matches the soft dark aesthetic */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#e2b714]/5 blur-3xl" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#e2b714]/5 blur-3xl" />
      </div>

      {/* Right panel — auth form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="flex flex-col gap-6 w-full max-w-sm">
          <Link href="/" className="flex lg:hidden items-center gap-2 justify-center mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md border-2 border-[#e2b714]">
              <span className="text-[#e2b714] font-bold">m</span>
            </div>
            <span className="text-xl font-bold text-[#d1d0c5]">
              monkey<span className="text-[#e2b714]">type</span>
            </span>
          </Link>

          <Card className="bg-[#2c2e31] border border-[#646669]/10 p-6 lg:p-8 rounded-lg shadow-xl">
            <CardHeader className="text-center px-0 pt-0">
              <CardTitle className="text-xl text-[#d1d0c5]">
                {type === "Login" ? "Welcome back" : "Join us today"}
              </CardTitle>
              <CardDescription className="text-[#97999c]">
                {type === "Login"
                  ? "Sign in to continue to your account."
                  : "Create your account and get started in seconds."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <AuthForm type={type} />
            </CardContent>
          </Card>

          <FieldDescription className="px-6 text-center text-[#97999c]">
            By clicking continue, you agree to our{" "}
           <Link
              href="/"
              className="text-[#e2b714] hover:text-[#e2b714]! no-underline! hover:underline! transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/"
              className="text-[#e2b714] hover:text-[#e2b714]! no-underline! hover:underline! transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}