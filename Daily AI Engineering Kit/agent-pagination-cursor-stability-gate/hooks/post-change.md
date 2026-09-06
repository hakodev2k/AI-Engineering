# Hook: Post-change Cursor Verification

**Trigger:** after implementation and repository tests.

**Preconditions:** final trace captured using the same scenario and filters.

**Action:** run `python scripts/pagination_cursor_gate.py --trace <final-trace.json> --policy config/policy.json --out .cursor-gate/final.json`, then `python scripts/verify_package.py`.

**Expected result:** project trace exits 0 with `pass`; package self-check exits 0.

**Failure behavior:** preserve evidence; deterministic failures block completion and are not blind-retried.

**Blocks completion:** yes.
