import type { MahjongHand, TileCode } from "./mahjongHand";

const ALLOWED_TILE_CODES: TileCode[] = [
  "1s","2s","3s","4s","5s","6s","7s","8s","9s",
  "1m","2m","3m","4m","5m","6m","7m","8m","9m",
  "1p","2p","3p","4p","5p","6p","7p","8p","9p",
  "ton","nan","sha","pe","haku","hatsu","chun",
];

function isValidTileCode(value: string): value is TileCode {
  return (ALLOWED_TILE_CODES as string[]).includes(value);
}

export type ValidationIssue =
  | { kind: "tilesLength"; message: string }
  | { kind: "tilesInvalidCode"; code: string; message: string }
  | { kind: "winningTilesInvalidCode"; code: string; message: string };

export function validateMahjongHand(hand: MahjongHand): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (hand.tiles.length !== 13) {
    issues.push({
      kind: "tilesLength",
      message: `tiles must have length 13, got ${hand.tiles.length}`,
    });
  }

  for (const t of hand.tiles) {
    if (!isValidTileCode(t)) {
      issues.push({
        kind: "tilesInvalidCode",
        code: t,
        message: `invalid tile code in tiles: ${t}`,
      });
    }
  }

  for (const t of hand.winningTiles) {
    if (!isValidTileCode(t)) {
      issues.push({
        kind: "winningTilesInvalidCode",
        code: t,
        message: `invalid tile code in winningTiles: ${t}`,
      });
    }
  }

  return issues;
}

