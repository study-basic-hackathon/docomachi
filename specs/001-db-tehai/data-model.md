# Data Model: 麻雀配牌データ取得と初期登録

## Entities

### 1. MahjongHand

- **Description**: 麻雀の1手牌と、その手からの当たり牌情報を表すレコード。
- **Storage**: DynamoDB 単一テーブルのアイテムとして保存。

#### Fields

- `id: string`
  - 一意な識別子（UUID）。
- `tiles: string[]`
  - 手牌13枚分の牌コード配列。
  - 各要素は以下のいずれかの形式に従う。
    - 索子: `1s`〜`9s`
    - 萬子: `1m`〜`9m`
    - 筒子: `1p`〜`9p`
    - 字牌: `ton`, `nan`, `sha`, `pe`, `haku`, `hatsu`, `chun`
  - 要素数は常に13でなければならない。
- `winningTiles: string[]`
  - 当たり牌の牌コード配列（0個以上）。
  - 値の形式は `tiles` と同じルールに従う。
- `createdAt: string`
  - ISO8601 形式の作成日時。
- `updatedAt: string`
  - ISO8601 形式の最終更新日時。

#### DynamoDB Representation (conceptual)

- `PK: string`
  - 値: 固定で `'MAHJONG_HAND'`。
- `SK: string`
  - 値: `id`（UUID）。
- その他属性
  - `Tiles`（`tiles`）、`WinningTiles`（`winningTiles`）、`CreatedAt`、`UpdatedAt` をマッピング。

#### Validation Rules

- `tiles.length === 13` を必須とする。
- `tiles` および `winningTiles` の各要素は定義された牌コードのいずれかに一致しなければならない。
- 不正な牌コード、`tiles` の要素数不足・過多の場合は登録処理を失敗させる。

## Initial Dataset

### 国士無双13面待ち

- `MahjongHand` として1件登録。
- `tiles` は国士無双13面待ちの配牌（13枚）を表す。
- `winningTiles` には、理論上の13種の待ち牌を全て含める。

### 純正九蓮宝燈

- `MahjongHand` として1件登録。
- `tiles` は純正九蓮宝燈の配牌（13枚）を表す。
- `winningTiles` には、その純正九蓮宝燈が成立する待ち牌を含める。

> 具体的な牌配列は、`doc/seed/mahjong_hands.json` のようなJSONファイルで定義し、実装時に確定させる。
