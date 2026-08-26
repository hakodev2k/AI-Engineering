# Backup, Restore, and Point-in-Time Recovery

## Purpose
Ensure migration activity cannot remove the organization's ability to recover authoritative data.

## When to use
Use during migration preparation, destructive transformations, cutover, and decommission planning.

## Inputs
Backup policies, snapshots, transaction logs, retention, encryption keys, restore procedures, RPO/RTO, and storage locations.

## Core knowledge
A successful backup job is not proof of recoverability. Recovery requires readable media, keys, logs, compatible software, documented ordering, and tested restore procedures.

## Procedure
1. Identify authoritative datasets and recovery objectives.
2. Verify backup coverage and retention across the migration window.
3. Verify encryption-key availability and access controls.
4. Create migration-specific restore points when appropriate.
5. Test restore into an isolated environment.
6. Validate data and application compatibility after restore.
7. Prove PITR to representative timestamps.
8. Record measured restore duration.
9. Protect backups from migration cleanup automation.
10. Retain source recovery assets until migration acceptance expires.

## Decision points
Use snapshots for fast local recovery where consistency is guaranteed; use logical/physical backups and logs according to engine capabilities and disaster scope.

## Common failure patterns
Untested backups, missing WAL/binlog retention, inaccessible keys, crash-inconsistent snapshots, and deleting source backups immediately after cutover.

## Verification
Perform restore and PITR drills and reconcile restored data.

## Expected output
Measured, tested recovery evidence covering the migration window.

## Stop conditions
Stop destructive migration steps when recoverability has not been demonstrated.