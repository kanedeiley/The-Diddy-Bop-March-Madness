// features/bracket/components/bracket/FinalBracket.tsx
'use client';

import { useEffect } from 'react';
import { useBracketContext } from '../../context/useBracketContext';
import { useBracketScore } from '../../hooks/useBracketScore';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';
import { team } from '../../types';
import NationalChampion from './FinalChampion';
import ScoredGameCard from '../../components/scoring/ScoreGameCard';
type Game = {
  id: string;
  team1?: team;
  team2?: team;
  winner?: team;
  round: number;
  position: number;
};

type FinalFourBracketProps = {
  position: 'left' | 'right';
};

/**
 * Map Final Four game objects to their game_slot strings.
 * round=1 → semifinal-{position+1}
 * round=2 → championship
 */
function getFinalFourSlot(game: Game): string {
  if (game.round === 2) return 'championship';
  return `semifinal-${game.position + 1}`;
}

export default function FinalBracket({ position }: FinalFourBracketProps) {
  const {
    selectedCinderella,
    finalFourGames,
    selectFinalFourWinner,
    ensureFinalFourInitialized,
    nationalChampion,
  } = useBracketContext();

  const { score, getPickScore, getActualResult, isLoading } =
    useBracketScore();

  useEffect(() => {
    ensureFinalFourInitialized();
  }, [ensureFinalFourInitialized]);

  const games = finalFourGames;
  const config = CURRENT_TOURNAMENT_CONFIG;

  const gameHeight = 80;
  const gameWidth = 200;
  const roundGap = 280;
  const verticalGap = 20;

  const selectWinner = (game: Game, team: team) => {
    selectFinalFourWinner(game.id, team);
  };

  const getGamePosition = (game: Game) => {
    const round = game.round;
    const spacingMultiplier = Math.pow(2, round - 1);

    let x: number;
    const y =
      100 + game.position * (gameHeight + verticalGap) * spacingMultiplier;

    if (position === 'left') {
      x = 100 + (round - 1) * roundGap;
    } else {
      x = 100 + (2 - round) * roundGap;
    }

    return { x, y };
  };

  const renderConnector = (game: Game) => {
    if (game.round >= 2) return null;

    const from = getGamePosition(game);
    const nextRound = game.round + 1;
    const nextPosition = Math.floor(game.position / 2);
    const nextGame = games.find(
      (g) => g.round === nextRound && g.position === nextPosition
    );

    if (!nextGame) return null;

    const to = getGamePosition(nextGame);
    const isTopBracket = game.position % 2 === 0;

    if (position === 'left') {
      const startX = from.x + gameWidth;
      const startY = from.y + gameHeight / 2;
      const endX = to.x;
      const endY =
        to.y + (isTopBracket ? gameHeight / 3 : (2 * gameHeight) / 3);
      const midX = (startX + endX) / 2;

      return (
        <path
          key={`connector-${game.id}`}
          d={`M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`}
          stroke="#cbd5e1"
          strokeWidth="2"
          fill="none"
        />
      );
    } else {
      const startX = from.x;
      const startY = from.y + gameHeight / 2;
      const endX = to.x + gameWidth;
      const endY =
        to.y + (isTopBracket ? gameHeight / 3 : (2 * gameHeight) / 3);
      const midX = (startX + endX) / 2;

      return (
        <path
          key={`connector-${game.id}`}
          d={`M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`}
          stroke="#cbd5e1"
          strokeWidth="2"
          fill="none"
        />
      );
    }
  };

  const getRoundLabel = (round: number) => {
    switch (round) {
      case 1:
        return 'National Semifinal';
      case 2:
        return 'National Championship';
      default:
        return '';
    }
  };

  if (!games || games.length === 0) {
    return (
      <div className="relative">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
            Final Four
          </h2>
          <div className="h-1 w-20 bg-blue-500 mt-2 rounded"></div>
        </div>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading Final Four bracket...</p>
        </div>
      </div>
    );
  }

  // Compute Final Four score summary
  const finalFourPicks = score?.picks.filter(
    (p) =>
      p.game_slot.startsWith('semifinal-') ||
      p.game_slot === 'championship'
  );
  const ffPoints = finalFourPicks?.reduce((sum, p) => sum + p.points, 0) ?? 0;
  const ffCorrect =
    finalFourPicks?.filter((p) => p.status === 'correct').length ?? 0;
  const ffWrong =
    finalFourPicks?.filter((p) => p.status === 'wrong').length ?? 0;
  const ffPending =
    finalFourPicks?.filter((p) => p.status === 'pending').length ?? 0;

  return (
    <div className="relative">
      {/* Final Four Header + Score Summary */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
            Final Four
          </h2>
          {config.finalFourLocation && (
            <p className="text-sm text-gray-600 mt-1">
              {config.finalFourLocation}
            </p>
          )}
          <div className="h-1 w-20 bg-blue-500 mt-2 rounded"></div>
        </div>

        {/* Score summary for Final Four */}
        {score && finalFourPicks && finalFourPicks.length > 0 && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-gray-900">
                {ffPoints}
              </span>
              <span className="text-gray-400 text-xs">pts</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {ffCorrect > 0 && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {ffCorrect}
                </span>
              )}
              {ffWrong > 0 && (
                <span className="flex items-center gap-1 text-red-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {ffWrong}
                </span>
              )}
              {ffPending > 0 && (
                <span className="flex items-center gap-1 text-gray-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  {ffPending}
                </span>
              )}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-xs text-gray-400 animate-pulse">
            Loading scores...
          </div>
        )}
      </div>

      {/* Bracket Canvas */}
      <div className="relative" style={{ width: '800px', height: '600px' }}>
        {/* SVG connectors */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {games.map((game) => renderConnector(game))}
        </svg>

        {/* Round Labels */}
        {[1, 2].map((round) => {
          const sampleGame = games.find((g) => g.round === round);
          if (!sampleGame) return null;

          const pos = getGamePosition(sampleGame);
          return (
            <div
              key={`label-${round}`}
              className="absolute text-xs font-semibold text-gray-500 uppercase tracking-wider"
              style={{
                left: `${pos.x + gameWidth / 2}px`,
                top: '50px',
                transform: 'translateX(-50%)',
              }}
            >
              {getRoundLabel(round)}
            </div>
          );
        })}

        {/* Games with scoring */}
        {games.map((game) => {
          const pos = getGamePosition(game);
          const slot = getFinalFourSlot(game);

          return (
            <div
              key={game.id}
              className="absolute"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${gameWidth}px`,
              }}
            >
              <ScoredGameCard
                game={game}
                scoredPick={getPickScore(slot)}
                actualResult={getActualResult(slot)}
              />
            </div>
          );
        })}

        {/* National Champion */}
        {nationalChampion && (
          <>
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            >
              <path
                d={`M ${100 + roundGap + gameWidth} ${100 + gameHeight / 2} L ${650} ${100 + 40}`}
                stroke="#fbbf24"
                strokeWidth="3"
                fill="none"
              />
            </svg>
            <div
              className="absolute"
              style={{
                left: '650px',
                top: '100px',
                width: `${gameWidth}px`,
              }}
            >
              <NationalChampion />
            </div>
          </>
        )}
      </div>
    </div>
  );
}