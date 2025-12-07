'use client'
import { usePathname } from "next/navigation"
import SignOut from "@/app/components/auth/sign-out"
import Link from "next/link"
import { Logo } from "@/app/components/icons"
export default function Navbar() {
  const path = usePathname()

  if (path === "/login" || path === "/profile/create") return null

  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid #eaeaea",
          background: "white",
        }}
      >
        <Link href={'/'}>
        <Logo className="h-8 stroke-black fill-black text-gray-700" />
        </Link>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/brackets">Brackets</Link>
          <Link href="/scoreboard">Scoreboard</Link>
          <Link href="/winners">Winners</Link>
  
          <SignOut />
        </div>

      </nav>

    </div>
  )
}