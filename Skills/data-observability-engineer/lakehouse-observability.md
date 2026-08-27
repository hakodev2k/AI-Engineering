# Lakehouse Observability

## Purpose
Monitor lakehouse data products for file-level integrity, partition health, table metadata consistency, transaction-log issues, and queryability across large object-storage-backed datasets.

## When to use
Use for Delta Lake, Iceberg, Hudi, or similar table formats and for partitioned analytical lakes where file layout and metadata affect reliability.

## Inputs
Table metadata, object-store inventory, transaction logs, compaction history, partition statistics, ingestion schedules, query telemetry.

## Preconditions
Table-format semantics and maintenance procedures must be understood before changing metadata or files.

## Context to inspect
Inspect manifests, snapshots, partitions, file counts and sizes, schema evolution, compaction, vacuum/retention settings, failed commits, and readers.

## Core knowledge
Lakehouse reliability depends on coordination between object storage, transaction metadata, schema evolution, and maintenance. Small-file proliferation, stale manifests, partial writes, or unsafe retention can produce severe performance or correctness problems.

## Procedure
1. Identify critical tables and read/write engines.
2. Monitor snapshot or commit progression.
3. Track partition completeness and file-count distributions.
4. Detect abnormal small-file growth and compaction backlog.
5. Validate schema and partition evolution.
6. Monitor metadata and manifest growth.
7. Detect failed or incomplete writes using table-format semantics.
8. Correlate maintenance jobs with query regressions.
9. Test recovery from interrupted writes and delayed compaction.
10. Document safe retention and repair boundaries.

## Decision points
Compact based on measured query and metadata cost, not file count alone. Retain snapshots long enough for recovery and consumers while controlling storage cost. Prefer supported transaction-log repair over direct object deletion.

## Common failure patterns
- Deleting files outside table-format rules
- Aggressive vacuum that removes needed history
- Ignoring metadata growth
- Treating object existence as committed data
- No monitoring of compaction backlog

## Verification
Simulate partial writes, schema changes, and file fragmentation in non-production and verify alerts and supported recovery paths.

## Expected output
Lakehouse health metrics, maintenance thresholds, snapshot diagnostics, and safe operational runbooks.

## Stop conditions
Stop before direct metadata mutation, destructive vacuum, or file deletion without proven recovery and approval.