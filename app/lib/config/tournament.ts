export function getTournamentYear(): number {
  // Try to get from env, fallback to current year
  const envYear = process.env.TOURNAMENT_YEAR || process.env.NEXT_PUBLIC_TOURNAMENT_YEAR
  const year = envYear ? parseInt(envYear, 10) : new Date().getFullYear()
  return isNaN(year) ? new Date().getFullYear() : year
}
