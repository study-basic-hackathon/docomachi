import type { MahjongHand } from "../mahjongHand";
import { validateMahjongHand } from "../validation";

function createHand(overrides: Partial<MahjongHand> = {}): MahjongHand {
  return {
    id: "test",
    tiles: ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "1p", "2p", "3p", "4p"],
    winningTiles: ["5p"],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("validateMahjongHand", () => {
  it("returns empty issues for valid hand", () => {
    const hand = createHand();
    const issues = validateMahjongHand(hand);
    expect(issues).toHaveLength(0);
  });

  it("detects invalid tiles length", () => {
    const hand = createHand({ tiles: Array(12).fill("1m") });
    const issues = validateMahjongHand(hand);
    expect(issues.some((i) => i.kind === "tilesLength")).toBe(true);
  });

  it("detects invalid tile codes in tiles", () => {
    const hand = createHand({ tiles: ["1z", ...Array(12).fill("1m")] });
    const issues = validateMahjongHand(hand);
    expect(issues.some((i) => i.kind === "tilesInvalidCode")).toBe(true);
  });

  it("detects invalid tile codes in winningTiles", () => {
    const hand = createHand({ winningTiles: ["1z"] });
    const issues = validateMahjongHand(hand);
    expect(issues.some((i) => i.kind === "winningTilesInvalidCode")).toBe(true);
  });

  it("detects same tile more than 4 times (tiles + winningTiles combined)", () => {
    const hand = createHand({
      tiles: ["1m", "1m", "1m", "1m", "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m"],
      winningTiles: ["1m"],
    });
    const issues = validateMahjongHand(hand);
    expect(issues.some((i) => i.kind === "tileCountExceeded")).toBe(true);
    const tileIssue = issues.find((i) => i.kind === "tileCountExceeded");
    expect(tileIssue).toBeDefined();
    if (tileIssue && tileIssue.kind === "tileCountExceeded") {
      expect(tileIssue.code).toBe("1m");
      expect(tileIssue.count).toBe(6);
    }
  });

  it("passes when same tile appears 4 times in tiles and 0 in winningTiles", () => {
    const hand = createHand({
      tiles: ["1m", "1m", "1m", "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "1p"],
      winningTiles: ["2p"],
    });
    const issues = validateMahjongHand(hand);
    expect(issues.some((i) => i.kind === "tileCountExceeded")).toBe(false);
  });
});

