# Implementation Plan: 初回デプロイ失敗の修正

**Branch**: `003-fix-initial-deploy` | **Date**: 2026-02-20 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification and Clarifications (amplify-next-template 比較による原因特定)

## Summary

Amplify の初回デプロイで「Artifact directory doesn't exist: dist」が発生している。原因は (1) amplify.yml の欠如によりデフォルトの成果物パス `dist` が使われている、(2) モノレポでフロントエンドが `frontend/` にあり Next.js は `.next` に出力するため不一致。修正方針: リポジトリルートに `amplify.yml` を追加し、フロントエンドのビルドコマンドと成果物の `baseDirectory`（`frontend/.next`）を明示する。

## Technical Context

**Language/Version**: Node.js (既存)、TypeScript (frontend)  
**Primary Dependencies**: Next.js 14 (frontend), AWS Amplify Hosting  
**Storage**: N/A（本機能はデプロイ設定のみ）  
**Testing**: 手動（Amplify コンソールでデプロイ実行・URL 確認）  
**Target Platform**: AWS Amplify Build & Hosting  
**Project Type**: モノレポ（frontend/, amplify/）  
**Constraints**: 既存の frontend/ と amplify/ 構成を変えず、ビルド設定の追加のみで対応

## Project Structure (relevant)

```text
# リポジトリルート
amplify.yml          # 本機能で追加（Frontend ビルド・成果物パス指定）
package.json         # ルート（prepare のみ。変更不要の想定）
frontend/
├── package.json     # next build あり
├── .next/           # Next.js ビルド出力（Amplify が参照する成果物）
└── ...
amplify/             # バックエンド定義（本機能では触れない）
```

**Structure Decision**: 既存モノレポを維持。amplify.yml をルートに追加し、frontend のビルドと成果物パスを指定する。
