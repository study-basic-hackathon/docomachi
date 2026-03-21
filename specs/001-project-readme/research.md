# Research: プロジェクト README

**Date**: 2025-03-22  
**Feature**: プロジェクト README  
**Plan**: [plan.md](./plan.md)

## 1. README 本文と既存スターターテンプレートの扱い

**Decision**: ルート `README.md` を、Amplify スターターの英語テンプレートから **プロジェクト向けの日本語 README に全面差し替え** する。

**Rationale**:

- 仕様 FR-006 により、説明文は日本語のみとし、英語のみの段落を置けない。現状のルート README は英語主体のため要件と両立しない。
- スターターのデプロイ手順の一部は [AWS ドキュメント](https://docs.amplify.aws/) へリンクすれば十分な場合が多い。

**Alternatives considered**:

- 英語テンプレートを残し日本語を後段に追加 → FR-006（英語主体セクション不可）に抵触するため不採用。
- `README.ja.md` に分離 → 仕様の「リポジトリ直下の主要な説明ドキュメント」は通常 `README.md` のため、発見性が下がる不採用。

## 2. スクリーンショットの保存場所と参照方法

**Decision**: 画像を `doc/readme/screenshots/` にコミットし、README から **リポジトリルートからの相対パス**（例: `doc/readme/screenshots/top.png`）で参照する。

**Rationale**:

- GitHub の Markdown はリポジトリ内相対パスで画像を表示できる。
- `public/` はアプリ配信用であり、README 専用アセットをドキュメントツリー（`doc/`）にまとめると「仕様・計画」と並ぶ運用がしやすい。
- `top-banner.png` 等が既に `public/` にある場合でも、README 用は意図が明確な `doc/readme/screenshots/` を正とする（必要なら同じ画面を再キャプチャしてよい）。

**Alternatives considered**:

- `public/images/` のみ使用 → アプリと README の責務が混ざるため優先度を下げた。
- 外部ホスト（Imgur 等） → リポジトリ単体での再現性が落ちるため不採用。

## 3. 技術スタック記載の情報源

**Decision**: README の「使用フレームワーク・パッケージ」は、**ルート `package.json`** の `dependencies` / `devDependencies` を基に、**主要項目のみ** を日本語で短く説明し、全文は `package.json` を参照する旨を書く。

**Rationale**:

- FR-004 は「全体像」であり、全パッケージの列挙は Edge Cases で明示的に不要とされている。
- 憲法・仕様で重要なのは Next.js、React、AWS Amplify（Gen 2）、AppSync / DynamoDB、Tailwind、TypeScript 等の **読者が期待する主軸**。

**Alternatives considered**:

- `npm ls` の出力をそのまま貼る → 可読性が低くメンテナンスも難しいため不採用。

## 4. Speckit の記載内容

**Decision**: 「機能仕様は `/speckit.specify` 等の Speckit ワークフローで管理」「実装計画・タスクは `specs/` 配下にブランチ単位で置く」旨を **1 節で簡潔に** 記載する（コマンド名は実際にリポジトリで使っているものに合わせる）。

**Rationale**:

- FR-002 は方法論の明示であり、詳細手順書まではスコープ外。
- 貢献者が `specs/` と `.specify/` の存在を把握できれば十分。

**Alternatives considered**:

- Speckit の全コマンド一覧を README に載せる → メンテ負荷が高いため不採用（`.specify` または内部ドキュメントへ任せる）。

## 5. 結論

- README は **日本語一本**、画像は **`doc/readme/screenshots/`**、スタックは **`package.json` ベースの要約**、Speckit / Amplify Gen 2 は **短い明示節** で満たす。
- 新規 API やスキーマ変更は不要（[contracts/README.md](./contracts/README.md)）。
