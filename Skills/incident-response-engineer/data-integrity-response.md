# Data Integrity Incident Response

## Purpose
Detect, contain, assess, and recover from incidents that may corrupt, duplicate, omit, reorder, or incorrectly mutate business data.

## When to use
Use for suspected bad writes, migration defects, replication errors, duplicate processing, lost events, inconsistent aggregates, or unauthorized data changes.

## Inputs
Schemas, transaction logs, audit trails, event streams, backups, reconciliation rules, application logs, and affected time ranges.

## Context to inspect
Inspect transaction boundaries, idempotency, replication, eventual consistency, migrations, batch jobs, retries, clocks, and authoritative sources.

## Core knowledge
Availability recovery does not imply data correctness. Data repair must distinguish source-of-truth records from derived state and be repeatable, auditable, and reversible where possible.

## Procedure
1. Stop or isolate the process producing suspect mutations.
2. Define the affected entities, operations, and time window.
3. Preserve audit evidence and snapshots before repair.
4. Identify the authoritative source for each data domain.
5. Quantify missing, duplicated, stale, and incorrect records.
6. Design reconciliation queries or deterministic comparison logic.
7. Separate repair of authoritative data from rebuilding derived data.
8. Test repair logic on representative copies or dry runs.
9. Execute in bounded batches with checkpoints.
10. Reconcile after repair and monitor for recurrence.

## Decision points
Prefer replay when events are complete and handlers are idempotent. Prefer targeted correction when replay could duplicate side effects or source history is incomplete.

## Common failure patterns
Repairing before preserving evidence, using production as the first test, rebuilding from a non-authoritative source, ignoring external side effects, and declaring success from application health alone.

## Verification
Use independent reconciliation to prove expected record counts, values, relationships, and side effects are correct.

## Expected output
A bounded integrity assessment and verified repair plan/results with audit evidence.

## Stop conditions
Escalate for destructive repair, regulated records, uncertain source of truth, irreversible external side effects, or insufficient backup/audit evidence.