import { Cinderella } from "@/app/components/icons"
import { Game, team } from "../../types"
import { useBracketContext } from "../../context/useBracketContext";
import Image from "next/image";
import { CURRENT_TOURNAMENT_CONFIG } from "@/app/config";

interface TeamCardProps {
  game: Game;
  teamNumber: 1 | 2;
}

function TeamCard({ game, teamNumber }: TeamCardProps) {
  const {
    selectWinner: selectWinnerFromContext,
    selectFinalFourWinner,
    selectedRegion,
    selectedCinderella
  } = useBracketContext();
  const currentTeam = teamNumber === 1 ? game.team1 : game.team2;
  const selectWinner = (game: Game, team: team) => {
      if (Date.now() > CURRENT_TOURNAMENT_CONFIG.lockedTime.getTime()) {
        return
  }
    if (selectedRegion === "final") {
      selectFinalFourWinner(game.id, team);
    } else {
      selectWinnerFromContext(selectedRegion, game.id, team);
    }
  };
  return (
    <div
      onClick={() => currentTeam && selectWinner(game, currentTeam)}
      className={`
        px-4 py-3 border-b border-gray-200 cursor-pointer
        transition-all flex items-center gap-2
        ${!currentTeam ? 'cursor-not-allowed' : ''}
        ${
          (selectedCinderella && currentTeam && selectedCinderella.id === currentTeam.id && game.winner?.id === currentTeam.id)
            ? 'bg-pink-100 font-semibold border-l-4 border-l-pink-500'
            : (game.winner?.id === currentTeam?.id
                ? 'bg-green-100 font-bold border-l-4 border-l-green-500'
                : 'hover:bg-gray-50')
        }
      `}
    >
      {currentTeam ? (
        <>
          <span className="text-xs font-semibold text-gray-500 w-6">
            {currentTeam.seed}
          </span>
          <Image width={20} height={20} alt=" " src={`https://a.espncdn.com/i/teamlogos/ncaa/500/${currentTeam.espnId}.png`} />
          <span className="text-sm flex-1 truncate">
            {currentTeam.name}
          </span>
          {(selectedCinderella && currentTeam && selectedCinderella.id === currentTeam.id && game.winner?.id === currentTeam.id) && (
            <Cinderella className='h-4 w-4' />
          )}
        </>
      ) : (
        <span className="text-sm text-gray-400 italic">TBD</span>
      )}
    </div>
  );
}

export default TeamCard;