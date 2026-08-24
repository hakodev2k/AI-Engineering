# Workflow: Resume and Reconcile

## Trigger
A session is resumed from a different client, device, process, or remote-control surface.

## Goal
Establish convergence before model/tool continuation.

## Inputs
Canonical and surface snapshots.

## Baseline
Record version, durable turn, selected child, writer identity, registration epoch.

## Stages
1. Observe snapshots.
2. Measure with `scripts/convergence_check.py`.
3. Diagnose with `skills/session-convergence-analysis.md`.
4. Form one recovery hypothesis.
5. Refresh/re-register/reselect only through supported non-destructive mechanisms.
6. Re-capture and measure again.
7. Hand to `subagents/session-state-verifier.md`.

## Responsible agent
Coordinator recovers; verifier is independent.

## Tools
Read-only inspection, supported reconnect/reload/re-register actions, comparator.

## Outputs
Before/after snapshots and final evidence.

## Checkpoints
After baseline, first recovery, second recovery.

## Metrics
Mismatch count and durable-turn lag before/after.

## Retry policy
Maximum 2 reconciliation attempts.

## Stop conditions
Verified PASS, unsafe recovery requirement, or two failures.

## Failure path
Preserve evidence, block writes from the stale surface, escalate.

## Verification
Independent verifier runs the final comparison.

## Definition of Done
All critical fields converge and verification passes.