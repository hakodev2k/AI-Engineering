# DNS Performance and Cache Tuning

## Purpose
Reduce DNS latency and resolver load without creating stale-data or capacity risks.

## When to use
High query latency, cache inefficiency, QPS growth, authority overload, or TTL review.

## Inputs
QPS, latency percentiles, cache hit/miss data, record TTLs, resolver resources, query-type distribution, upstream timings.

## Context to inspect
Hot names, negative caching, prefetch/serve-stale features, cache memory, recursion concurrency, network RTT, authority latency.

## Core knowledge
DNS performance is dominated by cache locality and recursive dependency latency. Higher TTL improves cache efficiency but slows change propagation. Optimize from measured distributions.

## Procedure
1. Baseline median/tail latency, QPS, hit ratio, and errors.
2. Separate cached from recursive query latency.
3. Identify hot names and expensive delegation chains.
4. Inspect TTL distributions and negative caching.
5. Validate resolver CPU/memory/network headroom.
6. Tune cache/concurrency within platform guidance.
7. Consider prefetch or serve-stale for resilience.
8. Adjust authoritative TTLs only with service-owner agreement.
9. Load-test representative query mixes.
10. Compare tail latency and error rate after change.

## Decision points
Increase TTL for stable records; retain lower TTL where operational steering needs justify cost. Use serve-stale when availability benefit outweighs temporary stale answers.

## Common failure patterns
Optimizing averages, setting universally tiny TTLs, oversized cache causing memory pressure, benchmarking only cached queries, and ignoring slow authoritative dependencies.

## Verification
Measure hit ratio, recursive latency, tail latency, resource utilization, stale-answer behavior, and error rate under representative load.

## Expected output
Performance diagnosis, tuned configuration/TTL recommendations, benchmark evidence, and capacity thresholds.

## Stop conditions
Stop when load testing risks production, data lacks cache-state distinction, or TTL changes conflict with application failover requirements.