# Revalidate Assumptions

## Purpose
Refresh assumptions when their supporting context may have changed so stale evidence cannot silently survive a long-running agent task.

## Trigger
Run after base revision changes, dependency/version changes, schema/config/environment changes, new contradictory evidence, long pauses, handoffs, or before a dangerous/final action.

## Inputs
- Current assumption register
- Current policy
- Triggering change/evidence
- Latest repository/runtime context

## Process
1. Identify records whose `revalidate_on` matches the trigger or whose `expires_at` has passed.
2. Preserve the previous evidence; never overwrite historical evidence silently.
3. Re-run only the minimum evidence target needed to confirm or refute each affected statement.
4. Append new evidence with observation time and digest where available.
5. Change status to `supported`, `contradicted`, or `expired` based on evidence.
6. If evidence cannot be obtained, leave the assumption unresolved and record the failure externally; do not extend TTL automatically.
7. Recompute assumption/policy fingerprints.
8. Re-run the deterministic gate.
9. If high-risk consumed assumptions remain, hand off to Assumption Verifier for independent review.

## Retry policy
At most one retry for transient transport/tool-read failures. Validation, permission, business-rule, or contradictory-evidence failures are not retryable without changed input.

## Verification
The new gate report fingerprints the current register and policy, all affected records contain fresh evidence or an explicit unresolved state, and no stale review is reused.

## Stop conditions
Stop on repeated tool failure, missing permission, critical contradiction, or inability to safely validate evidence before an approval-required action.