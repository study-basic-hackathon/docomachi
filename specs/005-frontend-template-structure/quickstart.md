# Quickstart: 005-frontend-template-structure

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **トップページ要件**: [001-top-page/spec.md](../001-top-page/spec.md)

## Overview

1. テンプレートどおりのフロントエンドをリポジトリルートに構築する。  
2. shadcn をインストールする。  
3. 001 仕様に沿ってトップページ（緑背景・バナー・スタートボタン）を実装する。

## Prerequisites

- Node.js 18+
- リポジトリ clone 済み。main 最新からブランチ作成（Constitution III）。

## Implementation Steps

### Phase A: テンプレートどおりのフロントエンド構築（完了）

- リポジトリルート直下に `app/`、`public/`、`package.json`、`next.config.js`、`tsconfig.json`、`next-env.d.ts` を配置済み。`frontend/` は削除済み。
- ルートの `package.json` に Next 用 scripts（dev, build, start, lint）と husky の `prepare` を集約済み。
- `amplify.yml` をルート前提に更新済み: preBuild で `npm ci`、build で `npm run build`、artifacts `baseDirectory: .next`。
- ビルドはルートで `npm run build` により成功する。

### Phase B: shadcn のインストール

- ルート（アプリルート）で shadcn/ui を初期化・インストール。
- 例: `npx shadcn@latest init` の後、必要コンポーネント（例: button）を `npx shadcn@latest add button` で追加。

### Phase C: トップページの再実装（001 仕様）

- **001 参照**: [specs/001-top-page/spec.md](../001-top-page/spec.md) の FR-001〜FR-005、Acceptance Scenarios。
- 緑背景（麻雀を連想させるトーン）、上段にバナー画像（`public/images/top-banner.png` 等）、スタートボタン（shadcn Button）を配置。
- スタート押下で次の画面へ遷移（遷移先は 001 のとおり別仕様でも可）。
- バナーが無い場合もページ表示・スタート操作は可能にする（001 Edge Cases）。

## Verification

1. **構成**: ルート直下に `app/`、`public/`、`next.config.js`、`tsconfig.json`、`package.json` があり、テンプレートと一致する。
2. **ビルド**: リポジトリルートで `npm run build` が成功する。
3. **トップページ**: ルート URL（`npm run dev` 後 http://localhost:3000）で緑背景・バナー・スタートボタンが表示され、001 の SC-001〜SC-003 を満たす。
4. **Amplify**: Amplify コンソールでアプリのルートディレクトリをリポジトリルート（空または `/`）に設定し、デプロイが成功する。

## Success Criteria (005)

- SC-001: テンプレートとディレクトリ一致。
- SC-002: ローカルビルド成功。
- SC-003: Amplify デプロイ成功・URL でトップ表示。
- SC-004: トップページおよび主要な画面・機能が表示・動作する。
