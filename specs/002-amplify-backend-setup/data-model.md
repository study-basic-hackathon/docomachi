# Data Model: 002-amplify-backend-setup

**Branch**: `002-amplify-backend-setup`  
**Date**: 2025-02-20

## 概要

本機能では docomachi 用の 1 モデルのみを定義する。パーティションキーは UUID。他属性は後続のデータ要件で追加する。

## エンティティ

### Docomachi

| 論理名 | 説明 |
|--------|------|
| Docomachi | アプリの主要データを格納する永続ストア。Amplify Data のモデルとして定義し、DynamoDB テーブルに対応する。 |

#### フィールド（本機能で定義する範囲）

| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| id | UUID (ID) | ✓ | パーティションキー。一意識別子。Amplify Gen2 のデフォルトでは自動生成される UUID を使用。 |

#### 制約・検証

- 一意性: `id` によりレコードは一意に識別される。
- 他属性: 本機能では定義しない。後続でソートキー・GSI・追加属性を検討する。

#### 状態・ライフサイクル

- 本機能では状態遷移は定義しない（CRUD は Amplify Data のデフォルト挙動に従う）。

## 実装上の注意

- Amplify Gen2 の `defineData()` では、モデルに `id` を明示しなくてもデフォルトで `id: a.id()` が付与され、UUID が自動生成される。
- テーブル名は Amplify がモデル名から生成する。仕様上の「docomachi テーブル」は、モデル名を `Docomachi`（または規定に合わせた名前）とすることで対応する。
- 認証は別リソース（`defineAuth()`）で定義し、Data の authorization で `allow.authenticated()` 等を指定する方針とする（詳細は実装時に合わせる）。
