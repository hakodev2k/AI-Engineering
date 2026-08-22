# Skill: Concurrency and Locking Diagnosis

## Purpose
Diagnose blocking, deadlocks, lost updates, write skew, contention, and transaction-path correctness.

## Trigger
Deadlock, lock timeout, queueing, duplicate/inconsistent state, concurrency regression, or hot-row contention.

## Inputs
Transaction code/path, isolation level, lock/deadlock evidence, wait graph, indexes, statement order, retry behavior, workload concurrency.

## Procedure
1. Build a timeline of concurrent actors and transaction boundaries.
2. Capture blockers/waiters/deadlock graph without changing the system first when possible.
3. Identify resource, lock mode, acquisition order, duration, and missing/inefficient access path.
4. Separate correctness anomaly from throughput contention.
5. Evaluate fixes: shorten transaction, consistent lock order, better index, optimistic version check, queue/serialize hotspot, isolation adjustment.
6. Model retry semantics; retry only known transient conflicts and ensure operation idempotency or deduplication.
7. Load-test the candidate under representative concurrency.
8. Verify both invariant correctness and latency/throughput.

## Constraints
Do not lower isolation merely to hide contention without proving invariants remain safe.

## Outputs
Concurrency model, root cause, fix options/trade-offs, chosen mitigation, verification evidence.

## Stop condition
The triggering anomaly is reproduced or evidenced, causal mechanism is explained, and the fix passes concurrent verification.