# Columnstore Analytics

## Purpose
Engineer SQL Server columnstore storage for high-volume analytical workloads while controlling load, delete, and memory behavior.

## When to use
Use for scans/aggregations over large fact-style datasets or hybrid analytical designs.

## Inputs
Workload queries, table size, load/update patterns, segment metadata, plans, memory and compression metrics.

## Context to inspect
Inspect rowgroup quality, segment elimination, delta stores, delete bitmap, batch mode, partitioning, ordering opportunities, and ETL batch sizes.

## Core knowledge
Columnstore excels at compressed scans and batch processing but depends on healthy rowgroups and workload shape. Small trickle loads and heavy updates can degrade quality.

## Procedure
1. Confirm analytical scan/aggregation workload fit.
2. Baseline rowstore performance and storage.
3. Choose clustered or nonclustered columnstore architecture.
4. Design load batches for high-quality compressed rowgroups.
5. Inspect segment elimination and rowgroup health.
6. Tune predicates and data ordering where beneficial.
7. Plan delete/update maintenance.
8. Test mixed workload effects.
9. Monitor compression, memory, and query latency.

## Decision points
Use clustered columnstore for large analytics-first tables; nonclustered columnstore when transactional rowstore access must remain primary and analytics is secondary.

## Common failure patterns
Tiny batches, assuming all queries benefit, excessive point updates, poor elimination, and ignoring rowgroup fragmentation.

## Verification
Compare CPU, reads, elapsed time, compression, rowgroup quality, load throughput, and transactional impact.

## Expected output
Columnstore design, load/maintenance strategy, and measured analytical benefit.

## Stop conditions
Stop if workload is predominantly singleton OLTP and no analytical benefit is demonstrated.