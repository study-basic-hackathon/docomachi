# Quickstart: 001-seed-data

**Feature**: 麻雀問題シードデータの整備  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## 前提

- Node と npm が利用可能であること
- 既存の `doc/seed/mahjong_hands.json` が存在すること（本機能で内容を修正・追記する）

## 1. シードデータの場所と形式

- **ファイル**: `doc/seed/mahjong_hands.json`
- **形式**: [contracts/seed-data-schema.md](./contracts/seed-data-schema.md) および [data-model.md](./data-model.md) に従う。
- 各問題は `id`, `tiles`（13枚）, `winningTiles`, `difficulty`（`low` | `middle` | `high`）を持つ。

## 2. 検証（実装後）

本機能で検証スクリプトを用意する場合の例:

- 同一牌が4枚を超えていないか
- 全問題に `difficulty` が付いているか
- 新規追加分が変則・チンイツでちょうど10問かつおおよそ半々か

実行例（スクリプト名は実装時に確定）:

```bash
npx tsx scripts/verifySeedData.ts
# または
npm run verify:seed
```

## 3. シードの投入

Amplify サンドボックスが起動している状態で:

```bash
npm run seed
```

- `doc/seed/mahjong_hands.json` の全件が DynamoDB（MahjongHand）に投入される。
- 本番用は `doc/seed/README.md` の手順に従う。

## 4. 受け入れ確認

- 既存問題: 正答・ルール適合を検証し、不備は修正済みであること。
- 新規10問: 変則5問・チンイツ5問程度で、いずれも正答と牌構成がルール適合であること。
- 全問題: `difficulty` が付与され、判定基準に沿っていること。
- `npm run seed` がエラーなく完了し、アプリで問題が表示・解答できること。

## 参照

- データモデル: [data-model.md](./data-model.md)
- 契約: [contracts/seed-data-schema.md](./contracts/seed-data-schema.md)
- 既存 seed 手順: [doc/seed/README.md](../../doc/seed/README.md)
