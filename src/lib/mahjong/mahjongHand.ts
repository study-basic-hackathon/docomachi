export type TileCode =
  | "1s" | "2s" | "3s" | "4s" | "5s" | "6s" | "7s" | "8s" | "9s"
  | "1m" | "2m" | "3m" | "4m" | "5m" | "6m" | "7m" | "8m" | "9m"
  | "1p" | "2p" | "3p" | "4p" | "5p" | "6p" | "7p" | "8p" | "9p"
  | "ton" | "nan" | "sha" | "pe" | "haku" | "hatsu" | "chun";

export interface MahjongHand {
  id: string;
  tiles: TileCode[];
  winningTiles: TileCode[];
  createdAt: string;
  updatedAt: string;
}

