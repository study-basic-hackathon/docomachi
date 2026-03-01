# Research: 10 Questions Quiz Flow

**Branch**: `006-10-questions-quiz` | **Phase**: 0

## 1. 10問の取得方法

- **Decision**: **バックエンド側でランダムに10件取得してレスポンスを返す**。Amplify Gen2 のカスタムクエリ（例: `listRandomMahjongHands(limit: 10)`）を定義し、Lambda（TypeScript）で DynamoDB の MahjongHand をスキャンまたは一覧取得したうえでランダムに10件を選び、その10件を返す。クライアントはその API を1回呼び、返却された10件をそのままセッションの10問とする（クライアントでのランダム選択は行わない）。
- **Rationale**: ユーザー要求「listで10件取得するときにバックエンド側でランダムに10件取得してレスポンスを返す」に従う。ランダム性をバックエンドに集約し、フロントは「10問の配列を受け取る」だけにできる。
- **Alternatives considered**: 従来案（listMahjongHands で多数取得しクライアントで10件選択）はユーザー指示により不採用。

## 2. セッション・スコアの保持

- **Decision**: クイズセッションとスコアは永続化しない。フロント（React state）のみで保持する。10問の配列・現在の問番号・各問の正誤をクライアントで保持し、結果画面表示後に破棄する。
- **Rationale**: 仕様に「セッションの永続化」がなく、再開や履歴は要求されていない。実装が単純で憲法の範囲内で完結する。
- **Alternatives considered**: DynamoDB に QuizSession を保存する案は、現仕様ではスコープ外。

## 3. エラー・10問未満時の扱い

- **Decision**: `listMahjongHands` の結果が 10 件未満の場合はクイズを開始せずエラー表示。ネットワーク等で取得失敗時もエラー表示し、同一画面で「もう一度試す」で再リクエストする（仕様の Clarifications に準拠）。
- **Rationale**: spec FR-002 および Clarifications で合意済み。
- **Alternatives considered**: N 問だけ実施して X/N 表示する案は仕様で却下済み（Option A 採用）。

## 4. UI コンポーネント方針

- **Decision**: 既存 `ResultModal` を拡張し、正解時は「次の問題へ」または「結果を見る」（10問目のみ）、不正解時は「次の問題へ」「解答を見る」「再回答」を提供する。解答表示はモーダル内または別モーダルで正解牌を表示する。
- **Rationale**: 既存の正解/不正解モーダルを流用しつつ、仕様のボタン分岐を一箇所で扱うとテストしやすい。
- **Alternatives considered**: 結果のみ別ページ（例 `/quiz/result`）にする案は、仕様上「結果を見る」で表示するため同一ページ内の結果表示で足りる。
