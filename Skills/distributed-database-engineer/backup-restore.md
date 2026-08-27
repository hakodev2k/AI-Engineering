# Distributed Backup and Restore

## Purpose
Design backups and restores that produce recoverable, semantically valid distributed database state.

## When to use
Use for recovery planning, backup redesign, restore drills, or data-loss incidents.

## Inputs
RPO/RTO, database backup capabilities, topology, data volume, encryption requirements, dependency graph.

## Context to inspect
Snapshot mechanisms, transaction/log positions, object storage, retention, keys, cross-database dependencies, and previous restore tests.

## Core knowledge
A backup is useful only if restoration is proven. Distributed snapshots require a consistent recovery point or documented reconciliation semantics. Logs, schema metadata, encryption keys, and cluster metadata can be as important as data files.

## Procedure
1. Define recovery scenarios and RPO/RTO.
2. Inventory all state required to reconstruct the database.
3. Choose snapshot and log-retention strategy.
4. Define consistency point across partitions and dependencies.
5. Encrypt and isolate backup copies.
6. Automate integrity checks.
7. Restore into an isolated environment.
8. Validate logical and physical consistency.
9. Measure recovery time at realistic scale.
10. Document point-in-time and disaster procedures.

## Decision points
Prefer incremental/log-based recovery for tight RPO when operational complexity is justified; use full snapshots where simplicity and restore predictability dominate.

## Common failure patterns
Untested backups, missing keys or metadata, snapshots with inconsistent partition times, retention shorter than detection lag, and restore procedures that depend on the failed control plane.

## Verification
Perform full restore drills, validate checksums and application invariants, and measure achieved RPO/RTO.

## Expected output
A tested backup architecture, retention policy, restore runbook, and recovery evidence.

## Stop conditions
Escalate if backups cannot be decrypted, required metadata is absent, or restore testing risks production data.