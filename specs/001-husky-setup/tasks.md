# Tasks: Huskyセットアップとコミット前テスト実行

**Input**: Design documents from `/specs/001-husky-setup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: 仕様書にテストタスクの明示的な要求がないため、テストタスクは含めません。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/`, `frontend/tests/`
- **Root**: `.husky/`, `package.json`
- Paths shown below follow the web application structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create root package.json file at package.json with basic structure (name, version, private)
- [x] T002 [P] Add husky to devDependencies in package.json
- [x] T003 [P] Add prepare script to package.json to run "husky install" automatically on npm install

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Initialize husky by creating .husky directory structure

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - コミット前の自動テスト実行 (Priority: P1) 🎯 MVP

**Goal**: huskyをセットアップし、コミット前にJestテストを自動実行する。テストが成功した場合のみコミットを許可し、失敗した場合はコミットをブロックする。

**Independent Test**: 開発者がコミットを試み、テストが自動実行され、成功時はコミットが完了し、失敗時はコミットがブロックされることを確認できる。

### Implementation for User Story 1

- [x] T005 [US1] Create .husky/pre-commit hook file with script to run Jest tests in frontend directory
- [x] T006 [US1] Update frontend/package.json test script to include --passWithNoTests flag for handling cases with no test files
- [x] T007 [US1] Make .husky/pre-commit file executable (chmod +x)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T008 [P] Verify husky setup by running npm install and checking .husky directory exists
- [x] T009 [P] Test pre-commit hook by attempting a commit with passing tests (manual verification required)
- [x] T010 [P] Test pre-commit hook by attempting a commit with failing tests (should be blocked) (manual verification required)
- [x] T011 [P] Verify prepare script works by checking husky install runs on npm install
- [x] T012 Run quickstart.md validation scenarios (setup verified)
- [x] T013 Update frontend/README.md if needed to document husky setup

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

- Create .husky/pre-commit file before making it executable
- Update frontend/package.json test script before testing the hook
- All tasks must complete before moving to Polish phase

### Parallel Opportunities

- T002 and T003 can run in parallel (different parts of package.json)
- T008, T009, T010, T011 can run in parallel (different verification scenarios)

---

## Parallel Example: User Story 1

```bash
# All implementation tasks for User Story 1 must run sequentially:
# 1. Create .husky/pre-commit file
# 2. Update frontend/package.json
# 3. Make file executable
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Complete Phase 4: Polish & Verification
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Verify → Deploy/Demo (MVP!)
3. Each phase adds value without breaking previous phases

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Create .husky/pre-commit file
   - Developer B: Update frontend/package.json (can be done in parallel after T005)
3. Verification tasks can be run in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- User Story 1 should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
