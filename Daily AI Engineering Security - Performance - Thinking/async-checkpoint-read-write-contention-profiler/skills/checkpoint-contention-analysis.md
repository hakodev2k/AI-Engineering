# Skill: Checkpoint Contention Analysis

## Purpose
Determine whether checkpoint latency comes from framework lock scope, database writer serialization, query/serialization work, or consumer pacing.

## Trigger
Use when async checkpoint writes stall, history reads overlap writes, `database is locked` appears, or saver locking/iterator code changes.

## Inputs
- Representative workload and checkpoint backend/version.
- JSONL trace emitted around saver lock acquisition/release, reader yields, and writer waits.
- Baseline operation latency/throughput and error counts.
- History correctness oracle: IDs/count/hash or equivalent result comparison.

## Preconditions
Use the same workload shape for baseline and candidate measurements. Synchronize timestamps to one monotonic clock per process. Do not optimize before capturing a baseline.

## Allowed tools
Read-only source inspection, tracing, `scripts/async_lock_profiler.py`, unit/integration tests, SQLite diagnostics, benchmark harnesses.

## Constraints
- MUST preserve checkpoint correctness and durability requirements.
- MUST NOT hide contention by increasing timeouts alone.
- MUST distinguish framework-lock wait from SQLite/database errors.
- SHOULD use WAL/busy-timeout tuning only when evidence points to database-layer contention.

## Procedure
1. Capture baseline writer latency, throughput, database-lock errors, and history result identity.
2. Add events immediately before/after saver lock acquisition and release; mark each async history `yield`; mark writer wait start/end.
3. Run `python scripts/async_lock_profiler.py --input baseline.jsonl`.
4. If `locks_with_yield > 0`, inspect whether consumer-controlled suspension is inside the critical section.
5. If writer waits are high but no read yields are under the lock, inspect write transaction duration and SQLite locking separately.
6. Form one hypothesis only: e.g. materialize results under lock and yield after release, reduce critical section, paginate snapshots, or fix write transaction acquisition.
7. Implement the smallest change preserving result consistency.
8. Replay the same workload and profile `candidate.jsonl`.
9. Compare p95/max writer wait, p95/max lock hold, throughput, errors, and history equivalence.
10. Send results to the independent Performance Investigator.

## Decision points
- `locks_with_yield > 0`: critical-section lifetime is consumer-coupled; fix this before database tuning.
- High writer wait with zero yield-under-lock: inspect query/serialization/transaction duration.
- SQLite lock errors with short framework lock holds: investigate database-level writer contention/WAL/transaction design.
- Worse correctness or missing history: reject the optimization regardless of latency.

## Expected output
Facts, measured baseline, hypothesis, change, before/after metrics, correctness evidence, residual risks, verification status.

## Metrics
Writer wait, lock hold, yields under lock, throughput, error rate, history equality.

## Verification
Independent replay with the same workload and explicit thresholds.

## Failure handling
Maximum two optimization attempts per investigation. Revert candidate changes that regress correctness or increase p95 writer wait beyond the agreed budget.

## Stop conditions
Stop and escalate if instrumentation cannot distinguish lock wait from DB execution, or if two bounded attempts fail to improve the diagnosed bottleneck.
