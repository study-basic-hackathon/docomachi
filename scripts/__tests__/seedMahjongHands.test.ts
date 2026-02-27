import { validateSeedHand } from "../seedMahjongHands";

describe("validateSeedHand", () => {
  it("passes for valid hand", () => {
    expect(() =>
      validateSeedHand({
        tiles: Array(13).fill("1m"),
        winningTiles: ["9m"],
      }),
    ).not.toThrow();
  });

  it("fails when tiles length is not 13", () => {
    expect(() =>
      validateSeedHand({
        tiles: Array(12).fill("1m"),
        winningTiles: [],
      }),
    ).toThrow(/tiles must have length 13/);
  });

  it("fails when tiles contain invalid code", () => {
    expect(() =>
      validateSeedHand({
        tiles: ["1z", ...Array(12).fill("1m")],
        winningTiles: [],
      }),
    ).toThrow(/invalid tile code in tiles/);
  });

  it("fails when winningTiles contain invalid code", () => {
    expect(() =>
      validateSeedHand({
        tiles: Array(13).fill("1m"),
        winningTiles: ["1z"],
      }),
    ).toThrow(/invalid tile code in winningTiles/);
  });
});

