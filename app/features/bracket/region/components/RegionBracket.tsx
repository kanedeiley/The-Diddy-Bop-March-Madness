// components/RegionBracket.tsx
'use client';

import { useState } from 'react';
import { useBracketContext } from '../../context/useBracketContext';

type Team = {
  id: string;
  name: string;
  seed: number;
};

type Game = {
  id: string;
  team1?: Team;
  team2?: Team;
  winner?: Team;
  round: number;
  position: number;
};

type RegionBracketProps = {
  position: 'left' | 'right'; // Which side of screen
  onRegionWinner?: (winner: Team) => void;
};

export default function RegionBracket({  
  position,
  onRegionWinner 
}: RegionBracketProps) {

const {regionData, selectedRegion, selectedCinderella} = useBracketContext()

const teams = regionData[selectedRegion];

  // Initialize games
  const initializeGames = (): Game[] => {
    const games: Game[] = [];
    
    // Round 1 (Round of 64) - 8 games
    const matchups = [
      [0, 15],  // 1 vs 16
      [7, 8],   // 8 vs 9
      [4, 11],  // 5 vs 12
      [3, 12],  // 4 vs 13
      [5, 10],  // 6 vs 11
      [2, 13],  // 3 vs 14
      [6, 9],   // 7 vs 10
      [1, 14],  // 2 vs 15
    ];

    matchups.forEach((matchup, idx) => {
      games.push({
        id: `r1-${idx}`,
        team1: teams[matchup[0]],
        team2: teams[matchup[1]],
        round: 1,
        position: idx,
      });
    });

    // Round 2 (Round of 32) - 4 games
    for (let i = 0; i < 4; i++) {
      games.push({
        id: `r2-${i}`,
        round: 2,
        position: i,
      });
    }

    // Round 3 (Sweet 16) - 2 games
    for (let i = 0; i < 2; i++) {
      games.push({
        id: `r3-${i}`,
        round: 3,
        position: i,
      });
    }

    // Round 4 (Elite 8) - 1 game
    games.push({
      id: `r4-0`,
      round: 4,
      position: 0,
    });

    return games;
  };

  const [games, setGames] = useState<Game[]>(initializeGames());

  const gameHeight = 80;
  const gameWidth = 200;
  const roundGap = 280;
  const verticalGap = 20;

  const selectWinner = (game: Game, team: Team) => {
    // Update current game with winner
    const updatedGames = games.map(g => 
      g.id === game.id ? { ...g, winner: team } : g
    );

    // Advance winner to next round
    if (game.round < 4) {
      const nextRound = game.round + 1;
      const nextPosition = Math.floor(game.position / 2);
      const nextGameId = `r${nextRound}-${nextPosition}`;
      
      const finalGames = updatedGames.map(g => {
        if (g.id === nextGameId) {
          const isTopSlot = game.position % 2 === 0;
          return {
            ...g,
            [isTopSlot ? 'team1' : 'team2']: team,
          };
        }
        return g;
      });
      
      setGames(finalGames);
    } else {
      // Elite 8 winner - this is the region champion
      setGames(updatedGames);
      onRegionWinner?.(team);
    }
  };

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
                      </>
                    ) : (
                      <span className="text-sm text-gray-400 italic">TBD</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Region Champion Indicator */}
          {games.find(g => g.round === 4 && g.winner) && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-full shadow-lg">
                <div className="text-xs font-semibold">REGION CHAMPION</div>
                <div className="text-lg font-bold">
                  {games.find(g => g.round === 4)?.winner?.name}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}