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