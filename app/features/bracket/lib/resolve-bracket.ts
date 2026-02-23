// features/bracket/lib/resolve-bracket.ts

import { ESPNGameResult } from '@/app/lib/espn';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ResolvedGame {
  game_slot: string;
  round: number;
  region: string;
  team1_espn_id: string | null;
  team2_espn_id: string | null;
  winner_espn_id: string | null;
}

/** Mirrors the scoring_config table row */
export interface RoundScoringConfig {
  round: number;
  points_per_correct: number;
  cinderella_multiplier: number;
}

export type PickStatus = 'correct' | 'wrong' | 'pending';

export interface ScoredPick {
  game_slot: string;
  round: number;
  picked_espn_id: string;
  actual_winner: string | null;
  status: PickStatus;
  points: number;
  is_cinderella: boolean;
  base_points: number;
}

export interface BracketScoreResult {
  total_points: number;
  max_possible: number;
  correct: number;
  wrong: number;
  pending: number;
  picks: ScoredPick[];
  round_breakdown: {
    round: number;
    points: number;
    correct: number;
    wrong: number;
    pending: number;
    max_points: number;
  }[];
}

// ─── Matchup Resolution ─────────────────────────────────────────────────────

/**
 * Build a lookup: "team A vs team B → who won?"
 * Key is sorted pair of ESPN IDs so order doesn't matter.
 */
function buildMatchupLookup(results: ESPNGameResult[]) {
  const lookup = new Map<
    string,
    { winnerId: string; scores: Record<string, number> }
  >();

  for (const game of results) {
    if (!game.completed || game.teams.length !== 2) continue;

    const ids = game.teams.map((t) => t.espnId).sort();
    const key = ids.join('-');
    const winner = game.teams.find((t) => t.winner);

    if (winner) {
      lookup.set(key, {
        winnerId: winner.espnId,
        scores: Object.fromEntries(
          game.teams.map((t) => [t.espnId, parseInt(t.score)])
        ),
      });
    }
  }

  return lookup;
}

function lookupWinner(
  lookup: ReturnType<typeof buildMatchupLookup>,
  team1: string,
  team2: string
) {
  const key = [team1, team2].sort().join('-');
  return lookup.get(key) ?? null;
}

// Standard R1 seed matchups → position index
const R1_MATCHUPS: [number, number][] = [
  [1, 16], // pos 0
  [8, 9], // pos 1
  [5, 12], // pos 2
  [4, 13], // pos 3
  [6, 11], // pos 4
  [3, 14], // pos 5
  [7, 10], // pos 6
  [2, 15], // pos 7
];

/**
 * Resolve actual tournament results into game_slot format.
 * Walks the bracket forward using ESPN results — if a round isn't complete,
 * later rounds naturally have null teams/winners (pending).
 */
