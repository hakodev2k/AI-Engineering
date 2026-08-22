# IAM Performance and Scale

## Purpose
Design identity services and integrations that remain reliable under authentication peaks, directory growth, provisioning bursts, token validation load, and external-provider limits.

## When to use
Use for large migrations, high-volume authentication, SCIM synchronization, directory queries, token validation bottlenecks, or IAM capacity incidents.

## Inputs
Traffic patterns, user/group counts, latency/error metrics, provider limits, cache behavior, provisioning queues, dependency SLAs, and growth forecasts.

## Context to inspect
Inspect authentication latency, token/key metadata caching, directory query patterns, group expansion, provisioning batch size, rate limits, retries, queues, and dependency timeouts.

## Core knowledge
IAM paths sit on critical request flows. Reliability requires bounded dependency calls, safe caching, backpressure, idempotency, and awareness of eventual consistency. Security validation must not be removed for speed.

## Procedure
1. Define latency, throughput, freshness, and recovery objectives.
2. Measure current bottlenecks before changing architecture.
3. Separate interactive authentication from asynchronous lifecycle work.
4. Cache safe metadata such as signing keys with controlled refresh.
5. Optimize directory queries and avoid unbounded group expansion.
6. Batch provisioning within provider limits.
7. Implement bounded retry with jitter and idempotency.
8. Use queues/backpressure for bursty lifecycle events.
9. Load-test realistic peak and failure scenarios.
10. Monitor saturation, rate limits, lag, and stale state.

## Decision points
Cache only data whose staleness risk is acceptable. Asynchronous processing improves resilience for provisioning but may be unacceptable for urgent revocation unless a faster path exists.

## Common failure patterns
Retry storms, fetching signing metadata per request, N+1 directory queries, huge nested groups, ignoring provider quotas, unbounded queues, and weakening authorization checks to reduce latency.

## Verification
Benchmark before/after, load-test peaks, inject dependency throttling/failure, and verify security semantics remain correct under load.

## Expected output
A measured IAM scalability design with capacity assumptions, optimizations, failure controls, monitoring, and benchmark evidence.

## Stop conditions
Stop when performance goals require weakening mandatory security semantics or provider limits make required SLAs impossible without architectural change.