# Fix and Verify Skill

## Purpose
Apply and prove the smallest safe deadlock fix after reproduction exists.

## Inputs
Validated evidence JSON with `reproduction_before=true`, repository revision, reproduction command, acceptance criteria.

## Preconditions
Root-cause cycle is evidenced and the intended change is within approved boundaries.

## Process
1. Re-run the pre-fix reproduction once to confirm the baseline is still valid.
2. Choose the smallest change that breaks the evidenced cycle without weakening consistency.
3. If the fix needs schema/index changes, production configuration, or changed transaction/isolation semantics, stop for explicit approval.
4. Implement only the selected hypothesis.
5. Run formatting/build/unit tests relevant to touched modules.
6. Run the deterministic concurrent reproduction at least three times after the fix.
7. Run adjacent concurrency/rollback tests and verify business invariants.
8. Inspect the diff for unrelated edits, broad retry additions, swallowed exceptions, or transaction expansion.
9. Update evidence with the fix and results; `verified` requires `reproduction_before=true` and `reproduction_after=false`.
10. Run `python scripts/validate-evidence.py <evidence.json>`.

## Verification
Independent verifier must confirm the baseline evidence, changed lock/order behavior, post-fix non-reproduction, tests, and diff scope.

## Failure handling
At most two fix attempts. Revert the failed hypothesis before the next attempt. After two failures, preserve both attempts and stop as `blocked`.

## Stop conditions
Stop if correctness depends only on retrying deadlock victims, if business invariants regress, or if verification cannot be independently reproduced.
