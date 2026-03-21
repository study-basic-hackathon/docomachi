---
description: "Task list for 001-project-readme (Japanese root README + screenshots)"
---

# Tasks: プロジェクト README

**Input**: Design documents from `/Users/honda/dev/docomachi/specs/001-project-readme/`  
**Prerequisites**: [plan.md](/Users/honda/dev/docomachi/specs/001-project-readme/plan.md), [spec.md](/Users/honda/dev/docomachi/specs/001-project-readme/spec.md), [research.md](/Users/honda/dev/docomachi/specs/001-project-readme/research.md), [data-model.md](/Users/honda/dev/docomachi/specs/001-project-readme/data-model.md), [contracts/README.md](/Users/honda/dev/docomachi/specs/001-project-readme/contracts/README.md)

**Tests**: 仕様に自動テストの要求なし。受け入れはレビューと [quickstart.md](/Users/honda/dev/docomachi/specs/001-project-readme/quickstart.md) の手動確認。

**Organization**: ユーザーストーリー（P1→P3）ごとにフェーズ分割。成果物は主に `/Users/honda/dev/docomachi/README.md` と `/Users/honda/dev/docomachi/doc/readme/screenshots/`。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 別ファイル中心で同時進行可能
- **[Story]**: US1 / US2 / US3 = spec.md のユーザーストーリー順

## Path Conventions

- リポジトリルート: `/Users/honda/dev/docomachi/`
- README: `/Users/honda/dev/docomachi/README.md`
- スクリーンショット: `/Users/honda/dev/docomachi/doc/readme/screenshots/`
- 依存情報源: `/Users/honda/dev/docomachi/package.json`

---

## Phase 1: Setup (共有インフラ)

**Purpose**: README 用アセット置き場の用意

- [x] T001 Create directory and track empty folder via `/Users/honda/dev/docomachi/doc/readme/screenshots/.gitkeep`

---

## Phase 2: Foundational（他ストーリーの前提）

**Purpose**: 英語スターター README を要件（FR-006）に合う日本語ドキュメント骨格へ置き換え、以降の追記を可能にする

**⚠️ CRITICAL**: このフェーズ完了までユーザーストーリー別の本文追記を開始しない

- [x] T002 Replace content of `/Users/honda/dev/docomachi/README.md` with a Japanese-only skeleton: project H1 title, and empty or stub `##` sections for このアプリについて / 開発と仕様（Speckit） / インフラ（AWS Amplify Gen 2） / 技術スタック / 画面キャプチャ（stub は日本語1行で可）。既存の英語 Amplify スターター本文は削除する（[research.md](/Users/honda/dev/docomachi/specs/001-project-readme/research.md) 参照）

**Checkpoint**: ルート README が日本語見出し構造のみになり、英語のみの段落が残っていないこと

---

## Phase 3: User Story 1 - 初見の読者がアプリの目的を理解する (Priority: P1) 🎯 MVP

**Goal**: FR-001（目的・価値・誰のためか）を日本語で README に記載する

**Independent Test**: 仕様の Independent Test — 不慣れなレビュアーに `/Users/honda/dev/docomachi/README.md` のみ渡し、主目的を日本語1文で言語化できるか確認

### Implementation for User Story 1

- [x] T003 [US1] Edit `/Users/honda/dev/docomachi/README.md` under the section 「このアプリについて」 to fully satisfy FR-001 and FR-006（説明は日本語。麻雀・待ち牌クイズ等、憲法 Purpose と整合）

**Checkpoint**: P1 相当の内容が単体でレビュー可能

---

## Phase 4: User Story 2 - 開発・運用の前提（Speckit・Amplify）が伝わる (Priority: P2)

**Goal**: FR-002（Speckit）と FR-003（AWS Amplify Gen 2）を同一 README に明示する

**Independent Test**: `/Users/honda/dev/docomachi/README.md` に Speckit と Amplify Gen 2 の記述があることをチェックリストで確認

### Implementation for User Story 2

- [x] T004 [US2] Edit `/Users/honda/dev/docomachi/README.md` in section 「開発と仕様（Speckit）」 to satisfy FR-002（`/speckit.specify` 等の実際のコマンド名、`specs/` や `.specify/` への言及を含む）
- [x] T005 [US2] Edit `/Users/honda/dev/docomachi/README.md` in section 「インフラ（AWS Amplify Gen 2）」 to satisfy FR-003（Next.js / AppSync / DynamoDB 等、憲法 I と整合する短い説明）

