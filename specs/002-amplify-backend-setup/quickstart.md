# Quickstart: 002-amplify-backend-setup

**Branch**: `002-amplify-backend-setup`  
**Date**: 2025-02-20

## 前提

- Node.js 18+ を推奨。
- 本機能ではデプロイは行わない。コードのビルド・検証までを対象とする。

## 1. リポジトリの取得

```bash
git clone <repo-url>
cd docomachi
git checkout 002-amplify-backend-setup
```

## 2. 依存のインストール

ルートおよび（存在する場合）`amplify/` で依存をインストールする。

```bash
npm install
# amplify を追加した場合
cd amplify && npm install && cd ..
```

## 3. バックエンド定義のビルド・検証

- `amplify/` 配下の TypeScript がビルド可能であること。以下で型チェックを実行する:
  - `cd amplify && npm install && npm run typecheck`
  - 成功時は終了コード 0 で完了する（デプロイは行わない）。
- Amplify Gen2 を使用する場合、以下で sandbox の起動やビルドが可能（任意。デプロイは行わない）:
  - `npx ampx sandbox --help` でコマンド確認
  - 必要に応じて `npx ampx pipeline-deploy --help` 等は本機能範囲外

## 4. 認証・データの確認

- **認証**: `amplify/auth/resource.ts` に `defineAuth()` によるデフォルト認証の定義があること。
- **データ**: `amplify/data/resource.ts` に docomachi モデル（パーティションキー UUID）の定義があること。
- **エントリ**: `amplify/backend.ts` で `defineBackend()` に auth と data が渡されていること。

## 5. 完了条件（仕様）

- 上記のコードがリポジトリに含まれており、ローカルでビルド・検証ができること。
- 実装完了時にはプルリクエストを作成する。マージ後の AWS コンソール設定は依頼者側が実施する。

## 参考

- [plan.md](./plan.md) — 実装計画
- [research.md](./research.md) — 技術選定のメモ
- [data-model.md](./data-model.md) — データモデル
- [contracts/docomachi-schema.md](./contracts/docomachi-schema.md) — docomachi スキーマ契約
