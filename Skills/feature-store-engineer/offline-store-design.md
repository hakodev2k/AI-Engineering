# Offline Store Design

## Purpose
Design storage for historical features that supports efficient training retrieval, backfills and reproducibility.

## When to use
Use when selecting or evolving warehouse/lake tables, formats, partitions and retention.

## Inputs
Data volume, feature cardinality, retention, query patterns, compute engine and governance requirements.

## Context to inspect
Current lake/warehouse layout, file sizes, table formats, partition statistics, access controls and training workloads.

## Core knowledge
Offline storage optimizes temporal scans and joins rather than single-key latency. Partition pruning, columnar formats, compaction, schema evolution and snapshot semantics dominate performance and reproducibility.

## Procedure
1. Characterize historical retrieval patterns.
2. Estimate growth and retention.
3. Choose table/file format compatible with compute engines.
4. Partition primarily around temporal access without excessive cardinality.
5. Define clustering/sorting where it improves joins.
6. Set compaction and small-file policies.
7. Define schema evolution and snapshot retention.
8. Apply encryption and least-privilege access.
9. Benchmark representative training queries.
10. Establish cost, freshness and storage health metrics.

## Decision points
Prefer wide or grouped layouts when retrieval patterns are stable; normalized layouts when independent feature evolution dominates. Avoid high-cardinality partitions.

## Common failure patterns
Tiny files, partition explosion, mutable history without snapshots, unrestricted PII access and layouts optimized for ingestion but not training.

## Verification
Measure pruning, bytes scanned, join runtime, snapshot reproducibility and access-policy enforcement.

## Expected output
A documented offline storage architecture meeting retrieval, governance and cost targets.

## Stop conditions
Stop if retention, regulatory constraints or workload scale are unknown enough to make irreversible layout choices unsafe.