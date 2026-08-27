# Performance and Capacity Planning

## Purpose
Measure and size gateway capacity so policy processing, connections, and upstream behavior meet latency and throughput targets.

## When to use
Use before traffic growth, major policy additions, platform migration, or during latency/saturation investigation.

## Inputs
Traffic profiles, latency SLOs, concurrency, payload sizes, protocol mix, compute/network limits.

## Context to inspect
CPU, memory, connection pools, event loops/threads, TLS cost, plugin chain, upstream latency, GC/runtime behavior, autoscaling signals.

## Core knowledge
Gateway capacity depends on requests per second, concurrent connections, payload throughput, TLS handshakes, policy cost, upstream waits, and tail latency. Average utilization alone is insufficient.

## Procedure
1. Build representative traffic profiles by route and protocol.
2. Establish baseline throughput and latency without new policy.
3. Add policies incrementally and measure marginal cost.
4. Identify CPU, memory, connection, network, and upstream bottlenecks.
5. Determine safe per-instance operating range before tail latency degrades.
6. Configure scaling signals with startup and drain time considered.
7. Reserve headroom for failures and traffic bursts.
8. Repeat tests with realistic TLS, logging, and observability enabled.

## Decision points
Scale up when single-instance efficiency is the constraint; scale out for resilience and parallel capacity. Optimize only after evidence identifies the bottleneck.

## Common failure patterns
Benchmarking trivial payloads only, ignoring p99, disabling production plugins during tests, autoscaling on CPU alone, exhausting upstream connections.

## Verification
Load, soak, burst, and degraded-upstream tests meet defined SLOs with documented headroom.

## Expected output
A measured capacity model, bottleneck evidence, and scaling thresholds.

## Stop conditions
Escalate if production-like traffic characteristics cannot be reproduced.