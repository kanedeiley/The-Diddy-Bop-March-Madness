'use client';

import { useBracketContext } from '../../context/useBracketContext';

export default function RegionChampion() {
  const { currentRegionWinner, selectedRegion } = useBracketContext();

  if (!currentRegionWinner) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-2 border-yellow-400 shadow-md overflow-hidden">
      <div className="border-l-4 border-l-yellow-500 px-4 py-3">
        <div className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-2">
          {selectedRegion} Champion
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-yellow-700">
            {currentRegionWinner.seed}
          </span>
          <span className="text-sm font-bold text-gray-900">
            {currentRegionWinner.name}
          </span>
        </div>
      </div>
    </div>
  );
}