/**
 * One-off: add difficulty to each problem in doc/seed/mahjong_hands.json.
 * Usage: npx tsx scripts/addDifficultyToSeed.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getDifficulty } from "../src/lib/mahjong/difficulty";
import type { TileCode } from "../src/lib/mahjong/mahjongHand";

const SEED_PATH = path.join(process.cwd(), "doc/seed/mahjong_hands.json");

type Entry = { id?: string; tiles: string[]; winningTiles: string[]; difficulty?: string };

const raw = fs.readFileSync(SEED_PATH, "utf8");
const data = JSON.parse(raw) as Entry[];

for (const entry of data) {
  const problem = { tiles: entry.tiles as TileCode[], winningTiles: entry.winningTiles as TileCode[] };
  entry.difficulty = getDifficulty(problem);
}

fs.writeFileSync(SEED_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`Added difficulty to ${data.length} problems.`);
