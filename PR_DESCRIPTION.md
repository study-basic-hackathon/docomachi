# AWS Amplify Gen2 バックエンドの構築

## 概要

AWS Amplify Gen2 でバックエンドをコードとして定義しました。デフォルト認証（Amazon Cognito）を有効化し、DynamoDB に docomachi テーブル（パーティションキー UUID）を定義しています。

## 実装内容

### バックエンド構造

- `amplify/auth/resource.ts`: デフォルト認証（メール/パスワード、Cognito）の定義
- `amplify/data/resource.ts`: docomachi モデル（パーティションキー: id UUID）の定義
- `amplify/backend.ts`: auth と data を統合するバックエンド定義
- `amplify/package.json`: Amplify Gen2 の依存関係
- `amplify/tsconfig.json`: TypeScript 設定

### ドキュメント

- `specs/002-amplify-backend-setup/`: 仕様、計画、タスク、データモデル、契約、quickstart ガイド

## 検証

- ✅ `cd amplify && npm install && npm run typecheck` が成功
- ✅ デプロイは行わず、コードの実装のみ完了

## 完了条件

- ✅ コードの実装完了
- ✅ ローカルでのビルド・検証が可能
- ⏳ プルリクエストの作成（本 PR）

## 注意事項

- **デプロイは行いません**。マージ後の AWS コンソール上での設定（リソース作成・デプロイ・リージョン指定等）は依頼者側で実施してください。
- リージョンはコードで指定していません。Amplify のデフォルト、またはマージ後に AWS コンソールで設定してください。

## 関連ドキュメント

- 仕様: `specs/002-amplify-backend-setup/spec.md`
- 計画: `specs/002-amplify-backend-setup/plan.md`
- Quickstart: `specs/002-amplify-backend-setup/quickstart.md`
