# Implementation Plan: 10 Questions Quiz Flow

**Branch**: `006-10-questions-quiz` | **Date**: 2025-03-01 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/006-10-questions-quiz/spec.md`  
**User addition**: list で10件取得するときにバックエンド側でランダムに10件取得してレスポンスを返す。

## Summary

クイズを1問から10問連続に変更する。トップの「スタート」で出題ページへ遷移し、**バックエンドがランダムに10件を取得してレスポンスで返す** API を1回呼んでセッションを開始する。正解時は1–9問目は「次の問題へ」のみ、10問目は「結果を見る」のみ表示。不正解時は再回答・「解答を見る」モーダル・「次の問題へ」で次問に進める。結果画面で「X / 10」を表示。**list で10件取得する際はバックエンド側でランダムに10件取得して返す**（クライアントでのランダム選択は行わない）。セッション状態はフロントのみで保持する。

## Technical Context

**Language/Version**: TypeScript 5.x（Next.js 14, Amplify Gen2）  
**Primary Dependencies**: Next.js, AWS Amplify (Gen2), AppSync, DynamoDB, Lambda（TypeScript）, React 18, Jest  
**Storage**: DynamoDB（既存 MahjongHand）。クイズセッション・スコアは永続化せずフロントの状態のみ。バックエンドに Lambda（TypeScript）を追加し、DynamoDB からランダム10件を返す。  
**Testing**: Jest（ミニマム）。husky で lint/prettier 自動実行。  
**Target Platform**: Web（Next.js App Router）  
**Project Type**: Web（Next.js 単体 + Amplify バックエンド）  
**Performance Goals**: 10問取得1リクエスト、画面遷移は即時。  
**Constraints**: 憲法に準拠（Amplify Gen2, TypeScript, PR 日本語）。  
**Scale/Scope**: 1セッション10問、同時ユーザー数は既存と同程度。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Notes |
|-----------|-------|--------|
| I. AWS Amplify Gen2 | ✅ | 既存 AppSync/DynamoDB に加え、カスタムクエリ＋Lambda（TypeScript）で「ランダム10件」を返すバックエンドを追加。 |
| II. テストとコード品質 | ✅ | Jest でミニマムなテスト。husky で lint/prettier 継続。 |
| III. タスク開始手順 | ✅ | main 最新からブランチ作成。タスク分解時に適用。 |
| IV. タスク範囲と PR | ✅ | タスクに PR 作成まで含め、PR は日本語。GITHUB_TOKEN は .env。 |

**Result**: 全ゲート通過。違反なし。

## Project Structure

### Documentation (this feature)

```text
specs/006-10-questions-quiz/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
└── tasks.md             # Phase 2 (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── page.tsx             # トップ（スタート → /quiz）
├── quiz/
│   └── page.tsx         # 出題・解答・結果（10問フローに変更）
└── layout.tsx

src/
├── lib/
│   ├── api/
│   │   └── fetchQuestion.ts   # 10問取得は新 API（listRandomMahjongHands）を呼ぶ
│   └── mahjong/               # 既存（変更なし）
components/
├── HandDisplay.tsx
├── AnswerPicker.tsx
├── ResultModal.tsx            # 正解/不正解 + 次の問題へ・結果を見る・解答を見る に対応
└── ui/

amplify/
├── data/resource.ts           # カスタムクエリ listRandomMahjongHands(limit) を追加
├── functions/                 # 追加: ランダム10件取得用 Lambda（TypeScript）
│   └── listRandomMahjongHands/
└── ...
```

**Structure Decision**: 既存の Next.js App Router + Amplify 構成を維持。**バックエンド**: `amplify/data/resource.ts` にカスタムクエリ（例: `listRandomMahjongHands(limit: 10)`）を定義し、Lambda（TypeScript）で DynamoDB からランダムに10件取得して返す。**フロント**: その API を1回呼んで10問を受け取り、`app/quiz/page.tsx` および `components/ResultModal.tsx` で10問フローを実装する。

## Complexity Tracking

（憲法違反なしのため空欄）
