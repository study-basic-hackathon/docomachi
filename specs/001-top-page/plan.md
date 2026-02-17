# Implementation Plan: フロントエンド トップページ

**Branch**: `001-top-page` | **Date**: 2026-02-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-top-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

トップページをNext.js App Routerで実装し、麻雀をイメージさせる緑の背景、上段にバナー画像、スタートボタンを配置する。UIライブラリとしてshadcn/uiを採用し、レスポンシブ対応で実装する。

## Technical Context

**Language/Version**: TypeScript (Next.js App Router準拠)  
**Primary Dependencies**: Next.js (App Router), shadcn/ui, React  
**Storage**: N/A (静的表示のみ、永続データなし)  
**Testing**: Jest (React Testing Library)  
**Target Platform**: Web (デスクトップ・モバイルブラウザ)  
**Project Type**: web (frontend only)  
**Performance Goals**: ルートURLアクセスから3秒以内に主要要素表示（SC-001準拠）  
**Constraints**: 一般的なデスクトップ・モバイル画面幅でレイアウト崩れなし（SC-003準拠）、バナー画像読み込み失敗時のフォールバック対応  
**Scale/Scope**: 単一ページコンポーネント、静的アセット（バナー画像1枚）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. AWS Amplify Gen2 ベースの開発
- ✅ **準拠**: Next.jsフロントエンド実装は憲法の技術スタック要件に合致
- ✅ **準拠**: AWS Amplify Gen2環境での開発を想定（バックエンド統合は将来対応）

### II. テストとコード品質
- ✅ **準拠**: Jestを使用したミニマムテストケースを実装予定
- ✅ **準拠**: huskyによるlint/prettier自動実行を前提とする

### 判定: **PASS** - すべての憲法要件に準拠

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   └── page.tsx              # トップページ（Next.js App Router）
│   ├── components/
│   │   └── ui/                   # shadcn/uiコンポーネント
│   │       └── button.tsx        # スタートボタン用
│   └── public/
│       └── images/
│           └── top-banner.png    # バナー画像（img/から移動）
└── tests/
    └── app/
        └── page.test.tsx         # トップページのテスト
```

**Structure Decision**: Web application構造を採用（frontend only）。Next.js App Routerのため `frontend/src/app/page.tsx` にトップページを配置。shadcn/uiコンポーネントは `frontend/src/components/ui/` に配置。バナー画像は `frontend/src/public/images/` に移動。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations - all constitution requirements are met.*
