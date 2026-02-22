'use client'

import { useState, useCallback } from 'react'
import { useBracketContext } from '../context/useBracketContext'
import { saveBracket } from '../actions/bracket'
import { toast } from 'sonner'

export function useBracketSave(tournamentYear: number) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    regionalGames,
    selectedCinderellas,
    finalFourGames,
  } = useBracketContext()

  const save = useCallback(async () => {
    setSaving(true)
    setError(null)

    try {
      const picks = []

      // Regional rounds (1-4)
      for (const [region, games] of Object.entries(regionalGames)) {
        for (const game of games) {
          if (game.winner?.espnId) {
            picks.push({
              game_slot: game.id,
              team_espn_id: game.winner.espnId,
              round: game.round,
              region,
            })
          }
        }
      }

      // Final Four + Championship (rounds 5-6)
      for (const game of finalFourGames) {
        if (game.winner?.espnId) {
          picks.push({
            game_slot: game.id,
            team_espn_id: game.winner.espnId,
            round: game.id === 'championship' ? 6 : 5,
            region: 'final',
          })
        }
      }

      // Cinderellas
      const cinderellas = Object.entries(selectedCinderellas)
        .filter(([_, c]) => c !== null)
        .map(([region, c]) => ({
          region,
          team_espn_id: c!.espnId,
        }))

      const result = await saveBracket(tournamentYear, picks, cinderellas)
      toast.success("Saved Bracket.")
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save bracket'
      setError(message)
      toast.error('Failed to save Bracket.')
      throw err
    } finally {
      setSaving(false)
    }
  }, [regionalGames, finalFourGames, selectedCinderellas, tournamentYear])

  return { save, saving, error }
}