# Implementation Plan: 麻雀問題シードデータの整備

**Branch**: `001-seed-data` | **Date**: 2025-03-14 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-seed-data/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

既存の `doc/seed/mahjong_hands.json` を次の方針で整備する。(1) 既存問題の正答と麻雀ルール適合を検証し、不備は修正して残す（削除しない）。(2) 変則多メンチャン待ち・チンイツの多メンチャン待ちをちょうど10問追加（内訳はおおよそ半々）。(3) 全問題に難易度キー（low / middle / high）を自動判定で付与する。技術的には JSON の編集と、必要に応じた検証・難易度付与用の Node/TypeScript スクリプトで完結する。

## Technical Context

**Language/Version**: TypeScript (Node), 既存リポジトリの tsconfig に準拠  
**Primary Dependencies**: 既存（Amplify, fs/path 等）。新規追加は最小限（必要なら JSON Schema 検証ライブラリ）  
**Storage**: `doc/seed/mahjong_hands.json`（ファイル）。seed 実行時に既存の Amplify Data 経由で DynamoDB に投入  
**Testing**: Jest（既存）。検証スクリプトや難易度判定ロジックがあればユニットテストを追加  
**Target Platform**: 開発環境（Node）。CI やローカルでの seed/検証実行  
**Project Type**: Web（既存 Next.js + Amplify）。本機能はデータとスクリプトのみで、フロント/API の新規エンドポイントは不要  
**Performance Goals**: 特になし（seed は数十件規模）  
**Constraints**: 同一牌は4枚まで、手牌13枚・正答リストは麻雀ルールに適合。仕様上の「必ず修正して残す」を満たすため、修正不能な問題は実装時に牌面を差し替える等で対応  
**Scale/Scope**: 既存約10問 + 新規10問 + 難易度付与。データ量は数十件

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. AWS Amplify Gen2** | ✅ 準拠 | 本機能はシードデータとオプションの検証スクリプトのみ。既存の seed スクリプトが Amplify 経由で DynamoDB に投入する構成は変更しない。 |
| **II. テストとコード品質** | ✅ 準拠 | 検証・難易度ロジックを実装する場合は Jest でミニマムにテスト。husky による lint/prettier は既存のまま。 |
| **III. タスク開始手順** | ✅ 準拠 | タスク開始時は main の最新を fetch してからブランチで作業（既に 001-seed-data ブランチで実施）。 |
| **IV. タスク範囲と PR** | ✅ 準拠 | タスク完了時に PR を日本語で作成。GITHUB_TOKEN は .env を使用。 |

**Post–Phase 1**: データモデル・契約・quickstart を追加したが、Amplify/Next.js の構成は変更しておらず、憲法のゲートは引き続き満たしている。

## Project Structure

### Documentation (this feature)

```text
specs/001-seed-data/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (JSON schema for seed data)
└── tasks.md             # Phase 2 output (/speckit.tasks - NOT created by /speckit.plan)
```

### Source Code (repository root)

本機能は既存リポジトリ構造を変更せず、以下の既存パスを利用する。

```text
doc/seed/
├── mahjong_hands.json   # 問題データ（既存を修正・追記。難易度キー追加）
└── README.md            # 既存

scripts/
├── seedMahjongHands.ts   # 既存（difficulty 対応する場合は拡張）
└── __tests__/            # 既存

src/lib/mahjong/
├── mahjongHand.ts        # 既存（MahjongHand 型に difficulty を追加する場合はここ）
├── validation.ts         # 既存（同一牌4枚まで等のルール検証を追加する場合はここ）
└── __tests__/            # 既存
```

**Structure Decision**: 新規ディレクトリは作らず、既存の `doc/seed` と `scripts` / `src/lib/mahjong` のみを拡張する。データの正規のソースは `doc/seed/mahjong_hands.json`。Amplify の MahjongHand スキーマに difficulty を追加するかは、アプリで難易度フィルタ等を使う場合に Phase 1 以降で判断する。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

（該当なし。憲法違反はない。）
