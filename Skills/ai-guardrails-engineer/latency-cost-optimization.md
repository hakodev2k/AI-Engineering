# Guardrail Latency and Cost Optimization

## Purpose
Reduce guardrail latency/cost without weakening coverage.

## When to use
Use when controls materially affect latency, throughput, or spend.

## Inputs
Traces, volumes, costs, requirements, cacheability, errors, SLOs.

## Context to inspect
Inspect serial checks, duplicate inference, payloads, models, batching, caching, criticality.

## Core knowledge
Preserve risk-weighted quality; deterministic checks are cheaper and caches need versioned tenant-safe keys.

## Procedure
1. Profile layers.
2. Remove redundancy.
3. Move cheap safe checks earlier.
4. Parallelize independent controls.
5. Route clear cases to validated smaller models.
6. Batch.
7. Cache safely.
8. Bound context.
9. Re-evaluate critical slices.
10. Load-test.

## Decision points
Eliminate unnecessary work before reducing coverage; use cascades for uncertainty.

## Common failure patterns
Cross-tenant cache, stale policy, average-only optimization, races, no regression.

## Verification
Compare tail latency, cost, throughput, risk metrics.

## Expected output
Measured optimization preserving guarantees.

## Stop conditions
Stop on high-risk regression.