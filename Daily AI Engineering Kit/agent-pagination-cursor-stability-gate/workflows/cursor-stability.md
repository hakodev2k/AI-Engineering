# Workflow: Cursor Pagination Stability

## Trigger
Duplicate/missing records, infinite next-page loop, inconsistent ordering, pagination code change, or cursor migration.

## Entry conditions
Repository access and a reproducible endpoint or captured trace.

## Inputs
Endpoint/query path, policy, trace, tests, optional expected IDs.

## Stages
1. Discover the endpoint → query → cursor codec → ordering → tests path.
2. Capture sequential pages through terminal cursor.
3. Run the deterministic gate.
4. Plan one evidence-backed invariant repair.
5. Implement the smallest change.
6. Run targeted and repository-required tests.
7. Re-capture the same scenario.
8. Independently verify the final trace and diff.

## Produced artifacts
Trace JSON, gate report, test output, diff, final verification status.

## Checkpoints
- Ordering tuple and cursor payload are identified.
- Defect has a regression test.
- Security/tenant filters are unchanged.
- Final trace reaches a null cursor.
- Final gate report is `pass`.

## Retry rules
- Transient API/tool failures: maximum 2 retries with evidence preserved.
- Implementation test-fix cycles: maximum 3.
- Deterministic gate failures are not retried without a changed hypothesis.
- Retry exhaustion ends as `blocked` or `failed`.

## Approval points
Human approval is required before breaking cursor/API contracts, schema changes, destructive SQL/data deletion, production config/deploy, infrastructure/secret changes, security weakening, Git history rewriting, or large dependency upgrades.

## Failure paths
Validation failure → repair malformed trace/config only.
Regression failure → one bounded implementation hypothesis.
Permission/environment failure → stop without privilege escalation.
Compatibility conflict → stop for approval.

## Definition of Done
Pagination path understood; defect reproduced; smallest fix implemented; tests pass; final trace has no duplicates/cycles/discontinuities/non-monotonic order or missing expected IDs; required approvals exist; independent verifier returns `verified`.
