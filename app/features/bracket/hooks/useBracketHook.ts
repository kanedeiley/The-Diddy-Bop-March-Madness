import { useState } from "react"
import { cinderella, team } from "../types"

type Game = {
  id: string;
  team1?: team;
  team2?: team;
  winner?: team;
  round: number;
  position: number;
};

const useBracketHook = () => {
  const [selectedRegion, setSelectedRegion] = useState<keyof typeof regionData>("south")
  const [selectedCinderellas, setSelectedCinderellas] = useState<Record<string, cinderella | null>>({
    south: null,
    east: null,
    midwest: null,
    west: null,
    final: null,
  })

  // Game state for each region
  const [regionalGames, setRegionalGames] = useState<Record<string, Game[]>>({
    south: [],
    east: [],
    midwest: [],
    west: [],
  })

  // Region winners
  const [regionWinners, setRegionWinners] = useState<Record<string, team | null>>({
    south: null,
    east: null,
    midwest: null,
    west: null,
  })

  const southTeams: team[] = [
    { id: 's1', name: 'Duke', seed: 1 },
    { id: 's2', name: 'UCLA', seed: 2 },
    { id: 's3', name: 'Gonzaga', seed: 3 },
    { id: 's4', name: 'Kansas', seed: 4 },
    { id: 's5', name: 'Wisconsin', seed: 5 },
    { id: 's6', name: 'TCU', seed: 6 },
    { id: 's7', name: 'Northwestern', seed: 7 },
    { id: 's8', name: 'Michigan St', seed: 8 },
    { id: 's9', name: 'USC', seed: 9 },
    { id: 's10', name: 'Boise St', seed: 10 },
    { id: 's11', name: 'Nevada', seed: 11 },
    { id: 's12', name: 'Oregon', seed: 12 },
    { id: 's13', name: 'Furman', seed: 13 },
    { id: 's14', name: 'Grand Canyon', seed: 14 },
    { id: 's15', name: 'UNC Asheville', seed: 15 },
    { id: 's16', name: 'Hampton', seed: 16 },
  ]

  const eastTeams: team[] = [
    { id: 'e1', name: 'UConn', seed: 1 },
    { id: 'e2', name: 'Marquette', seed: 2 },
    { id: 'e3', name: 'Illinois', seed: 3 },
    { id: 'e4', name: 'Auburn', seed: 4 },
    { id: 'e5', name: 'Baylor', seed: 5 },
    { id: 'e6', name: 'Texas', seed: 6 },
    { id: 'e7', name: 'Florida', seed: 7 },
    { id: 'e8', name: 'Providence', seed: 8 },
    { id: 'e9', name: 'Memphis', seed: 9 },
    { id: 'e10', name: 'Seton Hall', seed: 10 },
    { id: 'e11', name: 'Virginia', seed: 11 },
    { id: 'e12', name: 'Charleston', seed: 12 },
    { id: 'e13', name: 'Kent St', seed: 13 },
    { id: 'e14', name: 'Colgate', seed: 14 },
    { id: 'e15', name: 'Vermont', seed: 15 },
    { id: 'e16', name: 'Howard', seed: 16 },
  ]

  const westTeams: team[] = [
    { id: 'w1', name: 'Arizona', seed: 1 },
    { id: 'w2', name: 'Houston', seed: 2 },
    { id: 'w3', name: 'Creighton', seed: 3 },
    { id: 'w4', name: 'Alabama', seed: 4 },
    { id: 'w5', name: 'San Diego St', seed: 5 },
    { id: 'w6', name: 'Iowa St', seed: 6 },
    { id: 'w7', name: 'Dayton', seed: 7 },
    { id: 'w8', name: 'Mississippi St', seed: 8 },
    { id: 'w9', name: 'Texas Tech', seed: 9 },
    { id: 'w10', name: "Saint Mary's", seed: 10 },
    { id: 'w11', name: 'Michigan', seed: 11 },
    { id: 'w12', name: 'Liberty', seed: 12 },
    { id: 'w13', name: 'Yale', seed: 13 },
    { id: 'w14', name: 'Montana St', seed: 14 },
    { id: 'w15', name: 'Long Beach St', seed: 15 },
    { id: 'w16', name: 'Weber St', seed: 16 },
  ]

  const midwestTeams: team[] = [
    { id: 'm1', name: 'Purdue', seed: 1 },
    { id: 'm2', name: 'Tennessee', seed: 2 },
    { id: 'm3', name: 'North Carolina', seed: 3 },
    { id: 'm4', name: 'Arkansas', seed: 4 },
    { id: 'm5', name: 'Miami', seed: 5 },
    { id: 'm6', name: 'Clemson', seed: 6 },
    { id: 'm7', name: 'Indiana', seed: 7 },
    { id: 'm8', name: 'Oklahoma', seed: 8 },
    { id: 'm9', name: 'Colorado', seed: 9 },
    { id: 'm10', name: 'Pittsburgh', seed: 10 },
    { id: 'm11', name: 'Drake', seed: 11 },
    { id: 'm12', name: 'VCU', seed: 12 },
    { id: 'm13', name: 'Iona', seed: 13 },
    { id: 'm14', name: 'Samford', seed: 14 },
    { id: 'm15', name: 'Cleveland St', seed: 15 },
    { id: 'm16', name: 'Wagner', seed: 16 },
  ]

  const regionData = {
    south: southTeams,
    east: eastTeams,
    midwest: midwestTeams,
    west: westTeams,
    final: southTeams
  }

  // Initialize games for a specific region
  const initializeGamesForRegion = (region: keyof typeof regionData): Game[] => {
    const teams = regionData[region]
    const games: Game[] = []
    
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
    ]

    matchups.forEach((matchup, idx) => {
      games.push({
        id: `${region}-r1-${idx}`,
        team1: teams[matchup[0]],
        team2: teams[matchup[1]],
        round: 1,
        position: idx,
      })
    })

    // Round 2 (Round of 32) - 4 games
    for (let i = 0; i < 4; i++) {
      games.push({
        id: `${region}-r2-${i}`,
        round: 2,
        position: i,
      })
    }

    // Round 3 (Sweet 16) - 2 games
    for (let i = 0; i < 2; i++) {
      games.push({
        id: `${region}-r3-${i}`,
        round: 3,
        position: i,
      })
    }

    // Round 4 (Elite 8) - 1 game
    games.push({
      id: `${region}-r4-0`,
      round: 4,
      position: 0,
    })

    return games
  }

  // Initialize a region's games if not already done
  const ensureRegionInitialized = (region: string) => {
    if (!regionalGames[region] || regionalGames[region].length === 0) {
      setRegionalGames(prev => ({
        ...prev,
        [region]: initializeGamesForRegion(region as keyof typeof regionData)
      }))
    }
  }

