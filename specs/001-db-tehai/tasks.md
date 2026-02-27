# Tasks: 麻雀配牌データ取得と初期登録

## Phase 1: Setup

- [X] T001 Create seed data JSON skeleton at doc/seed/mahjong_hands.json
- [X] T002 Ensure MahjongHand model is defined in Amplify Data schema in amplify/data/resource.ts

## Phase 2: Foundational (Shared Backend Setup)

- [X] T003 Implement MahjongHand TypeScript model / types in src/lib/mahjong/mahjongHand.ts
- [X] T004 [P] Add basic Jest test setup for backend/data utilities (e.g. amplify/backend/function/jest.config.cjs or root jest.config)

## Phase 3: User Story 1 - ランダム配牌を取得したい (P1)

### Goal

Amplify Data の自動生成 GraphQL API を用いて、ランダムな配牌データと当たり牌を1件取得できる内部向け機能を提供する。

### Independent Test Criteria

- 複数件の有効な `MahjongHand` データが登録された状態で、ランダム取得処理を複数回実行すると、常に13枚＋当たり牌を含む1件のデータが返り、複数の異なるIDが取得できる。

### Tasks

- [X] T005 [US1] Implement Amplify Data client helper for MahjongHand in src/lib/mahjong/client.ts using Schema from amplify/data/resource.ts
- [X] T006 [US1] Implement getRandomMahjongHand utility that calls the generated list API and returns one random item in src/lib/mahjong/randomHand.ts
- [X] T007 [P] [US1] Add Jest tests for getRandomMahjongHand (including random selection behavior and response shape) in src/lib/mahjong/__tests__/randomHand.test.ts

## Phase 4: User Story 2 - 役満の例題データを初期投入したい (P1)

### Goal

国士無双13面待ちと純正九蓮宝燈の2件の役満配牌データを、手順どおりに初期投入できるようにする。

### Independent Test Criteria

- 手順書に従ってシードスクリプトを実行すると、DynamoDB に2件の役満データが登録され、US1 のランダム取得機能からも取得できる。

### Tasks

- [X] T008 [US2] Fill mahjong_hands.json with concrete Kokushi and Junsei Churen tiles and winningTiles as per specs/001-db-tehai/data-model.md
- [X] T009 [US2] Implement seedMahjongHands script that reads doc/seed/mahjong_hands.json and creates MahjongHand items via Amplify Data client in scripts/seedMahjongHands.ts
- [X] T010 [P] [US2] Add basic validation in seedMahjongHands script for tiles length 13 and allowed tile codes in scripts/seedMahjongHands.ts
- [X] T011 [P] [US2] Add Jest tests for seedMahjongHands happy path and simple validation failures in scripts/__tests__/seedMahjongHands.test.ts

## Phase 5: User Story 3 - 配牌データの品質を確認したい (P3)

### Goal

登録済み配牌データが牌表現ルールと枚数ルールに従っているかを検証し、問題があれば検出できるようにする。

### Independent Test Criteria

- 検証処理を実行したとき、全レコードが有効なら「問題なし」、不正データがある場合は原因付きで特定できる。

### Tasks

- [X] T012 [US3] Implement MahjongHand validation utility for tiles and winningTiles in src/lib/mahjong/validation.ts
- [X] T013 [P] [US3] Add Jest tests for MahjongHand validation utility in src/lib/mahjong/__tests__/validation.test.ts
- [X] T014 [US3] Implement verifyMahjongHands script to scan all MahjongHand items and report invalid records in scripts/verifyMahjongHands.ts
- [X] T015 [P] [US3] Implement summary report format for invalid records (reason and ID) in scripts/verifyMahjongHands.ts

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T016 Add error handling and clear internal error messages around Amplify Data calls (client helper and scripts)
- [X] T017 Add basic logging/metrics for random selection and seeding counts where appropriate
- [X] T018 Update specs/001-db-tehai/quickstart.md with any implementation-specific details discovered during development
- [X] T019 Run full Jest test suite and fix any failing tests
- [ ] T020 Prepare pull request description summarizing changes and how to test them

## Dependencies and Story Order

- User Story order: US1（ランダム取得） → US2（役満初期投入） → US3（品質確認）
- Phase dependencies:
  - Phase 1 → Phase 2 → Phase 3〜5（US1〜US3は Phase 2 完了後であれば基本的に並行可能）
  - Phase 6 は全ユーザーストーリーの主要実装完了後に実施

## Parallel Execution Examples

- 開発者A:
  - T005, T006, T007（US1 ランダム取得ユーティリティとテスト）
- 開発者B:
  - T008, T009, T010, T011（US2 シードスクリプトとバリデーション）
- 開発者C:
  - T012, T013, T014, T015（US3 検証ユーティリティとレポート）

## Implementation Strategy (MVP First)

- **MVP Scope**: User Story 1（Phase 3: T005〜T007）を完了させ、Amplify Data の自動生成 GraphQL を用いたランダム配牌取得機能が内部から利用できる状態を最初のマイルストーンとする。  
- その後、User Story 2 の初期役満データ投入（Phase 4）を実装し、コンテンツ面の充実を図る。  
- 最後に User Story 3 と Phase 6 のポリッシュで品質確認機能と横断的な改善を追加する。  
