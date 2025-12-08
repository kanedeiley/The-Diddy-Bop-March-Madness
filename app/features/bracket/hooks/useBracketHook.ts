


import { useState } from "react"
import { cinderella, team } from "../types"
import { CURRENT_TOURNAMENT_CONFIG } from "@/app/config";

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

  // Final Four state
  const [finalFourGames, setFinalFourGames] = useState<Game[]>([])
  const [nationalChampion, setNationalChampion] = useState<team | null>(null)


const southTeams: team[] = [
  { id: 's1', name: 'Duke', seed: 1, region: 'south' },
  { id: 's2', name: 'UCLA', seed: 2, region: 'south' },
  { id: 's3', name: 'Gonzaga', seed: 3, region: 'south' },
  { id: 's4', name: 'Kansas', seed: 4, region: 'south' },
  { id: 's5', name: 'Wisconsin', seed: 5, region: 'south' },
  { id: 's6', name: 'TCU', seed: 6, region: 'south' },
  { id: 's7', name: 'Northwestern', seed: 7, region: 'south' },
  { id: 's8', name: 'Michigan St', seed: 8, region: 'south' },
  { id: 's9', name: 'USC', seed: 9, region: 'south' },
  { id: 's10', name: 'Boise St', seed: 10, region: 'south' },
  { id: 's11', name: 'Nevada', seed: 11, region: 'south' },
  { id: 's12', name: 'Oregon', seed: 12, region: 'south' },
  { id: 's13', name: 'Furman', seed: 13, region: 'south' },
  { id: 's14', name: 'Grand Canyon', seed: 14, region: 'south' },
  { id: 's15', name: 'UNC Asheville', seed: 15, region: 'south' },
  { id: 's16', name: 'Hampton', seed: 16, region: 'south' },
]

const eastTeams: team[] = [
  { id: 'e1', name: 'UConn', seed: 1, region: 'east' },
  { id: 'e2', name: 'Marquette', seed: 2, region: 'east' },
  { id: 'e3', name: 'Illinois', seed: 3, region: 'east' },
  { id: 'e4', name: 'Auburn', seed: 4, region: 'east' },
  { id: 'e5', name: 'Baylor', seed: 5, region: 'east' },
  { id: 'e6', name: 'Texas', seed: 6, region: 'east' },
  { id: 'e7', name: 'Florida', seed: 7, region: 'east' },
  { id: 'e8', name: 'Providence', seed: 8, region: 'east' },
  { id: 'e9', name: 'Memphis', seed: 9, region: 'east' },
  { id: 'e10', name: 'Seton Hall', seed: 10, region: 'east' },
  { id: 'e11', name: 'Virginia', seed: 11, region: 'east' },
  { id: 'e12', name: 'Charleston', seed: 12, region: 'east' },
  { id: 'e13', name: 'Kent St', seed: 13, region: 'east' },
  { id: 'e14', name: 'Colgate', seed: 14, region: 'east' },
  { id: 'e15', name: 'Vermont', seed: 15, region: 'east' },
  { id: 'e16', name: 'Howard', seed: 16, region: 'east' },
]

const westTeams: team[] = [
  { id: 'w1', name: 'Arizona', seed: 1, region: 'west' },
  { id: 'w2', name: 'Houston', seed: 2, region: 'west' },
  { id: 'w3', name: 'Creighton', seed: 3, region: 'west' },
  { id: 'w4', name: 'Alabama', seed: 4, region: 'west' },
  { id: 'w5', name: 'San Diego St', seed: 5, region: 'west' },
  { id: 'w6', name: 'Iowa St', seed: 6, region: 'west' },
  { id: 'w7', name: 'Dayton', seed: 7, region: 'west' },
  { id: 'w8', name: 'Mississippi St', seed: 8, region: 'west' },
  { id: 'w9', name: 'Texas Tech', seed: 9, region: 'west' },
  { id: 'w10', name: "Saint Mary's", seed: 10, region: 'west' },
  { id: 'w11', name: 'Michigan', seed: 11, region: 'west' },
  { id: 'w12', name: 'Liberty', seed: 12, region: 'west' },
  { id: 'w13', name: 'Yale', seed: 13, region: 'west' },
  { id: 'w14', name: 'Montana St', seed: 14, region: 'west' },
  { id: 'w15', name: 'Long Beach St', seed: 15, region: 'west' },
  { id: 'w16', name: 'Weber St', seed: 16, region: 'west' },
]

