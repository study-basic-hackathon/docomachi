import { findWinningTiles } from "./solveTenpai";

function test(label: string, tiles: string[]) {
  try {
    const wins = findWinningTiles(tiles);
    const freq: Record<string, number> = {};
    for (const t of tiles) freq[t] = (freq[t] || 0) + 1;
    const has4thIssue = wins.some(w => (freq[w] || 0) >= 3);
    const flag = has4thIssue ? " ⚠️4枚目" : " ✅safe";
    console.log(`${label}: ${wins.join(", ")} (${wins.length}面)${flag}`);
    console.log(`  tiles: ${tiles.join(" ")}`);
  } catch (e: any) {
    console.log(`${label}: ERROR - ${e.message}`);
  }
}

console.log("=== Hands with triplets where triplet tile is NOT a winning tile ===\n");

// Pattern: triplet at edge + interesting middle
test("t1 (111-2345-5677-89)",
  ["1m","1m","1m","2m","3m","4m","5m","5m","6m","7m","7m","8m","9m"]);

test("t2 (111-2345-6-7788-9)",
  ["1m","1m","1m","2m","3m","4m","5m","6m","7m","7m","8m","8m","9m"]);

test("t3 (111-23-4556-7899)",
  ["1m","1m","1m","2m","3m","4m","5m","5m","6m","7m","8m","9m","9m"]);

test("t4 (11-2233-4556-789)",
  ["1m","1m","2m","2m","3m","3m","4m","5m","5m","6m","7m","8m","9m"]);

test("t5 (123-4455-66789-9)",
  ["1m","2m","3m","4m","4m","5m","5m","6m","6m","7m","8m","9m","9m"]);

test("t6 (12-33-4455-66-789)",
  ["1m","2m","3m","3m","4m","4m","5m","5m","6m","6m","7m","8m","9m"]);

test("t7 (1-2233-445-66-789)",
  ["1m","2m","2m","3m","3m","4m","4m","5m","6m","6m","7m","8m","9m"]);

test("t8 (123-44-55-667-899)",
  ["1m","2m","3m","4m","4m","5m","5m","6m","6m","7m","8m","9m","9m"]);

test("t9 (123-345-5667-899)",
  ["1m","2m","3m","3m","4m","5m","5m","6m","6m","7m","8m","9m","9m"]);

test("t10 (111-234-56-678-99)",
  ["1m","1m","1m","2m","3m","4m","5m","6m","6m","7m","8m","9m","9m"]);

// Triplets at both edges, interesting middle
test("t11 (111-234-567-89-99? impossible check)",
  ["1m","1m","1m","2m","3m","4m","5m","6m","7m","8m","9m","9m","9m"]);

test("t12 (11-234-45-678-999)",
  ["1m","1m","2m","3m","4m","4m","5m","6m","7m","8m","9m","9m","9m"]);

// More creative patterns
test("t13 (12-334-556-7-8899)",
  ["1m","2m","3m","3m","4m","5m","5m","6m","7m","8m","8m","9m","9m"]);

test("t14 (1-2234-556-78-899)",
  ["1m","2m","2m","3m","4m","5m","5m","6m","7m","8m","8m","9m","9m"]);

test("t15 (1-223-445-5678-99)",
  ["1m","2m","2m","3m","4m","4m","5m","5m","6m","7m","8m","9m","9m"]);

test("t16 (12-33-445-678-899)",
  ["1m","2m","3m","3m","4m","4m","5m","6m","7m","8m","8m","9m","9m"]);

test("t17 (1-2233-456-6-7899)",
  ["1m","2m","2m","3m","3m","4m","5m","6m","6m","7m","8m","9m","9m"]);

test("t18 (123-3445-56-7-899)",
  ["1m","2m","3m","3m","4m","4m","5m","5m","6m","7m","8m","9m","9m"]);

test("t19 (11-234-456-7-8899)",
  ["1m","1m","2m","3m","4m","4m","5m","6m","7m","8m","8m","9m","9m"]);

test("t20 (1-2234-556-7899)",
  ["1m","2m","2m","3m","4m","5m","5m","6m","7m","8m","9m","9m","9m"]);
