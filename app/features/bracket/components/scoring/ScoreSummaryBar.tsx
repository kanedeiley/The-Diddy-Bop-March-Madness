'use client';

import { BracketScoreResult } from '../../lib/resolve-bracket';

type ScoreSummaryBarProps = {
  score: BracketScoreResult | null;
  region: string;
  isLoading: boolean;
};

/**
 * Compact scoring summary rendered in the region header.
 * Filters the full score to only show picks for the current region.
 */
export default function ScoreSummaryBar({
  score,
  region,
  isLoading,
}: ScoreSummaryBarProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse">
        Loading scores...
      </div>
    );
  }

  if (!score) return null;

  // Filter to this region's picks (game_slot starts with region name)
  const regionPrefix = region.toLowerCase();
  const regionPicks = score.picks.filter((p) =>
    p.game_slot.startsWith(regionPrefix + '-')
  );

  if (regionPicks.length === 0) return null;

  const points = regionPicks.reduce((sum, p) => sum + p.points, 0);
  const correct = regionPicks.filter((p) => p.status === 'correct').length;
  const wrong = regionPicks.filter((p) => p.status === 'wrong').length;
  const pending = regionPicks.filter((p) => p.status === 'pending').length;

  return (
    <div className="flex items-center gap-4 text-sm">
      {/* Points */}
      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold text-gray-900">{points}</span>
        <span className="text-gray-400 text-xs">pts</span>
      </div>

      {/* Breakdown */}
      <div className="flex items-center gap-3 text-xs">
        {correct > 0 && (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {correct}
          </span>
        )}
        {wrong > 0 && (
          <span className="flex items-center gap-1 text-red-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {wrong}
          </span>
        )}
        {pending > 0 && (
          <span className="flex items-center gap-1 text-gray-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            {pending}
          </span>
        )}
      </div>
    </div>
  );
}