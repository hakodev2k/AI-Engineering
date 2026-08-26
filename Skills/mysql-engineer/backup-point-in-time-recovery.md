# Backup and Point-in-Time Recovery

## Purpose
Build recoverable MySQL backups and point-in-time recovery rather than merely producing backup files.

## When to use
Use for backup design, restore drills, retention changes, or recovery incidents.

## Inputs
RPO/RTO, dataset size, binlog retention, encryption requirements, backup tooling, storage targets.

## Context to inspect
Full/incremental strategy, snapshot consistency, GTID/binlog coordinates, key management, retention, cross-account/region copies, restore infrastructure.

## Core knowledge
A backup is useful only if restorable, consistent, complete, protected, and tied to logs needed for PITR. Recovery time often depends on transfer and replay, not backup creation.

## Procedure
1. Define recovery scenarios and objectives.
2. Choose logical, physical, snapshot, or combined strategy.
3. Ensure transactionally consistent capture.
4. Preserve binlogs/GTID metadata for PITR.
5. Encrypt and isolate backup storage.
6. Automate integrity checks and retention.
7. Restore into an isolated environment.
8. Replay logs to a selected timestamp/GTID.
9. Validate application-level invariants and representative queries.
10. Measure restore duration and update capacity assumptions.

## Decision points
Use physical backups for large datasets and fast restore; logical backups for portability/selective recovery; snapshots when storage guarantees consistency and restore workflow is tested.

## Common failure patterns
Never restoring, binlog gaps, backups sharing failure domain with primary, missing encryption keys, and retention shorter than incident discovery time.

## Verification
Perform scheduled restore drills and record checksum/invariant validation, PITR precision, RPO, and RTO.

## Expected output
Backup policy, retention, restore/PITR runbook, and latest drill evidence.

## Stop conditions
Escalate on missing logs, unavailable encryption keys, inconsistent backup metadata, or recovery that would overwrite surviving evidence.