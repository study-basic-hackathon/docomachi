# Quickstart: 10 Questions Quiz Flow

**Branch**: `006-10-questions-quiz`

## 前提

- Node.js / npm 利用可能。
- Amplify バックエンドがデプロイ済み（`amplify_outputs.json` が存在）。
- MahjongHand に 10 件以上のデータがある（`npm run seed` で投入可能）。

## 手順

1. **リポジトリのルートで**
   ```bash
   npm install
   ```

2. **環境**
   - 開発時は `amplify_outputs.json` を参照。本番は `amplify_outputs.production.json` 等を必要に応じて指定。

3. **シード（10 問以上必要）**
   ```bash
   npm run seed
   ```
   10 件未満の場合はクイズ開始時にエラーになる。

4. **起動**
   ```bash
   npm run dev
   ```
   ブラウザでトップページを開き、「スタート」をクリック。

5. **クイズフロー**
   - 出題ページで 10 問が読み込まれる（1 問目表示）。
   - 解答 → 正解なら「次の問題へ」（10 問目のみ「結果を見る」）。不正解なら「次の問題へ」「解答を見る」「再回答」。
   - 10 問目で「結果を見る」を押すとスコア（X / 10）を表示。

6. **テスト**
   ```bash
   npm test
   ```
   Jest でミニマムなテストを実行。lint/prettier は husky でコミット前に自動実行。

## 主な変更ファイル（実装時）

- **バックエンド**: `amplify/data/resource.ts` にカスタムクエリ `listRandomMahjongHands` を追加。`amplify/functions/listRandomMahjongHands/` に Lambda（TypeScript）を追加し、DynamoDB からランダム10件を返す。
- **フロント**: `app/quiz/page.tsx` — 10 問セッション状態・遷移・結果表示。`src/lib/api/fetchQuestion.ts` または新規 `fetchQuestions.ts` — listRandomMahjongHands を呼んで 10 問取得、10 件未満時エラー。`components/ResultModal.tsx` — 「次の問題へ」「結果を見る」「解答を見る」の表示分岐。
