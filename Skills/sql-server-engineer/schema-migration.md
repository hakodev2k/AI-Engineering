# Schema Migration Engineering

## Purpose
Deliver SQL Server schema changes safely under live workload with controlled locking, compatibility, and rollback risk.

## When to use
Use for table/column/index/constraint changes, large backfills, or application-database deployments.

## Inputs
DDL, table sizes, workload, application versions, deployment topology, rollback requirements, maintenance window.

## Context to inspect
Inspect dependencies, locks, transaction log capacity, replication/AG effects, default/constraint behavior, online/resumable options, and application compatibility.

## Core knowledge
DDL can block, log heavily, or rewrite large tables. Backward-compatible expand/migrate/contract patterns reduce coupling between application and database deployment.

## Procedure
1. Identify dependencies and compatibility requirements.
2. Classify metadata-only versus data-moving operations.
3. Estimate locks, log volume, duration, and storage.
4. Prefer additive backward-compatible changes first.
5. Separate large data backfills into bounded batches.
6. Add constraints/indexes with appropriate online/resumable strategy when supported.
7. Deploy application changes compatible with old and new schema.
8. Validate data and workload.
9. Remove deprecated schema only after consumers are gone.

## Decision points
Use online/resumable operations for large busy objects when edition/version supports them; schedule offline work only when blocking is acceptable.

## Common failure patterns
One giant transaction, NOT NULL additions without planning, dropping columns before all consumers migrate, unbounded backfills, and assuming rollback is cheap.

## Verification
Validate schema, data counts/invariants, application compatibility, blocking, log growth, and performance before contract cleanup.

## Expected output
Phased migration plan, safety checks, rollback/roll-forward path, and validation evidence.

## Stop conditions
Stop when destructive changes lack backups, ownership, or verified consumer inventory.