import type { MahjongHand } from "../../src/lib/mahjong/mahjongHand";
import { verifyMahjongHands } from "../verifyMahjongHands";

jest.mock("../../src/lib/mahjong/client", () => {
  const listMock = jest.fn();
  return {
    mahjongClient: {
      models: {
        MahjongHand: {
          list: listMock,
        },
      },
    },
    __listMock: listMock,
  };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { __listMock } = require("../../src/lib/mahjong/client");

describe("verifyMahjongHands", () => {
  beforeEach(() => {
    __listMock.mockReset();
  });

  it("reports all hands as valid when no issues", async () => {
    const hands: MahjongHand[] = [
      {
        id: "1",
        tiles: Array(13).fill("1m"),
        winningTiles: ["9m"],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    __listMock.mockResolvedValue({ data: hands });

    const summary = await verifyMahjongHands();
    expect(summary.total).toBe(1);
    expect(summary.valid).toBe(1);
    expect(summary.invalid).toBe(0);
    expect(summary.issues).toHaveLength(0);
  });

  it("reports invalid hands with issues", async () => {
    const hands: MahjongHand[] = [
      {
        id: "1",
        tiles: Array(12).fill("1m"),
        winningTiles: [],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    __listMock.mockResolvedValue({ data: hands });

    const summary = await verifyMahjongHands();
    expect(summary.total).toBe(1);
    expect(summary.valid).toBe(0);
    expect(summary.invalid).toBe(1);
    expect(summary.issues).toHaveLength(1);
  });
});

