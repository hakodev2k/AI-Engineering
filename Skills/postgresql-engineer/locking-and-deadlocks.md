# Locking and Deadlock Diagnosis

## Purpose
Diagnose and prevent lock contention, blocking chains, and deadlocks in PostgreSQL production workloads.

## When to use
Use for blocked sessions, lock waits, deadlock errors, stalled migrations, or latency spikes under concurrency.

## Inputs
pg_stat_activity, pg_locks, logs, SQL, transaction traces, schema.

## Context to inspect
Transaction age, blockers/waiters, lock modes, statement order, indexes, DDL, and application retry behavior.

## Core knowledge
PostgreSQL uses table, row, predicate and advisory locking with compatibility rules. Deadlocks arise from cyclic waits; contention can exist without deadlock.

## Procedure
1. Capture waiters and blockers before terminating anything.
2. Map sessions to SQL and transaction age.
3. Identify requested and held lock modes.
4. Reconstruct acquisition order.
5. Separate chronic contention from exceptional DDL/maintenance.
6. Shorten transaction scope or standardize lock order.
7. Add supporting indexes when broad scans enlarge lock exposure.
8. Configure bounded lock/statement timeouts where appropriate.
9. Test concurrency.
10. Document safe operational remediation.

## Decision points
Terminate sessions only with operational authority and impact assessment. Use advisory locks only for application-level coordination with explicit ownership semantics.

## Common failure patterns
Killing blockers without root cause, idle-in-transaction sessions, inconsistent update order, unbounded retries, surprise ACCESS EXCLUSIVE locks.

## Verification
Confirm blocking chains disappear under representative concurrency and invariants remain intact.

## Expected output
Blocking graph, root cause, corrective change, operational runbook.

## Stop conditions
Escalate before terminating critical production transactions or changing high-impact DDL.