# BI Performance Tuning

## Purpose
Diagnose and improve end-to-end BI latency across source queries, warehouse execution, semantic models, gateways, and visual rendering.

## When to use
Use when reports load slowly, refreshes miss SLAs, concurrency degrades, or compute cost rises.

## Inputs
Query traces, execution plans, model metadata, refresh logs, telemetry, concurrency, data volumes, latency targets.

## Context to inspect
Inspect each layer before optimizing: visual queries, semantic calculations, relationships, storage mode, generated SQL, partitions, source plan, network/gateway, and capacity metrics.

## Core knowledge
Optimize measured bottlenecks. Performance is often dominated by cardinality, scans, expensive expressions, poor partition pruning, fan-out relationships, or excessive visual queries rather than raw row count alone.

## Procedure
1. Reproduce with representative filters and cold/warm states.
2. Establish baseline p50/p95 latency and resource use.
3. Decompose time by client, semantic engine, gateway, and source.
4. Identify highest-cost queries and calculations.
5. Inspect cardinality, filter propagation, scanned columns/partitions, and execution plans.
6. Apply the smallest semantic-preserving improvement.
7. Consider aggregation, materialization, indexing/clustering, model reduction, or visual simplification based on evidence.
8. Retest under representative concurrency.
9. Confirm correctness did not change.
10. Record before/after evidence and regression guardrails.

## Decision points
Prefer model/query fixes before scaling capacity. Scale resources when workload is legitimately capacity-bound after avoidable inefficiencies are removed.

## Common failure patterns
Premature caching, optimizing averages only, hiding slow queries with timeouts, adding indexes blindly, excessive visuals, and changing semantics for speed.

## Verification
Demonstrate improved latency/resource metrics under comparable workload and identical result sets.

## Expected output
Bottleneck diagnosis, measured changes, before/after metrics, and regression monitoring.

## Stop conditions
Stop when representative telemetry is unavailable, production-scale testing requires approval, or proposed changes alter governed semantics.