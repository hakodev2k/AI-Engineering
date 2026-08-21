# Distributed Caching

## Purpose
Apply caching where it materially reduces latency/load without introducing unacceptable staleness or correctness risk.

## When to use
Hot read paths, expensive computation, repeated remote calls, or database load shown by metrics.

## Inputs
Access patterns, latency profile, data volatility, consistency tolerance, cache technology, memory budget.

## Context to inspect
Current bottleneck, key design, TTLs, invalidation paths, serialization, hit ratio, cache failures.

## Core knowledge
Cache-aside, TTL, invalidation, stampede prevention, negative caching, key versioning, serialization cost, distributed consistency, memory eviction.

## Procedure
1. Prove the uncached bottleneck.
2. Define what may be stale and for how long.
3. Design stable namespaced keys.
4. Choose cache-aside or another explicit pattern.
5. Set TTL from business freshness, not convenience.
6. Prevent stampedes for hot misses.
7. Treat cache outage as a degraded dependency where possible.
8. Instrument hits, misses, latency, errors, evictions.
9. Load-test warm and cold scenarios.

## Decision points
Do not cache low-cost/highly volatile data without evidence. Prefer local cache for process-local reusable immutable data; distributed cache when sharing across instances matters.

## Common failure patterns
Cache as source of truth, missing invalidation, giant values, unbounded keys, correlated expiry, secrets/PII without controls.

## Verification
Hit ratio and latency improvement, stale-data tests, cache-down tests, memory/eviction monitoring.

## Expected output
Measured cache benefit with defined freshness and failure behavior.

## Stop conditions
Escalate caching of regulated/sensitive data or correctness-critical state.