'use client';

import { useEffect } from 'react';
import { useBracketContext } from '../../context/useBracketContext';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';
import { team } from '../../types';

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

export default function FinalBracket({ position }: FinalFourBracketProps) {
  const {
    selectedCinderella,
    finalFourGames,
    selectFinalFourWinner,
    ensureFinalFourInitialized,
    nationalChampion,
  } = useBracketContext();

  // Initialize Final Four games on mount
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
    const y = 100 + game.position * (gameHeight + verticalGap) * spacingMultiplier;

    if (position === 'left') {
      // Round 1 (semifinals) on left, Round 2 (championship) in middle
      x = 100 + (round - 1) * roundGap;
    } else {
      // Round 1 (semifinals) on right, Round 2 (championship) in middle
      x = 100 + (2 - round) * roundGap;
    }

    return { x, y };
  };

  const renderConnector = (game: Game) => {
    if (game.round >= 2) return null;

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
      case 1: return 'National Semifinal';
      case 2: return 'National Championship';
      default: return '';
    }
  };

  // Don't render until games are initialized
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

  return (
    <div className="relative">
      {/* Final Four Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
          Final Four
        </h2>
        {config.finalFourLocation && (
          <p className="text-sm text-gray-600 mt-1">{config.finalFourLocation}</p>
        )}
        <div className="h-1 w-20 bg-blue-500 mt-2 rounded"></div>
      </div>

      {/* Bracket Canvas */}
      <div className="relative" style={{ width: '800px', height: '600px' }}>
        {/* SVG for connectors */}
        <svg 
          className="absolute inset-0 pointer-events-none" 
          style={{ width: '100%', height: '100%' }}
        >
          {games.map(game => renderConnector(game))}
        </svg>

        {/* Round Labels */}
        {[1, 2].map(round => {
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
                <div
                  onClick={() => game.team1 && selectWinner(game, game.team1)}
                  className={`
                    px-3 py-2 border-b border-gray-200 cursor-pointer
                    transition-all flex items-center
                    ${!game.team1 ? 'cursor-not-allowed' : ''}
                    ${
                      (selectedCinderella && game.team1 && selectedCinderella.id === game.team1.id && game.winner?.id === game.team1.id)
                        ? 'bg-pink-100 font-semibold border-l-4 border-l-pink-500'
                        : (game.winner?.id === game.team1?.id
                            ? 'bg-green-100 font-bold border-l-4 border-l-green-500'
                            : 'hover:bg-gray-50')
                    }
                  `}
                >
                  {game.team1 ? (
                    <>
                      <span className="text-xs font-semibold text-gray-500 mr-2 w-6">
                        {game.team1.seed}
                      </span>
                      <span className="text-sm flex-1 truncate">
                        {game.team1.name}
                      </span>
                      {game.team1.region && (
                        <span className="text-xs text-gray-400 ml-2">
                          {game.team1.region}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-400 italic">TBD</span>
                  )}
                </div>
                
                {/* Team 2 */}
                <div
                  onClick={() => game.team2 && selectWinner(game, game.team2)}
                  className={`
                    px-3 py-2 cursor-pointer transition-all flex items-center
                    ${!game.team2 ? 'cursor-not-allowed' : ''}
                    ${
                      (selectedCinderella && game.team2 && selectedCinderella.id === game.team2.id && game.winner?.id === game.team2.id)
                        ? 'bg-pink-100 font-semibold border-l-4 border-l-pink-500'
                        : (game.winner?.id === game.team2?.id
                            ? 'bg-green-100 font-bold border-l-4 border-l-green-500'
                            : 'hover:bg-gray-50')
                    }
                  `}
                >
                  {game.team2 ? (
                    <>
                      <span className="text-xs font-semibold text-gray-500 mr-2 w-6">
                        {game.team2.seed}
                      </span>
                      <span className="text-sm flex-1 truncate">
                        {game.team2.name}
                      </span>
                      {game.team2.region && (
                        <span className="text-xs text-gray-400 ml-2">
                          {game.team2.region}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-400 italic">TBD</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* National Champion Indicator */}
        {nationalChampion && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-full shadow-lg">
              <div className="text-xs font-semibold">🏆 NATIONAL CHAMPION 🏆</div>
              <div className="text-lg font-bold">
                {nationalChampion.name}
              </div>
              {nationalChampion.region && (
                <div className="text-xs">
                  {nationalChampion.region} Region
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}