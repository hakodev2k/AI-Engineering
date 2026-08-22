# Data Lake and Lakehouse Design

## Purpose
Design scalable object-storage data layouts that remain governable, queryable, and maintainable as data volume and consumers grow.

## When to use
Use for raw and curated data lakes, lakehouse platforms, open table formats, and shared analytical storage.

## Inputs
Data domains, formats, volume, update patterns, query engines, retention, governance, and cost constraints.

## Context to inspect
Inspect storage hierarchy, table format capabilities, catalog, partition strategy, compaction, schema evolution, access controls, and workload concurrency.

## Core knowledge
Object stores are not file systems. Small files, poor partitioning, uncontrolled schemas, and mutable paths cause operational debt. Table formats can add transactions, snapshots, schema evolution, and metadata pruning.

## Procedure
1. Define zones or layers by responsibility, not arbitrary names.
2. Choose durable columnar formats for analytical data.
3. Select a table format when updates, deletes, snapshots, or concurrent writers require it.
4. Partition using common selective predicates with bounded cardinality.
5. Define compaction and file-size targets.
6. Register authoritative metadata in a catalog.
7. Separate raw preservation from curated contracts.
8. Apply lifecycle, encryption, and access policies.
9. Test representative scans and concurrent writes.
10. Monitor metadata growth, small files, and storage cost.

## Decision points
Use plain immutable files for simple append-only workloads; use transactional table formats when mutation and multi-engine consistency justify added complexity.

## Common failure patterns
Partitioning by high-cardinality IDs, millions of tiny files, consumers reading raw paths directly, manual folder conventions as governance, and overwriting data without snapshots.

## Verification
Measure file distribution and scan pruning, test concurrent writes and rollback where supported, validate catalog permissions, and calculate lifecycle cost.

## Expected output
A governed lake/lakehouse layout with explicit layers, formats, partitioning, lifecycle, and maintenance rules.

## Stop conditions
Escalate when required consistency cannot be provided by the chosen storage/table technology or governance ownership is undefined.