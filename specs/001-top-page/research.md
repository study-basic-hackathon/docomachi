# Research: フロントエンド トップページ

**Created**: 2026-02-17  
**Feature**: [spec.md](./spec.md)

## Technology Decisions

### Next.js App Router

**Decision**: Next.js App Routerを採用し、`app/page.tsx` にトップページを実装する。

**Rationale**: 
- 憲法でNext.jsが指定されている
- App RouterはNext.js 13+の推奨ルーティング方式
- Server ComponentsとClient Componentsの使い分けが可能
- ファイルベースルーティングでシンプル

**Alternatives considered**:
- Pages Router: レガシー方式のため採用しない

### shadcn/ui

**Decision**: UIライブラリとしてshadcn/uiを採用する。

**Rationale**:
- ユーザー入力で指定されている
- Tailwind CSSベースでカスタマイズが容易
- コンポーネントをコピーしてプロジェクトに含める方式で、依存関係が明確
- ボタンコンポーネントなど必要なUI要素が揃っている

**Alternatives considered**:
- Material-UI: より重い、カスタマイズが複雑
- Chakra UI: shadcn/uiの方がNext.jsとの統合がスムーズ

### 画像配置

**Decision**: バナー画像を `frontend/src/public/images/top-banner.png` に配置し、Next.jsの `<Image>` コンポーネントで最適化表示する。

**Rationale**:
- Next.jsの `public/` ディレクトリは静的アセットの標準配置場所
- `<Image>` コンポーネントで自動最適化（WebP変換、レスポンシブ対応）
- 読み込み失敗時のフォールバック処理が容易

**Alternatives considered**:
- `src/assets/`: 静的アセットには `public/` が推奨
- 外部CDN: プロジェクト初期段階では不要な複雑さ

### スタイル実装

**Decision**: Tailwind CSS（shadcn/uiに含まれる）を使用し、緑背景はTailwindのカラーパレットから選択する。

**Rationale**:
- shadcn/uiがTailwind CSSベースのため自然な選択
- 「麻雀をイメージさせる緑」は `green-600` や `green-700` などから選択可能
- レスポンシブ対応が容易（`md:`, `lg:` などのブレークポイント）

**Alternatives considered**:
- CSS Modules: Tailwindの方がshadcn/uiとの統合が自然
- styled-components: 追加依存関係が不要

### スタートボタン遷移

**Decision**: Next.jsの `<Link>` または `useRouter` を使用してクライアントサイドナビゲーションを実装する。

**Rationale**:
- Next.js標準のナビゲーション方式
- 遷移先が未定義のため、プレースホルダーまたは `/` へのループを一時的に実装
- 将来の遷移先実装時に容易に変更可能

**Alternatives considered**:
- 通常の `<a>` タグ: クライアントサイドナビゲーションの利点を失う

## Best Practices Applied

1. **画像最適化**: Next.js `<Image>` コンポーネントで自動最適化
2. **レスポンシブデザイン**: Tailwindのブレークポイントでモバイル・デスクトップ対応
3. **エラーハンドリング**: 画像読み込み失敗時のフォールバック表示
4. **パフォーマンス**: 静的ページとして高速表示（Server Component活用）

## Resolved Clarifications

- ✅ Next.js App Router採用（ユーザー入力で明確化）
- ✅ shadcn/ui採用（ユーザー入力で明確化）
- ✅ 画像配置先: `frontend/src/public/images/`（Next.jsベストプラクティス）
- ✅ 緑色の具体的な色: Tailwind `green-600` または `green-700`（実装時に調整可能）