**Checkpoint**: P2 の受け入れシナリオを README だけで満たせる

---

## Phase 5: User Story 3 - 技術スタックと画面イメージを把握する (Priority: P3)

**Goal**: FR-004（主要スタック）と FR-005（スクリーンショット1枚以上）を満たす

**Independent Test**: `/Users/honda/dev/docomachi/package.json` 由来の要約節があること、かつ `/Users/honda/dev/docomachi/doc/readme/screenshots/` 内の画像が README から相対パスで参照されていること

### Implementation for User Story 3

- [x] T006 [P] [US3] Capture at least one user-facing UI screenshot and save as `/Users/honda/dev/docomachi/doc/readme/screenshots/main-screen.png`（`npm run dev` は `/Users/honda/dev/docomachi` で実行。個人情報が写り込まないこと）
- [x] T007 [P] [US3] Edit `/Users/honda/dev/docomachi/README.md` in section 「技術スタック」 to satisfy FR-004 using `/Users/honda/dev/docomachi/package.json`（主要依存のみ日本語短説明、全文は package.json 参照の方針を明記）
- [x] T008 [US3] Edit `/Users/honda/dev/docomachi/README.md` in section 「画面キャプチャ」 to satisfy FR-005 with Markdown image syntax pointing to `/Users/honda/dev/docomachi/doc/readme/screenshots/main-screen.png`（実ファイル名に合わせてよい）

**Checkpoint**: SC-002 の技術・画像要素が揃う

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 言語要件の最終確認と手順どおりの検証

- [x] T009 Review entire `/Users/honda/dev/docomachi/README.md` for FR-006（英語のみ段落・英語主体の並記がないこと）と内部リンク・見出しの一貫性
- [x] T010 Execute manual validation steps in `/Users/honda/dev/docomachi/specs/001-project-readme/quickstart.md`（画像パス、必須節の充足）

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: 先行可能
- **Phase 2**: Phase 1 完了後（`doc/readme/screenshots/` が存在すること）
- **Phase 3〜5**: Phase 2 完了後
- **Phase 6**: Phase 5 完了後

### User Story Dependencies

- **US1**: Phase 2 後。他ストーリーに依存しない
- **US2**: Phase 2 後。US1 と同一ファイルのため、コンフリクト回避のため実務上は US1 の直後推奨
- **US3**: Phase 2 後。T008 は T006 の出力ファイル名に依存。T007 は T006 と並行可能（[P]）

### Within User Story 3

- T006 と T007 は並行可（別ファイル）
- T008 は T006 完了後（画像パス確定後）

### Parallel Opportunities

- **US3**: T006（画像ファイル）と T007（README の技術スタック節）を並行実行可能
- **Phase 1〜2**: 原則単一タスクのため並列度は低い

---

## Parallel Example: User Story 3

```bash
# 並行例（別担当・別ファイル）:
# Task T006: ローカルでアプリを起動し /Users/honda/dev/docomachi/doc/readme/screenshots/main-screen.png を保存
# Task T007: 同時に /Users/honda/dev/docomachi/README.md の「技術スタック」節を /Users/honda/dev/docomachi/package.json 基準で執筆

# T006 完了後:
# Task T008: README に画像 Markdown を追加（T006 で確定したファイル名に合わせる）
```

---

## Implementation Strategy

### MVP First（User Story 1 のみの中間成果）

1. Phase 1 + Phase 2 を完了
2. Phase 3（US1）のみ完了 → **早期レビュー用**（FR-002〜005 は未充足のためリリース完了ではない）
3. 仕様上の完了には Phase 4〜6 が必要

### Incremental Delivery

1. Setup + Foundational → 日本語 README 骨格
2. + US1 → プロダクト説明のみ明確化
3. + US2 → 開発・インフラ文脈を追加
4. + US3 → スタックと画面キャプチャを追加
5. Polish → FR-006 と quickstart 手動検証

### Parallel Team Strategy

- Phase 2 までを共有で完了後、README は同一ファイルのため **原則は1担当が順に T003→T004→T005** が安全
- US3 のみ T006 と T007 を分割可能

---

## Notes

- contracts: API 変更なし（[/Users/honda/dev/docomachi/specs/001-project-readme/contracts/README.md](/Users/honda/dev/docomachi/specs/001-project-readme/contracts/README.md)）
- コミットはタスク単位または論理まとまりごと。憲法 IV に従い PR 説明は日本語
- 画像ファイル名を `main-screen.png` 以外にした場合は T008 のパス表記を一致させる
