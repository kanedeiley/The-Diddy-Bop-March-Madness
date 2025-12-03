// PodiumWinners.tsx
"use client";

type PodiumWinner = {
    name: string;
    place: 1 | 2 | 3;
    wins: number;
    pickedChampion: string;
    imageUrl: string;
};

// Hardcoded for now – replace with DB data later
const podiumWinners: PodiumWinner[] = [
    {
        place: 2,
        name: "Sarah",
        wins: 1,
        pickedChampion: "Houston",
        imageUrl: "/images/sarah.png",
    },
    {
        place: 1,
        name: "John",
        wins: 3,
        pickedChampion: "UConn",
        imageUrl: "/images/john.png",
    },
    {
        place: 3,
        name: "Mike",
        wins: 1,
        pickedChampion: "Purdue",
        imageUrl: "/images/mike.png",
    },
];

export default function PodiumWinners() {
    // Ensure they’re ordered 2,1,3 visually
    const ordered = podiumWinners.sort((a, b) => a.place - b.place);

    return (
        <div
            style={{
                padding: "1rem",
                textAlign: "center",
            }}
        >
            <h2 style={{ marginBottom: "1.5rem" }}>Top Bracket Winners</h2>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    gap: "1.5rem",
                    maxWidth: "800px",
                    margin: "0 auto",
                }}
            >
                {ordered.map((w) => {
                    const isFirst = w.place === 1;
                    const height = isFirst ? 200 : 150;

                    return (
                        <div
                            key={w.place}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                flex: 1,
                                maxWidth: "200px",
                            }}
                        >
                            {/* Winner info card */}
                            <div
                                style={{
                                    background: "#f4f4f4",
                                    padding: "0.75rem",
                                    borderRadius: "0.75rem",
                                    marginBottom: "0.75rem",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                                    width: "100%",
                                }}
                            >
                                <div
                                    style={{
                                        width: isFirst ? 96 : 80,
                                        height: isFirst ? 96 : 80,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        margin: "0 auto 0.5rem",
                                        border: isFirst ? "3px solid gold" : "2px solid #ccc",
                                    }}
                                >
                                    <img
                                        src={w.imageUrl}
                                        alt={w.name}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                                <div style={{ fontWeight: 600 }}>{w.name}</div>
                                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                                    Place: {w.place}
                                </div>
                                <div style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
                                    Wins: <strong>{w.wins}</strong>
                                </div>
                                <div style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
                                    Picked: <strong>{w.pickedChampion}</strong>
                                </div>
                            </div>

                            {/* Podium block */}
                            <div
                                style={{
                                    width: "100%",
                                    height,
                                    background:
                                        w.place === 1
                                            ? "linear-gradient(to top, #ffd700, #ffe680)"
                                            : w.place === 2
                                                ? "linear-gradient(to top, #c0c0c0, #e5e5e5)"
                                                : "linear-gradient(to top, #cd7f32, #f0c193)",
                                    borderRadius: "0.75rem 0.75rem 0 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: "1.25rem",
                                }}
                            >
                                #{w.place}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
