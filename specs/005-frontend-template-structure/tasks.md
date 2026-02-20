# Tasks: フロントエンドのフォルダ構成をテンプレートに合わせる

**Input**: Design documents from `specs/005-frontend-template-structure/`  
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md  
**トップページ要件**: [001-top-page/spec.md](../001-top-page/spec.md)

**Tests**: 仕様で明示的なテスト要求はない。Constitution II に従いミニマムのテストは Polish で検討可。

**Organization**: Plan の Phase A（テンプレート構築）→ Phase B（shadcn）→ Phase C（トップページ）の順。US1＝構成一致、US2＝ビルド・デプロイ・トップ表示。

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: 他タスクに依存せず並列実行可能
- **[Story]**: US1（テンプレート同一構成）, US2（ビルド・デプロイ・トップ表示）
- 説明にファイルパスを含める

## Path Conventions

- リポジトリルート = アプリルート: `app/`, `public/`, `package.json`, `next.config.js`, `tsconfig.json`, `next-env.d.ts`, `amplify.yml`
- 既存の frontend 配下は移行元。移行後は `frontend/` を廃止または整理対象。

---

## Phase 1: Setup

**Purpose**: 移行前の確認と作業の準備

- [x] T001 Confirm current branch is 005-frontend-template-structure and frontend/ exists with app (or src/app), public, package.json, next.config.js at frontend/
- [x] T002 Create backup or branch checkpoint before moving frontend assets to root (optional; git commit before migration suffices)

---

## Phase 2: Foundational (Phase A — テンプレートどおりのフロントエンド構築)

**Purpose**: frontend をリポジトリルートへ移し、テンプレートと同一のディレクトリ構成にし、ビルドが通る状態にする。ここが完了するまで US1 の検証と Phase B/C に進めない。

**⚠️ CRITICAL**: この Phase を完了するまで shadcn 導入・トップページ実装は行わない

