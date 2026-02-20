# Contract: docomachi データモデル

**Branch**: `002-amplify-backend-setup`  
**Purpose**: Amplify Data で定義する docomachi モデルのスキーマ契約。実装は `amplify/data/resource.ts` で行う。

## モデル: Docomachi

- **論理名**: docomachi テーブル（DynamoDB）
- **パーティションキー**: `id` (UUID)
- **他キー**: 本機能ではソートキー・GSI なし

### フィールド

| フィールド | 型 | 必須 | 備考 |
|------------|-----|------|------|
| id | ID (UUID) | ✓ | パーティションキー。Amplify デフォルトで自動生成可。 |

### 認可（方針）

- 認証済みユーザーのみアクセス可能とすることを推奨（実装時に `defineData` の `authorization` で指定）。

### 実装時の参照

- [data-model.md](../data-model.md)
- Amplify Gen2: `a.model({ ... }).identifier()` でカスタム PK も可能。今回はデフォルト `id` で十分。
