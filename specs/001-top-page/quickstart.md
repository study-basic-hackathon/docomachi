# Quickstart: フロントエンド トップページ

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

トップページをNext.js App Routerで実装し、緑背景・バナー画像・スタートボタンを表示する。

## Prerequisites

- Node.js 18+ インストール済み
- Next.jsプロジェクト初期化済み（AWS Amplify Gen2環境）
- shadcn/uiセットアップ済み

## Implementation Steps

### 1. バナー画像の配置

```bash
# バナー画像を適切な場所に移動
mkdir -p frontend/src/public/images
cp image/top-banner.png frontend/src/public/images/top-banner.png
```

### 2. トップページの実装

`frontend/src/app/page.tsx` を作成:

```tsx
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function TopPage() {
  return (
    <div className="min-h-screen bg-green-600 flex flex-col items-center">
      {/* バナー画像 */}
      <div className="w-full max-w-4xl mt-8">
        <Image
          src="/images/top-banner.png"
          alt="Top Banner"
          width={1200}
          height={300}
          priority
          className="w-full h-auto"
        />
      </div>
      
      {/* スタートボタン */}
      <div className="mt-12">
        <Button size="lg" className="text-xl px-8 py-6">
          スタート
        </Button>
      </div>
    </div>
  )
}
```

### 3. shadcn/uiボタンコンポーネントの追加

```bash
npx shadcn-ui@latest add button
```

### 4. テストの実装

`frontend/tests/app/page.test.tsx` を作成:

```tsx
import { render, screen } from '@testing-library/react'
import TopPage from '@/app/page'

describe('TopPage', () => {
  it('緑背景が表示される', () => {
    const { container } = render(<TopPage />)
    const bgElement = container.querySelector('.bg-green-600')
    expect(bgElement).toBeInTheDocument()
  })

  it('スタートボタンが表示される', () => {
    render(<TopPage />)
    expect(screen.getByText('スタート')).toBeInTheDocument()
  })
})
```

## Verification

### 手動確認項目

1. ✅ ルートURL（`/`）にアクセスしてトップページが表示される
2. ✅ 緑背景が表示される
3. ✅ バナー画像が上段に表示される
4. ✅ スタートボタンが表示され、クリック可能である
5. ✅ モバイル画面幅でもレイアウトが崩れない

### 自動テスト実行

```bash
cd frontend
npm test -- page.test.tsx
```

## Success Criteria Validation

- **SC-001**: ルートURLアクセスから3秒以内に主要要素表示 → 手動確認
- **SC-002**: スタートボタン1回操作で遷移 → 遷移先実装後に確認
- **SC-003**: 一般的な画面幅でレイアウト崩れなし → レスポンシブテスト

## Next Steps

- スタートボタンの遷移先を実装（別機能）
- バナー画像の最適化（必要に応じて）
- アニメーション効果の追加（オプション）
