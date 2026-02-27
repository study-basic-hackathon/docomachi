# Quickstart: 麻雀配牌データ取得と初期登録

このドキュメントは、開発者および運営担当者が「麻雀配牌データ取得と初期登録」機能を素早く試せるようにするための手順をまとめたものです。

## 前提

- Amplify Gen2 プロジェクトがセットアップ済みであること
- `001-db-tehai` ブランチをチェックアウトしていること
- AWS 認証情報（profile など）がローカルで有効になっていること

## 1. 初期役満データのJSONを準備する

1. リポジトリ内に `doc/seed/mahjong_hands.json` を作成し、以下のような形式で国士無双13面待ち・純正九蓮宝燈のデータを定義します（例示・内容は実装時に確定）。
2. 各レコードは `tiles`（13枚）と `winningTiles`（当たり牌）を含めます。

```json
[
  {
    "id": "kokushi-13-sided",
    "tiles": ["1m", "9m", "1p", "9p", "1s", "9s", "ton", "nan", "sha", "pe", "haku", "hatsu", "chun"],
    "winningTiles": ["1m", "9m", "1p", "9p", "1s", "9s", "ton", "nan", "sha", "pe", "haku", "hatsu", "chun"]
  },
  {
    "id": "junsei-churen",
    "tiles": ["1m", "1m", "1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "9m", "9m"],
    "winningTiles": ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m"]
  }
]
```

## 2. GraphQL スキーマにエンドポイントを追加する

1. `specs/001-db-tehai/contracts/get-random-hand.graphql` と `seed-initial-hands.graphql` の内容を、Amplify/AppSync の GraphQL スキーマに統合します。
2. `MahjongHand` 型、`getRandomMahjongHand` クエリ、`seedInitialMahjongHands` ミューテーションを追加します。
3. 必要に応じて、これらのフィールドを Lambda Resolver に紐付けます。

## 3. Lambda または Resolver の実装（概要）

- `getRandomMahjongHand`:
  - DynamoDB の `MahjongHand` アイテム群から1件をランダムに選択して返却します。
  - データ件数が少ない間は、全件または一部件数のID一覧を取得して、ランダムインデックスで選択するシンプルな方式で十分です。
- `seedInitialMahjongHands`:
  - 引数 `hands` を検証し、牌表現ルールと要素数（13枚）をチェックした上で、DynamoDB に一括登録します。
  - 二重登録防止のため、`id` が既に存在する場合の扱い（上書き or スキップ）は実装側で方針を決めます。

## 4. 初期データ投入手順（運営・開発者向け）

1. Amplify 環境をデプロイまたは更新します。
2. ローカルで次のスクリプトを実行します:

   ```bash
   npx tsx scripts/seedMahjongHands.ts
   ```

3. 正常終了後、DynamoDB テーブルに2件の役満データが登録されていることを確認します。

## 5. ランダム配牌取得の確認

1. フロントエンドまたはバックエンドコードから `getRandomMahjongHand` ユーティリティ（`src/lib/mahjong/randomHand.ts`）を呼び出します。
2. 13枚の `tiles` と `winningTiles` が含まれるレスポンスが返却されることを確認します。
3. 複数回呼び出し、国士無双・純正九蓮宝燈のいずれか（または両方）が取得されることを目視で確認します。

以上で、本機能の基本的な動作確認が行えます。
