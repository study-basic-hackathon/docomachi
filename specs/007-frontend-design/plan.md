# Implementation Plan: Screen Layout and Visual Polish

**Branch**: `007-frontend-design` | **Date**: 2025-03-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/007-frontend-design/spec.md`  
**User plan input**: UI は shadcn を使用する。テストまで終えたら PR を発行する。

## Summary

画面表示の統一と UX 改善: トップバナー（top-banner.png）、緑系背景・中央寄せ、待ち牌の色別改行、スマホ横固定・タブレット以上は向き対応、ボタン整列・グルーピング、ローディングはオーバーレイ、エラーはトースト/スナックバー、あたり牌選択の強調（border）、オーバーフロー時は領域内スクロール。技術方針: Next.js + shadcn/ui（Radix + Tailwind 系）、既存憲法に準拠。

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+  
**Primary Dependencies**: Next.js 14, React 18, Tailwind CSS 4, shadcn/ui（Radix UI + CVA + tailwind-merge 等）、AWS Amplify Gen2  
**Storage**: N/A（本機能は表示層のみ）  
**Testing**: Jest, @testing-library/jest-dom, jsdom  
**Target Platform**: Web（スマホ・タブレット・デスクトップ）、スマホは横表示固定  
**Project Type**: Web（Next.js App Router: app/, components/, public/）  
**Performance Goals**: ローディング表示 500ms 以内、LCP 等は既存指標に準拠  
**Constraints**: 憲法（Amplify Gen2, Next.js, Jest, husky, PR 日本語）に準拠  
**Scale/Scope**: 既存 1 アプリの全画面に適用（トップ・クイズ・結果）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | 適合 | 備考 |
|------|------|------|
| I. AWS Amplify Gen2 ベース | ✅ | 既存 Next.js + Amplify 構成を変更しない。UI のみ追加・変更。 |
| II. テストとコード品質 | ✅ | Jest でミニマムなテスト。husky で lint/prettier 自動実行。 |
| III. タスク開始手順 | ✅ | main 最新からブランチ作成（007-frontend-design）。 |
| IV. タスク範囲と PR / トークン | ✅ | タスクに PR 作成まで含め、PR は日本語。GITHUB_TOKEN は .env。 |

**Result**: 全ゲート通過。違反なし。

## Project Structure

### Documentation (this feature)

```text
specs/007-frontend-design/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1（本機能は UI のみのため軽量）
├── quickstart.md        # Phase 1
├── contracts/           # 本機能は API なしのためスキップ（README のみ任意）
└── tasks.md             # Phase 2（/speckit.tasks で生成）
```

### Source Code (repository root)

```text
app/
├── layout.tsx           # 全体レイアウト・フォント・AmplifyProvider
├── page.tsx             # トップページ（バナー・ボタン・ローディング）
├── quiz/
│   └── page.tsx         # クイズ（待ち牌選択・結果）
└── app.css

components/
├── ui/                  # shadcn 系（button 等）
├── HandDisplay.tsx
├── AnswerPicker.tsx     # 待ち牌選択（色別改行・選択強調・スクロール）
├── ResultModal.tsx
├── AmplifyProvider.tsx
└── （ローディングオーバーレイ・トースト用コンポーネント追加）

public/
├── top-banner.png       # トップバナー画像（既存）
└── images/
    └── tiles/           # 牌画像
```

**Structure Decision**: 既存の Next.js App Router + components 構成を維持。shadcn/ui は components/ui に追加。新規: ローディングオーバーレイ、トースト/スナックバー、必要に応じてトップバナー用ラッパー。

## Complexity Tracking

> 本機能では憲法違反はなく、複雑性の正当化は不要。

（該当なし）
