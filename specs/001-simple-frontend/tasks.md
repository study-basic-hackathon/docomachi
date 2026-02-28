# Tasks: 一問フロントエンド（麻雀手牌クイズ）

**Input**: Design documents from `specs/001-simple-frontend/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: 仕様で明示的にテスト要求がないため、テスト専用タスクは含めない。憲法に従いミニマムなテストは実装者が必要に応じて追加する。

**Organization**: ユーザーストーリーごとにタスクをグループ化し、US1 → US2 の順で独立して検証可能にする。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（別ファイル・未完了タスクへの依存なし）
- **[Story]**: ユーザーストーリー（US1, US2）
- 説明には対象ファイルパスを含める

## Path Conventions

- Next.js App Router: `app/`, `components/`, `src/lib/` at repository root
- 牌画像: `public/images/tiles/`（ファイル名＝牌コード）

---

## Phase 1: Setup（共有・初期準備）

**Purpose**: 依存関係とディレクトリの準備

- [x] T001 Add axios to dependencies in package.json and run npm install
- [x] T002 Create app/quiz directory and app/quiz/page.tsx with minimal client component stub (export default, "use client")
- [x] T003 [P] Ensure public/images/tiles exists; add README or comment in plan if tile image filename convention (e.g. {code}.gif) is documented

---

## Phase 2: Foundational（全ユーザーストーリーの前提）

**Purpose**: US1/US2 のどちらにも必要な API と牌順ロジック。ここが完了するまでユーザーストーリー実装を開始しない。

- [x] T004 Implement fetchQuestion in src/lib/api/fetchQuestion.ts: axios POST to AppSync listMahjongHands with Amplify auth, return single MahjongHand item (e.g. items[0] or random), throw on error or empty items
- [x] T005 Implement sortTilesForDisplay (萬子→索子→筒子→字牌 東南西北白發中) in src/lib/mahjong/sortTilesForDisplay.ts (or existing lib); accept TileCode[] and return TileCode[] per data-model.md

**Checkpoint**: API と牌順が用意済み。US1 実装を開始可能。

---

## Phase 3: User Story 1 - クイズを開始する (Priority: P1) 🎯 MVP

**Goal**: トップからスタートで出題画面へ遷移し、バックエンドから1問を取得して手牌を萬・索・筒・字の順で表示し、解答用に全種類の牌を複数選択できるようにする。

**Independent Test**: トップでスタートクリック → 出題画面で手牌と解答エリアが表示され、牌を複数選択できる。取得失敗時はエラーメッセージ＋リトライ・トップへ戻るが表示される。

### Implementation for User Story 1

- [x] T006 [P] [US1] Create TileImage component in components/TileImage.tsx: props tileCode, display image from public/images/tiles/{code}, on missing image show 画像枠＋「読み込み失敗」 (FR-003)
- [x] T007 [P] [US1] Create HandDisplay component in components/HandDisplay.tsx: props tiles (TileCode[]), use sortTilesForDisplay, render list of TileImage in order (FR-004)
- [x] T008 [P] [US1] Create AnswerPicker component in components/AnswerPicker.tsx: render all TileCode values (萬索筒字順), multi-select, controlled selectedTiles, onChange callback (FR-005)
- [x] T009 [US1] Implement app/quiz/page.tsx: on mount call fetchQuestion, manage state loading/error/ready and question (id, tiles, winningTiles); when error show message + リトライ button (re-fetch) + トップへ戻る link (FR-002); when ready render HandDisplay(tiles) and AnswerPicker with selectedTiles state
- [x] T010 [US1] In app/quiz/page.tsx add 「解答する」 button, disabled when selectedTiles.length < 1 (FR-005a); do not implement submit logic yet
- [x] T011 [US1] Update app/page.tsx: change スタート button onClick from router.push('/') to router.push('/quiz') so that start navigates to quiz (FR-001)

**Checkpoint**: US1 完了。トップ→出題画面→手牌・解答エリア表示・解答する無効条件まで動作する。

---

## Phase 4: User Story 2 - 解答を送信して結果を見る (Priority: P2)

**Goal**: 1枚以上選択した状態で「解答する」を押すと、選択と正解を比較し、一致なら正解・不一致なら不正解のモーダルを表示する。モーダル閉じた後は出題画面に留まり、やり直し or 戻るでトップへ戻れる。

**Independent Test**: 出題表示後、正解の牌を選んで解答する → 正解モーダル。不正解の牌を選んで解答する → 不正解モーダル。モーダル閉じると選択をクリアしてやり直し可能、戻るでトップへ。

### Implementation for User Story 2

- [x] T012 [P] [US2] Create ResultModal component in components/ResultModal.tsx: props open, isCorrect (boolean), onClose; use shadcn Dialog, show 正解 or 不正解 message (FR-007, FR-008)
- [x] T013 [US2] Implement correct-answer check in app/quiz/page.tsx: function that compares selectedTiles and winningTiles as sets (same elements, no extra, no missing); return boolean (research: 正解判定はフロント)
- [x] T014 [US2] In app/quiz/page.tsx on 「解答する」 click: run check, set modal state (open + isCorrect), open ResultModal; on ResultModal onClose set modal closed and clear selectedTiles (ready again), keep 戻る link to top (FR-006, FR-009)
- [x] T015 [US2] Add 戻る button/link on app/quiz/page.tsx (when ready or after modal close) that navigates to / so user can return to top (FR-009)

**Checkpoint**: US2 完了。1サイクル（出題→選択→解答→正誤モーダル→閉じる→やり直し or 戻る）が動作する。

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: 動作確認と PR まで（憲法 IV）

- [x] T016 Run quickstart.md: start sandbox, seed doc/seed data, npm run dev, manually verify トップ→スタート→出題→解答→正誤→やり直し/戻る and error リトライ/トップへ戻る
- [x] T017 Create pull request in Japanese (憲法 IV); ensure GITHUB_TOKEN from .env if using GitHub API

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 依存なし。即開始可能。
- **Phase 2 (Foundational)**: Phase 1 完了後に実施。全ユーザーストーリーのブロッカー。
- **Phase 3 (US1)**: Phase 2 完了後に実施。他ストーリーに依存しない。
- **Phase 4 (US2)**: Phase 3 完了後に実施。US1 の出題画面・解答UI に依存。
- **Phase 5 (Polish)**: Phase 4 完了後に実施。

### User Story Dependencies

- **US1 (P1)**: Foundational 完了後のみ開始。他ストーリー不要。
- **US2 (P2)**: US1 完了後。解答する・モーダル・戻るは US1 の quiz ページに追加する形。

### Within Each User Story

- コンポーネント（TileImage, HandDisplay, AnswerPicker / ResultModal）は [P] で並列可能。
- ページ実装（app/quiz/page.tsx）はコンポーネント完了後に統合。

### Parallel Opportunities

- Phase 1: T003 [P]
- Phase 2: T004 と T005 は別ファイルのため順不同で可（T005 は T004 に依存しない）
- Phase 3: T006, T007, T008 [P] を並列。T009–T011 は順序あり（T009 が T006–T008 に依存）。
- Phase 4: T012 [P]。T013–T015 は quiz ページ内で順序あり。
- Phase 5: T016 → T017 の順。

---

## Parallel Example: User Story 1

```bash
# 並列で実施可能:
T006: components/TileImage.tsx
T007: components/HandDisplay.tsx
T008: components/AnswerPicker.tsx

# 上記完了後に順に:
T009: app/quiz/page.tsx (fetch + loading/error/ready + HandDisplay + AnswerPicker)
T010: app/quiz/page.tsx (解答する button, disabled)
T011: app/page.tsx (スタート → /quiz)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup 完了
2. Phase 2: Foundational 完了
3. Phase 3: US1 のみ実装
4. **STOP and VALIDATE**: トップ→スタート→出題画面で手牌・解答エリアが表示され、牌選択で「解答する」が有効になることを確認
5. 必要ならデモ可能

### Incremental Delivery

1. Setup + Foundational → API と牌順が使える状態
2. US1 完了 → 出題表示・解答UI まで検証（MVP）
3. US2 完了 → 正誤モーダル・やり直し・戻るまで検証
4. Polish → quickstart 確認・PR 発行

---

## Notes

- [P] タスクは別ファイルで依存なしのため並列可能。
- [US1]/[US2] でストーリーとタスクの対応を明確化。
- 各ユーザーストーリーは単体で完了・検証可能。
- コミットはタスク単位または論理まとまりで実施。
- チェックポイントで止めてストーリー単位の検証を推奨。
