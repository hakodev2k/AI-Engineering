# Transactions and Concurrency Control

## Purpose
Design transaction and concurrency-control semantics that preserve application invariants across concurrent and distributed operations.

## When to use
Use when adding transactions, diagnosing anomalies, choosing isolation levels, or evaluating optimistic versus pessimistic concurrency.

## Inputs
Business invariants, operation patterns, contention profile, transaction size, latency requirements, failure model, and storage capabilities.

## Preconditions
Identify which invariants require atomicity or ordering and which operations can be safely retried or reconciled.

## Context to inspect
Locking, MVCC, timestamp allocation, validation, commit protocol, deadlock handling, retry logic, snapshots, indexes, and client transaction boundaries.

## Core knowledge
Isolation levels permit different anomalies. Serializability is stronger but can impose coordination or abort costs. MVCC improves read concurrency but creates version-retention and garbage-collection work. Distributed commit solves atomicity, not necessarily isolation or business idempotency.

## Procedure
1. Express critical business invariants explicitly.
2. Identify conflicting operation pairs.
3. Select the minimum isolation level that preserves those invariants.
4. Choose optimistic or pessimistic control based on contention and latency.
5. Define read/write version semantics.
6. Design conflict detection, lock ordering, or validation.
7. Define transaction timeout and cancellation behavior.
8. Define retryability and idempotency requirements.
9. For distributed transactions, define prepare/commit recovery semantics.
10. Analyze coordinator and participant failures.
11. Test concurrent histories and high-contention cases.
12. Measure abort, lock-wait, and tail-latency rates.

## Decision points
Prefer optimistic concurrency when conflicts are rare and retries are cheap. Prefer pessimistic controls for hot resources when wasted work or repeated conflicts are costly. Avoid distributed transactions when workflow-level compensation provides acceptable semantics with less coupling.

## Common failure patterns
Assuming snapshot isolation is serializable, retrying non-idempotent work, long-running transactions blocking cleanup, distributed lock leaks, missing fencing, and transaction boundaries that include unreliable external calls.

## Verification
Run anomaly-focused concurrency tests, validate rollback and retry paths, inspect deadlock/abort behavior, and prove critical invariants under concurrent execution.

## Expected output
A documented transaction model, isolation choice, conflict strategy, retry behavior, failure handling, and verification evidence.

## Stop conditions
Stop when required invariants cannot be expressed or preserved by available transaction primitives without architectural changes.