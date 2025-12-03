import { Cinderella } from "@/app/components/icons"
import Link from "next/link"

export default function Navbar(){
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
            <div style={{ fontWeight: 700 }}>March Madness</div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link href="/">Brackets</Link>
              <Link href="/brackets">Scoreboard</Link>
              <Link href="/about">Winners</Link>
            </div>
               
          </nav>
       
        </div>
    )
}