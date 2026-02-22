import { Cinderella } from "@/app/components/icons"
import { Game, team} from "../../types"
import { useBracketContext } from "../../context/useBracketContext";

interface TeamCardProps  {
game: Game,
}

function TeamCard1({game}: TeamCardProps) {
  const {
    selectWinner: selectWinnerFromContext,
    selectFinalFourWinner,
    selectedRegion,
    selectedCinderella
  } = useBracketContext();

  const selectWinner = (game: Game, team: team) => {
    if (selectedRegion === "final") {
      selectFinalFourWinner(game.id, team);
    } else {
      selectWinnerFromContext(selectedRegion, game.id, team);
    }
  };
  return (
            <div
                  onClick={() => game.team1 && selectWinner(game, game.team1)}
                className={`
                    px-3 py-2 border-b border-gray-200 cursor-pointer
                    transition-all flex items-center
                    ${!game.team1 ? 'cursor-not-allowed' : ''}
                    ${
                      (selectedCinderella && game.team1 && selectedCinderella.id === game.team1.id && game.winner?.id === game.team1.id)
                        ? 'bg-pink-100 font-semibold border-l-4 border-l-pink-500'
                        : (game.winner?.id === game.team1?.id
                            ? 'bg-green-100 font-bold border-l-4 border-l-green-500'
                            : 'hover:bg-gray-50')
                    }
                  `}
                >
                  {game.team1 ? (
                    <>
                      <span className="text-xs font-semibold text-gray-500 mr-2 w-6">
                        {game.team1.seed}
                      </span>
                      <span className="text-sm flex-1 truncate">
                        {game.team1.name}
                      </span>
                      {(selectedCinderella && game.team1 && selectedCinderella.id === game.team1.id && game.winner?.id === game.team1.id) && (
                        <Cinderella className='h-4 w-4' />
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-400 italic">TBD</span>
                  )}
                </div>
  )
}

export default TeamCard1