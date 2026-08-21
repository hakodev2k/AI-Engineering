# Query Regression Remediation Skill

## Purpose
Apply the smallest behavior-preserving EF Core change that removes a confirmed query-shape regression and prove the improvement.

## Inputs
Confirmed finding, affected query, generated SQL/runtime evidence, tests, and acceptance criteria.

## Process
1. Reproduce the existing behavior and capture a baseline: SQL/round trips, result count, latency or allocation metric when practical.
2. Select the smallest relevant remediation: move filters before materialization, project only needed columns, replace broad Include graphs with projection/split query when appropriate, batch persistence outside loops, or use async query terminals in async paths.
3. Preserve tenant filters, authorization, ordering, pagination, null semantics, and public contracts.
4. Implement one change at a time.
5. Build and run targeted tests.
6. Re-run the static scan.
7. Capture post-change generated SQL/runtime evidence.
8. Compare baseline and post-change behavior for semantic equivalence and performance shape.
9. Inspect the diff for unrelated edits.
10. Hand off to Query Verifier.

## Approval boundaries
Stop for database schema/index changes, global query-filter removal, production configuration changes, breaking API behavior, or changing tracking semantics on a write path whose correctness is not proven.

## Verification
A remediation is successful only if targeted tests pass, the relevant finding is resolved or explicitly justified, query behavior remains correct, and the independent verifier accepts the evidence.

## Retry policy
At most two remediation attempts for the same finding. Preserve each failed attempt's build/test/SQL evidence. After two unsuccessful attempts, restore the last known safe state or stop and escalate.
