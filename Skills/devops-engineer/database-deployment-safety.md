# Database Deployment Safety

## Purpose
Coordinate schema and data changes without breaking running application versions or causing unsafe lock/rollback behavior.

## When to use
Use for migrations, index changes, column changes, backfills, or release sequences involving persistent data.

## Inputs
Schema change, DB engine, data volume, traffic, application versions, maintenance tolerance.

## Context to inspect
Migration scripts, query patterns, locks, replication, backups, rollback feasibility, application compatibility.

## Core knowledge
Database changes often cannot be rolled back like code. Prefer expand-migrate-contract, online operations, bounded batches, tested backups, and compatibility across deployment windows.

## Procedure
1. Classify destructive vs additive changes.
2. Measure table size and write/read patterns.
3. Check engine-specific locking behavior.
4. Split change into compatible phases.
5. Backfill in bounded resumable batches.
6. Add indexes using online/concurrent options where supported.
7. Monitor lock waits, CPU, IO, and replication lag.
8. Deploy consumers/producers in safe order.
9. Remove old schema only after verified cutover.
10. Validate backups and restore path.

## Decision points
Use maintenance windows only when online change is impractical; prefer roll-forward for irreversible transformations; pause backfills under production pressure.

## Common failure patterns
Rename/drop in same release, giant transactions, unbounded backfills, assuming ORM migration is safe, no restore test.

## Verification
Old and new app versions coexist as designed, migration completes without harmful locks, data counts reconcile, restore evidence exists.

## Expected output
Phased migration plan with monitoring and recovery strategy.

## Stop conditions
Stop for untested destructive migration or unknown backup integrity.