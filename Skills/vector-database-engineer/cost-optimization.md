# Cost Optimization

## Purpose
Reduce vector-search total cost while maintaining agreed quality, latency, freshness, durability, and operational safety.

## When to use
Use for cost reviews, growth planning, architecture changes, or unexpectedly high managed-service/cloud spend.

## Inputs
Billing data, vector/index footprint, QPS, ingestion/embedding volume, replicas/shards, SLOs, and quality targets.

## Context to inspect
Inspect compute utilization, memory residency, storage tiers, replicas, shard count, idle capacity, network egress, embedding/backfill spend, backup retention, and query inefficiencies.

## Core knowledge
Cost is coupled to quality and reliability. Main levers include dimensions/model choice, precision/quantization, index type, replicas/shards, payload duplication, retention, batching, query candidate counts, and infrastructure utilization.

## Procedure
1. Attribute spend by serving, storage, ingestion/embedding, backups, and network.
2. Normalize cost per million queries, million vectors, and ingestion unit.
3. Identify underutilized or overprovisioned resources.
4. Remove unnecessary payloads/retained vectors and right-size replicas/shards cautiously.
5. Benchmark quantization/lower dimensions/index alternatives against quality.
6. Tune top-k/candidate counts and batching.
7. Schedule heavy backfills economically without violating freshness.
8. Evaluate reserved/committed capacity only for stable baseline demand.
9. Validate each saving against SLO and failure headroom.
10. Track realized savings after change.

## Decision points
Prefer engineering optimizations when they reduce both resource use and latency; use cheaper tiers only when I/O/availability trade-offs fit. Never remove redundancy solely for cost without revisiting RPO/RTO.

## Common failure patterns
Optimizing invoice total without unit economics; reducing replicas below failure-safe capacity; shrinking dimensions without relevance tests; ignoring embedding/API spend; excessive retention; optimizing idle test systems while production query waste dominates.

## Verification
Compare before/after unit cost, quality metrics, p99 latency, error rate, freshness, and degraded-mode capacity.

## Expected output
Prioritized savings with measured impact, risks, rollback, and realized unit economics.

## Stop conditions
Stop if savings would violate security, durability, contractual SLOs, or lack quality/performance evidence.