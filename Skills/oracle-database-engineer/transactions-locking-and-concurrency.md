# Transactions, Locking, and Concurrency

## Purpose
Design and troubleshoot Oracle transaction behavior, blocking, deadlocks, consistency, and high-concurrency workloads.

## When to use
Use for blocking sessions, deadlocks, serialization errors, hot rows, lost-work concerns, or transaction-boundary reviews.

## Inputs
Application transaction flow, session/ASH data, deadlock traces, SQL, isolation requirements, business invariants.

## Context to inspect
TX/TM locks, row-level contention, unindexed foreign keys, ITL behavior, sequence usage, transaction duration, commit frequency, and retry semantics.

## Core knowledge
Oracle multiversion read consistency reduces reader/writer blocking, but writers still contend. Correctness depends on application-level invariants and transaction boundaries, not lock avoidance alone.

## Procedure
1. Define the required consistency and atomicity guarantees.
2. Reconstruct blocking chains and transaction ownership.
3. Identify the exact rows/objects and SQL involved.
4. Inspect transaction duration and user/network waits inside transactions.
5. Check foreign-key indexing and hot-row patterns.
6. Review lock ordering for deadlocks.
7. Shorten transactions without splitting required atomicity.
8. Add safe retries only for explicitly retryable failures.
9. Consider optimistic designs, partitioned ownership, or queueing for hot resources.
10. Test under realistic concurrency.

## Decision points
Use serialization only when business semantics require it. Prefer consistent lock ordering and short transactions over broad application locks.

## Common failure patterns
Killing blockers without root cause, committing inside loops to hide contention, retry storms, and confusing long-running sessions with blocking transactions.

## Verification
Run concurrency tests, verify invariants, inspect blocking/deadlock metrics, and confirm retry idempotency.

## Expected output
A root-cause concurrency diagnosis and safe transaction design.

## Stop conditions
Stop when business consistency requirements are undefined or remediation would change atomicity semantics.