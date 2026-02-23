'use client';

import { useEffect, useState, useCallback, useTransition } from 'react';
import { getBracketScore, ScoreResponse } from '../actions/scoring';
import {
  BracketScoreResult,
  ResolvedGame,
  ScoredPick,
} from '../lib/resolve-bracket';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';

export interface BracketScoreData {
  score: BracketScoreResult | null;
  resolved: ResolvedGame[] | null;
  getPickScore: (gameSlot: string) => ScoredPick | undefined;
  getActualResult: (gameSlot: string) => ResolvedGame | undefined;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch and expose scoring data.
 * Pass bracketId to score a specific bracket (e.g. when viewing another user's).
 * Omit to score the logged-in user's bracket.
 */
export function useBracketScore(bracketId?: string): BracketScoreData {
  const [score, setScore] = useState<BracketScoreResult | null>(null);
  const [resolved, setResolved] = useState<ResolvedGame[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [picksBySlot, setPicksBySlot] = useState<Map<string, ScoredPick>>(
    new Map()
  );
  const [resolvedBySlot, setResolvedBySlot] = useState<
    Map<string, ResolvedGame>
  >(new Map());

  const fetchScores = useCallback(() => {
    startTransition(async () => {
      const result = await getBracketScore(
        CURRENT_TOURNAMENT_CONFIG.year,
        bracketId
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setScore(result.score);
      setResolved(result.resolved);
      setError(null);

      setPicksBySlot(
        new Map(result.score.picks.map((p) => [p.game_slot, p]))
      );
      setResolvedBySlot(
        new Map(result.resolved.map((g) => [g.game_slot, g]))
      );
    });
  }, [bracketId]);

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