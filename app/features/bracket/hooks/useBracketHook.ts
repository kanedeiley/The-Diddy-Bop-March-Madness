import { useState } from "react"
import { useLocalStorage, typeGuards } from "@/app/hooks/useLocalStorage"
import { cinderella, team } from "../types"
import { CURRENT_TOURNAMENT_CONFIG } from "@/app/config"

type Game = {
  id: string
  team1?: team
  team2?: team
  winner?: team
  round: number
  position: number
}

type RegionKey = 'south' | 'east' | 'midwest' | 'west' | 'final'

// Shape coming from loadBracket server action
export type SavedBracket = {
  bracket: { id: string; is_locked: boolean }
  picks: { game_slot: string; team_espn_id: string; round: number; region: string }[]
  cinderellas: { region: string; team_espn_id: string }[]
} | null

// ─── Hydration helpers ───────────────────────────────────────

function buildTeamLookup(teamsByRegion: Record<string, team[]>): Map<string, team> {
  const lookup = new Map<string, team>()
  for (const teams of Object.values(teamsByRegion)) {
    for (const t of teams) {
      if (t.espnId) lookup.set(t.espnId, t)
    }
  }
  return lookup
}

function hydrateRegionGames(
  games: Game[],
  picks: { game_slot: string; team_espn_id: string; round: number }[],
  teamLookup: Map<string, team>
): { games: Game[]; regionWinner: team | null } {
  let hydrated = [...games]
  let regionWinner: team | null = null

  // Sort picks by round so we cascade correctly (round 1 → 2 → 3 → 4)
  const sorted = [...picks].sort((a, b) => a.round - b.round)

  for (const pick of sorted) {
    const winner = teamLookup.get(pick.team_espn_id)
    if (!winner) continue

    const gameIdx = hydrated.findIndex(g => g.id === pick.game_slot)
    if (gameIdx === -1) continue

    const game = hydrated[gameIdx]

    // Set the winner on this game
    hydrated[gameIdx] = { ...game, winner }

    // Advance to next round
    if (game.round < 4) {
      const nextRound = game.round + 1
      const nextPosition = Math.floor(game.position / 2)
      const region = pick.game_slot.split('-')[0] // "south-r1-0" → "south"
      const nextGameId = `${region}-r${nextRound}-${nextPosition}`
      const isTopSlot = game.position % 2 === 0

      const nextIdx = hydrated.findIndex(g => g.id === nextGameId)
      if (nextIdx !== -1) {
        hydrated[nextIdx] = {
          ...hydrated[nextIdx],
          [isTopSlot ? 'team1' : 'team2']: winner,
        }
      }
    } else {
      // Round 4 winner = region champion
      regionWinner = winner
    }
  }

  return { games: hydrated, regionWinner }
}

