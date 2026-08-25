# Storage Migration

## Purpose
Move data between storage systems with controlled consistency, downtime, rollback, performance, and integrity risk.

## When to use
Use for platform replacement, cloud migration, tier changes, consolidation, or filesystem/volume redesign.

## Inputs
Source/target capabilities, dataset size/change rate, dependencies, downtime budget, RPO/RTO, validation method, and rollback window.

## Preconditions
Confirm source backups/recovery and target capacity/performance before moving authoritative data.

## Context to inspect
Mounts/volumes, permissions, metadata, snapshots, replication, application write paths, DNS/configuration, network bandwidth, and cutover dependencies.

## Core knowledge
Migration is a consistency problem as much as a copy problem. Initial bulk copy, incremental synchronization, write quiescence or dual-write semantics, cutover, validation, and rollback must form one coherent plan.

## Procedure
1. Inventory data, metadata, and consumers.
2. Establish baseline integrity and backups.
3. Validate target semantics and capacity.
4. Estimate transfer and change rates.
5. Choose offline, staged sync, replication, or application-level migration.
6. Rehearse on representative data.
7. Perform bulk transfer and incremental sync.
8. Quiesce or coordinate final writes.
9. Cut over consumers.
10. Validate integrity, permissions, and performance.
11. Keep source protected through rollback window.
12. Decommission only after approval.

## Decision points
Use offline migration for simple bounded downtime; staged synchronization for large datasets; application-aware methods when storage-level copying cannot preserve consistency.

## Common failure patterns
Missing ACL/xattr metadata, underestimated change rate, no rollback, target slower than source, stale clients, and deleting source immediately after cutover.

## Verification
Compare counts/checksums where meaningful, validate application transactions, permissions, SLOs, and rollback readiness.

## Expected output
A migration plan and execution record with checkpoints, validation evidence, rollback criteria, and decommission decision.

## Stop conditions
Stop if target semantics differ incompatibly, validation fails, source protection is lost, or rollback cannot be maintained during cutover.
