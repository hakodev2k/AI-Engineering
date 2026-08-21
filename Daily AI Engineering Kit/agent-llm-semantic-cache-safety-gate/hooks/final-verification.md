# Hook: Final Verification

## Trigger
After implementation and before declaring semantic-cache work complete.

## Preconditions
All intended edits and tests are present.

## Action
Run `python tests/run_tests.py`, then `python scripts/verify_package.py`, then the host repository's relevant build/test/static-analysis commands. Inspect the final diff for changes to tenant/auth partitioning, TTL, thresholds, sensitive-data bypasses and side-effect eligibility.

## Expected result
All commands pass and independent verifier status is `verified`.

## Failure behavior
One remediation cycle is allowed for deterministic test/validation failures. After remediation rerun the complete verification set. A second failure blocks completion. Transient environment/tool failures may be retried twice with evidence preserved.

## Blocking
Yes.
