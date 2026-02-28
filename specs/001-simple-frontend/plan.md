# Implementation Plan: 一問フロントエンド（麻雀手牌クイズ）

**Branch**: `001-simple-frontend` | **Date**: 2025-02-28 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-simple-frontend/spec.md`  
**Plan input**: [doc/plan/4-1_simple-frontend.md](../../doc/plan/4-1_simple-frontend.md) — axios でバックエンドリクエスト、shadcn UI、正解判定はフロント、実装後にサンドボックス起動・doc/seed 投入・画面確認、その後 PR 発行。

## Summary

トップページのスタート操作から出題画面へ遷移し、バックエンドから取得した1問（手牌 tiles + 正解 winningTiles）を萬・索・筒・字の順で牌画像表示する。ユーザーは全種類の牌から複数選択して解答し、「解答する」で正解/不正解をモーダル表示。取得失敗時はリトライ・トップ戻る、画像欠損時は該当牌のみエラー表示、結果後は出題画面でやり直し or トップへ戻る。技術方針: バックエンド呼び出しに axios、UI に shadcn、正解判定はフロントエンドで実施。

## Technical Context

**Language/Version**: TypeScript (Next.js 14), Node 20  
**Primary Dependencies**: Next.js, React, AWS Amplify (Gen2), axios（バックエンドリクエスト用）, shadcn/ui（UI コンポーネント）  
**Storage**: N/A（フロントエンドのみ。出題データは既存 AppSync/DynamoDB の MahjongHand から取得）  
**Testing**: Jest（既存）、ミニマムなテストケース（憲法準拠）  
**Target Platform**: Web（Next.js app）、Amplify ホスティング想定  
**Project Type**: Web（モノレポ: app/, components/, src/, amplify/）  
**Performance Goals**: 出題画面の初回表示は体感で遅くないこと（数秒以内）  
**Constraints**: 憲法に従い Amplify Gen2・Next.js・Jest・husky を使用。PR は日本語。  
**Scale/Scope**: 1問表示・1画面フロー。既存 MahjongHand API（list 取得＋1件選択）を利用。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | チェック |
|------|----------|
| **I. AWS Amplify Gen2** | ✅ フロントは Next.js、バックエンドは既存 AppSync/DynamoDB。本機能はフロント実装のみで API は既存利用。 |
| **II. テストとコード品質** | ✅ Jest でミニマムなテスト。husky で lint/prettier 自動実行。 |
| **III. タスク開始手順** | ✅ タスク開始時は main の最新 fetch からブランチ作成（タスク実行時に適用）。 |
| **IV. タスク範囲と PR** | ✅ 実装完了後にサンドボックス起動・doc/seed 投入・画面確認まで行い、PR を日本語で発行。GITHUB_TOKEN は .env。 |

**Result**: 全ゲート通過。違反なし。

## Project Structure

### Documentation (this feature)

```text
specs/001-simple-frontend/
├── plan.md              # 本ファイル
├── research.md          # Phase 0 成果物
├── data-model.md        # Phase 1 成果物
├── quickstart.md        # Phase 1 成果物
├── contracts/           # Phase 1 成果物（API 契約）
└── tasks.md             # Phase 2（/speckit.tasks で作成）
```

### Source Code (repository root)

```text
app/                     # Next.js App Router
├── page.tsx             # トップページ（既存）
├── quiz/                # 出題画面（本機能で追加）
│   └── page.tsx
├── layout.tsx
└── globals.css

components/              # shadcn + カスタム
├── ui/                  # shadcn コンポーネント
├── TileImage.tsx        # 牌画像（牌コード→画像、欠損時エラー表示）
├── HandDisplay.tsx      # 手牌表示（萬索筒字順）
├── AnswerPicker.tsx     # 全種類の牌から複数選択
├── ResultModal.tsx      # 正解/不正解モーダル
└── ...

public/
└── images/
    └── tiles/          # 牌画像（ファイル名＝牌コード）

src/
├── lib/
│   ├── mahjong/         # 既存: 牌コード型・バリデーション・ランダム手牌
│   │   ├── client.ts    # 既存 Amplify generateClient（参考。本機能では axios 利用可）
│   │   └── ...
│   └── api/             # 本機能: 出題取得
│       └── fetchQuestion.ts  # axios で AppSync 呼び出し or Amplify client の薄いラップ
└── ...
```

**Structure Decision**: 既存の Next.js + App Router + Amplify 構成を維持。出題画面は `app/quiz/page.tsx`。牌表示・解答選択・モーダルは `components/` に配置。バックエンド呼び出しはユーザー指定に従い axios を使用（`src/lib/api/` に配置）。

## Complexity Tracking

憲法違反はなし。表は空のまま。