export function resolveActualBracket(
  teamsByRegion: Record<string, { espnId: string; seed: number }[]>,
  espnResults: ESPNGameResult[],
  finalFourPairings: [string, string][] // e.g. [['south','west'], ['east','midwest']]
): ResolvedGame[] {
  const lookup = buildMatchupLookup(espnResults);
  const resolved: ResolvedGame[] = [];
  const regionWinners: Record<string, string | null> = {};

  for (const [region, teams] of Object.entries(teamsByRegion)) {
    const bySeed = new Map(teams.map((t) => [t.seed, t.espnId]));

    // ── R1: Known matchups from seeds ──
    const r1Winners: (string | null)[] = [];

    for (let pos = 0; pos < R1_MATCHUPS.length; pos++) {
      const [seedA, seedB] = R1_MATCHUPS[pos];
      const teamA = bySeed.get(seedA)!;
      const teamB = bySeed.get(seedB)!;
      const result = lookupWinner(lookup, teamA, teamB);

      resolved.push({
        game_slot: `${region}-r1-${pos}`,
        round: 1,
        region,
        team1_espn_id: teamA,
        team2_espn_id: teamB,
        winner_espn_id: result?.winnerId ?? null,
      });

      r1Winners.push(result?.winnerId ?? null);
    }

    // ── R2–R4: Walk forward using actual winners ──
    let prevWinners = r1Winners;

    for (let round = 2; round <= 4; round++) {
      const roundWinners: (string | null)[] = [];
      const gamesInRound = prevWinners.length / 2;

      for (let pos = 0; pos < gamesInRound; pos++) {
        const teamA = prevWinners[pos * 2];
        const teamB = prevWinners[pos * 2 + 1];

        let winnerId: string | null = null;
        if (teamA && teamB) {
          const result = lookupWinner(lookup, teamA, teamB);
          winnerId = result?.winnerId ?? null;
        }

        resolved.push({
          game_slot: `${region}-r${round}-${pos}`,
          round,
          region,
          team1_espn_id: teamA,
          team2_espn_id: teamB,
          winner_espn_id: winnerId,
        });

        roundWinners.push(winnerId);
      }

      prevWinners = roundWinners;
    }

    regionWinners[region] = prevWinners[0] ?? null;
  }

  // ── Final Four ──
  for (let i = 0; i < finalFourPairings.length; i++) {
    const [regionA, regionB] = finalFourPairings[i];
    const teamA = regionWinners[regionA];
    const teamB = regionWinners[regionB];

    let winnerId: string | null = null;
    if (teamA && teamB) {
      const result = lookupWinner(lookup, teamA, teamB);
      winnerId = result?.winnerId ?? null;
    }

    resolved.push({
      game_slot: `semifinal-${i + 1}`,
      round: 5,
      region: 'final',
      team1_espn_id: teamA,
      team2_espn_id: teamB,
      winner_espn_id: winnerId,
    });
  }

  // ── Championship ──
  const sf1Winner = resolved.find(
    (g) => g.game_slot === 'semifinal-1'
  )?.winner_espn_id;
  const sf2Winner = resolved.find(
    (g) => g.game_slot === 'semifinal-2'
  )?.winner_espn_id;

  let champWinner: string | null = null;
  if (sf1Winner && sf2Winner) {
    const result = lookupWinner(lookup, sf1Winner, sf2Winner);
    champWinner = result?.winnerId ?? null;
  }

  resolved.push({
    game_slot: 'championship',
    round: 6,
    region: 'final',
    team1_espn_id: sf1Winner ?? null,
    team2_espn_id: sf2Winner ?? null,
    winner_espn_id: champWinner,
  });

  return resolved;
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

/**
 * Score a user's picks against the resolved bracket.
 * Uses per-round scoring config from the scoring_config table.
 */
export function scorePicksAgainstResolved(
  picks: { game_slot: string; team_espn_id: string; round: number }[],
  resolved: ResolvedGame[],
  cinderellaIds: Set<string>,
  scoringConfig: RoundScoringConfig[]
): BracketScoreResult {
  const resolvedBySlot = new Map(resolved.map((g) => [g.game_slot, g]));
  const configByRound = new Map(scoringConfig.map((c) => [c.round, c]));

  const scoredPicks: ScoredPick[] = picks.map((pick) => {
    const actual = resolvedBySlot.get(pick.game_slot);
    const config = configByRound.get(pick.round);
    const basePoints = config?.points_per_correct ?? 0;
    const multiplier = config?.cinderella_multiplier ?? 1;

    const isPending = !actual?.winner_espn_id;
    const isCorrect = actual?.winner_espn_id === pick.team_espn_id;
    const isCinderella = cinderellaIds.has(pick.team_espn_id);
    const points = isCorrect ? basePoints * (isCinderella ? multiplier : 1) : 0;

    return {
      game_slot: pick.game_slot,
      round: pick.round,
      picked_espn_id: pick.team_espn_id,
      actual_winner: actual?.winner_espn_id ?? null,
      status: isPending
        ? ('pending' as const)
        : isCorrect
          ? ('correct' as const)
          : ('wrong' as const),
      points,
      is_cinderella: isCinderella,
      base_points: basePoints,
    };
  });

  // Build round breakdown
  const rounds = [...new Set(picks.map((p) => p.round))].sort();
  const round_breakdown = rounds.map((round) => {
    const roundPicks = scoredPicks.filter((p) => p.round === round);
    const config = configByRound.get(round);
    const basePoints = config?.points_per_correct ?? 0;

    return {
      round,
      points: roundPicks.reduce((sum, p) => sum + p.points, 0),
      correct: roundPicks.filter((p) => p.status === 'correct').length,
      wrong: roundPicks.filter((p) => p.status === 'wrong').length,
      pending: roundPicks.filter((p) => p.status === 'pending').length,
      // Max possible = all remaining (correct + pending) at base points
      max_points:
        roundPicks.filter((p) => p.status !== 'wrong').length * basePoints,
    };
  });

  const total_points = scoredPicks.reduce((sum, p) => sum + p.points, 0);
  const max_possible = round_breakdown.reduce(
    (sum, r) => sum + r.max_points,
    0
  );

  return {
    total_points,
    max_possible,
    correct: scoredPicks.filter((p) => p.status === 'correct').length,
    wrong: scoredPicks.filter((p) => p.status === 'wrong').length,
    pending: scoredPicks.filter((p) => p.status === 'pending').length,
    picks: scoredPicks,
    round_breakdown,
  };
}