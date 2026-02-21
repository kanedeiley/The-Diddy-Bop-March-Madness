import { BracketContext } from "./useBracketContext";
import useBracketHook from "../hooks/useBracketHook";
import { TournamentTeam } from "@/app/lib/teams";

interface BreacketProviderProps {
  children: React.ReactNode;
  teamsByRegion: Record<string, TournamentTeam[]>
}

export const BracketProvider = ({ children, teamsByRegion }: BreacketProviderProps) => {
  const {
    // Region selection
    selectedRegion,
    setSelectedRegion,
    regionData,
    
    // Cinderella management
    selectedCinderella,
    selectedCinderellas,
    setCinderellaForRegion,
    regionCinderellas,
    
    // Game state
    regionalGames,
    currentRegionGames,
    ensureRegionInitialized,
    
    // Winner management
    selectWinner,
    regionWinners,
    currentRegionWinner,
    
    // Reset functions
    resetRegion,
    resetAllBrackets,

    // Final Four
    finalFourGames,
    nationalChampion,
    ensureFinalFourInitialized,
    selectFinalFourWinner,
    areAllRegionsComplete,
    getRegionWinner,
  } = useBracketHook(teamsByRegion);

  return (
    <BracketContext.Provider
      value={{
        // Region selection
        selectedRegion,
        setSelectedRegion,
        regionData,
        
        // Cinderella management
        selectedCinderella,
        selectedCinderellas,
        setCinderellaForRegion,
        regionCinderellas,
        
        // Game state
        regionalGames,
        currentRegionGames,
        ensureRegionInitialized,
        
        // Winner management
        selectWinner,
        regionWinners,
        currentRegionWinner,
        
        // Reset functions
        resetRegion,
        resetAllBrackets,

        // Final Four
        finalFourGames,
        nationalChampion,
        ensureFinalFourInitialized,
        selectFinalFourWinner,
        areAllRegionsComplete,
        getRegionWinner,
      }}
    >
      {children}
    </BracketContext.Provider>
  );
};