import Header from "@/components/home/Header"
import ConfigBar from "@/components/home/ConfigBar"
import TypingArea from "@/components/home/TypingArea"
import Footer from "@/components/home/Footer"
import { TypingSessionProvider } from "@/providers/TypeProvider"

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#323437] flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-6 lg:px-16">
        <TypingSessionProvider>
          <ConfigBar />
          <div className="w-full max-w-6xl mt-16">
            <TypingArea />
          </div>
        </TypingSessionProvider>
      </main>

      <Footer />
    </div>
  )
}