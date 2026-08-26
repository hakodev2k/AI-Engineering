# Deadlock and Lock-Wait Diagnosis

## Purpose
Find and correct MySQL contention, deadlocks, and lock-wait failures without masking underlying design problems.

## When to use
Use for deadlock errors, lock wait timeouts, throughput collapse, or unexplained transaction stalls.

## Inputs
Deadlock reports, process/session data, SQL, DDL/indexes, transaction traces, application retry behavior.

## Context to inspect
Transaction duration, lock order, access paths, hot rows, isolation, batch size, metadata locks, recent schema changes.

## Core knowledge
Deadlocks are expected in concurrent systems and InnoDB chooses a victim. The goal is to reduce probability and make retry safe. Missing indexes can expand locks dramatically.

## Procedure
1. Capture exact deadlock/lock-wait evidence.
2. Map involved transactions and lock acquisition order.
3. Identify the contended records/ranges or metadata.
4. Check whether predicates use selective indexes.
5. Reduce transaction duration and batch size where appropriate.
6. Standardize lock order across code paths.
7. Remove unnecessary locked reads/writes.
8. Add bounded jittered retry only for retryable failures.
9. Stress-test competing transactions.
10. Monitor deadlock rate and tail latency after deployment.

## Decision points
Prefer structural fixes over retries when contention is systematic. Partition work or redesign hot counters when a single logical record is the bottleneck.

## Common failure patterns
Blind infinite retry, raising lock timeout, ignoring metadata locks, retrying side effects, and treating the deadlock victim as the root cause.

## Verification
Demonstrate reduced contention under concurrency and preserved invariants with retries enabled.

## Expected output
Contention graph, root cause, remediation, retry policy, and measured outcome.

## Stop conditions
Escalate if production evidence cannot be captured safely or remediation requires business-level serialization changes.