export type PodiumWinner = {
    name: string;
    place: 1 | 2 | 3;
    wins: number;
    pickedChampion: string;
    imageUrl: string;
};

export type Loser = {
    name: string;
    place: number;
    wins: number;
    pickedChampion: string;
    imageUrl: string;
};


// Hardcoded for now – replace with DB data later
export const podiumWinners: PodiumWinner[] = [
    {
        place: 2,
        name: "Pop-Pop",
        wins: 43,
        pickedChampion: "Houston",
        imageUrl: "/images/pop-pop.png",
    },
    {
        place: 1,
        name: "Uncle Rob",
        wins: 1,
        pickedChampion: "UConn",
        imageUrl: "/images/uncle-rob.png",
    },
    {
        place: 3,
        name: "Uncle Steve",
        wins: 0,
        pickedChampion: "Purdue",
        imageUrl: "/images/uncle-steve.png",
    },

];


export const Losers: Loser[] = [
    {
        place: 4,
        name: "Grayson",
        wins: 0,
        pickedChampion: "Duke",
        imageUrl: "/images/grayson.jpg",
    },
    {
        place: 5,
        name: "Kane",
        wins: 0,
        pickedChampion: "UConn",
        imageUrl: "/images/kane.jpg",
    },
    {
        place: 6,
        name: "Mathew",
        wins: 0,
        pickedChampion: "Purdue",
        imageUrl: "/images/mathew.jpg",
    },
    {
        place: 7,
        name: "Drew",
        wins: 0,
        pickedChampion: "Houston",
        imageUrl: "/images/drew.jpg",
    },
    {
        place: 8,
        name: "Victoria",
        wins: 0,
        pickedChampion: "UConn",
        imageUrl: "/images/victoria.jpg",
    },

];