# Workflow: Implement, Verify, Close

## Trigger
Task requires autonomous implementation with an observable done-condition.

## Goal
Reach requested readiness with target evidence, not activity-based inference.

## Inputs
Acceptance contract, baseline evidence, risk approvals.

## Baseline
Record initial criterion outcomes, readiness, tool/model-call counters, elapsed time.

## Stages
1. Observe target and capture baseline.
2. Diagnose gap and form a falsifiable implementation hypothesis.
3. Implement smallest change addressing gap.
4. Run local/component checks.
5. Refresh target-specific evidence.
6. Run `readiness_guard.py`.
7. If blocked and budget remains, re-evaluate once.
8. Independent Verification Reviewer reproduces decision.
9. Close only at permitted readiness.

## Responsible agent
Implementer stages 1-7; independent reviewer stage 8.

## Outputs
Change, evidence ledger, counters, readiness, reviewer decision.

## Checkpoints
After each material change; before compaction/handoff; before final status.

## Metrics
Evidence coverage/freshness, calls/time to acceptance, retries, rework.

## Retry policy
Maximum 2 improvement cycles.

## Stop conditions
PASS at requested readiness; circuit breaker trips; unsafe verification requires ungranted approval.

## Failure path
Invoke `failure-recovery.md`.

## Verification
Guard plus independent evidence reproduction.

## Definition of Done
Requested readiness is permitted, evidence is fresh/target-specific, reviewer passes, no blocker remains.