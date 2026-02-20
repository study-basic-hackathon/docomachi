# Research: 002-amplify-backend-setup

**Branch**: `002-amplify-backend-setup`  
**Date**: 2025-02-20

## 1. AWS Amplify Gen2 バックエンド構成

**Decision**: リポジトリルートに `amplify/` を配置し、`backend.ts` で `defineBackend()` により auth と data を組み合わせる。`amplify/auth/resource.ts` と `amplify/data/resource.ts` で各リソースを定義する。

**Rationale**: Amplify Gen2 の推奨構造に従い、既存の `frontend/` と並存するモノレポとする。Next.js は constitution で採用済みであり、Amplify は Next.js と統合可能。

**Alternatives considered**: 別リポジトリにバックエンドを分離する案は、本仕様の「コードの実装のみ」「PR で提出」という範囲では採用しない。単一リポジトリで完結させる。

---

## 2. 認証（デフォルト）

**Decision**: Amplify の `defineAuth()` でデフォルト設定（メール/パスワード）を使用する。Amazon Cognito が背後で利用される。

**Rationale**: 仕様の「AWS Amplify のデフォルトの認証機能」に合致。Gen2 では `defineAuth()` がデフォルトで Cognito をプロビジョンする。

**Alternatives considered**: ソーシャルログインや MFA は仕様で範囲外のため、今回含めない。

---

## 3. DynamoDB docomachi テーブル

**Decision**: Amplify Gen2 の Data で `defineData()` を用い、モデル名を docomachi（または仕様に合わせた名前）とし、パーティションキーのみ UUID で定義する。他属性は追加しない。

**Rationale**: 仕様で「パーティションキーは UUID」「本機能では PK のみ」と明確。Amplify Data は AppSync + DynamoDB を生成するため、スキーマ上は `id` を UUID 型で定義する。

**Alternatives considered**: ソートキー・GSI は後続のデータ要件で追加する方針のため、今回のスキーマには含めない。

---

## 4. デプロイ・リージョン

**Decision**: 本機能ではデプロイしない。リージョンはコードにハードコードせず、Amplify のデフォルトまたは依頼者がマージ後にコンソールで設定する。

**Rationale**: 仕様および Clarifications で合意済み。

---

## 5. ビルド・検証

**Decision**: `amplify/` 配下の TypeScript がビルド可能であること、および（可能であれば）Amplify の sandbox やビルドコマンドで検証できることを quickstart に記載する。

**Rationale**: FR-005「ローカルでのビルドや検証が可能」を満たすため。デプロイは行わないが、`npx ampx sandbox` などのコマンドは「検証」の範囲で利用可能とする（実行は任意）。
