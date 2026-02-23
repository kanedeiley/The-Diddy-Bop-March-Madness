import { BracketContext } from "./useBracketContext";
import useBracketHook from "../hooks/useBracketHook";
import { TournamentTeam } from "@/app/lib/teams";
import { SavedBracket } from "../hooks/useBracketHook";

interface BracketProviderProps {
  children: React.ReactNode;
  teamsByRegion: Record<string, TournamentTeam[]>;
  savedBracket: SavedBracket | null;
}

export const BracketProvider = ({ 
  children, 
  teamsByRegion, 
  savedBracket 
}: BracketProviderProps) => {
  const bracketState = useBracketHook(teamsByRegion, savedBracket);

  return (
    <BracketContext.Provider value={bracketState}>
      {children}
    </BracketContext.Provider>
  );
};