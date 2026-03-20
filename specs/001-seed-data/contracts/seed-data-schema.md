# Contract: シードデータ形式（mahjong_hands.json）

**Feature**: 001-seed-data  
**Source of truth**: `doc/seed/mahjong_hands.json`

## 概要

問題データは JSON 配列で、各要素が1問を表す。既存の id / tiles / winningTiles に加え、本機能で **difficulty** を必須とする。

## スキーマ（論理）

- **ルート**: 配列。要素は「問題」オブジェクト。
- **問題オブジェクト**:
  - `id` (string, 推奨): 一意。seed 時に DynamoDB の id に使用。
  - `tiles` (string[]): 長さ 13。各要素は TileCode。
  - `winningTiles` (string[]): 長さ 1 以上。各要素は TileCode。
  - `difficulty` ("low" | "middle" | "high"): 必須。全問題に付与。

## TileCode（牌コード）

`src/lib/mahjong/mahjongHand.ts` の `TileCode` 型と一致する。

- 数牌: `1m`〜`9m`, `1p`〜`9p`, `1s`〜`9s`
- 字牌: `ton`, `nan`, `sha`, `pe`, `haku`, `hatsu`, `chun`

## 検証ルール（契約）

1. 各問題の `tiles` は丁度 13 要素。
2. `tiles` および `winningTiles` の全要素は上記 TileCode のいずれか。
3. 各牌コードの出現回数は、`tiles` のみで数えて 4 以下。`tiles` + 各 `winningTiles` の牌を合わせても、各牌 4 枚まで（聴牌形の妥当性）。
4. `difficulty` は `low` / `middle` / `high` のいずれか。
5. 変則多メンチャン待ち・チンイツの多メンチャン待ちの新規問題はちょうど 10 問。内訳は変則とチンイツをおおよそ半々。

## 利用方法

- ローカル・CI: `scripts/seedMahjongHands.ts` がこの JSON を読み、Amplify Data API 経由で DynamoDB に投入する。
- 検証: 実装する検証スクリプト（例: 同一牌4枚まで・難易度存在チェック）がこの形式を前提とする。
