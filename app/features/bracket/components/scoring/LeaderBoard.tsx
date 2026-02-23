'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { getLeaderboard, LeaderboardEntry } from '../../actions/leaderboard';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getLeaderboard(CURRENT_TOURNAMENT_CONFIG.year);
      if (!result.success) {
        setError(result.error);
      } else {
        setEntries(result.entries);
      }
    });
  }, []);

  if (isPending) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-40" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        No locked brackets yet. Leaderboard will populate once brackets are locked.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Leaderboard</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {entries.length} bracket{entries.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Table */}
      <div className="divide-y divide-gray-100">
        {entries.map((entry, index) => (
          <Link
            key={entry.username}
            href={`/bracket/${entry.username}`}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
          >
            {/* Rank */}
            <div className="w-8 text-center">
              {entry.rank <= 3 ? (
                <span className="text-lg">
                  {entry.rank === 1 && '🥇'}
                  {entry.rank === 2 && '🥈'}
                  {entry.rank === 3 && '🥉'}
                </span>
              ) : (
                <span className="text-sm font-semibold text-gray-400">
                  {entry.rank}
                </span>
              )}
            </div>

            {/* Avatar + Name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {entry.avatar_url ? (
                <img
                  src={entry.avatar_url}
                  alt={entry.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                  {entry.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-medium text-gray-900 truncate">
                {entry.username}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-green-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {entry.correct}
                </span>
                <span className="flex items-center gap-1 text-red-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {entry.wrong}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  {entry.pending}
                </span>
              </div>

              {/* Points */}
              <div className="w-16 text-right">
                <span className="text-lg font-bold text-gray-900">
                  {entry.total_points}
                </span>
                <span className="text-xs text-gray-400 ml-0.5">pts</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}