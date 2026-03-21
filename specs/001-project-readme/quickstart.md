# Quickstart: 001-project-readme

**Feature**: プロジェクト README  
**Branch**: `001-project-readme`  
**Spec**: [/Users/honda/dev/docomachi/specs/001-project-readme/spec.md](./spec.md)

## 前提

- リポジトリ: `/Users/honda/dev/docomachi`
- ブランチ: `001-project-readme`（または本 plan に基づく作業ブランチ）
- スクリーンショット取得: `npm run dev` でローカル表示し、主要画面をキャプチャ

## 作業手順（実装者向け）

1. **画像ディレクトリ**（未作成なら）  
   `doc/readme/screenshots/` を作成する。

2. **スクリーンショット**  
   ユーザー向けの主要画面を 1 枚以上保存し、ファイル名を README から参照しやすいものにする（例: `quiz-screen.png`）。

3. **`README.md`**  
   ルートの `README.md` を、仕様の日本語要件に従い、次をすべて含める:
   - アプリの目的・価値（麻雀待ち牌クイズ等、憲法 Purpose と整合）
   - Speckit による仕様・開発の記載
   - AWS Amplify Gen 2 の利用
   - 主要フレームワーク・パッケージ（`package.json` を根拠に要約）
   - `doc/readme/screenshots/` 配下画像への相対パス参照（Markdown 画像記法）

4. **自己チェック（仕様 SC-002 相当）**  
   次がすべて満たされていること:
   - アプリ目的
   - Speckit の明示
   - Amplify Gen 2 の明示
   - フレームワーク／パッケージ列挙
   - UI スクリーンショット 1 点以上
   - 説明部が日本語のみ（FR-006）

5. **任意**  
   `npm run lint`（README 以外を触った場合）

## 検証コマンド（参考）

```bash
cd /Users/honda/dev/docomachi
git status
# README と doc/readme/screenshots/ が意図どおり差分に含まれることを確認
```

GitHub 上でブランチの `README.md` を開き、画像が壊れリンクになっていないことを確認する。
