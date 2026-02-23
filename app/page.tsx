import { getTeamsByYear } from './lib/teams'
import { loadBracket } from './features/bracket/actions/bracket'
import BracketCanvas from './features/bracket/components/BracketCanvas'
import { CURRENT_TOURNAMENT_CONFIG } from './config'

const {year} = CURRENT_TOURNAMENT_CONFIG
export default async function Page() {
  const teamsByRegion = await getTeamsByYear(year)
  const savedBracket = await loadBracket(year).catch(() => null) // null if not logged in or no bracket

  return (
    <BracketCanvas
      teamsByRegion={teamsByRegion}
      savedBracket={savedBracket}
    />
  )
}