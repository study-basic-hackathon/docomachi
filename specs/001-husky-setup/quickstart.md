# Quickstart: Huskyセットアップとコミット前テスト実行

**Feature**: Huskyセットアップとコミット前テスト実行  
**Plan**: [plan.md](./plan.md) | **Research**: [research.md](./research.md)

## セットアップ手順

### 1. 依存関係のインストール

ルートディレクトリで以下のコマンドを実行：

```bash
npm install
```

これにより、`prepare`スクリプトが自動実行され、huskyが初期化されます。

### 2. 動作確認

#### テストが成功する場合のコミット

```bash
# 変更をステージング
git add .

# コミットを実行（テストが自動実行される）
git commit -m "feat: add new feature"
```

**期待される動作**:
- pre-commitフックが自動実行される
- Jestテストが実行される
- すべてのテストが成功した場合、コミットが完了する

#### テストが失敗する場合のコミット

```bash
# テストを失敗させる変更を加える（例：テストファイルを壊す）
# 変更をステージング
git add .

# コミットを実行
git commit -m "feat: add feature"
```

**期待される動作**:
- pre-commitフックが自動実行される
- Jestテストが実行される
- テストが失敗した場合、コミットがブロックされる
- エラーメッセージが表示される

#### フックをスキップする場合（緊急時のみ）

```bash
git commit --no-verify -m "emergency fix"
```

**注意**: 通常は使用しないでください。テストをスキップすると、コード品質が低下する可能性があります。

## 新しい開発者のオンボーディング

### 初回セットアップ

1. リポジトリをクローン：
   ```bash
   git clone <repository-url>
   cd docomachi
   ```

2. 依存関係をインストール：
   ```bash
   npm install
   ```
   
   これにより、huskyが自動的にセットアップされます。

3. 動作確認：
   ```bash
   # テストを実行して確認
   cd frontend && npm test
   ```

### 動作確認

初回コミットを試みて、pre-commitフックが正常に動作することを確認：

```bash
# 小さな変更を加える
echo "# Test" >> README.md

# コミットを試みる
git add README.md
git commit -m "test: verify husky setup"
```

## トラブルシューティング

### Huskyが動作しない場合

1. `.husky/`ディレクトリが存在するか確認：
   ```bash
   ls -la .husky/
   ```

2. pre-commitフックが実行可能か確認：
   ```bash
   ls -la .husky/pre-commit
   ```

3. 手動でhuskyを再インストール：
   ```bash
   npx husky install
   ```

### テストが実行されない場合

1. frontendディレクトリにJestが設定されているか確認：
   ```bash
   cd frontend && npm test
   ```

2. `.husky/pre-commit`ファイルの内容を確認：
   ```bash
   cat .husky/pre-commit
   ```

### テストファイルが存在しない場合のエラー

テストファイルが存在しない場合でもコミットできるように、`--passWithNoTests`フラグが使用されています。それでもエラーが発生する場合は、`frontend/package.json`の`test`スクリプトを確認してください。

## 統合シナリオ

### シナリオ1: 通常の開発フロー

1. コードを変更
2. 変更をステージング（`git add`）
3. コミットを実行（`git commit`）
4. pre-commitフックが自動実行され、Jestテストが実行される
5. テストが成功した場合、コミットが完了する

### シナリオ2: テスト失敗時の対応

1. コードを変更し、テストを失敗させる変更を含める
2. 変更をステージング
3. コミットを実行
4. pre-commitフックが実行され、テストが失敗
5. コミットがブロックされ、エラーメッセージが表示される
6. テストを修正
7. 再度コミットを実行（今度は成功）

### シナリオ3: チーム開発での一貫性確保

1. 新しい開発者がリポジトリをクローン
2. `npm install`を実行
3. `prepare`スクリプトにより、huskyが自動的にセットアップされる
4. すべての開発者が同じpre-commitフックを使用する
5. コード品質が一貫して保たれる

## 検証チェックリスト

セットアップが正常に完了したことを確認するためのチェックリスト：

- [ ] `.husky/`ディレクトリが存在する
- [ ] `.husky/pre-commit`ファイルが存在し、実行可能である
- [ ] ルート`package.json`に`prepare`スクリプトが定義されている
- [ ] `npm install`を実行すると、huskyが自動的にセットアップされる
- [ ] コミットを実行すると、Jestテストが自動実行される
- [ ] テストが成功した場合、コミットが完了する
- [ ] テストが失敗した場合、コミットがブロックされる
