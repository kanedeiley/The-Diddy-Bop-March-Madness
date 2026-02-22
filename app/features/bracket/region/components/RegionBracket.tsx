'use client';
import { useEffect } from 'react';
import { useBracketContext } from '../../context/useBracketContext';
import CinderellaSelector from './CinderellaSelector';
import RegionChampion from './RegionChampion';
import { Game } from '../../types';
import TeamCard1 from '../../components/teams/TeamCard1';
import TeamCard2 from '../../components/teams/TeamCard2';

type RegionBracketProps = {
  position: 'left' | 'right';
};

export default function RegionBracket({ position }: RegionBracketProps) {
  const {
    selectedRegion,
    selectedCinderella,
    currentRegionGames,
    selectWinner: selectWinnerFromContext,
    ensureRegionInitialized,
    currentRegionWinner,
  } = useBracketContext();

  // Initialize games for this region on mount or when region changes
  useEffect(() => {
    ensureRegionInitialized(selectedRegion);
  }, [selectedRegion, ensureRegionInitialized]);

  const games = currentRegionGames;

  const gameHeight = 80;
  const gameWidth = 200;
  const roundGap = 280;
  const verticalGap = 20;

  const getGamePosition = (game: Game) => {
    const round = game.round;
    const spacingMultiplier = Math.pow(2, round - 1);
    
    let x: number;
    const y = 100 + game.position * (gameHeight + verticalGap) * spacingMultiplier;

    if (position === 'left') {
      x = 100 + (round - 1) * roundGap;
    } else {
      // For right side, go from right to left
      x = 100 + (4 - round) * roundGap;
    }

    return { x, y };
  };

  const renderConnector = (game: Game) => {
    if (game.round >= 4) return null;

    const from = getGamePosition(game);
    const nextRound = game.round + 1;
    const nextPosition = Math.floor(game.position / 2);
    const nextGame = games.find(g => g.round === nextRound && g.position === nextPosition);

    if (!nextGame) return null;

    const to = getGamePosition(nextGame);
    const isTopBracket = game.position % 2 === 0;
    
    if (position === 'left') {
      // Lines go left to right
      const startX = from.x + gameWidth;
      const startY = from.y + gameHeight / 2;
      const endX = to.x;
      const endY = to.y + (isTopBracket ? gameHeight / 3 : (2 * gameHeight) / 3);
      const midX = (startX + endX) / 2;

      return (
        <path
          key={`connector-${game.id}`}
          d={`M ${startX} ${startY} 
              L ${midX} ${startY}
              L ${midX} ${endY}
              L ${endX} ${endY}`}
          stroke="#cbd5e1"
          strokeWidth="2"
          fill="none"
        />
      );
    } else {
      // Lines go right to left
      const startX = from.x;
      const startY = from.y + gameHeight / 2;
      const endX = to.x + gameWidth;
      const endY = to.y + (isTopBracket ? gameHeight / 3 : (2 * gameHeight) / 3);
      const midX = (startX + endX) / 2;

      return (
        <path
          key={`connector-${game.id}`}
          d={`M ${startX} ${startY} 
              L ${midX} ${startY}
              L ${midX} ${endY}
              L ${endX} ${endY}`}
          stroke="#cbd5e1"
          strokeWidth="2"
          fill="none"
        />
      );
    }
  };

  const getRoundLabel = (round: number) => {
    switch(round) {
      case 1: return 'Round of 64';
      case 2: return 'Round of 32';
      case 3: return 'Sweet 16';
      case 4: return 'Elite 8';
      default: return '';
    }
  };

  // Don't render until games are initialized
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
      {/* Region Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
          {selectedRegion}
        </h2>
        <div className="h-1 w-20 bg-blue-500 mt-2 rounded"></div>
      </div>

      {/* Bracket Canvas */}
      <div className="relative" style={{ width: '1400px', height: '1400px' }}>
        {/* SVG for connectors */}
        <svg 
          className="absolute inset-0 pointer-events-none" 
          style={{ width: '100%', height: '100%' }}
        >
          {games.map(game => renderConnector(game))}
        </svg>

        {/* Round Labels */}
        {[1, 2, 3, 4].map(round => {
          const sampleGame = games.find(g => g.round === round);
          if (!sampleGame) return null;
          
          const pos = getGamePosition(sampleGame);
          return (
            <div
              key={`label-${round}`}
              className="absolute text-xs font-semibold text-gray-500 uppercase tracking-wider"
              style={{ 
                left: `${pos.x + gameWidth / 2}px`, 
                top: '50px',
                transform: 'translateX(-50%)'
              }}
            >
              {getRoundLabel(round)}
            </div>
          );
        })}

        {/* Games */}
        {games.map(game => {
          const pos = getGamePosition(game);
          
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
              <div className="bg-white rounded-lg border-2 border-gray-300 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Team 1 */}
                <TeamCard1 game={game} />
                {/* Team 2 */}
                <TeamCard2 game={game} />
              </div>
            </div>
          );
        })}

        <div 
          className="absolute"
          style={{
            left: `100px`,
            top: `900px`,
            width: `${gameWidth}px`, 
          }}
        >
          <CinderellaSelector />
        </div>

      {currentRegionWinner && (
        <>
          {/* Connector line to champion */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            <path
              d={`M ${100 + (4 - 1) * roundGap + gameWidth} ${100 + gameHeight / 2} 
                  L ${1200} ${100 + 40}`}
              stroke="#fbbf24"
              strokeWidth="3"
              fill="none"
            />
          </svg>
          
          <div 
            className="absolute"
            style={{
              left: `1200px`,
              top: `100px`,
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