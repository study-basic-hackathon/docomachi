# Data Model: 10 Questions Quiz Flow

**Branch**: `006-10-questions-quiz` | **Phase**: 1

本機能ではクイズセッション・スコアを永続化しない。フロントの状態と、既存バックエンドの **MahjongHand** のみを扱う。

---

## 1. クライアント側の状態（非永続）

### QuizSession（メモリ上のセッション）

| フィールド | 型 | 説明 |
|------------|-----|------|
| questions | QuestionItem[] | 10問の配列（バックエンドの listRandomMahjongHands が返した10件） |
| currentIndex | number | 現在表示している問の 0-based インデックス（0..9） |
| answers | AnswerState[] | 各問の回答状態（未答・正解・不正解）とスコア用 |

- **ライフサイクル**: トップで「スタート」→ 10問取得成功で作成。結果画面表示まで保持。ページ離脱で破棄。
- **バリデーション**: `questions.length === 10` でない場合はセッションを開始しない（FR-002）。

### AnswerState（1問あたり）

| フィールド | 型 | 説明 |
|------------|-----|------|
| status | 'unanswered' \| 'correct' \| 'incorrect' | その問の判定結果（最初の正解で correct、一度でも不正解なら incorrect で確定） |
| attempted | boolean | 少なくとも1回解答したか |

- **スコア**: status === 'correct' の問の数を数え、結果画面で「X / 10」とする（FR-008）。

### QuestionItem（既存）

| フィールド | 型 | 説明 |
|------------|-----|------|
| id | string | MahjongHand.id |
| tiles | TileCode[] | 手牌 |
| winningTiles | TileCode[] | 正解の待ち牌 |
| createdAt / updatedAt | string? | 既存のまま |

- 既存の `QuestionItem` 型を流用。10問取得は `listRandomMahjongHands` を呼ぶ `fetchQuestions()` 等で配列で返す。

---

## 2. バックエンド

### MahjongHand（Amplify Data）

- 既存モデルは変更なし。本機能では **listRandomMahjongHands**（カスタムクエリ）を利用する。
- **listRandomMahjongHands(limit: 10)**: Lambda（TypeScript）が DynamoDB からランダムに10件取得して返す。返却が 10 件未満の場合はクライアントでクイズ開始せずエラーとする。

---

## 3. 状態遷移（クイズ画面）

- **loading** → 10問取得中。失敗なら **error**（リトライ可能）。
- **ready** → 現在問を表示。ユーザーが「解答する」→ 正誤判定 → モーダル表示。
  - 正解（1–9）→ 「次の問題へ」→ currentIndex++、次の問表示。
  - 正解（10問目）→ 「結果を見る」→ 結果画面（X/10）表示。
  - 不正解（1–9）→ 「次の問題へ」「解答を見る」「再回答」→ 次へ進む or 同じ問で再回答。
  - 不正解（10問目）→ 「結果を見る」「解答を見る」「再回答」。
- **result** → スコア表示（X / 10）。必要なら「トップへ戻る」等（仕様では明示なし、実装で追加可）。

---

## 4. エンティティ関係

- **QuizSession** が **QuestionItem** を 10 個持つ（参照は MahjongHand 由来の id / tiles / winningTiles）。
- **AnswerState** は問インデックスと 1:1。セッション内で answers[i] が questions[i] に対応。
