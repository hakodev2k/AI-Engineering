# Locking and Contention

## Purpose
Diagnose and reduce database blocking, deadlocks, latch contention, and concurrency collapse without compromising correctness.

## When to use
Use for lock waits, deadlocks, transaction timeouts, throughput collapse, or hot-resource contention.

## Inputs
Wait graphs, deadlock reports, transaction traces, queries, isolation levels, schema, and workload concurrency.

## Context to inspect
Transaction boundaries, lock order, indexes, hot rows, long-running sessions, connection behavior, and retry logic.

## Core knowledge
Contention is often an application transaction-design problem. Shorter transactions, stable lock ordering, selective access paths, and correct isolation usually matter more than disabling safety.

## Procedure
1. Identify blockers and victims.
2. Capture wait/deadlock graphs.
3. Map statements to transaction boundaries.
4. Determine whether scans or hot keys amplify locks.
5. Check isolation and lock ordering.
6. Reduce transaction duration and touched rows.
7. Add or adjust indexes when justified.
8. Introduce bounded retries only for transient victims.
9. Load-test concurrent behavior.

## Decision points
Use optimistic concurrency when conflicts are rare and retryable; use stronger coordination when conflicting writes must serialize.

## Common failure patterns
Using NOLOCK-like workarounds blindly, unbounded retries, huge transactions, inconsistent lock order, and treating deadlocks as random noise.

## Verification
Confirm reduced wait time/deadlocks under representative concurrency and validate transaction correctness.

## Expected output
A contention root cause, safe remediation, concurrency test evidence, and monitoring thresholds.

## Stop conditions
Escalate if changing isolation could alter correctness, blockers are unknown privileged workloads, or remediation requires disruptive schema changes.