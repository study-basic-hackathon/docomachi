import type { MahjongHand } from "../mahjongHand";
import { validateMahjongHand } from "../validation";

function createHand(overrides: Partial<MahjongHand> = {}): MahjongHand {
  return {
    id: "test",
    tiles: Array(13).fill("1m"),
    winningTiles: ["9m"],
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
});

