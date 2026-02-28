"use client";

import { sortTilesForDisplay } from "@/src/lib/mahjong/sortTilesForDisplay";
import type { TileCode } from "@/src/lib/mahjong/mahjongHand";
import { TileImage } from "@/components/TileImage";

interface HandDisplayProps {
  tiles: TileCode[];
  tileSize?: number;
  className?: string;
}

export function HandDisplay({ tiles, tileSize = 48, className = "" }: HandDisplayProps) {
  const sorted = sortTilesForDisplay(tiles);
  return (
    <div className={`flex flex-wrap gap-1 items-center ${className}`}>
      {sorted.map((code, i) => (
        <TileImage key={`${code}-${i}`} tileCode={code} size={tileSize} />
      ))}
    </div>
  );
}
