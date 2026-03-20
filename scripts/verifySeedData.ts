/**
 * Validates doc/seed/mahjong_hands.json with extended rules (tile count ≤4, etc.).
 * Usage: npx tsx scripts/verifySeedData.ts
 */
import fs from "node:fs";
import path from "node:path";
import { validateMahjongHand } from "../src/lib/mahjong/validation";
import type { TileCode } from "../src/lib/mahjong/mahjongHand";

const SEED_PATH = path.join(process.cwd(), "doc/seed/mahjong_hands.json");

type SeedEntry = { id?: string; tiles: string[]; winningTiles: string[] };

function main(): void {
  const raw = fs.readFileSync(SEED_PATH, "utf8");
  const data = JSON.parse(raw) as SeedEntry[];

  let valid = 0;
  const failures: { id: string; issues: ReturnType<typeof validateMahjongHand> }[] = [];

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    const hand = { tiles: entry.tiles as TileCode[], winningTiles: entry.winningTiles as TileCode[] };
    const issues = validateMahjongHand(hand);
    const id = entry.id ?? `[${i}]`;
    if (issues.length === 0) {
      valid++;
    } else {
      failures.push({ id, issues });
    }
  }

  console.log(`Seed verification: total=${data.length}, valid=${valid}, invalid=${failures.length}`);
  for (const { id, issues } of failures) {
    console.log(`- ID=${id}`);
    for (const issue of issues) {
      console.log(`  - [${issue.kind}] ${issue.message}`);
    }
  }
  if (failures.length > 0) process.exitCode = 1;
}

main();
