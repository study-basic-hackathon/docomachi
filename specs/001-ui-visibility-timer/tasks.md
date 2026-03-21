# Tasks: UI Visibility Update

**Input**: Design documents from `/specs/001-ui-visibility-timer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: 仕様と quickstart に最小テスト追加方針が明記されているため、各ユーザーストーリーに最小限のテストタスクを含める。

**Organization**: タスクはユーザーストーリー単位で分割し、各ストーリーを独立で実装・検証できるように構成する。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（別ファイルで競合しない）
- **[Story]**: ユーザーストーリー対応ラベル（US1, US2）
- すべてのタスク説明に正確なファイルパスを含める

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 作業前提を整え、UI検証契約と現状把握を準備する

- [X] T001 `specs/001-ui-visibility-timer/contracts/ui-visibility-contract.yaml` と `specs/001-ui-visibility-timer/quickstart.md` を参照し受け入れ確認チェック項目を `specs/001-ui-visibility-timer/tasks.md` に追記確認する
- [X] T002 `app/quiz/page.tsx` の現行レイアウト構造（問題文・選択肢・解答ボタン・タイマー位置）を確認し変更対象ブロックを特定する
- [X] T003 [P] `components/AnswerPicker.tsx` のボタン領域DOM構造を確認し、タイマー差し込み位置（解答ボタン直上）を明確化する

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 全ユーザーストーリーで共通利用する表示ルールと再利用スタイルを先に整備する

**⚠️ CRITICAL**: このフェーズ完了前に US1/US2 の実装へ進まない

- [X] T004 `app/globals.css` に必須テキスト用の高コントラストユーティリティクラス（通常 4.5:1 以上、大文字 3:1 以上を満たす設計意図）を追加する
- [X] T005 [P] `components/AnswerPicker.tsx` にタイマー表示用コンテナ（解答ボタン直上固定のためのラッパ）を追加するための共通 props を定義する
- [X] T006 [P] `app/quiz/page.test.tsx` に「低視認色を使わない」「タイマー最小サイズ 24 相当」の共通検証ヘルパーを追加する

**Checkpoint**: 共通スタイル・共通配置ロジック・共通テスト補助が揃い、US1/US2 を独立着手可能

---

## Phase 3: User Story 1 - Text Visibility Improvement (Priority: P1) 🎯 MVP

**Goal**: 白背景でも問題文・選択肢・ステータス文字が明確に判読できる状態にする

**Independent Test**: クイズ画面表示時に必須テキストが低コントラスト色を使わず、可読性基準に沿った配色で表示されることを確認できる

### Tests for User Story 1

- [X] T007 [P] [US1] `app/quiz/page.test.tsx` に必須テキスト（問題文・選択肢・状態表示）が高可読スタイルを持つことを検証するテストを追加する
- [X] T008 [P] [US1] `app/quiz/page.test.tsx` に黄緑系など低視認アクセント色が必須情報に適用されないことを検証するテストを追加する

### Implementation for User Story 1

- [X] T009 [US1] `app/quiz/page.tsx` の問題文・ステータス表示クラスを更新し、白背景でも判読可能な配色へ変更する
- [X] T010 [US1] `components/AnswerPicker.tsx` の選択肢テキストスタイルを更新し、必須情報の可読性基準を満たす配色へ変更する
- [X] T011 [US1] `app/quiz/page.tsx` と `components/AnswerPicker.tsx` の重複色指定を整理し、必須情報の色ルールを一貫化する

**Checkpoint**: US1 が単独で実装・テスト完了し、可読性改善を確認できる

---

## Phase 4: User Story 2 - Timer Placement and Size Improvement (Priority: P2)

**Goal**: タイマーを解答ボタン直上に配置し、最小サイズ 24 相当で常時視認できるようにする

**Independent Test**: クイズ回答中にタイマーが常に解答ボタン直上へ表示され、狭い画面でも非表示にならず、24 相当以上で読めることを確認できる

### Tests for User Story 2

- [X] T012 [P] [US2] `app/quiz/page.test.tsx` にタイマーが解答ボタン直上へ描画されることを検証するテストを追加する
- [X] T013 [P] [US2] `app/quiz/page.test.tsx` にタイマー表示サイズが 24 相当未満にならないことを検証するテストを追加する

### Implementation for User Story 2

- [X] T014 [US2] `app/quiz/page.tsx` のタイマーDOMを解答ボタン直上に移動し、回答フロー中に常時表示する
- [X] T015 [US2] `components/AnswerPicker.tsx` のレイアウトを調整し、タイマーとボタンが狭い画面でも重ならないようにする
- [X] T016 [US2] `app/quiz/page.tsx` のタイマー文字スタイルを更新し、最小サイズ 24 相当を保証する

**Checkpoint**: US2 が単独で実装・テスト完了し、位置とサイズ要件を満たす

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: 全体整合・回帰確認・ドキュメント反映

- [X] T017 [P] `specs/001-ui-visibility-timer/quickstart.md` の受け入れ手順に沿って手動確認を実施し、結果を `specs/001-ui-visibility-timer/spec.md` の Success Criteria と突合する
- [X] T018 `app/quiz/page.test.tsx` と関連テストを実行し、既存クイズ機能の回帰がないことを確認する
- [X] T019 [P] `specs/001-ui-visibility-timer/tasks.md` の完了状態を更新し、PR本文用の実施内容（日本語）を整理する

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 依存なし、即開始可能
- **Phase 2 (Foundational)**: Phase 1 完了後に着手、US1/US2 の前提
- **Phase 3 (US1)**: Phase 2 完了後に着手（MVP）
- **Phase 4 (US2)**: Phase 2 完了後に着手（US1 と独立検証可能）
- **Phase 5 (Polish)**: US1/US2 の完了後に実施

### User Story Dependencies

- **US1 (P1)**: 他ストーリー依存なし（Foundational 後に単独完結可能）
- **US2 (P2)**: 他ストーリー依存なし（Foundational 後に単独完結可能）

### Within Each User Story

- テストタスクを先行し、失敗を確認してから実装へ進む
- レイアウト変更後にスタイル調整と回帰確認を行う
- 各ストーリーのチェックポイントで独立動作を確認する

### Parallel Opportunities

- Phase 1 の `T003` は `T002` と並列可能
- Phase 2 の `T005` と `T006` は並列可能
- US1 の `T007` と `T008` は並列可能
- US2 の `T012` と `T013` は並列可能
- Polish の `T017` と `T019` は並列可能

---

## Parallel Example: User Story 1

```bash
# Run in parallel:
Task: "T007 [US1] Add readable text style test in app/quiz/page.test.tsx"
Task: "T008 [US1] Add disallowed low-visibility color test in app/quiz/page.test.tsx"
```

---

## Parallel Example: User Story 2

```bash
# Run in parallel:
Task: "T012 [US2] Add timer placement test in app/quiz/page.test.tsx"
Task: "T013 [US2] Add timer minimum size test in app/quiz/page.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 と Phase 2 を完了
2. US1 (Phase 3) のみ実装・検証
3. 可読性改善を先行リリース可能状態にする

### Incremental Delivery

1. US1 で配色と可読性改善を確定
2. US2 でタイマーの配置・サイズ改善を追加
3. 最後に横断回帰と受け入れ判定を実施

### Parallel Team Strategy

1. 1名が `app/quiz/page.tsx`、もう1名が `components/AnswerPicker.tsx` とテストを担当
2. Foundational 完了後、US1/US2 のテスト準備を並列実施
3. 最終フェーズで統合確認とPR準備を実施
