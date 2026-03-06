# Contracts: 007-frontend-design

本機能は **フロントエンドの表示・レイアウト・UX の変更のみ** であり、新規の API エンドポイントやバックエンド契約はありません。

- 既存の AppSync / fetchQuestions 等の API はそのまま利用する。
- コンポーネント間のインターフェース（props）は既存の `AnswerPicker`, `HandDisplay`, `ResultModal` 等を拡張する形で実装する。

新規の OpenAPI / GraphQL スキーマは不要です。
