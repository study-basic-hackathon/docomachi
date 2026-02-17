# Docomachi Frontend

Next.js App Routerを使用したフロントエンドアプリケーションです。

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

### ビルド

```bash
npm run build
```

### テストの実行

```bash
npm test
```

## プロジェクト構造

```
frontend/
├── src/
│   ├── app/              # Next.js App Router ページ
│   ├── components/        # React コンポーネント
│   │   └── ui/           # shadcn/ui コンポーネント
│   └── lib/              # ユーティリティ関数
├── public/               # 静的ファイル
│   └── images/           # 画像ファイル
└── tests/                # テストファイル
```

## 技術スタック

- **Next.js 14**: App Router
- **React 18**: UI ライブラリ
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **shadcn/ui**: UI コンポーネント
- **Jest**: テストフレームワーク
- **React Testing Library**: コンポーネントテスト

## 開発ガイドライン

- ESLint と Prettier を使用してコード品質を維持
- husky を使用してコミット前に自動リント・フォーマット
- Jest を使用してミニマムなテストケースを実装

### Gitフック（husky）

プロジェクトルートで`npm install`を実行すると、huskyが自動的にセットアップされ、コミット前にJestテストが自動実行されます。

- テストが成功した場合のみコミットが完了します
- テストが失敗した場合、コミットがブロックされます
- 緊急時のみ`git commit --no-verify`でフックをスキップできます（推奨しません）
