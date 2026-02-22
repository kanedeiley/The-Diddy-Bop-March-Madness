import { Root, Team2 } from '@/app/types';

// Logo (CDN) -> https://a.espncdn.com/i/teamlogos/ncaa/500/145.png (can use in image tag)
// Teams -> https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams
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


export async function getTeams(): Promise<Team2[]> {
  const url = `${ESPN_BASE}/teams?limit=2000`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch teams');
  const data: Root = await res.json();
  const teams: Team2[] = [];
  data.sports.forEach(sport => {
    sport.leagues.forEach(league => {
      league.teams.forEach(teamWrapper => {
        teams.push(teamWrapper.team);
      });
    });
  });

  return teams;
}