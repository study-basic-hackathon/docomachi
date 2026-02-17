# Research: Huskyセットアップとコミット前テスト実行

**Date**: 2026-02-17  
**Feature**: Huskyセットアップとコミット前テスト実行  
**Plan**: [plan.md](./plan.md)

## Technical Decisions

### Huskyバージョンとセットアップ方法

**Decision**: Husky v8+を使用し、`.husky/`ディレクトリベースのセットアップを採用する

**Rationale**:
- Husky v8以降は`.husky/`ディレクトリを使用し、Gitフックを直接管理する方式に変更された
- この方式により、フックスクリプトがGitリポジトリに直接コミットされ、新しい開発者がクローンした際に自動的に適用される
- `prepare`スクリプトを使用して、`npm install`時に自動的にhuskyを初期化する

**Implementation**:
1. ルートディレクトリに`package.json`を作成（存在しない場合）
2. `husky`をdevDependenciesに追加
3. `prepare`スクリプトを追加して`husky install`を実行
4. `.husky/pre-commit`ファイルを作成してJestテストを実行するスクリプトを記述

### Jestテスト実行方法

**Decision**: frontendディレクトリのJestテストを実行する

**Rationale**:
- プロジェクト構造上、Jestテストは`frontend/`ディレクトリに設定されている
- `frontend/package.json`に`test`スクリプトが既に定義されている（`jest`）
- ルートから`cd frontend && npm test`でテストを実行する

**Implementation**:
- `.husky/pre-commit`スクリプトで`cd frontend && npm test`を実行
- テストが失敗した場合（exit code非ゼロ）、Gitがコミットをブロックする

### テストファイルが存在しない場合の処理

**Decision**: `--passWithNoTests`フラグを使用して、テストファイルが存在しない場合でもコミットを許可する

**Rationale**:
- プロジェクト初期段階ではテストファイルが存在しない可能性がある
- テストファイルがない場合でもコミットをブロックすると、開発フローが阻害される
- ただし、テストファイルが存在する場合は必ず実行される

**Implementation**:
- `frontend/package.json`の`test`スクリプトを`jest --passWithNoTests`に変更するか、pre-commitフックで直接指定する

### セットアップの再現性

**Decision**: `prepare`スクリプトを使用して、`npm install`時に自動的にhuskyを初期化する

**Rationale**:
- 新しい開発者がリポジトリをクローンし、`npm install`を実行すると、自動的にhuskyがセットアップされる
- 手動でのセットアップ手順が不要になり、オンボーディングが簡素化される
- `.husky/`ディレクトリとフックファイルをGitリポジトリにコミットすることで、チーム全体で同じ設定を共有できる

**Implementation**:
- ルート`package.json`に`"prepare": "husky install"`を追加
- `.husky/`ディレクトリとその中のファイルをGitリポジトリにコミット

## Constraints and Considerations

### プロジェクト構造の制約

- ルートディレクトリに`package.json`が存在しない
- Jestテストは`frontend/`ディレクトリに設定されている
- huskyはGitリポジトリのルートで動作する必要がある

### パフォーマンス考慮事項

- テスト実行時間は通常30秒以内を目標とする
- テストが長時間実行される場合は、開発者の体験に影響を与える可能性がある
- 必要に応じて、テストの並列実行やキャッシュを検討する

### エラーハンドリング

- テストが失敗した場合、明確なエラーメッセージを表示する
- Jestのデフォルトのエラー出力をそのまま使用し、開発者が問題を特定しやすくする

## Alternatives Considered

### Alternative 1: lint-stagedを使用した段階的なテスト実行

**Rejected**: 
- 仕様書では「コミット前にJestテストが実行される」と明記されており、変更されたファイルのみをテストする段階的な実行は要件を満たさない
- プロジェクト全体のテストを実行することで、回帰テストの確実性が向上する

### Alternative 2: GitHub ActionsなどのCI/CDでのテスト実行

**Rejected**:
- 仕様書では「コミット前に」テストを実行することが要件となっている
- CI/CDでの実行では、コミット後にテストが実行されるため、要件を満たさない

## Open Questions

なし - すべての技術的な決定が明確になっている
