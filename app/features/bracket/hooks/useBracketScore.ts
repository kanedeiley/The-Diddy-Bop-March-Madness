
'use client';

import { useEffect, useState, useCallback, useTransition } from 'react';
import { getMyBracketScore, ScoreResponse } from '../actions/scoring';
import {
  BracketScoreResult,
  ResolvedGame,
  ScoredPick,
} from '../lib/resolve-bracket';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';

export interface BracketScoreData {
  /** Full score result with totals and round breakdown */
  score: BracketScoreResult | null;
  /** All resolved games (actual results) */
  resolved: ResolvedGame[] | null;
  /** Lookup a user's scored pick by game_slot */
  getPickScore: (gameSlot: string) => ScoredPick | undefined;
  /** Lookup the actual result by game_slot */
  getActualResult: (gameSlot: string) => ResolvedGame | undefined;
  /** Whether scoring is still loading */
  isLoading: boolean;
  /** Error message if scoring failed */
  error: string | null;
  /** Refresh scores (e.g. after new games complete) */
  refresh: () => void;
}

export function useBracketScore(): BracketScoreData {
  const [score, setScore] = useState<BracketScoreResult | null>(null);
  const [resolved, setResolved] = useState<ResolvedGame[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Index maps for O(1) lookups
  const [picksBySlot, setPicksBySlot] = useState<Map<string, ScoredPick>>(
    new Map()
  );
  const [resolvedBySlot, setResolvedBySlot] = useState<
    Map<string, ResolvedGame>
  >(new Map());

  const fetchScores = useCallback(() => {
    startTransition(async () => {
      const result = await getMyBracketScore(CURRENT_TOURNAMENT_CONFIG.year);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setScore(result.score);
      setResolved(result.resolved);
      setError(null);

      // Build lookup maps
      setPicksBySlot(
        new Map(result.score.picks.map((p) => [p.game_slot, p]))
      );
      setResolvedBySlot(
        new Map(result.resolved.map((g) => [g.game_slot, g]))
      );
    });
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const getPickScore = useCallback(
    (gameSlot: string) => picksBySlot.get(gameSlot),
    [picksBySlot]
  );

  const getActualResult = useCallback(
    (gameSlot: string) => resolvedBySlot.get(gameSlot),
    [resolvedBySlot]
  );

  return {
    score,
    resolved,
    getPickScore,
    getActualResult,
    isLoading: isPending,
    error,
    refresh: fetchScores,
  };
}