# RMAN Backup and Recovery

## Purpose
Design, operate, and prove Oracle backup and recovery using RMAN with tested RPO/RTO, retention, encryption, and restore procedures.

## When to use
Use for backup architecture, recovery drills, media failure, database duplication, or backup-incidence review.

## Inputs
RPO/RTO, database size/change rate, storage targets, retention policy, encryption requirements, standby topology.

## Context to inspect
RMAN configuration, control-file/SPFILE backup, catalog usage, full/incremental strategy, block change tracking, archive retention, encryption keys/wallets, and restore bandwidth.

## Core knowledge
A successful backup job is not proof of recoverability. Recovery requires database files, control metadata, archived redo, encryption material, documented procedures, and sufficient infrastructure.

## Procedure
1. Translate business RPO/RTO into backup and archive requirements.
2. Configure retention and backup optimization deliberately.
3. Protect control file and SPFILE metadata.
4. Choose full/incremental cadence based on change rate and restore economics.
5. Enable block change tracking when its workload profile justifies it.
6. Encrypt backups and protect keys according to policy.
7. Validate backups and monitor failures/corruption.
8. Perform periodic restore-and-recover drills to isolated systems.
9. Measure achieved RPO/RTO and document gaps.
10. Test point-in-time and disaster scenarios, not only full restore.

## Decision points
Use recovery catalog when centralized history/resilience warrants it. Prefer backups on independent failure domains from primary storage.

## Common failure patterns
Never testing restores, missing archived logs, inaccessible wallet keys, retention that deletes required recovery material, and restore bandwidth assumptions.

## Verification
Complete a clean restore/recovery from documented artifacts and record achieved RPO/RTO.

## Expected output
A tested RMAN protection strategy, runbook, and recovery evidence.

## Stop conditions
Stop before declaring compliance if restore tests or key-recovery tests have not succeeded.