# Tasks: フロントエンド トップページ

**Input**: Design documents from `/specs/001-top-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Jestを使用したミニマムテストケースを実装します（憲法要件に基づく）。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/`, `frontend/tests/`
- Paths shown below follow the web application structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create frontend directory structure per implementation plan (frontend/src/app/, frontend/src/components/ui/, frontend/public/images/, frontend/tests/app/)
- [x] T002 Initialize Next.js project with App Router in frontend/ directory (if not already initialized)
- [x] T003 [P] Configure ESLint and Prettier in frontend/ with husky integration
- [x] T004 [P] Setup Jest and React Testing Library in frontend/ for testing
- [x] T005 [P] Configure Tailwind CSS in frontend/ for styling (required for shadcn/ui)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Setup shadcn/ui in frontend/ directory (initialize shadcn/ui configuration)
- [x] T007 [P] Configure Next.js Image component optimization settings in frontend/next.config.js
- [x] T008 [P] Setup TypeScript configuration in frontend/tsconfig.json (if not already configured)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - トップページの表示とスタート操作 (Priority: P1) 🎯 MVP

**Goal**: トップページを実装し、緑背景・バナー画像・スタートボタンを表示し、スタート操作で次の画面へ遷移できるようにする。

**Independent Test**: トップページを表示し、緑背景・バナー・スタートボタンの存在を確認し、スタート操作で次へ進めることを検証すれば価値を確認できる。

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T009 [P] [US1] Create test file for top page in frontend/tests/app/page.test.tsx with test for green background display
- [x] T010 [P] [US1] Add test for banner image display in frontend/tests/app/page.test.tsx
- [x] T011 [P] [US1] Add test for start button display and clickability in frontend/tests/app/page.test.tsx
- [x] T012 [P] [US1] Add test for responsive layout in frontend/tests/app/page.test.tsx

### Implementation for User Story 1

- [x] T013 [US1] Move banner image from image/top-banner.png to frontend/public/images/top-banner.png
- [x] T014 [US1] Add shadcn/ui Button component using `npx shadcn-ui@latest add button` command
- [x] T015 [US1] Create top page component in frontend/src/app/page.tsx with green background (bg-green-600 or bg-green-700)
- [x] T016 [US1] Add banner image display using Next.js Image component in frontend/src/app/page.tsx with proper sizing and priority loading
- [x] T017 [US1] Add start button using shadcn/ui Button component in frontend/src/app/page.tsx with appropriate styling
- [x] T018 [US1] Implement navigation logic for start button in frontend/src/app/page.tsx (use Next.js Link or useRouter, placeholder route for now)
- [x] T019 [US1] Add responsive design classes using Tailwind CSS breakpoints in frontend/src/app/page.tsx (mobile and desktop layouts)
- [x] T020 [US1] Add error handling for banner image loading failure in frontend/src/app/page.tsx (fallback display or hide image gracefully)
- [x] T021 [US1] Add prevention for duplicate navigation on start button rapid clicks in frontend/src/app/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T022 [P] Run quickstart.md validation checklist to verify all implementation steps
- [x] T023 [P] Verify all success criteria (SC-001, SC-002, SC-003) are met through manual testing
- [x] T024 [P] Code cleanup and refactoring in frontend/src/app/page.tsx
- [x] T025 [P] Update documentation if needed
- [x] T026 [P] Performance optimization check (image loading, render performance)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3)**: Depends on Foundational phase completion
- **Polish (Phase 4)**: Depends on User Story 1 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within User Story 1

- Tests (T009-T012) MUST be written and FAIL before implementation
- Image setup (T013) before page component (T015)
- shadcn/ui button setup (T014) before button usage (T017)
- Page component creation (T015) before adding elements (T016, T017)
- Navigation logic (T018) after button creation (T017)
- Responsive design (T019) and error handling (T020) after core implementation
- Duplicate click prevention (T021) after navigation logic (T018)

### Parallel Opportunities

- All Setup tasks marked [P] (T003, T004, T005) can run in parallel
- All Foundational tasks marked [P] (T007, T008) can run in parallel (within Phase 2)
- All tests for User Story 1 marked [P] (T009, T010, T011, T012) can run in parallel
- Polish tasks marked [P] (T022, T023, T024, T025, T026) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create test file for top page in frontend/tests/app/page.test.tsx with test for green background display"
Task: "Add test for banner image display in frontend/tests/app/page.test.tsx"
Task: "Add test for start button display and clickability in frontend/tests/app/page.test.tsx"
Task: "Add test for responsive layout in frontend/tests/app/page.test.tsx"

# After tests are written, launch implementation tasks:
Task: "Move banner image from image/top-banner.png to frontend/src/public/images/top-banner.png"
Task: "Add shadcn/ui Button component using npx shadcn-ui@latest add button command"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Write tests for User Story 1 (T009-T012)
   - Developer B: Setup image and shadcn/ui button (T013, T014)
3. After tests and setup:
   - Developer A: Implement page component (T015-T017)
   - Developer B: Implement navigation and enhancements (T018-T021)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
