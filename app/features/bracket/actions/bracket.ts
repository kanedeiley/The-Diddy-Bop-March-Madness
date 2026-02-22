'use server'

import { createClient } from '@/app/lib/supabase/server'

interface BracketPick {
  game_slot: string       // "south-r1-0", "semifinal-1", "championship"
  team_espn_id: string
  round: number           // 1-6
  region: string          // "south", "east", "midwest", "west", "final"
}

interface CinderellaPick {
  region: string
  team_espn_id: string
}

export async function saveBracket(
  tournamentYear: number,
  picks: BracketPick[],
  cinderellas: CinderellaPick[]
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Upsert bracket record
  const { data: bracket, error: bracketError } = await supabase
    .from('brackets')
    .upsert(
      {
        user_id: user.id,
        tournament_year: tournamentYear,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,tournament_year' }
    )
    .select()
    .single()

  if (bracketError) throw bracketError

  // Upsert picks
  const picksWithBracket = picks.map(p => ({
    bracket_id: bracket.id,
    game_slot: p.game_slot,
    team_espn_id: p.team_espn_id,
    round: p.round,
    region: p.region,
  }))

  const { error: picksError } = await supabase
    .from('bracket_picks')
    .upsert(picksWithBracket, { onConflict: 'bracket_id,game_slot' })

  if (picksError) throw picksError

  // Upsert cinderellas
  if (cinderellas.length > 0) {
    const cinderellasWithBracket = cinderellas.map(c => ({
      bracket_id: bracket.id,
      region: c.region,
      team_espn_id: c.team_espn_id,
    }))

    const { error: cinderellaError } = await supabase
      .from('bracket_cinderellas')
      .upsert(cinderellasWithBracket, { onConflict: 'bracket_id,region' })

    if (cinderellaError) throw cinderellaError
  }

  return { success: true, bracketId: bracket.id }
}


export async function loadBracket(tournamentYear: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get bracket
  const { data: bracket, error: bracketError } = await supabase
    .from('brackets')
    .select('*')
    .eq('user_id', user.id)
    .eq('tournament_year', tournamentYear)
    .maybeSingle()

  if (bracketError) throw bracketError
  if (!bracket) return null

  // Get picks and cinderellas in parallel
  const [{ data: picks }, { data: cinderellas }] = await Promise.all([
    supabase
      .from('bracket_picks')
      .select('*')
      .eq('bracket_id', bracket.id),
    supabase
      .from('bracket_cinderellas')
      .select('*')
      .eq('bracket_id', bracket.id),
  ])

  return {
    bracket,
    picks: picks || [],
    cinderellas: cinderellas || [],
  }
}