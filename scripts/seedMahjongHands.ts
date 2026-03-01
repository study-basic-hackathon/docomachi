import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { Amplify } from "aws-amplify";
import { mahjongClient } from "../src/lib/mahjong/client";
import type { TileCode } from "../src/lib/mahjong/mahjongHand";

async function ensureProductionOutputs(outputsPath: string): Promise<void> {
  const appId = process.env.AMPLIFY_APP_ID;
  const branch = process.env.AMPLIFY_BRANCH ?? "main";
  if (!appId) {
    throw new Error(
      `amplify_outputs.production.json not found. Either create it with: npx ampx generate outputs --branch <branch> --app-id <app-id> (then copy the generated amplify_outputs.json to amplify_outputs.production.json)\n  or set AMPLIFY_APP_ID (and optionally AMPLIFY_BRANCH, default main) and run again to generate it automatically.`,
    );
  }
  // eslint-disable-next-line no-console
  console.log(
    `Generating amplify_outputs for branch=${branch}, app-id=${appId}...`,
  );
  execSync(
    `npx ampx generate outputs --branch ${branch} --app-id ${appId}`,
    { encoding: "utf8", maxBuffer: 1024 * 1024 },
  );
  // ampx は JSON を stdout に出さず、カレントディレクトリに amplify_outputs.json を書き込む
  const defaultPath = path.join(process.cwd(), "amplify_outputs.json");
  const raw = await fs.readFile(defaultPath, "utf8");
  await fs.writeFile(outputsPath, raw, "utf8");
}

async function configureAmplify(): Promise<void> {
  const outputsFileName =
    process.env.AMPLIFY_OUTPUTS_PATH ?? "amplify_outputs.json";
  const outputsPath = path.isAbsolute(outputsFileName)
    ? outputsFileName
    : path.join(process.cwd(), outputsFileName);

  let raw: string;
  try {
    raw = await fs.readFile(outputsPath, "utf8");
  } catch {
    if (outputsFileName.includes("production")) {
      await ensureProductionOutputs(outputsPath);
      raw = await fs.readFile(outputsPath, "utf8");
    } else {
      throw new Error(
        `${outputsFileName} not found. Run 'npx ampx sandbox' first, or for production see doc/seed/README.md.`,
      );
    }
  }

  try {
    const outputs = JSON.parse(raw) as Record<string, unknown>;
    Amplify.configure(outputs);
  } catch {
    const hint =
      outputsFileName.includes("production") && raw.includes("File written")
        ? " (ampx は JSON を stdout に出さないため、リダイレクト > ではメッセージだけ保存されます。代わりに: npx ampx generate outputs --branch <branch> --app-id <id> を実行し、生成された amplify_outputs.json を amplify_outputs.production.json にコピーしてください)"
        : "";
    throw new Error(
      `${outputsFileName} is invalid JSON. Re-generate with: npx ampx generate outputs --branch <branch> --app-id <id>, then copy the generated amplify_outputs.json to ${outputsFileName}.${hint}`,
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

