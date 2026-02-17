<!--
Sync Impact Report:
Version change: 1.0.0 → 1.0.1 (PATCH: AWS Amplify Gen → AWS Amplify Gen2 への修正)
Modified principles: I. AWS Amplify Gen ベースの開発 → I. AWS Amplify Gen2 ベースの開発
Added sections: N/A
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - No changes needed (generic template)
  ✅ tasks-template.md - No changes needed (generic template)
Follow-up TODOs: None
-->

# Docomachi Constitution

## Core Principles

### I. AWS Amplify Gen2 ベースの開発

フロントエンドはNext.js、バックエンドはサーバレス構成でAppSyncとDynamoDBを用いて開発する。Lambda関数も含めて全てバックエンドはTypeScriptを使用する。AWS Amplify Gen2を使用して開発を進める。

**Rationale**: AWS Amplify Gen2は型安全なコード生成と統合された開発体験を提供し、AppSyncとDynamoDBの統合を簡素化する。TypeScriptの使用により、バックエンド全体で一貫した型安全性を確保する。

### II. テストとコード品質

テストについてはJestを使用して、ミニマムのテストケースのみを用意する。lintとprettierはhuskyを使用して自動実行する。

**Rationale**: ミニマムなテストケースにより開発速度を維持しつつ、基本的な品質を確保する。huskyによる自動実行により、コード品質の一貫性を保つ。

## Development Workflow

### コード品質チェック

- すべてのコミット前にhuskyフックによりlintとprettierが自動実行される
- テストはJestを使用して実装する
- テストケースは最小限に保ち、重要な機能のみをカバーする

### 技術スタック

- **フロントエンド**: Next.js
- **バックエンド**: AWS AppSync、DynamoDB、Lambda（すべてTypeScript）
- **開発ツール**: AWS Amplify Gen2
- **テスト**: Jest
- **コード品質**: ESLint、Prettier（husky経由で自動実行）

## Governance

この憲法はプロジェクトのすべての開発実践に優先する。修正には文書化、承認、移行計画が必要である。

すべてのPR/レビューはこの憲法への準拠を確認しなければならない。複雑性は正当化されなければならない。

**Version**: 1.0.1 | **Ratified**: 2026-02-17 | **Last Amended**: 2026-02-17
