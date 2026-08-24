# Data Migration and Backfill

## Purpose
Plan and execute Salesforce data migrations and backfills with explicit mapping, validation, sequencing, idempotency, and rollback/reconciliation controls.

## When to use
Use for schema changes, legacy imports, external-system migrations, large corrective updates, and historical backfills.

## Inputs
Source data, target schema, mapping rules, volumes, external IDs, validation rules, automation, downtime tolerance, reconciliation criteria.

## Context to inspect
Triggers/Flows, duplicate rules, required fields, ownership, sharing, record types, integration keys, API/bulk tooling, storage limits.

## Core knowledge
Data loads can trigger business automation, locks, validation, and integrations. Large migrations require chunking, deterministic identity mapping, restartability, and evidence that source-to-target counts and semantics reconcile.

## Procedure
1. Profile source quality and cardinality.
2. Define field mapping, transformations, defaults, and rejects.
3. Establish stable external IDs for upsert/restartability.
4. Order parent/child loads and dependency updates.
5. Decide which automation must remain active, be bypassed through approved controls, or be handled separately.
6. Rehearse on representative data.
7. Execute in bounded batches and capture failures.
8. Reprocess only failed/retriable records safely.
9. Reconcile counts, key totals, relationships, and business invariants.
10. Preserve migration evidence and cleanup temporary controls.

## Decision points
Use Bulk API/tooling for high volume; use synchronous APIs for smaller workflows needing immediate per-record responses. Prefer forward-correctable transformations over destructive rewrites.

## Common failure patterns
No external IDs, duplicate loads after retry, automation storms, ownership skew, unbounded batch sizes, silent rejects, and validating only record counts.

## Verification
Reconcile source/target counts, sampled values, relationships, duplicate rate, failures, and downstream automation/integration outcomes.

## Expected output
A restartable migration runbook with mappings, batches, reconciliation, and recovery steps.

## Stop conditions
Stop when source quality is insufficient, destructive transformation lacks approval/backup, or reconciliation cannot prove correctness.