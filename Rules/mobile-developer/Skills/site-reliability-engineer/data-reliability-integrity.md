# Data Reliability and Integrity

## Purpose
Protect correctness, durability, and recoverability of production data when systems fail, retry, replicate, or recover.

## When to use
Use for stateful services, queue consumers, distributed writes, recovery design, data incidents, or systems where availability without correctness would be harmful.

## Inputs
Data model, write paths, transaction boundaries, replication model, consistency requirements, backups, recovery procedures, idempotency strategy, and incident history.

## Preconditions
The business definition of correct data and acceptable loss or staleness must be known.

## Context to inspect
Transactions, replication lag, write retries, deduplication, outbox/inbox patterns, queue delivery semantics, backup/restore, reconciliation jobs, schema migrations, and audit trails.

## Core knowledge
Reliable systems distinguish availability from correctness. At-least-once delivery creates duplicate risk; asynchronous replication creates staleness windows; retries can repeat side effects. Backups and replicas solve different problems.

## Procedure
1. Identify critical data invariants and ownership.
2. Map every write and replication path.
3. Define consistency and freshness expectations.
4. Review transaction boundaries and failure points.
5. Make retryable side effects idempotent or deduplicated.
6. Detect and monitor replication lag and stuck processing.
7. Design reconciliation for eventually consistent workflows.
8. Verify backups cover corruption and operator-error scenarios.
9. Test restore and data-validation procedures.
10. Add audit evidence for high-value mutations.
11. Review migrations for rollback and mixed-version safety.

## Decision points
Prefer strong consistency where incorrect concurrent decisions are unacceptable. Use eventual consistency when temporary divergence is tolerable and reconciliation exists. Choose replay only when event history is authoritative and duplicate effects are controlled.

## Common failure patterns
Assuming exactly-once delivery, retries without idempotency, replicas treated as backups, silent partial writes, missing reconciliation, and restoring data without integrity validation.

## Verification
Simulate retries, duplicate delivery, partial failure, replication delay, and restore. Confirm invariants hold or violations are detected and repaired.

## Expected output
Documented invariants, failure handling, reconciliation, backup/restore evidence, and data-integrity monitoring.

## Stop conditions
Escalate on suspected corruption, destructive repair, unclear source of truth, regulatory retention issues, or recovery actions that may overwrite valid data.