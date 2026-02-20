## 概要
AWS Amplify の初回デプロイで発生していた `Artifact directory doesn't exist: dist` を解消するため、`amplify.yml` を追加しました。

## 変更内容
- **amplify.yml** をリポジトリルートに追加
  - フロントエンドの preBuild: `cd frontend && npm ci`
  - フロントエンドの build: `cd frontend && npm run build`
  - 成果物: `baseDirectory: frontend/.next`（Next.js の出力先に合わせた）
  - キャッシュ: frontend/.next/cache, frontend/node_modules, .npm
- **specs/003-fix-initial-deploy**: 仕様・計画・タスク・quickstart を追加

## 検証
- ローカルで `cd frontend && npm run build` を実行し `frontend/.next` が生成されることを確認済み
- Amplify コンソールでのデプロイ・アプリURL確認はマージ後に実施してください（quickstart に手順あり）

## 関連
- Spec: specs/003-fix-initial-deploy/spec.md
- Quickstart: specs/003-fix-initial-deploy/quickstart.md
