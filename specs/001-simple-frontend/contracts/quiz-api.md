# Contract: 出題取得 API（フロントエンドから利用）

**Feature**: 001-simple-frontend  
**Date**: 2025-02-28  
**Backend**: 既存 Amplify Data スキーマ `MahjongHand`（`amplify/data/resource.ts`）を利用。本機能ではフロントから **axios** で AppSync GraphQL を呼び出す。

---

## 取得方法

- **操作**: 出題1件を取得する。
- **実装方針**: AppSync の `listMahjongHands` を呼び、結果から1件を選ぶ（例: 先頭、ランダム）。取得は axios で GraphQL エンドポイントへ POST し、認証は Amplify の `fetchAuthSession` 等で取得したトークンをヘッダに付与する。

---

## リクエスト（GraphQL）

- **クエリ名**: `listMahjongHands`（Amplify 生成）
- **変数例**: `{ limit: 10 }` など（必要に応じて filter を付与可）
- **認証**: 既存 `MahjongHand` は `allow.authenticated()` のため、認証済みユーザーのトークンが必要。

---

## レスポンス形状

- **成功時**: GraphQL の `data.listMahjongHands` に以下が含まれる想定。

```ts
interface ListMahjongHandsResponse {
  data: {
    listMahjongHands: {
      items: Array<{
        id: string;
        tiles: string[];
        winningTiles: string[];
        createdAt?: string;
        updatedAt?: string;
      }>;
      nextToken?: string | null;
    };
  };
}
```

- **フロントでの利用**: `items[0]` または `items[randomIndex]` を1問として使用。`tiles` / `winningTiles` は牌コードの配列（`TileCode` 型に相当）。

---

## エラー時

- ネットワークエラー・4xx/5xx・認証エラー時は、仕様どおりエラーメッセージを表示し、**リトライ**と**トップへ戻る**の両方を用意する。
- レスポンスが空（items が空）の場合もエラー扱いとし、同様の UI とする。

---

## 牌コード（参照）

`TileCode` は `src/lib/mahjong/mahjongHand.ts` の定義に準拠。

- 萬子: `1m`〜`9m`
- 筒子: `1p`〜`9p`
- 索子: `1s`〜`9s`
- 字牌: `ton`, `nan`, `sha`, `pe`, `haku`, `hatsu`, `chun`

表示順: 萬子 → 索子 → 筒子 → 字牌（東南西北白發中）。API の並びはフロントでソートして使用する。