const midwestTeams: team[] = [
  { id: 'm1', name: 'Purdue', seed: 1, region: 'midwest' },
  { id: 'm2', name: 'Tennessee', seed: 2, region: 'midwest' },
  { id: 'm3', name: 'North Carolina', seed: 3, region: 'midwest' },
  { id: 'm4', name: 'Arkansas', seed: 4, region: 'midwest' },
  { id: 'm5', name: 'Miami', seed: 5, region: 'midwest' },
  { id: 'm6', name: 'Clemson', seed: 6, region: 'midwest' },
  { id: 'm7', name: 'Indiana', seed: 7, region: 'midwest' },
  { id: 'm8', name: 'Oklahoma', seed: 8, region: 'midwest' },
  { id: 'm9', name: 'Colorado', seed: 9, region: 'midwest' },
  { id: 'm10', name: 'Pittsburgh', seed: 10, region: 'midwest' },
  { id: 'm11', name: 'Drake', seed: 11, region: 'midwest' },
  { id: 'm12', name: 'VCU', seed: 12, region: 'midwest' },
  { id: 'm13', name: 'Iona', seed: 13, region: 'midwest' },
  { id: 'm14', name: 'Samford', seed: 14, region: 'midwest' },
  { id: 'm15', name: 'Cleveland St', seed: 15, region: 'midwest' },
  { id: 'm16', name: 'Wagner', seed: 16, region: 'midwest' },
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
    setFinalFourGames([])
    setNationalChampion(null)
  }

  // Helper to set a single region's cinderella
  const setCinderellaForRegion = (region: string, item: cinderella | null) => {
    setSelectedCinderellas(prev => ({ ...prev, [region]: item }))
  }

  // Get region winner helper
  const getRegionWinner = (regionKey: string): team | null => {
    return regionWinners[regionKey] || null
  }

  // Check if all regions are complete
  const areAllRegionsComplete = (): boolean => {
    const config = CURRENT_TOURNAMENT_CONFIG
    return config.regions.every(regionName => {
      const regionKey = regionName.toLowerCase()
      return regionWinners[regionKey] !== null
    })
  }

  // Initialize Final Four games
  const ensureFinalFourInitialized = () => {
    const config = CURRENT_TOURNAMENT_CONFIG
    const regionKeys = config.regions.map(r => r.toLowerCase())
    
    // Get region winners
    const winner1 = regionWinners[regionKeys[0]]
    const winner2 = regionWinners[regionKeys[1]]
    const winner3 = regionWinners[regionKeys[2]]
    const winner4 = regionWinners[regionKeys[3]]

    // Check if we need to update teams in existing games
    if (finalFourGames.length > 0) {
      const semifinal1 = finalFourGames.find(g => g.id === 'semifinal-1')
      const semifinal2 = finalFourGames.find(g => g.id === 'semifinal-2')
      
      // Check if any region winners have changed
      const needsUpdate = 
        semifinal1?.team1?.id !== winner1?.id ||
        semifinal1?.team2?.id !== winner2?.id ||
        semifinal2?.team1?.id !== winner3?.id ||
        semifinal2?.team2?.id !== winner4?.id
      
      if (needsUpdate) {
        setFinalFourGames(prevGames => prevGames.map(game => {
          if (game.id === 'semifinal-1') {
            return {
              ...game,
              team1: winner1 ? { ...winner1, region: config.regions[0] } : undefined,
              team2: winner2 ? { ...winner2, region: config.regions[1] } : undefined,
              // Clear winner if teams changed
              winner: (game.team1?.id !== winner1?.id || game.team2?.id !== winner2?.id) ? undefined : game.winner,
            }
          }
          if (game.id === 'semifinal-2') {
            return {
              ...game,
              team1: winner3 ? { ...winner3, region: config.regions[2] } : undefined,
              team2: winner4 ? { ...winner4, region: config.regions[3] } : undefined,
              // Clear winner if teams changed
              winner: (game.team1?.id !== winner3?.id || game.team2?.id !== winner4?.id) ? undefined : game.winner,
            }
          }
          // Clear championship if semifinals changed
          if (game.id === 'championship' && needsUpdate) {
            return {
              ...game,
              team1: undefined,
              team2: undefined,
              winner: undefined,
            }
          }
          return game
        }))
        
        // Clear national champion if semifinals changed
        setNationalChampion(null)
      }
      return
    }

    // Create semifinal matchups (first time initialization)
    const semifinal1: Game = {
      id: 'semifinal-1',
      team1: winner1 ? { ...winner1, region: config.regions[0] } : undefined,
      team2: winner2 ? { ...winner2, region: config.regions[1] } : undefined,
      winner: undefined,
      round: 1,
      position: 0,
    }

    const semifinal2: Game = {
      id: 'semifinal-2',
      team1: winner3 ? { ...winner3, region: config.regions[2] } : undefined,
      team2: winner4 ? { ...winner4, region: config.regions[3] } : undefined,
      winner: undefined,
      round: 1,
      position: 1,
    }

    const championship: Game = {
      id: 'championship',
      team1: undefined,
      team2: undefined,
      winner: undefined,
      round: 2,
      position: 0,
    }

    setFinalFourGames([semifinal1, semifinal2, championship])
  }

  // Select winner for Final Four game
  const selectFinalFourWinner = (gameId: string, winner: team) => {
    setFinalFourGames(prevGames => {
      const updatedGames = prevGames.map(game => {
        if (game.id === gameId) {
          return { ...game, winner }
        }
        return game
      })

      // If this was a semifinal, advance winner to championship
      const game = updatedGames.find(g => g.id === gameId)
      if (game && game.round === 1) {
        const championship = updatedGames.find(g => g.round === 2)
        if (championship) {
          const isFirstSemifinal = game.position === 0
          if (isFirstSemifinal) {
            championship.team1 = winner
          } else {
            championship.team2 = winner
          }
        }
      }

      // If this was the championship, set national champion
      if (game && game.round === 2) {
        setNationalChampion(winner)
      }

      return updatedGames
    })
  }

  const selectedCinderella = selectedCinderellas[selectedRegion] ?? null
  const regionCinderellas = regionData[selectedRegion].filter(team => team.seed >= 11)
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

    // Final Four
    finalFourGames,
    nationalChampion,
    ensureFinalFourInitialized,
    selectFinalFourWinner,
    areAllRegionsComplete,
    getRegionWinner,
  }
}

export default useBracketHook