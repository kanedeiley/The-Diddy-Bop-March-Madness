'use server';

import { createClient } from '@/app/lib/supabase/server';
import {
  getResolvedBracketCached,
  scorePicksAgainstResolved,
  BracketScoreResult,
  ResolvedGame,
  RoundScoringConfig,
} from '../lib/resolve-bracket';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';

export type ScoreResponse =
  | { success: true; score: BracketScoreResult; resolved: ResolvedGame[] }
  | { success: false; error: string };

export async function getMyBracketScore(
  tournamentYear: number
): Promise<ScoreResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  // 1. User's bracket
  const { data: bracket } = await supabase
    .from('brackets')
    .select('id')
    .eq('user_id', user.id)
    .eq('tournament_year', tournamentYear)
    .single();

  if (!bracket) return { success: false, error: 'No bracket found' };

  // 2. User's picks + cinderellas
  const [picksResult, cinderellasResult] = await Promise.all([
    supabase
      .from('bracket_picks')
      .select('game_slot, team_espn_id, round')
      .eq('bracket_id', bracket.id),
    supabase
      .from('bracket_cinderellas')
      .select('team_espn_id')
      .eq('bracket_id', bracket.id),
  ]);

  // 3. Tournament teams grouped by region
  const { data: teams } = await supabase
    .from('tournament_teams')
    .select('espn_id, seed, region')
    .eq('tournament_year', tournamentYear);

  if (!teams) return { success: false, error: 'No teams found' };

  // 4. Scoring config from DB
  const { data: scoringConfig } = await supabase
    .from('scoring_config')
    .select('round, points_per_correct, cinderella_multiplier')
    .eq('tournament_year', tournamentYear)
    .order('round');

  if (!scoringConfig || scoringConfig.length === 0) {
    return { success: false, error: 'No scoring config found' };
  }

  // 5. Group teams by region
  const teamsByRegion: Record<string, { espnId: string; seed: number }[]> = {};
  for (const t of teams) {
    const region = t.region.toLowerCase();
    if (!teamsByRegion[region]) teamsByRegion[region] = [];
    teamsByRegion[region].push({ espnId: t.espn_id, seed: t.seed });
  }

  // 6. Resolve actual bracket (cached — shared across all users)
  const config = CURRENT_TOURNAMENT_CONFIG;
  const resolved = await getResolvedBracketCached(
    teamsByRegion,
    config.startDate,
    config.endDate,
    config.finalFourPairings
  );

  // 7. Score picks using DB config
  const cinderellaIds = new Set(
    (cinderellasResult.data ?? []).map((c) => c.team_espn_id)
  );

  const score = scorePicksAgainstResolved(
    picksResult.data ?? [],
    resolved,
    cinderellaIds,
    scoringConfig as RoundScoringConfig[]
  );

  return { success: true, score, resolved };
}