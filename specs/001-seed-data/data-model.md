# Data Model: 麻雀問題シードデータ

**Feature**: 001-seed-data  
**Phase**: 1

## エンティティ

### 問題（MahjongHand / Seed 1件）

シードデータおよびアプリで扱う「1問」を表す。正規のソースは `doc/seed/mahjong_hands.json` の配列要素。

| 属性 | 型 | 必須 | 説明 |
|------|-----|------|------|
| id | string | 推奨 | 一意識別子。JSON では既存・新規とも id を持つ。seed 時に DynamoDB に渡す。 |
| tiles | string[] | ✅ | 手牌13枚。各要素は牌コード（TileCode）。 |
| winningTiles | string[] | ✅ | 正解の待ち牌のリスト。多面張の場合は全て列挙する。 |
| difficulty | "low" \| "middle" \| "high" | ✅ | 難易度。全問題に自動判定で付与する。 |

- **牌コード（TileCode）**: 既存の `src/lib/mahjong/mahjongHand.ts` の `TileCode` 型に準拠（`1m`〜`9m`, `1p`〜`9p`, `1s`〜`9s`, `ton`, `nan`, `sha`, `pe`, `haku`, `hatsu`, `chun`）。
- **tiles**: 長さは厳密に 13。各牌は上記コードのいずれか。
- **winningTiles**: 長さは 1 以上（単騎〜多面張）。各要素は TileCode。手牌に含まれる枚数と合わせて、同一牌は最大4枚までというルールを満たす必要がある（例: 手牌に 5m が3枚なら、5m は待ち牌に1枚まで）。

## バリデーションルール（FR 対応）

- **FR-001 / FR-006**: 正答の妥当性  
  - winningTiles の各牌について、「手牌13枚 + その1枚」でアガリ形が構成できること。  
  - 実装では既存の `validateMahjongHand` に加え、同一牌4枚上限チェックと、必要に応じて待ち計算または手動検証で保証する。
- **FR-002**: 同一牌は4枚まで  
  - tiles 内の各牌コードの出現回数は 4 以下。winningTiles を足す場合も、tiles + 当該待ち牌 の合計で各牌 4 枚まで。
- **FR-004 / FR-005**: 難易度  
  - 全問題に `difficulty` を持たせ、値は `low` / `middle` / `high` のいずれか。判定基準は research.md に従い、実装時に閾値を固定する（例: 待ち種類数・役の有無で分類）。

## 難易度判定基準（実装時閾値）

自動判定で low / middle / high を付与するための基準。同一の判定基準で再現可能にすること。

- **待ちの数**: winningTiles の種類数（ユニークな牌コード数）。1種類＝単騎等 → high 寄り、2〜3種類 → middle、4種類以上 → high。
- **形の複雑さ**: 国士無双・純正九蓮・チンイツ（清一色）・複合多面張などは high。リャンメン・シャボ・カンチャン・ペンチャンなど基本形は low〜middle。
- **役の有無**: 国士・九蓮・チンイツ等の役ありは high に寄せる。
- **閾値の例**（実装で固定）: 待ち種類数 1 または 役あり（国士・九蓮・チンイツ等）→ high。待ち種類数 2〜3 かつ 基本形 → middle。待ち種類数 2 以上かつ 基本形のみ → low。境界は「役あり → high」「待ち4種類以上 → high」を優先し、それ以外を待ち数と形で middle/low に振る。

## 状態・ライフサイクル

- シードデータは静的。作成・修正はリポジトリ上の JSON 編集と検証スクリプトで行い、`npm run seed` で DynamoDB に投入する。DynamoDB 側の MahjongHand スキーマに `difficulty` を追加するかは、アプリで難易度を使う場合に別タスクで対応する。

## 既存コードとの対応

- **MahjongHand 型**（`src/lib/mahjong/mahjongHand.ts`）: アプリ・seed で id / tiles / winningTiles を利用済み。difficulty はシード JSON に必須とする；型定義と Amplify スキーマへの追加は、アプリで使用する場合に実施する。
- **validation.ts**: 手牌13枚・牌コード妥当性を検証済み。同一牌4枚上限と winningTiles の妥当性は、本機能で拡張する。
- **scripts/seedMahjongHands.ts**: `doc/seed/mahjong_hands.json` を読み、MahjongHand を作成。difficulty をスキーマに追加する場合は create 時に渡す。
