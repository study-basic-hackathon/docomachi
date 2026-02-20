/**
 * 認証リソース（AWS Amplify Gen2 デフォルト認証）
 * 仕様: SC-002 — デフォルト認証（メール/パスワード、Amazon Cognito）をコードで有効化する。
 * サインアップ・サインインは Cognito により提供される。
 */
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
