# Implementation Plan: フロントエンドのフォルダ構成をテンプレートに合わせる

**Branch**: `005-frontend-template-structure` | **Date**: 2026-02-20 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification + 実装方針（一旦テンプレートのまま構築 → shadcn 導入 → トップページ再実装は [001-top-page/spec.md](../001-top-page/spec.md) を参照）

## Summary

フロントエンドのディレクトリ構成を amplify-next-template と同一にし、アプリルートをリポジトリルートとする。実装は (1) テンプレートどおりのフロントエンドを構築、(2) shadcn をインストール、(3) [001-top-page](../001-top-page/spec.md) の仕様に沿ってトップページ（緑背景・バナー・スタートボタン）を再実装する順で行う。

## Technical Context

**Language/Version**: TypeScript, Node.js（既存）  
**Primary Dependencies**: Next.js 14（App Router）, React 18。Phase 2 で shadcn/ui を追加。  
**Storage**: N/A（フロントのみ）  
**Testing**: Jest（Constitution II）。ミニマムのテスト。  
**Target Platform**: Web（Amplify Hosting）  
**Project Type**: モノレポ → 本対応後はフロントがリポジトリルートに統合。バックエンドは `amplify/` のまま。  
**Constraints**: Constitution（Next.js, Jest, husky）。既存のトップページ要件は 001 仕様に準拠。  
**Scale/Scope**: トップページ＋テンプレート構成。001 の緑背景・バナー・スタートボタンを満たす。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Amplify Gen2 / Next.js | ✅ | Next.js App Router、ルート構成の変更のみ。 |
| II. Jest / husky | ✅ | テストは最小限。husky はルート package.json で維持。 |
| III. main fetch → branch | ✅ | タスク開始手順に従う。 |
| IV. PR まで / GITHUB_TOKEN | ✅ | タスク完了時に PR 作成。トークンは .env。 |

## Implementation Phases (Execution Order)

実装は以下の順で行う。

1. **Phase A: テンプレートどおりのフロントエンド構築**
   - frontend 配下のソース・設定・依存をリポジトリルートへ移す。
   - ルート直下に `app/`、`public/`、`package.json`、`next.config.js`、`tsconfig.json`、`next-env.d.ts` を配置（amplify-next-template と同じレイアウト）。
   - ルートの `package.json` は Next 用の scripts（dev, build, start, lint）と依存を持つ。husky はルートで維持する場合は別途調整（例: prepare で husky install）。
   - 一旦はテンプレートの最小ページ（例: app/page.tsx のプレースホルダ）でビルドが通る状態にする。

2. **Phase B: shadcn のインストール**
   - ルート（アプリルート）で shadcn/ui を初期化・インストール。
   - doc/plan/1-1_top.md の「UIライブラリはshadcnを採用する」に従う。

3. **Phase C: トップページの再実装（001 仕様準拠）**
   - [specs/001-top-page/spec.md](../001-top-page/spec.md) を参照。
   - FR-001〜FR-005: 緑背景、上段にバナー（top-banner.png）、スタートボタン、押下で次画面へ遷移。
   - バナー画像は `public/` 等の適切な場所に配置し、トップページから参照する。
   - スタートボタンは shadcn の Button 等を利用して実装する。

## Project Structure

### Documentation (this feature)

```text
specs/005-frontend-template-structure/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── checklists/
```

### Source Code (repository root, after migration)

```text
# アプリルート = リポジトリルート
app/
├── layout.tsx
├── page.tsx          # トップページ（001 仕様）
├── globals.css
└── ...

public/
├── images/           # または 001 のバナー配置先
│   └── top-banner.png
└── ...

components/           # shadcn および共有コンポーネント（必要に応じて）
lib/
package.json
package-lock.json
next.config.js
next-env.d.ts
tsconfig.json
amplify.yml           # ルートで npm run build / .next
amplify/              # バックエンド（既存）
```

**Structure Decision**: テンプレートと同様にリポジトリルートをアプリルートとし、`app/`（App Router）、`public/`、設定ファイルをルート直下に配置。`frontend/` は廃止。

## Complexity Tracking

（現時点で憲法違反・複雑性の正当化は不要のため空でよい）
