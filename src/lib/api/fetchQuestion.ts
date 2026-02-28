import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import type { TileCode } from "@/src/lib/mahjong/mahjongHand";

const LIST_MAHJONG_HANDS = `
  query ListMahjongHands($limit: Int, $nextToken: String) {
    listMahjongHands(limit: $limit, nextToken: $nextToken) {
      items { id tiles winningTiles createdAt updatedAt }
      nextToken
    }
  }
`;

export interface QuestionItem {
  id: string;
  tiles: TileCode[];
  winningTiles: TileCode[];
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchQuestion(): Promise<QuestionItem> {
  const outputs = await import("@/amplify_outputs.json").then((m) => m.default);
  const url = outputs?.data?.url;
  if (!url) {
    throw new Error("AppSync URL not configured (amplify_outputs.data.url)");
  }

  // 認証は別タスクで実装予定。未認証でもリクエストを送る（トークンがあれば付与）
  let token: string | undefined;
  try {
    const session = await fetchAuthSession();
    token = session.tokens?.idToken?.toString();
  } catch {
    token = undefined;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    // 未認証時: バックエンドの publicApiKey 用に API キーを送る（sandbox 再デプロイで outputs に api_key が入る）
    const apiKey = (outputs?.data as { api_key?: string })?.api_key;
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }
  }

  const { data } = await axios.post<{
    data?: {
      listMahjongHands?: {
        items?: QuestionItem[];
        nextToken?: string | null;
      };
    };
    errors?: Array<{ message: string }>;
  }>(
    url,
    {
      query: LIST_MAHJONG_HANDS,
      variables: { limit: 20 },
    },
    { headers }
  );

  if (data.errors?.length) {
    throw new Error(data.errors.map((e) => e.message).join("; "));
  }

  const items = data.data?.listMahjongHands?.items ?? [];
  if (items.length === 0) {
    throw new Error("No MahjongHand items returned");
  }

  const index = Math.floor(Math.random() * items.length);
  const item = items[index];
  return {
    id: item.id,
    tiles: item.tiles as TileCode[],
    winningTiles: item.winningTiles as TileCode[],
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
