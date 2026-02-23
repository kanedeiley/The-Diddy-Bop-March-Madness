import { useState } from "react"
import { useBracketContext } from "../../context/useBracketContext"
import { regions } from "../../constants"

function RegionSelectorDropdown() {
  const { selectedRegion, setSelectedRegion } = useBracketContext()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block w-full max-w-[200px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/80 border border-gray-200 backdrop-blur-sm rounded-md px-2.5 py-1.5 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-300 transition-all shadow-sm"
      >
        <span className="capitalize">{selectedRegion}</span>
        <svg
          className={`w-3.5 h-3.5 ml-1.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm rounded-md border border-gray-200 shadow-lg z-10 py-1">
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => {
                setSelectedRegion(region)
                setIsOpen(false)
              }}
              className={`w-full text-left capitalize text-sm px-2.5 py-1.5 transition-all ${
                region === selectedRegion
                  ? "bg-blue-500 text-white font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default RegionSelectorDropdown