# Workflow — Cancellation Regression Verification

## Trigger
A cancellation/lifecycle change is ready for acceptance.

## Goal
Prove the change works across normal and adversarial lifecycle paths without degrading successful runs.

## Inputs
Implementation, cancellation contract, baseline report, fixtures, platform matrix.

## Baseline
Use metrics recorded before the change. Preserve same workload and deadlines.

## Stages
1. Run normal completion fixtures and confirm no new cancellation side effects.
2. Cancel before dispatch; assert zero tool starts.
3. Cancel during tool I/O; assert handler observes cancel and settles.
4. Cancel during streaming; assert all consumer promises settle.
5. Cancel during resume/reconnect; assert replay does not continue writing state.
6. Cancel nested agent/tool execution; assert child receives termination.
7. Cancel subprocess tool with a descendant fixture; assert owned tree is quiescent or the platform limitation is explicit.
8. Analyze event logs with `scripts/cancellation_audit.py`.
9. Repeat failed fixture once to rule out instrumentation noise; do not mask deterministic failures.

## Responsible agent
`subagents/lifecycle-verifier.md`.

## Tools
Test runner, event logger, audit script, safe resource inspection.

## Outputs
Pass/fail matrix, timing distribution, late-event list, leak list, final verification status.

## Checkpoints
Every test carries a run ID and tool/resource IDs. Expected terminal state is defined before execution.

## Metrics
100% required path coverage; 0 unexplained late mutations; 0 owned-resource leaks after grace period; p95 quiescence within configured SLO.

## Retry policy
One retry only for flaky infrastructure. Product-code failures are not retried into success.

## Stop conditions
Any leaked owned resource, unresolved stream/promise, or late external write blocks completion.

## Failure path
Return `needs-fix` with the exact fixture, timestamps, and ownership evidence.

## Verification
A verifier separate from the implementation owner signs the report.

## Definition of Done
All lifecycle fixtures pass, normal behavior is unchanged, metrics meet SLO, and evidence is archived.
