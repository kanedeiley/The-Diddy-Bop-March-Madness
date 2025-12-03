// Tournament Configuration
// Update this file each year to reflect the current tournament structure

export type TournamentConfig = {
  year: number;
  regions: string[];
  finalFourLocation?: string;
  championshipLocation?: string;
};

// Current tournament configuration
export const CURRENT_TOURNAMENT_CONFIG: TournamentConfig = {
  year: 2025,
  regions: ['east', 'west', 'south', 'midwest'],
  finalFourLocation: 'San Antonio, TX',
  championshipLocation: 'San Antonio, TX',
};

// Helper to validate all regions have winners
export const validateRegionsComplete = (
  completedRegions: string[],
  config: TournamentConfig = CURRENT_TOURNAMENT_CONFIG
): boolean => {
  return config.regions.every(region => completedRegions.includes(region));
};