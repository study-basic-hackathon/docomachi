/**
 * listRandomMahjongHands: DynamoDB MahjongHand テーブルを Scan し、ランダムに limit 件返す。
 * 契約: specs/006-10-questions-quiz/contracts/quiz-10-questions-api.md
 * テーブル名は SSM パラメータストアから取得（backend でテーブル作成後に保存、循環依存回避）。
 */
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import type { Schema } from "../../data/resource.js";

type ListRandomMahjongHandsItem = {
  id: string;
  tiles: string[];
  winningTiles: string[];
  createdAt: string;
  updatedAt: string;
};

const dynamoClient = new DynamoDBClient({});
const ssmClient = new SSMClient({});

/** 実行コンテキスト再利用時に SSM を繰り返し読まないようキャッシュ（冷起動時のみ取得） */
let cachedTableName: string | null = null;

async function resolveMahjongHandTableName(): Promise<string> {
  if (cachedTableName) return cachedTableName;
  const paramName = process.env.MAHJONG_HAND_TABLE_NAME_SSM;
  if (!paramName) throw new Error("MAHJONG_HAND_TABLE_NAME_SSM is not set");
  const out = await ssmClient.send(new GetParameterCommand({ Name: paramName }));
  const name = out.Parameter?.Value;
  if (!name) throw new Error(`SSM parameter ${paramName} has no value`);
  cachedTableName = name;
  return name;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function fromDynamoItem(
  item: Record<string, { S?: string; L?: Array<{ S?: string }> }>
): ListRandomMahjongHandsItem {
  const tiles = item.tiles?.L?.map((t) => t.S ?? "") ?? [];
  const winningTiles = item.winningTiles?.L?.map((t) => t.S ?? "") ?? [];
  return {
    id: item.id?.S ?? "",
    tiles,
    winningTiles,
    createdAt: item.createdAt?.S ?? "",
    updatedAt: item.updatedAt?.S ?? "",
  };
}

export const handler: Schema["listRandomMahjongHands"]["functionHandler"] = async (event) => {
  const limit = Math.min(Math.max(1, event.arguments.limit ?? 10), 100);
  const tableName = await resolveMahjongHandTableName();

  const result = await dynamoClient.send(
    new ScanCommand({
      TableName: tableName,
      Limit: Math.max(limit, 100),
    })
  );

  const items = (result.Items ?? []).map((item: Record<string, { S?: string; L?: Array<{ S?: string }> }>) =>
    fromDynamoItem(item)
  );
  const shuffled = shuffle(items);
  const selected: ListRandomMahjongHandsItem[] = shuffled.slice(0, limit);

  return { items: selected };
};
