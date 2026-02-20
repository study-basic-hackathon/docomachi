# Feature Specification: デプロイエラー再発の修正

**Feature Branch**: `004-fix-deploy-error`  
**Created**: 2026-02-20  
**Status**: Draft  
**Input**: 修正後マージして再度デプロイ実行したところ、以下のようなログが出ており、デプロイに失敗しました。原因を調査して修正してください。必要であればGitHubのテンプレート（amplify-next-template）を参考にしてください。

## Clarifications

### Session 2026-02-20

- Q: テンプレートの amplify.yml では cd frontend の記述はない。テンプレートを解析して Amplify の修正方針を立ててください。他にも不備があるように思います。 → A: 以下「原因の特定」および「amplify.yml 修正方針」に記載。
- Q: テンプレートに合わせる方針で package.json も調整してください。 → A: 以下「package.json の調整方針」に記載。

#### 原因の特定（amplify-next-template との比較）

- **テンプレートのリポジトリ構成**: [aws-samples/amplify-next-template](https://github.com/aws-samples/amplify-next-template) は **Next.js アプリがリポジトリルート** にあり（`package.json`・`next.config.js`・`app/` がルート直下）、`amplify.yml` に **`cd` は一切ない**。frontend のビルドは `npm run build` のみで、成果物は `baseDirectory: .next`、キャッシュは `.next/cache/**/*`、`node_modules/**/*`、`.npm/**/*`。
- **当プロジェクトの構成**: モノレポで Next.js は **`frontend/`** 配下にある。現行の `amplify.yml` は `cd frontend && npm ci` / `cd frontend && npm run build` および `baseDirectory: frontend/.next` としており、**リポジトリルートをビルドの作業ディレクトリとする前提** で書かれている。
- **エラー「cd: frontend: No such file or directory」の意味**: Amplify コンソールで **アプリのルートディレクトリ（Root directory）が `frontend` に設定されている** 場合、ビルド開始時点の CWD は既に `frontend/` である。そのため `cd frontend` を実行すると「frontend というディレクトリがない」となり失敗する。テンプレートに `cd` がないのは、テンプレートが「ルート＝アプリのルート」の単一構成だからである。
- **その他の不備**: (1) ルートが `frontend` のとき、成果物パスは `frontend/.next` ではなく **`.next`**（CWD が既に frontend のため）。(2) キャッシュパスも `frontend/.next/cache` ではなく **`.next/cache`** など、テンプレートと同様の相対パスに揃える必要がある。(3) preBuild はテンプレートでは frontend に明示されていないが、依存インストールは必要なので **`npm ci`**（または `npm install`）を preBuild に残し、**`cd frontend` は削除** する。

#### amplify.yml 修正方針（テンプレートに合わせる）

- **前提**: Amplify の **ルートディレクトリを `frontend` に設定する** 運用とする。これによりビルド時の CWD は `frontend/` となり、テンプレートと同様に `cd` なしで記述できる。
- **修正内容**:
  1. **preBuild**: `cd frontend && npm ci` → **`npm ci`** のみ（CWD が既に frontend のため）。キャッシュ利用する場合は `npm ci --cache .npm --prefer-offline` を検討可。
  2. **build**: `cd frontend && npm run build` → **`npm run build`** のみ。
  3. **artifacts.baseDirectory**: `frontend/.next` → **`.next`**（frontend がルートなので Next.js のデフォルト出力のまま）。
  4. **cache.paths**: `frontend/.next/cache/**/*` 等 → **`.next/cache/**/*`**、**`node_modules/**/*`**、**`.npm/**/*`**（テンプレートと同じ相対パス）。
- **コンソール側の確認**: App settings → Build settings で **Monorepo / Root directory が `frontend` に設定されていること** を確認する。未設定の場合は `frontend` に設定する。
- **backend セクション**: テンプレートには `backend` と `npx ampx pipeline-deploy` がある。当プロジェクトでバックエンドを Amplify でデプロイする場合は別途追加する。本機能のスコープはフロントエンドのビルド・成果物の修正に絞る。

#### package.json の調整方針（テンプレートに合わせる）

- **テンプレートの package.json**: ルートに 1 つだけあり、`scripts` は `dev` / `build` / `start` / `lint` のみ（`prepare` なし）。`npm run build` で Next がビルドされる。
- **当プロジェクト**: ルートの `package.json` は `prepare: "husky install"` のみ。`frontend/package.json` に Next 用の scripts と依存がある。Amplify のルートを `frontend` にすると、ビルド時に参照されるのは **frontend/package.json のみ**（ルートの package.json は使われない）。
- **調整内容**:
  1. **frontend/package.json**
     - **scripts**: テンプレートと同様に `dev`, `build`, `start`, `lint` を維持する。Constitution で Jest を使用するため `test` は残してよい。**`prepare` を追加しない**（テンプレートにない。Amplify で CWD が frontend のとき `npm ci` 実行で prepare が走るとルートの husky が絡み問題になり得るため、frontend 単体では prepare を持たない）。
     - **dependencies / devDependencies**: 既存の Next / React / Tailwind 等のままでもビルド可能。テンプレートは `aws-amplify` 等を持つが、本機能ではフロントのビルド・デプロイのみを対象とするため必須ではない。必要に応じてバージョンをテンプレートに近づけてもよいが、動作を崩さない範囲とする。
  2. **ルートの package.json**
     - Amplify のビルドルートが `frontend` の場合、ビルド時には参照されない。リポジトリ全体の husky 用として現状のまま維持する。**ビルドでルートの `npm install` が実行されないようにする** のは、Amplify の「ルートディレクトリ = frontend」設定で達成する。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - マージ後のデプロイ成功 (Priority: P1)

デプロイ担当者が修正をマージした後、Amplify コンソールから再度デプロイを実行したとき、ビルドが完了し、デプロイが「Artifact directory doesn't exist」などの理由で失敗せずに完了し、デプロイされたアプリケーションにアクセスできること。

**Why this priority**: 修正をマージした後もデプロイが失敗する場合、修正が正しく適用されていないか、別の原因があることを示しており、本番環境へのデプロイができない状態が続く。

**Independent Test**: 修正をマージしたブランチで Amplify コンソールからデプロイを1回実行し、ログにエラーが出ずにデプロイが完了し、発行されたURLでアプリが表示されることで検証できる。

**Acceptance Scenarios**:

1. **Given** 修正（amplify.yml 追加など）がマージ済み、**When** Amplify コンソールからデプロイを実行する、**Then** amplify.yml の設定が正しく適用され、ビルドコマンドが実行され、成果物ディレクトリが存在するためデプロイフェーズでエラーにならない。
2. **Given** 上記のデプロイが完了した状態、**When** 発行されたアプリURLにアクセスする、**Then** アプリケーションのトップが表示される。

---

### User Story 2 - 設定の確実な適用 (Priority: P2)

デプロイ担当者が amplify.yml などの設定ファイルを追加・更新したとき、その設定が Amplify のビルドプロセスで確実に適用され、期待されるビルドコマンドと成果物パスが使用されること。

**Why this priority**: 設定ファイルが存在しても適用されない場合、デプロイが失敗し続ける。設定が確実に適用されることで、今後の設定変更も信頼できる。

**Independent Test**: amplify.yml を更新し、デプロイを実行してビルドログを確認し、設定したコマンドが実行され、成果物が期待されるパスに生成されることを確認できる。

**Acceptance Scenarios**:

1. **Given** amplify.yml に特定のビルドコマンドと成果物パスが設定されている、**When** デプロイを実行する、**Then** ビルドログに設定したコマンドが実行されていることが確認でき、成果物が設定したパスに存在する。

---

### Edge Cases

- Amplify のルートディレクトリが `frontend` に設定されている場合、amplify.yml 内に `cd frontend` があると「No such file or directory」で失敗する。Clarifications の修正方針に従い、ルート＝frontend のときは `cd` を使わずテンプレート同様の相対パスとする。
- amplify.yml がリポジトリに存在するが、Amplify コンソール側の設定で上書きされている場合、どちらの設定が優先されるか、または設定の競合が検出されること。
- ビルドログに「Unable to write cache」や「Failed to set up process.env.secrets」などの警告が出る場合、それらがデプロイ失敗の直接原因になっていないこと（警告のみでデプロイは成功する、または必要に応じて対処方針が分かること）。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Amplify のビルドプロセスは、リポジトリに存在する amplify.yml の設定を正しく読み込み、適用しなければならない。
- **FR-002**: amplify.yml で指定されたビルドコマンド（preBuild、build）が、デプロイ時に実行されなければならない。
- **FR-003**: amplify.yml で指定された成果物の baseDirectory が、デプロイフェーズで正しく参照され、「Artifact directory doesn't exist」により失敗してはならない。
- **FR-004**: マージ後のデプロイでも、上記 FR-001・FR-002・FR-003 が満たされ、デプロイが完了すること。
- **FR-005**: デプロイが成功した後、発行されたURLからアプリケーションのトップにアクセスできること。

### Key Entities

- **amplify.yml**: Amplify のビルド設定ファイル。ビルドコマンド、成果物パス、キャッシュ設定を定義する。
- **ビルド成果物**: ビルドフェーズが生成する出力。デプロイフェーズがこの場所を前提にホスティング用に利用する。
- **デプロイ環境**: ビルドとデプロイを実行する環境。amplify.yml の設定がこの環境で正しく解釈・適用される必要がある。

## Assumptions

- 対象リポジトリには既に amplify.yml が追加されている（前回の修正で追加済みの想定）。
- Amplify コンソールでアプリのルートディレクトリを **`frontend`** に設定する（または既に設定済み）。これによりビルド時の CWD が `frontend/` となり、amplify.yml はテンプレートと同様に `cd` なし・成果物 `.next` で記述する。
- 参考にするテンプレート（amplify-next-template）は、Next.js がルートにある単一構成のため `cd` がない。当プロジェクトはモノレポなので「ルート＝frontend」とすることでテンプレートに揃える。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: マージ後のデプロイで、デプロイログに「Artifact directory doesn't exist」エラーが出現せず、デプロイが完了する。
- **SC-002**: ビルドログに amplify.yml で指定したビルドコマンド（例: `npm ci`、`npm run build`。ルートが frontend のため `cd frontend` は不要）が実行されていることが確認できる。
- **SC-003**: デプロイ完了後、Amplifyが発行するアプリURLにアクセスすると、アプリケーションのトップが表示される（5秒以内に応答が返る）。
- **SC-004**: 同じ設定で再デプロイを実行した場合も、初回と同様にデプロイが完了し、アプリが利用可能な状態が維持される。
