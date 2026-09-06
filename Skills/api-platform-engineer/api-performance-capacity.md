# API Performance and Capacity

## Purpose
Diagnose API bottlenecks and plan capacity using measured workload behavior.

## When to use
Use for latency regressions, scale planning, gateway sizing, or launch readiness.

## Inputs
Traffic forecasts, latency metrics, profiles, dependency timings, resource utilization, load-test results.

## Context to inspect
Inspect request mix, payload sizes, concurrency, connection pools, gateway overhead, downstream latency, and autoscaling behavior.

## Core knowledge
Throughput, concurrency, service time, queueing, and tail latency interact. CPU utilization alone does not describe capacity. Performance work requires baseline measurements and controlled comparisons.

## Procedure
1. Define workload and latency objectives.
2. Establish production baseline by route and request class.
3. Decompose end-to-end latency across gateway and dependencies.
4. Identify saturation indicators and queueing.
5. Profile suspected bottlenecks.
6. Test representative payloads and concurrency.
7. Optimize the dominant constraint rather than incidental code.
8. Re-run controlled load tests.
9. Establish safe operating headroom and autoscaling thresholds.
10. Document capacity assumptions and revalidation triggers.

## Decision points
Scale out when work parallelizes and shared dependencies can absorb load; optimize first when a bottleneck scales poorly or cost grows disproportionately.

## Common failure patterns
Average-latency focus, unrealistic load tests, coordinated omission, optimizing without baselines, and ignoring downstream capacity.

## Verification
Compare before/after p50/p95/p99 latency, throughput, errors, saturation, and cost under equivalent workloads.

## Expected output
Measured performance improvements and defensible capacity limits.

## Stop conditions
Stop if workload representation or production-safe testing constraints make conclusions unreliable.