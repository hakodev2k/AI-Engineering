# Workflow: Regression Verification

## Trigger
Any change to token accounting, compaction thresholds, model capacity metadata, or reserve logic.

## Goal
Prove compaction uses a valid live snapshot and does not regress task quality.

## Inputs
Policy, guard, unit tests, known-small/near-threshold/invalid fixtures, before measurements.

## Baseline
The previously accepted fixture results and production-like token/latency metrics.

## Stages
1. Run `python -m unittest tests/test_compaction_snapshot_guard.py`.
2. Replay a below-threshold live prompt; expect `defer`.
3. Replay a near-threshold live prompt; expect `allow_compaction`.
4. Replay cumulative-source, stale-snapshot, and capacity-mismatch fixtures; expect `block_accounting_error`.
5. Compare tokens/task and latency/task against baseline.
6. Run task-quality verification using the same acceptance tests used before the change.
7. Independent verifier reviews the evidence.

## Checkpoints
All deterministic tests must pass before quality/performance comparison.

## Metrics
Test pass rate, false-compaction fixtures, tokens/task, latency/task, quality-regression rate.

## Retry policy
One corrective patch and one full rerun.

## Stop conditions
Any unexplained accounting pass, required-context loss, or quality regression blocks completion.

## Failure path
Revert/disable the accounting change and preserve evidence for diagnosis.

## Verification
Accounting Verifier must be different from the implementation owner.

## Definition of Done
Implemented, measured, and independently verified results are all recorded; no blocking regression remains.
