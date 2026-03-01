import { useBracketContext } from "../context/useBracketContext"
import { regions } from "../constants"
import { Cancel, Check, Flag } from "@/app/components/icons/EditIcons"
import { useState } from "react"
import { useBracketSave } from "../hooks/useBracketSave"
import { CURRENT_TOURNAMENT_CONFIG } from "@/app/config"
import RegionSelector from "../region/components/RegionSelector"


const {year} = CURRENT_TOURNAMENT_CONFIG
export default function BracketMenu() {
  const { selectedRegion, setSelectedRegion, resetToSavedBracket } = useBracketContext()
  const [isHovered, setIsHovered] = useState(false)
  const { save, saving, error } = useBracketSave(year)


  return (
    <>
<RegionSelector />
 {(Date.now() > CURRENT_TOURNAMENT_CONFIG.lockedTime.getTime()) ? (
  null
 ) : (
    <nav
      aria-label="Bracket actions"
      className="fixed bottom-6 left-6 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative inline-block">

        <div className="bg-white/80 backdrop-blur-sm rounded-full shadow-sm px-1 py-1 flex  transition-all duration-300">
          <button
            type="button"
            className="capitalize text-xs py-2 px-2 rounded-full transition-all text-gray-600 hover:bg-gray-200/50"
          >
            <Flag className="h-4 w-4" />
          </button>
          
          <div className={`overflow-hidden transition-all duration-300  ${
            isHovered ? 'w-10 opacity-100 ml-2' : 'w-0 opacity-0'
          }`}>
            <button
            title="Submit Bracket"
              type="button"
              className="capitalize text-xs py-2 px-2 rounded-full transition-all text-green-600 hover:bg-green-100/50 whitespace-nowrap"
              onClick={save} 
              disabled={saving}
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
          
          {/* Cancel icon - slides in from right */}
          <div className={`overflow-hidden transition-all duration-300 ${
            isHovered ? 'w-10 opacity-100 ml-2' : 'w-0 opacity-0'
          }`}>
            <button
            title="Reset Bracket"
              type="button"
              className="capitalize text-xs py-2 px-2 rounded-full transition-all text-red-600 hover:bg-red-100/50 whitespace-nowrap"
              onClick={resetToSavedBracket}
            >
              <Cancel className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
 )}
    </>
  )
}