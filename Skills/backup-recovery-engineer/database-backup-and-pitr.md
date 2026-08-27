# Database Backup and Point-in-Time Recovery

## Purpose
Design and operate database protection that supports consistent backups and precise recovery to an acceptable point before corruption or loss.

## When to use
Use for transactional databases requiring low RPO, point-in-time recovery, migration safeguards, or corruption recovery.

## Inputs
Database engine/version, topology, transaction/log mechanism, data size, write rate, RTO/RPO, retention, encryption, and restore infrastructure.

## Context to inspect
Inspect native backup capabilities, log retention, replication, transaction consistency, extension dependencies, users/roles, encryption keys, storage, and restore tooling.

## Core knowledge
PITR normally combines a base backup with continuous transaction/log archives. A valid backup chain requires every necessary segment. Replicas are not substitutes for independent backups because logical corruption can propagate.

## Procedure
1. Confirm engine-supported backup and PITR semantics.
2. Define consistent base-backup cadence.
3. Configure continuous transaction/log archiving.
4. Protect backup metadata, roles, schemas, and required keys.
5. Monitor archive continuity and lag.
6. Define target-time selection using incident evidence.
7. Restore into an isolated environment.
8. Replay logs to the chosen recovery point.
9. Validate database consistency and application invariants.
10. Promote or migrate recovered data using an approved cutover plan.
11. Test the full chain periodically.

## Decision points
Use physical backups for large datasets and fast recovery where supported; logical backups can improve portability but may restore slowly. Choose target time conservatively when corruption onset is uncertain.

## Common failure patterns
Missing log segments; timezone mistakes; restoring over production; ignoring roles/extensions; untested encryption keys; assuming replica lag equals recoverable RPO.

## Verification
Prove a random historical recovery point can be restored, opened, checked for consistency, and validated against application-level invariants.

## Expected output
A repeatable PITR procedure with monitored chain integrity and measured recovery performance.

## Stop conditions
Escalate when log continuity is broken, target time is ambiguous with material data risk, required keys are unavailable, or promotion requires destructive actions without approval.