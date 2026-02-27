import { mahjongClient } from "./client";
import type { MahjongHand } from "./mahjongHand";

export async function getRandomMahjongHand(): Promise<MahjongHand | null> {
  const result = await mahjongClient.models.MahjongHand.list();

  const items = result.data ?? [];
  if (items.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * items.length);
  const picked = items[index];

  return {
    id: picked.id,
    tiles: picked.tiles as MahjongHand["tiles"],
    winningTiles: picked.winningTiles as MahjongHand["winningTiles"],
    createdAt: picked.createdAt,
    updatedAt: picked.updatedAt,
  };
}

