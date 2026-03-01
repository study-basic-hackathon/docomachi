# Feature Specification: 10 Questions Quiz Flow

**Feature Branch**: `006-10-questions-quiz`  
**Created**: 2025-03-01  
**Status**: Draft  
**Input**: User description: "トップページのスタートをクリックすると出題ページに遷移し、現在は一問のみの出題を10問連続で出題するように仕様変更する。バックエンドは10問分返す。正解時は次の問題へ・結果を見るボタン、不正解時は再回答可能・解答を見るボタン（モーダル）。結果を見るで10問中何問正解かを表示する。"

## Clarifications

### Session 2025-03-01

- Q: 不正解だった場合、ユーザーは「次の問題へ」でその問題を不正解のまま次に進めるか、正解するか「結果を見る」のみか？ → A: 不正解後も「次の問題へ」または「スキップ」を出し、その問題は不正解のまま次問に進める（Option B）。
- Q: バックエンドが10問未満しか返さない場合の扱い（エラーで開始しない vs N問で実施して X/N 表示） → A: 10問揃わない場合はクイズを開始せずエラーを表示する（Option A）。
- Q: 10問目で「次の問題へ」を押したときの動き → A: 10問目では「次の問題へ」は表示しない。「結果を見る」ボタンのみ表示し、そのボタンは10問目のときのみ表示する。
- Q: 10問の取得に失敗したときの動き → A: エラー内容を表示し、同じ画面で「もう一度試す」等のリトライを可能にする（Option A）。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start quiz and receive 10 questions (Priority: P1)

User clicks Start on the top page and is taken to the quiz page. The system presents a session of 10 questions (one question visible at a time). The backend supplies all 10 questions for that session so the user can progress through them in order.

**Why this priority**: Core change from 1-question to 10-question flow; without it the feature does not exist.

**Independent Test**: Start a quiz from the top page and confirm exactly 10 questions are available for the session and the first question is shown.

**Acceptance Scenarios**:

1. **Given** user is on the top page, **When** user clicks Start, **Then** user is taken to the quiz (question) page and the first of 10 questions is displayed.
2. **Given** the quiz has started, **When** the session loads, **Then** the system has 10 questions available for that session (no need to request again for the next questions).

---

### User Story 2 - Correct answer: next question and see results (Priority: P1)

When the user submits a correct answer on questions 1–9, they see only a "Next question" button; clicking it shows the next question. On question 10, the user sees only a "See results" button (no "Next question"); the "See results" button is shown only when on the last question. Clicking "See results" shows how many of the 10 questions were answered correctly.

**Why this priority**: Defines the primary success path and how the user completes or skips to the end of the quiz.

**Independent Test**: Answer one or more questions correctly, use "Next question" to advance and "See results" to view the score out of 10.

**Acceptance Scenarios**:

1. **Given** user has just submitted a correct answer on question 1–9, **When** the response is shown, **Then** only "Next question" is displayed (not "See results").
2. **Given** user has just submitted a correct answer on question 10, **When** the response is shown, **Then** only "See results" is displayed (no "Next question").
3. **Given** "Next question" is visible (questions 1–9), **When** user clicks it, **Then** the next question in the session is displayed.
4. **Given** user clicks "See results" (shown only on question 10), **When** the results screen loads, **Then** the system shows how many of the 10 questions were answered correctly (e.g. "7 / 10 correct").

---

### User Story 3 - Wrong answer: retry and see correct answer (Priority: P2)

When the user submits an incorrect answer, they remain on the same question and can change their answer and submit again, or proceed to the next question (e.g. "Next question" / "Skip"), leaving the current question counted as incorrect. The attempt counts as wrong for scoring. A "See answer" (or equivalent) button is shown; clicking it opens a modal that displays the correct answer.

**Why this priority**: Supports learning and clarity without blocking the main flow.

**Independent Test**: Submit a wrong answer, then either correct and submit again or open "See answer" and confirm the correct answer is shown in a modal.

