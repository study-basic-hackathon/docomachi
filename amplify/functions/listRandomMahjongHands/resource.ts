import { defineFunction } from "@aws-amplify/backend";

export const listRandomMahjongHands = defineFunction({
  name: "listRandomMahjongHands",
  entry: "./handler.ts",
});
