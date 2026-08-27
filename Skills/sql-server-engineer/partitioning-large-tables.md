# Partitioning Large Tables

## Purpose
Use SQL Server partitioning for lifecycle, maintenance, and access-management problems without treating it as automatic query acceleration.

## When to use
Use for very large tables with aligned retention/loading boundaries, sliding windows, or partition-level maintenance needs.

## Inputs
Table size/growth, access predicates, retention policy, loading process, indexes, storage/filegroup design.

## Context to inspect
Inspect partition key candidates, query predicates, aligned indexes, partition elimination, statistics, boundary management, and operational procedures.

## Core knowledge
Partitioning primarily improves manageability. Query benefit requires effective elimination and suitable indexing; poor partition keys can worsen plans and uniqueness design.

## Procedure
1. Define the operational problem partitioning should solve.
2. Choose a stable partition key aligned with lifecycle/access patterns.
3. Design partition function and scheme with future boundaries.
4. Evaluate unique-key implications.
5. Align indexes where operationally useful.
6. Test elimination in actual plans.
7. Design switch-in/switch-out procedures.
8. Automate future boundary creation.
9. Test backup, maintenance, and retention workflows.

## Decision points
Partition only when operational benefits justify complexity. Prefer ordinary indexing for query performance when lifecycle management is not the issue.

## Common failure patterns
Partitioning by an arbitrary ID, missing elimination due to predicates/conversions, forgetting future boundaries, and expecting partitioning to replace indexes.

## Verification
Verify correct row placement, partition elimination, switch operations, retention behavior, and maintenance duration.

## Expected output
Partition design, lifecycle procedure, query evidence, and operational safeguards.

## Stop conditions
Stop if partition key semantics or retention boundaries are unstable.