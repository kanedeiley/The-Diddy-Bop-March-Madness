import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';
import { loadBracketByUsername } from '@/app/features/bracket/actions/view-bracket';
import { CURRENT_TOURNAMENT_CONFIG } from '@/app/config';
import ViewBracketClient from './ViewBracketClient';

type Props = {
  params: Promise<{ username: string }>;
};

export default async function ViewBracketPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const tournamentYear = CURRENT_TOURNAMENT_CONFIG.year;

  // Load target user's bracket
  const result = await loadBracketByUsername(username, tournamentYear);

  if (!result.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center max-w-md shadow-sm">
          <p className="text-gray-500 text-lg">{result.error}</p>
          <a
            href="/"
            className="inline-block mt-4 text-sm text-blue-600 hover:underline"
          >
            ← Back to your bracket
          </a>
        </div>
      </div>
    );
  }

  // Load tournament teams for hydration
  const { data: teamsRaw } = await supabase
    .from('tournament_teams')
    .select('espn_id, name, seed, region')
    .eq('tournament_year', tournamentYear)
    .order('seed');

  const teamsByRegion: Record<string, any[]> = {};
  for (const t of teamsRaw ?? []) {
    const region = t.region.toLowerCase();
    if (!teamsByRegion[region]) teamsByRegion[region] = [];
    teamsByRegion[region].push({
      id: t.espn_id,
      espnId: t.espn_id,
      name: t.name,
      seed: t.seed,
      region,
    });
  }

  return (
    <ViewBracketClient
      bracket={result.data!}
      teamsByRegion={teamsByRegion}
    />
  );
}