// Helper function to clear all downstream games when a winner changes
const clearDownstreamGames = (
  games: Game[], 
  changedGame: Game, 
  newWinner: team,
  region: string,
  setRegionWinners: React.Dispatch<React.SetStateAction<Record<string, team | null>>>
): Game[] => {
  let updatedGames = [...games]
  
  // Find what team was previously in the next round from this game
  const nextRound = changedGame.round + 1
  const nextPosition = Math.floor(changedGame.position / 2)
  const isTopSlot = changedGame.position % 2 === 0
  
  const clearFromGame = (gameToCheck: Game, slotToClear: 'team1' | 'team2') => {
    if (!gameToCheck) return
    
    const oldTeamInSlot = gameToCheck[slotToClear]
    
    // If there was a team there and it's different from the new winner, clear it
    if (oldTeamInSlot && oldTeamInSlot.id !== newWinner.id) {
      // Clear this game's affected slot and winner
      updatedGames = updatedGames.map(g => {
        if (g.id === gameToCheck.id) {
          return { 
            ...g, 
            [slotToClear]: undefined,
            winner: undefined 
          }
        }
        return g
      })
      
      // If this was the Elite 8 game (round 4), clear the region winner
      if (gameToCheck.round === 4) {
        setRegionWinners(prev => ({
          ...prev,
          [region]: null
        }))
      }
      // Otherwise, continue clearing downstream
      else if (gameToCheck.round < 4 && gameToCheck.winner) {
        const teamToClear = gameToCheck.winner
        
        // Find and clear from next round
        const nextNextRound = gameToCheck.round + 1
        const nextNextPosition = Math.floor(gameToCheck.position / 2)
        const nextNextGameId = `${region}-r${nextNextRound}-${nextNextPosition}`
        const nextNextGame = updatedGames.find(g => g.id === nextNextGameId)
        
        if (nextNextGame) {
          const nextSlotToClear = gameToCheck.position % 2 === 0 ? 'team1' : 'team2'
          
          // Only continue clearing if the team in the next slot matches what we're clearing
          if (nextNextGame[nextSlotToClear]?.id === teamToClear.id) {
            clearFromGame(nextNextGame, nextSlotToClear)
          }
        }
      }
    }
  }
  
  // Start the clearing process from the next round
  if (changedGame.round < 4) {
    const nextGameId = `${region}-r${nextRound}-${nextPosition}`
    const nextGame = updatedGames.find(g => g.id === nextGameId)
    if (nextGame) {
      const slotToClear = isTopSlot ? 'team1' : 'team2'
      clearFromGame(nextGame, slotToClear)
    }
  }
  
  return updatedGames
}

