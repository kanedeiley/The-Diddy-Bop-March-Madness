
import { BracketContext } from "./useBracketContext";
import useBracketHook from "../hooks/useBracketHook"

export const BracketProvider = ({ children }: { children: React.ReactNode }) => {
  const {
selectedRegion,
setSelectedRegion,
regionData,
selectedCinderella,
selectedCinderellas,
setCinderellaForRegion
  } = useBracketHook();
  return (
    <BracketContext.Provider
      value={{
        selectedRegion,
        setSelectedRegion,
        regionData,
        selectedCinderella,
        selectedCinderellas,
        setCinderellaForRegion
      }}
    >
      {children}
    </BracketContext.Provider>
  );
};

