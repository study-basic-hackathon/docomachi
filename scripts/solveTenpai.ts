/**
 * Mahjong tenpai solver.
 * Given 13 tiles, finds all winning tiles (待ち牌).
 * Supports: 4 mentsu + 1 jantai, 7 pairs (chiitoitsu), kokushi musou.
 */

const TILE_NAMES = [
  "1m","2m","3m","4m","5m","6m","7m","8m","9m",
  "1p","2p","3p","4p","5p","6p","7p","8p","9p",
  "1s","2s","3s","4s","5s","6s","7s","8s","9s",
  "ton","nan","sha","pe","haku","hatsu","chun",
];

const NAME_TO_IDX: Record<string, number> = {};
TILE_NAMES.forEach((name, i) => { NAME_TO_IDX[name] = i; });

function isNumberTile(idx: number): boolean {
  return idx < 27;
}

function canFormMentsu(freq: number[], startFrom: number, count: number): boolean {
  if (count === 0) {
    for (let i = startFrom; i < 34; i++) {
      if (freq[i] !== 0) return false;
    }
    return true;
  }

  let i = startFrom;
  while (i < 34 && freq[i] === 0) i++;
  if (i >= 34) return false;

  // Try triplet
  if (freq[i] >= 3) {
    freq[i] -= 3;
    if (canFormMentsu(freq, i, count - 1)) { freq[i] += 3; return true; }
    freq[i] += 3;
  }

  // Try sequence (only for number tiles, same suit, i%9 <= 6)
  if (isNumberTile(i) && i % 9 <= 6 && freq[i + 1] > 0 && freq[i + 2] > 0) {
    freq[i]--; freq[i + 1]--; freq[i + 2]--;
    if (canFormMentsu(freq, i, count - 1)) { freq[i]++; freq[i + 1]++; freq[i + 2]++; return true; }
    freq[i]++; freq[i + 1]++; freq[i + 2]++;
  }

  return false;
}

function isCompleteRegular(freq: number[]): boolean {
  const f = [...freq];
  for (let pair = 0; pair < 34; pair++) {
    if (f[pair] < 2) continue;
    f[pair] -= 2;
    if (canFormMentsu(f, 0, 4)) { f[pair] += 2; return true; }
    f[pair] += 2;
  }
  return false;
}

function isCompleteChiitoitsu(freq: number[]): boolean {
  let pairs = 0;
  for (let i = 0; i < 34; i++) {
    if (freq[i] === 2) pairs++;
    else if (freq[i] !== 0) return false;
  }
  return pairs === 7;
}

const KOKUSHI_TILES = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];

function isCompleteKokushi(freq: number[]): boolean {
  let pairFound = false;
  for (const t of KOKUSHI_TILES) {
    if (freq[t] === 2) {
      if (pairFound) return false;
      pairFound = true;
    } else if (freq[t] !== 1) {
      return false;
    }
  }
  let total = 0;
  for (let i = 0; i < 34; i++) total += freq[i];
  return total === 14 && pairFound;
}

function isComplete(freq: number[]): boolean {
  return isCompleteRegular(freq) || isCompleteChiitoitsu(freq) || isCompleteKokushi(freq);
}

function tilesToFreq(tiles: string[]): number[] {
  const freq = new Array(34).fill(0);
  for (const t of tiles) {
    const idx = NAME_TO_IDX[t];
    if (idx === undefined) throw new Error(`Unknown tile: ${t}`);
    freq[idx]++;
  }
  return freq;
}

export function findWinningTiles(tiles: string[]): string[] {
  if (tiles.length !== 13) throw new Error(`Expected 13 tiles, got ${tiles.length}`);
  const freq = tilesToFreq(tiles);
  const wins: string[] = [];

  for (let i = 0; i < 34; i++) {
    if (freq[i] >= 4) continue; // can't draw a 5th copy
    freq[i]++;
    if (isComplete(freq)) {
      wins.push(TILE_NAMES[i]);
    }
    freq[i]--;
  }
  return wins;
}

// --- CLI: verify mahjong_hands.json ---
if (require.main === module || process.argv[1]?.includes("solveTenpai")) {
  const fs = require("fs");
  const path = require("path");

  interface SeedHand {
    id: string;
    tiles: string[];
    winningTiles: string[];
    difficulty?: string;
  }

  const jsonPath = path.resolve(__dirname, "../doc/seed/mahjong_hands.json");
  const hands: SeedHand[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  let allCorrect = true;

  for (const hand of hands) {
    const computed = findWinningTiles(hand.tiles);
    const listed = [...hand.winningTiles].sort();
    const comp = [...computed].sort();

    const match = JSON.stringify(listed) === JSON.stringify(comp);
    if (!match) {
      allCorrect = false;
      console.log(`❌ ${hand.id}`);
      console.log(`   tiles:    ${hand.tiles.join(" ")}`);
      console.log(`   listed:   ${listed.join(", ")}`);
      console.log(`   computed: ${comp.join(", ")}`);
    } else {
      console.log(`✅ ${hand.id}: ${comp.join(", ")}`);
    }
  }

  console.log(allCorrect ? "\nAll hands correct!" : "\nSome hands have incorrect winning tiles.");
}
