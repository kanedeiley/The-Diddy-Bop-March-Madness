// lib/espn.ts
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball';

export interface ESPNGameResult {
  gameId: string;
  completed: boolean;
  teams: {
    espnId: string;
    score: string;
    winner: boolean;
  }[];
}

export async function getScoreboard(date?: string): Promise<ESPNGameResult[]> {
  const url = date
    ? `${ESPN_BASE}/scoreboard?dates=${date}`
    : `${ESPN_BASE}/scoreboard`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch scoreboard');
  const data = await res.json();

  return data.events.map((event: any) => {
    const comp = event.competitions[0];
    return {
      gameId: event.id,
      completed: comp.status.type.completed,
      teams: comp.competitors.map((c: any) => ({
        espnId: c.team.id,
        score: c.score,
        winner: c.winner,
      })),
    };
  });
}