function hydrateFinalFour(
  regionWinners: Record<string, team | null>,
  picks: { game_slot: string; team_espn_id: string; round: number }[],
  teamLookup: Map<string, team>
): { games: Game[]; champion: team | null } {
  const config = CURRENT_TOURNAMENT_CONFIG
  const pairings = config.finalFourPairings // [['south','west'], ['east','midwest']]

  const regionDisplay = (key: string) =>
    config.regions.find(r => r.toLowerCase() === key) ?? key

  const winner1 = regionWinners[pairings[0][0]]
  const winner2 = regionWinners[pairings[0][1]]
  const winner3 = regionWinners[pairings[1][0]]
  const winner4 = regionWinners[pairings[1][1]]

  const semifinal1: Game = {
    id: 'semifinal-1',
    team1: winner1 ? { ...winner1, region: regionDisplay(pairings[0][0]) } : undefined,
    team2: winner2 ? { ...winner2, region: regionDisplay(pairings[0][1]) } : undefined,
    winner: undefined,
    round: 1,
    position: 0,
  }

  const semifinal2: Game = {
    id: 'semifinal-2',
    team1: winner3 ? { ...winner3, region: regionDisplay(pairings[1][0]) } : undefined,
    team2: winner4 ? { ...winner4, region: regionDisplay(pairings[1][1]) } : undefined,
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

  let games = [semifinal1, semifinal2, championship]
  let champion: team | null = null

  const sorted = [...picks].sort((a, b) => a.round - b.round)

  for (const pick of sorted) {
    const winner = teamLookup.get(pick.team_espn_id)
    if (!winner) continue

    const gameIdx = games.findIndex(g => g.id === pick.game_slot)
    if (gameIdx === -1) continue

    const game = games[gameIdx]
    games[gameIdx] = { ...game, winner }

    if (game.round === 1) {
      const champIdx = games.findIndex(g => g.id === 'championship')
      if (champIdx !== -1) {
        const isFirstSemifinal = game.position === 0
        games[champIdx] = {
          ...games[champIdx],
          [isFirstSemifinal ? 'team1' : 'team2']: winner,
        }
      }
    }

    if (game.round === 2) {
      champion = winner
    }
  }

  return { games, champion }
}

// ─── Main hook ───────────────────────────────────────────────

const useBracketHook = (
  teamsByRegion: Record<string, team[]>,
  savedBracket?: SavedBracket
) => {
  const teamLookup = buildTeamLookup(teamsByRegion)

  // ─── Build initial state from saved data ───
  const buildInitialState = () => {
    const regions: RegionKey[] = ['south', 'east', 'midwest', 'west']

    const regionData: Record<RegionKey, team[]> = {
      south: teamsByRegion["south"] || [],
      east: teamsByRegion["east"] || [],
      midwest: teamsByRegion["midwest"] || [],
      west: teamsByRegion["west"] || [],
      final: teamsByRegion["south"] || [],
    }

    // Initialize empty games for all regions
    const initGames = (region: RegionKey): Game[] => {
      const teams = regionData[region]
      if (!teams.length) return []
      const games: Game[] = []
      const matchups = [
        [0, 15], [7, 8], [4, 11], [3, 12],
        [5, 10], [2, 13], [6, 9], [1, 14],
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
      for (let i = 0; i < 4; i++) games.push({ id: `${region}-r2-${i}`, round: 2, position: i })
      for (let i = 0; i < 2; i++) games.push({ id: `${region}-r3-${i}`, round: 3, position: i })
      games.push({ id: `${region}-r4-0`, round: 4, position: 0 })
      return games
    }

    if (!savedBracket) {
      return {
        regionalGames: { south: [], east: [], midwest: [], west: [] } as Record<string, Game[]>,
        regionWinners: { south: null, east: null, midwest: null, west: null } as Record<string, team | null>,
        finalFourGames: [] as Game[],
        nationalChampion: null as team | null,
        cinderellas: { south: null, east: null, midwest: null, west: null, final: null } as Record<string, cinderella | null>,
      }
    }

    // Hydrate each region
    const hydratedGames: Record<string, Game[]> = {}
    const hydratedWinners: Record<string, team | null> = {}

    for (const region of regions) {
      const baseGames = initGames(region)
      const regionPicks = savedBracket.picks.filter(
        p => p.region === region && p.round <= 4
      )
      const { games, regionWinner } = hydrateRegionGames(baseGames, regionPicks, teamLookup)
      hydratedGames[region] = games
      hydratedWinners[region] = regionWinner
    }

    // Hydrate Final Four
    const finalPicks = savedBracket.picks.filter(p => p.region === 'final')
    const { games: ffGames, champion } = hydrateFinalFour(
      hydratedWinners, finalPicks, teamLookup
    )

    // Hydrate cinderellas
    const cinderellas: Record<string, cinderella | null> = {
      south: null, east: null, midwest: null, west: null, final: null,
    }
    for (const c of savedBracket.cinderellas) {
      const team = teamLookup.get(c.team_espn_id)
      if (team) {
        cinderellas[c.region] = {
          id: team.id,
          name: team.name,
          seed: team.seed,
          espnId: team.espnId,
        }
      }
    }

    return {
      regionalGames: hydratedGames,
      regionWinners: hydratedWinners,
      finalFourGames: ffGames,
      nationalChampion: champion,
      cinderellas,
    }
  }

  const initial = buildInitialState()

  // ─── State (initialized from saved data or empty) ───
  const { value: selectedRegion, setValue: setSelectedRegion } = useLocalStorage<RegionKey>(
    'selectedBracketRegion',
    'south',
    (val): val is RegionKey => {
      const validRegions: RegionKey[] = ['south', 'east', 'midwest', 'west', 'final']
      return typeof val === 'string' && validRegions.includes(val as RegionKey)
    }
  )
  const [selectedCinderellas, setSelectedCinderellas] = useState<Record<string, cinderella | null>>(initial.cinderellas)
  const [regionalGames, setRegionalGames] = useState<Record<string, Game[]>>(initial.regionalGames)
  const [regionWinners, setRegionWinners] = useState<Record<string, team | null>>(initial.regionWinners)
  const [finalFourGames, setFinalFourGames] = useState<Game[]>(initial.finalFourGames)
  const [nationalChampion, setNationalChampion] = useState<team | null>(initial.nationalChampion)

  const regionData: Record<RegionKey, team[]> = {
    south: teamsByRegion["south"] || [],
    east: teamsByRegion["east"] || [],
    midwest: teamsByRegion["midwest"] || [],
    west: teamsByRegion["west"] || [],
    final: teamsByRegion["south"] || [],
  }

  // ─── Everything below here is UNCHANGED from your existing hook ───

  const initializeGamesForRegion = (region: keyof typeof regionData): Game[] => {
    const teams = regionData[region]
    const games: Game[] = []
    const matchups = [
      [0, 15], [7, 8], [4, 11], [3, 12],
      [5, 10], [2, 13], [6, 9], [1, 14],
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
    for (let i = 0; i < 4; i++) games.push({ id: `${region}-r2-${i}`, round: 2, position: i })
    for (let i = 0; i < 2; i++) games.push({ id: `${region}-r3-${i}`, round: 3, position: i })
    games.push({ id: `${region}-r4-0`, round: 4, position: 0 })
    return games
  }

  const ensureRegionInitialized = (region: string) => {
    if (!regionalGames[region] || regionalGames[region].length === 0) {
      setRegionalGames(prev => ({
        ...prev,
        [region]: initializeGamesForRegion(region as keyof typeof regionData)
      }))
    }
  }

  const clearDownstreamGames = (
    games: Game[],
    changedGame: Game,
    newWinner: team,
    region: string,
    setRegionWinnersRef: React.Dispatch<React.SetStateAction<Record<string, team | null>>>
  ): Game[] => {
    let updatedGames = [...games]
    const nextRound = changedGame.round + 1
    const nextPosition = Math.floor(changedGame.position / 2)
    const isTopSlot = changedGame.position % 2 === 0

    const clearFromGame = (gameToCheck: Game, slotToClear: 'team1' | 'team2') => {
      if (!gameToCheck) return
      const oldTeamInSlot = gameToCheck[slotToClear]
      if (oldTeamInSlot && oldTeamInSlot.id !== newWinner.id) {
        updatedGames = updatedGames.map(g => {
          if (g.id === gameToCheck.id) {
            return { ...g, [slotToClear]: undefined, winner: undefined }
          }
          return g
        })
        if (gameToCheck.round === 4) {
          setRegionWinnersRef(prev => ({ ...prev, [region]: null }))
        } else if (gameToCheck.round < 4 && gameToCheck.winner) {
          const teamToClear = gameToCheck.winner
          const nextNextRound = gameToCheck.round + 1
          const nextNextPosition = Math.floor(gameToCheck.position / 2)
          const nextNextGameId = `${region}-r${nextNextRound}-${nextNextPosition}`
          const nextNextGame = updatedGames.find(g => g.id === nextNextGameId)
          if (nextNextGame) {
            const nextSlotToClear = gameToCheck.position % 2 === 0 ? 'team1' : 'team2'
            if (nextNextGame[nextSlotToClear]?.id === teamToClear.id) {
              clearFromGame(nextNextGame, nextSlotToClear)
            }
          }
        }
      }
    }

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

  const selectWinner = (region: string, gameId: string, winner: team) => {
    setRegionalGames(prev => {
      const games = prev[region] || []
      const game = games.find(g => g.id === gameId)
      if (!game) return prev
      const oldWinner = game.winner
      const winnerChanged = oldWinner && oldWinner.id !== winner.id
      let updatedGames = games.map(g => g.id === gameId ? { ...g, winner } : g)
      if (winnerChanged) {
        updatedGames = clearDownstreamGames(updatedGames, game, winner, region, setRegionWinners)
      }
      if (game.round < 4) {
        const nextRound = game.round + 1
        const nextPosition = Math.floor(game.position / 2)
        const nextGameId = `${region}-r${nextRound}-${nextPosition}`
        const finalGames = updatedGames.map(g => {
          if (g.id === nextGameId) {
            const isTopSlot = game.position % 2 === 0
            return { ...g, [isTopSlot ? 'team1' : 'team2']: winner }
          }
          return g
        })
        return { ...prev, [region]: finalGames }
      } else {
        setRegionWinners(prevWinners => ({ ...prevWinners, [region]: winner }))
        return { ...prev, [region]: updatedGames }
      }
    })
  }

  const bracketId = savedBracket?.bracket.id ?? null;


  const resetRegion = (region: string) => {
    setRegionalGames(prev => ({
      ...prev,
      [region]: initializeGamesForRegion(region as keyof typeof regionData)
    }))
    setRegionWinners(prev => ({ ...prev, [region]: null }))
  }

  const resetAllBrackets = () => {
    const regions: RegionKey[] = ['south', 'east', 'midwest', 'west']
    const resetGames: Record<string, Game[]> = {}
    const resetWinners: Record<string, team | null> = {}
    regions.forEach(region => {
      resetGames[region] = initializeGamesForRegion(region as keyof typeof regionData)
      resetWinners[region] = null
    })
    setRegionalGames(resetGames)
    setRegionWinners(resetWinners)
    setFinalFourGames([])
    setNationalChampion(null)
  }

  const setCinderellaForRegion = (region: string, item: cinderella | null) => {
    setSelectedCinderellas(prev => ({ ...prev, [region]: item }))
  }

  const getRegionWinner = (regionKey: string): team | null => {
    return regionWinners[regionKey] || null
  }

  const areAllRegionsComplete = (): boolean => {
    const config = CURRENT_TOURNAMENT_CONFIG
    return config.regions.every(regionName => {
      const regionKey = regionName.toLowerCase()
      return regionWinners[regionKey] !== null
    })
  }

const ensureFinalFourInitialized = () => {
    const config = CURRENT_TOURNAMENT_CONFIG
    const pairings = config.finalFourPairings // [['south','west'], ['east','midwest']]

    const regionDisplay = (key: string) =>
      config.regions.find(r => r.toLowerCase() === key) ?? key

    const winner1 = regionWinners[pairings[0][0]]
    const winner2 = regionWinners[pairings[0][1]]
    const winner3 = regionWinners[pairings[1][0]]
    const winner4 = regionWinners[pairings[1][1]]

    if (finalFourGames.length > 0) {
      const semifinal1 = finalFourGames.find(g => g.id === 'semifinal-1')
      const semifinal2 = finalFourGames.find(g => g.id === 'semifinal-2')
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
              team1: winner1 ? { ...winner1, region: regionDisplay(pairings[0][0]) } : undefined,
              team2: winner2 ? { ...winner2, region: regionDisplay(pairings[0][1]) } : undefined,
              winner: (game.team1?.id !== winner1?.id || game.team2?.id !== winner2?.id) ? undefined : game.winner,
            }
          }
          if (game.id === 'semifinal-2') {
            return {
              ...game,
              team1: winner3 ? { ...winner3, region: regionDisplay(pairings[1][0]) } : undefined,
              team2: winner4 ? { ...winner4, region: regionDisplay(pairings[1][1]) } : undefined,
              winner: (game.team1?.id !== winner3?.id || game.team2?.id !== winner4?.id) ? undefined : game.winner,
            }
          }
          if (game.id === 'championship') {
            return { ...game, team1: undefined, team2: undefined, winner: undefined }
          }
          return game
        }))
        setNationalChampion(null)
      }
      return
    }

    const semifinal1: Game = {
      id: 'semifinal-1',
      team1: winner1 ? { ...winner1, region: regionDisplay(pairings[0][0]) } : undefined,
      team2: winner2 ? { ...winner2, region: regionDisplay(pairings[0][1]) } : undefined,
      winner: undefined,
      round: 1,
      position: 0,
    }
    const semifinal2: Game = {
      id: 'semifinal-2',
      team1: winner3 ? { ...winner3, region: regionDisplay(pairings[1][0]) } : undefined,
      team2: winner4 ? { ...winner4, region: regionDisplay(pairings[1][1]) } : undefined,
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

  const selectFinalFourWinner = (gameId: string, winner: team) => {
    setFinalFourGames(prevGames => {
      const updatedGames = prevGames.map(game => {
        if (game.id === gameId) return { ...game, winner }
        return game
      })
      const game = updatedGames.find(g => g.id === gameId)
      if (game && game.round === 1) {
        const championship = updatedGames.find(g => g.round === 2)
        if (championship) {
          const isFirstSemifinal = game.position === 0
          if (isFirstSemifinal) championship.team1 = winner
          else championship.team2 = winner
        }
      }
      if (game && game.round === 2) setNationalChampion(winner)
      return updatedGames
    })
  }

  const selectedCinderella = selectedCinderellas[selectedRegion] ?? null
  const regionCinderellas = regionData[selectedRegion]?.filter(team => team.seed >= 11) || []
  const currentRegionGames = regionalGames[selectedRegion] || []
  const currentRegionWinner = regionWinners[selectedRegion]

  return {
    bracketId,
    selectedRegion,
    setSelectedRegion,
    regionData,
    selectedCinderellas,
    setCinderellaForRegion,
    selectedCinderella,
    regionCinderellas,
    regionalGames,
    currentRegionGames,
    ensureRegionInitialized,
    selectWinner,
    regionWinners,
    currentRegionWinner,
    resetRegion,
    resetAllBrackets,
    finalFourGames,
    nationalChampion,
    ensureFinalFourInitialized,
    selectFinalFourWinner,
    areAllRegionsComplete,
    getRegionWinner,
  }
}

export default useBracketHook