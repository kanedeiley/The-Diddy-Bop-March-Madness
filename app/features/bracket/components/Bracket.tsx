"use client"
import { useBracketContext } from "../context/useBracketContext"
import FinalBracket from "../final/components/FinalBracket"
import RegionBracket from "../region/components/RegionBracket"

function Bracket() {
  const { selectedRegion } = useBracketContext()
  return (
        <div className="bracket-content">
          {selectedRegion === "final" ? (
            <FinalBracket />
          ) : (
            <RegionBracket
              position="left"
            />
          )
          }
          </div>
  )
}

export default Bracket