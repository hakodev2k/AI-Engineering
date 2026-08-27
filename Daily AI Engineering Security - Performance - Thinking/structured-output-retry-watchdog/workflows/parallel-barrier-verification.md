# Workflow: Parallel Barrier Verification

## Trigger
A parallel worker returns `fail-partial`, times out, or reaches a retry stop condition.

## Goal
Prevent one wedged worker from indefinitely blocking the workflow while preserving correctness requirements.

## Inputs
Worker states, verified artifacts, required coverage fraction, task criticality, retry/watchdog records.

## Baseline
Count expected workers, completed workers, verified outputs, and blocked dependencies.

## Stages
1. Freeze the failed worker; do not retry automatically.
2. Classify its missing contribution as optional, redundant, or critical.
3. Compute verified completion fraction from independent worker outputs.
4. Continue only if policy permits partial completion and no critical requirement depends solely on the failed worker.
5. Run independent verification on surviving outputs.
6. Mark final status as complete, complete-with-partial-failure, or blocked.

## Checkpoints
After worker stop; before barrier release; after independent verification.

## Metrics
Barrier wait time, failed-worker count, verified coverage fraction, avoided retry calls, rework rate.

## Retry policy
No automatic retry after watchdog stop. One manually justified replacement worker may be launched only if the missing contribution is critical and a changed hypothesis/input exists.

## Stop conditions
Verified coverage below policy threshold, critical evidence missing, or replacement worker repeats the same failure signature.

## Failure path
Return blocked with explicit missing requirement and preserved evidence.

## Verification
Convergence Verifier confirms the released barrier did not omit a critical requirement.

## Definition of Done
No unbounded worker remains; barrier decision is evidence-backed; downstream conclusions reflect partial status when applicable.
