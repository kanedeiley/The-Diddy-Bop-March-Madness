import { getTeamsByYear } from './lib/teams'
import { loadBracket } from './features/bracket/actions/bracket'
import BracketCanvas from './features/bracket/components/BracketCanvas'
import { getTournamentYear } from './lib/config/tournament'

export default async function Page() {
  const teamsByRegion = await getTeamsByYear(getTournamentYear())
  const savedBracket = await loadBracket(getTournamentYear()).catch(() => null) // null if not logged in or no bracket

  return (
    <BracketCanvas
      teamsByRegion={teamsByRegion}
      savedBracket={savedBracket}
    />
  )
}