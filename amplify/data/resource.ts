/**
 * データリソース（docomachi テーブル）
 * 契約: specs/002-amplify-backend-setup/contracts/docomachi-schema.md
 * パーティションキーは id (UUID) のみ。他属性は後続のデータ要件で追加する。
 */
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Docomachi: a
    .model({
      // パーティションキー: id。Amplify デフォルトの ID を明示的に定義する。
      id: a.id().required(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
