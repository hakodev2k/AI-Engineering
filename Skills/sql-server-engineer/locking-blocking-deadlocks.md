# Locking, Blocking, and Deadlocks

## Purpose
Diagnose SQL Server concurrency failures and reduce contention without sacrificing correctness.

## When to use
Use for blocked sessions, lock timeouts, deadlocks, throughput collapse, or long transaction chains.

## Inputs
Deadlock XML, blocked-process evidence, waits, active requests, transaction code, isolation levels, plans, indexes.

## Context to inspect
Inspect lock modes/order, transaction duration, access order, indexes, isolation, application retry behavior, and implicit transactions.

## Core knowledge
Blocking is often a symptom of long or inefficient transactions; deadlocks require a cycle of incompatible resource ownership. Isolation changes alter correctness guarantees.

## Procedure
1. Capture the blocking/deadlock graph.
2. Identify head blockers and transaction boundaries.
3. Map locks to statements, objects, and access paths.
4. Determine why locks are held so long or acquired in conflicting order.
5. Reduce transaction scope and query work.
6. Improve indexes where scans enlarge lock footprints.
7. Standardize resource access order.
8. Evaluate row-versioning isolation when semantics permit.
9. Add bounded retries for deadlock victims at the application boundary.
10. Re-test under concurrency.

## Decision points
Prefer reducing work and transaction duration before changing isolation. Use snapshot-based isolation only after assessing tempdb/version-store capacity and semantic expectations.

## Common failure patterns
Using NOLOCK as a correctness-blind fix, killing blockers without root cause, unbounded retries, and ignoring application transaction scope.

## Verification
Run representative concurrent workloads and confirm lower blocking/deadlock rates while validating transactional correctness.

## Expected output
A causal concurrency graph, remediation, correctness analysis, and measured contention reduction.

## Stop conditions
Stop when changing isolation or transaction semantics requires application-owner approval.