"use client";

import { useState } from "react";
import Image from "next/image";
import type { TileCode } from "@/src/lib/mahjong/mahjongHand";

interface TileImageProps {
  tileCode: TileCode;
  className?: string;
  size?: number;
}

export function TileImage({ tileCode, className = "", size = 48 }: TileImageProps) {
  const [error, setError] = useState(false);
  const src = `/images/tiles/${tileCode}.gif`;

  if (error) {
    return (
      <div
        className={`flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-xs text-gray-500 ${className}`}
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
        title={tileCode}
      >
        読み込み失敗
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={tileCode}
      width={size}
      height={size}
      className={className}
      onError={() => setError(true)}
      unoptimized
    />
  );
}
