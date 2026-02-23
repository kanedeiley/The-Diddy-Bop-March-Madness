// bracket/types/index.ts
export interface team {
  id: string;
  name: string;
  seed: number;
  region: string;
  espnId: string; 
}

export interface cinderella {
  id: string;
  name: string;
  seed: number;
  espnId: string;  
}

export type regionKeys = "south" | "west" | "midwest" | "east" | "final";

export type Game = {
  id: string;
  team1?: team;
  team2?: team;
  winner?: team;
  round: number;
  position: number;
};