# Performance and Scaling Strategy

## Purpose
Guide cross-system performance and scalability decisions using measured bottlenecks, workload growth, and cost constraints rather than intuition.

## When to use
Use when capacity limits approach, latency degrades across services, traffic growth changes architecture assumptions, or scaling work spans teams.

## Inputs
Latency percentiles, throughput, resource utilization, workload forecasts, profiles, query plans, dependency latency, infrastructure cost.

## Preconditions
Representative workload data and target SLOs exist.

## Context to inspect
Hot paths, fan-out, database access, caches, queues, resource saturation, autoscaling behavior, payload sizes, concurrency limits, and cost trends.

## Core knowledge
Performance is end-to-end. Queueing, contention, amplification, data access, serialization, network hops, and tail latency often dominate. Scale-up, scale-out, partitioning, caching, and architectural simplification have different operating costs.

## Procedure
1. Define user-facing performance targets.
2. Establish current workload and growth assumptions.
3. Measure end-to-end latency and saturation.
4. Profile dominant bottlenecks.
5. Quantify amplification across dependencies.
6. Generate optimization and scaling alternatives.
7. Compare complexity, cost, headroom, and failure impact.
8. Implement the smallest high-leverage change first.
9. Benchmark under representative load.
10. Update capacity thresholds and forecasts.

## Decision points
Optimize code only after locating a material bottleneck. Cache when reuse and staleness constraints justify it. Partition when a real scaling boundary is reached, not preemptively.

## Common failure patterns
Average-latency optimization, synthetic-only benchmarks, premature sharding, ignoring cost, scaling a downstream bottleneck, and unbounded concurrency.

## Verification
Verify improvement with before/after measurements at relevant percentiles and load levels, including cost and resource headroom.

## Expected output
A measured scaling plan with bottlenecks, options, chosen interventions, benchmarks, and capacity thresholds.

## Stop conditions
Stop when workload data is not representative or optimization would compromise correctness, reliability, or security without explicit approval.