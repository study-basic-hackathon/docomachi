# Research: 007-frontend-design

**Feature**: Screen Layout and Visual Polish  
**Date**: 2025-03-07

## 1. UI コンポーネント（shadcn/ui）

**Decision**: 既存の Radix UI + CVA + Tailwind 構成を維持しつつ、shadcn/ui のコンポーネントを `npx shadcn@latest add <component>` で追加する。必要に応じて `npx shadcn@latest init` で components.json を揃える。

**Rationale**: ユーザー指定「UI は shadcn を使用する」に従う。既に `@radix-ui/react-dialog`, `class-variance-authority`, `clsx`, `tailwind-merge` があり、shadcn はこれらに依存するため追加導入は最小限で済む。コンポーネントは `components/ui/` にコピーされ、コード所有でカスタマイズ可能。

**Alternatives considered**:
- 純粋な Radix のみ: デザイン系統一のため shadcn を採用。
- 他 UI ライブラリ（MUI 等）: バンドルとスタイルの一貫性のため shadcn を採用。

---

## 2. トースト / スナックバー（エラー・タイムアウト通知）

**Decision**: **Sonner**（`sonner`）を採用し、`toast.error()` 等で一過性メッセージを表示する。

**Rationale**: 仕様で「トースト／スナックバーで一過性のメッセージ」と明示。Sonner は React 18 対応・TypeScript・軽量で、`toast.error()`, `toast.success()` が用意されており、ルートレイアウトに `<Toaster />` を1つ置くだけで全画面から利用可能。

**Alternatives considered**:
- react-hot-toast: 人気だが Sonner の方が shadcn 系プロジェクトでよく併用される。
- Radix Toast: より低レベルで自前スタイルが必要なため、今回は Sonner で十分。

---

## 3. ローディングオーバーレイ（画面全体 / オーバーレイ）

**Decision**: 専用の **LoadingOverlay** コンポーネントを自前で実装する（fixed 全画面 + 半透明背景 + スピナー + 任意テキスト）。既存の `components/ui` に置き、必要なら shadcn の Spinner や Radix の Progress を組み合わせる。

**Rationale**: 仕様は「画面全体またはオーバーレイ」で、ボタン押下時の非同期処理中に表示。外部パッケージ（react-loading-overlay 等）は依存を増やすだけなので、Tailwind で `fixed inset-0 z-50 flex items-center justify-center bg-black/50` のようなパターンで実装する。既存のクイズページの「読み込み中...」表示を、このオーバーレイに置き換える。

**Alternatives considered**:
- react-loading-overlay-ts: 依存追加を避け、既存スタックで完結させるため不採用。
- ボタン内スピナーのみ: 仕様が「画面全体またはオーバーレイ」のため不採用。

---

## 4. スマホでの横表示固定（Orientation Lock）

**Decision**: **Screen Orientation API**（`screen.orientation.lock("landscape")`）をスマホビューポートで試行し、利用できない場合は **CSS とレイアウトで常にランドスケープ向きのレイアウト**（`min-aspect-ratio` / メディアクエリ）で疑似固定する。PWA の場合は manifest の `orientation: "landscape"` も検討する。

**Rationale**: 仕様は「スマホの横表示に対応。縦にしても横表示で固定」。MDN 等では `screen.orientation.lock()` はモバイルで fullscreen 時など制限があるため、フォールバックとして「縦持ちでもレイアウトは横長」になるよう CSS で対応する。

**Alternatives considered**:
- lock のみに依存: ブラウザ対応が不安定なため、CSS フォールバックを必須とする。
- CSS のみ: 対応可能な環境では API で真正のロックを試み、UX を優先する。

---

## 5. 待ち牌の「色ごとに改行」

**Decision**: 既存の `TILES_DISPLAY_ORDER`（萬→索→筒→字牌）を **スート（m/s/p/字牌）でグループ化** し、AnswerPicker でグループごとにブロック（div）で改行して表示する。`flex-wrap` の単一行ではなく、グループ単位で `flex` または `grid` の行を分ける。

**Rationale**: 仕様「待ち牌選択に関しては色ごとに改行」。`sortTilesForDisplay` の順序は萬・索・筒・字のため、同じスートでまとめて行を分ければ要件を満たす。既存の `TileImage` と選択状態（border 強調）はそのまま利用する。

**Alternatives considered**:
- 1 行 flex-wrap のまま: 仕様で「色ごとに改行」とあるため不採用。
- 別データ構造: 既存の TILES_DISPLAY_ORDER をグループ化するだけで足りるため、大きな変更は不要。

---

## 6. オーバーフロー時の「領域内スクロール」

**Decision**: 待ち牌エリア・ボタンエリアで、コンテナに `overflow-auto` または `overflow-y-auto` と `max-height`（または `flex: 1; min-height: 0`）を指定し、内容がはみ出した場合にその領域内だけでスクロールする。

**Rationale**: 仕様「領域内でスクロールしてすべて表示」。Tailwind の `overflow-auto` と `max-h-*` で実装可能。モバイルではタッチスクロールがそのまま使える。

---

## Summary Table

| 項目 | 採用 | 理由 |
|------|------|------|
| UI コンポーネント | shadcn/ui（既存 Radix + CVA + 追加コンポーネント） | 指定どおり・既存スタックと一致 |
| トースト | Sonner | 一過性メッセージ・実装が簡単 |
| ローディング | 自前 LoadingOverlay（Tailwind） | 依存増やさず・仕様どおりオーバーレイ |
| スマホ横固定 | Screen Orientation API + CSS フォールバック | 対応環境ではロック、それ以外はレイアウトで対応 |
| 待ち牌改行 | スート別グループ + 改行レイアウト | 既存順序を活かした最小変更 |
| オーバーフロー | コンテナ `overflow-auto` + `max-height` | 仕様どおり領域内スクロール |
