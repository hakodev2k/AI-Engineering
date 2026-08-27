# Warehouse Observability

## Purpose
Monitor analytical warehouses for data reliability, workload contention, storage growth, and query behavior that can degrade data-product availability.

## When to use
Use for cloud warehouses and analytical databases serving BI, transformations, data marts, or ML features.

## Inputs
Query history, warehouse metrics, table metadata, transformation schedules, cost data, SLAs/SLOs, incident history.

## Preconditions
Access to metadata and query telemetry without exposing sensitive query contents unnecessarily.

## Context to inspect
Inspect compute pools, queues, concurrency, table growth, partitions/clustering, transformation windows, failed queries, and downstream dashboards.

## Core knowledge
Warehouse incidents often couple data correctness with resource contention. A Senior engineer separates slow queries, queue pressure, upstream lateness, storage design, and transformation failures instead of treating all latency as capacity shortage.

## Procedure
1. Identify critical workloads and publication windows.
2. Track queue time, execution time, failures, concurrency, and resource utilization.
3. Monitor table freshness, row growth, partition health, and storage expansion.
4. Correlate expensive or blocked queries with affected data products.
5. Detect workload interference between ETL and interactive analytics.
6. Define cost-aware performance baselines.
7. Alert on sustained consumer impact, not normal workload spikes.
8. Test degraded capacity and failed transformation scenarios.
9. Review recurring hotspots and architectural fixes.

## Decision points
Scale compute when saturation is proven; optimize SQL or data layout when inefficient work dominates. Separate workloads when isolation provides better reliability than shared scaling.

## Common failure patterns
- Scaling before identifying bad queries
- Monitoring compute but not table freshness
- Ignoring queue latency
- No distinction between ETL and BI workloads
- Cost alerts disconnected from workload behavior

## Verification
Reproduce representative contention or slow-query cases and verify metrics identify the correct bottleneck and affected products.

## Expected output
Warehouse health dashboards, workload alerts, freshness checks, and capacity/performance diagnostics.

## Stop conditions
Escalate when changes require production capacity commitments, destructive table redesign, or access to sensitive query content beyond authorization.