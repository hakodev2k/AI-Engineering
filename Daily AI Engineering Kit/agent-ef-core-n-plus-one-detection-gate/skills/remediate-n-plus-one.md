# Skill: Remediate EF Core N+1

## Purpose
Replace confirmed per-item database access with the smallest behavior-preserving query strategy.

## Inputs
Confirmed investigation evidence, affected code, tests, query result artifact.

## Procedure
1. Preserve a failing or measurable reproduction.
2. Choose the smallest fix: projection, targeted `Include`, explicit batch query, dictionary lookup, or moving materialization outside a loop.
3. Avoid loading unused columns or unbounded collections.
4. Keep filtering, authorization, ordering, paging, tracking behavior, null semantics, and public contracts unchanged unless explicitly required.
5. Add or update tests for result equivalence and query-count behavior where practical.
6. Rebuild and run relevant tests.
7. Capture new EF command logs using the same scenario.
8. Re-run `scripts/detect_n_plus_one.py` and compare total commands plus suspect groups.
9. Inspect the diff for unrelated edits.

## Verification
Success requires unchanged functional results and elimination of the confirmed repeated-query group. A lower query count alone is insufficient if semantics changed.

## Failure handling
At most two implementation retries. Preserve each test/log result. If the second fix fails, revert the experimental change or stop with evidence and escalation notes.

## Approval boundaries
Stop for schema/index changes, production query/config changes, breaking contracts, or globally disabling lazy loading.
