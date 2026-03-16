// Tournament Configuration
// Update this file each year to reflect the current tournament structure

export type TournamentConfig = {
  year: number;
  regions: string[];
  finalFourLocation?: string;
  championshipLocation?: string;
};

// export const CURRENT_TOURNAMENT_CONFIG = {
//   year: 2025,
//   regions: ['South', 'East', 'West', 'Midwest'],
//   startDate: '20250318',  
//   endDate: '20250407',   
//   // End of day March 18, 2026 in America/New_York (EDT) -> 2026-03-19T03:59:59.999Z
//   lockedTime: new Date('2026-03-19T03:59:59.999Z'),
//   finalFourLocation: 'Indianapolis, Indiana',
//   finalFourPairings: [
//     ['south', 'west'],   
//     ['east', 'midwest'], 
//   ] as [string, string][],
// };

export const CURRENT_TOURNAMENT_CONFIG = {
  year: 2026,
  regions: ['South', 'East', 'West', 'Midwest'],
  startDate: '20260319',  
  endDate: '20260407',   
  // End of day March 18, 2026 in America/New_York (EDT) -> 2026-03-19T03:59:59.999Z
  lockedTime: new Date('2026-03-19T03:59:59.999Z'),
  finalFourLocation: 'Indianapolis, Indiana',
  finalFourPairings: [
    ['south', 'east'],   
    ['west', 'midwest'], 
  ] as [string, string][],
};
// Helper to validate all regions have winners
export const validateRegionsComplete = (
  completedRegions: string[],
  config: TournamentConfig = CURRENT_TOURNAMENT_CONFIG
): boolean => {
  return config.regions.every(region => completedRegions.includes(region));
};


