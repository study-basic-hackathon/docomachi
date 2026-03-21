"use client";

import { useRef } from "react";
import { TILES_DISPLAY_ORDER } from "@/src/lib/mahjong/sortTilesForDisplay";
import type { TileCode } from "@/src/lib/mahjong/mahjongHand";
import { TileImage } from "@/components/TileImage";
import { cn } from "@/lib/utils";

/** 萬子・索子・筒子・字牌の順でグループ化（色ごとに改行するため） */
const TILE_GROUPS: TileCode[][] = [
  TILES_DISPLAY_ORDER.filter((c) => c.endsWith("m")),
  TILES_DISPLAY_ORDER.filter((c) => c.endsWith("s")),
  TILES_DISPLAY_ORDER.filter((c) => c.endsWith("p")),
  TILES_DISPLAY_ORDER.filter((c) => !["m", "s", "p"].some((s) => String(c).endsWith(s))),
];

const TILE_LABELS: Record<TileCode, string> = {
  "1m": "1萬", "2m": "2萬", "3m": "3萬", "4m": "4萬", "5m": "5萬", "6m": "6萬", "7m": "7萬", "8m": "8萬", "9m": "9萬",
  "1p": "1筒", "2p": "2筒", "3p": "3筒", "4p": "4筒", "5p": "5筒", "6p": "6筒", "7p": "7筒", "8p": "8筒", "9p": "9筒",
  "1s": "1索", "2s": "2索", "3s": "3索", "4s": "4索", "5s": "5索", "6s": "6索", "7s": "7索", "8s": "8索", "9s": "9索",
  ton: "東", nan: "南", sha: "西", pe: "北", haku: "白", hatsu: "發", chun: "中",
};

interface AnswerPickerProps {
  selectedTiles: TileCode[];
  onChange: (selected: TileCode[]) => void;
  tileSize?: number;
  className?: string;
  selectedLabelClassName?: string;
  panelClassName?: string;
}

export function AnswerPicker({
  selectedTiles,
  onChange,
  tileSize = 40,
  className = "",
  selectedLabelClassName = "text-emerald-900",
  panelClassName = "bg-emerald-50",
}: AnswerPickerProps) {
  const latestSelectedRef = useRef<TileCode[]>(selectedTiles);
  latestSelectedRef.current = selectedTiles;

  const set = new Set(selectedTiles);

  const toggle = (code: TileCode) => {
    const prev = latestSelectedRef.current;
    const next = new Set(prev);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    onChange(Array.from(next));
  };

  const selectedLabels = selectedTiles
    .map((c) => TILE_LABELS[c] ?? c)
    .join("、");

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p
        className={cn(
          "min-h-5 text-sm",
          selectedLabelClassName,
          selectedTiles.length === 0 && "opacity-0"
        )}
        aria-live="polite"
      >
        {selectedTiles.length > 0 ? `選択中: ${selectedLabels}` : "選択中: "}
      </p>
      <div className={cn("rounded border border-emerald-700 p-2", panelClassName)}>
        {TILE_GROUPS.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className={cn("flex flex-wrap gap-1", groupIndex > 0 && "mt-2")}
          >
            {group.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => toggle(code)}
                className={cn(
                  "rounded border-2 transition focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer",
                  set.has(code)
                    ? "border-green-600 bg-green-100 ring-2 ring-green-500 ring-offset-1"
                    : "border-gray-200 hover:border-gray-400"
                )}
                aria-pressed={set.has(code)}
              >
                <span className="pointer-events-none block">
                  <TileImage tileCode={code} size={tileSize} />
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
