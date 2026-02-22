// app/page.tsx
import { getTeamsByYear } from './lib/teams'
import { loadBracket } from './features/bracket/actions/bracket'
import BracketCanvas from './features/bracket/components/BracketCanvas'

export default async function Page() {
  const teamsByRegion = await getTeamsByYear(1997)
  const savedBracket = await loadBracket(1997).catch(() => null) // null if not logged in or no bracket

  return (
    <BracketCanvas
      teamsByRegion={teamsByRegion}
      savedBracket={savedBracket}
    />
  )
}