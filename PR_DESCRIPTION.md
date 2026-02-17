# プルリクエスト説明文

## 概要

フロントエンドのトップページを実装しました。Next.js App Routerを使用し、麻雀をイメージさせる緑の背景、バナー画像、スタートボタンを配置しています。

## 実装内容

- Next.js App Routerを使用したトップページコンポーネント
- shadcn/uiを使用したスタートボタン
- Next.js Imageコンポーネントによるバナー画像の最適化表示
- Tailwind CSSによるレスポンシブデザイン
- Jest/React Testing Libraryによるテスト実装

## 技術スタック

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Jest + React Testing Library

## 成功基準

- ✅ SC-001: ルートURLアクセスから3秒以内に主要要素表示
- ✅ SC-002: スタートボタン1回操作で遷移
- ✅ SC-003: 一般的な画面幅でレイアウト崩れなし

## 関連ドキュメント

- 仕様書: `specs/001-top-page/spec.md`
- 実装計画: `specs/001-top-page/plan.md`
- タスクリスト: `specs/001-top-page/tasks.md`

## チェックリスト

- [x] すべてのタスクが完了している
- [x] テストが実装されている
- [x] コードがリント・フォーマットされている
- [x] 成功基準を満たしている
