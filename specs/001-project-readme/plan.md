# Implementation Plan: プロジェクト README

**Branch**: `001-project-readme` | **Date**: 2025-03-22 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/Users/honda/dev/docomachi/specs/001-project-readme/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

リポジトリ直下の `README.md` を、仕様どおり **日本語** で書き換え／新規作成し、麻雀クイズアプリの目的、**Speckit** による仕様駆動開発、**AWS Amplify Gen 2**（Next.js + AppSync + DynamoDB 等）の利用、主要な **フレームワーク・パッケージ** の列挙、**画面スクリーンショット（1 枚以上）** を含める。既存の Amplify スターター英語 README は本文要件（FR-006）と両立しないため、プロジェクト向けの日本語ドキュメントに置き換える。画像は Git で管理し、README から相対パスで参照する（詳細は [research.md](./research.md)）。

## Technical Context

**Language/Version**: Markdown（README）／日本語本文。リポジトリのアプリは TypeScript 5.6+、Next.js 14（App Router）。  
**Primary Dependencies**（README に記載するスタックの根拠）: `package.json` の `dependencies` / `devDependencies`、および `@aws-amplify/backend` 系・Amplify Gen 2 バックエンド（`amplify/`）。  
**Storage**: Git 管理ファイル（ルート `README.md`、画像は `doc/readme/screenshots/` 推奨）。永続化 DB は本機能の成果物ではない。  
**Testing**: 自動テストは必須ではない。受け入れは仕様のチェックリスト（必須節・画像・言語）によるレビュー。既存の `npm run lint` は変更ファイルに触れる場合のみ従来どおり。  
**Target Platform**: GitHub 上の閲覧者（ブラウザ／モバイルの Markdown 表示）。  
**Project Type**: 既存の単一 Next.js リポジトリに対する **ドキュメントのみ** の変更。  
**Performance Goals**: 該当なし（静的ドキュメント）。  
**Constraints**: FR-006 により説明文は日本語のみ。英語のみの段落や英語主体の並記は不可。製品名・パッケージ名の英語は可。スクリーンショットに個人情報を含めない（Edge Cases）。  
**Scale/Scope**: ルート README 1 本＋画像 1 枚以上。詳細な全依存の列挙は不要（README 上で「主要」と方針を明示し `package.json` へ誘導可）。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | 状態 | メモ |
|------|------|------|
| I. AWS Amplify Gen 2 ベース | **適合** | README に Amplify Gen 2・Next.js・AppSync / DynamoDB 等を明記する（FR-003 と整合）。 |
| II. テストとコード品質 | **適合** | 本機能は主に Markdown／画像。アプリコードを変更しない限り Jest／husky の追加負荷はない。 |
| III. タスク開始手順 | **適合** | 実装タスク開始時は main の fetch とブランチ運用を従う（本 plan 作成時点のブランチは `001-project-readme`）。 |
| IV. PR は日本語 | **適合** | マージ依頼時の PR 説明は日本語（憲法 IV）。 |

**Phase 1 後の再確認**: 設計どおり API 変更なし・ドキュメントとアセットのみの場合、憲法違反はない。

## Project Structure

### Documentation (this feature)

```text
specs/001-project-readme/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
/Users/honda/dev/docomachi/
├── README.md                 # 本機能の主成果物（日本語）
├── doc/
│   └── readme/
│       └── screenshots/      # README 用スクリーンショット（推奨配置）
├── app/                      # Next.js App Router（README では概要・スクリーンショットの出所として言及）
├── amplify/                  # Amplify Gen 2 バックエンド定義（README で言及）
├── components/
├── package.json              # 依存一覧の一次情報源
├── public/                   # 既存の静的アセット（README 画像は doc/ 側を優先）
└── specs/
```

**Structure Decision**: 単一リポジトリの Next.js + Amplify Gen 2 構成は既存のまま。本機能は **ルート `README.md` と `doc/readme/screenshots/`（新規ディレクトリ）** を追加・更新するのみとし、アプリの `app/`・`amplify/` のコードは README 作成だけなら原則変更しない。

## Complexity Tracking

本機能では憲法チェックの違反はなく、複雑性トラッキングの表は不要です。
