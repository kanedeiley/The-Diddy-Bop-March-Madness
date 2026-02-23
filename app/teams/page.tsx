import Image from "next/image"
import { getTeams, getScoreboard } from "../lib/espn"

async function page() {
  const results = await getTeams();
  
  return (
    <div className="flex flex-col p-20 gap-4">
        <p>Showing {results.length} teams</p>
        {results.map((team) => (
        <span className="flex items-center border-gray-300 py-2 gap-4 px-10 border rounded" key={team.id}>
            {team.logos[0] && (
              <Image 
                className="h-10 w-10" 
                src={team.logos[0].href} 
                alt={team.displayName}
                width={40}
                height={40}
              />
            )}
            <p>{team.displayName}</p>
            <p>{team.id}</p>
             <a href={team.links[0].href}>{team.links[1].shortText}</a>
        </span>
        ))}
        
    </div>
  )
}

export default page