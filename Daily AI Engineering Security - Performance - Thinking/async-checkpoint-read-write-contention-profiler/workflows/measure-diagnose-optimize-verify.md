# Workflow: Measure, Diagnose, Optimize, Verify

## Trigger
Checkpoint history iteration overlaps active writes, checkpoint writes stall, locking code changes, or checkpoint backend/version changes.

## Goal
Reduce causally attributed contention while preserving checkpoint history and durability semantics.

## Inputs
Workload definition, backend/version, baseline trace, correctness oracle, latency/throughput/error metrics.

## Baseline
Run the representative workload unchanged. Capture total write latency, throughput, database-lock errors, and profiler events. Record checkpoint history IDs/count/hash for later equivalence checking.

## Stages
1. **Observe** — identify read, write, serialization, and lock boundaries.
2. **Measure baseline** — profile the trace and preserve raw metrics.
3. **Diagnose** — classify wait as application lock, DB writer serialization, query/serialization, or external consumer pacing.
4. **Form hypothesis** — choose one bounded causal change.
5. **Implement** — commonly release the saver lock before consumer-controlled yields after safely materializing/snapshotting required results.
6. **Measure again** — replay exactly the same workload.
7. **Improved?** — require configured metric improvement/budget and unchanged correctness. If no, retry diagnosis once.
8. **Verify** — independent Performance Investigator reviews traces and tests.

## Responsible agent
Implementation: checkpoint/runtime engineer. Verification: Performance Investigator.

## Tools
`python scripts/async_lock_profiler.py`, workload benchmark, unit/integration tests, SQLite diagnostics.

## Outputs
Baseline and candidate traces, JSON profiler results, correctness comparison, decision record.

## Checkpoints
After baseline; after diagnosis; after candidate measurement; before merge/release.

## Metrics
p95/max writer wait, p95/max lock hold, yields under lock, throughput, database-lock errors, history equivalence.

## Retry policy
One re-diagnosis/reimplementation retry after the first candidate. Maximum two candidate implementations per run.

## Stop conditions
Stop if correctness regresses, trace integrity is invalid, the workload cannot be reproduced, or two candidates fail the performance gate.

## Failure path
Revert the candidate, retain baseline evidence, and escalate with causal uncertainty. Do not weaken durability or correctness requirements.

## Verification
All deterministic tests pass; profiler thresholds pass; correctness oracle matches; independent reviewer confirms attribution.

## Definition of Done
**Implemented:** candidate lock/iterator change is present. **Measured:** matched before/after data exists. **Verified:** configured performance gate and correctness checks pass independently with no blocking issue.
