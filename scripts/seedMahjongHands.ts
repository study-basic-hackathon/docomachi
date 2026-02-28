import fs from "node:fs/promises";
import path from "node:path";
import { Amplify } from "aws-amplify";
import { mahjongClient } from "../src/lib/mahjong/client";
import type { TileCode } from "../src/lib/mahjong/mahjongHand";

async function configureAmplify(): Promise<void> {
  const outputsPath = path.join(process.cwd(), "amplify_outputs.json");
  try {
    const raw = await fs.readFile(outputsPath, "utf8");
    const outputs = JSON.parse(raw) as Record<string, unknown>;
    Amplify.configure(outputs);
  } catch {
    throw new Error(
      "amplify_outputs.json not found or invalid. Run 'npx ampx sandbox' first and ensure the file exists.",
    );
  }
}

type SeedHand = {
  id?: string;
  tiles: string[];
  winningTiles: string[];
};

const ALLOWED_TILE_CODES: TileCode[] = [
  "1s","2s","3s","4s","5s","6s","7s","8s","9s",
  "1m","2m","3m","4m","5m","6m","7m","8m","9m",
  "1p","2p","3p","4p","5p","6p","7p","8p","9p",
  "ton","nan","sha","pe","haku","hatsu","chun",
];

function isValidTileCode(value: string): value is TileCode {
  return (ALLOWED_TILE_CODES as string[]).includes(value);
}

export async function loadSeedHands(
  filePath = path.join(process.cwd(), "doc/seed/mahjong_hands.json"),
): Promise<SeedHand[]> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as SeedHand[];
  return parsed;
}

export function validateSeedHand(hand: SeedHand): void {
  if (hand.tiles.length !== 13) {
    throw new Error(`tiles must have length 13, got ${hand.tiles.length}`);
  }
  for (const t of hand.tiles) {
    if (!isValidTileCode(t)) {
      throw new Error(`invalid tile code in tiles: ${t}`);
    }
  }
  for (const t of hand.winningTiles) {
    if (!isValidTileCode(t)) {
      throw new Error(`invalid tile code in winningTiles: ${t}`);
    }
  }
}

export async function seedMahjongHands(): Promise<number> {
  const hands = await loadSeedHands();

  let created = 0;
  for (const hand of hands) {
    validateSeedHand(hand);

    await mahjongClient.models.MahjongHand.create(
      {
        id: hand.id,
        tiles: hand.tiles as TileCode[],
        winningTiles: hand.winningTiles as TileCode[],
      },
      { authMode: "apiKey" },
    );
    created += 1;
  }

  return created;
}

if (require.main === module) {
  Promise.all([configureAmplify()])
    .then(() => seedMahjongHands())
    .then((count) => {
      // eslint-disable-next-line no-console
      console.log(`Seeded ${count} MahjongHand records`);
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Failed to seed MahjongHand records", err);
      process.exitCode = 1;
    });
}

