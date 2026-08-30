# Warehouse Cost Optimization

## Purpose
Control analytical platform spend while preserving required freshness, performance, reliability, and developer productivity.

## When to use
Use when compute or storage costs rise, budgets are missed, workloads are inefficient, or capacity changes are being planned.

## Inputs
Billing data, query history, warehouse utilization, storage metrics, pipeline schedules, SLAs, retention requirements.

## Context to inspect
Top spenders, idle resources, scan volume, concurrency, materializations, refresh frequency, duplicate datasets, retention, and chargeback metadata.

## Core knowledge
Warehouse cost is driven by data scanned, compute time, concurrency, storage, data movement, and operational choices. Cost optimization must preserve service objectives; indiscriminate downsizing often moves cost into latency and incidents.

## Procedure
1. Attribute spend to teams, workloads, datasets, and environments.
2. Rank high-cost queries and pipelines.
3. Identify idle, overprovisioned, or continuously running compute.
4. Reduce unnecessary scans through pruning, projection, and incremental processing.
5. Review materialization and refresh frequency.
6. Remove redundant copies and expired data under retention policy.
7. Configure autoscaling, suspend/resume, reservations, or workload limits appropriately.
8. Add budget alerts and cost ownership.
9. Benchmark performance after changes.
10. Track savings against reliability and freshness regressions.

## Decision points
Optimize SQL before reducing compute when inefficiency dominates. Precompute when repeated expensive queries justify storage. Use reserved capacity only with stable utilization evidence.

## Common failure patterns
Optimizing only unit price, deleting useful history without policy review, shrinking compute until queues rise, and ignoring development/test waste.

## Verification
Compare normalized cost per workload, latency, freshness, and failure rate before and after changes.

## Expected output
A prioritized cost plan with measured savings and service-level safeguards.

## Stop conditions
Stop changes that violate agreed SLAs, retention obligations, or materially increase operational risk.