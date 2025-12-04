import { Cinderella } from "@/app/components/icons"
import Link from "next/link"

export default function Navbar() {
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
        <div style={{ fontWeight: 700 }}><Link href="/">March Madness</Link></div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/brackets">Brackets</Link>
          <Link href="/scoreboard">Scoreboard</Link>
          <Link href="/winners">Winners</Link>
        </div>

      </nav>

    </div>
  )
}