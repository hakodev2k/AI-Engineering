# Remediate Atomicity Gaps

## Purpose
Implement the smallest safe correction for a confirmed database/external-side-effect consistency gap.

## Inputs
Confirmed finding, transaction boundary, effect contract, retry semantics, tests, approval state.

## Preconditions
Failure window is proven. Desired consistency semantics are explicit.

## Procedure
1. Choose a remediation whose guarantee matches the requirement.
2. Prefer post-commit dispatch only when losing the effect after commit is acceptable or recoverable.
3. Prefer a transactional outbox when database state and eventual delivery must not diverge.
4. Add stable idempotency/deduplication when retries can repeat an effect.
5. Keep transaction duration short; never perform network waits while holding database locks unless explicitly justified.
6. Add tests for success and both asymmetric failures.
7. Run focused tests, then broader affected tests.
8. Inspect the diff for unrelated changes and contract drift.
9. Hand the change to an independent verifier.

## Approval
Stop before schema changes, production writes, destructive operations, breaking contracts, infrastructure changes, or weakened controls.

## Verification
Demonstrate that each previously identified failure window is prevented, recoverable, or explicitly accepted. A passing happy-path test is insufficient.

## Recovery
At most two implementation/test retries. Preserve failing command, output, diff, and hypothesis each time. After the second failure, stop and escalate.
