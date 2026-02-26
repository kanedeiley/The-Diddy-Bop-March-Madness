import { createClient } from "@supabase/supabase-js"

interface Player {
    id: string
    username: string
    wins: number
    avatar_url?: string
    pickedChampion?: string
}
export default async function PodiumLosers() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
        .from<"profile", Player>("profile")
        .select("*")
        .order("wins", { ascending: false })
        .range(3, 20)

    if (error) {
        console.error("Supabase fetch error:", error)
        return (
            <div className="p-4 text-center">
                <h2 className="mb-6 text-xl md:text-2xl font-semibold">Winners</h2>
                <p>Error loading players: {error.message}</p>
            </div>
        )
    }

    const podiumWinners = data ?? []


    const ordered = podiumWinners.sort((a, b) => a.place - b.place)

    return (
        <div className="p-4 text-center">
            <div className="flex justify-center items-end gap-6 max-w-4xl mx-auto flex-wrap">
                {ordered.map((loser) => (
                    <div
                        key={loser.id}
                        className="bg-gray-100 rounded-xl p-4 w-[150px] shadow-md border border-gray-200"
                    >
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-gray-300">
                            <img
                                src={loser.avatar_url ?? "/placeholder.png"}
                                alt={loser.username}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h3 className="font-semibold text-sm md:text-base mb-1">
                            {loser.username}
                        </h3>

                        <p className="text-xs md:text-sm text-gray-600">
                            Wins: <strong>{loser.wins}</strong>
                        </p>

                    </div>
                ))}
            </div>
        </div>
    )
}