- [x] T003 Move frontend app (or src/app) to repository root as app/ so that app/layout.tsx and app/page.tsx exist at root (create app/ at root, copy or move frontend/src/app/* or frontend/app/* into root app/)
- [x] T004 Move frontend/public to repository root as public/ (create public/ at root, copy frontend/public contents; create public/images if needed for later banner)
- [x] T005 Copy frontend/next.config.js, frontend/tsconfig.json, frontend/next-env.d.ts to repository root (overwrite or merge with existing; ensure root has next.config.js, tsconfig.json, next-env.d.ts)
- [x] T006 Merge frontend/package.json into root package.json: add Next.js scripts (dev, build, start, lint) and frontend dependencies; keep root prepare (husky) if present; ensure single package.json at root with Next + husky
- [x] T007 Copy or regenerate frontend/package-lock.json to root (run npm install at root after T006 to produce root package-lock.json)
- [x] T008 Update amplify.yml at repository root: frontend build at root (preBuild: npm ci, build: npm run build), artifacts baseDirectory .next, cache paths .next/cache/**/*, node_modules/**/*, .npm/**/*
- [x] T009 Ensure minimal app/page.tsx and app/layout.tsx at root so that npm run build succeeds (placeholder content is acceptable)
- [x] T010 Run npm install and npm run build at repository root; fix any path or config errors until build succeeds

**Checkpoint**: ルート直下に app/, public/, package.json, next.config.js, tsconfig.json, next-env.d.ts があり、npm run build が成功する

---

## Phase 3: User Story 1 — テンプレートと同一のディレクトリ構成 (P1) 🎯 MVP

**Goal**: テンプレート（amplify-next-template）と同一のディレクトリ・ファイル配置になっていること

**Independent Test**: ルート直下に app/, public/, 設定ファイルがあり、テンプレート一覧と照合して一致する

- [x] T011 [US1] Verify root has app/, public/, package.json, next.config.js, tsconfig.json, next-env.d.ts matching template layout (specs/005-frontend-template-structure/quickstart.md)
- [x] T012 [US1] Remove or archive frontend/ directory so that app is only at root (optional: delete frontend/ after confirming root build and run work)

**Checkpoint**: US1 を満たす。テンプレートと構成が一致している

---

## Phase 4: User Story 2 — ビルド・デプロイの継続とトップページ (P2)

**Purpose**: shadcn 導入と 001 仕様のトップページ実装。ビルド・デプロイが成功し、トップが表示される

**Goal**: 構成変更後もビルドとデプロイが成功し、トップページ（緑背景・バナー・スタートボタン）が表示・動作すること

**Independent Test**: ルートで npm run build 成功、発行URLでトップが表示され、001 の Acceptance Scenarios を満たす

### Phase B: shadcn

- [x] T013 [US2] Run npx shadcn@latest init at repository root and accept defaults or configure for Next.js App Router (components.json and components/, lib/utils.ts etc. at root)
- [x] T014 [US2] Add shadcn Button component: npx shadcn@latest add button at root (file: components/ui/button.tsx)

### Phase C: トップページ（001 仕様）

- [x] T015 [US2] Implement top page in app/page.tsx per specs/001-top-page/spec.md: green background (mahjong-style), banner image area, Start button using shadcn Button (file: app/page.tsx)
- [x] T016 [US2] Place top-banner.png in public/images/top-banner.png and reference from app/page.tsx (e.g. next/image src="/images/top-banner.png"); handle missing image per 001 Edge Cases (file: public/images/top-banner.png, app/page.tsx)
- [x] T017 [US2] Wire Start button to navigation (next screen or placeholder route per 001 FR-004) in app/page.tsx
- [x] T018 [US2] Run npm run build at root and verify success; optionally run dev and confirm top page renders with green bg, banner, start button

**Checkpoint**: US2 を満たす。ビルド成功、トップページ表示・スタート操作可能

---

## Phase 5: Polish & Cross-Cutting

**Purpose**: ドキュメント、Amplify 検証、PR（Constitution IV）

- [x] T019 Update specs/005-frontend-template-structure/quickstart.md with any path or step changes after migration
- [ ] T020 Verify Amplify: ensure Amplify app root directory is set to repository root (or empty); trigger deploy and confirm deploy succeeds and app URL shows top page (SC-003)
- [ ] T021 Create pull request for branch 005-frontend-template-structure (Constitution IV: use .env GITHUB_TOKEN for gh pr create if using CLI)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 依存なし
- **Phase 2 (Foundational)**: Phase 1 の後。T003〜T010 は順序を守る（移行 → 設定 → ビルド確認）
- **Phase 3 (US1)**: Phase 2 完了後。T011, T012 は T010 の後
- **Phase 4 (US2)**: Phase 3 完了後。T013 → T014 → T015〜T018
- **Phase 5 (Polish)**: Phase 4 完了後

### User Story Dependencies

- **US1 (P1)**: Phase 2 の実施で達成。Phase 3 で検証・整理
- **US2 (P2)**: Phase 4 で shadcn とトップページ実装、ビルド・表示確認

### Parallel Opportunities

- T011 と T012 は Phase 3 内で順不同（検証と frontend/ 整理）
- 同一ファイルを触るため Phase 2 は直列推奨

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: 確認のみ
2. Phase 2: テンプレート構成へ移行しビルド成功
3. Phase 3: 構成の検証
4. **STOP and VALIDATE**: ルートでビルドが通り、テンプレートと構成が一致していることを確認

### Incremental Delivery

1. Phase 2 完了 → テンプレート構成・ビルド成功（US1 達成）
2. Phase 4 完了 → shadcn + トップページ、ビルド・表示確認（US2 達成）
3. Phase 5 → ドキュメント・Amplify・PR

---

## Notes

- frontend/ の削除（T012）は、ルートで開発・ビルドが安定してから行うと安全
- 001 のバナー画像がプロジェクトに無い場合は、プレースホルダまたは 001 Edge Case に従い画像なしでも表示・スタート操作可能にする
- Constitution IV: タスク完了時に PR 作成まで含める。GitHub トークンは .env の GITHUB_TOKEN を使用する
