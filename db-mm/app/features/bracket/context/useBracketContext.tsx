import { useContext, createContext } from "react";
import { cinderella, regionKeys } from "../types";

export type BracketContextType = {
  selectedRegion: regionKeys,
  setSelectedRegion: React.Dispatch<React.SetStateAction<regionKeys>>,
  regionData: any,
  selectedCinderellas: Record<string, cinderella | null>,
  setCinderellaForRegion: (region: string, item: cinderella | null) => void;
  selectedCinderella: cinderella | null
};

export const BracketContext = createContext<BracketContextType | undefined>(
  undefined
);

export const useBracketContext = () => {
  const context = useContext(BracketContext);
  if (context === undefined) {
    throw new Error("useBracketContext must be used within a QueueProvider");
  }
  return context;
};
