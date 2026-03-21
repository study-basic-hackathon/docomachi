# Data Model: UI Visibility Update

本機能は永続化データを追加しない。ここでは、受け入れ検証のために扱うUI表示ルールを論理エンティティとして定義する。

## Entity: TextVisibilityRule

- **Purpose**: 必須テキストの可読性基準を定義する。
- **Fields**:
  - `targetTextType` (enum): `essential-normal` / `essential-large`
  - `minContrastRatio` (number): `4.5` または `3.0`
  - `disallowedColorHints` (string[]): 低視認色の禁止ヒント（例: yellow-green）
  - `appliesTo` (string[]): question, option, status label など対象領域
- **Validation Rules**:
  - `essential-normal` の場合 `minContrastRatio >= 4.5`
  - `essential-large` の場合 `minContrastRatio >= 3.0`
  - `appliesTo` は空であってはならない

## Entity: TimerDisplayRule

- **Purpose**: タイマーの配置・視認性要件を定義する。
- **Fields**:
  - `anchorPosition` (enum): `above-answer-button`
  - `minReadableSize` (number): `24`
  - `visibilityStates` (string[]): question-active, countdown-running
  - `responsiveBehavior` (string): 小画面での再配置方針（非表示禁止）
- **Validation Rules**:
  - `anchorPosition` は常に `above-answer-button`
  - `minReadableSize >= 24`
  - `visibilityStates` に `question-active` を必ず含む

## Entity: UIVerificationResult

- **Purpose**: 仕様適合チェック結果を記録する。
- **Fields**:
  - `screenId` (string): 検証対象画面識別子
  - `contrastPass` (boolean): コントラスト基準を満たしたか
  - `timerPlacementPass` (boolean): タイマー配置基準を満たしたか
  - `timerSizePass` (boolean): タイマー最小サイズ基準を満たしたか
  - `notes` (string): 補足メモ
- **Validation Rules**:
  - 受け入れ完了条件は `contrastPass && timerPlacementPass && timerSizePass`
