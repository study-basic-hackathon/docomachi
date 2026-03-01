# シードデータ（MahjongHand）

`doc/seed/mahjong_hands.json` の内容を DynamoDB（MahjongHand）に投入する手順です。

## サンドボックス環境

1. サンドボックスを起動し、`amplify_outputs.json` が生成されていることを確認する。
2. 以下を実行する。

```bash
npm run seed
```

## 本番環境

本番の DynamoDB に反映するには、**本番にデプロイ済みのバックエンド**の設定（`amplify_outputs`）を使ってシードスクリプトを実行します。

### 前提

- 本番ブランチ（例: `main`）で Amplify パイプラインデプロイが完了していること。
- AWS にログイン済みで、対象の Amplify アプリにアクセスできること。

### 手順

**方法 A: 自動で本番用 outputs を生成してからシード（推奨）**

`amplify_outputs.production.json` が無い場合、環境変数でアプリ ID を渡すとスクリプトが自動で生成してからシードします。

```bash
AMPLIFY_APP_ID=<あなたのアプリID> npm run seed:production
```

本番ブランチが `main` でない場合は `AMPLIFY_BRANCH` も指定します。

```bash
AMPLIFY_APP_ID=<アプリID> AMPLIFY_BRANCH=main npm run seed:production
```

- アプリ ID は [Amplify コンソール](https://console.aws.amazon.com/amplify/) → 対象アプリ → 概要 で確認できる。
- 一度生成された `amplify_outputs.production.json` はローカルに保存され、次回からはファイルがあれば再生成されずにそのまま使われます。

**方法 B: 手動でファイルを作成してからシード**

1. 本番用の amplify_outputs を取得する。  
   `ampx generate outputs` は JSON を標準出力に出さず、カレントディレクトリに `amplify_outputs.json` を書き込むため、**リダイレクト `>` は使わず**、実行後にコピーする。

   ```bash
   npx ampx generate outputs --branch main --app-id <AMPLIFY_APP_ID>
   cp amplify_outputs.json amplify_outputs.production.json
   ```

2. 本番向けにシードを実行する。

   ```bash
   npm run seed:production
   ```

   または、任意のファイルパスを指定する場合:

   ```bash
   AMPLIFY_OUTPUTS_PATH=amplify_outputs.production.json npm run seed
   ```

- `amplify_outputs*` は `.gitignore` 対象のため、リポジトリにはコミットされない。

3. 成功すると `Seeded N MahjongHand records` と表示され、本番の DynamoDB に `mahjong_hands.json` の全件が投入される。

### 注意

- 既に同じ `id` の MahjongHand が本番にある場合、`create` は重複エラーになる可能性がある。その場合は既存データの削除や、シードデータの id 変更を検討する。
- 本番用の API キー（`amplify_outputs.production.json` 内）が有効である必要がある。
