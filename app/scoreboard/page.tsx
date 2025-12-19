import ScoreboardBoard from "../features/scoreboard/board"

const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "100vw",
    // backgroundImage: "url('https://i.imgur.com/EOcFqy1.png')",
    backgroundImage: "url('https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWo2ZnJvNzdxMnNrd3NyajE1bzNnbG1lZXFqMHA0eWppcmFxbGRtNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dpu95OTQ9rDPi/giphy.gif')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

function page() {
    return (
        <div style={pageStyle}>
            <ScoreboardBoard />
        </div>
    )
}

export default page