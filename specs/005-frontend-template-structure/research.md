# Research: 005-frontend-template-structure

## Decision 1: アプリルートをリポジトリルートにする

- **Decision**: frontend の中身をリポジトリルートへ移し、テンプレート（amplify-next-template）と同一のレイアウトにする。
- **Rationale**: Clarifications で選択済み。Amplify のデフォルト挙動やテンプレートとの一致、ドキュメント・サンプルとの対応を優先。
- **Alternatives considered**: frontend/ を維持してその直下だけテンプレート形状に揃える案は、Amplify のルート設定や amplify.yml の `cd` 問題を引きずるため不採用。

## Decision 2: 実装順序（テンプレート → shadcn → トップページ）

- **Decision**: (A) テンプレートどおりの構成でビルド可能にする → (B) shadcn 導入 → (C) 001 仕様でトップページ再実装。
- **Rationale**: 土台をテンプレートに揃えてから UI ライブラリを入れ、その上で 001 の要件を実装する方が、デプロイ・ビルドの検証がしやすい。
- **Alternatives considered**: 先に 001 を実装してから移行すると、移行時のパス修正が増えるため、先に構成を固める順序を採用。

## Decision 3: トップページ要件の参照先

- **Decision**: トップページの機能・UI 要件は [specs/001-top-page/spec.md](../001-top-page/spec.md) に準拠する。
- **Rationale**: ユーザー指示「実装に関しては @specs/001-top-page/spec.md を参考に」に従う。緑背景・バナー・スタートボタン・遷移を満たす。
- **Alternatives considered**: 005 仕様のみだと「既存のトップページを維持」程度の記載のため、001 を明示参照して具体化。

## Decision 4: UI ライブラリ

- **Decision**: shadcn/ui を採用（doc/plan/1-1_top.md に記載）。
- **Rationale**: プロジェクト方針。トップページのスタートボタン等は shadcn の Button 等で実装する。
- **Alternatives considered**: テンプレートは標準の React/Next のみ。shadcn は Phase B で追加するため、Phase A では含めない。
