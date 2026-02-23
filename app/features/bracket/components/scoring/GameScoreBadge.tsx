'use client';

import { ScoredPick } from '../../lib/resolve-bracket';

type GameScoreBadgeProps = {
  scoredPick: ScoredPick | undefined;
};

export default function GameScoreBadge({ scoredPick }: GameScoreBadgeProps) {
  if (!scoredPick) return null;

  const { status, points, is_cinderella } = scoredPick;

  if (status === 'pending') {
    return (
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        <span>TBD</span>
      </div>
    );
  }

  if (status === 'correct') {
    return (
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
        <span>✓</span>
        <span>+{points}</span>
        {is_cinderella && (
          <span className="text-amber-500" title="Cinderella bonus!">
            👸
          </span>
        )}
      </div>
    );
  }

  // wrong
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
      <span>✗</span>
      <span>0</span>
    </div>
  );
}