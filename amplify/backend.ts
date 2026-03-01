import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { listRandomMahjongHands } from "./functions/listRandomMahjongHands/resource.js";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

/** SSM パラメータ名（固定）。Lambda はこのパスを参照する。循環依存を避けるため Lambda からは参照しない。 */
export const MAHJONG_HAND_TABLE_NAME_SSM = "/docomachi/mahjong-hand-table-name";

const backend = defineBackend({
  auth,
  data,
  listRandomMahjongHands,
});

// data スタック内にテーブル名を SSM に保存（テーブル作成後に参照可能）
const dataResources = backend.data.resources as {
  tables?: Record<string, { tableName: string }>;
};
const mahjongHandTable = dataResources.tables?.["MahjongHand"];
if (mahjongHandTable) {
  new StringParameter(backend.data as import("constructs").Construct, "MahjongHandTableNameParam", {
    parameterName: MAHJONG_HAND_TABLE_NAME_SSM,
    stringValue: mahjongHandTable.tableName,
    description: "MahjongHand DynamoDB table name for listRandomMahjongHands Lambda",
  });
}

// Lambda: SSM からテーブル名を読む権限（固定パス指定で data リソースを参照しない＝循環なし）
const fn = backend.listRandomMahjongHands.resources.lambda;
fn.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["ssm:GetParameter"],
    resources: [
      `arn:aws:ssm:*:*:parameter${MAHJONG_HAND_TABLE_NAME_SSM}`,
    ],
  })
);
fn.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["dynamodb:Scan"],
    resources: ["*"],
  })
);
backend.listRandomMahjongHands.addEnvironment("MAHJONG_HAND_TABLE_NAME_SSM", MAHJONG_HAND_TABLE_NAME_SSM);
