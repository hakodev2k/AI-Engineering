# Warehouse Cost Optimization

## Purpose
Reduce analytical compute and storage cost without degrading correctness, reliability, or required BI performance.

## When to use
Use when warehouse spend rises, workloads scale, dashboards scan excessive data, or capacity planning requires efficiency work.

## Inputs
Billing data, query history, table sizes, workload schedules, SLAs, partitioning/clustering, concurrency, retention policy.

## Context to inspect
Inspect top cost queries, repeated transformations, idle capacity, scan patterns, materializations, refresh frequency, storage tiers, and unused assets.

## Core knowledge
Cost is workload behavior multiplied by platform pricing. Optimize unit economics and waste before sacrificing service objectives. Query scans, poor pruning, unnecessary refreshes, over-materialization, and idle provisioned capacity are common drivers.

## Procedure
1. Establish cost baseline by workload/team/data product.
2. Rank spend by actionable query and storage drivers.
3. Identify unused assets and redundant refreshes.
4. Improve partition pruning, clustering/indexing, projections, and join strategy based on plans.
5. Consolidate repeated expensive transformations into governed reusable layers where beneficial.
6. Tune refresh cadence to actual freshness requirements.
7. Evaluate workload isolation, autoscaling, reservation, or serverless pricing using measured demand.
8. Apply retention and archival policy to cold data.
9. Measure cost per refresh/query/user alongside latency.
10. Add budgets/anomaly alerts and review regressions.

## Decision points
Materialize when repeated compute exceeds storage/maintenance cost. Reserve capacity for predictable sustained utilization; elastic pricing for variable workloads when economics support it.

## Common failure patterns
Optimizing list price instead of usage, deleting needed history, reducing refresh below business SLA, adding aggregates nobody uses, and cost cuts that create operational fragility.

## Verification
Compare normalized workload cost and performance before/after while confirming identical analytical results and SLA compliance.

## Expected output
Measured savings plan, implemented efficiency changes, guardrails, and no-regression evidence.

## Stop conditions
Stop when billing attribution is insufficient, proposed retention conflicts with compliance, or savings require an SLA change without approval.