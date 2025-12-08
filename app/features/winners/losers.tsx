"use client";
import { Losers as podiumWinners } from '../winners';

// type Loser = {
//     name: string;
//     place: number;
//     wins: number;
//     pickedChampion: string;
//     imageUrl: string;
// };

// const podiumWinners: Loser[] = [
//     {
//         place: 4,
//         name: "Steve",
//         wins: 1,
//         pickedChampion: "Houston",
//         imageUrl: "/images/tarm.jpg",
//     },
//     {
//         place: 5,
//         name: "Robert",
//         wins: 3,
//         pickedChampion: "UConn",
//         imageUrl: "/images/tarm.jpg",
//     },
//     {
//         place: 6,
//         name: "Mathew",
//         wins: 1,
//         pickedChampion: "Purdue",
//         imageUrl: "/images/tarm.jpg",
//     },
//     {
//         place: 7,
//         name: "Steve",
//         wins: 1,
//         pickedChampion: "Houston",
//         imageUrl: "/images/tarm.jpg",
//     },
//     {
//         place: 8,
//         name: "Robert",
//         wins: 3,
//         pickedChampion: "UConn",
//         imageUrl: "/images/tarm.jpg",
//     },
//     {
//         place: 9,
//         name: "Mathew",
//         wins: 1,
//         pickedChampion: "Purdue",
//         imageUrl: "/images/tarm.jpg",
//     },

// ];

export default function PodiumLosers() {
    // Ensure they’re ordered 4,5,6 visually
    const ordered = podiumWinners.sort((a, b) => a.place - b.place);

    return (
        <div
            style={{
                padding: "1rem",
                textAlign: "center",
            }}
        >

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
                {ordered.map((loser) => (
                    <div
                        key={loser.place}
                        style={{
                            border: "2px solid #ccc",
                            borderRadius: "8px",
                            padding: "1rem",
                            width: "150px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <img
                            src={loser.imageUrl}
                            alt={loser.name}
                            style={{
                                width: "100%",
                                borderRadius: "50%",
                                marginBottom: "0.5rem",
                            }}
                        />
                        <h3 style={{ margin: "0.5rem 0" }}>{loser.name}</h3>
                        <p style={{ margin: "0.25rem 0" }}>
                            Wins: {loser.wins}
                        </p>
                        <p style={{ margin: "0.25rem 0" }}>
                            Picked Champion: {loser.pickedChampion}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}