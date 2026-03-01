'use server';

import { createClient } from '@/app/lib/supabase/server';
import {
  getResolvedBracketCached,
  scorePicksAgainstResolved,
  RoundScoringConfig,
} from '../lib/resolve-bracket';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';

export interface LeaderboardEntry {
  username: string;
  avatar_url: string | null;
  total_points: number;
  correct: number;
  wrong: number;
  pending: number;
  max_possible: number;
  rank: number;
<<<<<<< HEAD
  cinderella_ids: Set<string>
  champion_id: string | null;
=======
>>>>>>> 6ef757a78e935f8bc29c0901d178b23a10954e59
}

export type LeaderboardResponse =
  | { success: true; entries: LeaderboardEntry[] }
  | { success: false; error: string };

export async function getLeaderboard(
  tournamentYear: number
): Promise<LeaderboardResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  // Check if brackets are locked yet
  const config = CURRENT_TOURNAMENT_CONFIG;
  if (new Date() < config.lockedTime) {
    return { success: false, error: 'Brackets are not locked yet' };
  }

  // 1. All brackets for this tournament
  const { data: brackets, error: bracketsError } = await supabase
    .from('brackets')
    .select('id, user_id')
    .eq('tournament_year', tournamentYear);

  if (bracketsError) return { success: false, error: bracketsError.message };
  if (!brackets || brackets.length === 0) {
    return { success: true, entries: [] };
  }

  // 2. Fetch profiles
  const userIds = brackets.map((b) => b.user_id);
  const { data: profiles } = await supabase
    .from('profile')
    .select('user, username, avatar_url')
    .in('user', userIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.user, p])
  );

  // 3. All picks + cinderellas in bulk
  const bracketIds = brackets.map((b) => b.id);

  const [picksResult, cinderellasResult] = await Promise.all([
    supabase
      .from('bracket_picks')
      .select('bracket_id, game_slot, team_espn_id, round')
      .in('bracket_id', bracketIds),
    supabase
      .from('bracket_cinderellas')
      .select('bracket_id, team_espn_id')
      .in('bracket_id', bracketIds),
  ]);

  // 4. Tournament teams
  const { data: teams } = await supabase
    .from('tournament_teams')
    .select('espn_id, seed, region')
    .eq('tournament_year', tournamentYear);

  if (!teams) return { success: false, error: 'No teams found' };

  // 5. Scoring config
  const { data: scoringConfig } = await supabase
    .from('scoring_config')
    .select('round, points_per_correct, cinderella_multiplier')
    .eq('tournament_year', tournamentYear)
    .order('round');

  if (!scoringConfig || scoringConfig.length === 0) {
    return { success: false, error: 'No scoring config found' };
  }

  // 6. Group teams by region
  const teamsByRegion: Record<string, { espnId: string; seed: number }[]> = {};
  for (const t of teams) {
    const region = t.region.toLowerCase();
    if (!teamsByRegion[region]) teamsByRegion[region] = [];
    teamsByRegion[region].push({ espnId: t.espn_id, seed: t.seed });
  }

  // 7. Resolve actual bracket ONCE (cached — shared across all users)
  const resolved = await getResolvedBracketCached(
    teamsByRegion,
    config.startDate,
    config.endDate,
    config.finalFourPairings
  );

  // 8. Index picks + cinderellas by bracket_id
  const picksByBracket = new Map<string, typeof picksResult.data>();
  for (const pick of picksResult.data ?? []) {
    if (!picksByBracket.has(pick.bracket_id)) {
      picksByBracket.set(pick.bracket_id, []);
    }
    picksByBracket.get(pick.bracket_id)!.push(pick);
  }

<<<<<<< HEAD

    // 9. Index championship picks by bracket_id
    const championByBracket = new Map<string, string>();
    for (const pick of picksResult.data ?? []) {
    if (pick.game_slot === 'championship') {
        championByBracket.set(pick.bracket_id, pick.team_espn_id);
    }
    }

=======
>>>>>>> 6ef757a78e935f8bc29c0901d178b23a10954e59
  const cinderellasByBracket = new Map<string, Set<string>>();
  for (const c of cinderellasResult.data ?? []) {
    if (!cinderellasByBracket.has(c.bracket_id)) {
      cinderellasByBracket.set(c.bracket_id, new Set());
    }
    cinderellasByBracket.get(c.bracket_id)!.add(c.team_espn_id);
  }

  // 9. Score each bracket
  const entries: LeaderboardEntry[] = [];

  for (const bracket of brackets) {
    const profile = profileMap.get(bracket.user_id);
    if (!profile) continue;

    const picks = picksByBracket.get(bracket.id) ?? [];
    const cinderellaIds =
      cinderellasByBracket.get(bracket.id) ?? new Set<string>();

    const score = scorePicksAgainstResolved(
      picks,
      resolved,
      cinderellaIds,
      scoringConfig as RoundScoringConfig[]
    );

    entries.push({
      username: profile.username,
      avatar_url: profile.avatar_url,
      total_points: score.total_points,
      correct: score.correct,
      wrong: score.wrong,
      pending: score.pending,
      max_possible: score.max_possible,
      rank: 0,
<<<<<<< HEAD
      cinderella_ids: cinderellaIds,
      champion_id: championByBracket.get(bracket.id) ?? null,
=======
>>>>>>> 6ef757a78e935f8bc29c0901d178b23a10954e59
    });
  }

  // 10. Rank
  entries.sort((a, b) => {
    if (b.total_points !== a.total_points)
      return b.total_points - a.total_points;
    return b.max_possible - a.max_possible;
  });

  let currentRank = 1;
  for (let i = 0; i < entries.length; i++) {
    if (i > 0 && entries[i].total_points < entries[i - 1].total_points) {
      currentRank = i + 1;
    }
    entries[i].rank = currentRank;
  }

  return { success: true, entries };
}