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
  | { kind: "winningTilesInvalidCode"; code: string; message: string }
  | { kind: "tileCountExceeded"; code: string; count: number; message: string };

/** Hand-like object with at least tiles and winningTiles (e.g. seed JSON or MahjongHand). */
export type HandLike = { tiles: TileCode[]; winningTiles: TileCode[] };

function countTiles(tiles: TileCode[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tiles) {
    map.set(t, (map.get(t) ?? 0) + 1);
  }
  return map;
}

export function validateMahjongHand(hand: HandLike): ValidationIssue[] {
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

  const combined = [...hand.tiles, ...hand.winningTiles];
  const counts = countTiles(combined as TileCode[]);
  for (const [code, count] of counts) {
    if (count > 4) {
      issues.push({
        kind: "tileCountExceeded",
        code,
        count,
        message: `tile ${code} appears ${count} times (max 4 including winningTiles)`,
      });
    }
  }

  return issues;
}

