# Contract: 10 Questions Quiz API（バックエンドでランダム10件返却）

**Branch**: `006-10-questions-quiz`  
**Backend**: Amplify Gen2 のカスタムクエリ ＋ Lambda（TypeScript）。list で10件取得する際は**バックエンド側でランダムに10件取得してレスポンスを返す**。

## 概要

- クイズ開始時に **listRandomMahjongHands**（カスタムクエリ）を 1 回だけ呼ぶ。バックエンドが DynamoDB からランダムに10件を取得して返す。返却件数が 10 未満の場合はクイズを開始せずエラーとする。
- 認証は既存と同様（認証トークンまたは API キー）。MahjongHand の authorization に合わせる。

## バックエンドが提供する API

### listRandomMahjongHands（新規カスタムクエリ）

- **スキーマ**: `amplify/data/resource.ts` に `a.query()` で定義。戻りは MahjongHand の配列。
- **クエリ**: `listRandomMahjongHands(limit: Int!)` など（引数は実装で固定でも可。例: limit 固定 10）。
- **Resolver**: Lambda（TypeScript）。DynamoDB の MahjongHand テーブルからデータを取得し、ランダムに `limit` 件（本機能では 10 件）を選んで返す。
- **応答**:
  - `items`: MahjongHand の配列。長さは通常 10。テーブルに10件未満しかない場合はその数（10未満ならクライアントでエラー扱い）。
  - 各要素: `id`, `tiles`, `winningTiles`, `createdAt`, `updatedAt`（既存 MahjongHand と同じ型）。

## クライアント側の契約

1. **リクエスト**: カスタムクエリ `listRandomMahjongHands(limit: 10)` を 1 回呼ぶ（変数は実装に合わせる）。
2. **成功**: 返却配列の長さが 10 の場合、その 10 件をそのままセッションの 10 問とする。並び順はバックエンドが返した順。
3. **失敗**:
   - 返却が 10 件未満: クイズを開始せず、エラー表示 + 同一画面でリトライ可能（FR-002）。
   - ネットワークエラー等: 同様にエラー表示 + リトライ可能。

## 型（クライアント）

既存の `QuestionItem`（`id`, `tiles`, `winningTiles`, `createdAt?`, `updatedAt?`）を 10 件の配列として扱う。バックエンドの戻り型は既存 MahjongHand と同一でよい。

## 既存 API との関係

- **listMahjongHands**: 従来の一覧取得。本機能では使わない（ランダム10件は listRandomMahjongHands のみ）。
- 既存 `fetchQuestion.ts` は 1 問用のため、10 問用は新規 `fetchQuestions.ts` などで listRandomMahjongHands を呼ぶ実装とする。
