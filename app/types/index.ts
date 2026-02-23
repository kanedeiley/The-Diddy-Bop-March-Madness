export interface Root {
  sports: Sport[]
}

export interface Sport {
  id: string
  uid: string
  name: string
  slug: string
  leagues: League[]
}

export interface League {
  id: string
  uid: string
  name: string
  abbreviation: string
  shortName: string
  slug: string
  teams: Team[]
  year: number
  season: Season
}

export interface Team {
  team: Team2
}

export interface Team2 {
  id: string
  uid: string
  slug: string
  abbreviation: string
  displayName: string
  shortDisplayName: string
  name: string
  nickname: string
  location: string
  color: string
  alternateColor?: string
  isActive: boolean
  isAllStar: boolean
  logos: Logo[]
  links: Link[]
}

export interface Logo {
  href: string
  alt: string
  rel: string[]
  width: number
  height: number
}

export interface Link {
  language: string
  rel: string[]
  href: string
  text: string
  shortText: string
  isExternal: boolean
  isPremium: boolean
  isHidden: boolean
}

export interface Season {
  year: number
  displayName: string
}