// Select winner for a game in a specific region
const selectWinner = (region: string, gameId: string, winner: team) => {
  setRegionalGames(prev => {
    const games = prev[region] || []
    const game = games.find(g => g.id === gameId)
    if (!game) return prev
    // Check if winner changed (not just being set for first time)
    const oldWinner = game.winner
    const winnerChanged = oldWinner && oldWinner.id !== winner.id

    // Update current game with winner
    let updatedGames = games.map(g => 
      g.id === gameId ? { ...g, winner } : g
    )

    // Clear downstream games if the winner changed
    if (winnerChanged) {
      updatedGames = clearDownstreamGames(updatedGames, game, winner, region, setRegionWinners)
    }

    // Advance winner to next round
    if (game.round < 4) {
      const nextRound = game.round + 1
      const nextPosition = Math.floor(game.position / 2)
      const nextGameId = `${region}-r${nextRound}-${nextPosition}`
      
      const finalGames = updatedGames.map(g => {
        if (g.id === nextGameId) {
          const isTopSlot = game.position % 2 === 0
          return {
            ...g,
            [isTopSlot ? 'team1' : 'team2']: winner,
          }
        }
        return g
      })
      
      return {
        ...prev,
        [region]: finalGames
      }
    } else {
      // Elite 8 winner - this is the region champion
      setRegionWinners(prevWinners => ({
        ...prevWinners,
        [region]: winner
      }))
      
      return {
        ...prev,
        [region]: updatedGames
      }
    }
  })
}

  // Reset a specific region's bracket
  const resetRegion = (region: string) => {
    setRegionalGames(prev => ({
      ...prev,
      [region]: initializeGamesForRegion(region as keyof typeof regionData)
    }))
    setRegionWinners(prev => ({
      ...prev,
      [region]: null
    }))
  }

  // Reset all brackets
  const resetAllBrackets = () => {
    setRegionalGames({
      south: initializeGamesForRegion('south'),
      east: initializeGamesForRegion('east'),
      midwest: initializeGamesForRegion('midwest'),
      west: initializeGamesForRegion('west'),
    })
    setRegionWinners({
      south: null,
      east: null,
      midwest: null,
      west: null,
    })
  }

  // Helper to set a single region's cinderella
  const setCinderellaForRegion = (region: string, item: cinderella | null) => {
    setSelectedCinderellas(prev => ({ ...prev, [region]: item }))
  }

  const selectedCinderella = selectedCinderellas[selectedRegion] ?? null
  const regionCinderellas = regionData[selectedRegion].filter(team => team.seed > 11)
  const currentRegionGames = regionalGames[selectedRegion] || []
  const currentRegionWinner = regionWinners[selectedRegion]

  return {
    // Region selection
    selectedRegion,
    setSelectedRegion,
    regionData,
    
    // Cinderella management
    selectedCinderellas,
    setCinderellaForRegion,
    selectedCinderella,
    regionCinderellas,
    
    // Game state
    regionalGames,
    currentRegionGames,
    ensureRegionInitialized,
    
    // Winner management
    selectWinner,
    regionWinners,
    currentRegionWinner,
    
    // Reset functions
    resetRegion,
    resetAllBrackets,
  }
}

export default useBracketHook