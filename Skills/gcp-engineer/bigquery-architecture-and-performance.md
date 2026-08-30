# BigQuery Architecture and Performance

## Purpose
Design analytical datasets and queries for performance, cost control, governance, and predictable concurrency in BigQuery.

## When to use
Use for warehouse design, slow or expensive queries, workload isolation, ingestion planning, or analytics governance.

## Inputs
Query patterns, data volume, freshness target, concurrency, partition keys, security requirements, and budget.

## Context to inspect
Schemas, partitioning, clustering, materialized views, slot usage, reservations, query plans, bytes scanned, and access policies.

## Core knowledge
BigQuery is columnar and distributed. Partition pruning, clustering, projection, and workload management usually matter more than traditional index thinking.

## Procedure
1. Classify workloads by latency and concurrency.
2. Model tables around analytical access patterns.
3. Partition on stable, selective time or range fields.
4. Cluster on commonly filtered/joined columns where beneficial.
5. Avoid SELECT * in production queries.
6. Inspect execution details and shuffle stages.
7. Use materialization when repeated computation justifies it.
8. Choose on-demand or capacity reservations from measured usage.
9. Apply row/column policy controls when needed.
10. Track cost and performance regressions.

## Decision points
Denormalize when it reduces expensive joins without creating unacceptable duplication. Use reservations for predictable sustained workloads.

## Common failure patterns
Unpartitioned event tables, partition filters missing, cross joins, uncontrolled ad hoc scans, and premature capacity purchases.

## Verification
Compare bytes processed, slot time, stage skew, and runtime before/after changes; validate access policies.

## Expected output
A cost-aware BigQuery workload design.

## Stop conditions
Stop if data retention, residency, or ownership is undefined.