import { BracketContext } from "./useBracketContext";
import useBracketHook from "../hooks/useBracketHook";

export const BracketProvider = ({ children }: { children: React.ReactNode }) => {
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
  } = useBracketHook();

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