# Tasks: 初回デプロイ失敗の修正

**Input**: Design documents from `specs/003-fix-initial-deploy/`  
**Prerequisites**: plan.md, spec.md

**Tests**: 仕様で明示されていないためテストタスクは含めない。検証は手動（Amplify コンソールでのデプロイ実行・URL 確認）。

**Organization**: User Story 単位で整理。Phase 2 で amplify.yml 追加（全ストーリーの前提）、Phase 3/4 で US1・US2 の検証とキャッシュ対応。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 他タスクに依存せず並列実行可能
- **[Story]**: 属するユーザーストーリー（US1, US2）
- 説明にファイルパスを含める

## Path Conventions

- リポジトリルート: `amplify.yml`, `package.json`, `frontend/`, `amplify/`
- フロントエンド: `frontend/`, ビルド出力 `frontend/.next/`

---

## Phase 1: Setup（事前確認）

**Purpose**: ローカルでフロントエンドがビルドでき、成果物の場所を確認する

- [x] T001 Run frontend build locally and confirm output directory at frontend/.next (e.g. `cd frontend && npm run build` then verify `frontend/.next` exists)

---

## Phase 2: Foundational（全ストーリーの前提）

**Purpose**: Amplify がフロントエンドを正しくビルドし成果物を参照できるようにする。ここが完了するまで US1/US2 の検証はできない。

**⚠️ CRITICAL**: この Phase を完了するまでデプロイ成功は確認できない

- [x] T002 Create amplify.yml at repository root with frontend build configuration: preBuild (install deps in frontend, e.g. `cd frontend && npm ci` or `npm install`), build (`cd frontend && npm run build`), artifacts baseDirectory `frontend/.next` and files `**/*`, so that Amplify no longer expects default `dist`

**Checkpoint**: amplify.yml が存在し、ビルドコマンドと成果物パスが frontend/.next と一致している状態

---

## Phase 3: User Story 1 - 初回デプロイの成功 (Priority: P1) 🎯 MVP

**Goal**: 初回デプロイが「Artifact directory doesn't exist」で失敗せず完了し、発行URLでアプリが表示されること

**Independent Test**: Amplify コンソールでデプロイを1回実行し、ログにエラーが出ずデプロイ完了し、発行URLでアプリが表示される

### Implementation for User Story 1

- [x] T003 [US1] Verify amplify.yml frontend section: build runs from frontend context and artifacts.baseDirectory is frontend/.next (file: amplify.yml)
- [x] T004 [US1] Document first-deploy verification steps (e.g. in specs/003-fix-initial-deploy/quickstart.md or README): trigger deploy from Amplify console, confirm no "Artifact directory doesn't exist" in logs, open app URL and confirm top page loads

**Checkpoint**: User Story 1 を単体で検証できる（初回デプロイ成功・URLで表示確認）

---

## Phase 4: User Story 2 - 再デプロイの安定動作 (Priority: P2)

**Goal**: 2回目以降のデプロイも同様に成功し、アプリが利用可能な状態が維持されること

**Independent Test**: 初回デプロイ成功後、軽微な変更をプッシュして再デプロイを実行し、同様に成功する

### Implementation for User Story 2

- [x] T005 [P] [US2] Add cache configuration to amplify.yml (e.g. cache.paths: frontend/.next/cache/**/*, frontend/node_modules/**/*, .npm/**/*) for stable and faster re-deploys (file: amplify.yml)
- [x] T006 [US2] Document re-deploy verification: push a small change, trigger deploy, confirm build and deploy complete without "Artifact directory doesn't exist" (file: specs/003-fix-initial-deploy/quickstart.md or same as T004)

**Checkpoint**: User Story 1 と 2 の両方が満たされている（初回・再デプロイとも成功）

---

## Phase 5: Polish & Cross-Cutting

**Purpose**: ドキュメント整備と最終確認。Constitution IV に従い PR 作成までをタスクに含める。

- [x] T007 Run full verification per quickstart: clone/install/build (local), then deploy via Amplify console and confirm SC-001, SC-002, SC-003 (no artifact error, app URL loads, re-deploy works)
- [ ] T008 Create pull request for this feature branch (Constitution IV: タスクにはプルリクエストの作成までを含める)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 依存なし
- **Phase 2 (Foundational)**: Phase 1 の確認後でよい。T002 が全ストーリーのブロッカー
- **Phase 3 (US1)**: Phase 2 完了後。T003, T004 は T002 に依存
- **Phase 4 (US2)**: Phase 2 完了後。T005 は [P] で T003 と並列可能。T006 は T005 の後
- **Phase 5 (Polish)**: 全 Phase 完了後。T008 は T007 の後（検証完了後に PR 作成）

### User Story Dependencies

- **US1 (P1)**: Phase 2 完了後に実施。他ストーリーに依存しない
- **US2 (P2)**: Phase 2 完了後に実施。US1 と並列可能（T005 は [P]）。再デプロイ検証は US1 初回成功後

### Parallel Opportunities

- T005 [P] は Phase 2 完了後、T003 と並列可能
- 同一ファイル（amplify.yml）を触るため、T002 と T005 は順序を守る（T002 → T005）

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: T001 でローカルビルド確認
2. Phase 2: T002 で amplify.yml 追加
3. Phase 3: T003, T004 で設定確認と初回デプロイ検証手順の記載
4. **STOP and VALIDATE**: Amplify で初回デプロイを実行し、URL でアプリ表示を確認

### Incremental Delivery

1. Phase 1 + 2 → amplify.yml で成果物パス一致
2. Phase 3 → 初回デプロイ成功（MVP）
3. Phase 4 → キャッシュ追加と再デプロイ検証
4. Phase 5 → 全体の quickstart 検証（T007）、PR 作成（T008、Constitution IV）

---

## Notes

- [P] タスクは他タスクとファイルが重ならず依存がなければ並列可能
- [Story] はトレーサビリティ用。本機能は実装タスクが少ないため、検証・ドキュメントでストーリーを区別
- 仕様にテストタスクの要求がないため、検証は手動（Amplify コンソールとブラウザ）
- quickstart.md は存在しなければ T004/T006 で作成、既存なら追記
- **Constitution IV**: タスク完了の定義に「プルリクエストの作成まで」を含む。T008 で明示。
