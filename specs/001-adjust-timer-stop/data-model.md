# Data Model: 解答タイマー15秒化と停止

## 1. 問題タイマー状態 (QuestionTimerState)

- Purpose: 1問ごとの制限時間管理と停止状態を管理する。
- Fields:
  - `questionId` (string, required): 対象問題ID
  - `durationSeconds` (integer, required): 制限時間（15）
  - `startedAt` (datetime, required): 問題表示時刻
  - `deadlineAt` (datetime, required): `startedAt + 15秒`
  - `remainingSeconds` (integer, required): 現在残り秒数（0-15）
  - `running` (boolean, required): タイマー進行中か
- Validation Rules:
  - `durationSeconds` は 15 固定
  - `running=false` の間は `remainingSeconds` を更新しない
  - 次問題遷移時は `running=true` で再初期化する

## 2. 解答確定イベント (AnswerResolutionEvent)

- Purpose: 手動回答または時間切れによる確定を一元管理する。
- Fields:
  - `questionId` (string, required)
  - `reason` (enum, required): `manual_submit | timeout`
  - `answerState` (enum, required): `correct | incorrect`
  - `resolvedAt` (datetime, required)
- Validation Rules:
  - 同一 `questionId` で確定イベントは1回のみ
  - `reason=timeout` の場合は `answerState=incorrect`
  - 競合時（押下と時間切れ同時）は `reason=timeout` を優先する

## 3. 結果モーダル状態 (ResultModalState)

- Purpose: 問題確定後に表示する結果 UI の状態管理。
- Fields:
  - `open` (boolean, required)
  - `modalType` (enum, required): `correct_modal | incorrect_modal`
  - `questionId` (string, required)
- Validation Rules:
  - 時間切れ時は `modalType=incorrect_modal`
  - 同一問題で重複して `open=true` に遷移しない

## 4. 状態遷移

```text
running
  ├─(submit within 15s)──> stopped + resolved(manual_submit)
  └─(reach 15s)──────────> stopped + resolved(timeout)
```

- いずれかで確定後は再確定不可
- 次問題開始時に新しい `QuestionTimerState` を生成する
