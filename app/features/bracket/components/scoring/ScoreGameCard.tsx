'use client';

import { Game } from '../../types';
import TeamCard from '../../components/teams/TeamCard';
import GameScoreBadge from './GameScoreBadge';
import { ScoredPick, ResolvedGame } from '../../lib/resolve-bracket';

type ScoredGameCardProps = {
  game: Game;
  scoredPick?: ScoredPick;
  actualResult?: ResolvedGame;
};

/**
 * Wraps the existing game matchup (two TeamCards) with a score badge
 * and visual border color based on pick result.
 */
export default function ScoredGameCard({
  game,
  scoredPick,
  actualResult,
}: ScoredGameCardProps) {
  // Border color reflects scoring status
  const borderClass = !scoredPick
    ? 'border-gray-300'
    : scoredPick.status === 'correct'
      ? 'border-green-400'
      : scoredPick.status === 'wrong'
        ? 'border-red-400'
        : 'border-gray-300';

  return (
    <div className="relative">
      {/* Score badge - top right */}
      {scoredPick && (
        <div className="absolute -top-2.5 -right-2 z-10">
          <GameScoreBadge scoredPick={scoredPick} />
        </div>
      )}

      {/* Game card */}
      <div
        className={`bg-white rounded-lg border-2 ${borderClass} shadow-md overflow-hidden hover:shadow-lg transition-shadow`}
      >
        <TeamCard teamNumber={1} game={game} />
        <TeamCard teamNumber={2} game={game} />
      </div>
    </div>
  );
}