**Acceptance Scenarios**:

1. **Given** user has submitted an incorrect answer, **When** the response is shown, **Then** the question stays on screen, the answer can be edited, and the user can submit again.
2. **Given** user has submitted an incorrect answer, **When** the response is shown, **Then** a "See answer" (or equivalent) button is visible; **When** user clicks it, **Then** a modal opens showing the correct answer.
3. **Given** an attempt was incorrect, **When** the final score is calculated, **Then** that question counts as incorrect (no credit for later correct retries for that question).
4. **Given** user has submitted an incorrect answer, **When** the response is shown, **Then** a way to proceed to the next question (e.g. "Next question" or "Skip") is visible; **When** user clicks it, **Then** the next question is displayed and the current question remains scored as incorrect.

---

### Edge Cases

- When the user goes to results without answering all 10 questions (e.g. by skipping or via a path that exposes "See results" earlier), unanswered questions are counted as incorrect; score is always "X / 10".
- On question 10, "Next question" is not displayed; only "See results" is offered. Clicking "See results" shows the results screen.
- If fewer than 10 questions are available at session start, the system MUST NOT start the quiz and MUST show an error to the user. If loading the 10 questions fails (e.g. network error), the system MUST show an error and MUST offer retry on the same screen (e.g. "Try again"); return to top may be optional or additional.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a quiz session of exactly 10 questions when the user starts from the top page.
- **FR-002**: System MUST supply all 10 questions for the session at start (single request returning 10 questions). If fewer than 10 questions are returned, the system MUST NOT start the quiz and MUST show an error. If the request to load the 10 questions fails, the system MUST show an error and MUST allow the user to retry on the same screen (e.g. "Try again").
- **FR-003**: After a correct answer on questions 1–9, the system MUST show only "Next question" (not "See results"). After a correct answer on question 10, the system MUST show only "See results" (no "Next question").
- **FR-004**: The "See results" button MUST be shown only when the user is on question 10 (last question). When the user chooses "See results", the system MUST display how many of the 10 questions were answered correctly (e.g. "X / 10").
- **FR-005**: After an incorrect answer, the system MUST keep the user on the same question, allow editing and resubmission, and count that question as incorrect for the final score.
- **FR-006**: After an incorrect answer, the system MUST show a "See answer" (or equivalent) control that opens a modal displaying the correct answer.
- **FR-007**: After an incorrect answer on questions 1–9, the system MUST show a way to proceed to the next question (e.g. "Next question" or "Skip"); choosing it leaves the current question scored as incorrect and displays the next question. On question 10 after incorrect, the system MUST show "See results" (and "See answer", retry) instead of "Next question".
- **FR-008**: Scoring MUST count each question at most once; the first correct submission counts as correct, otherwise the question counts as incorrect.

### Key Entities

- **Quiz session**: A single run of the quiz; has exactly 10 questions and one score (correct count).
- **Question**: One problem in the session; has question content and one correct answer; user may submit multiple attempts, but only first correct (if any) affects score.
- **Result / Score**: The outcome of the session: number of questions answered correctly out of 10.

### Assumptions

- The top page and "Start" entry point already exist; only the quiz and result flow are in scope.
- "See answer" is shown only after an incorrect submission for that question.
- After an incorrect answer, the user may skip to the next question (that question remains incorrect) or retry / see answer.
- Unanswered questions (user goes to results without answering) are counted as incorrect for the score.
- On the last question (question 10), only "See results" is displayed (no "Next question"); clicking it shows the results screen.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: User can complete a full 10-question session (start → answer or skip → see results) without leaving the flow.
- **SC-002**: User sees the correct score (number of correct answers out of 10) on the results screen.
- **SC-003**: After a wrong answer, user can either retry the same question or view the correct answer in a modal without losing place in the session.
- **SC-004**: Each question is scored at most once; repeated correct answers after a wrong attempt do not change the score for that question.
