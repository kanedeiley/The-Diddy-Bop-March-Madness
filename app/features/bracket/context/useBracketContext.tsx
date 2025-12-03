import { useContext, createContext } from "react";
import { cinderella, regionKeys, team } from "../types";

type Game = {
  id: string;
  team1?: team;
  team2?: team;
  winner?: team;
  round: number;
  position: number;
};

export type BracketContextType = {
  // Region selection
  selectedRegion: regionKeys;
  setSelectedRegion: React.Dispatch<React.SetStateAction<regionKeys>>;
  regionData: any;
  
  // Cinderella management
  selectedCinderellas: Record<string, cinderella | null>;
  setCinderellaForRegion: (region: string, item: cinderella | null) => void;
  selectedCinderella: cinderella | null;
  regionCinderellas: team[];
  
  // Game state
  regionalGames: Record<string, Game[]>;
  currentRegionGames: Game[];
  ensureRegionInitialized: (region: string) => void;
  
  // Winner management
  selectWinner: (region: string, gameId: string, winner: team) => void;
  regionWinners: Record<string, team | null>;
  currentRegionWinner: team | null;
  
  // Reset functions
  resetRegion: (region: string) => void;
  resetAllBrackets: () => void;

  // Final Four
  finalFourGames: Game[];
  nationalChampion: team | null;
  ensureFinalFourInitialized: () => void;
  selectFinalFourWinner: (gameId: string, winner: team) => void;
  areAllRegionsComplete: () => boolean;
  getRegionWinner: (regionKey: string) => team | null;
};

export const BracketContext = createContext<BracketContextType | undefined>(
  undefined
);

export const useBracketContext = () => {
  const context = useContext(BracketContext);
  if (context === undefined) {
    throw new Error("useBracketContext must be used within a BracketProvider");
  }
  return context;
};