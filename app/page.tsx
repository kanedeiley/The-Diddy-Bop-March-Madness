import { getTeamsByYear } from './lib/teams';
import BracketCanvas from './features/bracket/components/BracketCanvas';

export default async function Page() {
  const teamsByRegion = await getTeamsByYear(1997);

  return <BracketCanvas teamsByRegion={teamsByRegion} />;
}