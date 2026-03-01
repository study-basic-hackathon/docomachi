/**
 * データリソース（docomachi テーブル）
 * 契約: specs/002-amplify-backend-setup/contracts/docomachi-schema.md
 * パーティションキーは id (UUID) のみ。他属性は後続のデータ要件で追加する。
 * カスタムクエリ listRandomMahjongHands: specs/006-10-questions-quiz/contracts/quiz-10-questions-api.md
 */
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";
import { listRandomMahjongHands } from "../functions/listRandomMahjongHands/resource.js";

const schema = a.schema({
  Docomachi: a
    .model({
      // パーティションキー: id。Amplify デフォルトの ID を明示的に定義する。
      id: a.id().required(),
    })
    .authorization((allow) => [allow.authenticated()]),
  // MahjongHand: 認証ユーザーまたは API キー（未認証）で読み取り可能。認証は別タスクで強化予定。
  MahjongHand: a
    .model({
      id: a.id().required(),
      tiles: a.string().array().required(),
      winningTiles: a.string().array().required(),
    })
    .authorization((allow) => [allow.authenticated(), allow.publicApiKey()]),
  // ランダム10件取得（クイズ出題用）
  ListRandomMahjongHandsItem: a.customType({
    id: a.id(),
    tiles: a.string().array(),
    winningTiles: a.string().array(),
    createdAt: a.string(),
    updatedAt: a.string(),
  }),
  ListRandomMahjongHandsResponse: a.customType({
    items: a.ref("ListRandomMahjongHandsItem").array(),
  }),
  listRandomMahjongHands: a
    .query()
    .arguments({ limit: a.integer().required() })
    .returns(a.ref("ListRandomMahjongHandsResponse"))
    .authorization((allow) => [allow.authenticated(), allow.publicApiKey()])
    .handler(a.handler.function(listRandomMahjongHands)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
