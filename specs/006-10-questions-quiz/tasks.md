# Tasks: 10 Questions Quiz Flow

**Input**: Design documents from `/specs/006-10-questions-quiz/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure feature branch and dependencies are ready

- [x] T001 Ensure feature branch `006-10-questions-quiz` is checked out and run `npm install` at repository root
- [x] T002 [P] Confirm Amplify sandbox and MahjongHand data (e.g. `npm run seed`) so listRandomMahjongHands can return 10 items

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend API that returns 10 random questions. MUST be complete before any user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Create Lambda in `amplify/functions/listRandomMahjongHands/` (TypeScript) that reads from DynamoDB MahjongHand table and returns 10 random items (contract: specs/006-10-questions-quiz/contracts/quiz-10-questions-api.md)
- [x] T004 Add custom query `listRandomMahjongHands(limit: Int!)` in `amplify/data/resource.ts` and attach Lambda handler; register function in `amplify/backend.ts` if required by Amplify Gen2

**Checkpoint**: Backend returns 10 random MahjongHand items; frontend can call listRandomMahjongHands

---

## Phase 3: User Story 1 - Start quiz and receive 10 questions (Priority: P1) 🎯 MVP

**Goal**: User clicks Start, lands on quiz page, and the system loads 10 questions from the backend and shows the first question.

**Independent Test**: Start from top page → click スタート → quiz page shows loading then first of 10 questions; network tab shows one call returning 10 items.

### Implementation for User Story 1

- [x] T005 [US1] Implement `fetchQuestions()` in `src/lib/api/fetchQuestions.ts` that calls listRandomMahjongHands(limit: 10), returns `QuestionItem[]`, throws if result length < 10 (reuse auth/API key from fetchQuestion.ts)
- [x] T006 [US1] Update `app/quiz/page.tsx` to call fetchQuestions() on load, store 10 questions in state and currentIndex 0, display first question (questions[0]); add loading state and error state with "もう一度試す" retry on same screen (FR-002)

**Checkpoint**: User Story 1 complete — 10 questions load and first question is shown; error/retry when API fails or returns < 10

---

## Phase 4: User Story 2 - Correct answer: next question and see results (Priority: P1)

**Goal**: After correct answer, show "次の問題へ" (questions 1–9) or "結果を見る" (question 10 only). Clicking "結果を見る" shows score X/10.

**Independent Test**: Answer correctly on Q1 → "次の問題へ" only → click → Q2 shown. On Q10 correct → "結果を見る" only → click → score X/10 displayed.

### Implementation for User Story 2

- [x] T007 [US2] In `app/quiz/page.tsx` add `answers` state (AnswerState[] length 10), update on submit: first correct = correct, else incorrect; pass isCorrect and current question index to ResultModal
- [x] T008 [US2] Update `components/ResultModal.tsx`: after correct show only "次の問題へ" when currentIndex < 9 and only "結果を見る" when currentIndex === 9; add props onNextQuestion and onSeeResults, call appropriately (FR-003, FR-004)
- [x] T009 [US2] In `app/quiz/page.tsx` implement result view: when user clicks "結果を見る", show score as "X / 10" (count answers where status === 'correct'); optionally "トップへ戻る" link (FR-004)

**Checkpoint**: User Story 2 complete — correct path: Next question (1–9), See results (Q10), score display

---

## Phase 5: User Story 3 - Wrong answer: retry and see correct answer (Priority: P2)

**Goal**: After wrong answer, user can retry, open "解答を見る" modal to see correct answer, or go to next question (current question counts incorrect). On Q10 wrong, show "結果を見る" instead of "次の問題へ".

**Independent Test**: Submit wrong answer → "次の問題へ" and "解答を見る" visible → click "解答を見る" → modal shows correct tiles; click "次の問題へ" → next question, current counted incorrect.

### Implementation for User Story 3

- [x] T010 [US3] Update `components/ResultModal.tsx` for incorrect: show "次の問題へ" (or "結果を見る" when currentIndex === 9), "解答を見る", and keep question on screen for retry; wire onNextQuestion / onSeeResults and onSeeAnswer (FR-005, FR-007)
- [x] T011 [US3] Add "解答を見る" behavior: when user clicks, open modal (or expand ResultModal) to display correct answer (winningTiles) e.g. via HandDisplay in `components/ResultModal.tsx` or dedicated modal (FR-006)
- [x] T012 [US3] Ensure scoring in `app/quiz/page.tsx`: each question counted at most once; first correct submission = correct, otherwise incorrect; unanswered (e.g. skipped) = incorrect when showing result (FR-008)

**Checkpoint**: User Story 3 complete — wrong answer: retry, see answer modal, skip to next; score correct

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, validation, and delivery

- [ ] T013 Ensure in `app/quiz/page.tsx` that when fetchQuestions() returns fewer than 10 items (or API error), quiz does not start and error + "もう一度試す" are shown on same screen (FR-002)
- [ ] T014 Run quickstart.md validation: `npm run dev`, `npm run seed`, complete 10-question flow (start → answer/skip → see results)
- [ ] T015 Create pull request in Japanese for branch 006-10-questions-quiz (PR 作成まで含める); use GITHUB_TOKEN from .env per constitution

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — can start when listRandomMahjongHands is available
- **Phase 4 (US2)**: Depends on Phase 3 — needs 10 questions loading and first question displayed
- **Phase 5 (US3)**: Depends on Phase 4 — needs ResultModal and result screen
- **Phase 6 (Polish)**: Depends on Phase 5

### User Story Dependencies

- **US1 (P1)**: After Foundational only — no dependency on US2/US3
- **US2 (P1)**: After US1 — uses same quiz page and modal
- **US3 (P2)**: After US2 — extends ResultModal and scoring

### Within Each User Story

- T005 before T006 (fetchQuestions before quiz page uses it)
- T007 before T008 and T009 (answers state before modal and result view)
- T010, T011, T012 can be done in any order once T008/T009 are done (all US3)

### Parallel Opportunities

- T001 and T002 can run in parallel (Phase 1)
- T003 and T004 are sequential (Lambda then schema wiring)
- After Phase 2, Phases 3–5 are sequential by story; within US2, T008 and T009 can be parallel after T007; within US3, T010 and T011 can be parallel

---

## Parallel Example: User Story 2

```bash
# After T007 (answers state) is done:
# T008: Update ResultModal.tsx for correct-answer buttons
# T009: Implement result view (score X/10) in quiz page
# Can be done in parallel by two developers
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational (backend listRandomMahjongHands)  
3. Complete Phase 3: User Story 1 (fetchQuestions + quiz page with 10 questions, first shown)  
4. **STOP and VALIDATE**: Start quiz, confirm 10 questions load and first is displayed, error/retry works  
5. Deploy/demo if ready  

### Incremental Delivery

1. Setup + Foundational → backend ready  
2. Add US1 → 10 questions load, first question shown (MVP)  
3. Add US2 → correct flow: Next question, See results, score X/10  
4. Add US3 → wrong flow: retry, See answer modal, skip  
5. Polish → error handling, quickstart check, PR  

### Task Count Summary

| Phase              | Task IDs  | Count |
|--------------------|-----------|-------|
| Phase 1 Setup      | T001–T002 | 2     |
| Phase 2 Foundational | T003–T004 | 2     |
| Phase 3 US1       | T005–T006 | 2     |
| Phase 4 US2       | T007–T009 | 3     |
| Phase 5 US3       | T010–T012 | 3     |
| Phase 6 Polish    | T013–T015 | 3     |
| **Total**         |           | **15**|

---

## Notes

- [P] only where tasks are in different files and have no dependency on unfinished tasks
- [USn] labels map to spec.md User Story 1 (P1), 2 (P1), 3 (P2)
- Each user story is independently testable per Independent Test above
- Commit after each task or logical group
- Constitution: PR は日本語、GITHUB_TOKEN は .env
