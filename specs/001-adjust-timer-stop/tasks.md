# Tasks: 解答タイマー15秒化と停止

**Input**: Design documents from `/specs/001-adjust-timer-stop/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: 仕様に最小テスト観点が明示されているため、ストーリーごとにテストタスクを含める。  
**Organization**: ユーザーストーリー単位で実装・検証できるよう構成する。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（依存なし・別作業）
- **[Story]**: 該当ユーザーストーリー（`[US1]`, `[US2]`, `[US3]`）
- 各タスクは実ファイルパスを含む

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 変更対象整理と実装準備

- [x] T001 現仕様差分（10秒→15秒、押下時停止）を `specs/001-adjust-timer-stop/research.md` に実装メモとして追記する
- [x] T002 変更対象の確認結果を `specs/001-adjust-timer-stop/plan.md` に反映し `app/quiz/page.tsx` への編集方針を固定する

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 全USに共通のタイマー制御基盤を整える  
**⚠️ CRITICAL**: 完了までユーザーストーリー実装へ進まない

- [x] T003 `app/quiz/page.tsx` の制限時間定数を15秒へ更新する
- [x] T004 `app/quiz/page.tsx` に問題単位のタイマー進行状態（running/stopped）管理を追加する
- [x] T005 [P] `app/quiz/page.tsx` に次問題遷移時のタイマー再初期化（15秒）処理を追加する
- [x] T006 [P] `app/quiz/page.tsx` に重複確定防止の共通ガードを追加する

**Checkpoint**: 15秒タイマー基盤と再初期化・重複防止の共通処理が有効

---

## Phase 3: User Story 1 - 15秒以内に解答する (Priority: P1) 🎯 MVP

**Goal**: 15秒以内回答は通常判定、15秒経過未回答は不正解確定  
**Independent Test**: 15秒以内回答と15秒経過未回答を単体で再現し期待結果を確認

### Tests for User Story 1

- [x] T007 [P] [US1] 15秒以内回答と15秒経過未回答の判定テストを `app/quiz/page.test.tsx` に追加する

### Implementation for User Story 1

- [x] T008 [US1] `app/quiz/page.tsx` の時間切れ判定を15秒基準へ更新する
- [x] T009 [US1] `app/quiz/page.tsx` の解答判定処理を15秒制約と整合するよう調整する
- [x] T010 [US1] `app/quiz/page.tsx` の時間切れ時不正解確定を既存モーダル表示につなぐ

**Checkpoint**: US1 単体で15秒制限ルールが成立

---

## Phase 4: User Story 2 - 解答操作でタイマーを止める (Priority: P2)

**Goal**: 「解答する」押下時点でタイマーを停止し残り時間を固定する  
**Independent Test**: 解答押下後、結果表示中に残り時間が変化しないことを確認

### Tests for User Story 2

- [x] T011 [P] [US2] 解答押下後のタイマー停止と残り時間固定のテストを `app/quiz/page.test.tsx` に追加する

### Implementation for User Story 2

- [x] T012 [US2] `app/quiz/page.tsx` の解答ボタン押下ハンドラにタイマー停止処理を追加する
- [x] T013 [US2] `app/quiz/page.tsx` でモーダル表示中の残り時間更新停止を保証する

**Checkpoint**: US2 単体で押下時停止仕様が成立

---

## Phase 5: User Story 3 - 既存の時間切れ体験を維持する (Priority: P3)

**Goal**: 15秒化後も時間切れ時の不正解体験を既存と同一に保つ  
**Independent Test**: 未回答15秒経過で通常不正解と同一モーダルが1回だけ表示されることを確認

### Tests for User Story 3

- [x] T014 [P] [US3] 競合時の時間切れ優先と重複確定防止テストを `app/quiz/page.test.tsx` に追加する

### Implementation for User Story 3

- [x] T015 [US3] `app/quiz/page.tsx` で押下と時間切れ同時発火時の優先順位を時間切れ優先に統一する
- [x] T016 [US3] `app/quiz/page.tsx` で同一問題のモーダル重複表示防止を最終調整する

**Checkpoint**: US3 単体で既存時間切れ体験の維持が確認できる

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 契約・手順・最終確認の整合

- [x] T017 `specs/001-adjust-timer-stop/contracts/timer-adjustment.graphql` を実装挙動に合わせて最終更新する
- [x] T018 [P] `specs/001-adjust-timer-stop/quickstart.md` の検証手順を実装結果で更新する
- [x] T019 [P] `specs/001-adjust-timer-stop/research.md` に最終決定ログを追記する

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
- Phase 2 完了まで US 作業開始不可
- Phase 6 は全US完了後に実施

### User Story Dependencies

- **US1 (P1)**: Foundational 後すぐ開始、MVP
- **US2 (P2)**: US1 の判定処理を利用するため US1 後が推奨
- **US3 (P3)**: US1/US2 の停止・判定制御に依存するため最後に実施

### Within Each User Story

- テストタスク → 実装タスクの順
- `app/quiz/page.tsx` と `app/quiz/page.test.tsx` の編集競合を避け直列実行を基本

### Parallel Opportunities

- Phase 2: `T005` と `T006`
- Story test tasks: `T007`, `T011`, `T014`
- Phase 6: `T018`, `T019`

---

## Parallel Example: User Story 2

```bash
Task: "解答押下後のタイマー停止と残り時間固定のテストを app/quiz/page.test.tsx に追加する"
Task: "app/quiz/page.tsx でモーダル表示中の残り時間更新停止を保証する"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1,2 を完了
2. US1（T007-T010）を実装
3. 15秒ルールのみ先に検証して MVP とする

### Incremental Delivery

1. MVP（US1）完成
2. US2 で押下時停止を追加
3. US3 で競合処理と既存体験維持を仕上げる
4. Phase 6 でドキュメント整合

### Parallel Team Strategy

1. 1名が `app/quiz/page.tsx` 実装
2. 別担当が `app/quiz/page.test.tsx` のテスト整備
3. 最終段で契約/quickstart/research を分担更新

---

## Notes

- すべてのタスクはチェックボックス、ID、必要ラベル、ファイルパスを満たす
- `[P]` は依存と編集競合を考慮して付与
- 中心実装ファイルは `app/quiz/page.tsx`
