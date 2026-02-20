# Feature Specification: 初回デプロイ失敗の修正

**Feature Branch**: `003-fix-initial-deploy`  
**Created**: 2026-02-20  
**Status**: Draft  
**Input**: AWS Amplifyのコンソールで最初のデプロイを実行したところデプロイに失敗した。ログでは「Artifact directory doesn't exist: dist」などのエラーが出ている。原因を調査して修正する。必要であればGitHubのテンプレート（amplify-next-template）を参考にする。

## Clarifications

### Session 2026-02-20

- Q: 先ほどのGitHubのテンプレートと比較して原因を特定してください。 → A: 以下「原因の特定」に記載。amplify.yml の欠如と成果物ディレクトリ・ビルドコンテキストの不一致が原因。

#### 原因の特定（amplify-next-template との比較）

- **テンプレート側**: [aws-samples/amplify-next-template](https://github.com/aws-samples/amplify-next-template) ではリポジトリルートに `amplify.yml` があり、フロントエンドビルドで `npm run build` を実行し、成果物の `baseDirectory` を **`.next`**（Next.js のデフォルト出力先）に明示している。ルートが単一の Next アプリのため、ルートでビルドすれば `.next` が生成される。
- **当プロジェクト側**: `amplify.yml` が存在しないため、Amplify のデフォルト挙動となる。デフォルトでは成果物ディレクトリが **`dist`** とみなされる。一方、当リポジトリはモノレポでフロントエンドが `frontend/` にあり、Next.js は **`.next`** に出力するため `dist` は生成されない。さらにルートの `package.json` には `build` スクリプトがなく `prepare`（husky）のみのため、フロントエンドのビルドが実行されていないか、実行されても成果物の場所がデフォルトの `dist` と一致していない。
- **結論**: (1) 成果物ディレクトリの不一致（Amplify デフォルトの `dist` と、Next.js が実際に出力する `.next`）、(2) モノレポ構成でフロントエンドが `frontend/` にあるため、ビルドの実行コンテキスト（どのディレクトリで何を実行するか）と成果物のパスを明示する必要がある。修正では `amplify.yml` の追加（またはコンソール設定）により、フロントエンドのビルドコマンドと成果物の `baseDirectory`（例: `frontend/.next` またはビルド出力に合わせたパス）を指定する。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 初回デプロイの成功 (Priority: P1)

デプロイ担当者がAWS Amplifyコンソールから初回デプロイを実行したとき、ビルドが完了し、デプロイが「Artifact directory doesn't exist」などの理由で失敗せずに完了し、デプロイされたアプリケーションにアクセスできること。

**Why this priority**: 初回デプロイが通らないと、チームは本番やステージングにアプリを出せず、開発サイクルが止まる。

**Independent Test**: Amplifyコンソールでデプロイを1回実行し、ログにエラーが出ずにデプロイが完了し、発行されたURLでアプリが表示されることで検証できる。

**Acceptance Scenarios**:

1. **Given** リポジトリがAmplifyに接続済み、**When** コンソールから初回デプロイを実行する、**Then** ビルドフェーズが成功し、成果物ディレクトリが存在するためデプロイフェーズでエラーにならない。
2. **Given** 上記のデプロイが完了した状態、**When** 発行されたアプリURLにアクセスする、**Then** アプリケーションのトップが表示される。

---

### User Story 2 - 再デプロイの安定動作 (Priority: P2)

デプロイ担当者が同じ設定で2回目以降のデプロイを実行したときも、初回と同様にビルド・デプロイが完了し、アプリが利用可能な状態が維持されること。

**Why this priority**: 初回だけでなく、今後のプッシュや手動デプロイでも同じ問題が起きないことが必要。

**Independent Test**: 初回デプロイ成功後、軽微な変更をプッシュして再度デプロイを実行し、同様に成功することを確認できる。

**Acceptance Scenarios**:

1. **Given** 初回デプロイが成功している、**When** リポジトリに変更をプッシュしてデプロイを再実行する、**Then** ビルドとデプロイが完了し、「Artifact directory doesn't exist」エラーが発生しない。

---

### Edge Cases

- ビルドログに「Unable to write cache」や「Failed to set up process.env.secrets」などの警告が出る場合、それらがデプロイ失敗の直接原因になっていないこと（警告のみでデプロイは成功する、または必要に応じて対処方針が分かること）。
- モノレポやサブディレクトリにフロントエンドがある構成の場合、ビルド対象と成果物のパスがデプロイ環境の期待と一致していること。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: デプロイパイプラインのビルドフェーズは、デプロイフェーズが期待する成果物の出力先に、成果物を生成しなければならない。
- **FR-002**: デプロイフェーズは、ビルドが生成した成果物の場所を参照し、「Artifact directory doesn't exist」により失敗してはならない。
- **FR-003**: 初回デプロイ時（キャッシュや既存の成果物がない状態）でも、上記 FR-001・FR-002 が満たされ、デプロイが完了すること。
- **FR-004**: デプロイが成功した後、発行されたURLからアプリケーションのトップにアクセスできること。

### Key Entities

- **ビルド成果物**: ビルドフェーズが生成する出力。デプロイフェーズがこの場所を前提にホスティング用に利用する。
- **デプロイ環境**: ビルドとデプロイを実行する環境。ビルドの出力先とデプロイの参照先の一致が求められる。

## Assumptions

- 対象リポジトリはフロントエンド（Webアプリ）をビルドする構成であり、Amplify の「Frontend Build」でビルドコマンドが実行される想定である。
- 修正は、Clarifications で特定した原因（成果物ディレクトリの不一致・モノレポでのビルドコンテキストの未指定）に沿い、ビルド実行コンテキストと成果物パスを明示する構成（例: amplify.yml の追加またはコンソール設定）で行うことを想定している。
- 参考にするテンプレート（amplify-next-template）は、Amplify でのビルド・デプロイが通る構成の一例として利用する。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: デプロイ担当者がAmplifyコンソールから初回デプロイを実行したとき、デプロイログに「Artifact directory doesn't exist」エラーが出現せず、デプロイが完了する。
- **SC-002**: デプロイ完了後、Amplifyが発行するアプリURLにアクセスすると、アプリケーションのトップが表示される（5秒以内に応答が返る）。
- **SC-003**: 同じ接続設定で再デプロイを実行した場合も、初回と同様にデプロイが完了し、アプリが利用可能な状態が維持される。
