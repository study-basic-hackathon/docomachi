import { getRandomMahjongHand } from "../randomHand";

jest.mock("../client", () => {
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
const { __listMock } = require("../client");

describe("getRandomMahjongHand", () => {
  beforeEach(() => {
    __listMock.mockReset();
  });

  it("returns null when there is no data", async () => {
    __listMock.mockResolvedValue({ data: [] });

    const result = await getRandomMahjongHand();
    expect(result).toBeNull();
  });

  it("returns one of the available hands", async () => {
    const hands = [
      {
        id: "1",
        tiles: Array(13).fill("1m"),
        winningTiles: ["9m"],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        tiles: Array(13).fill("1s"),
        winningTiles: ["9s"],
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
    ];
    __listMock.mockResolvedValue({ data: hands });

    const result = await getRandomMahjongHand();
    expect(result).not.toBeNull();
    expect(["1", "2"]).toContain(result!.id);
    expect(result!.tiles).toHaveLength(13);
  });
});

