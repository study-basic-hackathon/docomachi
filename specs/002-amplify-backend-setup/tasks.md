# Tasks: バックエンドの構築

**Input**: Design documents from `specs/002-amplify-backend-setup/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: 仕様で明示的にテストは要求されていないため、テストタスクは含めない。

**Organization**: User story ごとにタスクをグループ化し、各ストーリーを独立して実装・検証できるようにする。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並行実行可能（別ファイル、依存なし）
- **[Story]**: ユーザーストーリー（US1, US2, US3）
- 説明にファイルパスを明示する

## Path Conventions

- バックエンド: リポジトリルートの `amplify/`（plan.md に準拠）
- 既存: `frontend/`, ルート `package.json`, `.husky/`

---

## Phase 1: Setup (共有インフラ)

**Purpose**: プロジェクト初期化と amplify ディレクトリの用意

- [x] T001 Create amplify directory structure per plan: `amplify/`, `amplify/auth/`, `amplify/data/`
- [x] T002 Add `amplify/package.json` with @aws-amplify/backend and TypeScript dependencies (see research.md)

---

## Phase 2: Foundational (全 User Story の前提)

**Purpose**: いずれの User Story も、この Phase が完了するまで着手しない

**⚠️ CRITICAL**: この Phase が終わるまで User Story の実装は開始しない

- [x] T003 [P] Create `amplify/auth/resource.ts` with defineAuth() default (email/password) per research.md and contracts
- [x] T004 [P] Create `amplify/data/resource.ts` with defineData() and Docomachi model (partition key id UUID only) per data-model.md and contracts/docomachi-schema.md
- [x] T005 Create `amplify/backend.ts` with defineBackend({ auth, data }) wiring auth and data resources
- [x] T006 Verify backend build (e.g. build or typecheck in amplify/ or from root per quickstart.md)

**Checkpoint**: バックエンドの土台がビルド可能な状態。US2・US3 の仕上げに進める。

---

## Phase 3: User Story 1 - バックエンド基盤の用意 (Priority: P1) 🎯 MVP

**Goal**: クラウドバックエンド用の設定・コードがリポジトリに含まれ、ローカルでビルド・検証できる状態にする。

**Independent Test**: リポジトリ内に `amplify/` の定義が存在し、`amplify/` またはルートからビルド・検証がエラーなく完了する（デプロイは行わない）。

### Implementation for User Story 1

- [x] T007 [US1] Ensure quickstart.md steps for "バックエンド定義のビルド・検証" are applicable to current `amplify/` layout and document any env or command in `specs/002-amplify-backend-setup/quickstart.md`

**Checkpoint**: User Story 1 が単体で検証可能な状態。

---

## Phase 4: User Story 2 - 認証機能の利用準備 (Priority: P2)

**Goal**: デフォルトの認証（サインアップ・サインイン等）がコードで有効になる定義が含まれるようにする。

**Independent Test**: `amplify/auth/resource.ts` にデフォルト認証の定義があり、仕様書またはコメントから「デフォルト認証」の範囲が分かる（SC-002）。

### Implementation for User Story 2

- [x] T008 [US2] Add comment or short doc in `amplify/auth/resource.ts` (or amplify/README) clarifying that default auth (email/password, Cognito) is used per spec SC-002

**Checkpoint**: User Story 2 の受け入れ条件（認証定義の明確化）を満たしている。

---

## Phase 5: User Story 3 - アプリ用データストアの定義 (Priority: P3)

**Goal**: docomachi 用テーブルが定義され、パーティションキーが UUID であることを確認・明示する。

**Independent Test**: `amplify/data/resource.ts` に Docomachi モデルが定義され、パーティションキーが UUID（id）であることが定義ファイルまたはコメントから確認できる（SC-003）。

### Implementation for User Story 3

- [x] T009 [US3] Ensure Docomachi model in `amplify/data/resource.ts` has partition key as UUID (id) only per data-model.md; add brief comment referencing specs/002-amplify-backend-setup/contracts/docomachi-schema.md if helpful

**Checkpoint**: User Story 3 の受け入れ条件（docomachi テーブル・UUID PK）を満たしている。

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 複数ストーリーにまたがる仕上げと完了条件の充足

- [x] T010 [P] Update `specs/002-amplify-backend-setup/quickstart.md` if any steps changed during implementation (paths, commands)
- [x] T011 Run quickstart.md validation: clone/install/build steps complete without deploy (FR-005, SC-001)
- [ ] T012 Create pull request for branch 002-amplify-backend-setup per FR-006 and SC-005 (implementation complete, no post-merge console steps in scope)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 依存なし。即時開始可能。
- **Phase 2 (Foundational)**: Phase 1 完了後に開始。全 User Story をブロックする。
- **Phase 3 (US1)**: Phase 2 完了後に開始。他ストーリーに依存しない。
- **Phase 4 (US2)**: Phase 2 完了後に開始。US1 と並行可能（認証は T003 で実装済み、T008 はドキュメント・コメント）。
- **Phase 5 (US3)**: Phase 2 完了後に開始。US1 と並行可能（データは T004 で実装済み、T009 は確認・コメント）。
- **Phase 6 (Polish)**: 希望する User Story がすべて完了してから開始。

### User Story Dependencies

- **User Story 1 (P1)**: Phase 2 完了後に検証・ドキュメント（T007）で完了。他ストーリーに依存しない。
- **User Story 2 (P2)**: Phase 2 の T003 で認証実装済み。T008 で仕様に沿った明示化。
- **User Story 3 (P3)**: Phase 2 の T004 でデータ実装済み。T009 で仕様に沿った確認・コメント。

### Parallel Opportunities

- T003 と T004 は別ファイルのため [P] で並行可能。
- Phase 3・4・5 の T007, T008, T009 はそれぞれ独立して実施可能（順不同可）。
- T010 は他タスクと並行可能。

---

## Parallel Example: Phase 2

```bash
# Phase 2 で同時に実行可能:
Task T003: "Create amplify/auth/resource.ts with defineAuth() default"
Task T004: "Create amplify/data/resource.ts with defineData() and Docomachi model"
# 完了後: T005 backend.ts, 続けて T006 ビルド検証
```

---

## Implementation Strategy

### MVP First (User Story 1 まで)

1. Phase 1: Setup 完了
2. Phase 2: Foundational 完了（T003〜T006）
3. Phase 3: User Story 1 の検証・ドキュメント（T007）
4. **STOP and VALIDATE**: ビルド・検証が quickstart に沿って完了することを確認
5. 必要なら Phase 6 の T012 まで進めて PR 作成

### Incremental Delivery

1. Phase 1 + Phase 2 → バックエンドがビルド可能な状態（US1 実質完了）
2. Phase 3 (T007) → US1 の独立した検証条件を満たす
3. Phase 4 (T008) → US2 の認証の明示化
4. Phase 5 (T009) → US3 のデータモデルの明示化
5. Phase 6 → quickstart 更新・検証・PR

### Parallel Team Strategy

- Phase 2: 担当 A が T003 (auth)、担当 B が T004 (data) を並行。その後 T005, T006 を実施。
- Phase 3〜5: T007, T008, T009 は別ファイル・別関心のため、1 人でも並行して実施可能。

---

## Notes

- [P] タスク = 別ファイルで依存なし。
- [Story] ラベルで仕様の User Story と対応付け。
- 各 User Story は独立して完了・検証可能。
- 仕様でテストは要求されていないため、テストタスクは未追加。
- コミットはタスク単位または論理的なまとまりで実施推奨。
- デプロイは行わず、PR 作成までが完了条件（FR-006, SC-005）。
