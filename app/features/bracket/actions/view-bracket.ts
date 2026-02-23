'use server';

import { createClient } from '@/app/lib/supabase/server';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';

export type ViewableBracket = {
  username: string;
  avatar_url: string | null;
  bracket: { id: string };
  picks: { game_slot: string; team_espn_id: string; round: number; region: string }[];
  cinderellas: { region: string; team_espn_id: string }[];
} | null;

export type ViewBracketResponse =
  | { success: true; data: ViewableBracket }
  | { success: false; error: string };

export async function loadBracketByUsername(
  username: string,
  tournamentYear: number
): Promise<ViewBracketResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  // Time-based lock check
  const config = CURRENT_TOURNAMENT_CONFIG;
  if (new Date() < config.lockedTime) {
    return { success: false, error: 'Brackets are not locked yet' };
  }

  // 1. Look up profile by username
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('user, username, avatar_url')
    .eq('username', username)
    .single();

  if (profileError || !profile) {
    return { success: false, error: 'User not found' };
  }

  // 2. Get their bracket
  const { data: bracket, error: bracketError } = await supabase
    .from('brackets')
    .select('id')
    .eq('user_id', profile.user)
    .eq('tournament_year', tournamentYear)
    .single();

  if (bracketError || !bracket) {
    return { success: false, error: 'No bracket found for this user' };
  }

  // 3. Get picks and cinderellas
  const [picksResult, cinderellasResult] = await Promise.all([
    supabase
      .from('bracket_picks')
      .select('game_slot, team_espn_id, round, region')
      .eq('bracket_id', bracket.id),
    supabase
      .from('bracket_cinderellas')
      .select('region, team_espn_id')
      .eq('bracket_id', bracket.id),
  ]);

  return {
    success: true,
    data: {
      username: profile.username,
      avatar_url: profile.avatar_url,
      bracket: { id: bracket.id },
      picks: picksResult.data ?? [],
      cinderellas: cinderellasResult.data ?? [],
    },
  };
}