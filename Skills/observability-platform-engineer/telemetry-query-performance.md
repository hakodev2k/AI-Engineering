# Telemetry Query Performance

## Purpose
Investigate and optimize slow or expensive observability queries across metrics, logs, and traces without sacrificing diagnostic correctness.

## When to use
Use when dashboards time out, incident queries overload backends, or query cost rises unexpectedly.

## Inputs
Slow queries, query plans or backend stats, cardinality, retention, shard/partition layout, workload patterns.

## Context to inspect
Inspect time ranges, filters, aggregations, regex use, joins, series counts, scanned bytes, caches, and concurrency.

## Core knowledge
Understand selectivity, partition pruning, pre-aggregation, recording rules, indexing, caching, query fan-out, and cardinality effects.

## Procedure
1. Reproduce the query with timing and resource metrics.
2. Identify the dominant scan, aggregation, or fan-out cost.
3. Reduce time range and scope where semantics permit.
4. Replace unbounded regex or wildcard filters.
5. Add pre-aggregation or recording rules for repeated expensive computations.
6. Adjust indexes or partitions based on actual query patterns.
7. Compare before/after correctness and performance.
8. Add guardrails for abusive queries if needed.

## Decision points
Precompute stable repeated queries; keep ad hoc flexibility for rare investigations. Add indexes only when write/storage overhead is justified.

## Common failure patterns
Optimizing dashboards without measuring backend cost, hiding correctness changes, unbounded group-by, and indexing every field.

## Verification
Benchmark representative queries under concurrent load and compare latency, scanned data, CPU, and correctness.

## Expected output
Measured query improvements with documented trade-offs and regression tests where practical.

## Stop conditions
Stop if backend statistics are unavailable or optimization would alter required semantics without approval.