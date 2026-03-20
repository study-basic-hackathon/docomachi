/**
 * Difficulty judgment for mahjong quiz problems.
 * Criteria: data-model.md 難易度判定基準.
 */
import type { TileCode } from "./mahjongHand";

const MANZU = new Set(["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m"]);
const TERMINALS_AND_HONORS = new Set([
  "1m", "9m", "1p", "9p", "1s", "9s",
  "ton", "nan", "sha", "pe", "haku", "hatsu", "chun",
]);

export type Difficulty = "low" | "middle" | "high";

export interface ProblemForDifficulty {
  tiles: TileCode[];
  winningTiles: TileCode[];
  id?: string;
}

function uniqueWinningCount(winningTiles: TileCode[]): number {
  return new Set(winningTiles).size;
}

function isKokushi(tiles: TileCode[]): boolean {
  if (tiles.length !== 13) return false;
  const set = new Set(tiles);
  if (set.size !== 13) return false;
  return Array.from(set).every((t) => TERMINALS_AND_HONORS.has(t));
}

function isJunseiChuren(tiles: TileCode[]): boolean {
  if (tiles.length !== 13) return false;
  const m = tiles.filter((t) => t.endsWith("m"));
  if (m.length !== 13) return false;
  const sorted = m.map((t) => t.charAt(0)).sort().join("");
  return sorted === "1112345678999" || sorted === "1111234567899";
}

function isChinitsu(tiles: TileCode[]): boolean {
  if (tiles.length !== 13) return false;
  const suit = tiles[0]?.charAt(1);
  return tiles.every((t) => t.charAt(1) === suit);
}

export function getDifficulty(problem: ProblemForDifficulty): Difficulty {
  const waitCount = uniqueWinningCount(problem.winningTiles);

  if (waitCount === 1) return "high";
  if (waitCount >= 4) return "high";
  if (isKokushi(problem.tiles)) return "high";
  if (isJunseiChuren(problem.tiles)) return "high";
  if (isChinitsu(problem.tiles)) return "high";

  if (waitCount === 2 || waitCount === 3) return "middle";
  return "low";
}
