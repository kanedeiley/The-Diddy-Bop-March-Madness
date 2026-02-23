"use client";
import { useEffect, useState } from "react";

export default function ScoreboardBoard() {
    type Player = {
        name: string;
        picture: string;
        score: number;
        winnersPredicted: number;
        championPredicted: string;
    };

    const players: Player[] = [
        {
            name: "Uncle Rob",
            picture:
                "https://roaundehzzooxheewfec.supabase.co/storage/v1/object/public/profile-photos/public/Screenshot%202025-12-11%20at%201.46.04%20PM.png",
            score: 150,
            winnersPredicted: 5,
            championPredicted: "UConn",
        },
        { name: "Pop-Pop", picture: "", score: 120, winnersPredicted: 4, championPredicted: "Houston" },
        { name: "Uncle Steve", picture: "", score: 100, winnersPredicted: 3, championPredicted: "Purdue" },
        { name: "Grayson", picture: "", score: 80, winnersPredicted: 2, championPredicted: "Duke" },
        { name: "Kane", picture: "", score: 60, winnersPredicted: 1, championPredicted: "Duke" },
        { name: "Drew", picture: "", score: 40, winnersPredicted: 0, championPredicted: "Duke" },
        { name: "Matt", picture: "", score: 20, winnersPredicted: 0, championPredicted: "Kansas" },
        { name: "Victoria", picture: "", score: 10, winnersPredicted: 0, championPredicted: "Duke" },
    ];

    // ✅ Mobile detection (safe for Next.js)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const containerStyle: React.CSSProperties = {
        width: "100%",
        maxWidth: "900px",
        padding: isMobile ? "12px" : "24px",
        color: "#fff",
        fontFamily: "'Press Start 2P', sans-serif",
    };

    const overlayStyle: React.CSSProperties = {
        background: "rgba(0, 0, 0, 0.36)",
        backdropFilter: "blur(6px)",
        borderRadius: "16px",
        padding: isMobile ? "12px" : "20px",
    };

    const titleStyle: React.CSSProperties = {
        color: "#ffd700",
        fontSize: isMobile ? "1rem" : "1.6rem",
        marginBottom: "16px",
        textShadow: "3px 3px 0 #000",
    };

    const gridColumns = isMobile
        ? "32px 1fr 60px"
        : "40px 1fr 80px 120px 160px";

    const rowStyle = (index: number): React.CSSProperties => ({
        display: "grid",
        gridTemplateColumns: gridColumns,
        alignItems: "center",
        gap: isMobile ? "6px" : "12px",
        padding: isMobile ? "8px 10px" : "10px 14px",
        marginBottom: "8px",
        borderRadius: "12px",
        background:
            index === 0
                ? "linear-gradient(90deg, rgba(255,215,0,0.9), rgba(255,165,0,0.7))"
                : "rgba(255,255,255,0.12)",
        fontSize: isMobile ? "0.6rem" : "0.9rem",
        textShadow: "1px 1px 2px #000",
    });

    const headerStyle: React.CSSProperties = {
        ...rowStyle(-1),
        background: "rgba(0,0,0,0.6)",
        fontWeight: "bold",
    };

    const avatarStyle: React.CSSProperties = {
        width: isMobile ? "24px" : "32px",
        height: isMobile ? "24px" : "32px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #fff",
    };

    return (
        <div style={containerStyle}>
            <div style={overlayStyle}>
                <h1 style={titleStyle}>🏁 Mario Kart Leaderboard</h1>

                {/* Header */}
                <div style={headerStyle}>
                    <div>#</div>
                    <div>Player</div>
                    <div>Score</div>
                    {!isMobile && <div>Winners</div>}
                    {!isMobile && <div>Champion</div>}
                </div>

                {/* Rows */}
                {players.map((player, index) => (
                    <div key={index} style={rowStyle(index)}>
                        <div>{index + 1}</div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <img
                                src={player.picture || "/default-avatar.png"}
                                alt={player.name}
                                style={avatarStyle}
                            />
                            {player.name}
                        </div>

                        <div>{player.score}</div>

                        {!isMobile && <div>{player.winnersPredicted}</div>}
                        {!isMobile && <div>{player.championPredicted}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
