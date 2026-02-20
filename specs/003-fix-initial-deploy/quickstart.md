# Quickstart: 初回デプロイ失敗の修正 (003-fix-initial-deploy)

## 初回デプロイの検証（US1）

1. **Amplify コンソールでデプロイを実行**
   - AWS Amplify コンソールで該当アプリを開き、対象ブランチで「デプロイ」を実行する。
2. **ビルドログの確認**
   - ビルドログに「Artifact directory doesn't exist」が**出現しない**ことを確認する。
   - デプロイが完了（緑）になることを確認する。
3. **アプリURLの確認**
   - 発行されたアプリURLを開き、アプリケーションのトップが表示されることを確認する（5秒以内に応答する想定）。

## 再デプロイの検証（US2）

1. **軽微な変更をプッシュ**
   - リポジトリに小さな変更（例: README の追記）をコミット・プッシュする。
2. **再デプロイ**
   - Amplify が自動でビルドする、または手動でデプロイを再実行する。
3. **成功確認**
   - ビルド・デプロイが完了し、「Artifact directory doesn't exist」エラーが発生しないことを確認する。
   - アプリURLで引き続きアプリが表示されることを確認する。

## プルリクエスト（T008 / Constitution IV）

- ブランチ `003-fix-initial-deploy` は push 済みです。
- PR を作成する: [Compare & pull request](https://github.com/study-basic-hackathon/docomachi/compare/003-fix-initial-deploy) から「Create pull request」を実行してください。

## ローカルでの事前確認

- リポジトリルートで `cd frontend && npm run build` を実行し、`frontend/.next` が生成されることを確認する。
- `amplify.yml` がリポジトリルートにあり、`frontend.phases.preBuild` / `frontend.phases.build` および `artifacts.baseDirectory: frontend/.next` が設定されていることを確認する。
