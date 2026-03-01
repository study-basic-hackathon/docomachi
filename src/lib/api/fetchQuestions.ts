import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import type { TileCode } from "@/src/lib/mahjong/mahjongHand";

const LIST_RANDOM_MAHJONG_HANDS = `
  query ListRandomMahjongHands($limit: Int!) {
    listRandomMahjongHands(limit: $limit) {
      items { id tiles winningTiles createdAt updatedAt }
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

const REQUIRED_COUNT = 10;

/**
 * バックエンドからランダムに10問取得する。10件未満の場合はエラー。
 * 契約: specs/006-10-questions-quiz/contracts/quiz-10-questions-api.md
 */
export async function fetchQuestions(): Promise<QuestionItem[]> {
  const outputs = await import("@/amplify_outputs.json").then((m) => m.default);
  const url = outputs?.data?.url;
  if (!url) {
    throw new Error("AppSync URL not configured (amplify_outputs.data.url)");
  }

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
    const apiKey = (outputs?.data as { api_key?: string })?.api_key;
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }
  }

  const { data } = await axios.post<{
    data?: {
      listRandomMahjongHands?: {
        items?: Array<{
          id: string;
          tiles: string[];
          winningTiles: string[];
          createdAt?: string;
          updatedAt?: string;
        }>;
      };
    };
    errors?: Array<{ message: string }>;
  }>(
    url,
    {
      query: LIST_RANDOM_MAHJONG_HANDS,
      variables: { limit: REQUIRED_COUNT },
    },
    { headers }
  );

  if (data.errors?.length) {
    throw new Error(data.errors.map((e) => e.message).join("; "));
  }

  const items = data.data?.listRandomMahjongHands?.items ?? [];
  if (items.length < REQUIRED_COUNT) {
    throw new Error(
      `Not enough questions: got ${items.length}, need at least ${REQUIRED_COUNT}`
    );
  }

  return items.slice(0, REQUIRED_COUNT).map((item) => ({
    id: item.id,
    tiles: item.tiles as TileCode[],
    winningTiles: item.winningTiles as TileCode[],
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
}
