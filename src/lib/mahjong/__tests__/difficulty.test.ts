import { getDifficulty } from "../difficulty";
import type { TileCode } from "../mahjongHand";

describe("getDifficulty", () => {
  it("returns high for kokushi (13 unique terminals/honors)", () => {
    const tiles: TileCode[] = ["1m", "9m", "1p", "9p", "1s", "9s", "ton", "nan", "sha", "pe", "haku", "hatsu", "chun"];
    expect(getDifficulty({ tiles, winningTiles: ["1m"] })).toBe("high");
  });

  it("returns high for junsei churen (1112345678999m)", () => {
    const tiles: TileCode[] = ["1m", "1m", "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "9m", "9m"];
    expect(getDifficulty({ tiles, winningTiles: ["1m", "2m"] })).toBe("high");
  });

  it("returns high for chinitsu (all same suit)", () => {
    const tiles: TileCode[] = ["1m", "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "9m", "1m", "4m"];
    expect(getDifficulty({ tiles, winningTiles: ["4m", "7m"] })).toBe("high");
  });

  it("returns high for tanki (single wait)", () => {
    const tiles: TileCode[] = ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "1p", "2p", "3p", "5s"];
    expect(getDifficulty({ tiles, winningTiles: ["5s"] })).toBe("high");
  });

  it("returns high for 4+ waiting tiles", () => {
    const tiles: TileCode[] = ["2m", "3m", "4m", "2p", "3p", "4p", "2s", "3s", "4s", "5m", "5m"];
    expect(getDifficulty({ tiles, winningTiles: ["2m", "5m", "8m", "2p", "5p", "8p", "2s", "5s", "8s"] })).toBe("high");
  });

  it("returns middle for 2–3 waits and non-special shape", () => {
    const tiles: TileCode[] = ["1m", "1m", "2m", "3m", "4p", "4p", "4p", "5s", "5s", "5s", "6s", "6s", "6s"];
    expect(getDifficulty({ tiles, winningTiles: ["1m", "4m"] })).toBe("middle");
  });

  it("returns low for 2+ waits and basic shape when not chinitsu/kokushi/junsei", () => {
    const tiles: TileCode[] = ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "1p", "2p", "3p", "4p"];
    expect(getDifficulty({ tiles, winningTiles: ["5p"] })).toBe("high"); // tanki
    const tiles2: TileCode[] = ["1m", "1m", "2m", "3m", "4p", "4p", "4p", "5s", "5s", "5s", "6s", "6s", "6s"];
    expect(getDifficulty({ tiles: tiles2, winningTiles: ["1m", "4m"] })).toBe("middle");
  });
});
