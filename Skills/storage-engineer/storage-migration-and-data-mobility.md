# Storage Migration and Data Mobility

## Purpose
Move data between storage systems with controlled downtime, integrity verification, rollback, and performance validation.

## When to use
Use for platform refresh, cloud migration, tier changes, datacenter moves, protocol transitions, or consolidation.

## Inputs
Source/target inventory, data size/change rate, dependencies, downtime budget, network capacity, migration tooling, and rollback requirements.

## Context to inspect
Application mounts/endpoints, permissions, ACLs, metadata, snapshots, replication, DNS/configuration, backup state, and peak workload windows.

## Core knowledge
Migration is a consistency problem as much as a copy problem. Bulk seed plus incremental synchronization often minimizes downtime. Cutover requires an authoritative-writer transition and measurable reconciliation.

## Procedure
1. Inventory datasets, owners, dependencies, and semantics.
2. Validate target compatibility and capacity/performance.
3. Establish verified backup and rollback criteria.
4. Measure copy bandwidth and estimate seed duration.
5. Perform initial copy with metadata/ACL preservation.
6. Run incremental synchronization while source remains authoritative.
7. Quiesce writes or coordinate final consistency boundary.
8. Reconcile counts, sizes, checksums, and application metadata.
9. Cut clients to target and monitor closely.
10. Retain source read-only until rollback window closes.
11. Decommission only after approval and evidence.

## Decision points
Choose offline migration for simplicity when downtime fits; use replication/incremental sync for low-downtime needs. Prefer checksum-based validation over counts alone.

## Common failure patterns
Missing ACLs/xattrs, underestimating small-file copy time, dual writers, no rollback window, hidden dependencies, and declaring success after bytes copy but before application validation.

## Verification
Compare checksums/metadata, run application acceptance tests, verify performance/SLOs, and execute rollback rehearsal where practical.

## Expected output
Migration plan, cutover/rollback runbook, reconciliation evidence, and decommission criteria.

## Stop conditions
Stop if target semantics differ unexpectedly, validation fails, rollback is unavailable, or authoritative-writer state is ambiguous.