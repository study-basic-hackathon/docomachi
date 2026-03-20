# Tasks: 麻雀問題シードデータの整備

**Input**: Design documents from `/specs/001-seed-data/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently. No new project structure; existing paths doc/seed/, scripts/, src/lib/mahjong/ only.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Parallelizable (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label for story phases only (US1, US2, US3). Setup and Foundational phases have no story label.
- Include exact file paths in descriptions.

## Path Conventions

Paths are relative to repository root: `doc/seed/`, `scripts/`, `src/lib/mahjong/`, `specs/001-seed-data/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Minimal setup; no new directories. Document difficulty criteria for later phases.

- [x] T001 [P] Document difficulty judgment criteria (low / middle / high thresholds by 待ちの数・形の複雑さ・役の有無) in specs/001-seed-data/data-model.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Validation and types that all user stories depend on. No user story work until this phase is complete.

- [x] T002 Add "same tile at most 4" check to src/lib/mahjong/validation.ts (tiles + winningTiles combined per tile ≤ 4). Extend ValidationIssue kind per data-model.md FR-002
- [x] T003 [P] Add Jest tests for the new tile-count validation in src/lib/mahjong/__tests__/validation.test.ts (e.g. 5 of same tile fails, ≤4 passes)
- [x] T004 Ensure validateMahjongHand accepts seed-shaped objects (id optional; tiles and winningTiles required) so scripts/seedMahjongHands.ts and verification scripts can call it

**Checkpoint**: Foundation ready. Validation supports tile-count rule; difficulty criteria documented.

---

## Phase 3: User Story 1 - 既存問題の正答とルール適合の保証 (Priority: P1) 🎯 MVP

**Goal**: All existing problems in doc/seed/mahjong_hands.json satisfy correct answers and mahjong rules (same tile ≤4). Fix only; no deletions.

**Independent Test**: Run extended validateMahjongHand on every existing problem; after fixes, all pass.

### Implementation for User Story 1

- [x] T005 [US1] Run extended validateMahjongHand on each existing problem in doc/seed/mahjong_hands.json and list any that fail (via script or manual run)
- [x] T006 [US1] Fix problems that use the same tile more than 4 times: correct tiles and winningTiles in doc/seed/mahjong_hands.json so validation passes (no deletion)
- [x] T007 [US1] Identify and fix wrong winningTiles in doc/seed/mahjong_hands.json; for multi-wait hands include all waiting tiles (manual check or small wait-calculation logic per research.md)
- [x] T008 [US1] Confirm all existing problems in doc/seed/mahjong_hands.json pass validation

**Checkpoint**: User Story 1 complete. Existing problems only are rule-compliant and independently testable.

---

## Phase 4: User Story 2 - 変則・チンイツ多面張待ち問題の追加 (Priority: P2)

**Goal**: Add exactly 10 new problems (5 変則多メンチャン待ち, 5 チンイツ多面張) to doc/seed/mahjong_hands.json.

**Independent Test**: Exactly 10 new problems added; roughly half 変則 and half チンイツ; all pass validation and have correct winningTiles.

### Implementation for User Story 2

- [x] T009 [P] [US2] Define 5 変則多メンチャン待ち problems (id, tiles 13, winningTiles) per spec Assumptions; output in a form ready to append to doc/seed/mahjong_hands.json
- [x] T010 [P] [US2] Define 5 チンイツ多面張 problems (清一色, multiple waits); output ready to append to doc/seed/mahjong_hands.json
- [x] T011 [US2] Run extended validation and winningTiles correctness check on the 10 new problems
- [x] T012 [US2] Append the 10 problems to doc/seed/mahjong_hands.json preserving unique ids and array order

**Checkpoint**: User Story 2 complete. Existing + 10 new problems in doc/seed/mahjong_hands.json; all rule-compliant.

---

## Phase 5: User Story 3 - 全問題への難易度付与 (Priority: P3)

**Goal**: Assign difficulty (low / middle / high) to every problem using the documented criteria (automatic, not manual).

**Independent Test**: Every problem in doc/seed/mahjong_hands.json has a difficulty key and value matches the documented criteria.

### Implementation for User Story 3

- [x] T013 [P] [US3] Implement difficulty function in src/lib/mahjong/ or scripts/ (input: problem with tiles, winningTiles; output: "low" | "middle" | "high") per T001 criteria
- [x] T014 [P] [US3] Add Jest tests for difficulty function in src/lib/mahjong/__tests__/ or scripts/__tests__/ (e.g. kokushi/junsei → high, simple ryanmen → low)
- [x] T015 [US3] Assign difficulty to every problem in doc/seed/mahjong_hands.json using the function (script or one-off run; reproducible)
- [x] T016 [US3] Verify doc/seed/mahjong_hands.json matches specs/001-seed-data/contracts/seed-data-schema.md and mahjong_hands.schema.json (all have difficulty)

**Checkpoint**: User Story 3 complete. All problems have difficulty; criteria are documented and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Seed flow, docs, and PR.

- [x] T017 Ensure scripts/seedMahjongHands.ts handles difficulty in JSON (read and pass if schema has it; otherwise ignore per plan)
- [x] T018 Run verification and npm run seed per specs/001-seed-data/quickstart.md and confirm success
- [x] T019 Review doc/seed/README.md; add or update difficulty and verification steps if needed
- [ ] T020 Create PR in Japanese per Constitution IV; use GITHUB_TOKEN from .env

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1. Blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2. No dependency on US2/US3.
- **Phase 4 (US2)**: Depends on Phase 2. Prefer after Phase 3 so existing data is fixed before adding.
- **Phase 5 (US3)**: Depends on Phases 2, 3, 4 (all problems present before assigning difficulty).
- **Phase 6 (Polish)**: Depends on Phases 3, 4, 5.

### Within Each Phase

- T002 then T003 (validation then its tests). T004 can run after T002.
- T005 → T006 → T007 → T008 in order for US1.
- T009 and T010 can run in parallel; T011 then T012 for US2.
- T013 and T014 can run in parallel; T015 then T016 for US3.

### Parallel Opportunities

- T001 and T002 can run in parallel.
- T003 and T004 can run in parallel (after T002).
- T009 [P] [US2] and T010 [P] [US2] in parallel.
- T013 [P] [US3] and T014 [P] [US3] in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (User Story 1).
3. Validate: all existing problems pass validation.
4. Optionally deploy seed and demo.

### Incremental Delivery

1. Phase 1 + 2 → foundation ready.
2. Phase 3 → existing data corrected (MVP).
3. Phase 4 → 10 new problems added.
4. Phase 5 → difficulty on all problems.
5. Phase 6 → quickstart and PR.

### Parallel (if multiple developers)

- After Phase 2: one developer can do US1 (T005–T008), another can prepare US2 definitions (T009–T010). Merge JSON after US1 and US2 implementation tasks are done.

---

## Notes

- Tests are included for validation (T003) and difficulty (T014) per plan (Jest, minimal).
- Each task has a checkbox, ID, optional [P], optional [USn], and a file path or concrete deliverable.
- Commit after each task or logical group; validate at each checkpoint.
