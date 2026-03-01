import { Root, Team2 } from '@/app/types';

// Logo https://a.espncdn.com/i/teamlogos/ncaa/500/145.png

const ESPN_BASE =
  'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball';

export interface ESPNGameResult {
  gameId: string;
  date: string;
  completed: boolean;
  teams: {
    name: string
    espnId: string;
    score: string;
    winner: boolean;
  }[];
}

/**
 * Utility: Validate YYYYMMDD format
 */
function isValidYYYYMMDD(date: string): boolean {
  return /^\d{8}$/.test(date);
}

/**
 * Utility: Build array of YYYYMMDD dates between start and end (inclusive)
 */
function getDateRange(start: string, end: string): string[] {
  if (!isValidYYYYMMDD(start) || !isValidYYYYMMDD(end)) {
    throw new Error('Dates must be in YYYYMMDD format');
  }

  const dates: string[] = [];

  const startDate = new Date(
    Number(start.slice(0, 4)),
    Number(start.slice(4, 6)) - 1,
    Number(start.slice(6, 8))
  );

  const endDate = new Date(
    Number(end.slice(0, 4)),
    Number(end.slice(4, 6)) - 1,
    Number(end.slice(6, 8))
  );

  if (startDate > endDate) {
    throw new Error('Start date must be before end date');
  }

  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    dates.push(`${yyyy}${mm}${dd}`);
  }

  return dates;
}

/**
 * Fetch scoreboard data
 * - Supports single day (no params)
 * - Supports date range via daily looping
 */
export async function getScoreboard(
  startDate?: string,
  endDate?: string
): Promise<ESPNGameResult[]> {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  // No date range provided — just fetch today
  if (!startDate || !endDate) {
    const res = await fetch(`${ESPN_BASE}/scoreboard?dates=${today}&groups=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.events ?? []).map(mapEvent);
  }

  // Tournament hasn't started yet — nothing to fetch
  if (today < startDate) return [];

  // Cap end date to today — don't fetch future dates
  const effectiveEnd = today < endDate ? today : endDate;
  const dates = getDateRange(startDate, effectiveEnd);

  const responses = await Promise.all(
    dates.map((date) =>
      fetch(`${ESPN_BASE}/scoreboard?dates=${date}&groups=100`, {
        next: { revalidate: 60 },
      }).then((res) => (res.ok ? res.json() : null))
    )
  );

  const allEvents: any[] = [];
  for (const data of responses) {
    if (data?.events) {
      allEvents.push(...data.events);
    }
  }

  // Deduplicate by event ID
  const uniqueEvents = Array.from(
    new Map(allEvents.map((e) => [e.id, e])).values()
  );
  
  return uniqueEvents.map(mapEvent);
}

/** Shared event → result mapper */
function mapEvent(event: any): ESPNGameResult {
  const comp = event.competitions[0];
  return {
    gameId: event.id,
    date: event.date,
    completed: comp.status.type.completed,
    teams: comp.competitors.map((c: any) => ({
      espnId: c.team.id,
      score: c.score,
      winner: c.winner,
      name: c.team.displayName,
    })),
  };
}

/**
 * Fetch all Division I teams
 */
export async function getTeams(): Promise<Team2[]> {
  const url = `${ESPN_BASE}/teams?limit=2000`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error('Failed to fetch teams');
  }

  const data: Root = await res.json();
  const teams: Team2[] = [];

  data.sports.forEach((sport) => {
    sport.leagues.forEach((league) => {
      league.teams.forEach((teamWrapper) => {
        teams.push(teamWrapper.team);
      });
    });
  });

  return teams;
}