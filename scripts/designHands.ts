/**
 * Design and verify candidate hands for henso and chinitsu problems.
 * Prints the computed winning tiles for each candidate.
 */
import { findWinningTiles } from "./solveTenpai";

function test(label: string, tiles: string[]) {
  try {
    const wins = findWinningTiles(tiles);
    console.log(`${label} (${tiles.length} tiles): ${wins.join(", ") || "(not tenpai)"}`);
    console.log(`  tiles: ${tiles.join(" ")}`);
  } catch (e: any) {
    console.log(`${label}: ERROR - ${e.message}`);
  }
}

console.log("=== HENSO candidates ===\n");

// henso-1: 亜リャンメン + シャボ (111m + 23m + 123p + 44p + 123s)
test("henso-1 (亜リャンメン+シャボ)",
  ["1m","1m","1m","2m","3m","1p","2p","3p","4p","4p","1s","2s","3s"]);

// henso-2: 1112345 pattern in souzu
test("henso-2a (1112345s + 234m + 555p)",
  ["1s","1s","1s","2s","3s","4s","5s","2m","3m","4m","5p","5p","5p"]);

// henso-2: variation with 2223456
test("henso-2b (2223456s + 123m + 555p)",
  ["2s","2s","2s","3s","4s","5s","6s","1m","2m","3m","5p","5p","5p"]);

// henso-3: ノベタン (2345678 in souzu)
test("henso-3a (2345678s + 123m + 111p)",
  ["2s","3s","4s","5s","6s","7s","8s","1m","2m","3m","1p","1p","1p"]);

// henso-3: ノベタン variation (3456789)
test("henso-3b (3456789s + 123m + 111p)",
  ["3s","4s","5s","6s","7s","8s","9s","1m","2m","3m","1p","1p","1p"]);

// henso-4: 4445678 pattern
test("henso-4a (4445678m + 123p + 111s)",
  ["4m","4m","4m","5m","6m","7m","8m","1p","2p","3p","1s","1s","1s"]);

// henso-4: 7778899 pattern
test("henso-4b (7778899m + 123p + 111s)",
  ["7m","7m","7m","8m","8m","9m","9m","1p","2p","3p","1s","1s","1s"]);

// henso-5: Dual 亜リャンメン (111m 23m + 111p 23p + 456s)
test("henso-5a (dual 亜リャンメン)",
  ["1m","1m","1m","2m","3m","1p","1p","1p","2p","3p","4s","5s","6s"]);

// henso-5: 亜リャンメン + 中ぶくれ (1112m + 3445p + 678s + ??)
test("henso-5b (111m 23m + 44p + 567p + 11s)",
  ["1m","1m","1m","2m","3m","4p","4p","5p","6p","7p","1s","1s","1s"]);

// henso extra: 1112345 in manzu
test("henso-x1 (1112345m + 567p + 111s)",
  ["1m","1m","1m","2m","3m","4m","5m","5p","6p","7p","1s","1s","1s"]);

// henso extra: 111 23 + 111 23 pattern in different suits  
test("henso-x2 (111m 23m + 111s 23s + ton ton ton)",
  ["1m","1m","1m","2m","3m","1s","1s","1s","2s","3s","ton","ton","ton"]);

console.log("\n=== CHINITSU candidates ===\n");

// chinitsu candidates - all manzu
test("chi-A (1112344456789)",
  ["1m","1m","1m","2m","3m","4m","4m","4m","5m","6m","7m","8m","9m"]);

test("chi-B (1112234555789)",
  ["1m","1m","1m","2m","2m","3m","4m","5m","5m","5m","7m","8m","9m"]);

test("chi-C (1233345567899)",
  ["1m","2m","3m","3m","3m","4m","5m","5m","6m","7m","8m","9m","9m"]);

test("chi-D (2223456777899)",
  ["2m","2m","2m","3m","4m","5m","6m","7m","7m","7m","8m","9m","9m"]);

test("chi-E (1113445567899)",
  ["1m","1m","1m","3m","4m","4m","5m","5m","6m","7m","8m","9m","9m"]);

test("chi-F (1112345667899)",
  ["1m","1m","1m","2m","3m","4m","5m","6m","6m","7m","8m","9m","9m"]);

test("chi-G (2233445566789)",
  ["2m","2m","3m","3m","4m","4m","5m","5m","6m","6m","7m","8m","9m"]);

test("chi-H (1223344556789)",
  ["1m","2m","2m","3m","3m","4m","4m","5m","5m","6m","7m","8m","9m"]);

test("chi-I (1234555678999)",
  ["1m","2m","3m","4m","5m","5m","5m","6m","7m","8m","9m","9m","9m"]);

test("chi-J (1112223334567)",
  ["1m","1m","1m","2m","2m","2m","3m","3m","3m","4m","5m","6m","7m"]);

test("chi-K (1112223334445)",
  ["1m","1m","1m","2m","2m","2m","3m","3m","3m","4m","4m","4m","5m"]);

// Some more patterns
test("chi-L (1123456789999)",
  ["1m","1m","2m","3m","4m","5m","6m","7m","8m","9m","9m","9m","9m"]);

test("chi-M (2344455667788)",
  ["2m","3m","4m","4m","4m","5m","5m","6m","6m","7m","7m","8m","8m"]);

test("chi-N (1122334455699)",
  ["1m","1m","2m","2m","3m","3m","4m","4m","5m","5m","6m","9m","9m"]);

test("chi-O (1233344556789)",
  ["1m","2m","3m","3m","3m","4m","4m","5m","5m","6m","7m","8m","9m"]);
