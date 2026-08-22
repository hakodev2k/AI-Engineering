# Schema Migrations and Zero-Downtime Change

## Purpose
Evolve database schemas safely while old and new application versions may run concurrently.

## When to use
Use for production DDL, large backfills, column replacements, constraint changes, and deployments requiring continuous availability.

## Inputs
Current schema, desired schema, application versions, deployment sequence, table size, lock behavior, replication topology, and rollback requirements.

## Context to inspect
Inspect readers and writers of affected objects, ORM migrations, DDL locking semantics, long transactions, background jobs, replicas, and data-retention constraints.

## Core knowledge
Safe evolution usually follows expand-migrate-contract: introduce compatible structures, migrate behavior/data, verify, then remove obsolete structures later.

## Procedure
1. Inventory all consumers of affected schema.
2. Classify each change as additive, behavioral, destructive, or data-transforming.
3. Design a backward-compatible expansion.
4. Deploy code able to tolerate both old and new states.
5. Backfill in bounded batches with observability and restartability.
6. Switch reads/writes deliberately.
7. Verify consistency and application behavior.
8. Wait through the required compatibility window.
9. Remove obsolete objects in a separate contraction step.
10. Retain rollback procedures for each phase.

## Decision points
Use online DDL features when engine support and workload allow. For very large transformations, prefer incremental migration over one blocking transaction.

## Common failure patterns
Rename/drop in the same deployment, unbounded backfills, hidden application consumers, adding expensive defaults blindly, and rollback plans that cannot restore data semantics.

## Verification
Test mixed-version compatibility, migration restartability, lock duration, data reconciliation, and rollback paths.

## Expected output
A phased migration plan with compatibility matrix, operational checks, and explicit contraction criteria.

## Stop conditions
Escalate destructive changes without recoverability, unknown consumers, or DDL behavior that cannot meet availability requirements.