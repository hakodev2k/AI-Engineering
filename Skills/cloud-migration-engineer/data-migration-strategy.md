# Data Migration Strategy

## Purpose
Plan movement of persistent data with controlled integrity, downtime, security, and rollback risk.

## When to use
Use for relational databases, NoSQL stores, object/file data, analytics stores, and application state that must move or synchronize.

## Inputs
Data inventory, size/growth, schema, change rate, RTO/RPO, allowed downtime, consistency requirements, encryption requirements, network capacity, source/target engines, and validation criteria.

## Preconditions
Data ownership, classification, authoritative source, retention, and acceptable data-loss/downtime thresholds must be known.

## Context to inspect
Inspect schemas, constraints, large objects, extensions, encoding, time zones, CDC support, transaction rates, maintenance windows, backups, replication topology, and consumers.

## Core knowledge
Bulk copy, backup/restore, logical replication, CDC, dual writes, and application-level migration have different consistency and complexity profiles. Data transfer completion is not proof of semantic correctness.

## Procedure
1. Define source of truth and consistency guarantees.
2. Baseline size, growth, write rate, and transfer capacity.
3. Select migration mechanism and synchronization pattern.
4. Define schema conversion and compatibility work.
5. Protect data in transit and at rest.
6. Build repeatable initial-load procedures.
7. Establish incremental synchronization where downtime requires it.
8. Define reconciliation checks at row/object, aggregate, and business-rule levels.
9. Rehearse with production-like volume.
10. Measure initial load and catch-up duration.
11. Define write-freeze or cutover coordination if needed.
12. Execute cutover with checkpoints.
13. Validate data before switching authoritative ownership.
14. Preserve rollback data and retention evidence.
15. Decommission replication only after stabilization.

## Decision points
Use offline migration when downtime is acceptable and simplicity reduces risk. Use CDC/replication when downtime must be minimized. Avoid dual writes unless the consistency and failure-handling complexity is justified and explicitly designed.

## Common failure patterns
Testing with tiny datasets; ignoring write rate; schema drift during migration; silent truncation/encoding changes; no business reconciliation; replication lag hidden until cutover; deleting rollback copies too early.

## Verification
Compare counts, checksums where appropriate, aggregates, constraints, and domain-specific invariants. Validate application reads/writes against target. Record replication lag and final synchronization point.

## Expected output
A rehearsed data migration runbook with timings, validation queries/checks, rollback method, security controls, and acceptance evidence.

## Stop conditions
Stop when integrity checks fail, replication cannot meet the cutover window, encryption requirements are unmet, destructive conversion lacks approval, or rollback data is unavailable.