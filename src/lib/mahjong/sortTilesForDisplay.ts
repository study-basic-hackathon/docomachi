import type { TileCode } from "./mahjongHand";

/** 萬子→索子→筒子→字牌（東南西北白發中）の表示順。解答ピッカーで全種類表示にも利用 */
export const TILES_DISPLAY_ORDER: TileCode[] = [
  "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m",
  "1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s",
  "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p",
  "ton", "nan", "sha", "pe", "haku", "hatsu", "chun",
];

const orderIndex = new Map<TileCode, number>(
  TILES_DISPLAY_ORDER.map((code, i) => [code, i])
);

/**
 * 手牌を萬・索・筒・字の表示順にソートする。
 * 未知の牌コードは末尾に並べる。
 */
export function sortTilesForDisplay(tiles: TileCode[]): TileCode[] {
  return [...tiles].sort((a, b) => {
    const ia = orderIndex.get(a as TileCode) ?? 999;
    const ib = orderIndex.get(b as TileCode) ?? 999;
    return ia - ib;
  });
}
