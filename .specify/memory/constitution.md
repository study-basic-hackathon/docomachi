<!--
Sync Impact Report:
Version change: 1.0.1 → 1.1.0 (MINOR: プロジェクト目的の明文化、原則 III・IV 追加)
Modified principles: N/A
Added sections: Purpose（プロジェクト目的）、III. タスク開始手順、IV. タスク範囲と PR/トークン
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Constitution Check は原則ベースのまま整合
  ✅ spec-template.md - 変更不要（汎用テンプレート）
  ✅ tasks-template.md - 変更不要（汎用テンプレート）
Follow-up TODOs: None
-->

# Docomachi Constitution

## Purpose

麻雀の聴牌状態から待ち牌を当てるクイズアプリを作成する。

## Core Principles

### I. AWS Amplify Gen2 ベースの開発

フロントエンドはNext.js、バックエンドはサーバレス構成でAppSyncとDynamoDBを用いて開発する。Lambda関数も含めて全てバックエンドはTypeScriptを使用する。AWS Amplify Gen2を使用して開発を進める。

**Rationale**: AWS Amplify Gen2は型安全なコード生成と統合された開発体験を提供し、AppSyncとDynamoDBの統合を簡素化する。TypeScriptの使用により、バックエンド全体で一貫した型安全性を確保する。

### II. テストとコード品質

テストについてはJestを使用して、ミニマムのテストケースのみを用意する。lintとprettierはhuskyを使用して自動実行する。

**Rationale**: ミニマムなテストケースにより開発速度を維持しつつ、基本的な品質を確保する。huskyによる自動実行により、コード品質の一貫性を保つ。

### III. タスク開始手順

タスクの開始時は、特に指定がない限り main ブランチの最新を fetch してから、新たにブランチを作成して開始する。

**Rationale**: 常に最新の main から分岐することでマージコンフリクトを減らし、レビュー・CI の前提を揃える。

### IV. タスク範囲と PR / トークン

タスクにはプルリクエストの作成までを含める。GitHub のトークンは .env の GITHUB_TOKEN を使用する。

**Rationale**: タスク完了の定義を「PR 作成まで」に統一し、レビュー・マージまでの一連の流れを担保する。トークンは .env で一元管理し、リポジトリにコミットしない。

## Development Workflow

### コード品質チェック

- すべてのコミット前にhuskyフックによりlintとprettierが自動実行される
- テストはJestを使用して実装する
- テストケースは最小限に保ち、重要な機能のみをカバーする

### タスクとブランチ

- タスク開始時は main の最新を fetch してからブランチを作成する
- タスク完了時はプルリクエストを作成するまでをタスクに含める
- GitHub API 利用時は .env の GITHUB_TOKEN を使用する

### 技術スタック

- **フロントエンド**: Next.js
- **バックエンド**: AWS AppSync、DynamoDB、Lambda（すべてTypeScript）
- **開発ツール**: AWS Amplify Gen2
- **テスト**: Jest
- **コード品質**: ESLint、Prettier（husky経由で自動実行）

## Governance

この憲法はプロジェクトのすべての開発実践に優先する。修正には文書化、承認、移行計画が必要である。

すべてのPR/レビューはこの憲法への準拠を確認しなければならない。複雑性は正当化されなければならない。

**Version**: 1.1.0 | **Ratified**: 2026-02-17 | **Last Amended**: 2026-02-20
