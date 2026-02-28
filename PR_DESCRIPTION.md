# 一問フロントエンド（麻雀手牌クイズ）

## 概要

トップページのスタートから出題画面へ遷移し、バックエンドから1問を取得して手牌を萬・索・筒・字の順で表示。待ち牌を複数選択して解答し、正解/不正解をモーダルで表示する機能を実装しました。

## 実装内容

### フロントエンド

- **app/page.tsx**: スタートボタンで `/quiz` へ遷移（バナー画像は一旦削除）
- **app/quiz/page.tsx**: 出題取得（fetchQuestion）、loading/error/ready、手牌・解答ピッカー・解答する・結果モーダル・戻る
- **components/TileImage.tsx**: 牌画像表示（`public/images/tiles/{code}.gif`）、欠損時は「読み込み失敗」
- **components/HandDisplay.tsx**: 手牌を萬索筒字順で表示
- **components/AnswerPicker.tsx**: 全種類の牌を複数選択、選択中の牌をテキスト表示（ref で複数選択の状態を保持）
- **components/ResultModal.tsx**: 正解/不正解モーダル
- **components/AmplifyProvider.tsx**: Amplify 設定（layout で使用）

### API・ロジック

- **src/lib/api/fetchQuestion.ts**: axios で AppSync `listMahjongHands` を呼び出し、1件をランダムで返す。未認証時は API キー（x-api-key）でリクエスト
- **src/lib/mahjong/sortTilesForDisplay.ts**: 萬子→索子→筒子→字牌（東南西北白發中）の表示順でソート

### バックエンド（本 PR で対応）

- **amplify/data/resource.ts**: MahjongHand に `allow.publicApiKey()` を追加し、未認証でも list 取得可能に。`apiKeyAuthorizationMode: { expiresInDays: 365 }` を追加

### シード

- **scripts/seedMahjongHands.ts**: Amplify 設定と API キー認証で `doc/seed/mahjong_hands.json` を投入
- **package.json**: `"seed": "tsx scripts/seedMahjongHands.ts"` を追加

### 仕様・計画

- **specs/001-simple-frontend/**: spec、plan、research、data-model、contracts、quickstart、tasks

## 検証

- ✅ `npm run build` 成功
- ✅ サンドボックスで `npm run seed` により初期データ投入済み
- ✅ トップ→スタート→出題画面→手牌・解答エリア表示・複数選択・解答する→正解/不正解モーダル→やり直し/戻る

## 完了条件

- ✅ T001–T016 完了（tasks.md 参照）
- ⏳ T017: 本 PR 作成（日本語）

## 注意事項

- 認証は別タスクで実装予定。現状は未認証または API キーで出題取得可能
- 牌画像は `public/images/tiles/{牌コード}.gif`（例: `ton.gif`）
