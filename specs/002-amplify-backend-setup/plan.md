# Implementation Plan: バックエンドの構築

**Branch**: `002-amplify-backend-setup` | **Date**: 2025-02-20 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/002-amplify-backend-setup/spec.md`  
**Tech stack (from doc/plan/2-1_backend.md)**: AWS Amplify Gen2, TypeScript, Amazon Cognito, Next.js, DynamoDB

## Summary

AWS Amplify Gen2 でバックエンドをコードとして定義する。デフォルト認証（Amazon Cognito）を有効化し、DynamoDB に docomachi テーブル（パーティションキー UUID）を定義する。デプロイは行わず、コードの実装とプルリクエストの作成までが完了条件。マージ後の AWS コンソール設定は依頼者側が実施する。

## Technical Context

**Language/Version**: TypeScript 5.x（constitution および既存 frontend に合わせる）  
**Primary Dependencies**: AWS Amplify Gen2 (`amplify`), Next.js 14（既存 frontend）, Amazon Cognito（Amplify デフォルト認証）, DynamoDB（Amplify Data 経由）  
**Storage**: DynamoDB（docomachi テーブル、パーティションキーのみ UUID）。Amplify Gen2 の `defineData` でスキーマ定義。  
**Testing**: Jest（constitution）。本機能ではバックエンド定義のビルド・検証が可能であることを確認。  
**Target Platform**: Node.js（Amplify ビルド）、既存 frontend は Next.js。  
**Project Type**: Web（frontend + backend）。既存の `frontend/` に加え、リポジトリルートに `amplify/` を追加。  
**Performance Goals**: 本機能では未指定。ローカルビルド・検証が通ること。  
**Constraints**: デプロイは行わない。リージョンはコードで指定しない。  
**Scale/Scope**: docomachi テーブルは PK（UUID）のみ定義。他属性は後続要件で追加。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. AWS Amplify Gen2 ベースの開発 | バックエンドはサーバレス、AppSync と DynamoDB、TypeScript | ✅ Amplify Gen2 の Data で DynamoDB を定義。バックエンド定義は TypeScript。 |
| II. テストとコード品質 | Jest、husky で lint/prettier 自動実行 | ✅ 既存 husky を利用。バックエンド追加後も Jest は継続利用。 |

**Verdict**: 違反なし。計画を進行する。

*Post Phase 1 re-check*: data-model と amplify/ 構成は Constitution（Amplify Gen2、TypeScript、DynamoDB）に準拠。変更なし。

## Project Structure

### Documentation (this feature)

```text
specs/002-amplify-backend-setup/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output（データスキーマ等）
└── tasks.md             # Phase 2 output (/speckit.tasks - 本コマンドでは作成しない)
```

### Source Code (repository root)

```text
# 既存
frontend/                 # Next.js アプリ（既存）
package.json              # ルート（husky 等）
.husky/

# 本機能で追加
amplify/
├── auth/
│   └── resource.ts      # defineAuth() でデフォルト認証
├── data/
│   └── resource.ts      # defineData() で docomachi モデル（PK: id UUID）
├── backend.ts           # defineBackend() で auth + data を組み合わせ
└── package.json         # Amplify バックエンド用依存
```

**Structure Decision**: 既存のモノレポ（frontend/ + ルート）に、Amplify Gen2 標準の `amplify/` をルートに追加する。バックエンドは TypeScript で定義し、デプロイは行わないため sandbox や CI デプロイ設定は含めない。

## Complexity Tracking

（Constitution 違反なしのため未使用）
