# Performance, Cost, and Capacity

## Purpose
Engineer workflow throughput, latency, and operating cost using measured bottlenecks and realistic demand rather than premature optimization.

## When to use
Use when workflows miss SLAs, costs rise, queues grow, API/model usage scales, or a launch will materially increase volume.

## Inputs
Traffic profile, execution traces, latency percentiles, queue metrics, API/model pricing, quotas, compute limits, and business SLA.

## Context to inspect
Inspect per-step duration, network calls, serial versus parallel work, payload sizes, polling, retries, batching, AI token usage, database queries, and dependency quotas.

## Core knowledge
End-to-end latency is shaped by critical-path work, queueing, and tail behavior. Optimization should target measured bottlenecks. Cost is often dominated by external calls, repeated processing, model usage, polling, and retained execution data.

## Procedure
1. Define throughput, latency, freshness, and cost targets.
2. Measure baseline p50/p95/p99 duration and per-step contribution.
3. Separate queue delay from execution time.
4. Quantify external API/model calls per business transaction.
5. Identify serial dependencies that can safely run concurrently.
6. Remove redundant calls and repeated transformations.
7. Batch operations when contracts and failure isolation allow.
8. Apply caching only with explicit freshness/invalidation rules.
9. Tune concurrency against quotas and downstream saturation.
10. Reduce AI context/output size without compromising quality.
11. Estimate peak capacity and headroom.
12. Re-measure after each meaningful change.

## Decision points
Optimize latency when it affects user/business deadlines; optimize throughput for backlog workloads. Batch when fixed per-call overhead dominates. Cache stable reads but not authoritative rapidly changing state without a freshness contract.

## Common failure patterns
Optimizing averages instead of tails, uncontrolled parallelism, hidden retry cost, chatty APIs, polling where events exist, and sacrificing correctness for small latency gains.

## Verification
Run representative load tests and compare measured throughput, latency, dependency saturation, error rate, and unit cost to baseline and targets.

## Expected output
A measured performance/cost profile with bottlenecks, capacity limits, optimizations, trade-offs, and post-change evidence.

## Stop conditions
Stop when load testing could harm production dependencies, source metrics are unreliable, or optimization would violate correctness/security requirements.