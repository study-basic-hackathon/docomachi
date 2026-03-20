import { findWinningTiles } from "./solveTenpai";

function test(label: string, tiles: string[]) {
  try {
    const wins = findWinningTiles(tiles);
    const freq: Record<string, number> = {};
    for (const t of tiles) freq[t] = (freq[t] || 0) + 1;
    const has4thIssue = wins.some(w => (freq[w] || 0) >= 3);
    const flag = has4thIssue ? " ⚠️4枚目" : " ✅safe";
    console.log(`${label}: ${wins.join(", ")} (${wins.length}面)${flag}`);
  } catch (e: any) {
    console.log(`${label}: ERROR - ${e.message}`);
  }
}

console.log("=== chinitsu-1 candidates (replace current) ===\n");

test("chi-E (1113445567899)",
  ["1m","1m","1m","3m","4m","4m","5m","5m","6m","7m","8m","9m","9m"]);

test("chi-P (1122334567789)",
  ["1m","1m","2m","2m","3m","3m","4m","5m","6m","7m","7m","8m","9m"]);

test("chi-Q (1233456677899)",
  ["1m","2m","3m","3m","4m","5m","6m","6m","7m","7m","8m","9m","9m"]);

test("chi-R (1234456678899)",
  ["1m","2m","3m","4m","4m","5m","6m","6m","7m","8m","8m","9m","9m"]);

test("chi-S (1223345567899)",
  ["1m","2m","2m","3m","3m","4m","5m","5m","6m","7m","8m","9m","9m"]);

console.log("\n=== chinitsu-5 candidates (replace current, want 5+面) ===\n");

test("chi-T (2344556677889)",
  ["2m","3m","4m","4m","5m","5m","6m","6m","7m","7m","8m","8m","9m"]);

test("chi-U (1223344556789)",
  ["1m","2m","2m","3m","3m","4m","4m","5m","5m","6m","7m","8m","9m"]);

test("chi-V (1234455667789)",
  ["1m","2m","3m","4m","4m","5m","5m","6m","6m","7m","7m","8m","9m"]);

test("chi-W (1234556677899)",
  ["1m","2m","3m","4m","5m","5m","6m","6m","7m","7m","8m","9m","9m"]);

test("chi-X (1233455677899)",
  ["1m","2m","3m","3m","4m","5m","5m","6m","7m","7m","8m","9m","9m"]);

test("chi-Y (1122344556789)",
  ["1m","1m","2m","2m","3m","4m","4m","5m","5m","6m","7m","8m","9m"]);

test("chi-Z (1234567788899)",
  ["1m","2m","3m","4m","5m","6m","7m","7m","8m","8m","8m","9m","9m"]);

test("chi-AA (1223456778899)",
  ["1m","2m","2m","3m","4m","5m","6m","7m","7m","8m","8m","9m","9m"]);

test("chi-AB (2334556677889)",
  ["2m","3m","3m","4m","5m","5m","6m","6m","7m","7m","8m","8m","9m"]);

test("chi-AC (1123344556789)",
  ["1m","1m","2m","3m","3m","4m","4m","5m","5m","6m","7m","8m","9m"]);

test("chi-AD (1234456677899)",
  ["1m","2m","3m","4m","4m","5m","6m","6m","7m","7m","8m","9m","9m"]);

test("chi-AE (1223344567899)",
  ["1m","2m","2m","3m","3m","4m","4m","5m","6m","7m","8m","9m","9m"]);

test("chi-AF (1123455667899)",
  ["1m","1m","2m","3m","4m","5m","5m","6m","6m","7m","8m","9m","9m"]);
