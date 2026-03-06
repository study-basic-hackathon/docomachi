# Tasks: Screen Layout and Visual Polish

**Input**: Design documents from `specs/007-frontend-design/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: 計画方針「テストまで終えたら PR を発行する」に従い、Polish フェーズでミニマムなテストを追加する（憲法: ミニマムのテストケースのみ）。

**Organization**: User Story 単位でフェーズ分けし、各ストーリーを独立して実装・検証できるようにする。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（別ファイル・他タスクへの依存なし）
- **[Story]**: ユーザーストーリー（US1, US2, US3, US4）
- 説明に具体的なファイルパスを含める

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 依存関係と shadcn/Sonner の準備

- [x] T001 [P] Install Sonner and add to package.json (`npm install sonner` at repo root)
- [x] T002 [P] Ensure shadcn/ui is ready: run `npx shadcn@latest init` if components.json does not exist (repo root)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 全ユーザーストーリーで使うローディング・トースト・テーマの基盤

**⚠️ CRITICAL**: このフェーズ完了までユーザーストーリーの実装を開始しない

- [x] T003 Create LoadingOverlay component (fixed full-screen overlay + spinner + optional text) in components/ui/LoadingOverlay.tsx
- [x] T004 Add Sonner Toaster to root layout in app/layout.tsx
- [x] T005 Apply global green-tone background and base center alignment in app/app.css and app/layout.tsx

**Checkpoint**: 基盤完了。ここから US1〜US4 の実装に進める。

---

## Phase 3: User Story 1 - Consistent Visual Identity (Priority: P1) 🎯 MVP

**Goal**: 緑系背景・中央寄せ・待ち牌の色別改行・領域内スクロールで、麻雀マット風の一貫した見た目を実現する。

**Independent Test**: アプリを開き、緑系背景と中央寄せを確認。クイズ画面で待ち牌が萬・索・筒・字牌ごとに改行され、はみ出し時はその領域内でスクロールできることを確認する。

### Implementation for User Story 1

- [x] T006 [US1] Apply green-tone background to all main screens in app/layout.tsx and app/app.css
- [x] T007 [US1] Ensure main content is center-aligned in app/page.tsx and app/quiz/page.tsx
- [x] T008 [US1] Group wait tiles by suit (萬・索・筒・字牌) with line breaks between groups in components/AnswerPicker.tsx
- [x] T009 [US1] Add overflow-auto and max-height to wait-tile container so content scrolls within area in components/AnswerPicker.tsx

**Checkpoint**: User Story 1 が単体で動作・確認できる状態。

---

## Phase 4: User Story 2 - Top Banner and Button Layout (Priority: P2)

**Goal**: トップに top-banner.png を表示し、ボタンは整列・グルーピング。非同期処理時はオーバーレイでローディング、失敗時はトーストで通知する。

**Independent Test**: トップでバナーとボタン配置を確認。スタート押下でオーバーレイローディング→クイズへ。クイズで問題取得中はオーバーレイ、失敗時はローディングを消してトースト表示を確認する。

### Implementation for User Story 2

- [x] T010 [P] [US2] Add top banner image (public/top-banner.png) to top page in app/page.tsx
- [x] T011 [US2] Show LoadingOverlay when navigating from top to quiz in app/page.tsx
- [x] T012 [US2] Replace quiz initial "読み込み中..." with LoadingOverlay in app/quiz/page.tsx
- [x] T013 [US2] On quiz load failure or timeout, dismiss LoadingOverlay and show Sonner toast in app/quiz/page.tsx
- [x] T014 [P] [US2] Align and group buttons by function on top and quiz pages in app/page.tsx and app/quiz/page.tsx

**Checkpoint**: User Story 2 が単体で動作・確認できる状態。

---

## Phase 5: User Story 3 - Atari Tile Selection Feedback (Priority: P3)

**Goal**: 待ち牌選択時に、選択中タイルを border や ring で明確に強調する。

**Independent Test**: クイズの待ち牌選択でタイルを選び、選択中が視覚的に強調され、別タイルを選ぶと前の強調が外れることを確認する。

### Implementation for User Story 3

- [x] T015 [US3] Enhance selected tile visual emphasis (e.g. distinct border color or ring) in components/AnswerPicker.tsx

**Checkpoint**: User Story 3 が単体で動作・確認できる状態。

---

## Phase 6: User Story 4 - Smartphone Landscape Orientation (Priority: P4)

**Goal**: スマホでは横表示固定（またはレイアウトを横長に）。タブレット・デスクトップでは端末の向きに応じて表示する。

**Independent Test**: スマホ幅で開き、縦持ちでも横長レイアウトまたはロックされること。タブレット以上で向きを変えてもレイアウトが追従することを確認する。

### Implementation for User Story 4

- [x] T016 [US4] Implement smartphone landscape behavior: try Screen Orientation API and add CSS fallback for narrow viewports in app/layout.tsx or a dedicated component
- [x] T017 [US4] Ensure tablet/desktop layout adapts to orientation (responsive / media queries) without locking in app/layout.tsx and relevant pages

**Checkpoint**: User Story 4 が単体で動作・確認できる状態。

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: テスト・検証・PR までを含めた仕上げ

- [ ] T018 Run quickstart.md validation (manual check of all confirmation points)
- [x] T019 [P] Add minimal Jest tests for frontend design (e.g. top page renders banner, quiz shows loading overlay) in scripts/__tests__ or app/__tests__ as per project convention
- [ ] T020 Create pull request for branch 007-frontend-design (PR は日本語で作成)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 依存なし。即開始可能。
- **Phase 2 (Foundational)**: Phase 1 完了後に実施。全ユーザーストーリーの前提。
- **Phase 3–6 (User Stories)**: Phase 2 完了後に実施。US1→US2→US3→US4 の順を推奨（並列も可）。
- **Phase 7 (Polish)**: 対象とするユーザーストーリー実装完了後に実施。

### User Story Dependencies

- **US1 (P1)**: Phase 2 のみ依存。他ストーリーに依存しない。
- **US2 (P2)**: Phase 2 のみ依存。US1 と独立して検証可能。
- **US3 (P3)**: Phase 2 のみ依存。AnswerPicker を触るが US1 完了が前提。
- **US4 (P4)**: Phase 2 のみ依存。layout とスタイルが前提。

### Parallel Opportunities

- Phase 1: T001 と T002 は [P] のため並列可能。
- Phase 2 完了後: US1〜US4 を別担当で並列実装可能。
- Phase 7: T019 は [P]。T018 は手動検証、T020 は最後に実施。

---

## Parallel Example: User Story 1

```bash
# US1 の実装タスク例（順序あり）
# T006 → T007 はレイアウト/ページ、T008 → T009 は AnswerPicker なので、
# T006 と T007 を先に実施し、続けて T008, T009 を実施
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup 完了
2. Phase 2: Foundational 完了
3. Phase 3: User Story 1 完了
4. **STOP and VALIDATE**: US1 の Independent Test で確認
5. 必要ならデプロイ・デモ

### Incremental Delivery

1. Setup + Foundational → 基盤完了
2. US1 実装 → 単体検証 → デモ（MVP）
3. US2 追加 → 単体検証 → デモ
4. US3, US4 同様に追加
5. 各ストーリーで価値を追加し、既存を壊さない

### Parallel Team Strategy

- Phase 1–2 を共有で完了後、US1〜US4 を担当分けして並列実装可能。
- 各ストーリーは独立してテスト・検証できる。

---

## Notes

- [P] タスクは別ファイル・他タスク非依存で並列実行可能。
- [Story] ラベルで仕様のユーザーストーリーと対応させる。
- 各ユーザーストーリーは単体で完了・検証可能にする。
- 憲法に従い、テストはミニマムに留める。
- タスクまたは論理単位ごとにコミットを推奨。
- チェックポイントでストーリー単位の検証を推奨。
