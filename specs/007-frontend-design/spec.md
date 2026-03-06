# Feature Specification: Screen Layout and Visual Polish

**Feature Branch**: `007-frontend-design`  
**Created**: 2025-03-07  
**Status**: Draft  
**Input**: User description: "画面表示を整える。トップバナー、ボタンローディング、緑系背景、中央よせ・待ち牌色別改行、スマホ横表示固定、ボタン整列グルーピング、あたり牌選択強調。"

## Clarifications

### Session 2025-03-07

- Q: ボタン操作が失敗・タイムアウトしたときの通知方法は？ → A: トースト／スナックバーで一過性のメッセージを表示する（Option B）
- Q: タブレット・デスクトップでの画面の向きの扱いは？ → A: 端末の向きに合わせて縦横どちらでも表示する（アダプティブ）（Option B）
- Q: 待ち牌・ボタンが多くて1行に収まらない場合の扱いは？ → A: 領域内でスクロールしてすべて表示する（Option A）
- Q: ボタン押下で処理に時間がかかる場合のローディング表示は？ → A: 画面全体またはオーバーレイでローディング表示する（Option C）
- Q: トップバナーに必要な表示内容は？ → A: 指定画像 top-banner.png を使用する

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Visual Identity (Priority: P1)

As a user, I see a cohesive screen that feels like a mahjong table (green mat style) with content centered, so that the app is recognizable and comfortable to use.

**Why this priority**: Establishes the core look and feel; other elements build on this.

**Independent Test**: Open the app and confirm a green-tone background and centered layout; no implementation required beyond visual check.

**Acceptance Scenarios**:

1. **Given** the user is on the top page, **When** the page loads, **Then** the background uses a green tone reminiscent of a mahjong mat.
2. **Given** any main screen, **When** content is displayed, **Then** the main content is centered horizontally.
3. **Given** the wait-tile selection area, **When** tiles are shown, **Then** tiles are grouped by color with line breaks between groups.

---

### User Story 2 - Top Banner and Button Layout (Priority: P2)

As a user, I see a top banner on the top page and buttons that are clearly grouped and aligned, so that navigation and actions are easy to find and use.

**Why this priority**: Improves wayfinding and reduces confusion before interaction details.

**Independent Test**: View the top page and verify the presence of a top banner and that buttons are aligned and grouped logically.

**Acceptance Scenarios**:

1. **Given** the user is on the top page, **When** the page loads, **Then** a top banner is visible at the top of the screen, displaying the designated top banner image (top-banner.png).
2. **Given** any screen with multiple buttons, **When** the user views the screen, **Then** buttons are aligned and grouped by function or intent.
3. **Given** the user taps a button that triggers a non-instant action, **When** the action starts, **Then** a full-screen or overlay loading state is shown until the action completes.

---

### User Story 3 - Atari Tile Selection Feedback (Priority: P3)

As a user selecting an atari (target) tile, I see my current selection clearly emphasized (e.g., border or highlight), so that I know which tile I have selected before confirming.

**Why this priority**: Reduces errors and improves confidence in selection; depends on existing selection UI.

**Independent Test**: Use the atari-tile selection flow and confirm that the selected tile is visually emphasized (e.g., border color change).

**Acceptance Scenarios**:

1. **Given** the user is on the atari-tile selection step, **When** the user selects a tile, **Then** the selected tile is visually emphasized (e.g., distinct border color or style).
2. **Given** a tile is selected, **When** the user selects a different tile, **Then** the previous tile is no longer emphasized and the new tile is emphasized.

---

### User Story 4 - Smartphone Landscape Orientation (Priority: P4)

As a user on a smartphone, I use the app in landscape orientation (fixed), so that the layout is optimized for the game or content regardless of how I hold the device.

**Why this priority**: Orientation lock is a constraint that affects layout; important for small screens but can follow core layout work.

**Independent Test**: Open the app on a smartphone (or narrow viewport); rotate to portrait and confirm the layout remains in landscape (or is locked to landscape).

**Acceptance Scenarios**:

1. **Given** the user opens the app on a smartphone, **When** the device is in portrait, **Then** the app is displayed in landscape orientation (or orientation is locked to landscape).
2. **Given** the app is in landscape, **When** the user rotates the device to portrait, **Then** the app continues to display in landscape (fixed orientation).

---

### Edge Cases

- On tablet or desktop viewports, the layout MUST adapt to device orientation (portrait or landscape); rotation is supported and the layout remains usable in both orientations.
- When a loading action fails or times out, the loading state MUST end and the user MUST be informed via a transient toast or snackbar message with the error or timeout information.
- When there are many wait tiles or many buttons, the content MUST remain grouped and readable; overflow MUST be handled by scrolling within the relevant area so that all items are accessible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The top page MUST display a top banner at the top of the viewport using the designated top banner image asset (top-banner.png).
- **FR-002**: When the user triggers an action via a button that takes non-instant time, the system MUST show a full-screen or overlay loading state until the action completes or fails. On failure or timeout, the system MUST dismiss the loading state and show a transient message (toast or snackbar) with the error or timeout information.
- **FR-003**: The overall screen background MUST use a green-tone theme evoking a mahjong mat.
- **FR-004**: Main content MUST be center-aligned horizontally on the screen.
- **FR-005**: In the wait-tile selection area, tiles MUST be grouped by color with line breaks between color groups.
- **FR-006**: On smartphone-sized viewports, the app MUST display in landscape orientation (or lock orientation to landscape) so that the primary layout is landscape.
- **FR-007**: Buttons MUST be laid out with clear alignment and grouping by function or intent.
- **FR-008**: When the user selects an atari tile, the selected tile MUST be visually emphasized (e.g., border color or style change); only one tile (the current selection) MUST be emphasized at a time.
- **FR-009**: On tablet and desktop viewports, the layout MUST adapt to device orientation (portrait or landscape) and remain usable when the user rotates the device.
- **FR-010**: When wait tiles or buttons exceed the visible area, the system MUST provide scrolling within that area so that all items remain accessible while preserving grouping and line breaks.

### Key Entities *(include if feature involves data)*

This feature is presentation-only; no new domain entities are introduced. Existing concepts (e.g., top page, wait tiles, atari tile, buttons) are referenced only for layout and feedback.

## Assumptions

- "Top page" refers to the main entry or home screen of the application. The top banner uses the image asset top-banner.png (location and format are implementation details).
- "Wait tiles" and "atari tile" are domain terms for the mahjong-style content; grouping and selection UI already exist; this feature only refines layout and selection feedback.
- Loading state applies to any button that triggers a non-instant operation (e.g., submit, next step, API call); exact list of such buttons is defined by the product.
- Landscape lock applies to smartphone-sized screens only; on tablet and desktop, the layout adapts to device orientation (portrait or landscape).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify the top banner and main actions on the top page within 3 seconds of load.
- **SC-002**: When a user taps a button that triggers a delayed action, a loading indication appears within 500 ms and remains until the action completes.
- **SC-003**: Users can distinguish the currently selected atari tile from other tiles without additional explanation.
- **SC-004**: On smartphone viewports, the app consistently displays in landscape layout (or with orientation locked to landscape) so that content is readable and usable without rotation confusion.
- **SC-005**: Buttons and wait-tile groups are visually ordered and grouped so that users report improved clarity of layout in feedback or observation.
