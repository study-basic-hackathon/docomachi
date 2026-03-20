# Implementation Plan: 解答タイマー15秒化と停止

**Branch**: `001-adjust-timer-stop` | **Date**: 2026-03-21 | **Spec**: `/Users/honda/dev/docomachi/specs/001-adjust-timer-stop/spec.md`
**Input**: Feature specification from `/specs/001-adjust-timer-stop/spec.md`

## Summary

クイズ画面の制限時間を10秒から15秒へ変更し、「解答する」押下時点でタイマー進行を停止する。時間切れ時の不正解モーダル表示は既存と同一に保ち、競合時の二重確定を防ぐ。

## Technical Context

**Language/Version**: TypeScript (Next.js App Router), React client component  
**Primary Dependencies**: Next.js, React, Sonner, existing quiz UI components  
**Storage**: N/A（本機能で永続化変更なし）  
**Testing**: Jest + Testing Library（最小ケース）  
**Target Platform**: Webブラウザ（デスクトップ/モバイル）  
**Project Type**: web single app  
**Performance Goals**: 1秒更新の残時間表示、タイマー停止反映はユーザー操作直後  
**Constraints**: 既存不正解モーダル再利用、同一問題で重複確定禁止、次問題でタイマー再初期化  
**Scale/Scope**: 10問クイズの1問単位タイマー制御

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] 原則 I（Amplify Gen2 / TypeScript）: TypeScript/Next.js 範囲で変更し、既存基盤に整合
- [x] 原則 II（テスト品質）: Jest の最小テストで要件差分を検証
- [x] 原則 III（開始手順）: 既存 feature branch 上で該当タスクを進行
- [x] 原則 IV（PRまで）: 設計成果物を揃え、後続実装から PR 作成可能

Gate Result (Pre-Phase 0): PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-adjust-timer-stop/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── timer-adjustment.graphql
└── tasks.md
```

### Source Code (repository root)

```text
app/
└── quiz/page.tsx

components/
└── ResultModal.tsx

src/lib/api/
└── fetchQuestions.ts
```

**Structure Decision**: 変更対象は既存クイズ画面中心のため、`app/quiz/page.tsx` を主編集箇所とする。契約は将来のバックエンド連携拡張に備えて `specs/001-adjust-timer-stop/contracts/` に保持する。

## Phase 0: Research Plan

- 15秒化時の UX 影響と既存3秒警告ルールの維持方針
- 「解答する」押下時停止と時間切れ同時発火の競合解決ルール
- モーダル表示中のタイマー固定方法と次問題再開条件

成果物: `research.md`

## Phase 1: Design & Contracts Plan

- エンティティ/状態遷移を `data-model.md` へ定義
- FR 対応の契約を `contracts/timer-adjustment.graphql` へ定義
- 実装・検証手順を `quickstart.md` へ記載
- `.specify/scripts/bash/update-agent-context.sh cursor-agent` でエージェント文脈更新

成果物: `data-model.md`, `contracts/*`, `quickstart.md`

## Post-Design Constitution Check

- [x] 原則 I: 既存技術範囲内で成立
- [x] 原則 II: 最小テスト戦略に整合
- [x] 原則 III: ブランチ粒度は単機能で適切
- [x] 原則 IV: PR につながる成果物を出力済み

Gate Result (Post-Phase 1): PASS

## Complexity Tracking

違反なし。
