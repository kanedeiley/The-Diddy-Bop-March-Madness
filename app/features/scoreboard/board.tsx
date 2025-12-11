export default function ScoreboardBoard() {
    type Player = {
        name: string;
        picture: string;
        score: number;
        winnersPredicted: number;
        championPredicted: string;
    };

    const players: Player[] = [
        { name: "Uncle Rob", picture: "https://roaundehzzooxheewfec.supabase.co/storage/v1/object/public/profile-photos/public/Screenshot%202025-12-11%20at%201.46.04%20PM.png", score: 150, winnersPredicted: 5, championPredicted: "UConn" },
        { name: "Pop-Pop", picture: "", score: 120, winnersPredicted: 4, championPredicted: "Houston" },
        { name: "Uncle Steve", picture: "", score: 100, winnersPredicted: 3, championPredicted: "Purdue" },
        { name: "Grayson", picture: "", score: 80, winnersPredicted: 2, championPredicted: "Duke" },
        { name: "Kane", picture: "", score: 60, winnersPredicted: 1, championPredicted: "Duke" },
        { name: "Drew", picture: "", score: 40, winnersPredicted: 0, championPredicted: "Duke" },
        { name: "Matt", picture: "", score: 20, winnersPredicted: 0, championPredicted: "Kansas" },
        { name: "Victoria", picture: "", score: 10, winnersPredicted: 0, championPredicted: "Duke" },
    ];

    const containerStyle: React.CSSProperties = {
        fontFamily: "'Press Start 2P', cursive, sans-serif",
        padding: "20px",
        background: "linear-gradient(to bottom, #ffd700, #ff8c00)",
        borderRadius: "12px",
        maxWidth: "800px",
        margin: "20px auto",
        color: "#fff",
        textAlign: "center",
        boxShadow: "0 0 20px #000",
    };

    const titleStyle: React.CSSProperties = {
        fontSize: "2rem",
        marginBottom: "20px",
        textShadow: "2px 2px #000",
    };

    const tableStyle: React.CSSProperties = {
        width: "100%",
        borderCollapse: "collapse",
    };

    const thStyle: React.CSSProperties = {
        backgroundColor: "#ff0000",
        padding: "10px",
        border: "2px solid #000",
        textShadow: "1px 1px #000",
    };

    const getRowStyle = (index: number): React.CSSProperties => {
        const colors = ["#ffd700", "#c0c0c0", "#cd7f32", "#1e90ff", "#ff69b4"];
        return {
            backgroundColor: colors[index] || "#333",
            color: "#fff",
            fontWeight: "bold",
            border: "2px solid #000",
            textShadow: "1px 1px #000",
        };
    };

    const tdStyle: React.CSSProperties = {
        padding: "8px",
        border: "2px solid #000",
    };

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>🏁 Mario Kart Scoreboard</h1>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Player</th>
                        <th style={thStyle}>Picture</th>
                        <th style={thStyle}>Score</th>
                        <th style={thStyle}>Winners Predicted</th>
                        <th style={thStyle}>Champion Predicted</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player, index) => (
                        <tr key={index} style={getRowStyle(index)}>
                            <td style={tdStyle}>{player.name}</td>
                            <td style={tdStyle}><img src={player.picture} alt={player.name} style={{ width: "40px", height: "40px", borderRadius: "50%" }} /></td>
                            <td style={tdStyle}>{player.score}</td>
                            <td style={tdStyle}>{player.winnersPredicted}</td>
                            <td style={tdStyle}>{player.championPredicted}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
