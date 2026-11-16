
export type FabricPattern =
  | "batik"
  | "kawung"
  | "parang"
  | "floral"
  | "polkadot"
  | "plain";

export interface FabricPiece {
  id: string;
  pattern: FabricPattern;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface Artwork {
  name: string;
  author: string;
  pieces: FabricPiece[];
}
