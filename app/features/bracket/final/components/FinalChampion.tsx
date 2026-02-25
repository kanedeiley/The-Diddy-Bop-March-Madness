'use client';

import Image from 'next/image';
import { useBracketContext } from '../../context/useBracketContext';

export default function NationalChampion() {
  const { nationalChampion } = useBracketContext();

  if (!nationalChampion) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-2 border-yellow-400 shadow-md overflow-hidden">
      <div className="border-l-4 border-l-yellow-500 px-4 py-3">
        <div className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-2">
          National Champion
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-yellow-700">
            {nationalChampion.seed}
          </span>
          <Image width={20} height={20} alt=" " src={`https://a.espncdn.com/i/teamlogos/ncaa/500/${nationalChampion.espnId}.png`} />
          <span className="text-sm font-bold text-gray-900">
            {nationalChampion.name}
          </span>
        </div>
      </div>
    </div>
  );
}