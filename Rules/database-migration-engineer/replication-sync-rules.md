# Replication and Synchronization

## Purpose
Keep source and target data synchronized during migration.

## Scope
Covers CDC, logical replication, physical replication, dual writes, queues, and custom sync pipelines.

## MUST
- Synchronization MUST define ordering, duplicate handling, delete semantics, schema evolution behavior, and failure recovery.
- Replication lag and error state MUST be monitored with thresholds tied to cutover readiness.
- Source-to-target mapping MUST preserve identifiers and business semantics or document transformations explicitly.

## MUST NOT
- MUST NOT infer consistency solely from a running replication process.
- MUST NOT enable naive dual writes without a defined partial-failure and reconciliation model.

## SHOULD
- Prefer durable change capture over application dual writes where it reduces consistency risk.
- Test restart and gap recovery from realistic failure points.

## Exceptions
Eventual consistency is acceptable only when bounded behavior satisfies business requirements.

## Verification
Inspect offsets, lag, dead letters, restart tests, delete propagation, schema-change tests, and reconciliation reports.