'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { getLeaderboard, LeaderboardEntry } from '../../actions/leaderboard';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';

const MEDAL = ['🥇', '🥈', '🥉'];

function StatChip({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums"
      style={{ background: color + '22', color }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
      />
      {count} <span className="hidden sm:inline font-normal opacity-70">{label}</span>
    </span>
  );
}

function TeamLogo({
  espnId,
  size = 36,
  borderColor,
}: {
  espnId: string;
  size?: number;
  borderColor: string;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden flex-shrink-0 transition-transform duration-200 hover:scale-110"
      style={{
        width: size,
        height: size,
        border: `2px solid ${borderColor}`,
        boxShadow: `0 0 10px ${borderColor}55`,
      }}
    >
      <img
        src={`https://a.espncdn.com/i/teamlogos/ncaa/500/${espnId}.png`}
        alt={`Team ${espnId}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

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
      <div className="leaderboard-root p-6 space-y-3">
        <div className="lb-skeleton h-7 w-48 rounded-lg" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="lb-skeleton h-20 rounded-2xl" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
        <style>{skeletonCss}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-root p-8 text-center">
        <span style={{ color: '#ff6b6b', fontFamily: 'monospace', fontSize: 14 }}>{error}</span>
        <style>{baseCss}</style>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="leaderboard-root p-12 text-center">
        <div style={{ fontSize: 40 }}>🏆</div>
        <p className="lb-empty-text">Leaderboard locks once brackets are submitted.</p>
        <style>{baseCss}</style>
      </div>
    );
  }

  return (
    <>
      <style>{baseCss + animationCss}</style>
      <div className="leaderboard-root">
        {/* Header */}
        <div className="lb-header">
          <div>
            <h2 className="lb-title">Leaderboard</h2>
            <p className="lb-subtitle">{entries.length} bracket{entries.length !== 1 ? 's' : ''} competing</p>
          </div>
          <div className="lb-badge">2026 Tournament</div>
        </div>

        {/* Rows */}
        <div className="lb-list">
          {entries.map((entry, idx) => {
            const isTop3 = entry.rank <= 3;
            const rankColor =
              entry.rank === 1 ? '#FFD700' : entry.rank === 2 ? '#C0C0C0' : entry.rank === 3 ? '#CD7F32' : '#4a5568';
            const cinderellaArr = Array.from(entry.cinderella_ids ?? []);

            return (
              <Link
                key={entry.username}
                href={`/bracket/${entry.username}`}
                className="lb-row"
                style={{ animationDelay: `${idx * 55}ms` }}
              >
                {isTop3 && <div className="lb-accent-bar" style={{ background: rankColor }} />}

                {/* Top line: rank | avatar + name | points */}
                <div className="lb-top-line">
                  <div className="lb-rank" style={{ color: rankColor }}>
                    {isTop3
                      ? <span className="lb-medal">{MEDAL[entry.rank - 1]}</span>
                      : <span className="lb-rank-num">{entry.rank}</span>}
                  </div>

                  {entry.avatar_url ? (
                    <img
                      src={entry.avatar_url}
                      alt={entry.username}
                      className="lb-avatar"
                      style={{ borderColor: isTop3 ? rankColor : 'transparent' }}
                    />
                  ) : (
                    <div
                      className="lb-avatar lb-avatar-fallback"
                      style={{ borderColor: isTop3 ? rankColor : 'transparent' }}
                    >
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="lb-username">{entry.username}</span>

                  <div className="lb-points" style={{ color: isTop3 ? rankColor : '#111827' }}>
                    <span className="lb-pts-value">{entry.total_points}</span>
                    <span className="lb-pts-label">pts</span>
                  </div>
                </div>

                {/* Bottom line: stats + picks */}
                <div className="lb-bottom-line">
                  <div className="lb-stats">
                    <StatChip count={entry.correct} label="correct" color="#16a34a" />
                    <StatChip count={entry.wrong} label="wrong" color="#ef4444" />
                    <StatChip count={entry.pending} label="pending" color="#9ca3af" />
                  </div>

                  <div className="lb-picks-row">
                    {cinderellaArr.length > 0 && (
                      <div className="lb-pick-group">
                        <span className="lb-pick-label cinderella">🪄 Cinderella</span>
                        <div className="lb-logos">
                          {cinderellaArr.map((id) => (
                            <TeamLogo key={id} espnId={id} size={26} borderColor="#db2777" />
                          ))}
                        </div>
                      </div>
                    )}
                    {entry.champion_id && (
                      <div className="lb-pick-group">
                        <span className="lb-pick-label champion">🏆 Champion</span>
                        <TeamLogo espnId={entry.champion_id} size={26} borderColor="#d97706" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */

const baseCss = `
  .leaderboard-root {
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    font-family: 'Trebuchet MS', 'Gill Sans', system-ui, sans-serif;
    border: 1px solid #e5e7eb;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03);
  }

  .lb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 16px;
    background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
    border-bottom: 1px solid #f0f0f0;
  }

  .lb-title {
    font-size: 22px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.5px;
    margin: 0;
    text-transform: uppercase;
  }

  .lb-subtitle {
    font-size: 11px;
    color: #16a34a;
    margin: 2px 0 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .lb-badge {
    font-size: 10px;
    font-weight: 700;
    color: #16a34a;
    background: rgba(22,163,74,0.08);
    border: 1px solid rgba(22,163,74,0.2);
    border-radius: 999px;
    padding: 4px 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .lb-list {
    display: flex;
    flex-direction: column;
  }

  .lb-row {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px 14px 24px;
    border-bottom: 1px solid #f3f4f6;
    text-decoration: none;
    transition: background 0.15s ease;
    overflow: hidden;
    background: #ffffff;
  }

  .lb-row:last-child { border-bottom: none; }

  .lb-row:hover {
    background: #f9fafb;
  }

  .lb-accent-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    border-radius: 0 2px 2px 0;
  }

  .lb-rank {
    width: 36px;
    flex-shrink: 0;
    text-align: center;
  }

  .lb-medal { font-size: 22px; line-height: 1; }
  .lb-rank-num {
    font-size: 13px;
    font-weight: 700;
    color: #9ca3af;
    font-variant-numeric: tabular-nums;
  }

  /* Two-line row layout */
  .lb-row {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  .lb-top-line {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .lb-bottom-line {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding-left: 46px; /* rank width + gap to align under name */
  }

  .lb-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 2px solid transparent;
  }

  .lb-avatar-fallback {
    background: #f0fdf4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: #16a34a;
  }

  .lb-username {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lb-stats {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .lb-picks-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .lb-pick-group {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .lb-pick-label {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-radius: 4px;
    padding: 2px 5px;
    white-space: nowrap;
  }

  .lb-pick-label.cinderella {
    color: #db2777;
    background: rgba(219,39,119,0.08);
  }

  .lb-pick-label.champion {
    color: #d97706;
    background: rgba(217,119,6,0.08);
  }

  .lb-logos {
    display: flex;
    gap: 3px;
    align-items: center;
  }

  .lb-points {
    flex-shrink: 0;
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: auto;
  }

  .lb-pts-value {
    font-size: 22px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -1px;
    font-variant-numeric: tabular-nums;
  }

  .lb-pts-label {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #9ca3af;
    margin-top: 1px;
  }

  .lb-empty-text {
    font-size: 13px;
    color: #6b7280;
    margin-top: 8px;
  }
`;

const animationCss = `
  .lb-row {
    animation: lb-slide-in 0.35s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes lb-slide-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const skeletonCss = `
  .leaderboard-root {
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }

  .lb-skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e9ebee 50%, #f3f4f6 75%);
    background-size: 400% 100%;
    animation: lb-shimmer 1.4s ease-in-out infinite both;
  }

  @keyframes lb-shimmer {
    0%   { background-position: 100% 50%; opacity: 0.6; }
    50%  { background-position: 0%   50%; opacity: 1; }
    100% { background-position: 100% 50%; opacity: 0.6; }
  }
`;