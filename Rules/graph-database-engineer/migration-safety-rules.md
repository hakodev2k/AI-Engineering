# Migration Safety Rules

## Purpose
Change graph structures and semantics without uncontrolled data loss or downtime.

## Scope
Schema evolution, label/type changes, relationship rewrites, property transformations, backfills, and cleanup.

## MUST
- Make migrations versioned, reviewable, restartable where practical, and observable.
- Separate additive expansion from destructive cleanup when compatibility windows are required.
- Estimate affected entities, runtime, lock behavior, storage growth, and rollback feasibility before production execution.
- Require human approval for destructive, irreversible, or large-scale production migrations.
- Validate post-migration invariants and counts.

## MUST NOT
- Delete legacy graph data before consumers have migrated and verification has passed.
- Run an untested bulk rewrite directly in production.
- Treat backup existence as proof that restore is viable.

## SHOULD
- Use batches and checkpoints for large transformations.
- Prefer reversible expand-migrate-contract sequences.

## Exceptions
An irreversible migration requires explicit risk acceptance, tested recovery alternatives, maintenance-window planning, and approval.

## Verification
Dry-run against representative data, inspect query plans and lock behavior, test rollback/restore, compare pre/post counts and invariants, and monitor error rate, latency, replication, disk, and transaction pressure during execution.