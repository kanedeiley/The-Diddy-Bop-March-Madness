import { useBracketContext } from "../../context/useBracketContext"
import { regions } from "../../constants"
function RegionSelector() {

      const { selectedRegion, setSelectedRegion } = useBracketContext()
    
  return (
    <nav
      aria-label="Bracket regions"
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm px-2 py-2 flex gap-2">
        {regions.map((region) => {
          const active = region === selectedRegion
          return (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              aria-pressed={active}
              className={`capitalize text-[10px] py-1 px-2 rounded transition-all ${
                active
                  ? "bg-blue-500/90 text-white"
                  : "text-gray-600 hover:bg-gray-100/50"
              }`}
            >
              {region}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default RegionSelector