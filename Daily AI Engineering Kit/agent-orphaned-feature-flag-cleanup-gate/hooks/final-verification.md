# Hook: Final Flag Cleanup Verification

**Trigger:** after implementation and repository-native tests.

**Preconditions:** final registry and source state are present; target repository root (`ROOT`) and registry path (`REGISTRY`) are defined; `.flag-cleanup/scan.json` can be regenerated from the final tree.

**Action:** run `FLAG="$FLAG" ROOT="$ROOT" REGISTRY="$REGISTRY" bash scripts/run_checks.sh`, then inspect the final Git diff and repository-native test/build results.

**Expected result:** `.flag-cleanup/verification.json` has status `verified`, no non-allowlisted references remain, and required tests pass.

**Failure behavior:** deterministic failures block completion; preserve scan/verification/test evidence. Implementation/test-fix cycles are capped at three.

**Blocks completion:** yes.
