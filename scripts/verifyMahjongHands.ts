import { mahjongClient } from "../src/lib/mahjong/client";
import type { MahjongHand } from "../src/lib/mahjong/mahjongHand";
import { validateMahjongHand } from "../src/lib/mahjong/validation";

export type VerificationResult = {
  total: number;
  valid: number;
  invalid: number;
  issues: { id: string; issues: ReturnType<typeof validateMahjongHand> }[];
};

export async function verifyMahjongHands(): Promise<VerificationResult> {
  const result = await mahjongClient.models.MahjongHand.list();
  const items = (result.data ?? []) as MahjongHand[];

  let valid = 0;
  let invalid = 0;
  const issues: { id: string; issues: ReturnType<typeof validateMahjongHand> }[] = [];

  for (const item of items) {
    const itemIssues = validateMahjongHand(item);
    if (itemIssues.length === 0) {
      valid += 1;
    } else {
      invalid += 1;
      issues.push({ id: item.id, issues: itemIssues });
    }
  }

  return {
    total: items.length,
    valid,
    invalid,
    issues,
  };
}

if (require.main === module) {
  verifyMahjongHands()
    .then((summary) => {
      // eslint-disable-next-line no-console
      console.log(
        `MahjongHand verification: total=${summary.total}, valid=${summary.valid}, invalid=${summary.invalid}`,
      );
      for (const entry of summary.issues) {
        // eslint-disable-next-line no-console
        console.log(`- ID=${entry.id}`);
        for (const issue of entry.issues) {
          // eslint-disable-next-line no-console
          console.log(`  - [${issue.kind}] ${issue.message}`);
        }
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Failed to verify MahjongHand records", err);
      process.exitCode = 1;
    });
}

