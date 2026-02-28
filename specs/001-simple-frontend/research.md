# Research: 001-simple-frontend

**Feature**: 一問フロントエンド（麻雀手牌クイズ）  
**Date**: 2025-02-28

## 1. バックエンドへの HTTP クライアント（axios）

**Decision**: 出題データ取得のバックエンド（AppSync）呼び出しに、ユーザー指定どおり **axios** を使用する。

**Rationale**: doc/plan/4-1_simple-frontend.md で「バックエンドへのリクエストは axios を使用する」と明示されている。既存の `generateClient` は fetch ベースのため、AppSync の GraphQL エンドポイントへ axios で POST し、認証ヘッダーは Amplify の `fetchAuthSession` 等で取得して付与する形で実装する。

**Alternatives considered**:
- Amplify `generateClient` のまま利用: 憲法・Amplify Gen2 と整合するが、ユーザー指定の axios と異なる。
- fetch のみ: 指定に反するため不採用。

---

## 2. UI コンポーネント（shadcn）

**Decision**: **shadcn/ui**（doc 上の "shaadcn" は shadcn の誤記と解釈）を使用する。

**Rationale**: プロジェクトに既に `components.json` と shadcn 関連の依存（class-variance-authority, clsx, tailwind-merge 等）が存在する。モーダル・ボタン・障害時表示は shadcn の Dialog / Button / Alert 等で統一する。

**Alternatives considered**:
- 独自コンポーネントのみ: 一貫した見た目とアクセシビリティのため shadcn を採用。
- 他 UI ライブラリ: 既存設定と指定に合わせて shadcn を採用。

---

## 3. 正解判定の実行場所

**Decision**: **フロントエンド**で正解判定を行う。

**Rationale**: 仕様および doc/plan で「正解判定のロジックはフロントエンドで行う」とされている。バックエンドから取得した `winningTiles` とユーザー選択を集合として比較し、一致すれば正解・不一致なら不正解とする。選択の順序は考慮しない（仕様前提条件どおり）。

**Alternatives considered**:
- バックエンドで判定: 指定に反するため不採用。

---

## 4. 牌表示順（萬・索・筒・字）

**Decision**: 仕様どおり **萬子 → 索子 → 筒子 → 字牌（東南西北白發中）** の固定順で表示する。

**Rationale**: spec の FR-004 および既存 `TileCode` 型で定義済み。牌コードと画像ファイル名の対応は `public/images/tiles/` のファイル名と一致させる（例: `1m.gif`, `ton.gif`）。画像欠損時は該当牌のみ「読み込み失敗」等のエラー表示とし、他は表示して続行可能とする（clarify 済み）。

---

## 5. サンドボックス・初期データ・PR

**Decision**: 実装完了後に (1) サンドボックス環境を起動、(2) doc/seed の初期データを投入、(3) 画面で1問表示・解答・正誤確認ができることを確認したうえで、(4) PR を日本語で発行する。

**Rationale**: doc/plan および憲法 IV（タスクに PR まで含め、PR は日本語）に従う。初期データは `doc/seed/mahjong_hands.json` を既存の seed スクリプトで投入する想定。
