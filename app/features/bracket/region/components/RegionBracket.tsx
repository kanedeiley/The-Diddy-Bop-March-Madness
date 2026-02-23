'use client';

import { useEffect } from 'react';
import { useBracketContext } from '../../context/useBracketContext';
import { useBracketScore } from '../../hooks/useBracketScore';
import CinderellaSelector from './CinderellaSelector';
import RegionChampion from './RegionChampion';
import ScoreSummaryBar from '../../components/scoring/ScoreSummaryBar';
import ScoredGameCard from '../../components/scoring/ScoreGameCard';
import { Game } from '../../types';

type RegionBracketProps = {
  position: 'left' | 'right';
};

export default function RegionBracket({ position }: RegionBracketProps) {
  const {
    selectedRegion,
    currentRegionGames,
    ensureRegionInitialized,
    currentRegionWinner,
    bracketId,
  } = useBracketContext();

const { score, getPickScore, getActualResult, isLoading } = useBracketScore(bracketId ?? undefined);

  useEffect(() => {
    ensureRegionInitialized(selectedRegion);
  }, [selectedRegion, ensureRegionInitialized]);

  const games = currentRegionGames;

  const gameHeight = 80;
  const gameWidth = 200;
  const roundGap = 280;
  const verticalGap = 20;

  // Build game_slot string for a game in the current region
  const getGameSlot = (game: Game) =>
    `${selectedRegion.toLowerCase()}-r${game.round}-${game.position}`;

  const getGamePosition = (game: Game) => {
    const round = game.round;
    const spacingMultiplier = Math.pow(2, round - 1);

    let x: number;
    const y =
      100 + game.position * (gameHeight + verticalGap) * spacingMultiplier;

    if (position === 'left') {
      x = 100 + (round - 1) * roundGap;
    } else {
      x = 100 + (4 - round) * roundGap;
    }

    return { x, y };
  };

  const renderConnector = (game: Game) => {
    if (game.round >= 4) return null;

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
        return 'Round of 64';
      case 2:
        return 'Round of 32';
      case 3:
        return 'Sweet 16';
      case 4:
        return 'Elite 8';
      default:
        return '';
    }
  };

  if (!games || games.length === 0) {
    return (
      <div className="relative">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
            {selectedRegion}
          </h2>
          <div className="h-1 w-20 bg-blue-500 mt-2 rounded"></div>
        </div>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading bracket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Region Header + Score Summary */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
            {selectedRegion}
          </h2>
          <div className="h-1 w-20 bg-blue-500 mt-2 rounded"></div>
        </div>
        <ScoreSummaryBar
          score={score}
          region={selectedRegion}
          isLoading={isLoading}
        />
      </div>

      {/* Bracket Canvas */}
      <div
        className="relative"
        style={{ width: '1400px', height: '1400px' }}
      >
        {/* SVG connectors */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {games.map((game) => renderConnector(game))}
        </svg>

        {/* Round Labels */}
        {[1, 2, 3, 4].map((round) => {
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
          const slot = getGameSlot(game);

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

        {/* Cinderella selector */}
        <div
          className="absolute"
          style={{
            left: '100px',
            top: '900px',
            width: `${gameWidth}px`,
          }}
        >
          <CinderellaSelector />
        </div>

        {/* Region champion */}
        {currentRegionWinner && (
          <>
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            >
              <path
                d={`M ${100 + (4 - 1) * roundGap + gameWidth} ${100 + gameHeight / 2} L ${1200} ${100 + 40}`}
                stroke="#fbbf24"
                strokeWidth="3"
                fill="none"
              />
            </svg>
            <div
              className="absolute"
              style={{
                left: '1200px',
                top: '100px',
                width: `${gameWidth}px`,
              }}
            >
              <RegionChampion />
            </div>
          </>
        )}
      </div>
    </div>
  );
}