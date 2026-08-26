# Query Performance Tuning

## Purpose
Diagnose and improve vector-query latency and throughput while protecting retrieval quality.

## When to use
Use when p95/p99 latency, throughput, or resource consumption violates targets.

## Inputs
SLOs, query traces, ANN parameters, filters, corpus size, concurrency, and infrastructure metrics.

## Context to inspect
Inspect end-to-end traces, client/network time, queueing, database execution, index traversal, filters, payload fetches, CPU/GPU, memory, I/O, cache, and connection pools.

## Core knowledge
Tail latency often comes from queueing, skew, resource saturation, filters, or payload work rather than ANN alone. Tuning ANN search effort can trade recall for latency; changes must be evaluated jointly.

## Procedure
1. Reproduce with production-shaped load and warm/cold states.
2. Decompose latency by client, network, queue, search, filtering, and payload retrieval.
3. Identify saturated resource and high-cardinality query classes.
4. Compare exact/ANN and filtered/unfiltered profiles.
5. Tune search parameters one variable at a time.
6. Reduce unnecessary payload transfer and result counts.
7. Fix connection/concurrency/queue limits before scaling blindly.
8. Re-evaluate recall after each performance change.
9. Load-test beyond expected peak to determine headroom.
10. Record before/after p50/p95/p99, throughput, recall, and cost.

## Decision points
Scale up when a node-local bottleneck benefits from memory/CPU; scale out when workload partitions safely and coordination cost is acceptable. Cache only stable, repeated queries with valid invalidation semantics.

## Common failure patterns
Optimizing averages; increasing concurrency into saturation; tuning without recall checks; oversized payloads; unbounded top-k; ignoring network serialization; benchmarking tiny corpora; premature hardware scaling.

## Verification
Meet SLO under expected and peak load, preserve quality threshold, and confirm no new saturation or error-rate regression.

## Expected output
Root cause, measured changes, tuned configuration, capacity headroom, and rollback settings.

## Stop conditions
Stop if production load cannot be safely reproduced, metrics are missing, or tuning requires risky infrastructure changes without approval.