# Data Model: フロントエンド トップページ

**Created**: 2026-02-17  
**Feature**: [spec.md](./spec.md)

## Overview

本機能は静的表示のみで、永続データやデータモデルは不要です。トップページは以下の表示要素で構成されます。

## Display Components

### トップページ表示要素

**Type**: UI Component (no persistent data)

**Elements**:
- **背景色**: 緑色（麻雀をイメージさせるトーン）
- **バナー画像**: `top-banner.png`（静的アセット）
- **スタートボタン**: インタラクティブなUI要素

**State**:
- ページ読み込み状態: `loading` | `loaded` | `error`
- 画像読み込み状態: `loading` | `loaded` | `error`（フォールバック用）

**Validation Rules**:
- バナー画像が読み込めない場合でも、ページは表示可能（画像のみ非表示または代替表示）
- スタートボタンは常に操作可能

## Notes

- データベーススキーマは不要（静的ページ）
- APIエンドポイントは不要（フロントエンドのみ）
- 状態管理はReactのローカル状態で十分（useState）
