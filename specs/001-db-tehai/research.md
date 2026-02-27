# Research: 麻雀配牌データ取得と初期登録

## Decisions

### 1. バックエンド技術スタック

- **Decision**: AWS Amplify Gen2 + AppSync + DynamoDB + Lambda（すべて TypeScript）
- **Rationale**: プロジェクト憲法により、バックエンドは AppSync と DynamoDB を用いたサーバレス構成とし、TypeScript を用いることが定められている。Amplify Gen2 により型安全なコード生成と統合的な開発体験が得られる。
- **Alternatives considered**:
  - REST API + API Gateway + Lambda: 既存方針が GraphQL/AppSync ベースであるため、本機能だけRESTにする一貫性の欠如がデメリット。
  - 単純な Lambda + DynamoDB 直呼び出しのみ: Amplify Gen2 の恩恵（型生成、環境管理）が受けづらく、プロジェクト方針とズレる。

### 2. データストアの選定とスキーマ方針

- **Decision**: DynamoDB 単一テーブルに `MahjongHand` エンティティを格納する。パーティションキーに `PK = 'MAHJONG_HAND'` 固定、ソートキーに `SK = <UUID>` を利用するシンプルな構造とする。
- **Rationale**: 本機能の主要なアクセスパターンは「ランダムに1件取得する」ことと、「ID 指定で検証または管理画面から閲覧する」ことであり、複雑なクエリは不要。単一テーブル＋シンプルキー構成は運用と拡張が容易。
- **Alternatives considered**:
  - 牌種別や役種別でGSIを張る: 現時点では「ランダム取得」が主目的であり、特定条件での検索は必須ではないため、過剰設計と判断。
  - RDB（例: PostgreSQL）を別途用意: プロジェクト方針に反し、インフラ構成も複雑になるため不採用。

### 3. ランダム取得の実装パターン

- **Decision**: Amplify Data が自動生成する `MahjongHand` モデル用 GraphQL API（例: `listMahjongHands`）を用いて一定件数のレコードを取得し、クライアントまたは薄いバックエンドラッパー側でランダムインデックスにより1件を選択するシンプルな実装から開始する。
- **Rationale**: 想定データ件数が小さい（数十〜数百）ため、テーブルスキャンやGSIベースのランダムアクセス最適化は現時点で不要であり、自動生成GraphQLを利用することで Amplify Gen2 の標準パターンに沿った構成を維持できる。
- **Alternatives considered**:
  - 専用の `getRandomMahjongHand` GraphQL クエリをカスタムスキーマで定義し、AppSync Resolver でランダム選択する: ユーザー要望によりUS1は自動生成GraphQLを利用する方針とし、カスタムスキーマ追加は採用しない。
  - ランダムキーを用いた一様分布アクセス（例: 事前にランダム値を持たせる）: データ件数が増えてからのリファクタ対象とし、初期実装では採用しない。
  - DynamoDB Streams や別テーブルを使った重み付きランダム抽選: 要件に重み付けの必要は記載されておらず、過剰設計と判断。

### 4. 初期データ投入方法

- **Decision**: リポジトリ内に JSON ファイル（例: `doc/seed/mahjong_hands.json`）として国士無双13面待ち・純正九蓮宝燈のデータを定義し、運営・開発者が手動で実行できるシードスクリプト（Amplifyバックエンド側、またはローカルNodeスクリプト）を用意する。
- **Rationale**: 初期データは2件のみであり、本番環境・検証環境ともに同一データを再現可能にするため、コードと一緒にバージョン管理するのが妥当。環境ごとの自動デプロイへの組み込みは将来の検討とする。
- **Alternatives considered**:
  - Amplifyのデプロイ時カスタムリソースとして自動投入: 実装・運用コストが高く、現時点では手動投入＋手順書で十分。
  - 管理画面からフォーム入力で登録: UI実装コストが高く、本機能のスコープを超える。

### 5. 認証・アクセス制御

- **Decision**: ランダム配牌取得エンドポイントはバックエンド内部サービスおよび運営用管理ツールからのみ呼び出せる内部APIとし、認証済みクライアントに限定する（AppSync の認証設定または内部Lambda間呼び出しで制御）。
- **Rationale**: Spec の Clarifications で合意したとおり、一般ユーザーに直接公開する必要はなく、内部利用に限定することでセキュリティリスクと運用複雑性を下げられる。
- **Alternatives considered**:
  - 公開APIとして一般ユーザーから直接呼び出し: レート制御や悪用リスク対応の追加設計が必要で、本機能の目的（問題生成用データ供給）からは過剰。
  - 完全にバッチのみでランダム問題を事前生成する: 柔軟性が低く、将来リアルタイムに配牌を差し替えたい場合に制約となる。

## Resolved NEEDS CLARIFICATION

本featureに関して、Technical Context上の主要な不明点は上記の通り方針を決定済みであり、追加の「NEEDS CLARIFICATION」項目は残っていない。
