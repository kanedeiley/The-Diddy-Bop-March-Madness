'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { getLeaderboard, LeaderboardEntry } from '../../actions/leaderboard';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';
<<<<<<< HEAD
import Image from 'next/image';
=======
>>>>>>> 6ef757a78e935f8bc29c0901d178b23a10954e59

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
<<<<<<< HEAD
      <div className="bg-white p-8">
=======
      <div className="bg-white rounded-xl border border-gray-200 p-8">
>>>>>>> 6ef757a78e935f8bc29c0901d178b23a10954e59
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
<<<<<<< HEAD
      <div className="bg-white p-6 text-red-600">
=======
      <div className="bg-white rounded-xl border border-red-200 p-6 text-red-600">
>>>>>>> 6ef757a78e935f8bc29c0901d178b23a10954e59
        {error}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
<<<<<<< HEAD
      <div className="bg-white p-8 text-center text-gray-500">
=======
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
>>>>>>> 6ef757a78e935f8bc29c0901d178b23a10954e59
        No locked brackets yet. Leaderboard will populate once brackets are locked.
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 pb-3 sm:pb-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">Leaderboard</h2>
=======
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Leaderboard</h2>
>>>>>>> 6ef757a78e935f8bc29c0901d178b23a10954e59
        <p className="text-xs text-gray-500 mt-0.5">
          {entries.length} bracket{entries.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Table */}
      <div className="divide-y divide-gray-100">
<<<<<<< HEAD
        {entries.map((entry) => (
          <Link
            key={entry.username}
            href={`/bracket/${entry.username}`}
            className="flex flex-col gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors border-b-2 border-gray-100"
          >
            {/* Top Row: Rank, Avatar, Name, Stats */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Rank */}
              <div className="w-6 sm:w-8 text-center flex-shrink-0">
                {entry.rank <= 3 ? (
                  <span className={`text-sm sm:text-base font-bold ${entry.rank === 1 ? 'text-amber-500' : entry.rank === 2 ? 'text-gray-500' : 'text-orange-600'}`}>
                    {entry.rank}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm font-semibold text-gray-400">
                    {entry.rank}
                  </span>
                )}
              </div>

              {/* Avatar + Name */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {entry.avatar_url ? (
                  <img
                    src={entry.avatar_url}
                    alt={entry.username}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm sm:text-base font-medium text-gray-900 truncate">
                  {entry.username}
                </span>
              </div>

              {/* Stats - Desktop */}
              <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
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

              {/* Points - Mobile Only */}
              <div className="sm:hidden flex-shrink-0">
                <span className="text-base font-bold text-gray-900">
                  {entry.total_points}
                </span>
                <span className="text-xs text-gray-400 ml-0.5">pts</span>
              </div>
            </div>

            {/* Bottom Row: Stats (Mobile) + Cinderella + Champion */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 pl-9 sm:pl-12">
              {/* Stats - Mobile Only */}
              <div className="flex sm:hidden items-center gap-3 text-xs">
=======
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
>>>>>>> 6ef757a78e935f8bc29c0901d178b23a10954e59
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

<<<<<<< HEAD
              {/* Cinderella Picks */}
              {entry.cinderella_ids.size > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-pink-700 uppercase">Cinderella</span>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from(entry.cinderella_ids).map((espnId) => (
                      <div key={espnId} className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex-shrink-0">
                        <Image
                          src={`https://a.espncdn.com/i/teamlogos/ncaa/500/${espnId}.png`}
                          alt={`Team ${espnId}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Champion Pick */}
              {entry.champion_id && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-amber-700 uppercase">Champion</span>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-amber-500 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex-shrink-0">
                    <Image
                      src={`https://a.espncdn.com/i/teamlogos/ncaa/500/${entry.champion_id}.png`}
                      alt="Champion pick"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
=======
              {/* Points */}
              <div className="w-16 text-right">
                <span className="text-lg font-bold text-gray-900">
                  {entry.total_points}
                </span>
                <span className="text-xs text-gray-400 ml-0.5">pts</span>
              </div>
>>>>>>> 6ef757a78e935f8bc29c0901d178b23a10954e59
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}