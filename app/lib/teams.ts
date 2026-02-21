// lib/teams.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface TournamentTeam {
  id: string;
  espnId: string;
  name: string;
  seed: number;
  region: string;
}

export async function getTeamsByYear(year: number): Promise<Record<string, TournamentTeam[]>> {
  const { data, error } = await supabase
    .from('tournament_teams')
    .select('*')
    .eq('tournament_year', year)
    .order('seed', { ascending: true });

  if (error) throw error;

  // Group by region - same shape your bracket hook expects
  const grouped: Record<string, TournamentTeam[]> = {};
  
  for (const row of data) {
    const region = row.region.toLowerCase();
    if (!grouped[region]) grouped[region] = [];
    grouped[region].push({
      id: `${region[0]}${row.seed}`,  // "s1", "e2", etc. - matches your existing IDs
      espnId: row.espn_id,
      name: row.name,
      seed: row.seed,
      region,
    });
  }

  return grouped;
}